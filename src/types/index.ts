export type UserRole = 'rider' | 'driver' | 'admin';

export type TripStatus = 
  | 'idle' 
  | 'requesting' 
  | 'driver_assigned' 
  | 'arrived_pickup' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  x: number; // 0 - 100 on map coordinate space
  y: number; // 0 - 100 on map coordinate space
  category?: 'airport' | 'transit' | 'hotel' | 'entertainment' | 'business' | 'residential';
}

export type VehicleCategory = 'classic' | 'comfort' | 'xl' | 'moto';

export interface VehicleTier {
  id: VehicleCategory;
  name: string;
  tagline: string;
  capacity: number;
  baseMultiplier: number;
  etaMinutes: number;
  icon: string;
  badge?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  totalTrips: number;
  vehicle: {
    model: string;
    color: string;
    plate: string;
    tier: VehicleCategory;
  };
  isOnline: boolean;
  status: 'idle' | 'en_route_pickup' | 'at_pickup' | 'in_trip';
  currentLocation: { x: number; y: number };
  acceptanceRate: number;
  todayEarnings: number;
  weeklyEarnings: number;
  documents: {
    license: { status: 'approved' | 'pending' | 'rejected'; docUrl?: string; submittedDate: string };
    registration: { status: 'approved' | 'pending' | 'rejected'; docUrl?: string; submittedDate: string };
    insurance: { status: 'approved' | 'pending' | 'rejected'; docUrl?: string; submittedDate: string };
  };
  isSuspended?: boolean;
}

export interface Trip {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  driverId?: string;
  driver?: Driver;
  pickup: LocationPoint;
  destination: LocationPoint;
  tier: VehicleCategory;
  status: TripStatus;
  fare: number;
  baseFare: number;
  distanceMiles: number;
  durationMinutes: number;
  createdAt: string;
  completedAt?: string;
  rating?: number;
  tip?: number;
  compliments?: string[];
  feedback?: string;
  paymentMethod: string;
}

export interface FareConfiguration {
  baseFare: number;
  perMileRate: number;
  perMinuteRate: number;
  platformCommissionPercent: number;
  surgeMultiplier: number;
}

export interface PlatformUser {
  id: string;
  name: string;
  role: 'rider' | 'driver';
  email: string;
  phone: string;
  joinedDate: string;
  tripsCount: number;
  rating: number;
  isSuspended: boolean;
}
