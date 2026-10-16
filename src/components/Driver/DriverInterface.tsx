import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { 
  Power, 
  Car, 
  DollarSign, 
  Clock, 
  MapPin, 
  Navigation, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  TrendingUp, 
  Award, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Phone,
  MessageSquare
} from 'lucide-react';
import { CallChatModal } from '../Modals/CallChatModal';

export const DriverInterface: React.FC = () => {
  const {
    driverProfile,
    isDriverOnline,
    toggleDriverOnline,
    incomingTripOffer,
    incomingOfferTimer,
    acceptTripOffer,
    declineTripOffer,
    currentTrip,
    driverUpdateStatus,
    uploadDriverDoc,
    fareConfig
  } = useRide();

  const [activeTab, setActiveTab] = useState<'cockpit' | 'earnings' | 'documents'>('cockpit');
  const [showDriverChat, setShowDriverChat] = useState(false);
  const [selectedDocUpload, setSelectedDocUpload] = useState<'license' | 'registration' | 'insurance' | null>(null);

  // Compute estimated payout for driver (PRD specifies platform commission)
  const calculateDriverPayout = (fare: number) => {
    return +(fare * (1 - fareConfig.platformCommissionPercent / 100)).toFixed(2);
  };

  const openNativeNavigation = (destName: string, lat?: number, lng?: number) => {
    const encoded = encodeURIComponent(destName + ', New York');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Driver Header & Online Toggle Bar */}
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={driverProfile.avatar}
              alt={driverProfile.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-neutral-900 ${
              isDriverOnline ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-500'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{driverProfile.name}</h3>
              <span className="text-xs text-yellow-400 font-bold">★ {driverProfile.rating}</span>
            </div>
            <p className="text-xs text-neutral-400">
              {driverProfile.vehicle.model} · <span className="text-yellow-400 font-mono font-bold">{driverProfile.vehicle.plate}</span>
            </p>
          </div>
        </div>

        {/* Online / Offline switch */}
        <button
          onClick={toggleDriverOnline}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 ${
            isDriverOnline
              ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 border border-neutral-700'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isDriverOnline ? 'Online · Receiving Rides' : 'Offline · Tap to Go Online'}</span>
        </button>
      </div>

      {/* Driver Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 self-start">
        <button
          onClick={() => setActiveTab('cockpit')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'cockpit'
              ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Driver Cockpit
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'earnings'
              ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Earnings & Metrics
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Documents</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-800 text-neutral-300">
            {Object.values(driverProfile.documents).filter(d => d.status === 'approved').length}/3
          </span>
        </button>
      </div>

      {/* INCOMING RIDE OFFER MODAL / ALERT (15-SECOND COUNTDOWN AS REQUIRED IN PRD) */}
      {incomingTripOffer && (
        <div className="p-5 bg-neutral-900 border-2 border-yellow-400 rounded-3xl shadow-2xl space-y-4 animate-bounce-once">
          {/* Header with countdown badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                Incoming Ride Offer
              </span>
            </div>

            <div className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full font-mono text-xs font-bold border border-yellow-400/40">
              00:{incomingOfferTimer < 10 ? `0${incomingOfferTimer}` : incomingOfferTimer}s
            </div>
          </div>

          {/* Animated 15-second countdown timer bar */}
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-1000 ease-linear shadow-[0_0_12px_#facc15]"
              style={{ width: `${(incomingOfferTimer / 15) * 100}%` }}
            />
          </div>

          {/* Payout & Distance showcase */}
          <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-2xl border border-neutral-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                Estimated Driver Payout
              </span>
              <div className="text-3xl font-black text-yellow-400 font-mono tabular-nums">
                ${calculateDriverPayout(incomingTripOffer.fare)}
              </div>
              <span className="text-[11px] text-neutral-400">
                (Fare: ${incomingTripOffer.fare.toFixed(2)} · 20% commission applied)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                Pickup Distance
              </span>
              <div className="text-lg font-bold text-white font-mono">0.9 mi</div>
              <span className="text-[11px] text-emerald-400 font-medium">~3 mins away</span>
            </div>
          </div>

          {/* Route Info */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
              <div className="truncate">
                <span className="text-neutral-400">Pickup: </span>
                <span className="text-white font-semibold">{incomingTripOffer.pickup.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white shrink-0" />
              <div className="truncate">
                <span className="text-neutral-400">Dropoff: </span>
                <span className="text-white font-semibold">{incomingTripOffer.destination.name}</span>
              </div>
            </div>
          </div>

          {/* Accept / Decline buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={declineTripOffer}
              className="py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition-colors"
            >
              Decline Offer
            </button>
            <button
              onClick={acceptTripOffer}
              className="py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-yellow-400/25 active:scale-95"
            >
              Accept Ride
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE TRIP LIFECYCLE CONTROLS (PRD: "Arrived at Pickup", "Start Trip", "Complete Trip") */}
      {currentTrip && currentTrip.status !== 'completed' && currentTrip.driverId === driverProfile.id && (
        <div className="p-5 bg-neutral-900 border border-yellow-400/40 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400">
                Active Job in Progress
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                Rider: {currentTrip.riderName}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDriverChat(true)}
                className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                title="Message Passenger"
              >
                <MessageSquare className="w-4 h-4 text-yellow-400" />
              </button>
              <button
                onClick={() => openNativeNavigation(
                  currentTrip.status === 'driver_assigned' ? currentTrip.pickup.name : currentTrip.destination.name
                )}
                className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
                title="Open in Google/Apple Maps"
              >
                <Navigation className="w-3.5 h-3.5 text-yellow-400" />
                <span>Navigate</span>
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </button>
            </div>
          </div>

          {/* Current navigation step */}
          <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
                  {currentTrip.status === 'driver_assigned' ? 'Current Goal: Head to Pickup' : 'Current Goal: Drive to Dropoff'}
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {currentTrip.status === 'driver_assigned' ? currentTrip.pickup.name : currentTrip.destination.name}
                </p>
                <p className="text-neutral-400 text-xs">
                  {currentTrip.status === 'driver_assigned' ? currentTrip.pickup.address : currentTrip.destination.address}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-yellow-400 font-mono">
                  ${calculateDriverPayout(currentTrip.fare)}
                </span>
                <span className="text-[10px] text-neutral-500 block">Net Payout</span>
              </div>
            </div>
          </div>

          {/* PRD Mandated Trip Lifecycle Buttons */}
          <div className="space-y-2 pt-1">
            {currentTrip.status === 'driver_assigned' && (
              <button
                onClick={() => driverUpdateStatus('arrived_pickup')}
                className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-yellow-400/20 active:scale-95"
              >
                1. Mark "Arrived at Pickup"
              </button>
            )}

            {currentTrip.status === 'arrived_pickup' && (
              <button
                onClick={() => driverUpdateStatus('in_progress')}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                2. Passenger Boarded · "Start Trip"
              </button>
            )}

            {currentTrip.status === 'in_progress' && (
              <button
                onClick={() => driverUpdateStatus('completed')}
                className="w-full py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-yellow-400/20 active:scale-95"
              >
                3. Arrived at Destination · "Complete Trip"
              </button>
            )}
          </div>
        </div>
      )}

      {/* COCKPIT OVERVIEW TAB */}
      {activeTab === 'cockpit' && (
        <div className="space-y-4">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block">Today's Earnings</span>
              <div className="text-xl font-black text-yellow-400 font-mono mt-1 tabular-nums">
                ${driverProfile.todayEarnings.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block">Total Trips</span>
              <div className="text-xl font-bold text-white font-mono mt-1 tabular-nums">
                {driverProfile.totalTrips}
              </div>
            </div>

            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block">Acceptance</span>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
                {driverProfile.acceptanceRate}%
              </div>
            </div>

            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider block">Driver Rating</span>
              <div className="text-xl font-bold text-yellow-400 font-mono mt-1 tabular-nums">
                ★ {driverProfile.rating}
              </div>
            </div>
          </div>

          {/* Test ride dispatcher helper card */}
          {!incomingTripOffer && (!currentTrip || currentTrip.status === 'completed') && (
            <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-3xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-yellow-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isDriverOnline ? 'Cockpit Ready & Waiting for Riders' : 'You are currently Offline'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                  {isDriverOnline 
                    ? 'Incoming ride requests will pop up with a 15-second acceptance timer and route payout details.'
                    : 'Toggle Online above to start receiving ride requests in the NYC metro area.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EARNINGS DASHBOARD TAB (PRD P1: Daily and weekly summary of completed rides and total payouts) */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Today's Payout</span>
              <div className="text-3xl font-black text-yellow-400 font-mono tabular-nums">
                ${driverProfile.todayEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-neutral-500">Instant Cashout available via Stripe Express</p>
              <button 
                onClick={() => alert(`Initiated $${driverProfile.todayEarnings.toFixed(2)} cashout to your linked debit card!`)}
                className="mt-3 px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs"
              >
                Cash Out Now
              </button>
            </div>

            <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Weekly Total</span>
              <div className="text-3xl font-black text-white font-mono tabular-nums">
                ${driverProfile.weeklyEarnings.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-400 font-medium">+18% compared to last week</p>
            </div>
          </div>

          {/* Daily Earnings Breakdown Bars */}
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Weekly Activity Overview
            </h4>
            <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4">
              {[
                { day: 'Mon', val: 120, height: '60%' },
                { day: 'Tue', val: 145, height: '72%' },
                { day: 'Wed', val: 98, height: '48%' },
                { day: 'Thu', val: 180, height: '88%' },
                { day: 'Fri', val: 210, height: '100%' },
                { day: 'Sat', val: 165, height: '80%' },
                { day: 'Sun', val: driverProfile.todayEarnings, height: `${Math.min(100, (driverProfile.todayEarnings / 200) * 100)}%` }
              ].map(item => (
                <div key={item.day} className="flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full bg-yellow-400/80 hover:bg-yellow-400 rounded-t-lg transition-all"
                    style={{ height: item.height }}
                  />
                  <span className="text-[10px] text-neutral-400 font-mono">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DRIVER ONBOARDING & DOCUMENTS TAB (PRD P0: Driver Onboarding with document upload) */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="p-5 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">Driver Verification & Compliance Documents</h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Uploaded documents are reviewed by the RideWeb Safety & Compliance Administration desk.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { key: 'license' as const, label: "Driver's License (Class E/Commercial)", desc: "Valid State Driver License with photo" },
                { key: 'registration' as const, label: "Vehicle Registration", desc: "Current yellow cab or TLC commercial registration" },
                { key: 'insurance' as const, label: "Commercial Auto Liability Insurance", desc: "Minimum $1,000,000 policy coverage" }
              ].map(doc => {
                const docState = driverProfile.documents[doc.key];
                return (
                  <div
                    key={doc.key}
                    className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-800 text-yellow-400 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{doc.label}</h5>
                        <p className="text-[11px] text-neutral-500">{doc.desc}</p>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Submitted: {docState.submittedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        docState.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : docState.status === 'pending'
                          ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {docState.status}
                      </span>

                      <button
                        onClick={() => uploadDriverDoc(doc.key)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors"
                        title="Upload New Version"
                      >
                        <UploadCloud className="w-4 h-4 text-yellow-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Driver In-App Chat Modal */}
      {showDriverChat && (
        <CallChatModal
          initialMode="chat"
          onClose={() => setShowDriverChat(false)}
        />
      )}
    </div>
  );
};
