import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Service } from '../types';
import { Clock, Scissors, Calendar, Check, Search } from 'lucide-react';

export const ServicesView: React.FC<{
  onBookWithService: (s: Service) => void;
}> = ({ onBookWithService }) => {
  const { services } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Our Menu</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Grooming & Barber Services</h1>
          <p className="text-slate-500 text-sm mt-1">Tailored packages designed for comfort, style, and perfection</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3c72]"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-28 bg-gradient-to-r from-slate-100 via-amber-50/40 to-slate-50 p-6 flex items-center justify-between border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-[#1e3c72] text-amber-400 flex items-center justify-center font-black shadow-md">
                  <Scissors className="w-7 h-7" />
                </div>
                <div className="bg-white/90 backdrop-blur border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{service.duration} mins session</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                  <span className="text-2xl font-black text-[#1e3c72]">Rs. {service.price}</span>
                </div>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  {service.description}
                </p>

                <div className="mt-5 space-y-1.5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Complimentary consultation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Organic grooming products included</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => onBookWithService(service)}
                className="w-full py-3 bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book This Service (Rs. {service.price})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
