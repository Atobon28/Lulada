// Definimos y exportamos la clase Home que representa la página principal de la app
export class Home extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        // Creamos un Shadow DOM para aislar nuestros estilos y HTML del resto de la página
        this.attachShadow({ mode: 'open' });
        // Mensaje de debug para saber cuándo se crea el componente
        console.log(' Home: Constructor ejecutado');
        
        // Si el Shadow DOM se creó correctamente
        if (this.shadowRoot) {
            // Aquí definimos todo el HTML y CSS del componente Home
            this.shadowRoot.innerHTML = `
                <style>
                    /* Estilos principales del componente */
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                        width: 100%;
                        overflow-x: hidden; /* No permitir scroll horizontal */
                        min-height: 100vh; /* Altura mínima de toda la pantalla */
                        background-color: #f8f9fa; /* Color de fondo gris claro */
                    }
                    
                    /* Header que aparece solo en móvil - inicialmente oculto */
                    .responsive-header {
                        display: none;
                    }
                    
                    /* Header que se queda pegado en la parte superior (solo desktop) */
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        position: sticky; /* Se queda fijo al hacer scroll */
                        top: 0;
                        z-index: 100; /* Aparece encima de otros elementos */
                        margin: 0;
                        padding: 0;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra sutil */
                    }
                    
                    /* Contenedor principal que organiza el sidebar, contenido y suggestions */
                    .main-layout {
                        display: flex; /* Los elementos se alinean en fila */
                        width: 100%;
                        box-sizing: border-box;
                        margin: 0;
                        min-height: calc(100vh - 80px); /* Altura menos el header */
                    }
                    
                    /* Barra lateral izquierda (solo en desktop) */
                    .sidebar {
                        width: 250px; /* Ancho fijo */
                        flex-shrink: 0; /* No se puede hacer más pequeño */
                        background-color: white;
                        border-right: 1px solid #e0e0e0; /* Línea separadora */
                    }
                    
                    /* Contenedor del contenido principal */
                    .content {
                        flex-grow: 1; /* Ocupa todo el espacio restante */
                        display: flex;
                        min-width: 0;
                    }
                    
                    /* Sección donde aparecen las reseñas/publicaciones */
                    .reviews-section {
                        padding: 20px;
                        background-color: #f8f9fa;
                        flex-grow: 1; /* Ocupa todo el espacio disponible */
                        min-width: 0;
                        box-sizing: border-box;
                    }
                    
                    /* Barra lateral derecha con sugerencias (solo en desktop) */
                    .suggestions-section {
                        width: 250px; /* Ancho fijo */
                        padding: 20px 10px;
                        flex-shrink: 0; /* No se puede hacer más pequeño */
                        box-sizing: border-box;
                        background-color: white;
                        border-left: 1px solid #e0e0e0; /* Línea separadora */
                    }
                    
                    /* Barra de navegación inferior (solo móvil) - inicialmente oculta */
                    .responsive-nav-bar {
                        display: none;
                        position: fixed; /* Se queda fija en la pantalla */
                        bottom: 0; /* Pegada al fondo */
                        left: 0;
                        right: 0;
                        background-color: white;
                        z-index: 1000; /* Aparece encima de todo */
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Sombra hacia arriba */
                    }

                    /* REGLAS PARA PANTALLAS PEQUEÑAS (móviles y tablets) */
                    @media (max-width: 900px) {
                        /* En móvil: MOSTRAR el header responsive */
                        .responsive-header {
                            display: block !important;
                        }
                        
                        /* En móvil: OCULTAR el header normal de desktop */
                        .header-wrapper {
                            display: none !important;
                        }
                        
                        /* En móvil: OCULTAR la barra lateral izquierda */
                        .sidebar {
                            display: none !important;
                        }
                        /* En móvil: OCULTAR las sugerencias de la derecha */
                        .suggestions-section {
                            display: none !important;
                        }
                        
                        /* En móvil: MOSTRAR la barra de navegación inferior */
                        .responsive-nav-bar {
                            display: block !important;
                        }
                        
                        /* En móvil: Ajustar el contenido para que no se tape con la barra inferior */
                        .content {
                            padding-bottom: 80px; /* Espacio para la barra inferior */
                            width: 100%;
                        }
                        
                        /* En móvil: Menos espacio interno en las reseñas */
                        .reviews-section {
                            padding: 15px;
                        }
                    }

                    /* Para pantallas muy pequeñas (teléfonos en vertical) */
                    @media (max-width: 600px) {
                        .reviews-section {
                            padding: 10px; /* Aún menos espacio */
                        }
                        
                        .content {
                            padding-bottom: 85px; /* Un poco más de espacio para la barra */
                        }
                    }

                    /* Contenido que aparece si los componentes no se cargan correctamente */
                    .fallback-content {
                        padding: 40px;
                        text-align: center;
                        background-color: white;
                        border-radius: 10px;
                        margin: 20px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .fallback-content h1 {
                        color: #AAAB54; /* Color verde de la marca */
                        margin-bottom: 20px;
                    }

                    .fallback-content p {
                        color: #666;
                        line-height: 1.6;
                    }
                </style>
                
                <!-- Header que aparece solo en móvil -->
                <div class="responsive-header">
                    <lulada-responsive-header></lulada-responsive-header>
                </div>
                
                <!-- Header que aparece solo en desktop -->
                <div class="header-wrapper">
                    <lulada-header></lulada-header>
                </div>
                
                <!-- Contenedor principal con 3 secciones -->
                <div class="main-layout">
                    <!-- Barra lateral izquierda (solo en desktop) -->
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <!-- Contenido principal en el centro -->
                    <div class="content">
                        <div class="reviews-section">
                            <!-- Aquí van todas las publicaciones/reseñas -->
                            <lulada-reviews-container></lulada-reviews-container>
                            
                            <!-- Mensaje de respaldo si algo falla al cargar -->
                            <div class="fallback-content" id="fallback" style="display: none;">
                                <h1> Bienvenido a Lulada</h1>
                                <p>Descubre los mejores sabores de Cali</p>
                                <p>Estamos cargando el contenido...</p>
                            </div>
                        </div>
                        
                        <!-- Barra lateral derecha con sugerencias (solo en desktop) -->
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
                        </div>
                    </div>
                </div>
                
                <!-- Barra de navegación que aparece solo en móvil -->
                <div class="responsive-nav-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            `;

            // Configurar la funcionalidad de filtros de ubicación
            this.setupLocationFiltering();
            
            // Mensaje de confirmación
            console.log('Home: HTML renderizado');
        } else {
            // Si algo sale mal al crear el Shadow DOM
            console.error(' Home: No se pudo crear shadowRoot');
        }
    }
    
    // Función para configurar los filtros de ubicación (Centro, Norte, Sur, etc.)
    setupLocationFiltering() {
        console.log(' Home: Configurando filtrado de ubicación...');
        
        // Escuchar cuando cambien los filtros de ubicación desde cualquier parte de la app
        document.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            console.log(' Home: Filtro de ubicación recibido:', event.detail);
        });

        // También escuchar desde nuestro propio Shadow DOM
        this.shadowRoot?.addEventListener('location-filter-changed', (e: Event) => {
            const event = e as CustomEvent;
            console.log(' Home (Shadow): Filtro de ubicación recibido:', event.detail);
        });
    }

    // Esta función se ejecuta automáticamente cuando el componente se añade a la página
    connectedCallback() {
        console.log(' Home: Componente conectado al DOM');
        
        // Esperar un poco y luego verificar que todos los sub-componentes se cargaron bien
        setTimeout(() => {
            this.checkSubComponents();
        }, 1000);
        
        // Configurar función para detectar cambios de tamaño de pantalla
        this.setupResizeHandler();
    }

    // Esta función se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        console.log(' Home: Componente desconectado');
    }

    // Función para verificar que todos los componentes internos se cargaron correctamente
    private checkSubComponents() {
        // Si no tenemos Shadow DOM, no podemos hacer nada
        if (!this.shadowRoot) return;

        // Lista de todos los componentes que deberían estar presentes
        const subComponents = [
            'lulada-header',          // Header de desktop
            'lulada-responsive-header', // Header de móvil
            'lulada-sidebar',         // Barra lateral
            'lulada-reviews-container', // Contenedor de reseñas
            'lulada-suggestions',     // Sugerencias
            'lulada-responsive-bar'   // Barra de navegación de móvil
        ];

        let loadedComponents = 0; // Contador de componentes que se cargaron bien
        const fallback = this.shadowRoot.querySelector('#fallback') as HTMLElement;

        // Revisar cada componente uno por uno
        subComponents.forEach(componentName => {
            const element = this.shadowRoot!.querySelector(componentName);
            if (element) {
                // Si encontramos el componente, aumentar el contador
                loadedComponents++;
                console.log(` ${componentName}: Cargado correctamente`);
            } else {
                // Si no lo encontramos, mostrar advertencia
                console.warn(` ${componentName}: No encontrado`);
            }
        });

        // Mostrar resumen de cuántos componentes se cargaron
        console.log(` Home: ${loadedComponents}/${subComponents.length} componentes cargados`);

        // Si se cargaron muy pocos componentes, mostrar el contenido de respaldo
        if (loadedComponents < 2 && fallback) {
            fallback.style.display = 'block';
            console.log(' Mostrando contenido de fallback');
        }
    }

    // Función para detectar cuando cambia el tamaño de la pantalla (útil para debug)
    setupResizeHandler() {
        const checkLayout = () => {
            // Determinar si estamos en móvil o desktop
            const isMobile = window.innerWidth <= 900;
            console.log(` Layout actual: ${isMobile ? 'Móvil' : 'Desktop'} (${window.innerWidth}px)`);
        };

        // Ejecutar la función cada vez que cambie el tamaño de ventana
        window.addEventListener('resize', checkLayout);
        checkLayout(); // También ejecutar inmediatamente
    }

    // Función pública para hacer debug del componente
    public debugInfo() {
        console.log(' Home Debug Info:');
        console.log('- Shadow Root:', !!this.shadowRoot); // ¿Existe el Shadow DOM?
        console.log('- Conectado:', this.isConnected);    // ¿Está conectado a la página?
        
        // Si tenemos Shadow DOM, mostrar qué elementos contiene
        if (this.shadowRoot) {
            const elements = this.shadowRoot.querySelectorAll('*');
            console.log('- Elementos en shadow DOM:', elements.length);
            
            // Mostrar cada elemento encontrado
            elements.forEach(el => {
                console.log(`  - ${el.tagName.toLowerCase()}`);
            });
        }
    }
}

// Si estamos en un navegador (no en servidor), hacer disponible la función de debug
if (typeof window !== 'undefined') {
    // Solo crear la función si no existe ya
    if (!window.debugHome) {
        window.debugHome = () => {
            // Buscar el componente Home en la página
            const homeEl = document.querySelector('lulada-home') as Home;
            if (homeEl && homeEl.debugInfo) {
                // Si lo encontramos, ejecutar su función de debug
                homeEl.debugInfo();
            } else {
                console.log('No se encontró el componente lulada-home');
            }
        };
    }
}

// Exportar la clase como default para que se pueda importar fácilmente
export default Home;