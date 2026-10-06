import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Barber, Service, BookingStatus } from '../types';
import {
  Shield, Users, Scissors, Banknote, Calendar, Plus, Edit,
  Trash2, CheckCircle2, Clock, XCircle, Search, Star
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    bookings,
    barbers,
    services,
    updateBookingStatus,
    deleteBooking,
    addBarber,
    updateBarber,
    deleteBarber,
    addService,
    updateService,
    deleteService,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'bookings' | 'barbers' | 'services'>('bookings');
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showAddBarberModal, setShowAddBarberModal] = useState<boolean>(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState<boolean>(false);

  // New Barber Form State
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberExp, setNewBarberExp] = useState(5);
  const [newBarberBio, setNewBarberBio] = useState('');
  const [newBarberPhoto, setNewBarberPhoto] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80');
  const [newBarberPhone, setNewBarberPhone] = useState('+1 (555) 000-0000');

  // New Service Form State
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(30);
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceImg, setNewServiceImg] = useState('https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80');

  // Stats calculation
  const totalRevenue = bookings
    .filter(b => b.status === 'completed' || b.status === 'confirmed')
    .reduce((acc, curr) => acc + curr.total_price, 0);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = bookingFilter === 'all' || b.status === bookingFilter;
    const matchesSearch =
      b.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.barber_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName.trim()) return;
    addBarber({
      name: newBarberName.trim(),
      experience: Number(newBarberExp),
      bio: newBarberBio.trim() || 'Professional master barber dedicated to customer satisfaction.',
      photo: newBarberPhoto.trim(),
      rating: 5.0,
      phone: newBarberPhone.trim(),
      is_available: true,
      service_ids: services.map(s => s.id).slice(0, 3),
    });
    setNewBarberName('');
    setNewBarberBio('');
    setShowAddBarberModal(false);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    addService({
      name: newServiceName.trim(),
      description: newServiceDesc.trim() || 'Premium service using organic styling materials.',
      price: Number(newServicePrice),
      duration: Number(newServiceDuration),
      image: newServiceImg.trim(),
      is_active: true,
    });
    setNewServiceName('');
    setNewServiceDesc('');
    setShowAddServiceModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-[#1e3c72] text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <Shield className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-black mt-1">Barbershop Management</h1>
          <p className="text-slate-200 text-sm mt-1">
            Real-time appointment schedule, barber rosters, and catalog configuration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBarberModal(true)}
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Barber
          </button>
          <button
            onClick={() => setShowAddServiceModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/20 transition"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase">Gross Revenue</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">Rs. {totalRevenue.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-400 mt-1">From confirmed appointments</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total Bookings</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{bookings.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Across all clients</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase">Staff Barbers</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{barbers.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Active team members</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase">Catalog Services</span>
            <Scissors className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{services.length}</h3>
          <p className="text-[11px] text-slate-400 mt-1">Available to book</p>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveSection('bookings')}
          className={`pb-3 border-b-2 transition ${
            activeSection === 'bookings'
              ? 'border-[#1e3c72] text-[#1e3c72]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Appointments ({bookings.length})
        </button>
        <button
          onClick={() => setActiveSection('barbers')}
          className={`pb-3 border-b-2 transition ${
            activeSection === 'barbers'
              ? 'border-[#1e3c72] text-[#1e3c72]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Barbers ({barbers.length})
        </button>
        <button
          onClick={() => setActiveSection('services')}
          className={`pb-3 border-b-2 transition ${
            activeSection === 'services'
              ? 'border-[#1e3c72] text-[#1e3c72]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Services ({services.length})
        </button>
      </div>

      {/* Bookings Management Panel */}
      {activeSection === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Controls */}
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-2.5 py-1 rounded-md font-semibold capitalize ${
                      bookingFilter === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3c72]"
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">ID / Client</th>
                  <th className="p-3.5">Barber</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Fee</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{b.user_name}</div>
                      <div className="text-[11px] text-slate-400">{b.user_phone} • {b.user_email}</div>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">{b.barber_name}</td>
                    <td className="p-3.5 font-medium text-slate-800">{b.service_name}</td>
                    <td className="p-3.5 text-slate-600">
                      <div>{b.booking_date}</div>
                      <div className="font-semibold text-[#1e3c72]">{b.booking_time}</div>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">Rs. {b.total_price}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        b.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'completed')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700"
                        >
                          Complete
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-200"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Barbers Management Panel */}
      {activeSection === 'barbers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barbers.map(barber => (
            <div key={barber.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e3c72] to-[#14284d] flex items-center justify-center text-amber-400 font-black text-lg shrink-0 border border-white/20 shadow-xs">
                  {barber.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{barber.name}</h4>
                  <p className="text-xs text-slate-500">{barber.experience} yrs exp • ★ {barber.rating}</p>
                  <p className="text-xs text-slate-600 mt-1">{barber.phone}</p>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      barber.is_available ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {barber.is_available ? 'Active & Available' : 'Off Duty'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => updateBarber(barber.id, { is_available: !barber.is_available })}
                  className="text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Toggle Availability
                </button>
                <button
                  onClick={() => deleteBarber(barber.id)}
                  className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Services Management Panel */}
      {activeSection === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#1e3c72] shrink-0">
                  <Scissors className="w-7 h-7 text-[#1e3c72]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{service.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{service.duration} mins session</p>
                  <p className="text-lg font-black text-[#1e3c72] mt-1">Rs. {service.price}</p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">ID: #{service.id}</span>
                <button
                  onClick={() => deleteService(service.id)}
                  className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Barber Modal */}
      {showAddBarberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Master Barber</h3>
            <form onSubmit={handleCreateBarber} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Barber Name</label>
                <input
                  type="text"
                  required
                  value={newBarberName}
                  onChange={(e) => setNewBarberName(e.target.value)}
                  placeholder="e.g. Liam Walker"
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Years Experience</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newBarberExp}
                    onChange={(e) => setNewBarberExp(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newBarberPhone}
                    onChange={(e) => setNewBarberPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Photo URL</label>
                <input
                  type="url"
                  required
                  value={newBarberPhoto}
                  onChange={(e) => setNewBarberPhoto(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bio / Specialties</label>
                <textarea
                  rows={3}
                  value={newBarberBio}
                  onChange={(e) => setNewBarberBio(e.target.value)}
                  placeholder="Artisan scissor work and beard specialist..."
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBarberModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3c72] text-white rounded-lg font-bold"
                >
                  Save Barber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add New Grooming Service</h3>
            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="e.g. Deluxe Scalp Treatment"
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="10"
                    step="5"
                    required
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newServiceImg}
                  onChange={(e) => setNewServiceImg(e.target.value)}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Description of the service steps..."
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3c72] text-white rounded-lg font-bold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
