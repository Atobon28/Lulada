export class Publication extends HTMLElement {
    liked: boolean = false;
    bookmarked: boolean = false;
    specificLocation: any = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const username = this.getAttribute('username') || '';
        const text = this.getAttribute('text') || '';
        const hasImage = this.hasAttribute('has-image');
        const stars = parseInt(this.getAttribute('stars') || '0');
        
        // Obtener datos de ubicación específica si existen
        const locationData = this.getAttribute('location-data');
        if (locationData) {
            try {
                this.specificLocation = JSON.parse(locationData);
            } catch (e) {
                console.error('Error parsing location data:', e);
            }
        }

        this.bookmarked = this.hasAttribute('bookmarked');

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        background-color: white;
                        border-radius: 20px;
                        margin-bottom: 20px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        overflow: hidden;
                        width: 100%;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }

                    :host(:hover) {
                        transform: translateY(-2px);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.15);
                    }

                    .publication-container {
                        padding: 20px;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 12px;
                    }
                    .profile-pic {
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;
                        margin-right: 12px;
                        object-fit: cover;
                    }
                    .username {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                    }
                    .publication-text {
                        margin-bottom: 16px;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                    .publication-image {
                        width: 100%;
                        border-radius: 8px;
                        margin-bottom: 16px;
                        max-height: 400px;
                        object-fit: cover;
                    }

                    /* Información de ubicación específica - Actualizada con Google Maps */
                    .location-info {
                        display: none;
                        background: linear-gradient(135deg, #f0fdf4, #dcfce7);
                        border: 1px solid #16a34a;
                        border-radius: 12px;
                        padding: 16px;
                        margin-bottom: 16px;
                        font-size: 14px;
                        color: #166534;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }

                    .location-info::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 4px;
                        height: 100%;
                        background: #16a34a;
                        border-radius: 12px 0 0 12px;
                    }

                    .location-info:hover {
                        background: linear-gradient(135deg, #dcfce7, #bbf7d0);
                        border-color: #15803d;
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(22, 163, 74, 0.15);
                    }

                    .location-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        font-weight: bold;
                        color: #15803d;
                        font-size: 15px;
                    }

                    .location-details {
                        color: #166534;
                        line-height: 1.4;
                    }

                    .restaurant-name {
                        font-weight: bold;
                        color: #166534;
                        margin-bottom: 4px;
                        font-size: 15px;
                    }

                    .location-address {
                        font-size: 13px;
                        color: #16a34a;
                        opacity: 0.8;
                    }

                    .view-map-hint {
                        font-size: 12px;
                        color: #15803d;
                        margin-top: 8px;
                        font-style: italic;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }

                    .footer {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .stars {
                        color: #FFD700;
                        font-size: 24px;
                        letter-spacing: 2px;
                    }
                    .actions {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }
                    .action-icon {
                        cursor: pointer;
                        transition: all 0.2s ease;
                        color: #666;
                        width: 24px;
                        height: 24px;
                    }
                    .action-icon:hover {
                        transform: scale(1.1);
                    }
                    .location-icon:hover {
                        color: #16a34a;
                    }
                    .location-icon.active {
                        color: #16a34a;
                        fill: #16a34a;
                    }
                    .like-icon {
                        color: ${this.liked ? 'red' : '#666'};
                        fill: ${this.liked ? 'red' : 'none'};
                    }
                    .like-icon:hover {
                        color: red;
                    }
                    .bookmark-icon {
                        color: ${this.bookmarked ? '#FFD700' : '#666'};
                        fill: ${this.bookmarked ? '#FFD700' : 'none'};
                    }
                    .bookmark-icon:hover {
                        color: #FFD700;
                    }

                    @media (max-width: 768px) {
                        .publication-container {
                            padding: 15px;
                        }
                        
                        .header {
                            margin-bottom: 10px;
                        }
                        
                        .profile-pic {
                            width: 40px;
                            height: 40px;
                            margin-right: 10px;
                        }
                        
                        .username {
                            font-size: 15px;
                        }
                        
                        .publication-text {
                            font-size: 15px;
                            margin-bottom: 12px;
                        }
                        
                        .stars {
                            font-size: 20px;
                            letter-spacing: 1px;
                        }
                        
                        .action-icon {
                            width: 22px;
                            height: 22px;
                        }
                        
                        .actions {
                            gap: 12px;
                        }

                        .location-info {
                            padding: 12px;
                            font-size: 13px;
                        }

                        .location-header {
                            margin-bottom: 6px;
                        }

                        .view-map-hint {
                            font-size: 11px;
                            margin-top: 6px;
                        }
                    }
                </style>
                
                <div class="publication-container">
                    <div class="header">
                        <img 
                            src="https://randomuser.me/api/portraits/thumb/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg" 
                            alt="${username}" 
                            class="profile-pic"
                        >
                        <div class="username">@${username}</div>
                    </div>
                    
                    <div class="publication-text">
                        ${text}
                    </div>

                    <!-- Información de ubicación específica con Google Maps -->
                    ${this.specificLocation ? `
                        <div id="location-info" class="location-info">
                            <div class="location-header">
                                🗺️ Ubicación del restaurante
                            </div>
                            <div class="location-details">
                                ${this.specificLocation.restaurantName ? `
                                    <div class="restaurant-name">🏪 ${this.specificLocation.restaurantName}</div>
                                ` : ''}
                                <div class="location-address">📍 ${this.specificLocation.address}</div>
                            </div>
                            <div class="view-map-hint">
                                🎯 Toca para ver en Google Maps
                            </div>
                        </div>
                    ` : ''}
                    
                    ${hasImage ? `
                        <img 
                            src="https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}" 
                            alt="Publication image" 
                            class="publication-image"
                        >
                    ` : ''}
                    
                    <div class="footer">
                        <div class="actions">
                            ${this.specificLocation ? `
                                <svg class="action-icon location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                            ` : ''}
                            <svg class="action-icon like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <svg class="action-icon bookmark-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </div>
                        <div class="stars">
                            ${'★'.repeat(stars)}${'☆'.repeat(5-stars)}
                        </div>
                    </div>
                    
                    <!-- Contenedor para el visor de ubicación con Google Maps -->
                    <div id="location-viewer-container" style="display: none;">
                        <google-maps-location-viewer></google-maps-location-viewer>
                    </div>
                </div>
            `;

            const likeIcon = this.shadowRoot.querySelector('.like-icon') as SVGElement;
            const bookmarkIcon = this.shadowRoot.querySelector('.bookmark-icon') as SVGElement;
            const locationIcon = this.shadowRoot.querySelector('.location-icon') as SVGElement;
            const locationInfo = this.shadowRoot.querySelector('#location-info') as HTMLElement;
            
            if (likeIcon) {
                likeIcon.addEventListener('click', () => {
                    this.liked = !this.liked;
                    likeIcon.style.color = this.liked ? 'red' : '#666';
                    likeIcon.style.fill = this.liked ? 'red' : 'none';
                    
                    this.dispatchEvent(new CustomEvent('publication-liked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            username: username,
                            liked: this.liked
                        }
                    }));
                });
            }

            if (bookmarkIcon) {
                bookmarkIcon.addEventListener('click', () => {
                    this.bookmarked = !this.bookmarked;
                    bookmarkIcon.style.color = this.bookmarked ? '#FFD700' : '#666';
                    bookmarkIcon.style.fill = this.bookmarked ? '#FFD700' : 'none';
                    
                    this.dispatchEvent(new CustomEvent('publication-bookmarked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            username: username,
                            bookmarked: this.bookmarked
                        }
                    }));
                });
            }

            // Evento para el icono de ubicación (solo si hay ubicación específica)
            if (locationIcon && this.specificLocation) {
                locationIcon.addEventListener('click', () => {
                    this.showLocationViewer();
                });
            }

            // También permitir clic en la información de ubicación
            if (locationInfo && this.specificLocation) {
                locationInfo.addEventListener('click', () => {
                    this.showLocationViewer();
                });
            }

            // Eventos del visor de ubicación con Google Maps
            this.shadowRoot.addEventListener('location-viewer-close', () => {
                this.hideLocationViewer();
            });
        }
    }

    showLocationViewer() {
        if (!this.specificLocation) return;

        const container = this.shadowRoot?.querySelector('#location-viewer-container') as HTMLElement;
        if (container) {
            container.style.display = 'block';
            const viewer = container.querySelector('google-maps-location-viewer') as any;
            if (viewer) {
                // Establecer atributos para el visor de Google Maps
                viewer.setAttribute('latitude', this.specificLocation.latitude.toString());
                viewer.setAttribute('longitude', this.specificLocation.longitude.toString());
                viewer.setAttribute('address', this.specificLocation.address || '');
                if (this.specificLocation.restaurantName) {
                    viewer.setAttribute('restaurant-name', this.specificLocation.restaurantName);
                }
                
                if (typeof viewer.openModal === 'function') {
                    viewer.openModal();
                }
            }
        }
    }

    hideLocationViewer() {
        const container = this.shadowRoot?.querySelector('#location-viewer-container') as HTMLElement;
        if (container) {
            container.style.display = 'none';
        }
    }

    // Métodos públicos para acceso externo
    public getSpecificLocation() {
        return this.specificLocation;
    }

    public hasSpecificLocation(): boolean {
        return !!this.specificLocation;
    }

    public toggleLike() {
        this.liked = !this.liked;
        const likeIcon = this.shadowRoot?.querySelector('.like-icon') as SVGElement;
        if (likeIcon) {
            likeIcon.style.color = this.liked ? 'red' : '#666';
            likeIcon.style.fill = this.liked ? 'red' : 'none';
            
            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('publication-liked', {
                bubbles: true,
                composed: true,
                detail: {
                    username: this.getAttribute('username'),
                    liked: this.liked
                }
            }));
        }
    }

    public toggleBookmark() {
        this.bookmarked = !this.bookmarked;
        const bookmarkIcon = this.shadowRoot?.querySelector('.bookmark-icon') as SVGElement;
        if (bookmarkIcon) {
            bookmarkIcon.style.color = this.bookmarked ? '#FFD700' : '#666';
            bookmarkIcon.style.fill = this.bookmarked ? '#FFD700' : 'none';
            
            // Disparar evento personalizado
            this.dispatchEvent(new CustomEvent('publication-bookmarked', {
                bubbles: true,
                composed: true,
                detail: {
                    username: this.getAttribute('username'),
                    bookmarked: this.bookmarked
                }
            }));
        }
    }
}

export default Publication;