import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus } from '../types';
import {
  Calendar, Clock, CheckCircle2, XCircle, Banknote, Users,
  Scissors, AlertCircle, Plus, ChevronRight, User, Phone, Check, Shield
} from 'lucide-react';

export const BarberDashboardView: React.FC = () => {
  const {
    currentUser,
    bookings,
    updateBookingStatus,
    barbers,
    updateBarber,
    services,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'appointments' | 'calendar' | 'services' | 'earnings' | 'schedule'>('today');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Match the barber profile for this user (default to b-1 Marcus Vance)
  const currentBarberId = currentUser?.barber_id || 'b-1';
  const currentBarber = barbers.find(b => b.id === currentBarberId) || barbers[0];

  // Bookings belonging to this barber
  const barberBookings = bookings.filter(b => b.barber_id === currentBarber.id);

  // Today's bookings (2026-10-06)
  const todayStr = '2026-10-06';
  const todaysAppointments = barberBookings
    .filter(b => b.booking_date === todayStr)
    .sort((a, b) => a.booking_time.localeCompare(b.booking_time));

  // Upcoming appointments (beyond today)
  const upcomingAppointments = barberBookings
    .filter(b => b.booking_date > todayStr)
    .sort((a, b) => a.booking_date.localeCompare(b.booking_date) || a.booking_time.localeCompare(b.booking_time));

  // Today's revenue (confirmed + completed)
  const todaysRevenue = todaysAppointments
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.total_price, 0);

  const completedTodayCount = todaysAppointments.filter(b => b.status === 'completed').length;
  const pendingCount = barberBookings.filter(b => b.status === 'pending').length;
  const uniqueClientsCount = new Set(barberBookings.map(b => b.user_email || b.user_name)).size;

  const totalAllTimeRevenue = barberBookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.total_price, 0);

  const filteredBookings = statusFilter === 'all'
    ? barberBookings
    : barberBookings.filter(b => b.status === statusFilter);

  // Working days mock schedule state
  const [scheduleState, setScheduleState] = useState([
    { day: 'Monday', open: '09:00', close: '18:00', breakStart: '13:00', breakEnd: '14:00', isOff: false },
    { day: 'Tuesday', open: '09:00', close: '18:00', breakStart: '13:00', breakEnd: '14:00', isOff: false },
    { day: 'Wednesday', open: '09:00', close: '18:00', breakStart: '13:00', breakEnd: '14:00', isOff: false },
    { day: 'Thursday', open: '09:00', close: '19:00', breakStart: '13:00', breakEnd: '14:00', isOff: false },
    { day: 'Friday', open: '09:00', close: '20:00', breakStart: '13:00', breakEnd: '14:00', isOff: false },
    { day: 'Saturday', open: '09:00', close: '18:00', breakStart: '13:00', breakEnd: '14:00', isOff: false },
    { day: 'Sunday', open: '10:00', close: '16:00', breakStart: '13:00', breakEnd: '14:00', isOff: true },
  ]);

  return (
    <div className="space-y-8">
      {/* Barber Studio Hero Header */}
      <div className="bg-[#1e3c72] text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center border-2 border-white/20 shadow-md">
              {currentBarber.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">Barber Command Center</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-200">Chair #1 Flagship</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black mt-1">{currentBarber.name}</h1>
            <p className="text-slate-200 text-xs mt-1">
              ★ {currentBarber.rating} Rating &bull; {currentBarber.experience} Yrs Craft &bull; {currentBarber.phone}
            </p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="bg-slate-900/60 border border-white/10 p-3 rounded-xl flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Chair Booking Status</span>
            <span className={`font-bold flex items-center gap-1.5 mt-0.5 ${currentBarber.is_available ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${currentBarber.is_available ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              {currentBarber.is_available ? 'Accepting Appointments' : 'Chair Paused'}
            </span>
          </div>
          <button
            onClick={() => updateBarber(currentBarber.id, { is_available: !currentBarber.is_available })}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition"
          >
            Toggle
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase">Today's Revenue</span>
            <Banknote className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">Rs. {todaysRevenue.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-1">From confirmed/completed cuts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase">Today's Schedule</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{todaysAppointments.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Clients on roster today</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase">Completed Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">{completedTodayCount}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Chair throughput</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase">Action Required</span>
            <AlertCircle className={`w-4 h-4 ${pendingCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <h3 className={`text-2xl font-black mt-2 ${pendingCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
            {pendingCount}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Pending approval requests</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs sm:text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'today' ? 'border-[#1e3c72] text-[#1e3c72]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Today's Timeline ({todaysAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'appointments' ? 'border-[#1e3c72] text-[#1e3c72]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Appointments ({barberBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'calendar' ? 'border-[#1e3c72] text-[#1e3c72]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          7-Day Week Calendar
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'services' ? 'border-[#1e3c72] text-[#1e3c72]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Services & Rates
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'schedule' ? 'border-[#1e3c72] text-[#1e3c72]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Working Hours & Breaks
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'earnings' ? 'border-[#1e3c72] text-[#1e3c72]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Earnings & Run-Rate
        </button>
      </div>

      {/* VIEW 1: TODAY'S TIMELINE (PRIORITIZED) */}
      {activeTab === 'today' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Live Chair Queue</span>
              <h2 className="text-xl font-black text-slate-900 mt-0.5">TODAY &bull; October 06, 2026</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Chronological Order
            </span>
          </div>

          <div className="space-y-4">
            {todaysAppointments.map((appt) => (
              <div
                key={appt.id}
                className={`p-5 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
                  appt.status === 'confirmed'
                    ? 'border-blue-200 bg-blue-50/20'
                    : appt.status === 'completed'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : appt.status === 'pending'
                    ? 'border-amber-200 bg-amber-50/30'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Big Time Block */}
                  <div className="bg-slate-900 text-white p-3 rounded-xl text-center min-w-[80px] shrink-0 shadow-xs">
                    <span className="text-base font-black block text-amber-400">{appt.booking_time}</span>
                    <span className="text-[10px] text-slate-300 block">30-45 min</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-black text-slate-900">{appt.user_name}</h4>
                      <span className="text-xs text-slate-400 font-mono">#{appt.id}</span>
                    </div>
                    <p className="text-xs font-semibold text-[#1e3c72]">
                      {appt.service_name} &bull; <span className="font-black">Rs. {appt.total_price}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span><Phone className="w-3 h-3 inline mr-1" />{appt.user_phone}</span>
                      <span>&bull;</span>
                      <span>{appt.user_email}</span>
                    </p>
                    {appt.notes && (
                      <p className="text-xs text-slate-600 bg-white/80 p-1.5 rounded-lg border border-slate-200/60 mt-1 inline-block">
                        <strong>Notes:</strong> "{appt.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      appt.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : appt.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : appt.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {appt.status}
                  </span>

                  {appt.status === 'pending' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateBookingStatus(appt.id, 'confirmed')}
                        className="px-3 py-1.5 bg-[#1e3c72] hover:bg-[#2a5298] text-white text-xs font-bold rounded-lg shadow-xs transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(appt.id, 'cancelled')}
                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {appt.status === 'confirmed' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => updateBookingStatus(appt.id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Mark Done
                      </button>
                      <button
                        onClick={() => updateBookingStatus(appt.id, 'cancelled')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition"
                      >
                        No-Show
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {todaysAppointments.length === 0 && (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Calendar className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="text-sm font-bold text-slate-600">No appointments scheduled for today</h4>
                <p className="text-xs">Your chair is ready for walk-ins.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: ALL APPOINTMENTS LEDGER */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-slate-900">All Appointment Records</h3>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold capitalize transition ${
                    statusFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredBookings.map((b) => (
              <div key={b.id} className="py-4 flex justify-between items-center gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400">#{b.id}</span>
                    <strong className="text-sm text-slate-900 font-bold">{b.user_name}</strong>
                    <span className="text-slate-500">({b.user_phone})</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">
                    Service: <span className="font-semibold text-slate-800">{b.service_name}</span> &bull; Rs. {b.total_price}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    Date: {b.booking_date} at {b.booking_time}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {b.status}
                  </span>

                  {b.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'confirmed')}
                      className="px-2.5 py-1 bg-[#1e3c72] text-white rounded font-bold"
                    >
                      Accept
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(b.id, 'completed')}
                      className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: 7-DAY CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">7-Day Week Capacity</h3>
          <p className="text-xs text-slate-500">Overview of client load across upcoming days</p>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-3 pt-2">
            {[
              { day: 'Mon', date: 'Oct 05', count: 1 },
              { day: 'Tue', date: 'Oct 06', count: 3, today: true },
              { day: 'Wed', date: 'Oct 07', count: 1 },
              { day: 'Thu', date: 'Oct 08', count: 1 },
              { day: 'Fri', date: 'Oct 09', count: 2 },
              { day: 'Sat', date: 'Oct 10', count: 4 },
              { day: 'Sun', date: 'Oct 11', count: 0, off: true },
            ].map((d) => (
              <div
                key={d.day}
                className={`p-4 rounded-xl border text-center flex flex-col justify-between h-44 ${
                  d.today
                    ? 'border-[#1e3c72] bg-blue-50/50 ring-2 ring-[#1e3c72]'
                    : d.off
                    ? 'border-slate-200 bg-slate-50/70 text-slate-400'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400 block">{d.day}</span>
                  <strong className="text-sm font-black text-slate-900 block">{d.date}</strong>
                  {d.today && (
                    <span className="inline-block mt-1 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                      TODAY
                    </span>
                  )}
                </div>

                <div className="py-2">
                  <span className="text-2xl font-black text-slate-800">{d.count}</span>
                  <span className="text-[11px] text-slate-400 block">Appointments</span>
                </div>

                <span className={`text-[10px] font-bold ${d.off ? 'text-rose-500' : 'text-emerald-600'}`}>
                  {d.off ? 'Day Off' : 'Open (9am-6pm)'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: SERVICES & RATES */}
      {activeTab === 'services' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Chair Offerings & Pricing</h3>
              <p className="text-xs text-slate-500">Services linked to your master profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => {
              const isOffered = currentBarber.service_ids.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border flex justify-between items-center ${
                    isOffered ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 bg-white opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[#1e3c72]">
                      <Scissors className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                      <p className="text-xs text-slate-500">{s.duration} mins session</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-[#1e3c72]">Rs. {s.price}</span>
                    <button
                      onClick={() => {
                        const newIds = isOffered
                          ? currentBarber.service_ids.filter(id => id !== s.id)
                          : [...currentBarber.service_ids, s.id];
                        updateBarber(currentBarber.id, { service_ids: newIds });
                      }}
                      className={`block text-[11px] font-bold mt-1 px-2.5 py-1 rounded ${
                        isOffered ? 'bg-rose-50 text-rose-700' : 'bg-[#1e3c72] text-white'
                      }`}
                    >
                      {isOffered ? 'Remove' : 'Offer'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 5: SCHEDULE & BREAKS */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Weekly Operating Hours & Breaks</h3>
            <p className="text-xs text-slate-500">
              The dynamic slot engine calculates open appointments strictly within these boundaries.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Day of Week</th>
                  <th className="p-3">Open Time</th>
                  <th className="p-3">Close Time</th>
                  <th className="p-3">Lunch Break</th>
                  <th className="p-3">Day Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduleState.map((row, idx) => (
                  <tr key={row.day}>
                    <td className="p-3 font-bold text-slate-900">{row.day}</td>
                    <td className="p-3">
                      <input
                        type="time"
                        value={row.open}
                        disabled={row.isOff}
                        onChange={(e) => {
                          const updated = [...scheduleState];
                          updated[idx].open = e.target.value;
                          setScheduleState(updated);
                        }}
                        className="p-1 border rounded"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="time"
                        value={row.close}
                        disabled={row.isOff}
                        onChange={(e) => {
                          const updated = [...scheduleState];
                          updated[idx].close = e.target.value;
                          setScheduleState(updated);
                        }}
                        className="p-1 border rounded"
                      />
                    </td>
                    <td className="p-3">
                      <span className="text-slate-600">
                        {row.isOff ? 'N/A' : `${row.breakStart} - ${row.breakEnd}`}
                      </span>
                    </td>
                    <td className="p-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={row.isOff}
                          onChange={(e) => {
                            const updated = [...scheduleState];
                            updated[idx].isOff = e.target.checked;
                            setScheduleState(updated);
                          }}
                        />
                        <span className="text-[11px] text-slate-600">{row.isOff ? 'Off' : 'Working'}</span>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 6: EARNINGS ANALYTICS */}
      {activeTab === 'earnings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Studio Financial Summary</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase">Total Realized Revenue</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Rs. {totalAllTimeRevenue.toLocaleString()}</h2>
              <p className="text-xs text-amber-700 mt-1">Across all completed appointments</p>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-xs font-bold text-blue-800 uppercase">Unique Clients Served</span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">{uniqueClientsCount}</h2>
              <p className="text-xs text-blue-700 mt-1">Returning & new clients</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
