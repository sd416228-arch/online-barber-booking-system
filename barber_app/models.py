from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Client / Customer'),
        ('barber', 'Master Barber'),
        ('admin', 'Administrator'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=25, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    profile_image = models.URLField(max_length=500, blank=True, null=True)

    def is_customer(self):
        return self.role == 'customer'

    def is_barber(self):
        return self.role == 'barber'

    def is_shop_admin(self):
        return self.role == 'admin' or self.is_superuser

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Service(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in Nepali Rupees (Rs.)")
    duration = models.PositiveIntegerField(help_text="Duration in minutes", default=30)
    image = models.URLField(max_length=500, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} - Rs. {self.price}"


class BarberProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='barber_profile')
    name = models.CharField(max_length=150)
    experience_years = models.PositiveIntegerField(default=5)
    bio = models.TextField()
    photo = models.URLField(max_length=500, blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    phone = models.CharField(max_length=25, blank=True, null=True)
    is_available = models.BooleanField(default=True)
    services = models.ManyToManyField(Service, related_name='barbers', blank=True)

    def __str__(self):
        return f"{self.name} ({self.experience_years} yrs exp)"


class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bookings')
    barber = models.ForeignKey(BarberProfile, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateField()
    booking_time = models.CharField(max_length=10, help_text="Time in HH:MM format e.g. 09:00")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total in Nepali Rupees (Rs.)")
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-booking_date', 'booking_time']

    def __str__(self):
        return f"Booking #{self.id}: {self.user.username} with {self.barber.name} on {self.booking_date} {self.booking_time}"


class Review(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')
    barber = models.ForeignKey(BarberProfile, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.user.username} for {self.barber.name} ({self.rating} stars)"


class Offer(models.Model):
    title = models.CharField(max_length=150)
    discount_percentage = models.PositiveIntegerField(default=15)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    valid_until = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.code} - {self.discount_percentage}% OFF"


class BarberSchedule(models.Model):
    DAYS_OF_WEEK = (
        (0, 'Sunday'),
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
    )
    barber = models.ForeignKey(BarberProfile, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    open_time = models.TimeField(default='09:00:00')
    close_time = models.TimeField(default='19:00:00')
    break_start = models.TimeField(default='13:00:00')
    break_end = models.TimeField(default='14:00:00')
    is_off = models.BooleanField(default=False)

    class Meta:
        unique_together = ('barber', 'day_of_week')
        ordering = ['day_of_week']

    def __str__(self):
        day_name = dict(self.DAYS_OF_WEEK).get(self.day_of_week)
        return f"{self.barber.name} - {day_name}: {'OFF' if self.is_off else f'{self.open_time} - {self.close_time}'}"


class GalleryItem(models.Model):
    CATEGORY_CHOICES = (
        ('Fade', 'Fade Cuts'),
        ('Classic', 'Classic Styles'),
        ('Modern', 'Modern Trends'),
        ('Beard', 'Beard Sculpting'),
    )
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Fade')
    barber_name = models.CharField(max_length=100)
    image = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"


class BarberLocation(models.Model):
    shop_name = models.CharField(max_length=150)
    barber_name = models.CharField(max_length=150)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100, default='Kathmandu')
    phone = models.CharField(max_length=30)
    hours = models.CharField(max_length=150, default='Sun - Fri: 9:00 AM - 8:00 PM | Sat: 10:00 AM - 5:00 PM')

    def __str__(self):
        return f"{self.shop_name} ({self.city})"
