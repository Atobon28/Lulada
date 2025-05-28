// src/Components/Home/Antojar/GoogleMapsLocationPicker.ts

// Interfaz para Google Maps
interface GoogleMapsAPI {
    maps: {
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker;
        Geocoder: new () => google.maps.Geocoder;
        event: {
            addListener: (instance: object, eventName: string, handler: () => void) => void;
        };
    };
}

declare const google: GoogleMapsAPI;

export class GoogleMapsLocationPicker extends HTMLElement {
    private map: google.maps.Map | null = null;
    private marker: google.maps.Marker | null = null;
    private mapContainer: HTMLElement | null = null;
    private geocoder: google.maps.Geocoder | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initializeMap();
    }

    private render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 300px;
                    }
                    
                    .map-container {
                        width: 100%;
                        height: 100%;
                        border-radius: 8px;
                        overflow: hidden;
                    }
                    
                    .loading {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        background-color: #f5f5f5;
                        color: #666;
                        font-family: Arial, sans-serif;
                    }
                </style>
                
                <div class="map-container" id="map">
                    <div class="loading">Cargando mapa...</div>
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

        this.mapContainer = this.shadowRoot?.querySelector('#map') || null;
        
        if (!this.mapContainer) return;

        // Coordenadas de Cali, Colombia
        const caliCoords = { lat: 3.4516, lng: -76.5320 };

        // Crear el mapa
        this.map = new google.maps.Map(this.mapContainer, {
            zoom: 13,
            center: caliCoords,
            mapTypeId: 'roadmap'
        });

        // Crear geocoder
        this.geocoder = new google.maps.Geocoder();

        // Crear marcador inicial
        this.marker = new google.maps.Marker({
            position: caliCoords,
            map: this.map,
            draggable: true,
            title: 'Selecciona ubicación'
        });

        // Evento cuando se mueve el marcador
        google.maps.event.addListener(this.marker, 'dragend', () => {
            this.onLocationSelected();
        });

        // Evento cuando se hace clic en el mapa
        google.maps.event.addListener(this.map, 'click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng && this.marker) {
                this.marker.setPosition(event.latLng);
                this.onLocationSelected();
            }
        });
    }

    private onLocationSelected() {
        if (!this.marker) return;

        const position = this.marker.getPosition();
        if (!position) return;

        const locationData = {
            lat: position.lat(),
            lng: position.lng(),
            address: 'Ubicación seleccionada'
        };

        // Obtener dirección usando geocoding
        if (this.geocoder) {
            this.geocoder.geocode(
                { location: position },
                (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
                    if (status === 'OK' && results && results[0]) {
                        locationData.address = results[0].formatted_address;
                    }

                    // Emitir evento con la ubicación seleccionada
                    this.dispatchEvent(new CustomEvent('location-selected', {
                        detail: locationData,
                        bubbles: true,
                        composed: true
                    }));
                }
            );
        }
    }

    // Método público para establecer ubicación
    public setLocation(lat: number, lng: number) {
        if (this.map && this.marker) {
            const position = { lat, lng };
            this.map.setCenter(position);
            this.marker.setPosition(position);
        }
    }
}

export default GoogleMapsLocationPicker;