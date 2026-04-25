
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Avg
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from datetime import datetime, timedelta, date
from .models import CustomUser, Barber, Service, Booking, Review, Gallery, Offer, BarberLocation
from .forms import (
    UserLoginForm, AdminLoginForm, CustomUserCreationForm,
    BarberForm, ServiceForm, BookingForm, BookingStatusForm, ReviewForm,
    PasswordResetForm, SetNewPasswordForm, GalleryForm, OfferForm, BarberLocationForm
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


# ============================================
# PASSWORD RESET VIEWS
# ============================================

@require_http_methods(["GET", "POST"])
def forgot_password(request):
    """
    View for requesting password reset.
    Sends password reset token to user's email.
    """
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            user = CustomUser.objects.get(email=email)
            
            # Generate token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Store token in session for retrieval (for development)
            request.session[f'reset_token_{user.pk}'] = token
            
            messages.success(request, f'Password reset link has been sent to {email}. Please check your email (or see console for development).')
            return redirect('password_reset_sent')
    else:
        form = PasswordResetForm()
    
    context = {'form': form}
    return render(request, 'shared/forgot_password.html', context)


@require_http_methods(["GET"])
def password_reset_sent(request):
    """
    Confirmation page that password reset email has been sent.
    """
    context = {}
    return render(request, 'shared/password_reset_sent.html', context)


@require_http_methods(["GET", "POST"])
def reset_password(request, uidb64, token):
    """
    View for resetting password with token.
    """
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None
    
    if user is not None and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            form = SetNewPasswordForm(request.POST)
            if form.is_valid():
                password = form.cleaned_data['password1']
                user.set_password(password)
                user.save()
                
                # Clear the token from session
                if f'reset_token_{user.pk}' in request.session:
                    del request.session[f'reset_token_{user.pk}']
                
                messages.success(request, 'Your password has been reset successfully! Please login with your new password.')
                return redirect('user_login')
        else:
            form = SetNewPasswordForm()
        
        context = {'form': form, 'user': user}
        return render(request, 'shared/reset_password.html', context)
    else:
        messages.error(request, 'Invalid password reset link. Please request a new one.')
        return redirect('forgot_password')


# ============================================
# ADMIN PASSWORD RESET VIEWS
# ============================================

@require_http_methods(["GET", "POST"])
def admin_forgot_password(request):
    """
    View for admin to request password reset.
    Sends password reset token to admin's email.
    """
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            user = CustomUser.objects.get(email=email)
            
            # Check if user is admin
            if not user.is_admin():
                messages.error(request, 'This email is not associated with an admin account.')
                return render(request, 'shared/admin_forgot_password.html', {'form': form})
            
            # Generate token
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # Store token in session for retrieval
            request.session[f'admin_reset_token_{user.pk}'] = token
            
            messages.success(request, f'Password reset link has been sent to {email}. Please check your email (or see console for development).')
            return redirect('admin_password_reset_sent')
    else:
        form = PasswordResetForm()
    
    context = {'form': form}
    return render(request, 'shared/admin_forgot_password.html', context)


@require_http_methods(["GET"])
def admin_password_reset_sent(request):
    """
    Confirmation page that admin password reset email has been sent.
    """
    context = {}
    return render(request, 'shared/admin_password_reset_sent.html', context)


@require_http_methods(["GET", "POST"])
def admin_reset_password(request, uidb64, token):
    """
    View for admin to reset password with token.
    """
    if request.user.is_authenticated:
        if request.user.is_admin():
            return redirect('admin_dashboard')
        return redirect('user_dashboard')
    
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = CustomUser.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, CustomUser.DoesNotExist):
        user = None
    
    if user is not None and user.is_admin() and default_token_generator.check_token(user, token):
        if request.method == 'POST':
            form = SetNewPasswordForm(request.POST)
            if form.is_valid():
                password = form.cleaned_data['password1']
                user.set_password(password)
                user.save()
                
                # Clear the token from session
                if f'admin_reset_token_{user.pk}' in request.session:
                    del request.session[f'admin_reset_token_{user.pk}']
                
                messages.success(request, 'Your password has been reset successfully! Please login with your new password.')
                return redirect('admin_login')
        else:
            form = SetNewPasswordForm()
        
        context = {'form': form, 'user': user}
        return render(request, 'shared/admin_reset_password.html', context)
    else:
        messages.error(request, 'Invalid password reset link. Please request a new one.')
        return redirect('admin_forgot_password')


# ============================================
# GALLERY & OFFERS VIEWS
# ============================================

def gallery(request):
    """
    Display gallery page with all barber portfolio images.
    """
    barber_filter = request.GET.get('barber', '')
    gallery_images = Gallery.objects.select_related('barber').filter(is_featured=True).order_by('-created_at')
    
    if barber_filter:
        gallery_images = gallery_images.filter(barber_id=barber_filter)
    
    barbers = Barber.objects.filter(gallery_images__isnull=False).distinct()
    
    context = {
        'gallery_images': gallery_images,
        'barbers': barbers,
        'barber_filter': barber_filter,
    }
    return render(request, 'shared/gallery.html', context)


def offers(request):
    """
    Display offers and promotions page.
    """
    today = date.today()
    offers_list = Offer.objects.filter(
        is_active=True,
        start_date__lte=today,
        end_date__gte=today
    ).order_by('-start_date')
    
    barber_filter = request.GET.get('barber', '')
    service_filter = request.GET.get('service', '')
    offer_type_filter = request.GET.get('type', '')
    
    if barber_filter:
        offers_list = offers_list.filter(Q(applicable_barber_id=barber_filter) | Q(applicable_barber__isnull=True))
    
    if service_filter:
        offers_list = offers_list.filter(Q(applicable_service_id=service_filter) | Q(applicable_service__isnull=True))
    
    if offer_type_filter:
        offers_list = offers_list.filter(offer_type=offer_type_filter)
    
    barbers = Barber.objects.filter(offers__isnull=False).distinct()
    services = Service.objects.filter(offers__isnull=False).distinct()
    offer_types = Offer.OFFER_TYPE_CHOICES
    
    context = {
        'offers': offers_list,
        'barbers': barbers,
        'services': services,
        'offer_types': offer_types,
        'barber_filter': barber_filter,
        'service_filter': service_filter,
        'offer_type_filter': offer_type_filter,
    }
    return render(request, 'shared/offers.html', context)


def barber_gallery(request, pk):
    """
    Display gallery for a specific barber.
    """
    barber = get_object_or_404(Barber, pk=pk)
    gallery_images = Gallery.objects.filter(barber=barber).order_by('-created_at')
    
    context = {
        'barber': barber,
        'gallery_images': gallery_images,
    }
    return render(request, 'user/barber_gallery.html', context)


def barber_location(request, pk):
    """
    Display barber location with Google Maps integration.
    """
    barber = get_object_or_404(Barber, pk=pk)
    try:
        location = BarberLocation.objects.get(barber=barber)
    except BarberLocation.DoesNotExist:
        location = None
    
    context = {
        'barber': barber,
        'location': location,
    }
    return render(request, 'user/barber_location.html', context)


@admin_required
def admin_gallery_list(request):
    """
    Admin view for managing gallery images.
    """
    search_query = request.GET.get('search', '')
    barber_filter = request.GET.get('barber', '')
    
    gallery_images = Gallery.objects.select_related('barber')
    
    if search_query:
        gallery_images = gallery_images.filter(Q(title__icontains=search_query) | Q(barber__name__icontains=search_query))
    
    if barber_filter:
        gallery_images = gallery_images.filter(barber_id=barber_filter)
    
    barbers = Barber.objects.all()
    
    context = {
        'gallery_images': gallery_images,
        'barbers': barbers,
        'search_query': search_query,
        'barber_filter': barber_filter,
    }
    return render(request, 'admin/gallery_list.html', context)


@admin_required
def admin_gallery_create(request, barber_id):
    """
    Admin view to upload gallery image for a barber.
    """
    barber = get_object_or_404(Barber, pk=barber_id)
    
    if request.method == 'POST':
        form = GalleryForm(request.POST, request.FILES)
        if form.is_valid():
            gallery = form.save(commit=False)
            gallery.barber = barber
            gallery.save()
            messages.success(request, 'Gallery image added successfully!')
            return redirect('admin_gallery_list')
    else:
        form = GalleryForm()
    
    context = {'form': form, 'barber': barber}
    return render(request, 'admin/gallery_form.html', context)


@admin_required
def admin_gallery_edit(request, pk):
    """
    Admin view to edit gallery image.
    """
    gallery = get_object_or_404(Gallery, pk=pk)
    
    if request.method == 'POST':
        form = GalleryForm(request.POST, request.FILES, instance=gallery)
        if form.is_valid():
            form.save()
            messages.success(request, 'Gallery image updated successfully!')
            return redirect('admin_gallery_list')
    else:
        form = GalleryForm(instance=gallery)
    
    context = {'form': form, 'gallery': gallery, 'is_edit': True}
    return render(request, 'admin/gallery_form.html', context)


@admin_required
def admin_gallery_delete(request, pk):
    """
    Admin view to delete gallery image.
    """
    gallery = get_object_or_404(Gallery, pk=pk)
    
    if request.method == 'POST':
        gallery.delete()
        messages.success(request, 'Gallery image deleted successfully!')
        return redirect('admin_gallery_list')
    
    context = {'gallery': gallery}
    return render(request, 'admin/gallery_confirm_delete.html', context)


@admin_required
def admin_offers_list(request):
    """
    Admin view for managing offers.
    """
    search_query = request.GET.get('search', '')
    offers_list = Offer.objects.prefetch_related('applicable_barber', 'applicable_service')
    
    if search_query:
        offers_list = offers_list.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query))
    
    context = {
        'offers': offers_list,
        'search_query': search_query,
    }
    return render(request, 'admin/offers_list.html', context)


@admin_required
def admin_offers_create(request):
    """
    Admin view to create a new offer.
    """
    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Offer created successfully!')
            return redirect('admin_offers_list')
    else:
        form = OfferForm()
    
    context = {'form': form}
    return render(request, 'admin/offers_form.html', context)


@admin_required
def admin_offers_edit(request, pk):
    """
    Admin view to edit an offer.
    """
    offer = get_object_or_404(Offer, pk=pk)
    
    if request.method == 'POST':
        form = OfferForm(request.POST, request.FILES, instance=offer)
        if form.is_valid():
            form.save()
            messages.success(request, 'Offer updated successfully!')
            return redirect('admin_offers_list')
    else:
        form = OfferForm(instance=offer)
    
    context = {'form': form, 'offer': offer, 'is_edit': True}
    return render(request, 'admin/offers_form.html', context)


@admin_required
def admin_offers_delete(request, pk):
    """
    Admin view to delete an offer.
    """
    offer = get_object_or_404(Offer, pk=pk)
    
    if request.method == 'POST':
        offer.delete()
        messages.success(request, 'Offer deleted successfully!')
        return redirect('admin_offers_list')
    
    context = {'offer': offer}
    return render(request, 'admin/offers_confirm_delete.html', context)


@admin_required
def admin_barber_location(request, barber_id):
    """
    Admin view to manage barber location and business hours.
    """
    barber = get_object_or_404(Barber, pk=barber_id)
    location, created = BarberLocation.objects.get_or_create(barber=barber)
    
    if request.method == 'POST':
        form = BarberLocationForm(request.POST, instance=location)
        if form.is_valid():
            form.save()
            messages.success(request, 'Location updated successfully!')
            return redirect('admin_barber_list')
    else:
        form = BarberLocationForm(instance=location)
    
    context = {'form': form, 'barber': barber, 'location': location}
    return render(request, 'admin/barber_location_form.html', context)
