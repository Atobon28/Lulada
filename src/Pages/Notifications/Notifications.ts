export default class LuladaNotifications extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {//encapsula el html y css del componente evistando conflictos
            this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    width: 100%;
                    overflow-x: hidden;
                }

                /* Header sticky */
                .header-wrapper {
                    width: 100%;
                    background-color: white;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    margin: 0;
                    padding: 0;
                }

                .main-layout {
                    display: flex;
                    width: 100%;
                    box-sizing: border-box;
                    margin: 0;
                }

                /* DESKTOP: Sidebar visible */
                .sidebar {
                    width: 250px;
                    flex-shrink: 0;
                    background-color: white;
                    border-right: 1px solid #e0e0e0;
                }

                .content {
                    flex-grow: 1;
                    display: flex;
                    min-width: 0;
                }

                .content-area {
                    display: flex;
                    flex-grow: 1;
                    background-color: white;
                }

                .reviews-section {
                    max-width: 650px;
                    margin: 0 auto;
                    padding: 16px;
                    background-color: white;
                    flex-grow: 1;
                    min-width: 0;
                }

                .reviews-content h2 {
                    margin-top: 0;
                    font-size: 22px;
                    color: #333;
                    margin-bottom: 20px;
                }

                /* DESKTOP: Suggestions visible */
                .suggestions-section {
                    width: 250px;
                    padding: 20px 10px;
                    flex-shrink: 0;
                    box-sizing: border-box;
                    background-color: white;
                    border-left: 1px solid #e0e0e0;
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

                /* Barra de navegación responsiva - oculta en desktop */
                .responsive-nav-bar {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    z-index: 1000;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                }

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

            <!-- Header con layout responsive -->
            <div class="header-wrapper">
                <lulada-logo></lulada-logo>
            </div>
            
            <div class="main-layout">
                <!-- Sidebar (solo desktop) -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido principal -->
                <div class="content">
                    <div class="content-area">
                        <div class="reviews-section">
                            <div class="reviews-content">
                                <h2>Notificaciones</h2>
                                <lulada-card-notifications></lulada-card-notifications>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Suggestions (solo desktop) -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
            `;

            // Configurar eventos
            this.setupEventListeners();
            this.setupResizeHandler();
        }
    }

    connectedCallback() {
        console.log('🔗 LuladaNotifications conectado');
        this.setupResizeHandler();
    }

    disconnectedCallback() {
        console.log('🔌 LuladaNotifications desconectado');
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    setupEventListeners() {
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó ubicación: " + event.detail);
            });

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó menú: " + event.detail.menuItem);
            });

            // Escuchar eventos de navegación del responsive bar
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                // Reenviar el evento hacia arriba para que lo maneje LoadPage
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });
        }
    }

    setupResizeHandler() {
        // Configurar resize handler para debug
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Verificar inmediatamente
    }

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