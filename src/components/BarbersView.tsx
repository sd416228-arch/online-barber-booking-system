import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Barber } from '../types';
import { Star, Phone, Scissors, Calendar, Search, Award } from 'lucide-react';

export const BarbersView: React.FC<{
  onSelectBarberForDetail: (b: Barber) => void;
  onBookWithBarber: (b: Barber) => void;
}> = ({ onSelectBarberForDetail, onBookWithBarber }) => {
  const { barbers, services } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBarbers = barbers.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Our Specialists</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Meet Our Master Barbers</h1>
          <p className="text-slate-500 text-sm mt-1">Each barber brings precision artistry and years of dedicated craft</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search barber by name or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3c72]"
          />
        </div>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBarbers.map((barber) => {
          const barberServices = services.filter(s => barber.service_ids.includes(s.id));

          return (
            <div
              key={barber.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-gradient-to-br from-[#1e3c72] via-[#162d55] to-slate-900 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                    {barber.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 font-extrabold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-slate-900" />
                    <span>{barber.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{barber.experience} Years Experience</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">{barber.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{barber.phone}</span>
                  </p>

                  <p className="text-sm text-slate-600 mt-4 leading-relaxed line-clamp-3">
                    {barber.bio}
                  </p>

                  <div className="mt-5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Specialties
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {barberServices.slice(0, 3).map(s => (
                        <span
                          key={s.id}
                          className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1"
                        >
                          <Scissors className="w-3 h-3 text-[#1e3c72]" />
                          {s.name}
                        </span>
                      ))}
                      {barberServices.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-slate-50 text-slate-500 text-xs">
                          +{barberServices.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center gap-3">
                <button
                  onClick={() => onSelectBarberForDetail(barber)}
                  className="flex-1 py-2.5 px-3 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => onBookWithBarber(barber)}
                  className="flex-1 py-2.5 px-3 bg-[#1e3c72] hover:bg-[#2a5298] text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
