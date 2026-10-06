from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, Service, BarberProfile, Booking,
    Review, Offer, BarberSchedule, GalleryItem, BarberLocation
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Role & Profile Info', {'fields': ('role', 'phone', 'address', 'profile_image')}),
    )
    list_display = ['username', 'email', 'role', 'phone', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']


@admin.register(BarberProfile)
class BarberProfileAdmin(admin.ModelAdmin):
    list_display = ['name', 'experience_years', 'rating', 'phone', 'is_available']
    list_filter = ['is_available']
    search_fields = ['name', 'bio']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'barber', 'service', 'booking_date', 'booking_time', 'total_price', 'status']
    list_filter = ['status', 'booking_date', 'barber']
    search_fields = ['user__username', 'barber__name', 'service__name']
    date_hierarchy = 'booking_date'


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['user', 'barber', 'rating', 'created_at']
    list_filter = ['rating']


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ['code', 'title', 'discount_percentage', 'valid_until', 'is_active']
    list_filter = ['is_active']


@admin.register(BarberSchedule)
class BarberScheduleAdmin(admin.ModelAdmin):
    list_display = ['barber', 'day_of_week', 'open_time', 'close_time', 'is_off']


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'barber_name']
    list_filter = ['category']


@admin.register(BarberLocation)
class BarberLocationAdmin(admin.ModelAdmin):
    list_display = ['shop_name', 'city', 'phone']
