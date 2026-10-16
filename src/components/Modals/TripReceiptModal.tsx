import React from 'react';
import { Trip } from '../../types';
import { CheckCircle2, Download, Printer, X, Shield, MapPin } from 'lucide-react';

interface TripReceiptModalProps {
  trip: Trip;
  onClose: () => void;
}

export const TripReceiptModal: React.FC<TripReceiptModalProps> = ({ trip, onClose }) => {
  const driverPayout = trip.fare * 0.8;
  const tipAmount = trip.tip || 0;
  const grandTotal = trip.fare + tipAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-neutral-100">
        {/* Yellow Top Banner with Taxi Checker Accent */}
        <div className="bg-yellow-400 p-6 text-neutral-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-taxi-checkered opacity-10 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-900">
                Official Trip Receipt
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight mt-0.5">RideWeb Yellow</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-950/10 hover:bg-neutral-950/20 text-neutral-950 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-4 flex items-baseline justify-between relative z-10">
            <span className="text-xs font-semibold text-neutral-800">Total Charged</span>
            <span className="text-3xl font-black tabular-nums tracking-tight">
              ${grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Receipt Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status & Date */}
          <div className="flex items-center justify-between text-xs text-neutral-400 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paid in full ({trip.paymentMethod})</span>
            </div>
            <span className="font-mono text-neutral-400">
              {new Date(trip.completedAt || trip.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          {/* Route details */}
          <div className="space-y-3 bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Pickup</span>
                <p className="text-sm font-semibold text-white leading-snug">{trip.pickup.name}</p>
                <p className="text-xs text-neutral-400">{trip.pickup.address}</p>
              </div>
            </div>

            <div className="border-l border-dashed border-neutral-700 ml-1.5 h-3" />

            <div className="flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-white mt-1.5 shrink-0" />
              <div>
                <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">Dropoff</span>
                <p className="text-sm font-semibold text-white leading-snug">{trip.destination.name}</p>
                <p className="text-xs text-neutral-400">{trip.destination.address}</p>
              </div>
            </div>
          </div>

          {/* Driver & Car info */}
          {trip.driver && (
            <div className="flex items-center justify-between p-3.5 bg-neutral-800/40 rounded-2xl border border-neutral-800">
              <div className="flex items-center gap-3">
                <img
                  src={trip.driver.avatar}
                  alt={trip.driver.name}
                  className="w-10 h-10 rounded-full object-cover border border-yellow-400/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-neutral-100">{trip.driver.name}</h4>
                  <p className="text-xs text-neutral-400">{trip.driver.vehicle.model}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-xs font-bold">
                  {trip.driver.vehicle.plate}
                </span>
              </div>
            </div>
          )}

          {/* Fare breakdown table */}
          <div className="space-y-2 text-xs">
            <h5 className="font-semibold text-neutral-300 uppercase tracking-wider text-[11px]">
              Fare Breakdown
            </h5>
            <div className="flex justify-between text-neutral-300 py-1 border-b border-neutral-800/80">
              <span>Base Fare</span>
              <span className="tabular-nums font-mono">${trip.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-300 py-1 border-b border-neutral-800/80">
              <span>Distance ({trip.distanceMiles} mi)</span>
              <span className="tabular-nums font-mono">
                ${(trip.distanceMiles * 1.85).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-300 py-1 border-b border-neutral-800/80">
              <span>Time ({trip.durationMinutes} mins)</span>
              <span className="tabular-nums font-mono">
                ${(trip.durationMinutes * 0.40).toFixed(2)}
              </span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-yellow-400 font-medium py-1 border-b border-neutral-800/80">
                <span>Driver Tip</span>
                <span className="tabular-nums font-mono">+${tipAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-sm pt-2">
              <span>Grand Total</span>
              <span className="tabular-nums font-mono text-yellow-400 text-base">
                ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                window.print();
              }}
              className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-neutral-400" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-400/20"
            >
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
