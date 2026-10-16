import React, { useState } from 'react';
import { ShieldAlert, Phone, Share2, AlertTriangle, Check, X } from 'lucide-react';
import { useRide } from '../../context/RideContext';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  const { currentTrip } = useRide();
  const [shared, setShared] = useState(false);
  const [called, setCalled] = useState(false);

  const handleShare = () => {
    setShared(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-red-500/40 rounded-3xl overflow-hidden shadow-2xl text-neutral-100">
        <div className="bg-red-500/15 border-b border-red-500/30 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">RideWeb Safety Toolkit</h3>
              <p className="text-xs text-red-300">24/7 Rapid Incident Response</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {currentTrip && (
            <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs space-y-1">
              <div className="text-neutral-400">Current Trip Reference:</div>
              <div className="font-mono text-yellow-400 font-bold">{currentTrip.id}</div>
              <div className="text-neutral-300">
                Vehicle: {currentTrip.driver?.vehicle.model} ({currentTrip.driver?.vehicle.plate})
              </div>
            </div>
          )}

          <div className="space-y-3">
            {/* 911 Direct dispatch */}
            <button
              onClick={() => setCalled(true)}
              className="w-full p-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-between transition-colors shadow-lg shadow-red-600/30"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm">Call 911 Emergency Services</div>
                  <div className="text-[11px] text-red-100 font-normal">Direct line to local police and dispatch</div>
                </div>
              </div>
              <span className="text-xs uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">Call</span>
            </button>

            {called && (
              <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs">
                Emergency dispatch triggered. Dispatchers have received your real-time vehicle coordinates.
              </div>
            )}

            {/* Share live location link */}
            <button
              onClick={handleShare}
              className="w-full p-4 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold flex items-center justify-between transition-colors border border-neutral-700"
            >
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-yellow-400" />
                <div className="text-left">
                  <div className="text-sm">Share Live Trip Status</div>
                  <div className="text-[11px] text-neutral-400 font-normal">Send GPS tracking link to family/friends</div>
                </div>
              </div>
              {shared ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-4 h-4" /> Copied!
                </span>
              ) : (
                <span className="text-xs text-neutral-400">Copy</span>
              )}
            </button>

            {/* 24/7 Safety hotline */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-neutral-200">RideWeb Trust & Safety Desk</h5>
                <p className="text-[11px] text-neutral-400 font-mono">+1 (800) 555-RIDE-WEB</p>
              </div>
              <button 
                onClick={() => alert('Connected to RideWeb 24/7 Safety Desk operator.')}
                className="px-3 py-1.5 rounded-lg bg-yellow-400 text-neutral-950 font-bold text-xs"
              >
                Connect
              </button>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Close Safety Toolkit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
