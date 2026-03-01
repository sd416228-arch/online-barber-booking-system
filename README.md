💈 Online Barber Booking System
A simple web app where customers can book haircuts online and barbers can manage appointments.

✂️ What It Does
For customers:

Sign up/login to your account

Browse available barbers and services

Book appointments (pick date/time)

See your upcoming bookings

Leave reviews after your haircut

For barbers/admins:

Dashboard with all bookings

Add/edit barbers and services

Manage customer appointments

Update booking status

🛠️ Built With
Django (Python)

📁 Project Structure
online_barber_project/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── online_barber/                  # Project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── barber_app/                      # Main app
│   ├── migrations/                  # Database migrations
│   ├── templates/
│   │   ├── shared/                  # Common pages
│   │   │   ├── base.html
│   │   │   ├── index.html
│   │   │   ├── user_login.html
│   │   │   ├── user_register.html
│   │   │   └── admin_login.html
│   │   ├── admin/                    # Admin pages
│   │   │   ├── dashboard.html
│   │   │   ├── barber_list.html
│   │   │   ├── barber_form.html
│   │   │   ├── service_list.html
│   │   │   ├── service_form.html
│   │   │   ├── booking_list.html
│   │   │   └── booking_detail.html
│   │   └── user/                      # User pages
│   │       ├── dashboard.html
│   │       ├── barber_list.html
│   │       ├── barber_detail.html
│   │       ├── booking_form.html
│   │       ├── booking_list.html
│   │       └── profile.html
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   ├── admin.py
│   ├── apps.py
│   ├── decorators.py
│   ├── forms.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
└── media/                             # Uploaded images
    ├── barber_photos/
    └── service_images/
HTML/CSS/JavaScript

SQLite database

🚀 Quick Start
# 1. Navigate to project
cd online_barber_project

# 2. Set up virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# 3. Install requirements
pip install -r requirements.txt

# 4. Setup database
python manage.py migrate

# 5. Create admin account
python manage.py createsuperuser

# 6. Run it
python manage.py runserver

Visit: http://127.0.0.1:8000

🔑 Login Areas
User login: /user-login/

Admin login: /admin-login/

Django admin: /admin/

👤 Author
Sujit Dutta
sd416228@gmail.com

