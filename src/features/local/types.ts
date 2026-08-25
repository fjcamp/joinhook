export type VerificationState = 'verified' | 'community' | 'pending';
export type RuntimeStatus = 'loading' | 'ready' | 'stale' | 'degraded' | 'error';
export type LocationPermission = 'unknown' | 'granted' | 'denied' | 'unavailable';

export type RuntimeState = {
  status: RuntimeStatus;
  online: boolean;
  locationPermission: LocationPermission;
  lastUpdated: string | null;
};

export type GeoPoint = {
  lat: number;
  lng: number;
  label: string;
};

export type WeatherSnapshot = {
  temperatureC: number;
  condition: string;
  outdoorStatus: string;
  observedAt: string;
  source?: string;
  windKmh?: number;
};

export type CatalogItem = {
  id: string;
  category: string;
  name: string;
  priceLabel: string;
  featured?: boolean;
};

export type LocalBusiness = {
  id: string;
  name: string;
  category: string;
  city: string;
  distanceMeters: number;
  openNow: boolean;
  verification: VerificationState;
  summary: string;
  catalog: CatalogItem[];
  directionsUrl?: string;
  contactUrl?: string;
};

export type BusinessDiscoveryItem = {
  id: string;
  name: string;
  category: string;
  city: string;
  summary: string;
  openNow: boolean;
  verification: VerificationState;
  distanceMeters: number | null;
};

export type LocalSignal = {
  id: string;
  kind: 'offer' | 'editorial' | 'tourism' | 'community' | 'event';
  title: string;
  summary: string;
  sponsored?: boolean;
  verification?: VerificationState;
  sourceLabel?: string;
};

export type LocalDashboard = {
  location: GeoPoint;
  weather: WeatherSnapshot;
  rating: number;
  ratingSource: string;
  business: LocalBusiness;
  signals: LocalSignal[];
  updatedAt?: string;
};
