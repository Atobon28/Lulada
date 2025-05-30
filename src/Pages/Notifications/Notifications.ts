// Componente de notificaciones para la app
export default class LuladaNotifications extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                    width: 100%;
                    overflow-x: hidden;
                }

                .header-wrapper {
                    width: 100%;
                    background-color: white;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .main-layout {
                    display: flex;
                    width: 100%;
                }

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

                .suggestions-section {
                    width: 250px;
                    padding: 20px 10px;
                    flex-shrink: 0;
                    background-color: white;
                    border-left: 1px solid #e0e0e0;
                }

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

                /* Responsive para móviles */
                @media (max-width: 900px) {
                    .sidebar { display: none; }
                    .suggestions-section { display: none; }
                    .responsive-bar { display: block; }
                    .reviews-section { margin-left: 1rem; margin-right: 1rem; }
                }
            </style>

            <div class="header-wrapper">
                <lulada-logo></lulada-logo>
            </div>
            
            <div class="main-layout">
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
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
                
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
            `;

            this.setupEventListeners();
            this.setupResizeHandler();
        }
    }

    connectedCallback() {
        this.setupResizeHandler();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Configura eventos del componente
    setupEventListeners() {
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail
                }));
            });
        }
    }

    // Configura el manejo de cambios de tamaño de pantalla
    setupResizeHandler() {
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();
    }

    // Maneja el responsive design
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