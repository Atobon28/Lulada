// src/Pages/Save/Save.ts

// Definimos tipos de datos para que TypeScript sepa qué esperar
interface SavedPublication {
    id: string;        // Identificador único de la publicación
    username: string;  // Nombre del usuario que hizo la reseña
    text: string;      // Texto de la reseña
    stars: number;     // Calificación en estrellas (1-5)
    hasImage: boolean; // Si la publicación tiene imagen o no
    timestamp: number; // Cuándo se guardó la publicación
}

// Tipo para los elementos de publicación en el DOM
interface PublicationElement extends HTMLElement {
    interactionService?: {
        isLiked: (id: string) => boolean;      // Función para saber si algo tiene like
        isBookmarked: (id: string) => boolean; // Función para saber si algo está guardado
    };
    updateInteractionUI?: () => void; // Función para actualizar la interfaz
}

class Save extends HTMLElement {
    // Variable que guarda todas las publicaciones que el usuario ha marcado como favoritas
    private savedPublications: SavedPublication[] = [];

    constructor() {
        super();
        // Crea un "contenedor privado" para el HTML de este componente
        // Esto evita que los estilos se mezclen con el resto de la página
        this.attachShadow({ mode: 'open' });
    }

    // Se ejecuta cuando el componente se añade a la página
    connectedCallback() {
        this.loadSavedPublications(); // Carga las publicaciones guardadas del navegador
        this.render();                // Dibuja el componente en la pantalla
        this.setupEventListeners();   // Configura los eventos (clicks, etc.)
        
        // Escucha cuando cambia el tamaño de la ventana para adaptar el diseño
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Aplica el diseño responsivo inmediatamente
        
        // Configura la escucha para cambios en las publicaciones guardadas
        this.setupStorageListener();
    }

    // Se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        // Limpia los "escuchadores" para evitar problemas de memoria
        window.removeEventListener('resize', this.handleResize.bind(this));
        window.removeEventListener('storage', this.handleStorageChange.bind(this));
    }

    // Configura la escucha para cambios en el almacenamiento del navegador
    private setupStorageListener() {
        // Si el usuario abre otra pestaña y guarda/quita algo, esta página se actualiza automáticamente
        window.addEventListener('storage', this.handleStorageChange.bind(this));
        
        // Escucha cuando alguien marca o desmarca una publicación como favorita
        document.addEventListener('publication-bookmarked', (e: Event) => {
            const customEvent = e as CustomEvent<{
                username: string;
                bookmarked: boolean;
            }>;
            console.log(' Alguien marcó/desmarcó una publicación:', customEvent.detail);
            
            // Espera un poquito y luego actualiza la lista
            setTimeout(() => {
                this.loadSavedPublications();
                this.updateSavedContent();
            }, 100);
        });

        // Escucha cuando alguien da like a una publicación
        document.addEventListener('publication-liked', () => {
            // Actualiza la visualización para mostrar los likes actualizados
            setTimeout(() => {
                this.updateSavedContent();
            }, 100);
        });
    }

    // Se ejecuta cuando hay cambios en el almacenamiento del navegador
    private handleStorageChange(e: StorageEvent) {
        // Solo nos interesan los cambios en publicaciones guardadas, likes y bookmarks
        if (e.key === 'lulada_saved_reviews' || e.key === 'lulada_likes' || e.key === 'lulada_bookmarks') {
            this.loadSavedPublications(); // Recarga las publicaciones
            this.updateSavedContent();    // Actualiza lo que se ve en pantalla
        }
    }

    // Lee las publicaciones guardadas del almacenamiento del navegador
    private loadSavedPublications() {
        try {
            // Intenta leer los datos guardados
            const saved = localStorage.getItem('lulada_saved_reviews');
            // Si hay datos, los convierte de texto a objetos JavaScript
            this.savedPublications = saved ? JSON.parse(saved) as SavedPublication[] : [];
            console.log('Publicaciones guardadas cargadas:', this.savedPublications.length);
        } catch (error) {
            // Si algo sale mal, muestra el error y usa una lista vacía
            console.error('Error loading saved publications:', error);
            this.savedPublications = [];
        }
    }

    // Dibuja todo el HTML del componente
    render() {
        if (!this.shadowRoot) return; // Si no hay contenedor, no puede dibujar nada

        // Aquí va todo el HTML y CSS del componente
        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* Estilos CSS que definen cómo se ve el componente */
                :host {
                    display: block;
                    font-family: 'inter', sans-serif;
                }
                
                /* Header que solo se ve en dispositivos móviles */
                .responsive-header {
                    display: none;
                }
                
                /* Logo que solo se ve en computadoras */
                .desktop-logo {
                    display: block;
                }
                
                /* Contenedor principal que organiza la página en columnas */
                .main-layout {
                    display: flex;
                    margin-top: 10px;
                }
                
                /* Barra lateral izquierda */
                .sidebar {
                    width: 250px;
                }

                /* Contenido del medio que se expande */
                .medium-content {
                    flex-grow: 1;
                    display: flex; 
                    flex-direction: column;
                }

                /* Área de contenido principal */
                .content {
                    flex-grow: 1;
                    display: flex; 
                    padding: 20px;
                }
                
                /* Sección donde aparecen las publicaciones guardadas */
                .reviews-section {
                    margin-left: 5.9rem;
                    margin-right: 5.9rem;
                    background-color: white;
                    flex-grow: 1; 
                }
                
                /* Sección de sugerencias a la derecha */
                .suggestions-section {
                    width: 250px; 
                    padding: 20px 10px;
                }

                /* Barra de navegación inferior para móviles (inicialmente oculta) */
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

                /* Encabezado bonito para la sección de guardados */
                .saved-header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: linear-gradient(135deg, #AAAB54, #999A4A); /* Degradado verde */
                    border-radius: 15px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                /* Título del encabezado */
                .saved-header h2 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                    position: relative;
                    z-index: 1;
                }

                /* Texto descriptivo del encabezado */
                .saved-header p {
                    margin: 0;
                    opacity: 0.9;
                    position: relative;
                    z-index: 1;
                }

                /* Botón para limpiar todas las publicaciones guardadas */
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

                /* Efecto cuando pasas el mouse sobre el botón */
                .clear-all-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                /* Diseño para cuando no hay publicaciones guardadas */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 20px;
                    border: 2px dashed #dee2e6;
                }

                /* Icono grande para el estado vacío */
                .empty-state .icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    opacity: 0.5;
                    animation: float 3s ease-in-out infinite;
                }

                /* Título del estado vacío */
                .empty-state h3 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 22px;
                }

                /* Texto explicativo del estado vacío */
                .empty-state p {
                    margin: 0;
                    font-size: 16px;
                    line-height: 1.5;
                    max-width: 400px;
                    margin: 0 auto;
                }

                /* Contenedor para organizar las publicaciones en columna */
                .publications-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* Estilos para pantallas pequeñas (móviles) */
                @media (max-width: 900px) {
                    /* Muestra el header para móviles */
                    .responsive-header {
                        display: block !important;
                    }
                    
                    /* Oculta el logo de escritorio */
                    .desktop-logo {
                        display: none !important;
                    }
                    
                    /* Oculta la barra lateral */
                    .sidebar {
                        display: none;
                    }
                    
                    /* Oculta las sugerencias */
                    .suggestions-section {
                        display: none;
                    }
                    
                    /* Muestra la barra de navegación inferior */
                    .responsive-bar {
                        display: block;
                    }
                    
                    /* Ajusta los márgenes para móviles */
                    .reviews-section {
                        margin-left: 1rem;
                        margin-right: 1rem;
                    }

                    /* Hace el encabezado más pequeño en móviles */
                    .saved-header {
                        margin-bottom: 20px;
                        padding: 15px;
                    }

                    .saved-header h2 {
                        font-size: 20px;
                    }
                }
            </style>
            
            <!-- Header que solo aparece en móviles -->
            <div class="responsive-header">
                <lulada-responsive-header></lulada-responsive-header>
            </div>
            
            <!-- Logo que solo aparece en computadoras -->
            <div class="desktop-logo">
                <lulada-logo></lulada-logo>
            </div>

            <!-- Estructura principal de la página -->
            <div class="main-layout">
                <!-- Barra lateral izquierda (solo en computadoras) -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido principal -->
                <div class="medium-content">
                    <div class="content">
                        <div class="reviews-section">
                            <!-- Encabezado con información de las publicaciones guardadas -->
                            <div class="saved-header">
                                <h2>Publicaciones Guardadas</h2>
                                <p>${this.savedPublications.length} publicación${this.savedPublications.length !== 1 ? 'es' : ''} guardada${this.savedPublications.length !== 1 ? 's' : ''}</p>
                                ${this.savedPublications.length > 0 ? `
                                    <button class="clear-all-btn" onclick="this.getRootNode().host.clearAllSaved()">
                                         Limpiar todo
                                    </button>
                                ` : ''}
                            </div>
                            <!-- Aquí se mostrarán las publicaciones guardadas -->
                            <div id="saved-content" class="publications-grid">
                                <!-- Las publicaciones se cargan dinámicamente aquí -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sección de sugerencias (solo en computadoras) -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Barra de navegación inferior (solo en móviles) -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;

        // Después de crear el HTML, carga las publicaciones guardadas
        this.updateSavedContent();
    }

    // Actualiza el contenido que se muestra al usuario
    private updateSavedContent() {
        // Busca el lugar donde van las publicaciones
        const contentDiv = this.shadowRoot?.querySelector('#saved-content');
        if (!contentDiv) return; // Si no lo encuentra, no puede hacer nada

        // Si no hay publicaciones guardadas, muestra un mensaje amigable
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

        // Si hay publicaciones, crea el HTML para cada una
        let publicationsHTML = '';
        this.savedPublications.forEach((pub, index) => {
            // Crea un elemento de publicación para cada publicación guardada
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

        // Coloca todas las publicaciones en la página
        contentDiv.innerHTML = publicationsHTML;
        console.log('Contenido guardado actualizado con persistencia completa');

        // Espera un poquito y luego sincroniza los estados de like/bookmark
        setTimeout(() => {
            this.syncPublicationStates();
        }, 100);
    }

    // Se asegura de que los botones de like y bookmark muestren el estado correcto
    private syncPublicationStates() {
        // Busca todas las publicaciones en la página
        const publications = this.shadowRoot?.querySelectorAll('lulada-publication');
        if (!publications) return;

        // Para cada publicación, actualiza su interfaz
        publications.forEach((pub) => {
            const publicationElement = pub as PublicationElement;
            const publicationId = pub.getAttribute('data-publication-id');
            
            // Si la publicación tiene un sistema de interacciones, lo actualiza
            if (publicationId && publicationElement.interactionService) {
                publicationElement.updateInteractionUI?.();
            }
        });
    }

    // Función que se ejecuta cuando el usuario quiere borrar todas las publicaciones guardadas
    public clearAllSaved() {
        // Pregunta al usuario si está seguro
        if (confirm('¿Estás seguro de que quieres eliminar todas las publicaciones guardadas?')) {
            // Borra las publicaciones del almacenamiento del navegador
            localStorage.removeItem('lulada_saved_reviews');
            
            // También actualiza los bookmarks para que todo esté sincronizado
            try {
                const bookmarks = JSON.parse(localStorage.getItem('lulada_bookmarks') || '{}') as Record<string, boolean>;
                this.savedPublications.forEach(pub => {
                    delete bookmarks[pub.id];
                });
                localStorage.setItem('lulada_bookmarks', JSON.stringify(bookmarks));
            } catch (error) {
                console.error('Error updating bookmarks:', error);
            }
            
            // Recarga y redibuja todo
            this.loadSavedPublications();
            this.render();
            
            console.log(' Todas las publicaciones guardadas eliminadas');
        }
    }

    // Configura los eventos (clicks, etc.) del componente
    setupEventListeners() {
        if (this.shadowRoot) {
            // Escucha eventos de navegación y los reenvía al sistema principal
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });

            // Escucha cuando alguien desmarca una publicación como favorita
            this.shadowRoot.addEventListener('publication-bookmarked', (e: Event) => {
                const customEvent = e as CustomEvent<{
                    bookmarked: boolean;
                    username: string;
                }>;
                const { bookmarked } = customEvent.detail;
                
                // Si se quita el bookmark, actualiza la lista
                if (!bookmarked) {
                    console.log(' Publicación removida desde Save');
                    setTimeout(() => {
                        this.loadSavedPublications();
                        this.updateSavedContent();
                    }, 100);
                }
            });
        }
    }
    
    // Maneja los cambios de tamaño de la ventana para hacer la página responsiva
    handleResize() {
        // Busca los elementos que necesitan cambiar según el tamaño de pantalla
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        if (sidebar && suggestions && responsiveBar) {
            // Si la pantalla es pequeña (móvil)
            if (window.innerWidth < 900) {
                sidebar.style.display = 'none';        // Oculta la barra lateral
                suggestions.style.display = 'none';    // Oculta las sugerencias
                responsiveBar.style.display = 'block'; // Muestra la barra inferior
            } else {
                // Si la pantalla es grande (computadora)
                sidebar.style.display = 'block';       // Muestra la barra lateral
                suggestions.style.display = 'block';   // Muestra las sugerencias
                responsiveBar.style.display = 'none';  // Oculta la barra inferior
            }
        }
    }
}

export default Save;