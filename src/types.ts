export type UserRole = 'admin' | 'user' | 'barber';

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  barber_id?: string;
  phone?: string;
  dateofbirth?: string;
  address?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image: string;
  is_active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  experience: number; // in years
  bio: string;
  photo: string;
  rating: number;
  phone: string;
  is_available: boolean;
  service_ids: string[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  barber_id: string;
  barber_name: string;
  service_id: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  status: BookingStatus;
  notes?: string;
  total_price: number;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  barber_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  barber_id?: string;
  barber_name?: string;
  category: string;
}

export interface Offer {
  id: string;
  title: string;
  discount_percentage: number;
  description: string;
  code: string;
  valid_until: string;
}

export interface BarberLocation {
  id: string;
  barber_id: string;
  barber_name: string;
  shop_name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  hours: string;
}
