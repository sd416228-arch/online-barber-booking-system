# Online Barber Booking System (Django Edition & Web Applet)

A commercial-grade full-stack barber booking and salon management system designed for barbershops in Nepal. Built with a Custom Django User Model, PostgreSQL/SQLite relational database, Django REST Framework, Nepali Rupees (`Rs.`) pricing, and a three-tiered permission architecture (**Client**, **Master Barber**, and **Administrator**).

---

## 🛠️ Django Tech Stack & Architecture

- **Backend Framework**: Python 3.11+, Django 5.x
- **API Engine**: Django REST Framework (DRF)
- **Database**: SQLite (built-in default) & PostgreSQL ready via `DATABASES` settings
- **Authentication**: Custom Unified User Model (`AUTH_USER_MODEL = 'barber_app.CustomUser'`)
- **Currency**: Standard Nepali Rupees (`Rs.` / `NPR`)
- **Frontend Templates**: Django Templates + Tailwind CSS + Font Awesome

---

## 📁 Django Project Structure

```text
├── manage.py                          # Django management CLI
├── requirements.txt                   # Python dependencies (django, djangorestframework, etc.)
├── db.sqlite3                         # SQLite database seeded with initial data
├── online_barber/                     # Main Django project configuration
│   ├── __init__.py
│   ├── settings.py                    # Custom user model, Nepali Rupees config (Rs.), static/media
│   ├── urls.py                        # Root URL dispatcher
│   ├── wsgi.py                        # WSGI server entrypoint
│   └── asgi.py
├── barber_app/                        # Core Barber Booking application
│   ├── models.py                      # CustomUser (3 roles), BarberProfile, Service, Booking, Review, Offer, BarberSchedule, GalleryItem, BarberLocation
│   ├── views.py                       # Class-based & functional views for public, client, barber, and admin flows
│   ├── urls.py                        # Routing for services, barbers, booking flow, dashboards, and API
│   ├── forms.py                       # Registration, booking, review, and service forms
│   ├── serializers.py                 # DRF serializers for API endpoints
│   ├── admin.py                       # Full Django Admin configuration
│   ├── context_processors.py          # Currency symbol and app metadata context
│   ├── migrations/                    # Database schema migration files
│   └── management/commands/
│       └── seed_barber_data.py        # Database seeder (users, master barbers, Nepali services, offers)
└── templates/
    └── barber_app/                    # Production Django HTML Templates
        ├── base.html                  # Responsive layout with 1-click Demo Role switcher
        ├── home.html                  # Landing page with live stats and featured services (Rs.)
        ├── barbers.html               # Master barbers catalog
        ├── barber_detail.html         # Barber bio, reviews, and services
        ├── services.html              # Service catalog in Nepali Rupees
        ├── booking.html               # Interactive booking flow with promo discounts
        ├── client_dashboard.html      # Client appointment manager
        ├── barber_dashboard.html      # Chair #1 Studio with financial summary & queue actions
        ├── admin_dashboard.html       # Business metrics, booking table & service management
        ├── gallery.html               # Haircut lookbook
        ├── offers.html                # Promo vouchers
        └── locations.html             # Kathmandu lounge flagship stations
```

---

## 🚀 Running the Django Project Locally

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Migrations & Seed Data**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py seed_barber_data
   ```

3. **Start the Django Server**:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   Open `http://127.0.0.0:8000` in your browser.


