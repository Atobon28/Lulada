// src/Pages/Save/Save.ts

// Define interfaces for type safety
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

class Save extends HTMLElement {
    private savedPublications: SavedPublication[] = [];

    constructor() {
        super();
        // crea un Shadow DOM en modo 'open'
        this.attachShadow({ mode: 'open' });
    }
//conecta al dom el elemnto
    connectedCallback() {
        this.loadSavedPublications();//la idea es que carge las publicaciones desde el localstorage
        this.render();//genera el Html del componente
        this.setupEventListeners();//configura los eventos internos
        window.addEventListener('resize', this.handleResize.bind(this));//decta cambios del tamaño de la venta 
        this.handleResize();//aplica el responsive
        
        // Escuchar cuando se guarden nuevas publicaciones
        this.setupStorageListener();
    }
//ejecuta cuando un evento de desconecta del dom
//limpia los event listener para evitar el problemas en la memoria
    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('storage', this.handleStorageChange.bind(this));
    }
//configura event listeners para cambios en local storage
//permitiendo que el componente se actualice cuando se guarde o se quite el componente de otras pestañas
    private setupStorageListener() {
        // Escuchar cambios en localStorage para publicaciones guardadas
        window.addEventListener('storage', this.handleStorageChange.bind(this));
        
        // Escuchar eventos de bookmark desde publicaciones esto es un evento personalizado
        document.addEventListener('publication-bookmarked', (e: Event) => {
            const customEvent = e as CustomEvent<{
                username: string;
                bookmarked: boolean;
            }>;
            console.log(' Bookmark event detectado:', customEvent.detail);
            
            setTimeout(() => {
                this.loadSavedPublications();
                this.updateSavedContent();
            }, 100);
        });

        // Escuchar eventos de likes para actualizar contadores
        document.addEventListener('publication-liked', () => {
            // Actualizar las publicaciones mostradas para reflejar los likes
            setTimeout(() => {
                this.updateSavedContent();
            }, 100);//mantemiendo una sincronizacion de los likes con los guardados
        });
    }
//cambios especificos del local storage
    private handleStorageChange(e: StorageEvent) {
        //se establecen unas llaves que son las claves donde se guardan like,bookmark y save reviews
        if (e.key === 'lulada_saved_reviews' || e.key === 'lulada_likes' || e.key === 'lulada_bookmarks') {
            this.loadSavedPublications();
            this.updateSavedContent();
        }
    }
//lee las publicaciones guardad del localstorage
    private loadSavedPublications() {
        try {
            const saved = localStorage.getItem('lulada_saved_reviews');
            this.savedPublications = saved ? JSON.parse(saved) as SavedPublication[] : [];
            console.log('Publicaciones guardadas carga:', this.savedPublications.length);
        } catch (error) {
            console.error('Error loading saved publications:', error);
            this.savedPublications = [];
        }
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    font-family: 'inter', sans-serif;
                }
                
                /* Header responsive - VISIBLE SOLO EN MOBILE */
                .responsive-header {
                    display: none;
                }
                
                /* Logo desktop - VISIBLE SOLO EN DESKTOP */
                .desktop-logo {
                    display: block;
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

                .publications-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* Responsive styles */
                @media (max-width: 900px) {
                    /* MOSTRAR header responsive en móvil */
                    .responsive-header {
                        display: block !important;
                    }
                    
                    /* OCULTAR logo de desktop en móvil */
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
            
            <!-- Header responsive (SOLO móvil) -->
            <div class="responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            
            <!-- Logo desktop (SOLO desktop) -->
            <div class="desktop-logo">
                <lulada-logo></lulada-logo>
            </div>

            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                <div class="medium-content">
                    <div class="content">
                        <div class="reviews-section">
                            <div class="saved-header">
                                <h2>Publicaciones Guardadas</h2>
                                <p>${this.savedPublications.length} publicación${this.savedPublications.length !== 1 ? 'es' : ''} guardada${this.savedPublications.length !== 1 ? 's' : ''}</p>
                                ${this.savedPublications.length > 0 ? `
                                    <button class="clear-all-btn" onclick="this.getRootNode().host.clearAllSaved()">
                                         Limpiar todo
                                    </button>
                                ` : ''}
                            </div>
                            <div id="saved-content" class="publications-grid">
                                <!-- Aquí se cargarán las publicaciones -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;

        // Cargar contenido guardado
        this.updateSavedContent();
    }
//Si no hay publicaciones guardadas, muestra un estado vacío amigable.
    private updateSavedContent() {
        const contentDiv = this.shadowRoot?.querySelector('#saved-content');
        if (!contentDiv) return;

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
//itera sobre cada publicacion
        let publicationsHTML = '';
        this.savedPublications.forEach((pub, index) => {
            // IMPORTANTE: Agregar un ID único para cada publicación en Save
            //crea elementos de publicationcon los datos
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
            `;//añada atributos que identifiacan a la publicacion
        });
        //nserta el HTML generado y sincroniza los estados después de una brave pausa

        contentDiv.innerHTML = publicationsHTML;
        console.log('Contenido guardado actualizado con persistencia completa');

        // CRUCIAL: Después de cargar las publicaciones, actualizar sus estados
        setTimeout(() => {
            this.syncPublicationStates();
        }, 100);
    }

    // Sincronizar los estados de las publicaciones con los datos guardados
    private syncPublicationStates() {
        const publications = this.shadowRoot?.querySelectorAll('lulada-publication');
        if (!publications) return;

        publications.forEach((pub) => {
            const publicationElement = pub as PublicationElement;
            const publicationId = pub.getAttribute('data-publication-id');
            
            if (publicationId && publicationElement.interactionService) {
                // Forzar actualización del de la interfaz
                publicationElement.updateInteractionUI?.();
            }
        });//Asegura que los botones de like/bookmark reflejen el estado correcto
    }

    //Método para limpiar todas las publicaciones guardadas
    public clearAllSaved() {
        //Pide confirmación al usuario
        if (confirm('¿Estás seguro de que quieres eliminar todas las publicaciones guardadas?')) {
            // Limpiar localStorage
            localStorage.removeItem('lulada_saved_reviews');
            
            // También actualizar bookmarks para que reflejen el cambio
            try {
                const bookmarks = JSON.parse(localStorage.getItem('lulada_bookmarks') || '{}') as Record<string, boolean>;
                this.savedPublications.forEach(pub => {
                    delete bookmarks[pub.id];
                });
                localStorage.setItem('lulada_bookmarks', JSON.stringify(bookmarks));
            } catch (error) {
                console.error('Error updating bookmarks:', error);
            }
            
            // Recargar o renderiza
            this.loadSavedPublications();
            this.render();
            
            console.log('✨ Todas las publicaciones guardadas eliminadas');
        }
    }//este es un boton a ventana que te pide aseguarte de que lo quieres borrar

    setupEventListeners() {
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });
//Propaga eventos de navegación desde el Shadow DOM al documento principal.
            //Escuchar eventos de bookmark dentro de la página Save
            //Cuando una publicación se desmarca desde la página de guardados, actualiza la lista automáticamente.
            this.shadowRoot.addEventListener('publication-bookmarked', (e: Event) => {
                const customEvent = e as CustomEvent<{
                    bookmarked: boolean;
                    username: string;
                }>;
                const { bookmarked } = customEvent.detail;
                
                if (!bookmarked) {
                    // Si se quita el bookmark desde Save, remover de la lista
                    console.log('Publicación removida desde Save');
                    setTimeout(() => {
                        this.loadSavedPublications();
                        this.updateSavedContent();
                    }, 100);
                }
            });
        }
    }
    
//obtener refencias de elemtos layot
    handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;
//Si la pantalla es menor a 900px, oculta sidebar y sugerencias, muestra barra móvil
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