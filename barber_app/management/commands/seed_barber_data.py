from django.core.management.base import BaseCommand
from datetime import date
from barber_app.models import (
    CustomUser, Service, BarberProfile, Booking,
    Review, Offer, BarberSchedule, GalleryItem, BarberLocation
)

class Command(BaseCommand):
    help = 'Seeds initial users, master barbers, services with Nepali Rupee prices, and schedules'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding database with Nepali Barber system data...")

        # 1. Users
        client_user, _ = CustomUser.objects.get_or_create(
            username='alex_client',
            defaults={
                'email': 'alex@example.com',
                'first_name': 'Alex',
                'last_name': 'Turner',
                'role': 'customer',
                'phone': '+977 9801234567',
                'address': 'Lazimpat, Kathmandu',
            }
        )
        client_user.set_password('password123')
        client_user.save()

        barber_user, _ = CustomUser.objects.get_or_create(
            username='marcus_barber',
            defaults={
                'email': 'marcus@barbershop.com',
                'first_name': 'Marcus',
                'last_name': 'Vance',
                'role': 'barber',
                'phone': '+977 9812345678',
                'address': 'Durbar Marg Flagship Station',
            }
        )
        barber_user.set_password('password123')
        barber_user.save()

        admin_user, _ = CustomUser.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@barbershop.com',
                'first_name': 'Admin',
                'last_name': 'Master',
                'role': 'admin',
                'phone': '+977 1-4423456',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('password123')
        admin_user.save()

        # 2. Services (in Nepali Rupees NPR)
        services_data = [
            {'name': 'Classic Men Haircut', 'price': 350, 'duration': 30, 'desc': 'Precision scissor and clipper cut tailored to your head shape, followed by warm towel and neck shave.', 'img': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600'},
            {'name': 'Beard Trim & Sculpt', 'price': 250, 'duration': 25, 'desc': 'Detailed beard line-up, trimming, natural oil conditioning, and hot lather straight razor finish.', 'img': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600'},
            {'name': 'Haircut & Beard Deluxe Combo', 'price': 600, 'duration': 50, 'desc': 'The full gentleman grooming experience. Premium haircut, beard styling, hot towel treatment, and styled finish.', 'img': 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600'},
            {'name': 'Royal Hot Lather Shave', 'price': 350, 'duration': 35, 'desc': 'Traditional straight razor shave with multiple hot aromatherapy towels, pre-shave cream, and soothing aftershave balm.', 'img': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'},
            {'name': 'Kids Classic Cut (Under 12)', 'price': 200, 'duration': 25, 'desc': 'Gentle and patient haircut designed specifically for youngsters, finished with child-friendly styling.', 'img': 'https://images.unsplash.com/photo-1517832606589-7629c3395909?w=600'},
            {'name': 'Scalp Detox & Hair Wash', 'price': 300, 'duration': 20, 'desc': 'Invigorating tea tree scalp massage, deep exfoliating wash, and nutrient-rich conditioning tonic.', 'img': 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600'},
        ]
        created_services = []
        for s in services_data:
            svc, _ = Service.objects.get_or_create(
                name=s['name'],
                defaults={'price': s['price'], 'duration': s['duration'], 'description': s['desc'], 'image': s['img']}
            )
            created_services.append(svc)

        # 3. Barbers
        barber1, _ = BarberProfile.objects.get_or_create(
            user=barber_user,
            defaults={
                'name': 'Marcus "Fade Master" Vance',
                'experience_years': 8,
                'bio': 'Master barber specializing in razor-sharp skin fades, textured crops, and bespoke beard designs. Over 10,000 cuts performed in Kathmandu.',
                'photo': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
                'rating': 4.9,
                'phone': '+977 9812345678',
                'is_available': True,
            }
        )
        barber1.services.set(created_services[:4])

        # Additional Barbers
        u2, _ = CustomUser.objects.get_or_create(username='julian_barber', defaults={'role': 'barber', 'email': 'julian@barbershop.com', 'first_name': 'Julian', 'last_name': 'Rossi'})
        barber2, _ = BarberProfile.objects.get_or_create(
            user=u2,
            defaults={
                'name': 'Julian Rossi',
                'experience_years': 12,
                'bio': 'Italian-trained traditional barber who brings timeless grooming elegance, classic scissor craft, and hot towel pampering.',
                'photo': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
                'rating': 5.0,
                'phone': '+977 9823456789',
                'is_available': True,
            }
        )
        barber2.services.set([created_services[0], created_services[2], created_services[3]])

        # 4. Offers
        Offer.objects.get_or_create(code='FIRSTCUT20', defaults={'title': 'First Haircut Welcome Special', 'discount_percentage': 20, 'description': 'Get 20% off your very first appointment.', 'valid_until': date(2026, 12, 31)})
        Offer.objects.get_or_create(code='MIDWEEK15', defaults={'title': 'Midweek Gentleman Package', 'discount_percentage': 15, 'description': 'Book Tue-Thu for deluxe combo savings.', 'valid_until': date(2026, 11, 30)})
        Offer.objects.get_or_create(code='FAMILYCUT', defaults={'title': 'Father & Son Duo Discount', 'discount_percentage': 25, 'description': '25% off kids cut with any adult combo.', 'valid_until': date(2026, 12, 15)})

        # 5. Bookings (Nepali Rupees)
        Booking.objects.get_or_create(
            user=client_user, barber=barber1, service=created_services[0], booking_date=date.today(),
            defaults={'booking_time': '09:00', 'status': 'confirmed', 'total_price': 350, 'notes': 'Clean scissor taper'}
        )
        Booking.objects.get_or_create(
            user=client_user, barber=barber1, service=created_services[2], booking_date=date.today(),
            defaults={'booking_time': '10:30', 'status': 'pending', 'total_price': 600, 'notes': 'Deluxe combo with beard trim'}
        )

        # 6. Locations
        BarberLocation.objects.get_or_create(
            shop_name='Online Barber Durbar Marg Flagship',
            defaults={
                'barber_name': 'Marcus & Julian Lounge',
                'address': 'Durbar Marg, Heritage Plaza 2nd Floor',
                'city': 'Kathmandu',
                'phone': '+977 1-4423456',
                'hours': 'Sun - Fri: 9:00 AM - 8:00 PM | Sat: 10:00 AM - 5:00 PM'
            }
        )
        BarberLocation.objects.get_or_create(
            shop_name='Online Barber Lazimpat Studio',
            defaults={
                'barber_name': 'Styles & Shaves Lab',
                'address': 'Lazimpat Embassy Road',
                'city': 'Kathmandu',
                'phone': '+977 1-4419876',
                'hours': 'Sun - Fri: 9:00 AM - 8:00 PM'
            }
        )

        # 7. Gallery
        GalleryItem.objects.get_or_create(title='Skin Fade Textured Crop', category='Fade', barber_name='Marcus Vance', image='https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=700')
        GalleryItem.objects.get_or_create(title='Classic Side Part', category='Classic', barber_name='Julian Rossi', image='https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700')
        GalleryItem.objects.get_or_create(title='Hot Towel Razor Line-up', category='Beard', barber_name='Marcus Vance', image='https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=700')

        self.stdout.write(self.style.SUCCESS("Database seeded successfully with Nepali Rupees pricing and demo roles!"))
