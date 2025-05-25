export class Home extends HTMLElement {

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
            this.shadowRoot.innerHTML = `
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
                    
                    .content {
                        flex-grow: 1;
                        display: flex; 
                    }
                    
                    .reviews-section {
                        padding: 20px;
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
                    }
                </style>
                
                <!-- Home usa lulada-header (HeaderHome) que maneja las zonas en desktop y responsive -->
                <lulada-header></lulada-header>
                
                <div class="main-layout">
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content">
                        <div class="reviews-section">
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
                        </div>
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
        if (this.shadowRoot) {
            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó ubicación: " + event.detail);
            });

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó menú: " + event.detail.menuItem);
            });
        }
    }

    handleResize() {
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        if (suggestions && sidebar && responsiveBar) {
            if (window.innerWidth < 900) {
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
            } else {
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }
    }
}

export default Home;