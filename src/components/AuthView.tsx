import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Scissors, Shield, User, Lock, Mail, Phone, CheckCircle2 } from 'lucide-react';

export const AuthView: React.FC<{ initialMode?: 'login' | 'register' | 'barber' | 'admin' }> = ({ initialMode = 'login' }) => {
  const { loginAs, setCurrentUser, showToast, setActiveTab } = useApp();
  const [mode, setMode] = useState<'login' | 'register' | 'barber' | 'admin'>(initialMode);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'admin') {
      loginAs('admin');
      showToast('Admin authenticated successfully.');
      setActiveTab('admin-dashboard');
      return;
    }

    if (mode === 'barber') {
      loginAs('barber');
      showToast('Master Barber signed in to Chair #1 Studio.');
      setActiveTab('barber-dashboard');
      return;
    }

    if (mode === 'register') {
      const newUser = {
        id: `u-${Date.now()}`,
        username: username || 'new_user',
        email: email || 'user@example.com',
        first_name: firstName || 'Valued',
        last_name: lastName || 'Guest',
        role: 'user' as const,
        phone: phone || '+1 (555) 000-0000',
      };
      setCurrentUser(newUser);
      showToast(`Welcome, ${newUser.first_name}! Your account has been created.`);
      setActiveTab('user-dashboard');
      return;
    }

    // Regular login
    loginAs('user');
    showToast('Signed in successfully.');
    setActiveTab('user-dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] p-8 text-white text-center">
        <div className="w-12 h-12 rounded-full bg-amber-400 text-[#1e3c72] flex items-center justify-center mx-auto mb-3 shadow">
          {mode === 'admin' ? <Shield className="w-6 h-6" /> : <Scissors className="w-6 h-6" />}
        </div>
        <h2 className="text-2xl font-black">
          {mode === 'admin' ? 'Admin Portal' : mode === 'barber' ? 'Barber Studio Login' : mode === 'register' ? 'Create Account' : 'Guest Sign In'}
        </h2>
        <p className="text-xs text-slate-200 mt-1">
          {mode === 'admin'
            ? 'Restricted to system managers & shop owners'
            : mode === 'barber'
            ? 'Access your daily chair schedule and live client queue'
            : mode === 'register'
            ? 'Join to book, cancel, and review haircuts anytime'
            : 'Access your upcoming appointments and history'}
        </p>

        {/* Mode switcher tabs */}
        <div className="flex bg-slate-900/40 p-1 rounded-xl text-xs font-semibold mt-6">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-1.5 rounded-lg transition ${mode === 'login' ? 'bg-white text-slate-900' : 'text-slate-200'}`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setMode('barber')}
            className={`flex-1 py-1.5 rounded-lg transition ${mode === 'barber' ? 'bg-amber-400 text-slate-900' : 'text-slate-200'}`}
          >
            Barber
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-1.5 rounded-lg transition ${mode === 'register' ? 'bg-white text-slate-900' : 'text-slate-200'}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setMode('admin')}
            className={`flex-1 py-1.5 rounded-lg transition ${mode === 'admin' ? 'bg-amber-400 text-slate-900' : 'text-slate-200'}`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8 space-y-4 text-xs">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full p-2.5 bg-slate-50 border rounded-lg"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-slate-600 font-semibold mb-1">Username</label>
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={mode === 'admin' ? 'admin' : 'alex_turner'}
              className="w-full pl-8 p-2.5 bg-slate-50 border rounded-lg"
            />
          </div>
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-8 p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full pl-8 p-2.5 bg-slate-50 border rounded-lg"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-slate-600 font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-8 p-2.5 bg-slate-50 border rounded-lg"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold rounded-xl shadow transition text-xs mt-2"
        >
          {mode === 'admin' ? 'Enter Admin Panel' : mode === 'register' ? 'Complete Registration' : 'Log In'}
        </button>

        {/* Quick Demo Instant Buttons */}
        <div className="pt-4 border-t border-slate-100 text-center space-y-2">
          <span className="text-[11px] text-slate-400 block font-semibold uppercase">Or One-Click Demo Login:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => loginAs('user')}
              className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold border border-emerald-200 text-xs"
            >
              Client (Alex)
            </button>
            <button
              type="button"
              onClick={() => loginAs('barber')}
              className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg font-bold border border-blue-200 text-xs"
            >
              Barber (Marcus)
            </button>
            <button
              type="button"
              onClick={() => loginAs('admin')}
              className="py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg font-bold border border-amber-200 text-xs"
            >
              Admin Master
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
