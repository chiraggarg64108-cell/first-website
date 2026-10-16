import { Driver, FareConfiguration, LocationPoint, PlatformUser, Trip, VehicleTier } from '../types';

export const POPULAR_LOCATIONS: LocationPoint[] = [
  {
    id: 'loc-1',
    name: 'Times Square & Broadway',
    address: 'Broadway & 42nd St, New York, NY',
    x: 48,
    y: 35,
    category: 'entertainment'
  },
  {
    id: 'loc-2',
    name: 'Grand Central Terminal',
    address: '89 E 42nd St, New York, NY',
    x: 62,
    y: 40,
    category: 'transit'
  },
  {
    id: 'loc-3',
    name: 'Central Park South',
    address: '59th St & 5th Ave, New York, NY',
    x: 52,
    y: 18,
    category: 'entertainment'
  },
  {
    id: 'loc-4',
    name: 'Financial District & Wall St',
    address: '11 Wall St, New York, NY',
    x: 35,
    y: 82,
    category: 'business'
  },
  {
    id: 'loc-5',
    name: 'SoHo Design District',
    address: 'Prince St & Mercer St, New York, NY',
    x: 40,
    y: 65,
    category: 'entertainment'
  },
  {
    id: 'loc-6',
    name: 'Hudson Yards & The Vessel',
    address: '20 Hudson Yards, New York, NY',
    x: 28,
    y: 42,
    category: 'entertainment'
  },
  {
    id: 'loc-7',
    name: 'JFK Airport Terminal 4',
    address: 'Queens, NY 11430',
    x: 88,
    y: 85,
    category: 'airport'
  },
  {
    id: 'loc-8',
    name: 'Brooklyn Bridge Promenade',
    address: 'Cadman Plaza E, Brooklyn, NY',
    x: 55,
    y: 88,
    category: 'entertainment'
  },
  {
    id: 'loc-9',
    name: 'Chelsea Market & High Line',
    address: '75 9th Ave, New York, NY',
    x: 32,
    y: 52,
    category: 'entertainment'
  },
  {
    id: 'loc-10',
    name: 'Midtown Tech Center',
    address: '111 8th Ave, New York, NY',
    x: 44,
    y: 48,
    category: 'business'
  }
];

export const VEHICLE_TIERS: VehicleTier[] = [
  {
    id: 'classic',
    name: 'RideWeb Classic',
    tagline: 'Iconic yellow cab, fast & affordable',
    capacity: 4,
    baseMultiplier: 1.0,
    etaMinutes: 3,
    icon: 'Car',
    badge: 'Popular'
  },
  {
    id: 'comfort',
    name: 'RideWeb Comfort',
    tagline: 'Spacious newer sedans with top drivers',
    capacity: 4,
    baseMultiplier: 1.35,
    etaMinutes: 5,
    icon: 'ShieldCheck'
  },
  {
    id: 'xl',
    name: 'RideWeb XL',
    tagline: 'SUVs & vans for groups up to 6 people',
    capacity: 6,
    baseMultiplier: 1.75,
    etaMinutes: 6,
    icon: 'Users'
  },
  {
    id: 'moto',
    name: 'RideWeb Express Moto',
    tagline: 'Single rider scooter, beats all traffic',
    capacity: 1,
    baseMultiplier: 0.75,
    etaMinutes: 2,
    icon: 'Zap'
  }
];

export const INITIAL_DRIVERS: Driver[] = [
  {
    id: 'drv-1',
    name: 'Marcus Vance',
    phone: '+1 (555) 349-8821',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    totalTrips: 1840,
    vehicle: {
      model: 'Toyota Camry Hybrid (Taxi Spec)',
      color: 'NYC Yellow & Gloss Black',
      plate: 'NYC-7Y42',
      tier: 'classic'
    },
    isOnline: true,
    status: 'idle',
    currentLocation: { x: 45, y: 32 },
    acceptanceRate: 97,
    todayEarnings: 148.50,
    weeklyEarnings: 890.20,
    documents: {
      license: { status: 'approved', submittedDate: '2026-09-10' },
      registration: { status: 'approved', submittedDate: '2026-09-10' },
      insurance: { status: 'approved', submittedDate: '2026-09-11' }
    }
  },
  {
    id: 'drv-2',
    name: 'Elena Rostova',
    phone: '+1 (555) 782-9914',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    totalTrips: 920,
    vehicle: {
      model: 'Honda CR-V Executive Yellow',
      color: 'Canary Yellow',
      plate: 'CAB-9921',
      tier: 'comfort'
    },
    isOnline: true,
    status: 'idle',
    currentLocation: { x: 60, y: 45 },
    acceptanceRate: 94,
    todayEarnings: 112.00,
    weeklyEarnings: 740.00,
    documents: {
      license: { status: 'approved', submittedDate: '2026-09-15' },
      registration: { status: 'approved', submittedDate: '2026-09-15' },
      insurance: { status: 'approved', submittedDate: '2026-09-15' }
    }
  },
  {
    id: 'drv-3',
    name: 'David Chen',
    phone: '+1 (555) 612-4091',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalTrips: 640,
    vehicle: {
      model: 'Ford Transit Passenger XL',
      color: 'Yellow Cab Spec',
      plate: 'VAN-4482',
      tier: 'xl'
    },
    isOnline: true,
    status: 'idle',
    currentLocation: { x: 30, y: 55 },
    acceptanceRate: 91,
    todayEarnings: 95.00,
    weeklyEarnings: 610.50,
    documents: {
      license: { status: 'approved', submittedDate: '2026-09-22' },
      registration: { status: 'approved', submittedDate: '2026-09-22' },
      insurance: { status: 'pending', submittedDate: '2026-10-14' }
    }
  },
  {
    id: 'drv-4',
    name: 'Tariq Al-Mansoor',
    phone: '+1 (555) 901-2384',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    totalTrips: 2100,
    vehicle: {
      model: 'Vespa Elettrica Yellow Sprint',
      color: 'Bumblebee Yellow',
      plate: 'MTO-1102',
      tier: 'moto'
    },
    isOnline: true,
    status: 'idle',
    currentLocation: { x: 50, y: 22 },
    acceptanceRate: 99,
    todayEarnings: 182.00,
    weeklyEarnings: 1140.00,
    documents: {
      license: { status: 'approved', submittedDate: '2026-08-01' },
      registration: { status: 'approved', submittedDate: '2026-08-01' },
      insurance: { status: 'approved', submittedDate: '2026-08-02' }
    }
  },
  {
    id: 'drv-5',
    name: 'Sarah Jenkins',
    phone: '+1 (555) 438-2190',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4.85,
    totalTrips: 410,
    vehicle: {
      model: 'Hyundai Sonata Yellow Taxi',
      color: 'Solar Yellow',
      plate: 'NYC-3310',
      tier: 'classic'
    },
    isOnline: false,
    status: 'idle',
    currentLocation: { x: 75, y: 70 },
    acceptanceRate: 88,
    todayEarnings: 0,
    weeklyEarnings: 520.00,
    documents: {
      license: { status: 'pending', submittedDate: '2026-10-15' },
      registration: { status: 'pending', submittedDate: '2026-10-15' },
      insurance: { status: 'pending', submittedDate: '2026-10-15' }
    }
  }
];

export const INITIAL_FARE_CONFIG: FareConfiguration = {
  baseFare: 2.50,
  perMileRate: 1.85,
  perMinuteRate: 0.40,
  platformCommissionPercent: 20,
  surgeMultiplier: 1.0
};

export const INITIAL_TRIP_HISTORY: Trip[] = [
  {
    id: 'trip-901',
    riderId: 'usr-1',
    riderName: 'Chirag G.',
    riderPhone: '+1 (555) 234-5678',
    driverId: 'drv-1',
    driver: INITIAL_DRIVERS[0],
    pickup: POPULAR_LOCATIONS[0],
    destination: POPULAR_LOCATIONS[1],
    tier: 'classic',
    status: 'completed',
    fare: 14.80,
    baseFare: 2.50,
    distanceMiles: 1.4,
    durationMinutes: 9,
    createdAt: '2026-10-15T18:30:00Z',
    completedAt: '2026-10-15T18:41:00Z',
    rating: 5,
    tip: 3.00,
    compliments: ['Smooth Driving', 'Clean Car', 'Great Music'],
    feedback: 'Prompt arrival right at the 7th avenue corner. Perfect ride!',
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'trip-902',
    riderId: 'usr-1',
    riderName: 'Chirag G.',
    riderPhone: '+1 (555) 234-5678',
    driverId: 'drv-2',
    driver: INITIAL_DRIVERS[1],
    pickup: POPULAR_LOCATIONS[2],
    destination: POPULAR_LOCATIONS[4],
    tier: 'comfort',
    status: 'completed',
    fare: 28.50,
    baseFare: 4.00,
    distanceMiles: 4.2,
    durationMinutes: 21,
    createdAt: '2026-10-14T14:15:00Z',
    completedAt: '2026-10-14T14:38:00Z',
    rating: 5,
    tip: 5.00,
    compliments: ['Excellent Service', 'Comfortable Ride'],
    paymentMethod: 'Visa •••• 4242'
  },
  {
    id: 'trip-903',
    riderId: 'usr-1',
    riderName: 'Chirag G.',
    riderPhone: '+1 (555) 234-5678',
    driverId: 'drv-4',
    driver: INITIAL_DRIVERS[3],
    pickup: POPULAR_LOCATIONS[5],
    destination: POPULAR_LOCATIONS[8],
    tier: 'moto',
    status: 'completed',
    fare: 11.20,
    baseFare: 1.50,
    distanceMiles: 2.1,
    durationMinutes: 8,
    createdAt: '2026-10-12T09:00:00Z',
    completedAt: '2026-10-12T09:09:00Z',
    rating: 5,
    tip: 2.00,
    compliments: ['Super Fast', 'Bypassed Traffic'],
    paymentMethod: 'RideWeb Cash'
  }
];

export const INITIAL_PLATFORM_USERS: PlatformUser[] = [
  {
    id: 'usr-1',
    name: 'Chirag G.',
    role: 'rider',
    email: 'chirag.g@example.com',
    phone: '+1 (555) 234-5678',
    joinedDate: '2026-03-14',
    tripsCount: 42,
    rating: 4.95,
    isSuspended: false
  },
  {
    id: 'usr-2',
    name: 'Samantha Grey',
    role: 'rider',
    email: 'sgrey@metromail.com',
    phone: '+1 (555) 819-2011',
    joinedDate: '2026-05-20',
    tripsCount: 19,
    rating: 4.88,
    isSuspended: false
  },
  {
    id: 'usr-3',
    name: 'Liam Vance',
    role: 'rider',
    email: 'liam.vance@techhub.io',
    phone: '+1 (555) 993-4120',
    joinedDate: '2026-07-02',
    tripsCount: 8,
    rating: 4.60,
    isSuspended: false
  },
  {
    id: 'drv-1',
    name: 'Marcus Vance',
    role: 'driver',
    email: 'marcus.v@ridewebtaxi.com',
    phone: '+1 (555) 349-8821',
    joinedDate: '2025-11-10',
    tripsCount: 1840,
    rating: 4.96,
    isSuspended: false
  },
  {
    id: 'drv-2',
    name: 'Elena Rostova',
    role: 'driver',
    email: 'elena.rostova@yellowfleet.com',
    phone: '+1 (555) 782-9914',
    joinedDate: '2026-01-18',
    tripsCount: 920,
    rating: 4.92,
    isSuspended: false
  },
  {
    id: 'drv-3',
    name: 'David Chen',
    role: 'driver',
    email: 'd.chen@nyccabs.org',
    phone: '+1 (555) 612-4091',
    joinedDate: '2026-02-12',
    tripsCount: 640,
    rating: 4.88,
    isSuspended: false
  },
  {
    id: 'drv-4',
    name: 'Tariq Al-Mansoor',
    role: 'driver',
    email: 'tariq.moto@speedtransit.com',
    phone: '+1 (555) 901-2384',
    joinedDate: '2025-08-01',
    tripsCount: 2100,
    rating: 4.98,
    isSuspended: false
  },
  {
    id: 'drv-5',
    name: 'Sarah Jenkins',
    role: 'driver',
    email: 'sarah.j@urbanride.net',
    phone: '+1 (555) 438-2190',
    joinedDate: '2026-10-15',
    tripsCount: 410,
    rating: 4.85,
    isSuspended: false
  }
];
