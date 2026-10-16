import React, { useState } from 'react';
import { useRide } from '../../context/RideContext';
import { POPULAR_LOCATIONS, VEHICLE_TIERS } from '../../data/mockData';
import { LocationPoint, VehicleCategory } from '../../types';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Car, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  X, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  Receipt, 
  Star, 
  User, 
  Check, 
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { TripReceiptModal } from '../Modals/TripReceiptModal';
import { EmergencyModal } from '../Modals/EmergencyModal';
import { RatingModal } from '../Modals/RatingModal';
import { CallChatModal } from '../Modals/CallChatModal';

export const RiderInterface: React.FC = () => {
  const {
    pickup,
    destination,
    selectedTier,
    paymentMethod,
    currentTrip,
    fareEstimate,
    driverEtaSeconds,
    tripProgressPercent,
    setPickup,
    setDestination,
    setSelectedTier,
    setPaymentMethod,
    requestRide,
    cancelRide,
    tripHistory,
    clearCompletedTrip
  } = useRide();

  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingDest, setIsSearchingDest] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [selectedReceiptTrip, setSelectedReceiptTrip] = useState<any | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInitialMode, setChatInitialMode] = useState<'chat' | 'call'>('chat');

  // Trigger rating modal when trip completes
  React.useEffect(() => {
    if (currentTrip && currentTrip.status === 'completed' && !currentTrip.rating) {
      setShowRatingModal(true);
    }
  }, [currentTrip?.status]);

  const filteredLocations = POPULAR_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paymentOptions = [
    { id: 'Visa •••• 4242', label: 'Visa •••• 4242', icon: '💳' },
    { id: 'Apple Pay', label: 'Apple Pay', icon: '' },
    { id: 'Google Pay', label: 'Google Pay', icon: 'G' },
    { id: 'RideWeb Cash', label: 'RideWeb Yellow Cash', icon: '💵' }
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Rider Tabs: Book Ride vs Trip History */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          <button
            onClick={() => setActiveTab('book')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'book'
                ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Request Ride
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-yellow-400 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Past Trips</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-neutral-800 rounded-full text-neutral-300">
              {tripHistory.length}
            </span>
          </button>
        </div>

        {/* Rider profile quick info */}
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <div className="w-7 h-7 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 flex items-center justify-center font-bold text-[11px]">
            CG
          </div>
          <div className="hidden sm:block">
            <span className="text-white font-semibold">Chirag G.</span>
            <span className="text-neutral-500 ml-1.5">★ 4.95</span>
          </div>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* TRIP HISTORY VIEW */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Your Ride Receipts</h3>
            <span className="text-xs text-neutral-400">{tripHistory.length} completed trips</span>
          </div>

          {tripHistory.length === 0 ? (
            <div className="p-8 text-center bg-neutral-900 rounded-2xl border border-neutral-800">
              <p className="text-sm text-neutral-400">No past rides yet. Book your first ride!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tripHistory.map(trip => (
                <div
                  key={trip.id}
                  className="p-4 bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 rounded-2xl transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800">
                    <span className="font-mono text-neutral-400">
                      {new Date(trip.completedAt || trip.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="font-bold text-yellow-400 text-sm tabular-nums font-mono">
                      ${(trip.fare + (trip.tip || 0)).toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-neutral-300 font-medium truncate">{trip.pickup.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white" />
                      <span className="text-neutral-300 font-medium truncate">{trip.destination.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <span>{trip.driver?.name || 'Driver'}</span>
                      <span>·</span>
                      <span className="font-mono">{trip.driver?.vehicle.plate || 'TAXI'}</span>
                      {trip.rating && (
                        <>
                          <span>·</span>
                          <span className="text-yellow-400 font-semibold flex items-center gap-0.5">
                            ★ {trip.rating}
                          </span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedReceiptTrip(trip)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Receipt className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* BOOKING & ACTIVE RIDE FLOW */
        <div className="space-y-4">
          {/* If there is an active trip */}
          {currentTrip && currentTrip.status !== 'idle' ? (
            <div className="space-y-4 animate-fade-in">
              {/* Trip Status Card */}
              <div className="p-5 bg-neutral-900 border border-yellow-400/40 rounded-3xl space-y-4 shadow-xl">
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-full ${
                      currentTrip.status === 'requesting' ? 'bg-yellow-400 animate-ping' :
                      currentTrip.status === 'driver_assigned' ? 'bg-yellow-400' :
                      currentTrip.status === 'arrived_pickup' ? 'bg-emerald-400 animate-pulse' :
                      currentTrip.status === 'in_progress' ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`} />
                    <span className="text-sm font-bold text-white">
                      {currentTrip.status === 'requesting' && 'Finding Nearest Yellow Cab...'}
                      {currentTrip.status === 'driver_assigned' && 'Driver En Route to Pickup'}
                      {currentTrip.status === 'arrived_pickup' && 'Driver Arrived! Waiting Outside'}
                      {currentTrip.status === 'in_progress' && 'Trip In Progress'}
                      {currentTrip.status === 'completed' && 'Trip Completed!'}
                    </span>
                  </div>

                  {currentTrip.status === 'driver_assigned' && (
                    <div className="flex items-center gap-1 font-mono text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/30">
                      <Clock className="w-3 h-3" />
                      <span>{Math.ceil(driverEtaSeconds / 60)} min ETA</span>
                    </div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-400 transition-all duration-300 shadow-[0_0_10px_#facc15]"
                    style={{ width: `${Math.max(5, tripProgressPercent)}%` }}
                  />
                </div>

                {/* Driver information & contact */}
                {currentTrip.driver ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800">
                      <div className="flex items-center gap-3">
                        <img
                          src={currentTrip.driver.avatar}
                          alt={currentTrip.driver.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-white">{currentTrip.driver.name}</h4>
                            <span className="text-xs text-yellow-400 font-bold">★ {currentTrip.driver.rating}</span>
                          </div>
                          <p className="text-xs text-neutral-400">{currentTrip.driver.vehicle.model}</p>
                          <span className="inline-block px-2 py-0.5 mt-1 rounded bg-yellow-400 text-neutral-950 font-mono text-[11px] font-black">
                            {currentTrip.driver.vehicle.plate}
                          </span>
                        </div>
                      </div>

                      {/* Call & Chat buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setChatInitialMode('call');
                            setShowChatModal(true);
                          }}
                          className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                          title="Call Driver"
                        >
                          <Phone className="w-4 h-4 text-yellow-400" />
                        </button>
                        <button
                          onClick={() => {
                            setChatInitialMode('chat');
                            setShowChatModal(true);
                          }}
                          className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
                          title="Chat with Driver"
                        >
                          <MessageSquare className="w-4 h-4 text-yellow-400" />
                        </button>
                      </div>
                    </div>

                    {/* Route preview */}
                    <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Pickup:</span>
                        <span className="text-neutral-200 font-medium truncate max-w-[200px]">{currentTrip.pickup.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-neutral-500 uppercase tracking-wider text-[10px]">Dropoff:</span>
                        <span className="text-yellow-400 font-semibold truncate max-w-[200px]">{currentTrip.destination.name}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Searching animation */
                  <div className="py-6 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-yellow-400/20 border-2 border-yellow-400 border-dashed animate-spin mx-auto flex items-center justify-center">
                      <Car className="w-6 h-6 text-yellow-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-neutral-400">
                      Broadcasting request to online yellow taxis within 2.5 miles...
                    </p>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setShowEmergency(true)}
                    className="p-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span className="hidden sm:inline">Safety</span>
                  </button>

                  {currentTrip.status === 'completed' ? (
                    <button
                      onClick={() => setShowRatingModal(true)}
                      className="flex-1 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-400/20"
                    >
                      <Star className="w-4 h-4 fill-neutral-950" />
                      <span>Rate Driver & View Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={cancelRide}
                      className="flex-1 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                    >
                      Cancel Ride
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* BOOKING FORM */
            <div className="space-y-4">
              {/* Pickup & Destination Input Card */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-3xl space-y-3 shadow-lg">
                {/* Pickup location */}
                <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Pickup Location
                    </span>
                    <select
                      value={pickup.id}
                      onChange={e => {
                        const found = POPULAR_LOCATIONS.find(l => l.id === e.target.value);
                        if (found) setPickup(found);
                      }}
                      className="w-full bg-transparent text-xs font-bold text-white focus:outline-none truncate cursor-pointer"
                    >
                      {POPULAR_LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id} className="bg-neutral-900 text-white">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      // Simulate auto-detecting current GPS
                      const currentP = POPULAR_LOCATIONS[0];
                      setPickup(currentP);
                    }}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-yellow-400 text-xs flex items-center gap-1"
                    title="Auto-detect current location"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dropoff location search / select */}
                <div className="flex items-center gap-3 p-3 bg-neutral-950 rounded-2xl border border-neutral-800">
                  <div className="w-3 h-3 rounded-full bg-white shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Where to? (Destination)
                    </span>
                    <select
                      value={destination?.id || ''}
                      onChange={e => {
                        const found = POPULAR_LOCATIONS.find(l => l.id === e.target.value);
                        if (found) setDestination(found);
                      }}
                      className="w-full bg-transparent text-xs font-bold text-white focus:outline-none truncate cursor-pointer"
                    >
                      <option value="" disabled className="bg-neutral-900 text-neutral-400">
                        Choose destination...
                      </option>
                      {POPULAR_LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id} className="bg-neutral-900 text-white">
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setIsSearchingDest(!isSearchingDest)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs"
                    title="Search address"
                  >
                    <Search className="w-3.5 h-3.5 text-yellow-400" />
                  </button>
                </div>

                {/* Search expander */}
                {isSearchingDest && (
                  <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2 animate-fade-in">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search metro landmark, street, or airport..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-yellow-400"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-1">
                      {filteredLocations.map(loc => (
                        <button
                          key={loc.id}
                          onClick={() => {
                            setDestination(loc);
                            setIsSearchingDest(false);
                            setSearchQuery('');
                          }}
                          className="w-full p-2 text-left hover:bg-neutral-900 rounded-xl flex items-center justify-between text-xs transition-colors"
                        >
                          <div className="truncate pr-2">
                            <span className="font-semibold text-neutral-200 block truncate">{loc.name}</span>
                            <span className="text-[11px] text-neutral-500 truncate">{loc.address}</span>
                          </div>
                          <span className="text-yellow-400 text-[10px] font-mono shrink-0 uppercase">Select</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vehicle Tier Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block px-1">
                  Choose RideWeb Fleet Tier
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {VEHICLE_TIERS.map(tier => {
                    const isSelected = selectedTier === tier.id;
                    const tierEstimate = fareEstimate ? (fareEstimate.total * (tier.baseMultiplier / (VEHICLE_TIERS.find(t => t.id === selectedTier)?.baseMultiplier || 1))).toFixed(2) : '--';

                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setSelectedTier(tier.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? 'bg-neutral-900 border-yellow-400 shadow-lg shadow-yellow-400/10'
                            : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                              isSelected ? 'bg-yellow-400 text-neutral-950' : 'bg-neutral-800 text-neutral-400'
                            }`}>
                              <Car className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white">{tier.name}</span>
                                {tier.badge && (
                                  <span className="text-[9px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.2 rounded font-bold uppercase">
                                    {tier.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-neutral-400 block">{tier.etaMinutes} mins away</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-extrabold text-white font-mono tabular-nums">
                              ${tierEstimate}
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] text-neutral-400 mt-2 truncate">{tier.tagline}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upfront Fare Estimate Breakdown & Payment Method */}
              {fareEstimate && (
                <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-3xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400 font-medium">Upfront Price Guarantee:</span>
                    <div className="flex items-center gap-3 font-mono text-neutral-300">
                      <span>{fareEstimate.miles} miles</span>
                      <span>·</span>
                      <span>~{fareEstimate.minutes} mins</span>
                    </div>
                  </div>

                  {/* Payment selector trigger */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                    <button
                      onClick={() => setShowPaymentSelector(!showPaymentSelector)}
                      className="flex items-center gap-2 text-xs text-neutral-300 hover:text-white transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-yellow-400" />
                      <span className="font-semibold">{paymentMethod}</span>
                      <span className="text-neutral-500 text-[10px]">Change</span>
                    </button>
                    <span className="text-xs text-neutral-400">No hidden fees</span>
                  </div>

                  {/* Payment dropdown */}
                  {showPaymentSelector && (
                    <div className="p-2 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1 animate-fade-in">
                      {paymentOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setPaymentMethod(opt.id);
                            setShowPaymentSelector(false);
                          }}
                          className={`w-full p-2 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            paymentMethod === opt.id ? 'bg-yellow-400/10 text-yellow-400 font-bold' : 'text-neutral-300 hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                          </div>
                          {paymentMethod === opt.id && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Request Button */}
                  <button
                    onClick={requestRide}
                    className="w-full py-4 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-neutral-950 font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all shadow-xl shadow-yellow-400/20 active:scale-[0.98]"
                  >
                    <span>Request {VEHICLE_TIERS.find(t => t.id === selectedTier)?.name}</span>
                    <span className="font-mono text-base font-black">· ${fareEstimate.total.toFixed(2)}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {selectedReceiptTrip && (
        <TripReceiptModal
          trip={selectedReceiptTrip}
          onClose={() => setSelectedReceiptTrip(null)}
        />
      )}

      {showEmergency && (
        <EmergencyModal onClose={() => setShowEmergency(false)} />
      )}

      {showRatingModal && (
        <RatingModal onClose={() => setShowRatingModal(false)} />
      )}

      {showChatModal && (
        <CallChatModal
          initialMode={chatInitialMode}
          onClose={() => setShowChatModal(false)}
        />
      )}
    </div>
  );
};
