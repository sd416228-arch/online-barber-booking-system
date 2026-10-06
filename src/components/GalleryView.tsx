import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Sparkles, Filter } from 'lucide-react';

export const GalleryView: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fade', 'Classic', 'Modern', 'Beard'];

  const filteredItems = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Haircut Showcase</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Our Style Portfolio</h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse real customer hairstyles, beard lineups, and fade artistry by our barbers
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-xl text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#1e3c72] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 bg-white border border-slate-200 p-6 flex flex-col justify-between h-64"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
                  {item.category}
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#1e3c72] flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-[#1e3c72]" />
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-900 leading-snug">{item.title}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Signature cut design tailored with classic scissor craft and clean edge lineup.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Master Stylist:</span>
              <span className="font-bold text-[#1e3c72]">{item.barber_name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
