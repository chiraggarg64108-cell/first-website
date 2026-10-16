import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  UserRole, 
  Trip, 
  TripStatus, 
  LocationPoint, 
  VehicleCategory, 
  Driver, 
  FareConfiguration, 
  PlatformUser 
} from '../types';
import { 
  POPULAR_LOCATIONS, 
  VEHICLE_TIERS, 
  INITIAL_DRIVERS, 
  INITIAL_FARE_CONFIG, 
  INITIAL_TRIP_HISTORY, 
  INITIAL_PLATFORM_USERS 
} from '../data/mockData';

interface FareBreakdown {
  base: number;
  distanceCharge: number;
  timeCharge: number;
  surgeCharge: number;
  total: number;
  miles: number;
  minutes: number;
}

interface RideContextType {
  // Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Rider state & actions
  pickup: LocationPoint;
  destination: LocationPoint | null;
  selectedTier: VehicleCategory;
  paymentMethod: string;
  currentTrip: Trip | null;
  tripHistory: Trip[];
  fareEstimate: FareBreakdown | null;
  driverEtaSeconds: number;
  tripProgressPercent: number;
  setPickup: (loc: LocationPoint) => void;
  setDestination: (loc: LocationPoint | null) => void;
  setSelectedTier: (tier: VehicleCategory) => void;
  setPaymentMethod: (pm: string) => void;
  requestRide: () => void;
  cancelRide: () => void;
  submitTripReview: (rating: number, tip: number, compliments: string[], feedback: string) => void;
  clearCompletedTrip: () => void;

  // Driver state & actions
  driverProfile: Driver;
  isDriverOnline: boolean;
  toggleDriverOnline: () => void;
  incomingTripOffer: Trip | null;
  incomingOfferTimer: number;
  acceptTripOffer: () => void;
  declineTripOffer: () => void;
  driverUpdateStatus: (nextStatus: 'arrived_pickup' | 'in_progress' | 'completed') => void;
  uploadDriverDoc: (type: 'license' | 'registration' | 'insurance') => void;

  // Admin state & actions
  fareConfig: FareConfiguration;
  updateFareConfig: (config: Partial<FareConfiguration>) => void;
  driversList: Driver[];
  usersList: PlatformUser[];
  verifyDriverDoc: (driverId: string, docType: 'license' | 'registration' | 'insurance', status: 'approved' | 'rejected') => void;
  toggleUserSuspension: (userId: string) => void;

  // Global / Map
  allActiveTrips: Trip[];
  activeDriverPosition: { x: number; y: number } | null;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('rider');
  
  // Rider state
  const [pickup, setPickup] = useState<LocationPoint>(POPULAR_LOCATIONS[0]);
  const [destination, setDestination] = useState<LocationPoint | null>(POPULAR_LOCATIONS[1]);
  const [selectedTier, setSelectedTier] = useState<VehicleCategory>('classic');
  const [paymentMethod, setPaymentMethod] = useState<string>('Visa •••• 4242');
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [tripHistory, setTripHistory] = useState<Trip[]>(INITIAL_TRIP_HISTORY);
  const [driverEtaSeconds, setDriverEtaSeconds] = useState<number>(180);
  const [tripProgressPercent, setTripProgressPercent] = useState<number>(0);

  // Driver state
  const [driversList, setDriversList] = useState<Driver[]>(INITIAL_DRIVERS);
  const [driverProfile, setDriverProfile] = useState<Driver>(INITIAL_DRIVERS[0]);
  const [isDriverOnline, setIsDriverOnline] = useState<boolean>(true);
  const [incomingTripOffer, setIncomingTripOffer] = useState<Trip | null>(null);
  const [incomingOfferTimer, setIncomingOfferTimer] = useState<number>(15);

  // Admin state
  const [fareConfig, setFareConfig] = useState<FareConfiguration>(INITIAL_FARE_CONFIG);
  const [usersList, setUsersList] = useState<PlatformUser[]>(INITIAL_PLATFORM_USERS);

  // Map / Position state
  const [activeDriverPosition, setActiveDriverPosition] = useState<{ x: number; y: number } | null>(
    INITIAL_DRIVERS[0].currentLocation
  );
  const [notification, setNotification] = useState<string | null>(null);

  const offerCountdownRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate fare breakdown dynamically
  const calculateFare = (
    from: LocationPoint, 
    to: LocationPoint | null, 
    tier: VehicleCategory
  ): FareBreakdown | null => {
    if (!to) return null;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distanceEuclidean = Math.sqrt(dx * dx + dy * dy);
    // Convert to realistic miles (e.g. 10 map units ≈ 1.2 miles)
    const miles = Math.max(0.8, +(distanceEuclidean * 0.12).toFixed(1));
    const minutes = Math.max(4, Math.round(miles * 3.8));

    const tierInfo = VEHICLE_TIERS.find(t => t.id === tier) || VEHICLE_TIERS[0];
    const base = fareConfig.baseFare * tierInfo.baseMultiplier;
    const distanceCharge = miles * fareConfig.perMileRate;
    const timeCharge = minutes * fareConfig.perMinuteRate;
    const subtotal = (base + distanceCharge + timeCharge) * tierInfo.baseMultiplier;
    const surgeAddition = subtotal * (fareConfig.surgeMultiplier - 1.0);
    const total = Math.max(5.00, +(subtotal + surgeAddition).toFixed(2));

    return {
      base: +base.toFixed(2),
      distanceCharge: +distanceCharge.toFixed(2),
      timeCharge: +timeCharge.toFixed(2),
      surgeCharge: +surgeAddition.toFixed(2),
      total,
      miles,
      minutes
    };
  };

  const fareEstimate = calculateFare(pickup, destination, selectedTier);

  // Handle Driver Online toggle
  const toggleDriverOnline = () => {
    setIsDriverOnline(prev => {
      const next = !prev;
      setDriverProfile(d => ({ ...d, isOnline: next }));
      setDriversList(list => 
        list.map(d => d.id === driverProfile.id ? { ...d, isOnline: next } : d)
      );
      if (!next && incomingTripOffer) {
        setIncomingTripOffer(null);
      }
      return next;
    });
  };

  // Request Ride (Rider Flow)
  const requestRide = () => {
    if (!destination || !fareEstimate) return;

    const newTripId = `trip-${Date.now().toString().slice(-4)}`;
    const newTrip: Trip = {
      id: newTripId,
      riderId: 'usr-1',
      riderName: 'Chirag G.',
      riderPhone: '+1 (555) 234-5678',
      pickup,
      destination,
      tier: selectedTier,
      status: 'requesting',
      fare: fareEstimate.total,
      baseFare: fareEstimate.base,
      distanceMiles: fareEstimate.miles,
      durationMinutes: fareEstimate.minutes,
      createdAt: new Date().toISOString(),
      paymentMethod
    };

    setCurrentTrip(newTrip);
    setNotification('Searching for nearby RideWeb drivers...');

    // If driver is online, push offer to driver
    if (isDriverOnline) {
      setIncomingTripOffer(newTrip);
      setIncomingOfferTimer(15);
    } else {
      // Auto assign fallback driver after 3 seconds
      setTimeout(() => {
        const availableDriver = driversList.find(d => d.isOnline && d.id !== driverProfile.id) || driversList[1];
        assignDriverToTrip(newTrip, availableDriver);
      }, 3000);
    }
  };

  // Offer countdown timer (15 seconds per PRD)
  useEffect(() => {
    if (incomingTripOffer) {
      if (offerCountdownRef.current) clearInterval(offerCountdownRef.current);
      offerCountdownRef.current = setInterval(() => {
        setIncomingOfferTimer(prev => {
          if (prev <= 1) {
            clearInterval(offerCountdownRef.current!);
            // Timeout: auto-decline and fallback match
            handleDeclineOfferTimeout(incomingTripOffer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (offerCountdownRef.current) clearInterval(offerCountdownRef.current);
    }

    return () => {
      if (offerCountdownRef.current) clearInterval(offerCountdownRef.current);
    };
  }, [incomingTripOffer]);

  const handleDeclineOfferTimeout = (tripToReassign: Trip) => {
    setIncomingTripOffer(null);
    setNotification('Driver was busy. Re-routing to another yellow taxi...');
    setTimeout(() => {
      const backupDriver = driversList.find(d => d.id !== driverProfile.id) || driversList[1];
      assignDriverToTrip(tripToReassign, backupDriver);
    }, 1500);
  };

  const acceptTripOffer = () => {
    if (!incomingTripOffer) return;
    if (offerCountdownRef.current) clearInterval(offerCountdownRef.current);
    const assignedTrip = { ...incomingTripOffer };
    setIncomingTripOffer(null);
    assignDriverToTrip(assignedTrip, driverProfile);
  };

  const declineTripOffer = () => {
    if (!incomingTripOffer) return;
    if (offerCountdownRef.current) clearInterval(offerCountdownRef.current);
    const tripToReassign = { ...incomingTripOffer };
    setIncomingTripOffer(null);
    handleDeclineOfferTimeout(tripToReassign);
  };

  const assignDriverToTrip = (trip: Trip, driver: Driver) => {
    const updatedTrip: Trip = {
      ...trip,
      driverId: driver.id,
      driver,
      status: 'driver_assigned'
    };
    setCurrentTrip(updatedTrip);
    setActiveDriverPosition(driver.currentLocation);
    setDriverEtaSeconds(180); // 3 mins away
    setTripProgressPercent(0);
    setNotification(`Driver ${driver.name} accepted! En route in ${driver.vehicle.color} (${driver.vehicle.plate})`);

    // Animate Driver moving to Pickup
    startVehicleMovementAnimation(driver.currentLocation, trip.pickup, () => {
      // Reached pickup
      setCurrentTrip(prev => prev ? { ...prev, status: 'arrived_pickup' } : null);
      setNotification(`Your driver ${driver.name} has arrived at ${trip.pickup.name}!`);
    });
  };

  // Driver update lifecycle manually or test button
  const driverUpdateStatus = (nextStatus: 'arrived_pickup' | 'in_progress' | 'completed') => {
    if (!currentTrip) return;

    if (nextStatus === 'arrived_pickup') {
      setCurrentTrip(prev => prev ? { ...prev, status: 'arrived_pickup' } : null);
      setNotification(`Driver marked arrived at pickup point.`);
    } else if (nextStatus === 'in_progress') {
      setCurrentTrip(prev => prev ? { ...prev, status: 'in_progress' } : null);
      setNotification(`Trip started! Heading to ${currentTrip.destination.name}.`);
      // Animate movement from pickup to destination
      startVehicleMovementAnimation(currentTrip.pickup, currentTrip.destination, () => {
        completeActiveTrip();
      });
    } else if (nextStatus === 'completed') {
      completeActiveTrip();
    }
  };

  const completeActiveTrip = () => {
    if (!currentTrip) return;
    const completed: Trip = {
      ...currentTrip,
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    setCurrentTrip(completed);
    setNotification(`Trip completed! Receipt total: $${completed.fare.toFixed(2)} charged to ${completed.paymentMethod}.`);

    // Add earnings to driver
    const driverEarnings = +(completed.fare * (1 - fareConfig.platformCommissionPercent / 100)).toFixed(2);
    setDriverProfile(d => ({
      ...d,
      todayEarnings: +(d.todayEarnings + driverEarnings).toFixed(2),
      weeklyEarnings: +(d.weeklyEarnings + driverEarnings).toFixed(2),
      totalTrips: d.totalTrips + 1
    }));
  };

  // Smooth path interpolation simulation
  const startVehicleMovementAnimation = (
    from: { x: number; y: number },
    to: { x: number; y: number },
    onArrival: () => void
  ) => {
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    let step = 0;
    const totalSteps = 40; // 40 ticks = ~8 seconds of smooth travel
    
    animationIntervalRef.current = setInterval(() => {
      step += 1;
      const progress = Math.min(1, step / totalSteps);
      
      // Interpolate with slight street turn jitter for realism
      const currentX = from.x + (to.x - from.x) * progress;
      const currentY = from.y + (to.y - from.y) * progress;
      setActiveDriverPosition({ x: +currentX.toFixed(2), y: +currentY.toFixed(2) });
      
      setTripProgressPercent(Math.round(progress * 100));
      setDriverEtaSeconds(Math.max(10, Math.round((1 - progress) * 180)));

      if (step >= totalSteps) {
        clearInterval(animationIntervalRef.current!);
        setActiveDriverPosition({ x: to.x, y: to.y });
        onArrival();
      }
    }, 200);
  };

  const cancelRide = () => {
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    if (offerCountdownRef.current) clearInterval(offerCountdownRef.current);
    setCurrentTrip(null);
    setIncomingTripOffer(null);
    setTripProgressPercent(0);
    setNotification('Ride request cancelled.');
  };

  const submitTripReview = (rating: number, tip: number, compliments: string[], feedback: string) => {
    if (!currentTrip) return;
    const reviewedTrip: Trip = {
      ...currentTrip,
      rating,
      tip,
      compliments,
      feedback
    };
    setTripHistory(prev => [reviewedTrip, ...prev]);
    setCurrentTrip(null);
    setNotification('Thank you for rating your RideWeb trip!');
  };

  const clearCompletedTrip = () => {
    if (currentTrip && currentTrip.status === 'completed') {
      setTripHistory(prev => [currentTrip, ...prev]);
      setCurrentTrip(null);
    }
  };

  // Admin Actions
  const updateFareConfig = (config: Partial<FareConfiguration>) => {
    setFareConfig(prev => ({ ...prev, ...config }));
    setNotification('Fare configuration updated successfully.');
  };

  const verifyDriverDoc = (
    driverId: string, 
    docType: 'license' | 'registration' | 'insurance', 
    status: 'approved' | 'rejected'
  ) => {
    setDriversList(prev => prev.map(d => {
      if (d.id === driverId) {
        return {
          ...d,
          documents: {
            ...d.documents,
            [docType]: { ...d.documents[docType], status }
          }
        };
      }
      return d;
    }));
    setNotification(`Driver document updated: ${docType} ${status}.`);
  };

  const uploadDriverDoc = (type: 'license' | 'registration' | 'insurance') => {
    setDriverProfile(d => ({
      ...d,
      documents: {
        ...d.documents,
        [type]: { ...d.documents[type], status: 'pending', submittedDate: new Date().toISOString().split('T')[0] }
      }
    }));
    setNotification(`Document uploaded: ${type} submitted for Admin review.`);
  };

  const toggleUserSuspension = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const next = !u.isSuspended;
        setNotification(`User ${u.name} is now ${next ? 'Suspended' : 'Active'}.`);
        return { ...u, isSuspended: next };
      }
      return u;
    }));
  };

  const allActiveTrips: Trip[] = currentTrip ? [currentTrip] : [];

  return (
    <RideContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        pickup,
        destination,
        selectedTier,
        paymentMethod,
        currentTrip,
        tripHistory,
        fareEstimate,
        driverEtaSeconds,
        tripProgressPercent,
        setPickup,
        setDestination,
        setSelectedTier,
        setPaymentMethod,
        requestRide,
        cancelRide,
        submitTripReview,
        clearCompletedTrip,

        driverProfile,
        isDriverOnline,
        toggleDriverOnline,
        incomingTripOffer,
        incomingOfferTimer,
        acceptTripOffer,
        declineTripOffer,
        driverUpdateStatus,
        uploadDriverDoc,

        fareConfig,
        updateFareConfig,
        driversList,
        usersList,
        verifyDriverDoc,
        toggleUserSuspension,

        allActiveTrips,
        activeDriverPosition,
        notification,
        setNotification
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRide = () => {
  const context = useContext(RideContext);
  if (!context) {
    throw new Error('useRide must be used within a RideProvider');
  }
  return context;
};
