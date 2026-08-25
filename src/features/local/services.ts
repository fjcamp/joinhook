import type { LocalDashboard } from './types';
import { loadSupabaseDashboard } from './supabaseGateway';

export interface LocalDataGateway {
  getDashboard(businessId?: string): Promise<LocalDashboard>;
}

const demoDashboard: LocalDashboard = {
  location: { lat: -41.3195, lng: -72.9854, label: 'Puerto Varas' },
  weather: { temperatureC: 14, condition: 'Parcialmente nublado', outdoorStatus: 'Apto para actividades exteriores', observedAt: new Date().toISOString(), source: 'Datos de contingencia' },
  rating: 4.9,
  ratingSource: 'Comunidad local',
  business: {
    id: 'taller-austral', name: 'Taller Austral', category: 'Artesanía', city: 'Puerto Varas', distanceMeters: 350, openNow: true, verification: 'verified',
    summary: 'Piezas locales, experiencias y catálogo en un espacio comercial dinámico.', directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Puerto+Varas+Chile', contactUrl: 'https://wa.me/',
    catalog: [
      { id: 'taza', category: 'Popular', name: 'Taza de cerámica', priceLabel: '$12.000', featured: true },
      { id: 'vela', category: 'Patagonia', name: 'Vela artesanal', priceLabel: '$9.500' },
      { id: 'manta', category: 'Textil', name: 'Manta local', priceLabel: '$45.000' },
      { id: 'cuaderno', category: 'Cuero', name: 'Cuaderno', priceLabel: '$15.000' },
      { id: 'taller', category: 'Experiencia', name: 'Taller breve', priceLabel: 'Reservar' },
    ],
  },
  signals: [
    { id: 'offer-1', kind: 'offer', title: '15% DCTO.', summary: 'Visible hoy · patrocinado claramente identificado', sponsored: true, sourceLabel: 'Promoción del comercio' },
    { id: 'editorial-1', kind: 'editorial', title: 'Editorial local', summary: 'Medios regionales y periodismo local con fuente y derechos definidos.', sourceLabel: 'Contenido editorial' },
    { id: 'tourism-1', kind: 'tourism', title: 'Agencia de turismo', summary: 'Excursiones · contacto · idiomas · registro consultable', verification: 'verified', sourceLabel: 'Operador verificado' },
    { id: 'community-1', kind: 'community', title: 'Turismo de pueblos originarios', summary: 'Espacio gestionado por sus anfitriones, con identidad y contenidos sujetos a consentimiento.', verification: 'community', sourceLabel: 'Comunidad anfitriona' },
  ],
};

export class HybridLocalDataGateway implements LocalDataGateway {
  async getDashboard(businessId?: string): Promise<LocalDashboard> {
    try { return await loadSupabaseDashboard(undefined, businessId); }
    catch { return structuredClone(demoDashboard); }
  }
}

export const localDataGateway: LocalDataGateway = new HybridLocalDataGateway();
