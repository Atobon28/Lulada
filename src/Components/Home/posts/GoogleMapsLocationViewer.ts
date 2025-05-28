// src/Components/Home/posts/GoogleMapsLocationViewer.ts

// Interfaces específicas para Google Maps en lugar de usar any
interface GoogleMapsMapOptions {
    zoom: number;
    center: { lat: number; lng: number };
    mapTypeId: string;
    disableDefaultUI: boolean;
    zoomControl: boolean;
    scrollwheel: boolean;
}

interface GoogleMapsMarkerOptions {
    position: { lat: number; lng: number };
    map: GoogleMapsMap;
    title?: string;
}

interface GoogleMapsMap {
    setCenter(position: { lat: number; lng: number }): void;
}

interface GoogleMapsMarker {
    setPosition(position: { lat: number; lng: number }): void;
    setTitle(title: string): void;
}

// Interfaz para Google Maps API completa
interface GoogleMapsAPI {
    maps: {
        Map: new (element: HTMLElement, options: GoogleMapsMapOptions) => GoogleMapsMap;
        Marker: new (options: GoogleMapsMarkerOptions) => GoogleMapsMarker;
    };
}

declare const google: GoogleMapsAPI;

export class GoogleMapsLocationViewer extends HTMLElement {
    private map: GoogleMapsMap | null = null;
    private marker: GoogleMapsMarker | null = null;

    static get observedAttributes() {
        return ['lat', 'lng', 'address'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initializeMap();
    }

    attributeChangedCallback() {
        if (this.map) {
            this.updateMapLocation();
        }
    }

    private render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 200px;
                        margin: 10px 0;
                    }
                    
                    .map-container {
                        width: 100%;
                        height: 100%;
                        border-radius: 8px;
                        overflow: hidden;
                        border: 1px solid #ddd;
                    }
                    
                    .loading {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        background-color: #f5f5f5;
                        color: #666;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                    }
                    
                    .address-info {
                        padding: 8px;
                        background-color: #f9f9f9;
                        border-top: 1px solid #ddd;
                        font-size: 12px;
                        color: #666;
                        font-family: Arial, sans-serif;
                    }
                </style>
                
                <div class="map-container" id="map">
                    <div class="loading">📍 Cargando ubicación...</div>
                </div>
                <div class="address-info" id="address">
                    ${this.getAttribute('address') || 'Ubicación no especificada'}
                </div>
            `;
        }
    }

    private initializeMap() {
        // Verificar si Google Maps está disponible
        if (typeof google === 'undefined' || !google.maps) {
            console.warn('Google Maps API no está cargada');
            return;
        }

        const mapContainer = this.shadowRoot?.querySelector('#map');
        if (!mapContainer) return;

        const lat = parseFloat(this.getAttribute('lat') || '3.4516');
        const lng = parseFloat(this.getAttribute('lng') || '-76.5320');

        // Crear el mapa
        this.map = new google.maps.Map(mapContainer as HTMLElement, {
            zoom: 15,
            center: { lat, lng },
            mapTypeId: 'roadmap',
            disableDefaultUI: true,
            zoomControl: true,
            scrollwheel: false
        });

        // Crear marcador
        this.marker = new google.maps.Marker({
            position: { lat, lng },
            map: this.map,
            title: this.getAttribute('address') || 'Ubicación'
        });
    }

    private updateMapLocation() {
        if (!this.map || !this.marker) return;

        const lat = parseFloat(this.getAttribute('lat') || '3.4516');
        const lng = parseFloat(this.getAttribute('lng') || '-76.5320');
        const address = this.getAttribute('address') || 'Ubicación no especificada';

        const position = { lat, lng };
        
        this.map.setCenter(position);
        this.marker.setPosition(position);
        this.marker.setTitle(address);

        // Actualizar dirección mostrada
        const addressElement = this.shadowRoot?.querySelector('#address');
        if (addressElement) {
            addressElement.textContent = address;
        }
    }
}

export default GoogleMapsLocationViewer;