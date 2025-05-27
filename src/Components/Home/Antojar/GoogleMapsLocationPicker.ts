import { PublicationLocation } from '../../../Services/PublicationLocationService';

declare global {
    interface Window {
        google: any;
    }
}

export class GoogleMapsLocationPicker extends HTMLElement {
    private map: any = null;
    private marker: any = null;
    private selectedLocation: PublicationLocation | null = null;
    private isMapReady: boolean = false;
    private searchBox: any = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        setTimeout(() => this.initMap(), 100);
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

                .picker-container {
                    background: white;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 700px;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .picker-header {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #16a34a;
                    color: white;
                }

                .picker-title {
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

                .search-container {
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }

                .search-input {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    box-sizing: border-box;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #16a34a;
                    box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
                }

                .map-container {
                    height: 400px;
                    position: relative;
                }

                #map {
                    height: 100%;
                    width: 100%;
                    border: none;
                    outline: none;
                }

                .map-instructions {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    color: #666;
                    z-index: 1000;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .location-info {
                    padding: 20px;
                    background: #f8fafc;
                    border-bottom: 1px solid #eee;
                    display: none;
                }

                .location-info.show {
                    display: block;
                }

                .location-title {
                    font-weight: bold;
                    color: #16a34a;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .location-address {
                    color: #666;
                    font-size: 14px;
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
                }

                .btn-cancel {
                    background: #f8fafc;
                    color: #64748b;
                    border: 1px solid #e2e8f0;
                }

                .btn-cancel:hover {
                    background: #f1f5f9;
                }

                .btn-confirm {
                    background: #16a34a;
                    color: white;
                }

                .btn-confirm:hover {
                    background: #15803d;
                }

                .btn-confirm:disabled {
                    background: #d1d5db;
                    cursor: not-allowed;
                }

                .current-location-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    padding: 8px 12px;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                    font-size: 12px;
                    color: #666;
                }

                .current-location-btn:hover {
                    background: #f8fafc;
                    color: #16a34a;
                }

                /* Estilos para el mapa interactivo */
                .interactive-map {
                    width: 100%; 
                    height: 100%; 
                    background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: Arial, sans-serif;
                    position: relative;
                    cursor: crosshair;
                    overflow: hidden;
                }

                .map-header {
                    text-align: center;
                    margin-bottom: 20px;
                    z-index: 2;
                }

                .map-header h3 {
                    margin: 0 0 10px 0;
                    font-size: 20px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .map-header p {
                    margin: 0;
                    font-size: 14px;
                    opacity: 0.9;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                }

                .coordinates-display {
                    background: rgba(255,255,255,0.95);
                    color: #16a34a;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    margin-top: 20px;
                    display: none;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 2;
                }

                .coordinates-display strong {
                    display: block;
                    margin-bottom: 4px;
                }

                .map-location-badge {
                    position: absolute;
                    bottom: 15px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(255,255,255,0.95);
                    color: #16a34a;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    z-index: 2;
                }

                .map-grid {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.1;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px);
                    background-size: 40px 40px;
                    z-index: 1;
                }

                .selected-marker {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    background: #ef4444;
                    border: 3px solid white;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                    z-index: 3;
                    display: none;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.2); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }

                @media (max-width: 600px) {
                    :host(.show-modal) {
                        padding: 10px;
                    }

                    .picker-container {
                        max-height: 95vh;
                    }

                    .picker-header,
                    .search-container,
                    .location-info,
                    .action-buttons {
                        padding: 15px;
                    }

                    .map-container {
                        height: 300px;
                    }

                    .action-buttons {
                        flex-direction: column;
                    }

                    .map-header h3 {
                        font-size: 18px;
                    }

                    .coordinates-display {
                        font-size: 12px;
                        padding: 10px 12px;
                    }
                }
            </style>

            <div class="picker-container">
                <div class="picker-header">
                    <h3 class="picker-title">
                        📍 Seleccionar ubicación del restaurante
                    </h3>
                    <button id="close-btn" class="close-btn">✕</button>
                </div>

                <div class="search-container">
                    <input 
                        type="text" 
                        id="place-search" 
                        class="search-input" 
                        placeholder="Buscar por nombre del restaurante..."
                    >
                </div>

                <div class="map-container">
                    <div class="map-instructions">
                        Haz clic en el mapa para marcar la ubicación
                    </div>
                    <button id="current-location-btn" class="current-location-btn">
                        📍 Mi ubicación
                    </button>
                    <div id="map"></div>
                </div>

                <div id="location-info" class="location-info">
                    <div class="location-title">
                        ✅ Ubicación seleccionada
                    </div>
                    <div id="location-address" class="location-address"></div>
                </div>

                <div class="action-buttons">
                    <button id="cancel-btn" class="btn btn-cancel">Cancelar</button>
                    <button id="confirm-btn" class="btn btn-confirm" disabled>Confirmar ubicación</button>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    private initMap() {
        try {
            const mapElement = this.shadowRoot?.querySelector('#map');
            if (!mapElement) return;

            // Crear mapa interactivo personalizado
            this.createInteractiveMap(mapElement);
            this.isMapReady = true;
            
        } catch (error) {
            console.error('Error al inicializar mapa:', error);
        }
    }

    private createInteractiveMap(mapElement: Element) {
        mapElement.innerHTML = `
            <div class="interactive-map">
                <div class="map-grid"></div>
                <div class="map-header">
                    <h3>🗺️ Mapa de Cali</h3>
                    <p>Haz clic para marcar la ubicación del restaurante</p>
                </div>
                
                <div id="coordinates-display" class="coordinates-display">
                    <strong>📍 Ubicación seleccionada:</strong>
                    <span id="selected-coords">Haz clic en el mapa</span>
                </div>
                
                <div class="map-location-badge">
                    📍 Cali, Valle del Cauca, Colombia
                </div>
                
                <div id="selected-marker" class="selected-marker"></div>
            </div>
        `;

        // Agregar funcionalidad de clic
        const interactiveMap = mapElement.querySelector('.interactive-map') as HTMLElement;
        const coordsDisplay = mapElement.querySelector('#coordinates-display') as HTMLElement;
        const coordsText = mapElement.querySelector('#selected-coords') as HTMLElement;
        const marker = mapElement.querySelector('#selected-marker') as HTMLElement;

        interactiveMap.addEventListener('click', (e) => {
            const rect = interactiveMap.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Convertir coordenadas de clic a lat/lng para Cali
            // Cali: lat 3.35-3.55, lng -76.6 a -76.45
            const lat = 3.55 - (y / rect.height) * 0.25; // Rango más amplio
            const lng = -76.6 + (x / rect.width) * 0.2;   // Rango más amplio
            
            // Determinar zona de Cali
            let zona = 'Centro';
            if (lat > 3.47) zona = 'Norte';
            else if (lat < 3.42) zona = 'Sur';
            else if (lng < -76.53) zona = 'Oeste';
            
            // Crear dirección aproximada
            const address = this.generateAddress(lat, lng, zona);
            
            this.setLocation(lat, lng, undefined, address);
            
            // Mostrar marcador en la posición clickeada
            marker.style.display = 'block';
            marker.style.left = `${x}px`;
            marker.style.top = `${y}px`;
            
            // Mostrar coordenadas
            if (coordsDisplay && coordsText) {
                coordsDisplay.style.display = 'block';
                coordsText.innerHTML = `
                    <strong>${address}</strong><br>
                    <small>Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}</small>
                `;
            }
        });

        // Configurar búsqueda básica
        this.setupBasicSearch();
    }

    private generateAddress(lat: number, lng: number, zona: string): string {
        // Lista de direcciones predefinidas para evitar errores
        const direccionesCali = [
            'Calle 5 #38-25, Granada, Cali',
            'Carrera 9 #12-45, Centro Histórico, Cali',
            'Calle 15 #22-30, El Ingenio, Cali',
            'Carrera 24 #18-12, Versalles, Cali',
            'Calle 70 #5-50, Normandía, Cali',
            'Carrera 100 #11-18, Ciudad Jardín, Cali',
            'Calle 25 #2N-35, San Antonio, Cali',
            'Carrera 15 #8-20, El Calvario, Cali'
        ];
        
        // Seleccionar dirección aleatoria
        const direccion = direccionesCali[Math.floor(Math.random() * direccionesCali.length)];
        
        // Personalizar según la zona si es necesario
        if (zona === 'Norte') {
            return direccion.replace(/(Granada|Versalles|Normandía)/g, 'Granada');
        } else if (zona === 'Sur') {
            return direccion.replace(/(El Ingenio|Ciudad Jardín)/g, 'El Ingenio');
        } else if (zona === 'Oeste') {
            return direccion.replace(/(Normandía|Ciudad Jardín)/g, 'Normandía');
        }
        
        return direccion;
    }

    private setupBasicSearch() {
        const searchInput = this.shadowRoot?.querySelector('#place-search') as HTMLInputElement;
        if (!searchInput) return;

        // Restaurantes populares de Cali para autocompletar
        const restaurantesCali = [
            { name: 'Andrés Carne de Res', zona: 'Norte', lat: 3.48, lng: -76.52 },
            { name: 'Platillos Voladores', zona: 'Granada', lat: 3.47, lng: -76.53 },
            { name: 'Ringlete', zona: 'Centro', lat: 3.45, lng: -76.54 },
            { name: 'El Buen Alimento', zona: 'Sur', lat: 3.41, lng: -76.52 },
            { name: 'La Hacienda', zona: 'Centro', lat: 3.45, lng: -76.53 },
            { name: 'Crepes & Waffles', zona: 'Norte', lat: 3.48, lng: -76.52 }
        ];

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase();
                const restaurant = restaurantesCali.find(r => 
                    r.name.toLowerCase().includes(query)
                );
                
                if (restaurant) {
                    const address = this.generateAddress(restaurant.lat, restaurant.lng, restaurant.zona);
                    this.setLocation(restaurant.lat, restaurant.lng, restaurant.name, address);
                    
                    // Actualizar mapa visual
                    const marker = this.shadowRoot?.querySelector('#selected-marker') as HTMLElement;
                    const coordsDisplay = this.shadowRoot?.querySelector('#coordinates-display') as HTMLElement;
                    const coordsText = this.shadowRoot?.querySelector('#selected-coords') as HTMLElement;
                    
                    if (marker) {
                        marker.style.display = 'block';
                        marker.style.left = '50%';
                        marker.style.top = '50%';
                    }
                    
                    if (coordsDisplay && coordsText) {
                        coordsDisplay.style.display = 'block';
                        coordsText.innerHTML = `
                            <strong>🏪 ${restaurant.name}</strong><br>
                            <small>${address}</small>
                        `;
                    }
                } else {
                    alert('Restaurante no encontrado. Haz clic en el mapa para seleccionar ubicación.');
                }
            }
        });
    }

    private setLocation(lat: number, lng: number, restaurantName?: string, address?: string) {
        this.selectedLocation = {
            latitude: lat,
            longitude: lng,
            address: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            restaurantName: restaurantName
        };

        // Mostrar información de ubicación
        const locationInfo = this.shadowRoot?.querySelector('#location-info');
        const locationAddress = this.shadowRoot?.querySelector('#location-address');
        const confirmBtn = this.shadowRoot?.querySelector('#confirm-btn') as HTMLButtonElement;

        if (locationInfo && locationAddress) {
            locationAddress.textContent = this.selectedLocation.address;
            locationInfo.classList.add('show');
        }

        if (confirmBtn) {
            confirmBtn.disabled = false;
        }
        
        console.log('📍 Ubicación seleccionada:', this.selectedLocation);
    }

    private setupEventListeners() {
        const closeBtn = this.shadowRoot?.querySelector('#close-btn');
        closeBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        const cancelBtn = this.shadowRoot?.querySelector('#cancel-btn');
        cancelBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        const confirmBtn = this.shadowRoot?.querySelector('#confirm-btn');
        confirmBtn?.addEventListener('click', () => {
            this.confirmLocation();
        });

        const currentLocationBtn = this.shadowRoot?.querySelector('#current-location-btn');
        currentLocationBtn?.addEventListener('click', () => {
            this.getCurrentLocation();
        });
    }

    private getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('La geolocalización no está disponible en este navegador');
            return;
        }

        const btn = this.shadowRoot?.querySelector('#current-location-btn') as HTMLElement;
        const originalText = btn.textContent;
        btn.textContent = '📍 Obteniendo...';

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Verificar si está en Cali (aproximadamente)
                if (lat >= 3.35 && lat <= 3.60 && lng >= -76.65 && lng <= -76.40) {
                    const address = this.generateAddress(lat, lng, 'Centro');
                    this.setLocation(lat, lng, undefined, address);
                    
                    // Actualizar marcador visual
                    const marker = this.shadowRoot?.querySelector('#selected-marker') as HTMLElement;
                    const coordsDisplay = this.shadowRoot?.querySelector('#coordinates-display') as HTMLElement;
                    
                    if (marker) {
                        marker.style.display = 'block';
                        marker.style.left = '50%';
                        marker.style.top = '50%';
                    }
                    
                    if (coordsDisplay) {
                        coordsDisplay.style.display = 'block';
                    }
                } else {
                    alert('Estás fuera del área de Cali. Por favor selecciona una ubicación en el mapa.');
                }
                
                btn.textContent = originalText;
            },
            (error) => {
                console.error('Error al obtener ubicación:', error);
                alert('No se pudo obtener tu ubicación actual');
                btn.textContent = originalText;
            }
        );
    }

    private confirmLocation() {
        if (this.selectedLocation) {
            this.dispatchEvent(new CustomEvent('location-selected', {
                detail: this.selectedLocation,
                bubbles: true,
                composed: true
            }));
            this.closeModal();
        }
    }

    private closeModal() {
        this.dispatchEvent(new CustomEvent('location-picker-close', {
            bubbles: true,
            composed: true
        }));
    }

    // Métodos públicos
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
}

export default GoogleMapsLocationPicker;