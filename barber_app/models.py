from django.db import models
from django.contrib.auth.models import AbstractUser
from django.urls import reverse
from datetime import datetime, timedelta

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrator'),
        ('user', 'Regular User'),
    )
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='user',
        help_text='User role: admin or user'
    )
    phone = models.CharField(
        max_length=15,
        blank=True,
        help_text='User phone number'
    )
    dateofbirth = models.DateField(
        null=True,
        blank=True,
        help_text='User date of birth'
    )
    address = models.TextField(
        blank=True,
        help_text='User address'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_regular_user(self):
        return self.role == 'user'


class Service(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Service name (e.g., Haircut, Beard Trim)'
    )
    description = models.TextField(
        help_text='Detailed description of the service'
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Service price'
    )
    duration = models.PositiveIntegerField(
        default=30,
        help_text='Service duration in minutes'
    )
    image = models.ImageField(
        upload_to='service_images/',
        blank=True,
        null=True,
        help_text='Service image'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Is this service available?'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'services'
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} (${self.price})"


class Barber(models.Model):
    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        help_text='Associated user account'
    )
    name = models.CharField(
        max_length=100,
        help_text='Barber full name'
    )
    experience = models.PositiveIntegerField(
        default=0,
        help_text='Years of experience'
    )
    bio = models.TextField(
        blank=True,
        help_text='Barber biography'
    )
    photo = models.ImageField(
        upload_to='barber_photos/',
        blank=True,
        null=True,
        help_text='Barber profile photo'
    )
    services = models.ManyToManyField(
        Service,
        related_name='barbers',
        help_text='Services offered by this barber'
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        help_text='Average rating (0-5)'
    )
    phone = models.CharField(
        max_length=15,
        blank=True,
        help_text='Barber phone number'
    )
    is_available = models.BooleanField(
        default=True,
        help_text='Is barber currently available?'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'barbers'
        verbose_name = 'Barber'
        verbose_name_plural = 'Barbers'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.experience} years)"
    
    def get_absolute_url(self):
        return reverse('barber_detail', kwargs={'pk': self.pk})


class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text='User making the booking'
    )
    barber = models.ForeignKey(
        Barber,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text='Barber assigned to this booking'
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        related_name='bookings',
        help_text='Service booked'
    )
    booking_date = models.DateField(
        help_text='Date of the appointment'
    )
    booking_time = models.TimeField(
        help_text='Time of the appointment'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text='Current booking status'
    )
    notes = models.TextField(
        blank=True,
        help_text='Additional notes or special requests'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'bookings'
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        ordering = ['-booking_date', '-booking_time']
        unique_together = ('barber', 'booking_date', 'booking_time')
    
    def __str__(self):
        return f"Booking #{self.id} - {self.user.username} with {self.barber.name}"
    
    def get_absolute_url(self):
        return reverse('booking_detail', kwargs={'pk': self.pk})
    
    def is_past(self):
        return datetime.combine(self.booking_date, self.booking_time) < datetime.now()
    
    def can_be_cancelled(self):
        return not self.is_past() and self.status != 'completed'


class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    )
    
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text='User leaving the review'
    )
    barber = models.ForeignKey(
        Barber,
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text='Barber being reviewed'
    )
    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='review',
        help_text='Associated booking'
    )
    rating = models.IntegerField(
        choices=RATING_CHOICES,
        help_text='Rating from 1 to 5'
    )
    comment = models.TextField(
        help_text='Review comment'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'reviews'
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'
        ordering = ['-created_at']
        unique_together = ('user', 'barber', 'booking')
    
    def __str__(self):
        return f"{self.user.username} - {self.barber.name} ({self.rating}/5)"


class Gallery(models.Model):
    """
    Gallery model for displaying barber portfolio images
    """
    barber = models.ForeignKey(
        Barber,
        on_delete=models.CASCADE,
        related_name='gallery_images',
        help_text='Barber whose gallery this image belongs to'
    )
    title = models.CharField(
        max_length=200,
        help_text='Image title or description'
    )
    image = models.ImageField(
        upload_to='gallery/',
        help_text='Gallery image'
    )
    description = models.TextField(
        blank=True,
        help_text='Detailed description of the work'
    )
    is_featured = models.BooleanField(
        default=False,
        help_text='Feature this image on barber profile'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'gallery'
        verbose_name = 'Gallery'
        verbose_name_plural = 'Gallery Images'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.barber.name} - {self.title}"


class Offer(models.Model):
    """
    Offer model for displaying special promotions and discounts
    """
    OFFER_TYPE_CHOICES = (
        ('discount', 'Discount'),
        ('special', 'Special Offer'),
        ('bundle', 'Bundle Deal'),
        ('seasonal', 'Seasonal Offer'),
    )
    
    title = models.CharField(
        max_length=200,
        help_text='Offer title'
    )
    description = models.TextField(
        help_text='Detailed description of the offer'
    )
    offer_type = models.CharField(
        max_length=20,
        choices=OFFER_TYPE_CHOICES,
        default='discount',
        help_text='Type of offer'
    )
    discount_percent = models.PositiveIntegerField(
        default=0,
        help_text='Discount percentage (0-100)'
    )
    discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        help_text='Fixed discount amount'
    )
    applicable_service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='offers',
        help_text='Service this offer applies to (leave empty for all services)'
    )
    applicable_barber = models.ForeignKey(
        Barber,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='offers',
        help_text='Barber this offer applies to (leave empty for all barbers)'
    )
    image = models.ImageField(
        upload_to='offers/',
        blank=True,
        null=True,
        help_text='Offer image/banner'
    )
    start_date = models.DateField(
        help_text='Offer start date'
    )
    end_date = models.DateField(
        help_text='Offer end date'
    )
    is_active = models.BooleanField(
        default=True,
        help_text='Is this offer currently active'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'offers'
        verbose_name = 'Offer'
        verbose_name_plural = 'Offers'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} ({self.get_offer_type_display()})"
    
    def is_valid(self):
        """Check if offer is currently valid based on dates"""
        from datetime import date
        today = date.today()
        return self.is_active and self.start_date <= today <= self.end_date


class BarberLocation(models.Model):
    """
    Model for storing barber location details for Google Maps integration
    """
    barber = models.OneToOneField(
        Barber,
        on_delete=models.CASCADE,
        related_name='location',
        help_text='Barber this location belongs to'
    )
    address = models.CharField(
        max_length=255,
        help_text='Full address'
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        help_text='Latitude coordinate'
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        help_text='Longitude coordinate'
    )
    google_maps_url = models.URLField(
        blank=True,
        help_text='Google Maps URL for this location'
    )
    opening_time = models.TimeField(
        default='09:00',
        help_text='Opening time'
    )
    closing_time = models.TimeField(
        default='18:00',
        help_text='Closing time'
    )
    whatsapp_number = models.CharField(
        max_length=20,
        blank=True,
        help_text='WhatsApp number for bookings (e.g., +1234567890)'
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    
    class Meta:
        db_table = 'barber_locations'
        verbose_name = 'Barber Location'
        verbose_name_plural = 'Barber Locations'
    
    def __str__(self):
        return f"{self.barber.name} - {self.address}"
