from django.conf import settings

def barber_context(request):
    """Provides global currency symbol and branding to all Django templates."""
    return {
        'CURRENCY_SYMBOL': getattr(settings, 'CURRENCY_SYMBOL', 'Rs.'),
        'CURRENCY_CODE': getattr(settings, 'CURRENCY_CODE', 'NPR'),
        'APP_NAME': 'Online Barber Booking System',
    }
