// Interfaces para TypeScript
interface SavedPublication {
    id: string;
    username: string;
    text: string;
    stars: number;
    hasImage: boolean;
    timestamp: number;
}

interface PublicationElement extends HTMLElement {
    interactionService?: {
        isLiked: (id: string) => boolean;
        isBookmarked: (id: string) => boolean;
    };
    updateInteractionUI?: () => void;
}

// Componente web personalizado para la página de publicaciones guardadas
class Save extends HTMLElement {
    private savedPublications: SavedPublication[] = [];

    constructor() {
        super();
        // Crea shadow DOM para aislar estilos
        this.attachShadow({ mode: 'open' });
    }

    // Lifecycle: cuando el componente se conecta al DOM
    connectedCallback() {
        this.loadSavedPublications();
        this.render();
        this.setupEventListeners();
        
        // Configura responsive design
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
        
        this.setupStorageListener();
    }

    // Lifecycle: limpieza al desconectar
    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('storage', this.handleStorageChange.bind(this));
    }

    // Configura listeners para cambios en publicaciones
    private setupStorageListener() {
        // Escucha cambios en localStorage entre pestañas
        window.addEventListener('storage', this.handleStorageChange.bind(this));
        
        // Escucha cuando se marca/desmarca bookmark
        document.addEventListener('publication-bookmarked', () => {
    setTimeout(() => {
        this.loadSavedPublications();
        this.updateSavedContent();
    }, 100);
});


        // Escucha likes para actualizar UI
        document.addEventListener('publication-liked', () => {
            setTimeout(() => {
                this.updateSavedContent();
            }, 100);
        });
    }

    // Maneja cambios en localStorage
    private handleStorageChange(e: StorageEvent) {
        if (e.key === 'lulada_saved_reviews' || e.key === 'lulada_likes' || e.key === 'lulada_bookmarks') {
            this.loadSavedPublications();
            this.updateSavedContent();
        }
    }

    // Carga publicaciones desde localStorage
    private loadSavedPublications() {
        try {
    const saved = localStorage.getItem('lulada_saved_reviews');
    this.savedPublications = saved ? JSON.parse(saved) as SavedPublication[] : [];
} catch (error) {
    console.warn('Error cargando publicaciones guardadas:', error);
    this.savedPublications = [];
}

    }

    // Renderiza el componente principal
    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* === ESTILOS BASE === */
                :host {
                    display: block;
                    font-family: 'inter', sans-serif;
                }
                
                /* Headers responsive */
                .responsive-header {
                    display: none;
                }
                
                .desktop-logo {
                    display: block;
                }
                
                /* === LAYOUT PRINCIPAL === */
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
                
                /* Área de publicaciones guardadas */
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

                /* Navegación móvil */
                .responsive-bar {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    padding: 10px 0;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }

                /* === COMPONENTES UI === */
                
                /* Header de la sección guardados */
                .saved-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    border-radius: 15px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .saved-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                    position: relative;
                    z-index: 1;
                }

                .saved-header p {
                    margin: 0;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }

                /* Botón limpiar todo */
                .clear-all-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 10px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    position: relative;
                    z-index: 1;
                }

                .clear-all-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                /* Estado vacío cuando no hay publicaciones */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 20px;
                    border: 2px dashed #dee2e6;
                }

                .empty-state .icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    opacity: 0.5;
                    animation: float 3s ease-in-out infinite;
                }

                .empty-state h3 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 22px;
                }

                .empty-state p {
                    margin: 0;
                    font-size: 16px;
                    line-height: 1.5;
                    max-width: 400px;
                    margin: 0 auto;
                }

                /* Grid de publicaciones */
                .publications-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* === RESPONSIVE DESIGN === */
                @media (max-width: 900px) {
                    /* Modo móvil: mostrar elementos móviles */
                    .responsive-header {
                        display: block !important;
                    }
                    
                    .desktop-logo {
                        display: none !important;
                    }
                    
                    .sidebar {
                        display: none;
                    }
                    
                    .suggestions-section {
                        display: none;
                    }
                    
                    .responsive-bar {
                        display: block;
                    }
                    
                    /* Ajustar márgenes para móvil */
                    .reviews-section {
                        margin-left: 1rem;
                        margin-right: 1rem;
                    }

                    .saved-header {
                        margin-bottom: 20px;
                        padding: 15px;
                    }

                    .saved-header h2 {
                        font-size: 20px;
                    }
                }
            </style>
            
            <!-- Header móvil -->
            <div class="responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            
            <!-- Logo desktop -->
            <div class="desktop-logo">
                <lulada-logo></lulada-logo>
            </div>

            <!-- Layout principal -->
            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <div class="medium-content">
                    <div class="content">
                        <div class="reviews-section">
                            <!-- Header con contador y botón limpiar -->
                            <div class="saved-header">
                                <h2>Publicaciones Guardadas</h2>
                                <p>${this.savedPublications.length} publicación${this.savedPublications.length !== 1 ? 'es' : ''} guardada${this.savedPublications.length !== 1 ? 's' : ''}</p>
                                ${this.savedPublications.length > 0 ? `
                                    <button class="clear-all-btn" onclick="this.getRootNode().host.clearAllSaved()">
                                         Limpiar todo
                                    </button>
                                ` : ''}
                            </div>
                            <!-- Contenido dinámico de publicaciones -->
                            <div id="saved-content" class="publications-grid">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Navegación móvil -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;

        this.updateSavedContent();
    }

    // Actualiza el contenido de publicaciones guardadas
    private updateSavedContent() {
        const contentDiv = this.shadowRoot?.querySelector('#saved-content');
        if (!contentDiv) return;

        // Mostrar estado vacío si no hay publicaciones
        if (this.savedPublications.length === 0) {
            contentDiv.innerHTML = `
                <div class="empty-state">
                    <div class="icon"></div>
                    <h3>No tienes publicaciones guardadas</h3>
                    <p>Las publicaciones que marques con el ícono de bookmark aparecerán aquí.<br></p>
                </div>
            `;
            return;
        }

        // Generar HTML para cada publicación guardada
        let publicationsHTML = '';
        this.savedPublications.forEach((pub, index) => {
            publicationsHTML += `
                <lulada-publication 
                    username="${pub.username}" 
                    text="${pub.text}" 
                    stars="${pub.stars}"
                    ${pub.hasImage ? 'has-image="true"' : ''}
                    bookmarked
                    data-save-index="${index}"
                    data-publication-id="${pub.id}"
                ></lulada-publication>
            `;
        });

        contentDiv.innerHTML = publicationsHTML;

        // Sincronizar estados de interacción
        setTimeout(() => {
            this.syncPublicationStates();
        }, 100);
    }

    // Sincroniza estados de likes y bookmarks
    private syncPublicationStates() {
        const publications = this.shadowRoot?.querySelectorAll('lulada-publication');
        if (!publications) return;

        publications.forEach((pub) => {
            const publicationElement = pub as PublicationElement;
            const publicationId = pub.getAttribute('data-publication-id');
            
            if (publicationId && publicationElement.interactionService) {
                publicationElement.updateInteractionUI?.();
            }
        });
    }

    // Función pública para limpiar todas las publicaciones guardadas
    public clearAllSaved() {
        if (confirm('¿Estás seguro de que quieres eliminar todas las publicaciones guardadas?')) {
            // Limpiar localStorage
            localStorage.removeItem('lulada_saved_reviews');
            
            // Actualizar bookmarks para mantener sincronización
            try {
    const bookmarks = JSON.parse(localStorage.getItem('lulada_bookmarks') || '{}') as Record<string, boolean>;
    this.savedPublications.forEach(pub => {
        delete bookmarks[pub.id];
    });
    localStorage.setItem('lulada_bookmarks', JSON.stringify(bookmarks));
} catch (error) {
    console.warn('Error limpiando bookmarks:', error);
}

            
            this.loadSavedPublications();
            this.render();
        }
    }

    // Configura event listeners
    setupEventListeners() {
        if (this.shadowRoot) {
            // Reenvía eventos de navegación
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });

            // Maneja cambios en bookmarks
            this.shadowRoot.addEventListener('publication-bookmarked', (e: Event) => {
                const customEvent = e as CustomEvent<{
                    bookmarked: boolean;
                    username: string;
                }>;
                const { bookmarked } = customEvent.detail;
                
                if (!bookmarked) {
                    setTimeout(() => {
                        this.loadSavedPublications();
                        this.updateSavedContent();
                    }, 100);
                }
            });
        }
    }
    
    // Maneja responsive design
    handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        if (sidebar && suggestions && responsiveBar) {
            if (window.innerWidth < 900) {
                // Modo móvil
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
            } else {
                // Modo desktop
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
            }
        }
    }
}

export default Save;