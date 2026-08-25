export type VerificationState = 'verified' | 'community' | 'pending';

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
};

export type LocalSignal = {
  id: string;
  kind: 'offer' | 'editorial' | 'tourism' | 'community';
  title: string;
  summary: string;
  sponsored?: boolean;
  verification?: VerificationState;
};

export type LocalDashboard = {
  location: GeoPoint;
  weather: WeatherSnapshot;
  rating: number;
  ratingSource: string;
  business: LocalBusiness;
  signals: LocalSignal[];
};
