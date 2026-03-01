# Online Barber Booking System

A comprehensive Django-based online barber booking system with separate admin and user interfaces for managing barber services, bookings, and customer reviews.

## Features

### Admin System
- **Dashboard**: Overview of bookings, barbers, and services
- **Barber Management**: Create, read, update, and delete barber profiles with photos and services
- **Service Management**: Manage available barber services with pricing and duration
- **Booking Management**: View and manage all customer bookings with status updates
- **Role-based Access Control**: Secure admin-only pages

### User System
- **User Registration & Authentication**: Create accounts and secure login
- **Browse Barbers**: View all available barbers with profiles, ratings, and reviews
- **Browse Services**: View all available services with pricing and duration
- **Book Appointments**: Easy-to-use booking form with date/time selection
- **Manage Bookings**: View, update, and cancel bookings
- **Leave Reviews**: Rate and review barbers after completed appointments
- **User Profile**: Manage personal information and view booking history

## Project Structure

```
online_barber_project/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── online_barber/
│   ├── __init__.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL configuration
│   └── wsgi.py
├── barber_app/
│   ├── migrations/
│   ├── templates/
│   │   ├── shared/          # Common templates
│   │   │   ├── base.html
│   │   │   ├── index.html
│   │   │   ├── user_login.html
│   │   │   ├── user_register.html
│   │   │   └── admin_login.html
│   │   ├── admin/           # Admin-only templates
│   │   │   ├── dashboard.html
│   │   │   ├── barber_list.html
│   │   │   ├── barber_form.html
│   │   │   ├── service_list.html
│   │   │   ├── service_form.html
│   │   │   ├── booking_list.html
│   │   │   └── booking_detail.html
│   │   └── user/            # User-only templates
│   │       ├── dashboard.html
│   │       ├── barber_list.html
│   │       ├── barber_detail.html
│   │       ├── booking_form.html
│   │       ├── booking_list.html
│   │       └── profile.html
│   ├── static/
│   │   ├── css/             # Custom CSS
│   │   └── js/              # JavaScript files
│   ├── admin.py             # Django admin configuration
│   ├── apps.py
│   ├── decorators.py        # Role-based decorators
│   ├── forms.py             # Django forms
│   ├── models.py            # Database models
│   ├── urls.py              # App URL routing
│   └── views.py             # View logic
└── media/
    ├── barber_photos/       # Barber profile photos
    └── service_images/      # Service images
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Step 1: Clone or Navigate to Project
```bash
cd online_barber_project
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Database
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

### Step 5: Create Superuser (Admin Account)
```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin account. Use this account to log in to the admin panel.

### Step 6: Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### Step 7: Run Development Server
```bash
python manage.py runserver
```

The application will be available at: `http://127.0.0.1:8000/`

## Usage

### Admin Access
1. Navigate to: `http://127.0.0.1:8000/admin-login/`
2. Log in with the superuser credentials created in Step 5
3. Access the admin dashboard at: `/admin-dashboard/`

### User Access
1. Navigate to: `http://127.0.0.1:8000/user-register/`
2. Create a new account
3. Log in at: `/user-login/`
4. Browse barbers and services
5. Book appointments

### Django Admin Panel
- Access Django admin: `http://127.0.0.1:8000/admin/`
- Manage all models: Users, Barbers, Services, Bookings, Reviews

## Models

### CustomUser
- Custom user model extending Django's AbstractUser
- Fields: username, email, phone, dateofbirth, address, role
- Roles: 'admin', 'user'

### Barber
- Represents barber professionals
- Fields: name, photo, experience, bio, services, rating, phone, is_available
- Relations: OneToOne with CustomUser, ManyToMany with Service

### Service
- Available barber services
- Fields: name, description, price, duration, image, is_active
- Relations: ManyToMany with Barber

### Booking
- Customer appointments
- Fields: user, barber, service, booking_date, booking_time, status, notes
- Status: pending, confirmed, completed, cancelled

### Review
- Customer reviews for barbers
- Fields: user, barber, booking, rating (1-5), comment
- Relations: OneToOne with Booking

## URL Routes

### Authentication
- `/` - Home page
- `/user-login/` - User login
- `/user-register/` - User registration
- `/admin-login/` - Admin login
- `/logout/` - Logout

### Admin URLs
- `/admin-dashboard/` - Admin dashboard
- `/admin-barbers/` - Barber list
- `/admin-barbers/<id>/edit/` - Edit barber
- `/admin-services/` - Service list
- `/admin-bookings/` - Booking list

### User URLs
- `/user-dashboard/` - User dashboard
- `/user-barbers/` - Browse barbers
- `/user-services/` - Browse services
- `/user-bookings/` - My bookings
- `/user-bookings/create/` - Book appointment
- `/user-profile/` - User profile

## Security Features

- **Custom User Model**: Enables role-based access control
- **Login Required Decorators**: Protects views from unauthorized access
- **CSRF Protection**: Built-in Django CSRF token validation
- **Password Hashing**: Secure password storage
- **Session Management**: Configurable session timeouts
- **Role-Based Access**: Strict enforcement of admin vs user pages

## Authentication & Authorization

### Role-Based Decorators

**@user_required**: Only regular users can access
```python
@user_required
def user_dashboard(request):
    pass
```

**@admin_required**: Only admin users can access
```python
@admin_required
def admin_dashboard(request):
    pass
```

## Customization

### Add Email Notifications
In `settings.py`, configure email:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-password'
```

### Change Database
By default, the project uses SQLite. To use PostgreSQL:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'online_barber',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## Troubleshooting

### Migrations Failed
```bash
# Reset migrations
python manage.py migrate barber_app zero
python manage.py migrate
```

### Static Files Not Loading
```bash
# Collect static files
python manage.py collectstatic --clear
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

## Production Deployment

Before deploying to production:

1. **Set DEBUG = False** in settings.py
2. **Change SECRET_KEY** to a secure random value
3. **Set ALLOWED_HOSTS** to your domain
4. **Use a production database** (PostgreSQL recommended)
5. **Configure email** for notifications
6. **Enable HTTPS** and secure cookies
7. **Use a production WSGI server** (Gunicorn)
8. **Set up static file serving** (Nginx/WhiteNoise)

## API Response Examples

### Login Response
```json
{
    "status": "success",
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "john_doe",
        "role": "user"
    }
}
```

### Booking Response
```json
{
    "status": "success",
    "message": "Booking created",
    "booking": {
        "id": 1,
        "barber": "John Smith",
        "service": "Haircut",
        "date": "2024-03-15",
        "time": "10:00",
        "status": "pending"
    }
}
```

## Technologies Used

- **Backend**: Django 4.2.7
- **Database**: SQLite (can be swapped with PostgreSQL)
- **Frontend**: Bootstrap 5, HTML5, CSS3
- **Media Handling**: Pillow for image processing
- **Server**: Django development server / Gunicorn for production

## Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include error messages and screenshots when applicable

## Future Enhancements

- [ ] AJAX booking without page reload
- [ ] Email notifications for bookings
- [ ] SMS notifications
- [ ] Payment gateway integration
- [ ] Barber availability calendar
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Subscription plans
- [ ] Loyalty rewards program

## Author

Created as a comprehensive Django learning project demonstrating:
- Role-based access control
- Custom user models
- Complex relationships
- Image handling
- Form validation
- Administrative interfaces

---

**Developed with Django** 🚀

For more information, visit: https://www.djangoproject.com/
