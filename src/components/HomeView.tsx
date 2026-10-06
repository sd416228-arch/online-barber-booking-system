import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Clock, CheckCircle2, Users, Scissors, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Barber, Service } from '../types';

export const HomeView: React.FC<{
  onSelectBarberForDetail: (b: Barber) => void;
  onBookWithBarber: (b: Barber) => void;
  onBookWithService: (s: Service) => void;
}> = ({ onSelectBarberForDetail, onBookWithBarber, onBookWithService }) => {
  const { barbers, services, currentUser, setActiveTab, offers } = useApp();

  const featuredBarbers = barbers.slice(0, 3);
  const featuredServices = services.slice(0, 3);
  const activeOffer = offers[0];

  return (
    <div className="space-y-16">
      {/* Hero Section (directly based on Django index.html) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white p-8 md:p-14 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ULTIMATE GROOMING DESTINATION</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Welcome to <span className="text-amber-400">Online Barber</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed max-w-2xl">
              Book your perfect haircut with the best barbers in town. Fast, easy, and reliable barbering services at your convenience.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActiveTab('book')}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-7 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                <span>Book Appointment</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('barbers')}
                className="border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl transition text-base"
              >
                Explore Barbers
              </button>
            </div>

            {/* Quick trust cues */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant confirmation</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> No hidden fees</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free cancellations</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div className="relative rounded-2xl bg-[#14284d] border border-amber-400/30 p-8 shadow-2xl flex flex-col justify-between h-[360px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-300">Station Chair #1</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <div className="text-center py-4 space-y-3">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-400/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow">
                    <Scissors className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide">ROYAL GROOMING</h3>
                  <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                    Precision scissor craft, traditional straight razor hot towel shaves, and sharp skin fades.
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-white/10 rounded-xl p-3.5 shadow-xl text-left text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
                    ★ 5.0
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Master Barber Craft</p>
                    <p className="text-[11px] text-slate-400">Over 3,500+ happy clients in Nepal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section (matching Django template cards) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-center hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1e3c72] mx-auto flex items-center justify-center mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{barbers.length}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Expert Barbers</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-center hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1e3c72] mx-auto flex items-center justify-center mb-3">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">{services.length}</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Services Available</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-center hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-3">
            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">4.9</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Average Rating</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-center hover:shadow-md transition">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">100%</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Satisfaction Rate</p>
        </div>
      </section>

      {/* Featured Barbers Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Featured Barbers</h2>
            <p className="text-slate-500 text-sm">Hand-picked master barbers with verified guest reviews</p>
          </div>
          <button
            onClick={() => setActiveTab('barbers')}
            className="text-sm font-semibold text-[#1e3c72] hover:text-[#2a5298] flex items-center gap-1 group"
          >
            <span>View All Barbers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredBarbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col group"
            >
              <div className="relative h-44 bg-gradient-to-br from-[#1e3c72] to-[#14284d] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                  {barber.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow">
                  <Star className="w-3.5 h-3.5 fill-slate-900" />
                  <span>{barber.rating}</span>
                </div>
                {barber.is_available && (
                  <div className="absolute bottom-3 left-3 bg-emerald-500 text-white font-semibold px-2 py-0.5 rounded text-[11px] shadow">
                    Available Today
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{barber.name}</h3>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {barber.experience} years master experience
                  </p>
                  <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                    {barber.bio}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectBarberForDetail(barber)}
                    className="flex-1 py-2 px-3 border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold rounded-lg transition"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onBookWithBarber(barber)}
                    className="flex-1 py-2 px-3 bg-[#1e3c72] hover:bg-[#2a5298] text-white text-xs font-semibold rounded-lg transition shadow-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offer Highlight Banner */}
      {activeOffer && (
        <section className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 rounded-2xl p-6 md:p-8 text-slate-900 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Special Promotion
            </span>
            <h3 className="text-2xl font-black">{activeOffer.title}</h3>
            <p className="text-sm font-medium text-slate-800 max-w-xl">
              {activeOffer.description} Use code <span className="font-mono bg-white px-2 py-0.5 rounded font-bold border border-slate-400/30">{activeOffer.code}</span>
            </p>
          </div>
          <button
            onClick={() => setActiveTab('book')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm whitespace-nowrap shadow transition"
          >
            Claim {activeOffer.discount_percentage}% Discount
          </button>
        </section>
      )}

      {/* Services Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Our Services</h2>
            <p className="text-slate-500 text-sm">Professional haircuts, beard styling, and hot lather treatments</p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="text-sm font-semibold text-[#1e3c72] hover:text-[#2a5298] flex items-center gap-1 group"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="h-28 bg-gradient-to-r from-slate-100 to-amber-50/50 p-5 flex items-center justify-between border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-[#1e3c72] text-amber-400 flex items-center justify-center font-black shadow">
                  <Scissors className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  <Clock className="w-3 h-3 inline mr-1 text-[#1e3c72]" /> {service.duration} mins
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xl font-black text-[#1e3c72]">Rs. {service.price}</span>
                    <span className="text-xs text-slate-400 ml-2 font-medium flex items-center inline-flex gap-1">
                      <Clock className="w-3 h-3" /> {service.duration} mins
                    </span>
                  </div>
                  <button
                    onClick={() => onBookWithService(service)}
                    className="bg-[#1e3c72] hover:bg-[#2a5298] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section (matching Django template) */}
      <section className="bg-slate-100 rounded-2xl p-8 md:p-12 text-center border border-slate-200">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">Ready to Book Your Appointment?</h3>
        <p className="text-slate-600 max-w-xl mx-auto mb-6 text-sm md:text-base">
          Experience first-class grooming tailored to your style. Select your preferred barber and convenient time slot in under 60 seconds.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setActiveTab('book')}
            className="bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
          >
            Book Appointment Now
          </button>
          {!currentUser && (
            <button
              onClick={() => setActiveTab('register')}
              className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold px-6 py-3.5 rounded-xl transition"
            >
              Create Account
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
