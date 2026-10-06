from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, Booking, Review, Service, BarberProfile

class CustomerRegisterForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=True)

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'first_name', 'last_name', 'email', 'phone')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'customer'
        if commit:
            user.save()
        return user


class BarberRegisterForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=20, required=True)
    experience_years = forms.IntegerField(min_value=1, initial=5)
    bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 3}))

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ('username', 'first_name', 'last_name', 'email', 'phone')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = 'barber'
        if commit:
            user.save()
            BarberProfile.objects.create(
                user=user,
                name=f"{user.first_name} {user.last_name}",
                experience_years=self.cleaned_data['experience_years'],
                bio=self.cleaned_data['bio'],
                phone=self.cleaned_data['phone'],
                rating=5.0
            )
        return user


class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['barber', 'service', 'booking_date', 'booking_time', 'notes']
        widgets = {
            'booking_date': forms.DateInput(attrs={'type': 'date', 'class': 'w-full p-2.5 border rounded-lg'}),
            'booking_time': forms.TextInput(attrs={'class': 'w-full p-2.5 border rounded-lg', 'placeholder': '09:00'}),
            'notes': forms.Textarea(attrs={'rows': 2, 'class': 'w-full p-2.5 border rounded-lg', 'placeholder': 'Optional styling instructions...'}),
            'barber': forms.Select(attrs={'class': 'w-full p-2.5 border rounded-lg'}),
            'service': forms.Select(attrs={'class': 'w-full p-2.5 border rounded-lg'}),
        }


class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(choices=[(i, f"{i} Stars") for i in range(5, 0, -1)], attrs={'class': 'w-full p-2.5 border rounded-lg'}),
            'comment': forms.Textarea(attrs={'rows': 3, 'class': 'w-full p-2.5 border rounded-lg', 'placeholder': 'Share your experience with this master barber...'}),
        }


class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = ['name', 'description', 'price', 'duration', 'image', 'is_active']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'w-full p-2 border rounded'}),
            'description': forms.Textarea(attrs={'rows': 2, 'class': 'w-full p-2 border rounded'}),
            'price': forms.NumberInput(attrs={'class': 'w-full p-2 border rounded', 'placeholder': 'Rs. 350'}),
            'duration': forms.NumberInput(attrs={'class': 'w-full p-2 border rounded', 'placeholder': '30'}),
            'image': forms.URLInput(attrs={'class': 'w-full p-2 border rounded'}),
        }
