import './publications';
import './reviews';
import { FirebasePublicationsService, RealPublication } from '../../../Services/firebase/FirebasePublicationsService';

export class ReviewsContainer extends HTMLElement {
    private firebasePublications: FirebasePublicationsService;
    private unsubscribeFirebase?: () => void;
    private currentPublications: RealPublication[] = [];
    private locationFilter: string | null = null;
    private isLoading = true;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.firebasePublications = FirebasePublicationsService.getInstance();
        this.setupEventListeners();
        this.initializeFirebaseConnection();
    }

    connectedCallback(): void {
        this.render();
    }

    disconnectedCallback(): void {
        if (this.unsubscribeFirebase) {
            this.unsubscribeFirebase();
        }
    }

    private async initializeFirebaseConnection(): Promise<void> {
        try {
            // Poblar datos iniciales si no existen
            await this.firebasePublications.seedInitialData();
            
            // Suscribirse a cambios en tiempo real
            this.unsubscribeFirebase = this.firebasePublications.subscribe(
                this.handlePublicationsUpdate.bind(this)
            );
            
            console.log('📡 Conectado a Firebase Publications');
        } catch (error) {
            console.error('Error conectando con Firebase:', error);
            this.isLoading = false;
            this.render();
        }
    }

    private handlePublicationsUpdate(publications: RealPublication[]): void {
        this.currentPublications = publications;
        this.isLoading = false;
        console.log(`📱 Recibidas ${publications.length} publicaciones reales`);
        this.render();
    }

    private setupEventListeners(): void {
        // Escuchar cambios en filtro de ubicación
        document.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });

        document.addEventListener('location-changed', (e: Event) => {
            const event = e as CustomEvent;
            this.updateLocationFilter(event.detail);
        });

        // Escuchar eventos de nuevas publicaciones
        document.addEventListener('nueva-publicacion-firebase', () => {
            // Las publicaciones se actualizarán automáticamente por el listener de Firebase
        });
    }

    private updateLocationFilter(location: string): void {
        this.locationFilter = location === 'cali' ? null : location;
        this.render();
    }

    private getFilteredPublications(): RealPublication[] {
        if (!this.locationFilter || this.locationFilter === 'cali') {
            return this.currentPublications;
        }
        
        return this.currentPublications.filter(pub => pub.location === this.locationFilter);
    }

    private getLocationStats(): { byZone: { [key: string]: number }; total: number } {
        const stats = this.firebasePublications.getStats();
        return {
            byZone: stats.byLocation,
            total: stats.total
        };
    }

    private render(): void {
        if (!this.shadowRoot) return;

        if (this.isLoading) {
            this.renderLoading();
            return;
        }

        const filteredPublications = this.getFilteredPublications();
        const stats = this.getLocationStats();
        
        let publicationsHTML = '';
        
        if (filteredPublications.length === 0) {
            this.renderEmptyState();
            return;
        }
        
        filteredPublications.forEach(publication => {
            // Determinar si es una publicación reciente (últimos 5 minutos)
            const isNew = (Date.now() - publication.timestamp) < 300000;
            
            publicationsHTML += `
                <lulada-publication 
                    username="${publication.username}" 
                    user-display-name="${publication.userDisplayName}"
                    user-photo="${publication.userPhoto}"
                    text="${this.escapeHtml(publication.text)}" 
                    stars="${publication.stars}"
                    restaurant="${publication.restaurant}"
                    location="${publication.location}"
                    likes="${publication.likes}"
                    bookmarks="${publication.bookmarks}"
                    ${publication.hasImage && publication.imageUrl ? `image-url="${publication.imageUrl}"` : ''}
                    ${publication.hasImage ? 'has-image="true"' : ''}
                    ${publication.verified ? 'verified="true"' : ''}
                    ${isNew ? 'is-new="true"' : ''}
                    data-publication-id="${publication.id}"
                    data-timestamp="${publication.timestamp}"
                ></lulada-publication>
            `;
        });

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 650px;
                    margin: 0 auto;
                    padding: 16px;
                    background-color: rgb(255, 255, 255);
                }

                .real-data-indicator {
                    background: linear-gradient(135deg, #22c55e, #16a34a);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 16px;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);
                }

                .live-dot {
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }

                lulada-publication {
                    display: block;
                    width: 100%;
                    margin-bottom: 20px;
                }

                .filter-info {
                    text-align: center;
                    padding: 12px;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, rgba(170, 171, 84, 0.1), rgba(170, 171, 84, 0.05));
                    border: 1px solid rgba(170, 171, 84, 0.2);
                    border-radius: 10px;
                    color: #666;
                    font-size: 14px;
                    position: relative;
                }

                .filter-info::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 4px;
                    height: 100%;
                    background: #AAAB54;
                    border-radius: 10px 0 0 10px;
                }

                .filter-title {
                    font-weight: bold;
                    color: #AAAB54;
                    margin-bottom: 4px;
                }

                .filter-stats {
                    font-size: 12px;
                    color: #888;
                    margin-top: 6px;
                }

                .stats-info {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    text-align: center;
                    font-size: 13px;
                    color: #666;
                }

                .loading {
                    text-align: center;
                    padding: 40px 24px;
                    color: #666;
                    font-style: italic;
                }

                .loading-spinner {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #AAAB54;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    :host {
                        padding: 12px;
                    }
                    
                    .filter-info {
                        font-size: 13px;
                        padding: 10px;
                    }
                    
                    .stats-info {
                        font-size: 12px;
                        padding: 10px;
                    }

                    .real-data-indicator {
                        font-size: 11px;
                        padding: 6px 12px;
                    }
                }
            </style>
            
            <!-- Indicador de datos reales -->
            <div class="real-data-indicator">
                <div class="live-dot"></div>
                Publicaciones reales de usuarios • En vivo
            </div>

            ${this.locationFilter ? `
                <div class="filter-info">
                    <div class="filter-title">📍 Filtro activo</div>
                    <div>Mostrando reseñas de: <strong>${this.locationFilter.charAt(0).toUpperCase() + this.locationFilter.slice(1)}</strong></div>
                    <div class="filter-stats">
                        ${filteredPublications.length} de ${stats.total} publicaciones
                    </div>
                </div>
            ` : ''}
            
            <div class="stats-info">
                📊 Total: ${stats.total} publicaciones reales de usuarios registrados
            </div>
            
            ${publicationsHTML}
        `;
        
        // Agregar efectos especiales a publicaciones nuevas
        setTimeout(() => {
            this.addNewPublicationEffects();
        }, 100);
    }

    private renderLoading(): void {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                .loading {
                    text-align: center;
                    padding: 60px 24px;
                    color: #666;
                    font-family: 'Inter', sans-serif;
                }
                .loading-spinner {
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #AAAB54;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            <div class="loading">
                <div class="loading-spinner"></div>
                <h3>Conectando con Firebase...</h3>
                <p>Cargando publicaciones reales de usuarios</p>
            </div>
        `;
    }

    private renderEmptyState(): void {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = `
            <style>
                .empty-state {
                    text-align: center;
                    padding: 60px 24px;
                    color: #666;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border: 2px dashed #ddd;
                }
                .empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.6;
                }
            </style>
            <div class="empty-state">
                <div class="empty-icon">📱</div>
                <h3>No hay publicaciones aún</h3>
                <p>Sé el primero en compartir una reseña en ${this.locationFilter || 'Cali'}!</p>
            </div>
        `;
    }

    private addNewPublicationEffects(): void {
        if (!this.shadowRoot) return;

        const newPublications = this.shadowRoot.querySelectorAll('[is-new="true"]');
        newPublications.forEach(pub => {
            pub.classList.add('new-publication-glow');
        });
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Métodos públicos
    public filterByLocation(location: string): void {
        this.updateLocationFilter(location);
    }

    public async searchByRestaurant(query: string): Promise<void> {
        try {
            const results = await this.firebasePublications.searchPublicationsByRestaurant(query);
            this.currentPublications = results;
            this.render();
        } catch (error) {
            console.error('Error buscando publicaciones:', error);
        }
    }

    public getStats(): ReturnType<FirebasePublicationsService['getStats']> {
        return this.firebasePublications.getStats();
    }

    public debugInfo(): void {
        console.log('📊 ReviewsContainer Firebase Debug:');
        console.log('- Publicaciones cargadas:', this.currentPublications.length);
        console.log('- Filtro actual:', this.locationFilter);
        console.log('- Conectado a Firebase:', !!this.unsubscribeFirebase);
        console.log('- Estadísticas:', this.getStats());
    }
}

export default ReviewsContainer;