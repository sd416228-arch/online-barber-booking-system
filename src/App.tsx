import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { BarbersView } from './components/BarbersView';
import { BarberDetailModal } from './components/BarberDetailModal';
import { ServicesView } from './components/ServicesView';
import { BookingView } from './components/BookingView';
import { UserDashboardView } from './components/UserDashboardView';
import { BarberDashboardView } from './components/BarberDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { GalleryView } from './components/GalleryView';
import { OffersView } from './components/OffersView';
import { LocationsView } from './components/LocationsView';
import { AuthView } from './components/AuthView';
import { Barber, Service } from './types';
import { CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setSelectedBarberForBooking,
    setSelectedServiceForBooking,
    toast,
    barbers,
  } = useApp();

  const [activeModalBarber, setActiveModalBarber] = useState<Barber | null>(null);

  const handleSelectBarberForDetail = (barber: Barber) => {
    setActiveModalBarber(barber);
  };

  const handleBookWithBarber = (barber: Barber) => {
    setSelectedBarberForBooking(barber);
    setActiveTab('book');
  };

  const handleBookWithService = (service: Service) => {
    setSelectedServiceForBooking(service);
    setActiveTab('book');
  };

  const handleOpenReviewModal = (barberId: string) => {
    const b = barbers.find(item => item.id === barberId);
    if (b) {
      setActiveModalBarber(b);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <HomeView
            onSelectBarberForDetail={handleSelectBarberForDetail}
            onBookWithBarber={handleBookWithBarber}
            onBookWithService={handleBookWithService}
          />
        )}

        {activeTab === 'barbers' && (
          <BarbersView
            onSelectBarberForDetail={handleSelectBarberForDetail}
            onBookWithBarber={handleBookWithBarber}
          />
        )}

        {activeTab === 'services' && (
          <ServicesView onBookWithService={handleBookWithService} />
        )}

        {activeTab === 'book' && <BookingView />}

        {activeTab === 'user-dashboard' && (
          <UserDashboardView
            onBookNew={() => setActiveTab('book')}
            onOpenReviewModal={handleOpenReviewModal}
          />
        )}

        {activeTab === 'barber-dashboard' && <BarberDashboardView />}

        {activeTab === 'admin-dashboard' && <AdminDashboardView />}

        {activeTab === 'gallery' && <GalleryView />}

        {activeTab === 'offers' && <OffersView />}

        {activeTab === 'locations' && <LocationsView />}

        {activeTab === 'login' && <AuthView initialMode="login" />}

        {activeTab === 'register' && <AuthView initialMode="register" />}
      </main>

      {/* Barber Detail & Review Modal */}
      <BarberDetailModal
        barber={activeModalBarber}
        onClose={() => setActiveModalBarber(null)}
        onBook={handleBookWithBarber}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};
