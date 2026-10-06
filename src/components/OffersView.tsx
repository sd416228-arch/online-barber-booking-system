import React from 'react';
import { useApp } from '../context/AppContext';
import { Tag, Calendar, Copy, Check, Sparkles } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { offers, setActiveTab, showToast } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Savings & Perks</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Special Deals & Offers</h1>
          <p className="text-slate-500 text-sm mt-1">
            Exclusive discounts for first-time guests, midweek visits, and father-son packages
          </p>
        </div>
        <button
          onClick={() => setActiveTab('book')}
          className="bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
        >
          Book Now with Promo
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map(offer => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="p-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-lg mb-4">
                {offer.discount_percentage}%
              </div>

              <h3 className="text-xl font-bold text-slate-900">{offer.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {offer.description}
              </p>

              <div className="mt-5 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Promo Code</span>
                  <span className="font-mono font-bold text-sm text-[#1e3c72]">{offer.code}</span>
                </div>
                <button
                  onClick={() => copyCode(offer.code)}
                  className="p-2 hover:bg-white rounded-lg border border-slate-200 text-slate-600 transition text-xs font-medium flex items-center gap-1"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Valid until {offer.valid_until}
              </span>
              <button
                onClick={() => setActiveTab('book')}
                className="text-[#1e3c72] font-bold hover:underline"
              >
                Use Code →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
