import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User, Barber, Service, Booking, Review, Offer, GalleryItem, BarberLocation, BookingStatus
} from '../types';
import {
  INITIAL_USERS, INITIAL_SERVICES, INITIAL_BARBERS, INITIAL_BOOKINGS,
  INITIAL_REVIEWS, INITIAL_OFFERS, INITIAL_GALLERY, INITIAL_LOCATIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loginAs: (role: 'user' | 'admin' | 'barber') => void;
  logout: () => void;
  services: Service[];
  barbers: Barber[];
  bookings: Booking[];
  reviews: Review[];
  offers: Offer[];
  gallery: GalleryItem[];
  locations: BarberLocation[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBarberForBooking: Barber | null;
  setSelectedBarberForBooking: (b: Barber | null) => void;
  selectedServiceForBooking: Service | null;
  setSelectedServiceForBooking: (s: Service | null) => void;
  // Booking actions
  createBooking: (booking: Omit<Booking, 'id' | 'created_at'>) => Booking;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  cancelBooking: (bookingId: string) => void;
  deleteBooking: (bookingId: string) => void;
  // Review actions
  addReview: (review: Omit<Review, 'id' | 'created_at'>) => void;
  // Barber CRUD
  addBarber: (barber: Omit<Barber, 'id'>) => void;
  updateBarber: (id: string, barber: Partial<Barber>) => void;
  deleteBarber: (id: string) => void;
  // Service CRUD
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  // Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('barber_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // default logged in as regular customer Alex Turner for quick testability
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('barber_services');
    if (saved) {
      try {
        const parsed: Service[] = JSON.parse(saved);
        // Ensure all services reflect Nepali Rupee pricing (minimum standard Rs. 150+)
        return parsed.map(s => ({
          ...s,
          price: s.price < 100 ? s.price * 10 : s.price
        }));
      } catch (e) { /* ignore */ }
    }
    return INITIAL_SERVICES;
  });

  const [barbers, setBarbers] = useState<Barber[]>(() => {
    const saved = localStorage.getItem('barber_barbers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BARBERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('barber_bookings');
    if (saved) {
      try {
        const parsed: Booking[] = JSON.parse(saved);
        // Ensure all historical and initial bookings reflect Nepali Rupee pricing
        return parsed.map(b => ({
          ...b,
          total_price: b.total_price < 100 ? b.total_price * 10 : b.total_price
        }));
      } catch (e) { /* ignore */ }
    }
    return INITIAL_BOOKINGS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('barber_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REVIEWS;
  });

  const [offers] = useState<Offer[]>(INITIAL_OFFERS);
  const [gallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [locations] = useState<BarberLocation[]>(INITIAL_LOCATIONS);

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedBarberForBooking, setSelectedBarberForBooking] = useState<Barber | null>(null);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('barber_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('barber_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('barber_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('barber_barbers', JSON.stringify(barbers));
  }, [barbers]);

  useEffect(() => {
    localStorage.setItem('barber_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('barber_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const loginAs = (role: 'user' | 'admin' | 'barber') => {
    const found = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(found);
    const roleLabel = role === 'admin' ? 'Administrator' : role === 'barber' ? 'Master Barber' : 'Customer';
    showToast(`Logged in as ${found.first_name} (${roleLabel})`);
    if (role === 'admin') {
      setActiveTab('admin-dashboard');
    } else if (role === 'barber') {
      setActiveTab('barber-dashboard');
    } else {
      setActiveTab('user-dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('You have been logged out.');
    setActiveTab('home');
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'created_at'>): Booking => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);
    showToast('Appointment successfully booked! Status is Pending.');
    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    showToast(`Booking ${bookingId} updated to ${status}.`);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    showToast(`Booking has been cancelled.`);
  };

  const deleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    showToast(`Booking record removed.`);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'created_at'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setReviews(prev => [newReview, ...prev]);
    // Recalculate barber rating
    const barberReviews = [...reviews.filter(r => r.barber_id === reviewData.barber_id), newReview];
    const avg = barberReviews.reduce((acc, curr) => acc + curr.rating, 0) / barberReviews.length;
    setBarbers(prev => prev.map(b => b.id === reviewData.barber_id ? { ...b, rating: Number(avg.toFixed(1)) } : b));
    showToast('Thank you! Your review has been published.');
  };

  const addBarber = (barberData: Omit<Barber, 'id'>) => {
    const newBarber: Barber = {
      ...barberData,
      id: `b-${Date.now()}`,
    };
    setBarbers(prev => [...prev, newBarber]);
    showToast(`Barber ${newBarber.name} added successfully.`);
  };

  const updateBarber = (id: string, updated: Partial<Barber>) => {
    setBarbers(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
    showToast(`Barber details updated.`);
  };

  const deleteBarber = (id: string) => {
    setBarbers(prev => prev.filter(b => b.id !== id));
    showToast(`Barber removed.`);
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: `s-${Date.now()}`,
    };
    setServices(prev => [...prev, newService]);
    showToast(`Service "${newService.name}" created.`);
  };

  const updateService = (id: string, updated: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    showToast(`Service updated.`);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast(`Service removed.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loginAs,
        logout,
        services,
        barbers,
        bookings,
        reviews,
        offers,
        gallery,
        locations,
        activeTab,
        setActiveTab,
        selectedBarberForBooking,
        setSelectedBarberForBooking,
        selectedServiceForBooking,
        setSelectedServiceForBooking,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        deleteBooking,
        addReview,
        addBarber,
        updateBarber,
        deleteBarber,
        addService,
        updateService,
        deleteService,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
