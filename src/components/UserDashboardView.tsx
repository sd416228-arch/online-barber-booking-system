import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, BookingStatus } from '../types';
import {
  Calendar, Clock, Scissors, User as UserIcon, AlertCircle, CheckCircle,
  XCircle, Plus, Star, MapPin, Phone, ShieldCheck
} from 'lucide-react';

export const UserDashboardView: React.FC<{
  onBookNew: () => void;
  onOpenReviewModal: (barberId: string) => void;
}> = ({ onBookNew, onOpenReviewModal }) => {
  const { currentUser, bookings, cancelBooking, barbers, setActiveTab } = useApp();
  const [filter, setFilter] = useState<string>('all');

  // Filter bookings belonging to this user or all in demo
  const userBookings = bookings.filter(b =>
    !currentUser || b.user_id === currentUser.id || b.user_email === currentUser.email
  );

  const filteredBookings = filter === 'all'
    ? userBookings
    : userBookings.filter(b => b.status === filter);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">Client Dashboard</span>
          <h1 className="text-3xl font-black mt-1">
            Welcome back, {currentUser?.first_name || 'Valued Guest'}!
          </h1>
          <p className="text-slate-200 text-sm mt-1">
            Manage your barber bookings, track service history, and review appointments.
          </p>
        </div>
        <button
          onClick={onBookNew}
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</p>
          <h3 className="text-2xl font-black text-slate-800 mt-1">{userBookings.length}</h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Upcoming & Active</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">
            {userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Completed Services</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">
            {userBookings.filter(b => b.status === 'completed').length}
          </h3>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table header & filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">My Appointments</h3>
            <p className="text-xs text-slate-500">Scheduled visits and grooming sessions</p>
          </div>
          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                  filter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-700">No appointments found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any {filter !== 'all' ? filter : ''} appointments currently listed.
            </p>
            <button
              onClick={onBookNew}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e3c72] text-white text-xs font-semibold rounded-lg"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredBookings.map((b) => {
              const barber = barbers.find(barb => barb.id === b.barber_id);

              return (
                <div key={b.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50/60 transition">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3c72] to-[#14284d] flex items-center justify-center text-amber-400 font-black text-sm shrink-0 border border-white/20 shadow-xs">
                      {b.barber_name ? b.barber_name.split(' ').map(n => n[0]).slice(0, 2).join('') : 'BB'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-900 text-base">{b.service_name}</h4>
                        {getStatusBadge(b.status)}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Master Barber: <span className="text-slate-900 font-semibold">{b.barber_name}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#1e3c72]" /> {b.booking_date}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-[#1e3c72]" /> {b.booking_time}
                        </span>
                        <span className="font-bold text-[#1e3c72]">
                          Total: Rs. {b.total_price}
                        </span>
                      </div>
                      {b.notes && (
                        <p className="text-[11px] text-slate-400 italic pt-0.5">
                          Note: "{b.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    {b.status === 'completed' && (
                      <button
                        onClick={() => onOpenReviewModal(b.barber_id)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-lg transition"
                      >
                        Cancel Booking
                      </button>
                    )}

                    <span className="text-[11px] text-slate-400 font-mono">
                      #{b.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* User profile card */}
      {currentUser && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Account Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Full Name</span>
              <span className="font-semibold text-slate-800">{currentUser.first_name} {currentUser.last_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Email Address</span>
              <span className="font-semibold text-slate-800">{currentUser.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Contact Phone</span>
              <span className="font-semibold text-slate-800">{currentUser.phone || 'N/A'}</span>
            </div>
            {currentUser.address && (
              <div className="sm:col-span-3">
                <span className="text-slate-400 block mb-0.5">Default Address</span>
                <span className="font-semibold text-slate-800">{currentUser.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
