import { PublicationLocation } from '../../../Services/PublicationLocationService';

declare global {
    interface Window {
        google: any;
    }
}

export class GoogleMapsLocationViewer extends HTMLElement {
    private map: any = null;
    private location: PublicationLocation | null = null;
    private isMapReady: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['latitude', 'longitude', 'address', 'restaurant-name'];
    }

    connectedCallback() {
        this.loadLocationData();
        this.loadGoogleMapsAndRender();
    }

    attributeChangedCallback() {
        this.loadLocationData();
        if (this.isMapReady) {
            this.updateMap();
        }
    }

    private loadLocationData() {
        const lat = parseFloat(this.getAttribute('latitude') || '0');
        const lng = parseFloat(this.getAttribute('longitude') || '0');
        const address = this.getAttribute('address') || '';
        const restaurantName = this.getAttribute('restaurant-name') || '';

        if (lat && lng) {
            this.location = {
                latitude: lat,
                longitude: lng,
                address: address,
                restaurantName: restaurantName
            };
        }
    }

    private async loadGoogleMapsAndRender() {
        // Cargar Google Maps si no está cargado
        if (!window.google) {
            await this.loadGoogleMapsScript();
        }

        this.render();
        setTimeout(() => this.initMap(), 100);
    }

    private loadGoogleMapsScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpxXqWBgw`;
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
        });
    }

    private render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: Arial, sans-serif;
                }

                :host([hidden]) {
                    display: none !important;
                }

                :host(.show-modal) {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    z-index: 10001;
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 0, 0, 0.7);
                    padding: 20px;
                    box-sizing: border-box;
                }

                .viewer-container {
                    background: white;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .viewer-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #2563eb;
                    color: white;
                }

                .viewer-title {
                    font-size: 18px;
                    font-weight: bold;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .location-info {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }

                .restaurant-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #1f2937;
                    margin-bottom: 8px;
                }

                .restaurant-name.hidden {
                    display: none;
                }

                .location-address {
                    font-size: 14px;
                    color: #6b7280;
                    line-height: 1.5;
                }

                .map-container {
                    height: 350px;
                    position: relative;
                }

                #map {
                    height: 100%;
                    width: 100%;
                }

                .map-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #6b7280;
                    text-align: center;
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .map-loading.hidden {
                    display: none;
                }

                .action-buttons {
                    padding: 20px;
                    display: flex;
                    gap: 12px;
                }

                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    flex: 1;
                    font-weight: 500;
                    text-decoration: none;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .btn-directions {
                    background: #2563eb;
                    color: white;
                }

                .btn-directions:hover {
                    background: #1d4ed8;
                }

                .btn-close {
                    background: #f8fafc;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                }

                .btn-close:hover {
                    background: #f1f5f9;
                }

                @media (max-width: 600px) {
                    :host(.show-modal) {
                        padding: 10px;
                    }

                    .viewer-container {
                        max-height: 95vh;
                    }

                    .viewer-header,
                    .location-info,
                    .action-buttons {
                        padding: 15px;
                    }

                    .map-container {
                        height: 280px;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }
                }
            </style>

            <div class="viewer-container">
                <div class="viewer-header">
                    <h3 class="viewer-title">
                        📍 Ubicación del restaurante
                    </h3>
                    <button id="close-btn" class="close-btn">✕</button>
                </div>

                <div class="location-info">
                    <div id="restaurant-name" class="restaurant-name"></div>
                    <div id="location-address" class="location-address"></div>
                </div>

                <div class="map-container">
                    <div id="map-loading" class="map-loading">
                        🗺️ Cargando mapa...
                    </div>
                    <div id="map"></div>
                </div>

                <div class="action-buttons">
                    <button id="close-modal-btn" class="btn btn-close">Cerrar</button>
                    <a id="directions-btn" class="btn btn-directions" target="_blank">
                        🧭 Cómo llegar
                    </a>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.updateLocationInfo();
    }

    private initMap() {
        if (!window.google || this.isMapReady || !this.location) return;

        try {
            const mapElement = this.shadowRoot?.querySelector('#map');
            if (!mapElement) return;

            // Crear mapa centrado en la ubicación
            this.map = new window.google.maps.Map(mapElement, {
                zoom: 16,
                center: { lat: this.location.latitude, lng: this.location.longitude },
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    }
                ]
            });

            // Agregar marcador
            const marker = new window.google.maps.Marker({
                position: { lat: this.location.latitude, lng: this.location.longitude },
                map: this.map,
                title: this.location.restaurantName || 'Restaurante'
            });

            // Agregar info window con información
            const infoWindow = new window.google.maps.InfoWindow({
                content: `
                    <div style="font-family: Arial, sans-serif; max-width: 250px;">
                        ${this.location.restaurantName ? `<h3 style="margin: 0 0 8px 0; color: #1f2937;">${this.location.restaurantName}</h3>` : ''}
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">${this.location.address}</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                infoWindow.open(this.map, marker);
            });

            // Abrir info window automáticamente
            infoWindow.open(this.map, marker);

            this.isMapReady = true;

            // Ocultar loading usando classList
            const loading = this.shadowRoot?.querySelector('#map-loading');
            if (loading) {
                loading.classList.add('hidden');
            }

        } catch (error) {
            console.error('Error al inicializar Google Maps:', error);
        }
    }

    private updateMap() {
        if (this.map && this.location) {
            this.map.setCenter({ lat: this.location.latitude, lng: this.location.longitude });
        }
    }

    private updateLocationInfo() {
        if (!this.location) return;

        const restaurantName = this.shadowRoot?.querySelector('#restaurant-name');
        const locationAddress = this.shadowRoot?.querySelector('#location-address');
        const directionsBtn = this.shadowRoot?.querySelector('#directions-btn') as HTMLAnchorElement;

        if (restaurantName) {
            if (this.location.restaurantName) {
                restaurantName.textContent = this.location.restaurantName;
                restaurantName.classList.remove('hidden');
            } else {
                restaurantName.classList.add('hidden');
            }
        }

        if (locationAddress) {
            locationAddress.textContent = this.location.address || 
                `${this.location.latitude.toFixed(4)}, ${this.location.longitude.toFixed(4)}`;
        }

        if (directionsBtn) {
            // Crear enlace para Google Maps
            const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${this.location.latitude},${this.location.longitude}`;
            directionsBtn.href = googleMapsUrl;
        }
    }

    private setupEventListeners() {
        // Botón cerrar (X)
        const closeBtn = this.shadowRoot?.querySelector('#close-btn');
        closeBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        // Botón cerrar (Cerrar)
        const closeModalBtn = this.shadowRoot?.querySelector('#close-modal-btn');
        closeModalBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    private closeModal() {
        this.dispatchEvent(new CustomEvent('location-viewer-close', {
            bubbles: true,
            composed: true
        }));
    }

    // Métodos públicos - SIN ERRORES DE STYLE
    public openModal(): void {
        this.hidden = false;
        this.classList.add('show-modal');
        setTimeout(() => {
            if (!this.isMapReady) {
                this.initMap();
            }
        }, 100);
    }

    public closeModalPublic(): void {
        this.hidden = true;
        this.classList.remove('show-modal');
    }

    public setLocation(location: PublicationLocation): void {
        this.location = location;
        this.updateLocationInfo();
        if (this.isMapReady) {
            this.updateMap();
        }
    }
}

export default GoogleMapsLocationViewer;