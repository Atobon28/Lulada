// src/Pages/Save/Save.ts
import { InteractionService } from "../../Services/fluxLikeandSave/InteractionsService";

class Save extends HTMLElement {
    private interactionService: InteractionService;
    private unsubscribe?: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.interactionService = InteractionService.getInstance();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.subscribeToFlux();
        // Configurar el resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Ejecutar una vez al cargar
    }

    disconnectedCallback() {
         if (this.unsubscribe) { 
            this.unsubscribe();
        }
        // Limpiar el event listener
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    private subscribeToFlux(): void {
        this.unsubscribe = this.interactionService.subscribe(() => {
            this.updateBookmarkedContent();
        });
    }

    private updateBookmarkedContent(): void {
        const reviewsSection = this.shadowRoot?.querySelector('.reviews-section'); 
        if (!reviewsSection) return;

        const bookmarkedIds = this.interactionService.getBookmarkedPublications();

        if (bookmarkedIds.length === 0) {
            // Mostrar mensaje cuando no hay bookmarks
            reviewsSection.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <h3> No tienes publicaciones guardadas</h3>
                    <p>Haz clic en  en cualquier publicación para guardarla aquí</p>
                </div>
            `; 
        } else {
            reviewsSection.innerHTML = ` 
                <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                    <p style="margin: 0; color: #333;"> Tienes ${bookmarkedIds.length} publicación${bookmarkedIds.length !== 1 ? 'es' : ''} guardada${bookmarkedIds.length !== 1 ? 's' : ''}</p>
                </div>
                <lulada-publication 
                    bookmarked
                    username="DanaBanana"
                    text="Este @AsianRooftop es terrible! No le quito todas las estrellas porque la mesera era super atenta, el problema es que la cocina, terrible, pedi una margarita y era sin licor me dijeron que venia aparte, como es posible???? De nunca volver."
                    stars="1"
                    has-image="true"
                    restaurant="AsianRooftop"
                    location="norte"
                ></lulada-publication>
                <lulada-publication
                    bookmarked
                    username="FoodLover"
                    text="La pasta en @Frenchrico es increíble! Los mejores sabores italianos que he probado en mucho tiempo."
                    stars="4"
                    restaurant="Frenchrico"
                    location="sur"
                ></lulada-publication>
            `;
        }
    }

    render() {
        this.shadowRoot!.innerHTML = /*html */ `
            <style>
                :host {
                    display: block;
                    font-family: 'inter', sans-serif;
                }
                
                .main-layout {
                    display: flex;
                    margin-top: 10px;
                }
                
                .sidebar {
                    width: 250px;
                }

                .medium-content {
                    flex-grow: 1;
                    display: flex; 
                    flex-direction: column;
                }

                .content {
                    flex-grow: 1;
                    display: flex; 
                    padding: 20px;
                }
                
                .reviews-section {
                    margin-left: 5.9rem;
                    margin-right: 5.9rem;
                    background-color: white;
                    flex-grow: 1; 
                }
                
                .suggestions-section {
                    width: 250px; 
                    padding: 20px 10px;
                }
                
                .no-content {
                    padding: 40px;
                    text-align: center;
                    color: #666;
                    font-style: italic;
                    background-color: #f9f9f9;
                    border-radius: 8px;
                    margin-top: 20px;
                }

                .responsive-bar {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    padding: 10px 0;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                }

                /* Responsive styles */
                @media (max-width: 900px) {
                    .sidebar {
                        display: none;
                    }
                    
                    .suggestions-section {
                        display: none;
                    }
                    
                    .responsive-bar {
                        display: block;
                    }
                    
                    .reviews-section {
                        margin-left: 1rem;
                        margin-right: 1rem;
                    }
                }
            </style>
            
            <!-- Usar lulada-logo como header universal -->
            <lulada-logo></lulada-logo>

            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                <div class="medium-content">
                    <div class="content">
                        <div class="reviews-section">
                            <!-- El contenido se actualiza dinámicamente -->
                        </div>
                    </div>
                </div>
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Barra responsive para móviles -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;
        // Actualizar contenido inicial
        this.updateBookmarkedContent();
    }

    setupEventListeners() {
        // Escuchar eventos de navegación
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                // Reenviar el evento hacia arriba para que lo maneje LoadPage
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });
        }
    }

    handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        if (sidebar && suggestions && responsiveBar) {
            if (window.innerWidth < 900) {
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
            } else {
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
            }
        }
    }
}

export default Save;