import React from 'react';
import { FileText, CheckCircle2, X, Award, Shield, Cpu, ExternalLink } from 'lucide-react';

interface PrdSpecModalProps {
  onClose: () => void;
}

export const PrdSpecModal: React.FC<PrdSpecModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl text-neutral-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-yellow-400 text-neutral-950 flex items-center justify-between border-b border-yellow-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-taxi-checkered opacity-10 pointer-events-none" />
          <div className="relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-900">
              Product Requirements Document (PRD)
            </span>
            <h2 className="text-xl font-extrabold tracking-tight mt-0.5">
              RideWeb — Classic Ride-Hailing MVP v1.0.0
            </h2>
            <p className="text-xs text-neutral-800 font-medium">Status: Approved for Development</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-950/10 hover:bg-neutral-950/20 text-neutral-950 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRD Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-300 leading-relaxed">
          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-yellow-400">
              1. Executive Summary
            </h3>
            <p className="text-neutral-300">
              This document outlines the product requirements for a web-based ride-hailing MVP. The primary objective is to replicate the core, frictionless experience of early-stage ride-hailing platforms ("push a button, get a ride") entirely within a mobile web browser. This eliminates the barrier of app store downloads, allowing users to request rides instantly via a URL.
            </p>
          </div>

          {/* User Roles */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-yellow-400">
              2. User Roles
            </h3>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li><strong className="text-white">Rider:</strong> Requests rides, tracks driver arrival in real-time, and pays for the service automatically.</li>
              <li><strong className="text-white">Driver:</strong> Receives ride requests, navigates to the rider's pickup location, and collects earnings.</li>
              <li><strong className="text-white">Administrator:</strong> Manages platform users, monitors active rides, and resolves customer support disputes.</li>
            </ul>
          </div>

          {/* Feature Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-yellow-400">
              3. Implemented Feature Requirements
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-neutral-800 rounded-xl overflow-hidden">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">Domain</th>
                    <th className="p-2.5">Feature</th>
                    <th className="p-2.5">Priority</th>
                    <th className="p-2.5">Status in RideWeb</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Rider</td>
                    <td className="p-2.5 text-white font-sans">User Auth & Geolocation Input</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Rider</td>
                    <td className="p-2.5 text-white font-sans">Fare Estimation & Multi-Tier Pricing</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Rider</td>
                    <td className="p-2.5 text-white font-sans">Real-Time Vector GPS Tracking & Chat/Call</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Rider</td>
                    <td className="p-2.5 text-white font-sans">Trip History, Itemized Receipts & 1-5★ Ratings</td>
                    <td className="p-2.5 text-yellow-400">P1</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Driver</td>
                    <td className="p-2.5 text-white font-sans">Go Online/Offline Status Toggle</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Driver</td>
                    <td className="p-2.5 text-white font-sans">15s Acceptance Countdown with Payout Alert</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Driver</td>
                    <td className="p-2.5 text-white font-sans">Trip Lifecycle (Arrived, Start, Complete)</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Driver</td>
                    <td className="p-2.5 text-white font-sans">Earnings Dashboard & Document Onboarding</td>
                    <td className="p-2.5 text-yellow-400">P1</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Admin</td>
                    <td className="p-2.5 text-white font-sans">Driver Document Verification (Approve/Reject)</td>
                    <td className="p-2.5 text-red-400">P0</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Admin</td>
                    <td className="p-2.5 text-white font-sans">Live Map Console & User Management (Suspend)</td>
                    <td className="p-2.5 text-yellow-400">P1</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-yellow-400 font-sans font-bold">Admin</td>
                    <td className="p-2.5 text-white font-sans">Fare Matrix & Commission Controls</td>
                    <td className="p-2.5 text-blue-400">P2</td>
                    <td className="p-2.5 text-emerald-400">✓ Fully Functional</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* V2 Post-MVP Enhancements note */}
          <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              8. Post-MVP Enhancements Included
            </h4>
            <p className="text-neutral-400">
              • <strong>Surge Pricing Multiplier:</strong> Live configurable dynamic pricing slider with real-time fare recalculations.<br />
              • <strong>Multi-Tier Pooling & Express Moto:</strong> 4 distinct vehicle classes from single-passenger scooter to 6-seat XL.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs uppercase tracking-wider"
          >
            Close Spec Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
