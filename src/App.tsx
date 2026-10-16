/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RideProvider, useRide } from './context/RideContext';
import { Navbar } from './components/Navbar';
import { CityMap } from './components/Map/CityMap';
import { RiderInterface } from './components/Rider/RiderInterface';
import { DriverInterface } from './components/Driver/DriverInterface';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { PrdSpecModal } from './components/Modals/PrdSpecModal';
import { Car, ShieldCheck, Zap, Users, HelpCircle, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, setCurrentRole } = useRide();
  const [showPrdModal, setShowPrdModal] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-yellow-400 selection:text-neutral-950">
      {/* Top Navbar */}
      <Navbar onOpenPrdModal={() => setShowPrdModal(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Role Switcher Toolbar & Quick Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 pl-2">
              Select Experience:
            </span>
            <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
              <button
                onClick={() => setCurrentRole('rider')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === 'rider'
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Rider</span>
              </button>
              <button
                onClick={() => setCurrentRole('driver')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === 'driver'
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Driver</span>
              </button>
              <button
                onClick={() => setCurrentRole('admin')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  currentRole === 'admin'
                    ? 'bg-yellow-400 text-neutral-950 shadow-md shadow-yellow-400/20'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400 pr-2">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Dispatch Engine Active</span>
            </div>
            <button
              onClick={() => setShowPrdModal(true)}
              className="text-yellow-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>PRD Requirements</span>
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Role-Specific Control Deck (Rider Booking / Driver Cockpit / Admin Desk) */}
          <div className="lg:col-span-5 w-full">
            {currentRole === 'rider' && <RiderInterface />}
            {currentRole === 'driver' && <DriverInterface />}
            {currentRole === 'admin' && <AdminDashboard />}
          </div>

          {/* Right Column: Interactive Vector City Map with GPS vehicle tracking */}
          <div className="lg:col-span-7 w-full sticky top-24">
            <CityMap />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/60 py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-300">RideWeb</span>
            <span aria-hidden="true">·</span>
            <span>Classic Ride-Hailing Platform MVP</span>
            <span aria-hidden="true">·</span>
            <span>NYC Yellow Theme</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowPrdModal(true)} className="hover:text-yellow-400 transition-colors">
              PRD Documentation
            </button>
            <span aria-hidden="true">·</span>
            <span>No App Store Download Required</span>
            <span aria-hidden="true">·</span>
            <span>Push a button, get a ride</span>
          </div>
        </div>
      </footer>

      {/* PRD Modal */}
      {showPrdModal && <PrdSpecModal onClose={() => setShowPrdModal(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <RideProvider>
      <MainLayout />
    </RideProvider>
  );
}
