from django import forms
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import CustomUser, Barber, Service, Booking, Review, Gallery, Offer, BarberLocation
from datetime import datetime, timedelta


class CustomUserCreationForm(forms.ModelForm):
    password1 = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text='Password must be at least 8 characters long.'
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={'class': 'form-control'}),
        help_text='Enter the same password as before.'
    )
    
    class Meta:
        model = CustomUser
        fields = ('username', 'first_name', 'last_name', 'email', 'phone', 'dateofbirth', 'address')
        widgets = {
            'username': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Username'
            }),
            'first_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'First Name'
            }),
            'last_name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Last Name'
            }),
            'email': forms.EmailInput(attrs={
                'class': 'form-control',
                'placeholder': 'Email Address'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Phone Number'
            }),
            'dateofbirth': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'address': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Address'
            }),
        }
    
    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError('Passwords do not match.')
        return password2
    
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            raise ValidationError('Username already taken.')
        return username
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password1'])
        user.role = 'user'
        if commit:
            user.save()
        return user


class UserLoginForm(forms.Form):
    username = forms.CharField(
        label='Username',
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your username'
        })
    )
    password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password'
        })
    )
    
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                raise ValidationError('Invalid username or password.')
            elif not user.is_active:
                raise ValidationError('This account is inactive.')
            elif not user.is_regular_user():
                raise ValidationError('This account is not a regular user account.')
        
        return cleaned_data


class AdminLoginForm(forms.Form):
    username = forms.CharField(
        label='Username',
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your username'
        })
    )
    password = forms.CharField(
        label='Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password'
        })
    )
    
    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if user is None:
                raise ValidationError('Invalid username or password.')
            elif not user.is_active:
                raise ValidationError('This account is inactive.')
            elif not user.is_admin():
                raise ValidationError('This account is not an administrator account.')
        
        return cleaned_data


class BarberForm(forms.ModelForm):
    services = forms.ModelMultipleChoiceField(
        queryset=Service.objects.filter(is_active=True),
        widget=forms.CheckboxSelectMultiple,
        help_text='Select services offered by this barber'
    )
    
    class Meta:
        model = Barber
        fields = ('name', 'experience', 'bio', 'photo', 'services', 'phone', 'is_available')
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Barber Name'
            }),
            'experience': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Years of Experience'
            }),
            'bio': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Barber Biography'
            }),
            'photo': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'phone': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Phone Number'
            }),
            'is_available': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }


class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ('name', 'description', 'price', 'duration', 'image', 'is_active')
        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Service Name'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Service Description'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Price',
                'step': '0.01'
            }),
            'duration': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Duration (minutes)'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }


class BookingForm(forms.ModelForm):
    """
    Form for users to book appointments with barbers.
    """
    barber = forms.ModelChoiceField(
        queryset=Barber.objects.filter(is_available=True),
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Select Barber'
    )
    service = forms.ModelChoiceField(
        queryset=Service.objects.filter(is_active=True),
        widget=forms.Select(attrs={'class': 'form-control'}),
        label='Select Service'
    )
    booking_date = forms.DateField(
        widget=forms.DateInput(attrs={
            'class': 'form-control',
            'type': 'date'
        }),
        label='Appointment Date'
    )
    booking_time = forms.TimeField(
        widget=forms.TimeInput(attrs={
            'class': 'form-control',
            'type': 'time'
        }),
        label='Appointment Time'
    )
    
    class Meta:
        model = Booking
        fields = ('barber', 'service', 'booking_date', 'booking_time', 'notes')
        widgets = {
            'notes': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Any special requests or notes?'
            }),
        }
    
    def clean_booking_date(self):
        """Validate that booking date is in the future"""
        booking_date = self.cleaned_data.get('booking_date')
        if booking_date and booking_date < datetime.now().date():
            raise ValidationError('Booking date must be in the future.')
        return booking_date
    
    def clean(self):
        """Validate that the time slot is not already booked"""
        cleaned_data = super().clean()
        barber = cleaned_data.get('barber')
        booking_date = cleaned_data.get('booking_date')
        booking_time = cleaned_data.get('booking_time')
        
        if barber and booking_date and booking_time:
            existing_booking = Booking.objects.filter(
                barber=barber,
                booking_date=booking_date,
                booking_time=booking_time,
                status__in=['pending', 'confirmed']
            ).exists()
            if existing_booking:
                raise ValidationError('This time slot is already booked. Please choose another time.')
        
        return cleaned_data


class BookingStatusForm(forms.ModelForm):
    """
    Form for admin to update booking status.
    """
    class Meta:
        model = Booking
        fields = ('status', 'notes')
        widgets = {
            'status': forms.Select(attrs={'class': 'form-control'}),
            'notes': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3
            }),
        }


class ReviewForm(forms.ModelForm):
    """
    Form for users to leave reviews for barbers.
    """
    class Meta:
        model = Review
        fields = ('rating', 'comment')
        widgets = {
            'rating': forms.RadioSelect(choices=Review.RATING_CHOICES),
            'comment': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 4,
                'placeholder': 'Share your experience with this barber...'
            }),
        }


class PasswordResetForm(forms.Form):
    """
    Form for requesting password reset via email
    """
    email = forms.EmailField(
        label='Email Address',
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your registered email address'
        })
    )
    
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if email and not CustomUser.objects.filter(email=email).exists():
            raise ValidationError('No account found with this email address.')
        return email


class SetNewPasswordForm(forms.Form):
    """
    Form for setting a new password during password reset
    """
    password1 = forms.CharField(
        label='New Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter new password'
        }),
        help_text='Password must be at least 8 characters long.'
    )
    password2 = forms.CharField(
        label='Confirm Password',
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Confirm your new password'
        })
    )
    
    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        if password1 and len(password1) < 8:
            raise ValidationError('Password must be at least 8 characters long.')
        return password1
    
    def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise ValidationError('Passwords do not match.')
        return cleaned_data


class GalleryForm(forms.ModelForm):
    """
    Form for uploading gallery images
    """
    class Meta:
        model = Gallery
        fields = ('title', 'image', 'description', 'is_featured')
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Image title (e.g., Fade Haircut)'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe this work...'
            }),
            'is_featured': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }


class OfferForm(forms.ModelForm):
    """
    Form for creating and managing offers
    """
    class Meta:
        model = Offer
        fields = ('title', 'description', 'offer_type', 'discount_percent', 'discount_amount',
                  'applicable_service', 'applicable_barber', 'image', 'start_date', 'end_date', 'is_active')
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Offer title'
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 3,
                'placeholder': 'Describe the offer...'
            }),
            'offer_type': forms.Select(attrs={
                'class': 'form-control'
            }),
            'discount_percent': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Discount percentage (0-100)',
                'min': '0',
                'max': '100'
            }),
            'discount_amount': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Fixed discount amount',
                'step': '0.01'
            }),
            'applicable_service': forms.Select(attrs={
                'class': 'form-control'
            }),
            'applicable_barber': forms.Select(attrs={
                'class': 'form-control'
            }),
            'image': forms.FileInput(attrs={
                'class': 'form-control'
            }),
            'start_date': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'end_date': forms.DateInput(attrs={
                'class': 'form-control',
                'type': 'date'
            }),
            'is_active': forms.CheckboxInput(attrs={
                'class': 'form-check-input'
            }),
        }
    
    def clean(self):
        cleaned_data = super().clean()
        discount_percent = cleaned_data.get('discount_percent', 0)
        discount_amount = cleaned_data.get('discount_amount', 0)
        
        if discount_percent == 0 and discount_amount == 0:
            raise ValidationError('Please enter either a discount percentage or amount.')
        
        start_date = cleaned_data.get('start_date')
        end_date = cleaned_data.get('end_date')
        
        if start_date and end_date and start_date > end_date:
            raise ValidationError('Start date must be before end date.')
        
        return cleaned_data


class BarberLocationForm(forms.ModelForm):
    """
    Form for setting barber location with map integration
    """
    class Meta:
        model = BarberLocation
        fields = ('address', 'latitude', 'longitude', 'google_maps_url', 'opening_time', 'closing_time', 'whatsapp_number')
        widgets = {
            'address': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Full address'
            }),
            'latitude': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Latitude',
                'step': '0.000001'
            }),
            'longitude': forms.NumberInput(attrs={
                'class': 'form-control',
                'placeholder': 'Longitude',
                'step': '0.000001'
            }),
            'google_maps_url': forms.URLInput(attrs={
                'class': 'form-control',
                'placeholder': 'Google Maps URL'
            }),
            'opening_time': forms.TimeInput(attrs={
                'class': 'form-control',
                'type': 'time'
            }),
            'closing_time': forms.TimeInput(attrs={
                'class': 'form-control',
                'type': 'time'
            }),
            'whatsapp_number': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'WhatsApp number (e.g., +1234567890)'
            }),
        }
