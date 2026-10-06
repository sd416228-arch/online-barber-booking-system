import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Barber, Service } from '../types';
import { Calendar, Clock, User, Phone, Mail, CheckCircle2, Scissors, ShieldAlert, Sparkles } from 'lucide-react';

const TIME_SLOTS = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM',
  '05:30 PM', '06:30 PM', '07:30 PM'
];

export const BookingView: React.FC = () => {
  const {
    barbers,
    services,
    currentUser,
    selectedBarberForBooking,
    setSelectedBarberForBooking,
    selectedServiceForBooking,
    setSelectedServiceForBooking,
    createBooking,
    setActiveTab,
    offers,
  } = useApp();

  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    selectedBarberForBooking?.id || barbers[0]?.id || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    selectedServiceForBooking?.id || services[0]?.id || ''
  );
  const [bookingDate, setBookingDate] = useState<string>(
    () => new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [bookingTime, setBookingTime] = useState<string>(TIME_SLOTS[2]);
  const [clientName, setClientName] = useState<string>(
    currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : ''
  );
  const [clientEmail, setClientEmail] = useState<string>(
    currentUser ? currentUser.email : ''
  );
  const [clientPhone, setClientPhone] = useState<string>(
    currentUser?.phone || '+1 (555) 000-1122'
  );
  const [notes, setNotes] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const selectedBarber = barbers.find(b => b.id === selectedBarberId) || barbers[0];
  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const basePrice = selectedService ? selectedService.price : 0;
  const discountAmount = (basePrice * appliedDiscount) / 100;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  const handleApplyPromo = () => {
    const matched = offers.find(o => o.code.toUpperCase() === promoCode.trim().toUpperCase());
    if (matched) {
      setAppliedDiscount(matched.discount_percentage);
      setPromoMessage(`Promo code applied: ${matched.discount_percentage}% OFF!`);
    } else {
      setAppliedDiscount(0);
      setPromoMessage('Invalid promo code. Try "FIRSTCUT20" or "MIDWEEK15"');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !selectedBarber || !selectedService) {
      return;
    }

    createBooking({
      user_id: currentUser?.id || 'guest-user',
      user_name: clientName.trim(),
      user_email: clientEmail.trim(),
      user_phone: clientPhone.trim(),
      barber_id: selectedBarber.id,
      barber_name: selectedBarber.name,
      service_id: selectedService.id,
      service_name: selectedService.name,
      booking_date: bookingDate,
      booking_time: bookingTime,
      status: 'pending',
      notes: notes.trim() || undefined,
      total_price: finalPrice,
    });

    // Reset selection states
    setSelectedBarberForBooking(null);
    setSelectedServiceForBooking(null);
    // Go to user dashboard to view appointment
    setActiveTab('user-dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Easy Online Scheduler</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">Book Your Appointment</h1>
        <p className="text-slate-500 text-sm mt-2">
          Select your specialist, service, and convenient time slot. Pay in person at the barbershop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Booking Form */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Barber Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                1. Select Master Barber
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {barbers.map(barber => (
                  <button
                    type="button"
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col items-center text-center transition ${
                      selectedBarberId === barber.id
                        ? 'border-[#1e3c72] bg-blue-50/60 ring-2 ring-[#1e3c72]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center mb-2 border-2 border-white shadow-xs">
                      {barber.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{barber.name.split(' ')[0]}</span>
                    <span className="text-[11px] text-amber-600 font-semibold">★ {barber.rating}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                2. Select Grooming Service
              </label>
              <div className="space-y-2">
                {services.map(service => (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedServiceId === service.id
                        ? 'border-[#1e3c72] bg-blue-50/60 ring-2 ring-[#1e3c72]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="service"
                        checked={selectedServiceId === service.id}
                        onChange={() => setSelectedServiceId(service.id)}
                        className="text-[#1e3c72] focus:ring-[#1e3c72]"
                      />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{service.name}</span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" /> {service.duration} mins • {service.description.slice(0, 50)}...
                        </span>
                      </div>
                    </div>
                    <span className="text-base font-black text-[#1e3c72] shrink-0 ml-2">
                      Rs. {service.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  3. Select Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#1e3c72] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  4. Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {TIME_SLOTS.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setBookingTime(slot)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg text-center transition ${
                        bookingTime === slot
                          ? 'bg-[#1e3c72] text-white shadow'
                          : 'bg-white hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Contact Information */}
            <div className="space-y-4 pt-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                5. Guest Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1e3c72] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1e3c72] focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1e3c72] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <textarea
                  rows={2}
                  placeholder="Special requests, haircut preferences or taper specifications (optional)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#1e3c72] focus:outline-none"
                />
              </div>
            </div>

            {/* Step 5: Promo code */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FIRSTCUT20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1e3c72]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className={`text-xs mt-1 font-medium ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1e3c72] hover:bg-[#2a5298] text-white font-extrabold text-sm rounded-xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Confirm Appointment (Rs. {finalPrice})</span>
            </button>
          </form>
        </div>

        {/* Sticky Summary Card */}
        <div className="lg:col-span-4 sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100">
            Booking Summary
          </h3>

          {/* Barber summary */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center shrink-0 shadow-xs border border-amber-300">
              {selectedBarber ? selectedBarber.name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'BB'}
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Selected Specialist</p>
              <h4 className="text-sm font-bold text-slate-900">{selectedBarber?.name}</h4>
              <p className="text-xs text-amber-600 font-medium">★ {selectedBarber?.rating} Master Barber</p>
            </div>
          </div>

          {/* Service & Time details */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Service:</span>
              <span className="font-bold text-slate-800">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Duration:</span>
              <span className="font-bold text-slate-800">{selectedService?.duration} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date:</span>
              <span className="font-bold text-slate-800">{bookingDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Time:</span>
              <span className="font-bold text-[#1e3c72]">{bookingTime}</span>
            </div>
          </div>

          {/* Financial summary */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Standard Service Fee</span>
              <span>Rs. {basePrice.toFixed(0)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({appliedDiscount}%)</span>
                <span>-Rs. {discountAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Due</span>
              <span className="text-[#1e3c72]">Rs. {finalPrice.toFixed(0)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50 border border-amber-200/60 p-3 rounded-lg leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Pay in cash or credit card directly at the shop when your haircut is complete. Free cancellation anytime.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
