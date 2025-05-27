export interface PublicationLocation {
    latitude: number;
    longitude: number;
    address: string;
    restaurantName?: string;
}

export class PublicationLocationService {
    private static instance: PublicationLocationService;

    private constructor() {}

    public static getInstance(): PublicationLocationService {
        if (!PublicationLocationService.instance) {
            PublicationLocationService.instance = new PublicationLocationService();
        }
        return PublicationLocationService.instance;
    }

    // Obtener dirección usando Nominatim (OpenStreetMap)
    public async getAddressFromCoords(lat: number, lng: number): Promise<string> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data && data.display_name) {
                // Extraer solo la parte relevante de la dirección
                const parts = data.display_name.split(',');
                return parts.slice(0, 3).join(',').trim();
            }
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } catch (error) {
            console.error('Error al obtener dirección:', error);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }

    // Determinar zona de Cali basada en coordenadas
    public determineZone(lat: number, lng: number): string {
        // Coordenadas de referencia para Cali, Colombia
        const caliCenter = { lat: 3.4516, lng: -76.5320 };
        
        // Lógica simplificada para zonas de Cali
        if (lat > 3.46 && lng > -76.52) return 'norte';
        if (lat < 3.44 && lng > -76.52) return 'sur';
        if (lng < -76.54) return 'oeste';
        return 'centro';
    }

    // Validar si las coordenadas están dentro del área de Cali
    public isInCaliArea(lat: number, lng: number): boolean {
        // Límites aproximados de Cali
        const bounds = {
            north: 3.55,
            south: 3.35,
            east: -76.45,
            west: -76.60
        };

        return lat >= bounds.south && lat <= bounds.north && 
               lng >= bounds.west && lng <= bounds.east;
    }

    // Buscar lugares cercanos usando Nominatim
    public async searchNearbyPlaces(lat: number, lng: number, query: string = 'restaurant'): Promise<any[]> {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&lat=${lat}&lon=${lng}&radius=1000&limit=10`
            );
            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Error al buscar lugares:', error);
            return [];
        }
    }
}