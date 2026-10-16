import React, { useState } from 'react';
import { useRide } from '../context/RideContext';
import { UserRole } from '../types';
import { Car, Shield, User, FileText, CheckCircle2, ChevronDown, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenPrdModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPrdModal }) => {
  const { 
    currentRole, 
    setCurrentRole, 
    currentTrip, 
    notification, 
    setNotification 
  } = useRide();

  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    rider: { label: 'Rider Portal', desc: 'Book rides & track taxi' },
    driver: { label: 'Driver Cockpit', desc: 'Accept trips & earnings' },
    admin: { label: 'Admin Desk', desc: 'Fleet, fares & documents' }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark with Iconic Yellow Cab Graphic */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 text-neutral-950 flex items-center justify-center font-black shadow-md shadow-yellow-400/20">
            <Car className="w-5 h-5 fill-neutral-950" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
              Ride<span className="text-yellow-400">Web</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
              NYC Yellow
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links & Active Role Switcher */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
          <button
            onClick={() => setCurrentRole('rider')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRole === 'rider'
                ? 'text-yellow-400 border-b-2 border-yellow-400 font-bold'
                : 'hover:text-neutral-200'
            }`}
          >
            Rider Interface
          </button>
          <button
            onClick={() => setCurrentRole('driver')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRole === 'driver'
                ? 'text-yellow-400 border-b-2 border-yellow-400 font-bold'
                : 'hover:text-neutral-200'
            }`}
          >
            Driver Cockpit
          </button>
          <button
            onClick={() => setCurrentRole('admin')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentRole === 'admin'
                ? 'text-yellow-400 border-b-2 border-yellow-400 font-bold'
                : 'hover:text-neutral-200'
            }`}
          >
            Admin Console
          </button>
          <button
            onClick={onOpenPrdModal}
            className="whitespace-nowrap shrink-0 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400" />
            <span>PRD v1.0 Spec</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action / Role Quick Switcher & Active Trip Pill */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile / Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-white flex items-center gap-2 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="capitalize">{currentRole} View</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl z-50 animate-fade-in space-y-1">
                {(['rider', 'driver', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-colors flex flex-col ${
                      currentRole === role
                        ? 'bg-yellow-400 text-neutral-950 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="font-bold">{roleLabels[role].label}</span>
                    <span className={`text-[10px] ${currentRole === role ? 'text-neutral-800 font-medium' : 'text-neutral-500'}`}>
                      {roleLabels[role].desc}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => {
              setCurrentRole('rider');
            }}
            className="px-4 py-2 text-xs font-black uppercase tracking-wider text-neutral-950 bg-yellow-400 hover:bg-yellow-300 rounded-xl transition-all shadow-md shadow-yellow-400/20 active:scale-95 whitespace-nowrap shrink-0"
          >
            {currentTrip && currentTrip.status !== 'completed' ? 'Active Ride' : 'Get A Ride'}
          </button>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="bg-yellow-400/15 border-t border-yellow-400/30 px-4 py-2 flex items-center justify-between text-xs text-yellow-300">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Bell className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span className="truncate font-medium">{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-neutral-400 hover:text-white text-[11px] font-mono uppercase"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
