export class Home extends HTMLElement {
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
                        overflow-x: hidden; /* Eliminar scroll horizontal */
                    }
                    
                    /* Header siempre visible */
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        padding: 20px;
                        box-sizing: border-box;
                    }
                    
                    .header-content {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-start; /* Desktop: alinear a la izquierda */
                        max-width: 1200px;
                        margin: 0 auto;
                        box-sizing: border-box;
                    }
                    
                    .logo-container {
                        margin-bottom: 20px;
                        max-width: 100%;
                    }
                    
                    .location-tags {
                        display: flex;
                        justify-content: flex-start; /* Desktop: alinear a la izquierda */
                        gap: 15px;
                        flex-wrap: wrap;
                        max-width: 100%;
                        overflow: hidden;
                        width: 100%;
                    }
                    
                    .location-tags a {
                        position: relative;
                        text-decoration: none;
                        color: #666;
                        font-weight: bold;
                        padding: 8px 15px;
                        border-radius: 20px;
                        transition: all 0.2s ease;
                        white-space: nowrap;
                    }
                    
                    .location-tags a:hover {
                        color: #333;
                        background-color: rgba(170, 171, 84, 0.1);
                    }
                    
                    .location-tags a.active {
                        color: #AAAB54;
                        background-color: rgba(170, 171, 84, 0.15);
                    }
                    
                    .main-layout {
                        display: flex;
                        margin-top: 10px;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    
                    .sidebar {
                        width: 250px;
                        flex-shrink: 0;
                    }
                    
                    .content {
                        flex-grow: 1;
                        display: flex;
                        min-width: 0;
                    }
                    
                    .reviews-section {
                        padding: 20px;
                        background-color: white;
                        flex-grow: 1;
                        min-width: 0;
                        box-sizing: border-box;
                    }
                    
                    .suggestions-section {
                        width: 250px;
                        padding: 20px 10px;
                        flex-shrink: 0;
                        box-sizing: border-box;
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
                    
                    /* Barra de navegación responsiva - oculta por defecto */
                    .responsive-nav-bar {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: white;
                        z-index: 1000;
                    }

                    /* Responsive styles */
                    @media (max-width: 900px) {
                        .header-wrapper {
                            padding: 15px 10px;
                        }
                        
                        .header-content {
                            align-items: center; /* Móvil: centrar todo */
                        }
                        
                        .logo-container {
                            text-align: center; /* Centrar el logo en móvil */
                        }
                        
                        .location-tags {
                            gap: 10px;
                            justify-content: center; /* Móvil: centrar navegación */
                        }
                        
                        .location-tags a {
                            padding: 6px 12px;
                            font-size: 14px;
                        }
                        
                        .sidebar {
                            display: none !important;
                        }
                        .suggestions-section {
                            display: none !important;
                        }
                        .responsive-nav-bar {
                            display: block !important;
                        }
                        .content {
                            padding-bottom: 80px;
                            width: 100%;
                        }
                        
                        .reviews-section {
                            padding: 15px;
                        }
                        
                        .header-wrapper {
                            display: block !important;
                        }
                    }
                </style>
                
                <!-- Header siempre visible -->
                <div class="header-wrapper">
                    <div class="header-content">
                        <div class="logo-container">
                            <lulada-logo></lulada-logo>
                        </div>
                        <div class="location-tags">
                            <a href="#" data-section="cali" class="active">Cali</a>
                            <a href="#" data-section="norte">Norte</a>
                            <a href="#" data-section="sur">Sur</a>
                            <a href="#" data-section="oeste">Oeste</a>
                            <a href="#" data-section="centro">Centro</a>
                        </div>
                    </div>
                </div>
                
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
                
                <!-- Barra de navegación responsiva (solo visible en móvil) -->
                <div class="responsive-nav-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            `;

            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó ubicación: " + event.detail);
            });

            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent;
                console.log("Se seleccionó menú: " + event.detail.menuItem);
            });
            
            // Configurar navegación del header
            this.setupHeaderNavigation();
        }
    }
    
    setupHeaderNavigation() {
        if (!this.shadowRoot) return;
        
        const locationLinks = this.shadowRoot.querySelectorAll('.location-tags a');
        
        locationLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remover active de todos
                locationLinks.forEach(l => l.classList.remove('active'));
                
                // Agregar active al clickeado
                link.classList.add('active');
                
                const section = link.getAttribute('data-section');
                if (section) {
                    console.log('Filtrando por ubicación:', section);
                    // Aquí puedes agregar la lógica para filtrar contenido por ubicación
                }
            });
        });
    }
}

export default Home;