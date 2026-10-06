import React from 'react';
import { Scissors, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-[#10203e] text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-[#1e3c72]">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">ONLINE BARBER</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium grooming tailored for modern gentlemen. Experience world-class fades, classic shaves, and artisan beard craft.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-slate-900 transition">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-amber-400 transition">Home</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('barbers')} className="hover:text-amber-400 transition">Meet Our Barbers</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-amber-400 transition">Services & Pricing</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('book')} className="hover:text-amber-400 transition">Book Appointment</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('offers')} className="hover:text-amber-400 transition">Promotions & Offers</button>
              </li>
            </ul>
          </div>

          {/* Working hours */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Operating Hours</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="text-white font-medium">9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="text-white font-medium">9:00 AM - 7:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
              </li>
              <li className="pt-2 text-xs text-amber-400">
                ★ Walk-ins welcome based on barber availability
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact & Shop</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 mt-1 shrink-0" />
                <span>142 Market Street, Suite 2B, San Francisco, CA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+1 (555) 019-2831</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@onlinebarber.internal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Online Barber Booking System. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Barber Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
