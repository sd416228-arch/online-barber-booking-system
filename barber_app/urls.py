from django.urls import path
from . import views

urlpatterns = [
    # Public views
    path('', views.home_view, name='home'),
    path('barbers/', views.barbers_view, name='barbers'),
    path('barbers/<int:barber_id>/', views.barber_detail_view, name='barber_detail'),
    path('services/', views.services_view, name='services'),
    path('gallery/', views.gallery_view, name='gallery'),
    path('offers/', views.offers_view, name='offers'),
    path('locations/', views.locations_view, name='locations'),

    # Booking flow
    path('book/', views.booking_view, name='booking'),
    path('booking/cancel/<int:booking_id>/', views.booking_cancel_view, name='booking_cancel'),

    # Dashboards for 3 roles
    path('dashboard/', views.client_dashboard_view, name='client_dashboard'),
    path('barber-studio/', views.barber_dashboard_view, name='barber_dashboard'),
    path('barber-studio/status/<int:booking_id>/', views.barber_update_status_view, name='barber_update_status'),
    path('admin-portal/', views.admin_dashboard_view, name='admin_dashboard'),
    path('admin-portal/service/delete/<int:service_id>/', views.admin_service_delete_view, name='admin_service_delete'),

    # Auth & Quick 1-click Demo switchers
    path('demo/<str:role>/', views.quick_demo_login_view, name='quick_demo_login'),
    path('logout/', views.auth_logout_view, name='logout'),

    # API endpoints
    path('api/slots/', views.api_available_slots, name='api_available_slots'),
]
