export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Wake County parcel vector tileset (Mapbox Studio).
export const TILESET_ID = 'manojsrinivasa.wake-county-parcels';
export const SOURCE_LAYER = 'parcels';

export const MAP_CENTER = [-78.85, 35.78];
export const MAP_ZOOM = 11;

// Bounding box used to constrain Mapbox geocoding results to Wake County, NC.
export const GEOCODE_BBOX = '-79.2,35.5,-78.3,36.1';

export const MAP_STYLES = {
  light: { name: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
  dark: { name: 'Dark', url: 'mapbox://styles/mapbox/dark-v11' },
  satellite: { name: 'Satellite', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  streets: { name: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
};

// Matches rezoning petition numbers like "Z-29-2023".
export const PETITION_RE = /^[A-Z]{1,3}-\d{1,4}-\d{4}$/i;
