
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Avg
from datetime import datetime, timedelta
from .models import CustomUser, Barber, Service, Booking, Review
from .forms import (
    UserLoginForm, AdminLoginForm, CustomUserCreationForm,
    BarberForm, ServiceForm, BookingForm, BookingStatusForm, ReviewForm
)
from .decorators import user_required, admin_required



def index(request):
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        else:
            return redirect('user_dashboard')
    
    barbers = Barber.objects.filter(is_available=True).order_by('-rating')[:6]
    services = Service.objects.filter(is_active=True)
    
    context = {
        'barbers': barbers,
        'services': services,
        'total_barbers': Barber.objects.count(),
        'total_services': Service.objects.count(),
    }
    return render(request, 'shared/index.html', context)


def user_login(request):
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user is not None and user.is_regular_user():
                login(request, user)
                messages.success(request, f'Welcome back, {user.first_name or user.username}!')
                return redirect('user_dashboard')
    else:
        form = UserLoginForm()
    
    context = {'form': form}
    return render(request, 'shared/user_login.html', context)


def user_register(request):
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Account created successfully! Welcome!')
            return redirect('user_dashboard')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
    else:
        form = CustomUserCreationForm()
    
    context = {'form': form}
    return render(request, 'shared/user_register.html', context)


@require_http_methods(["GET", "POST"])
def admin_login(request):
    """
    Admin login view.
    Authenticates admin users and redirects to admin dashboard.
    """
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    if request.method == 'POST':
        form = AdminLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            
            if user is not None and user.is_admin():
                login(request, user)
                messages.success(request, f'Welcome, Administrator!')
                return redirect('admin_dashboard')
    else:
        form = AdminLoginForm()
    
    context = {'form': form}
    return render(request, 'shared/admin_login.html', context)


@require_http_methods(["GET"])
def logout_view(request):
    """
    Logout view.
    Logs out the current user and redirects to home page.
    """
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('index')


# ============================================
# ADMIN VIEWS
# ============================================

@admin_required
def admin_dashboard(request):
    """
    Admin dashboard displaying overview and statistics.
    """
    total_bookings = Booking.objects.count()
    pending_bookings = Booking.objects.filter(status='pending').count()
    total_barbers = Barber.objects.count()
    total_services = Service.objects.count()
    
    recent_bookings = Booking.objects.select_related('user', 'barber', 'service').order_by('-created_at')[:5]
    
    context = {
        'total_bookings': total_bookings,
        'pending_bookings': pending_bookings,
        'total_barbers': total_barbers,
        'total_services': total_services,
        'recent_bookings': recent_bookings,
    }
    return render(request, 'admin/dashboard.html', context)


# Barber Management Views
@admin_required
def admin_barber_list(request):
    """
    Display list of all barbers.
    """
    search_query = request.GET.get('search', '')
    barbers = Barber.objects.select_related('user').prefetch_related('services')
    
    if search_query:
        barbers = barbers.filter(
            Q(name__icontains=search_query) | 
            Q(user__email__icontains=search_query)
        )
    
    context = {
        'barbers': barbers,
        'search_query': search_query,
    }
    return render(request, 'admin/barber_list.html', context)


@admin_required
def admin_barber_create(request):
    """
    Create a new barber.
    """
    if request.method == 'POST':
        form = BarberForm(request.POST, request.FILES)
        if form.is_valid():
            barber = form.save(commit=False)
            # Create associated user
            user = CustomUser.objects.create_user(
                username=f"barber_{barber.name.lower().replace(' ', '_')}_{Barber.objects.count()}",
                email=request.POST.get('email', ''),
                role='admin'
            )
            barber.user = user
            barber.save()
            form.save_m2m()  # Save many-to-many relationships
            messages.success(request, 'Barber added successfully!')
            return redirect('admin_barber_list')
    else:
        form = BarberForm()
    
    context = {'form': form}
    return render(request, 'admin/barber_form.html', context)


@admin_required
def admin_barber_edit(request, pk):
    """
    Edit an existing barber.
    """
    barber = get_object_or_404(Barber, pk=pk)
    
    if request.method == 'POST':
        form = BarberForm(request.POST, request.FILES, instance=barber)
        if form.is_valid():
            form.save()
            messages.success(request, 'Barber updated successfully!')
            return redirect('admin_barber_list')
    else:
        form = BarberForm(instance=barber)
    
    context = {
        'form': form,
        'barber': barber,
        'is_edit': True,
    }
    return render(request, 'admin/barber_form.html', context)


@admin_required
def admin_barber_delete(request, pk):
    """
    Delete a barber.
    """
    barber = get_object_or_404(Barber, pk=pk)
    
    if request.method == 'POST':
        user = barber.user
        barber.delete()
        user.delete()
        messages.success(request, 'Barber deleted successfully!')
        return redirect('admin_barber_list')
    
    context = {'barber': barber}
    return render(request, 'admin/barber_confirm_delete.html', context)


# Service Management Views
@admin_required
def admin_service_list(request):
    """
    Display list of all services.
    """
    search_query = request.GET.get('search', '')
    services = Service.objects.all()
    
    if search_query:
        services = services.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    context = {
        'services': services,
        'search_query': search_query,
    }
    return render(request, 'admin/service_list.html', context)


@admin_required
def admin_service_create(request):
    """
    Create a new service.
    """
    if request.method == 'POST':
        form = ServiceForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Service added successfully!')
            return redirect('admin_service_list')
    else:
        form = ServiceForm()
    
    context = {'form': form}
    return render(request, 'admin/service_form.html', context)


@admin_required
def admin_service_edit(request, pk):
    """
    Edit an existing service.
    """
    service = get_object_or_404(Service, pk=pk)
    
    if request.method == 'POST':
        form = ServiceForm(request.POST, request.FILES, instance=service)
        if form.is_valid():
            form.save()
            messages.success(request, 'Service updated successfully!')
            return redirect('admin_service_list')
    else:
        form = ServiceForm(instance=service)
    
    context = {
        'form': form,
        'service': service,
        'is_edit': True,
    }
    return render(request, 'admin/service_form.html', context)


@admin_required
def admin_service_delete(request, pk):
    """
    Delete a service.
    """
    service = get_object_or_404(Service, pk=pk)
    
    if request.method == 'POST':
        service.delete()
        messages.success(request, 'Service deleted successfully!')
        return redirect('admin_service_list')
    
    context = {'service': service}
    return render(request, 'admin/service_confirm_delete.html', context)


# Booking Management Views
@admin_required
def admin_booking_list(request):
    """
    Display list of all bookings.
    """
    status_filter = request.GET.get('status', '')
    date_filter = request.GET.get('date', '')
    
    bookings = Booking.objects.select_related('user', 'barber', 'service').order_by('-booking_date', '-booking_time')
    
    if status_filter:
        bookings = bookings.filter(status=status_filter)
    
    if date_filter:
        bookings = bookings.filter(booking_date=date_filter)
    
    context = {
        'bookings': bookings,
        'status_filter': status_filter,
        'date_filter': date_filter,
        'statuses': Booking._meta.get_field('status').choices,
    }
    return render(request, 'admin/booking_list.html', context)


@admin_required
def admin_booking_detail(request, pk):
    """
    Display detail view of a single booking.
    """
    booking = get_object_or_404(Booking, pk=pk)
    
    context = {'booking': booking}
    return render(request, 'admin/booking_detail.html', context)


@admin_required
def admin_booking_update(request, pk):
    """
    Update booking status and notes.
    """
    booking = get_object_or_404(Booking, pk=pk)
    
    if request.method == 'POST':
        form = BookingStatusForm(request.POST, instance=booking)
        if form.is_valid():
            form.save()
            messages.success(request, 'Booking updated successfully!')
            return redirect('admin_booking_detail', pk=booking.pk)
    else:
        form = BookingStatusForm(instance=booking)
    
    context = {
        'form': form,
        'booking': booking,
    }
    return render(request, 'admin/booking_update.html', context)


@admin_required
def admin_booking_delete(request, pk):
    """
    Delete a booking.
    """
    booking = get_object_or_404(Booking, pk=pk)
    
    if request.method == 'POST':
        booking.delete()
        messages.success(request, 'Booking deleted successfully!')
        return redirect('admin_booking_list')
    
    context = {'booking': booking}
    return render(request, 'admin/booking_confirm_delete.html', context)


# ============================================
# USER VIEWS
# ============================================

@user_required
def user_dashboard(request):
    """
    User dashboard displaying user's bookings and quick stats.
    """
    user_bookings = Booking.objects.filter(user=request.user).select_related('barber', 'service').order_by('-booking_date')
    
    upcoming_bookings = user_bookings.filter(booking_date__gte=datetime.now().date())
    past_bookings = user_bookings.filter(booking_date__lt=datetime.now().date())
    
    context = {
        'total_bookings': user_bookings.count(),
        'upcoming_bookings': upcoming_bookings.count(),
        'past_bookings': past_bookings.count(),
        'recent_bookings': user_bookings[:5],
    }
    return render(request, 'user/dashboard.html', context)


@user_required
def user_barber_list(request):
    """
    Display list of available barbers for user to browse.
    """
    search_query = request.GET.get('search', '')
    service_filter = request.GET.get('service', '')
    
    barbers = Barber.objects.filter(is_available=True).prefetch_related('services').annotate(avg_rating=Avg('reviews__rating'))
    
    if search_query:
        barbers = barbers.filter(Q(name__icontains=search_query) | Q(bio__icontains=search_query))
    
    if service_filter:
        barbers = barbers.filter(services__id=service_filter).distinct()
    
    services = Service.objects.filter(is_active=True)
    
    context = {
        'barbers': barbers,
        'services': services,
        'search_query': search_query,
        'service_filter': service_filter,
    }
    return render(request, 'user/barber_list.html', context)


@user_required
def user_barber_detail(request, pk):
    """
    Display detailed information about a barber.
    """
    barber = get_object_or_404(Barber, pk=pk)
    reviews = barber.reviews.all().order_by('-created_at')
    services = barber.services.all()
    
    context = {
        'barber': barber,
        'reviews': reviews,
        'services': services,
        'avg_rating': Review.objects.filter(barber=barber).aggregate(Avg('rating'))['rating__avg'],
    }
    return render(request, 'user/barber_detail.html', context)


@user_required
def user_service_list(request):
    """
    Display list of available services.
    """
    search_query = request.GET.get('search', '')
    
    services = Service.objects.filter(is_active=True)
    
    if search_query:
        services = services.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    context = {
        'services': services,
        'search_query': search_query,
    }
    return render(request, 'user/service_list.html', context)


@user_required
def user_booking_create(request):
    """
    Allow user to create a new booking.
    """
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save(commit=False)
            booking.user = request.user
            booking.save()
            messages.success(request, 'Booking created successfully! Please wait for confirmation.')
            return redirect('user_booking_list')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{error}')
    else:
        form = BookingForm()
    
    context = {'form': form}
    return render(request, 'user/booking_form.html', context)


@user_required
def user_booking_list(request):
    """
    Display list of user's bookings.
    """
    status_filter = request.GET.get('status', '')
    
    bookings = Booking.objects.filter(user=request.user).select_related('barber', 'service').order_by('-booking_date')
    
    if status_filter:
        bookings = bookings.filter(status=status_filter)
    
    context = {
        'bookings': bookings,
        'status_filter': status_filter,
        'statuses': Booking._meta.get_field('status').choices,
    }
    return render(request, 'user/booking_list.html', context)


@user_required
def user_booking_detail(request, pk):
    """
    Display detail view of user's booking.
    """
    booking = get_object_or_404(Booking, user=request.user, pk=pk)
    can_review = booking.status == 'completed' and not booking.review
    
    context = {
        'booking': booking,
        'can_review': can_review,
    }
    return render(request, 'user/booking_detail.html', context)


@user_required
def user_booking_cancel(request, pk):
    """
    Allow user to cancel their booking.
    """
    booking = get_object_or_404(Booking, user=request.user, pk=pk)
    
    if not booking.can_be_cancelled():
        messages.error(request, 'This booking cannot be cancelled.')
        return redirect('user_booking_detail', pk=booking.pk)
    
    if request.method == 'POST':
        booking.status = 'cancelled'
        booking.save()
        messages.success(request, 'Booking cancelled successfully!')
        return redirect('user_booking_list')
    
    context = {'booking': booking}
    return render(request, 'user/booking_confirm_cancel.html', context)


@user_required
def user_booking_update(request, pk):
    """
    Allow user to update their booking (date/time/service).
    """
    booking = get_object_or_404(Booking, user=request.user, pk=pk)
    
    if not booking.can_be_cancelled():
        messages.error(request, 'This booking cannot be modified.')
        return redirect('user_booking_detail', pk=booking.pk)
    
    if request.method == 'POST':
        form = BookingForm(request.POST, instance=booking)
        if form.is_valid():
            form.save()
            messages.success(request, 'Booking updated successfully!')
            return redirect('user_booking_detail', pk=booking.pk)
    else:
        form = BookingForm(instance=booking)
    
    context = {
        'form': form,
        'booking': booking,
        'is_edit': True,
    }
    return render(request, 'user/booking_form.html', context)


@user_required
def user_add_review(request, booking_id):
    """
    Allow user to add a review for a completed booking.
    """
    booking = get_object_or_404(Booking, user=request.user, pk=booking_id)
    
    if booking.status != 'completed':
        messages.error(request, 'You can only review completed bookings.')
        return redirect('user_booking_detail', pk=booking.pk)
    
    if hasattr(booking, 'review'):
        messages.info(request, 'You have already reviewed this booking.')
        return redirect('user_booking_detail', pk=booking.pk)
    
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.user = request.user
            review.barber = booking.barber
            review.booking = booking
            review.save()
            messages.success(request, 'Review submitted successfully!')
            return redirect('user_booking_detail', pk=booking.pk)
    else:
        form = ReviewForm()
    
    context = {
        'form': form,
        'booking': booking,
    }
    return render(request, 'user/review_form.html', context)


@user_required
def user_profile(request):
    """
    Display user profile.
    """
    context = {'user': request.user}
    return render(request, 'user/profile.html', context)


@user_required
def user_profile_edit(request):
    """
    Allow user to edit their profile.
    """
    if request.method == 'POST':
        request.user.first_name = request.POST.get('first_name', request.user.first_name)
        request.user.last_name = request.POST.get('last_name', request.user.last_name)
        request.user.email = request.POST.get('email', request.user.email)
        request.user.phone = request.POST.get('phone', request.user.phone)
        request.user.address = request.POST.get('address', request.user.address)
        if request.POST.get('dateofbirth'):
            request.user.dateofbirth = request.POST.get('dateofbirth')
        request.user.save()
        messages.success(request, 'Profile updated successfully!')
        return redirect('user_profile')
    
    context = {'user': request.user}
    return render(request, 'user/profile_edit.html', context)
