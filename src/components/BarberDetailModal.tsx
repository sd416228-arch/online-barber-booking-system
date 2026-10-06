import React, { useState } from 'react';
import { Barber, Review } from '../types';
import { useApp } from '../context/AppContext';
import { X, Star, Phone, Scissors, Calendar, Award, MessageSquare } from 'lucide-react';

export const BarberDetailModal: React.FC<{
  barber: Barber | null;
  onClose: () => void;
  onBook: (b: Barber) => void;
}> = ({ barber, onClose, onBook }) => {
  const { services, reviews, addReview, currentUser } = useApp();
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!barber) return null;

  const barberServices = services.filter(s => barber.service_ids.includes(s.id));
  const barberReviews = reviews.filter(r => r.barber_id === barber.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview({
      user_id: currentUser?.id || 'guest-user',
      user_name: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Valued Guest',
      barber_id: barber.id,
      rating: newRating,
      comment: comment.trim(),
    });
    setComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with image */}
        <div className="relative h-48 bg-gradient-to-r from-[#1e3c72] to-[#2a5298] p-6 text-white flex items-end justify-between">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-amber-400 text-slate-900 font-black text-2xl flex items-center justify-center border-4 border-white/20 shadow-lg shrink-0">
              {barber.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-black">{barber.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300" /> {barber.rating} ({barberReviews.length} reviews)
                </span>
                <span>•</span>
                <span>{barber.experience} Years Craft</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About The Barber</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{barber.bio}</p>
          </div>

          {/* Contact & Availability */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Direct Phone</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#1e3c72]" /> {barber.phone}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Availability</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Accepting New Bookings
              </span>
            </div>
          </div>

          {/* Services Provided */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Services Offered</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {barberServices.map(s => (
                <div key={s.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center bg-white shadow-xs">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{s.name}</h5>
                    <p className="text-[11px] text-slate-500">{s.duration} mins</p>
                  </div>
                  <span className="text-sm font-black text-[#1e3c72]">Rs. {s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Reviews */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Client Reviews ({barberReviews.length})
              </h4>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold text-[#1e3c72] hover:underline flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {showReviewForm ? 'Cancel Review' : 'Write Review'}
              </button>
            </div>

            {/* Review form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 focus:outline-none"
                      >
                        <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your haircut experience..."
                  required
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3c72] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1e3c72] hover:bg-[#2a5298] text-white font-bold text-xs rounded-lg transition"
                >
                  Submit Review
                </button>
              </form>
            )}

            {/* Reviews list */}
            <div className="space-y-3">
              {barberReviews.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No reviews yet for this barber.</p>
              ) : (
                barberReviews.map(r => (
                  <div key={r.id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{r.user_name}</span>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBook(barber);
            }}
            className="px-6 py-2.5 bg-[#1e3c72] hover:bg-[#2a5298] text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book with {barber.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
