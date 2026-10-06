import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Clock, Store, Navigation } from 'lucide-react';

export const LocationsView: React.FC = () => {
  const { locations, setActiveTab } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Find Us</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Our Barbershop Locations</h1>
          <p className="text-slate-500 text-sm mt-1">
            Visit our flagship lounges and studios for a bespoke grooming experience
          </p>
        </div>
        <button
          onClick={() => setActiveTab('book')}
          className="bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
        >
          Book An Appointment
        </button>
      </div>

      {/* Locations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map(loc => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition p-6 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{loc.city}, {loc.state}</span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{loc.shop_name}</h3>
                <p className="text-xs text-slate-500">{loc.barber_name}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1e3c72] flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#1e3c72] shrink-0" />
                <span>{loc.address}, {loc.city}, {loc.state}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#1e3c72] shrink-0" />
                <span>{loc.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#1e3c72] shrink-0" />
                <span>{loc.hours}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Open Today
              </span>
              <button
                onClick={() => setActiveTab('book')}
                className="px-4 py-2 bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Book This Location</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
