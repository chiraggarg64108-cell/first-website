import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { Star, Heart, ThumbsUp, Sparkles, Music, ShieldCheck, DollarSign, X } from 'lucide-react';

interface RatingModalProps {
  onClose: () => void;
}

const COMPLIMENT_OPTIONS = [
  { label: 'Clean Taxi', icon: Sparkles },
  { label: 'Smooth Driving', icon: ShieldCheck },
  { label: 'Great Music', icon: Music },
  { label: 'Friendly & Polite', icon: Heart },
  { label: 'Quickest Route', icon: ThumbsUp }
];

const TIP_OPTIONS = [0, 2, 4, 6, 10];

export const RatingModal: React.FC<RatingModalProps> = ({ onClose }) => {
  const { currentTrip, submitTripReview } = useRide();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedTip, setSelectedTip] = useState<number>(3);
  const [customTip, setCustomTip] = useState<string>('');
  const [selectedCompliments, setSelectedCompliments] = useState<string[]>(['Clean Taxi', 'Smooth Driving']);
  const [feedback, setFeedback] = useState<string>('');

  if (!currentTrip) return null;

  const toggleCompliment = (label: string) => {
    setSelectedCompliments(prev => 
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label]
    );
  };

  const finalTip = customTip ? parseFloat(customTip) || 0 : selectedTip;

  const handleSubmit = () => {
    submitTripReview(rating, finalTip, selectedCompliments, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-neutral-100">
        {/* Top Header */}
        <div className="p-6 text-center border-b border-neutral-800 bg-neutral-950/40">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {currentTrip.driver && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <img
                  src={currentTrip.driver.avatar}
                  alt={currentTrip.driver.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 p-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 text-neutral-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  ★ {currentTrip.driver.rating.toFixed(2)}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">How was your trip with {currentTrip.driver.name}?</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {currentTrip.driver.vehicle.model} · {currentTrip.driver.vehicle.plate}
              </p>
            </div>
          )}

          {/* Interactive Star Rating */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map(star => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      active
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                        : 'text-neutral-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-xs font-semibold text-yellow-400 block mt-2">
            {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Okay' : 'Needs Improvement'}
          </span>
        </div>

        {/* Compliments & Tip */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Compliments */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2.5">
              Add Compliments for your driver
            </label>
            <div className="flex flex-wrap gap-2">
              {COMPLIMENT_OPTIONS.map(c => {
                const Icon = c.icon;
                const isSelected = selectedCompliments.includes(c.label);
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => toggleCompliment(c.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-yellow-400 text-neutral-950 font-bold shadow-md shadow-yellow-400/20'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tip Section */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Add a Driver Tip
              </label>
              <span className="text-xs text-neutral-500">100% goes directly to driver</span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-2">
              {TIP_OPTIONS.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setSelectedTip(amount);
                    setCustomTip('');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedTip === amount && !customTip
                      ? 'bg-yellow-400 text-neutral-950'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  {amount === 0 ? 'No tip' : `$${amount}`}
                </button>
              ))}
            </div>

            <input
              type="number"
              placeholder="Custom tip amount ($)"
              value={customTip}
              onChange={e => {
                setCustomTip(e.target.value);
                setSelectedTip(-1);
              }}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 font-mono"
            />
          </div>

          {/* Feedback note */}
          <div>
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Leave a note (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Tell the driver what you enjoyed..."
              rows={2}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-extrabold text-sm transition-all shadow-lg shadow-yellow-400/25 active:scale-[0.98]"
          >
            Submit Review & Tip (${finalTip > 0 ? (currentTrip.fare + finalTip).toFixed(2) : currentTrip.fare.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};
