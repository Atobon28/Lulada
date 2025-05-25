class PUser extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        // Configurar el resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Ejecutar una vez al cargar
    }

    disconnectedCallback() {
        // Limpiar el event listener
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
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
                    <div class="user-profile">
                        <user-profile></user-profile>
                    </div>
                    <div class="content">
                        <div class="reviews-section">
                            <lulada-publication 
                                username="CrisTiJauregui" 
                                text="El coctel de hierva buena en @BarBurguer esta super delicioso para los amantes como yo de los sabores frescos, costo 20.000 y lo recomiendo 100%" 
                                stars="5"
                            ></lulada-publication>
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
        }
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

export default PUser;