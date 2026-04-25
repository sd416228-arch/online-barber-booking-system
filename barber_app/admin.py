from django.contrib import admin
from django.utils.html import format_html
from .models import CustomUser, Barber, Service, Booking, Review, Gallery, Offer, BarberLocation


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


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('barber', 'title', 'show_image', 'is_featured', 'created_at')
    list_filter = ('barber', 'is_featured', 'created_at')
    search_fields = ('barber__name', 'title', 'description')
    fieldsets = (
        ('Gallery Info', {'fields': ('barber', 'title', 'description')}),
        ('Image', {'fields': ('image',)}),
        ('Status', {'fields': ('is_featured',)}),
        ('Dates', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def show_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 5px;" />', obj.image.url)
        return 'No image'
    show_image.short_description = 'Image'


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'offer_type', 'discount_display', 'is_valid_display', 'start_date', 'end_date')
    list_filter = ('offer_type', 'is_active', 'start_date', 'end_date')
    search_fields = ('title', 'description')
    fieldsets = (
        ('Offer Info', {'fields': ('title', 'description', 'offer_type')}),
        ('Discount', {'fields': ('discount_percent', 'discount_amount')}),
        ('Applicability', {'fields': ('applicable_service', 'applicable_barber')}),
        ('Media', {'fields': ('image',), 'classes': ('collapse',)}),
        ('Duration', {'fields': ('start_date', 'end_date')}),
        ('Status', {'fields': ('is_active',)}),
        ('Dates', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def discount_display(self, obj):
        if obj.discount_percent > 0:
            return f"{obj.discount_percent}%"
        elif obj.discount_amount > 0:
            return f"${obj.discount_amount}"
        return "No discount"
    discount_display.short_description = 'Discount'
    
    def is_valid_display(self, obj):
        if obj.is_valid():
            return format_html('<span style="color: green;">✓ Valid</span>')
        return format_html('<span style="color: red;">✗ Expired</span>')
    is_valid_display.short_description = 'Valid'


@admin.register(BarberLocation)
class BarberLocationAdmin(admin.ModelAdmin):
    list_display = ('barber', 'address', 'opening_time', 'closing_time', 'map_link')
    search_fields = ('barber__name', 'address')
    fieldsets = (
        ('Location Info', {'fields': ('barber', 'address')}),
        ('Coordinates', {'fields': ('latitude', 'longitude')}),
        ('Business Hours', {'fields': ('opening_time', 'closing_time')}),
        ('Maps & Communication', {'fields': ('google_maps_url', 'whatsapp_number')}),
        ('Dates', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def map_link(self, obj):
        if obj.google_maps_url:
            return format_html('<a href="{}" target="_blank">View on Maps</a>', obj.google_maps_url)
        return 'No map URL'
    map_link.short_description = 'Maps'
