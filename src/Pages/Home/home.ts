// Componente principal Home con diseño responsive
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
                        min-height: 100vh;
                        background-color: #f8f9fa;
                    }
                    
                    /* Header móvil - oculto por defecto */
                    .responsive-header {
                        display: none;
                    }
                    
                    /* Header desktop - sticky */
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    /* Layout principal: sidebar + contenido + sugerencias */
                    .main-layout {
                        display: flex;
                        width: 100%;
                        min-height: calc(100vh - 80px);
                    }
                    
                    /* Sidebar izquierdo */
                    .sidebar {
                        width: 250px;
                        flex-shrink: 0;
                        background-color: white;
                        border-right: 1px solid #e0e0e0;
                    }
                    
                    /* Contenedor del contenido principal */
                    .content {
                        flex-grow: 1;
                        display: flex;
                        min-width: 0;
                    }
                    
                    /* Sección de reseñas/publicaciones */
                    .reviews-section {
                        padding: 20px;
                        background-color: #f8f9fa;
                        flex-grow: 1;
                        box-sizing: border-box;
                    }
                    
                    /* Sidebar derecho con sugerencias */
                    .suggestions-section {
                        width: 250px;
                        padding: 20px 10px;
                        flex-shrink: 0;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                    }
                    
                    /* Barra navegación móvil - oculta por defecto */
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

                    /* Responsive: pantallas ≤ 900px */
                    @media (max-width: 900px) {
                        .responsive-header { display: block !important; }
                        .header-wrapper { display: none !important; }
                        .sidebar { display: none !important; }
                        .suggestions-section { display: none !important; }
                        .responsive-nav-bar { display: block !important; }
                        
                        .content {
                            padding-bottom: 80px;
                            width: 100%;
                        }
                        
                        .reviews-section {
                            padding: 15px;
                        }
                    }

                    /* Pantallas muy pequeñas ≤ 600px */
                    @media (max-width: 600px) {
                        .reviews-section {
                            padding: 10px;
                        }
                        
                        .content {
                            padding-bottom: 85px;
                        }
                    }
                </style>
                
                <!-- Header móvil -->
                <div class="responsive-header">
                    <lulada-responsive-header></lulada-responsive-header>
                </div>
                
                <!-- Header desktop -->
                <div class="header-wrapper">
                    <lulada-header></lulada-header>
                </div>
                
                <!-- Layout principal -->
                <div class="main-layout">
                    <!-- Sidebar izquierdo -->
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <!-- Contenido principal -->
                    <div class="content">
                        <div class="reviews-section">
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                        
                        <!-- Sugerencias -->
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
                        </div>
                    </div>
                </div>
                
                <!-- Barra navegación móvil -->
                <div class="responsive-nav-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            `;
        }
    }
    
    // Se ejecuta cuando el componente se añade al DOM
    connectedCallback() {
        this.setupLocationFiltering();
    }
    
    // Configurar filtros de ubicación
    setupLocationFiltering() {
        // Escuchar eventos de filtros de ubicación
document.addEventListener('location-filter-changed', () => {
    // Aquí puedes usar (e as CustomEvent).detail si necesitas el filtro
});
    }
}

export default Home;