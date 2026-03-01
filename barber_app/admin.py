from django.contrib import admin
from django.utils.html import format_html
from .models import CustomUser, Barber, Service, Booking, Review


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
   
    list_display = ('username', 'first_name', 'last_name', 'email', 'role', 'phone', 'is_active')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone')
    fieldsets = (
        ('Personal Info', {
            'fields': ('username', 'first_name', 'last_name', 'email', 'phone', 'dateofbirth', 'address')
        }),
        ('Role & Permissions', {
            'fields': ('role', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('last_login', 'date_joined')


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'price', 'duration', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    fieldsets = (
        ('Service Info', {
            'fields': ('name', 'description', 'price', 'duration')
        }),
        ('Media', {
            'fields': ('image',),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Barber)
class BarberAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'experience', 'rating', 'show_photo', 'is_available', 'created_at')
    list_filter = ('is_available', 'created_at', 'experience')
    search_fields = ('name', 'user__email', 'phone')
    filter_horizontal = ('services',)
    fieldsets = (
        ('Barber Info', {
            'fields': ('user', 'name', 'experience', 'phone', 'bio')
        }),
        ('Media', {
            'fields': ('photo',),
            'classes': ('collapse',)
        }),
        ('Services & Rating', {
            'fields': ('services', 'rating')
        }),
        ('Status', {
            'fields': ('is_available',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def show_photo(self, obj):
        """Display barber photo in list view"""
        if obj.photo:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.photo.url
            )
        return 'No photo'
    show_photo.short_description = 'Photo'


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    
    list_display = ('id', 'user', 'barber', 'service', 'booking_date', 'booking_time', 'status', 'created_at')
    list_filter = ('status', 'booking_date', 'created_at')
    search_fields = ('user__username', 'barber__name', 'service__name')
    fieldsets = (
        ('Booking Info', {
            'fields': ('user', 'barber', 'service')
        }),
        ('Date & Time', {
            'fields': ('booking_date', 'booking_time')
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """
    Admin interface for Review model.
    """
    list_display = ('user', 'barber', 'rating', 'comment_preview', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('user__username', 'barber__name', 'comment')
    fieldsets = (
        ('Review Info', {
            'fields': ('user', 'barber', 'booking')
        }),
        ('Rating & Comment', {
            'fields': ('rating', 'comment')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def comment_preview(self, obj):
        """Show preview of comment"""
        return obj.comment[:50] + '...' if len(obj.comment) > 50 else obj.comment
    comment_preview.short_description = 'Comment'
