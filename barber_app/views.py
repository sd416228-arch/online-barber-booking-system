from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.db.models import Sum, Count
from datetime import datetime, date

from .models import (
    CustomUser, Service, BarberProfile, Booking,
    Review, Offer, BarberSchedule, GalleryItem, BarberLocation
)
from .forms import CustomerRegisterForm, BarberRegisterForm, BookingForm, ReviewForm, ServiceForm

# ----------------------------------------------------
# PUBLIC VIEWS
# ----------------------------------------------------

def home_view(request):
    services = Service.objects.filter(is_active=True)[:4]
    barbers = BarberProfile.objects.filter(is_available=True)[:4]
    offers = Offer.objects.filter(is_active=True)[:3]
    stats = {
        'total_barbers': BarberProfile.objects.count(),
        'total_services': Service.objects.filter(is_active=True).count(),
        'completed_bookings': Booking.objects.filter(status='completed').count(),
        'avg_rating': '4.9',
    }
    return render(request, 'barber_app/home.html', {
        'services': services,
        'barbers': barbers,
        'offers': offers,
        'stats': stats,
    })


def barbers_view(request):
    query = request.GET.get('q', '')
    barbers = BarberProfile.objects.all()
    if query:
        barbers = barbers.filter(name__icontains=query)
    return render(request, 'barber_app/barbers.html', {'barbers': barbers, 'query': query})


def barber_detail_view(request, barber_id):
    barber = get_object_or_404(BarberProfile, id=barber_id)
    reviews = barber.reviews.all().order_by('-created_at')
    services = barber.services.filter(is_active=True)
    review_form = ReviewForm()

    if request.method == 'POST' and request.user.is_authenticated:
        review_form = ReviewForm(request.POST)
        if review_form.is_valid():
            rev = review_form.save(commit=False)
            rev.user = request.user
            rev.barber = barber
            rev.save()
            messages.success(request, "Review submitted successfully!")
            return redirect('barber_detail', barber_id=barber.id)

    return render(request, 'barber_app/barber_detail.html', {
        'barber': barber,
        'reviews': reviews,
        'services': services,
        'review_form': review_form,
    })


def services_view(request):
    services = Service.objects.filter(is_active=True)
    return render(request, 'barber_app/services.html', {'services': services})


def gallery_view(request):
    category = request.GET.get('cat', 'all')
    items = GalleryItem.objects.all()
    if category != 'all':
        items = items.filter(category=category)
    return render(request, 'barber_app/gallery.html', {'gallery_items': items, 'selected_cat': category})


def offers_view(request):
    offers = Offer.objects.filter(is_active=True)
    return render(request, 'barber_app/offers.html', {'offers': offers})


def locations_view(request):
    locations = BarberLocation.objects.all()
    return render(request, 'barber_app/locations.html', {'locations': locations})


# ----------------------------------------------------
# BOOKING FLOW
# ----------------------------------------------------

@login_required
def booking_view(request):
    preselected_barber_id = request.GET.get('barber')
    preselected_service_id = request.GET.get('service')

    barbers = BarberProfile.objects.filter(is_available=True)
    services = Service.objects.filter(is_active=True)

    if request.method == 'POST':
        barber_id = request.POST.get('barber')
        service_id = request.POST.get('service')
        booking_date = request.POST.get('booking_date')
        booking_time = request.POST.get('booking_time')
        notes = request.POST.get('notes', '')
        promo_code = request.POST.get('promo_code', '').strip()

        barber = get_object_or_404(BarberProfile, id=barber_id)
        service = get_object_or_404(Service, id=service_id)

        # Price calculation in Nepali Rupees
        price = float(service.price)
        if promo_code:
            offer = Offer.objects.filter(code__iexact=promo_code, is_active=True).first()
            if offer:
                discount = (price * offer.discount_percentage) / 100.0
                price = max(0.0, price - discount)

        booking = Booking.objects.create(
            user=request.user,
            barber=barber,
            service=service,
            booking_date=booking_date,
            booking_time=booking_time,
            total_price=price,
            notes=notes,
            status='confirmed'
        )
        messages.success(request, f"Appointment confirmed with {barber.name} for Rs. {price:.0f}!")
        return redirect('client_dashboard')

    return render(request, 'barber_app/booking.html', {
        'barbers': barbers,
        'services': services,
        'preselected_barber_id': preselected_barber_id,
        'preselected_service_id': preselected_service_id,
        'today': date.today().isoformat(),
    })


@login_required
def booking_cancel_view(request, booking_id):
    booking = get_object_or_404(Booking, id=booking_id)
    if booking.user == request.user or request.user.is_shop_admin() or (hasattr(request.user, 'barber_profile') and booking.barber == request.user.barber_profile):
        booking.status = 'cancelled'
        booking.save()
        messages.info(request, f"Appointment #{booking.id} has been cancelled.")
    return redirect('client_dashboard')


# ----------------------------------------------------
# DASHBOARDS (3 ROLES)
# ----------------------------------------------------

@login_required
def client_dashboard_view(request):
    bookings = Booking.objects.filter(user=request.user).order_by('-booking_date', '-booking_time')
    return render(request, 'barber_app/client_dashboard.html', {'bookings': bookings})


@login_required
def barber_dashboard_view(request):
    # Verify or fetch user's barber profile
    barber_profile = getattr(request.user, 'barber_profile', None)
    if not barber_profile:
        # Fallback to first barber for demo purposes
        barber_profile = BarberProfile.objects.first()

    today_str = date.today()
    todays_bookings = Booking.objects.filter(barber=barber_profile, booking_date=today_str)
    all_bookings = Booking.objects.filter(barber=barber_profile).order_by('-booking_date')

    todays_revenue = todays_bookings.filter(status__in=['confirmed', 'completed']).aggregate(Sum('total_price'))['total_price__sum'] or 0
    total_revenue = all_bookings.filter(status='completed').aggregate(Sum('total_price'))['total_price__sum'] or 0

    schedules = barber_profile.schedules.all()
    all_services = Service.objects.all()

    return render(request, 'barber_app/barber_dashboard.html', {
        'barber': barber_profile,
        'todays_bookings': todays_bookings,
        'all_bookings': all_bookings,
        'todays_revenue': todays_revenue,
        'total_revenue': total_revenue,
        'schedules': schedules,
        'all_services': all_services,
    })


@login_required
@require_POST
def barber_update_status_view(request, booking_id):
    barber_profile = getattr(request.user, 'barber_profile', None)
    booking = get_object_or_404(Booking, id=booking_id)
    new_status = request.POST.get('status')
    if new_status in ['confirmed', 'completed', 'cancelled']:
        booking.status = new_status
        booking.save()
        messages.success(request, f"Appointment #{booking.id} marked as {new_status}.")
    return redirect('barber_dashboard')


@login_required
def admin_dashboard_view(request):
    bookings = Booking.objects.all().order_by('-created_at')
    barbers = BarberProfile.objects.all()
    services = Service.objects.all()

    total_revenue = Booking.objects.filter(status__in=['confirmed', 'completed']).aggregate(Sum('total_price'))['total_price__sum'] or 0

    if request.method == 'POST' and 'create_service' in request.POST:
        form = ServiceForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "New service created successfully!")
            return redirect('admin_dashboard')

    return render(request, 'barber_app/admin_dashboard.html', {
        'bookings': bookings,
        'barbers': barbers,
        'services': services,
        'total_revenue': total_revenue,
        'service_form': ServiceForm(),
    })


@login_required
def admin_service_delete_view(request, service_id):
    if request.user.is_shop_admin() or request.user.role == 'admin':
        service = get_object_or_404(Service, id=service_id)
        service.delete()
        messages.success(request, "Service removed.")
    return redirect('admin_dashboard')


# ----------------------------------------------------
# AUTH & ONE-CLICK DEMO LOGIN (3 ROLES)
# ----------------------------------------------------

def quick_demo_login_view(request, role):
    """
    Allows 1-click instantaneous demo switching between:
    - 'user' / 'client' -> Alex Turner
    - 'barber'          -> Marcus Vance (Chair #1 Master Barber)
    - 'admin'           -> Admin Master
    """
    target_username = 'alex_client'
    redirect_target = 'client_dashboard'

    if role == 'barber':
        target_username = 'marcus_barber'
        redirect_target = 'barber_dashboard'
    elif role == 'admin':
        target_username = 'admin'
        redirect_target = 'admin_dashboard'

    user = CustomUser.objects.filter(username=target_username).first()
    if not user:
        # Create on demand if not yet seeded
        if role == 'barber':
            user = CustomUser.objects.create_user(
                username='marcus_barber', email='marcus@barbershop.com', password='password123',
                first_name='Marcus', last_name='Vance', role='barber'
            )
            bp, _ = BarberProfile.objects.get_or_create(user=user, defaults={
                'name': 'Marcus "Fade Master" Vance', 'experience_years': 8, 'rating': 4.9, 'bio': 'Fade Master specialist.'
            })
        elif role == 'admin':
            user = CustomUser.objects.create_superuser(
                username='admin', email='admin@barbershop.com', password='password123',
                first_name='Admin', last_name='Master', role='admin'
            )
        else:
            user = CustomUser.objects.create_user(
                username='alex_client', email='alex@example.com', password='password123',
                first_name='Alex', last_name='Turner', role='customer'
            )

    login(request, user)
    messages.success(request, f"Logged in as {user.get_role_display()} ({user.get_full_name() or user.username}).")
    return redirect(redirect_target)


def auth_logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('home')


# ----------------------------------------------------
# REST API (FOR DYNAMIC SLOTS & FRONTEND)
# ----------------------------------------------------

def api_available_slots(request):
    """Calculates open booking slots mathematically for a barber on a given date."""
    barber_id = request.GET.get('barber_id')
    date_str = request.GET.get('date')

    all_slots = [
        "09:00", "09:45", "10:30", "11:15",
        "12:00", "13:30", "14:15", "15:00",
        "15:45", "16:30", "17:15", "18:00"
    ]

    if barber_id and date_str:
        booked_times = list(Booking.objects.filter(
            barber_id=barber_id,
            booking_date=date_str,
            status__in=['pending', 'confirmed']
        ).values_list('booking_time', flat=True))
        available = [t for t in all_slots if t not in booked_times]
    else:
        available = all_slots

    return JsonResponse({'slots': available})
