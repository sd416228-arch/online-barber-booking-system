import React from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, UserCheck, Shield, LogOut, Calendar, Tag, Image, MapPin, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, loginAs, activeTab, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1e3c72] text-white shadow-md">
      {/* Top utility bar */}
      <div className="bg-[#14284d] text-xs py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center gap-2 text-slate-300">
        <div className="flex items-center gap-4">
          <span><i className="fas fa-phone mr-1"></i> +977 1-4423456</span>
          <span className="hidden md:inline"><i className="fas fa-clock mr-1"></i> Sun-Fri: 9am - 8pm</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-slate-400 text-[11px] uppercase font-bold">Role:</span>
          <button
            onClick={() => loginAs('user')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              currentUser?.role === 'user' ? 'bg-amber-400 text-slate-900 shadow font-bold' : 'bg-slate-700/80 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Client Demo
          </button>
          <button
            onClick={() => loginAs('barber')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              currentUser?.role === 'barber' ? 'bg-amber-400 text-slate-900 shadow font-bold' : 'bg-slate-700/80 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Barber Demo
          </button>
          <button
            onClick={() => loginAs('admin')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              currentUser?.role === 'admin' ? 'bg-amber-400 text-slate-900 shadow font-bold' : 'bg-slate-700/80 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Admin Demo
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-[#1e3c72] font-black text-xl shadow group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-[#1e3c72]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">ONLINE BARBER</span>
              <span className="text-[10px] tracking-widest text-amber-300 uppercase">Premium Grooming</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-200 hover:text-amber-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('barbers')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'barbers' ? 'text-amber-400 font-bold' : 'text-slate-200 hover:text-amber-300'
              }`}
            >
              Barbers
            </button>
            <button
              onClick={() => handleNav('services')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'services' ? 'text-amber-400 font-bold' : 'text-slate-200 hover:text-amber-300'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleNav('gallery')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'gallery' ? 'text-amber-400 font-bold' : 'text-slate-200 hover:text-amber-300'
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => handleNav('offers')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'offers' ? 'text-amber-400 font-bold' : 'text-slate-200 hover:text-amber-300'
              }`}
            >
              Offers
            </button>
            <button
              onClick={() => handleNav('locations')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                activeTab === 'locations' ? 'text-amber-400 font-bold' : 'text-slate-200 hover:text-amber-300'
              }`}
            >
              Locations
            </button>
          </nav>

          {/* Action & User Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNav('book')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 shadow transition transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/20">
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      activeTab === 'admin-dashboard' ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'border-slate-500 hover:bg-white/10'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Admin Panel
                  </button>
                ) : currentUser.role === 'barber' ? (
                  <button
                    onClick={() => handleNav('barber-dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      activeTab === 'barber-dashboard' ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'border-slate-500 hover:bg-white/10'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5 text-amber-400" />
                    Barber Studio
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav('user-dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                      activeTab === 'user-dashboard' ? 'bg-amber-400/20 border-amber-400 text-amber-300' : 'border-slate-500 hover:bg-white/10'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    My Bookings
                  </button>
                )}
                <button
                  onClick={logout}
                  title="Log out"
                  className="p-1.5 text-slate-300 hover:text-rose-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('login')}
                  className="text-sm font-medium text-slate-200 hover:text-white px-2 py-1"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="text-sm font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-white"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('book')}
              className="bg-amber-400 text-slate-900 font-bold px-3 py-1.5 rounded text-xs"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-amber-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#162d55] border-t border-white/10 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('barbers')}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10"
          >
            Barbers
          </button>
          <button
            onClick={() => handleNav('services')}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10"
          >
            Services
          </button>
          <button
            onClick={() => handleNav('gallery')}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10"
          >
            Gallery
          </button>
          <button
            onClick={() => handleNav('offers')}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10"
          >
            Offers
          </button>
          <button
            onClick={() => handleNav('locations')}
            className="w-full text-left px-3 py-2 rounded text-sm text-slate-200 hover:bg-white/10"
          >
            Locations
          </button>
          {/* Mobile Quick Role Switcher */}
          <div className="pt-3 pb-2 border-t border-white/10">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block mb-2 px-1">
              Switch Demo Role:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => { loginAs('user'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded text-xs font-bold text-center transition ${
                  currentUser?.role === 'user' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-white/10 text-slate-200'
                }`}
              >
                Client Demo
              </button>
              <button
                onClick={() => { loginAs('barber'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded text-xs font-bold text-center transition ${
                  currentUser?.role === 'barber' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-white/10 text-slate-200'
                }`}
              >
                Barber Demo
              </button>
              <button
                onClick={() => { loginAs('admin'); setMobileMenuOpen(false); }}
                className={`py-1.5 px-2 rounded text-xs font-bold text-center transition ${
                  currentUser?.role === 'admin' ? 'bg-amber-400 text-slate-900 shadow' : 'bg-white/10 text-slate-200'
                }`}
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => handleNav('admin-dashboard')}
                    className="w-full text-left px-3 py-2 rounded text-sm text-amber-300 font-semibold bg-white/5"
                  >
                    Admin Dashboard
                  </button>
                ) : currentUser.role === 'barber' ? (
                  <button
                    onClick={() => handleNav('barber-dashboard')}
                    className="w-full text-left px-3 py-2 rounded text-sm text-amber-300 font-semibold bg-white/5"
                  >
                    Barber Studio
                  </button>
                ) : (
                  <button
                    onClick={() => handleNav('user-dashboard')}
                    className="w-full text-left px-3 py-2 rounded text-sm text-emerald-300 font-semibold bg-white/5"
                  >
                    My Bookings
                  </button>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 rounded text-sm text-rose-300 hover:bg-white/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleNav('login')}
                  className="flex-1 py-2 text-center text-sm font-semibold bg-white/10 rounded"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('register')}
                  className="flex-1 py-2 text-center text-sm font-semibold bg-amber-400 text-slate-900 rounded"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
