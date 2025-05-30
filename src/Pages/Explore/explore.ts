// Esta es la página de "Explorar" de la aplicación Lulada
// Se encarga de mostrar contenido para que los usuarios exploren reseñas y restaurantes
class LuladaExplore extends HTMLElement {

    constructor() {
        // Llamamos al constructor padre (HTMLElement)
        super();
        // Creamos un "shadow DOM" - esto es como crear un contenedor privado 
        // para nuestro HTML que no se mezcla con el resto de la página
        this.attachShadow({ mode: 'open' });
    }

    // Esta función se ejecuta automáticamente cuando el componente 
    // se añade a la página web
    connectedCallback() {
        // Dibujamos todo el contenido de la página
        this.render();
        // Configuramos los eventos (clicks, navegación, etc.)
        this.setupEventListeners();
        // Configuramos el resize handler - esto hace que la página se adapte 
        // cuando el usuario cambia el tamaño de la ventana (responsive)
        window.addEventListener('resize', this.handleResize.bind(this));
        // Ejecutamos una vez al cargar para configurar el layout inicial
        this.handleResize();
    }

    // Esta función se ejecuta cuando el componente se quita de la página
    // Es importante limpiar los "event listeners" para evitar problemas de memoria
    disconnectedCallback() {
        // Quitamos el event listener del resize para liberar memoria
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Esta función "pinta" toda la interfaz de usuario de la página Explorar
    render() {
        // Aquí definimos todo el HTML y CSS de la página
        this.shadowRoot!.innerHTML = /*html */ `
            <style>
                /* === ESTILOS CSS PARA LA PÁGINA === */
                
                /* El contenedor principal de todo el componente */
                :host {
                    display: block;                        /* Se muestra como un bloque */
                    font-family: 'inter', sans-serif;     /* Usamos la fuente Inter */
                }
                
                /* Layout principal - divide la página en columnas */
                .main-layout {
                    display: flex;           /* Los elementos se ponen en fila */
                    margin-top: 10px;       /* Espacio arriba */
                }
                
                /* Barra lateral izquierda (sidebar) con menú de navegación */
                .sidebar {
                    width: 250px;           /* Ancho fijo de 250 pixeles */
                }

                /* Contenido del medio que crece para ocupar el espacio disponible */
                .medium-content {
                    flex-grow: 1;           /* Ocupa todo el espacio restante */
                    display: flex;          /* Los elementos internos en fila */
                    flex-direction: column; /* Pero en columna (uno encima del otro) */
                }

                /* Área de contenido principal */
                .content {
                    flex-grow: 1;          /* Ocupa el espacio disponible */
                    display: flex;         /* Elementos en fila */
                    padding: 20px;        /* Espacio interno de 20px */
                }
                
                /* Sección donde va el contenido de explorar (imágenes, textos, etc.) */
                .explore-section {
                    margin-left: 1rem;     /* Margen izquierdo */
                    margin-right: 1rem;    /* Margen derecho */
                    background-color: white; /* Fondo blanco */
                    flex-grow: 1;          /* Ocupa el espacio disponible */
                }
                
                /* Sección de sugerencias en el lado derecho */
                .suggestions-section {
                    width: 250px;          /* Ancho fijo */
                    padding: 20px 10px;    /* Espacio interno */
                }
                
                /* Barra de navegación responsive (solo se ve en móviles) */
                .responsive-bar {
                    display: none;          /* Oculta por defecto */
                    position: fixed;        /* Se queda fija en la pantalla */
                    bottom: 0;             /* Pegada al fondo */
                    left: 0;               /* Pegada a la izquierda */
                    right: 0;              /* Pegada a la derecha */
                    background-color: white; /* Fondo blanco */
                    padding: 10px 0;       /* Espacio interno arriba y abajo */
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Sombra hacia arriba */
                }

                /* === DISEÑO RESPONSIVE === */
                /* Estas reglas se aplican cuando la pantalla es de 900px o menor (móviles/tablets) */
                @media (max-width: 900px) {
                    /* En móviles, ocultamos la barra lateral */
                    .sidebar {
                        display: none;
                    }
                    
                    /* En móviles, ocultamos las sugerencias */
                    .suggestions-section {
                        display: none;
                    }
                    
                    /* En móviles, mostramos la barra de navegación inferior */
                    .responsive-bar {
                        display: block;
                    }
                    
                    /* Reducimos los márgenes en móviles para aprovechar el espacio */
                    .explore-section {
                        margin-left: 0.5rem;
                        margin-right: 0.5rem;
                    }
                }
            </style>
            
            <!-- === ESTRUCTURA HTML DE LA PÁGINA === -->
            
            <!-- Cabecera con barra de búsqueda -->
            <header-explorer></header-explorer>

            <!-- Layout principal con tres columnas -->
            <div class="main-layout">
                <!-- Columna izquierda: Menú de navegación -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Columna central: Contenido principal -->
                <div class="medium-content">
                    <div class="content">
                        <div class="explore-section">
                            <!-- Aquí va el contenido que se puede explorar (imágenes, reseñas, etc.) -->
                            <explore-container></explore-container>
                        </div>
                    </div>
                </div>
                
                <!-- Columna derecha: Sugerencias -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Barra de navegación para móviles (solo se ve en pantallas pequeñas) -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;
    }

    // Configura todos los eventos que necesita escuchar esta página
    setupEventListeners() {
        // Escuchar eventos de navegación (cuando el usuario quiere ir a otra página)
        if (this.shadowRoot) {
            // Cuando alguien hace click en un enlace de navegación dentro de esta página
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent;
                // Reenviamos el evento hacia arriba para que lo maneje el sistema de navegación principal
                // Es como pasar el mensaje: "el usuario quiere ir a otra página"
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail  // Los detalles de a dónde quiere ir
                }));
            });
        }
    }

    // Esta función se ejecuta cuando el usuario cambia el tamaño de la ventana
    // Hace que la página se adapte entre modo desktop y móvil
    handleResize() {
        // Obtenemos referencias a los elementos que necesitamos mostrar/ocultar
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        // Verificamos que encontramos todos los elementos
        if (sidebar && suggestions && responsiveBar) {
            // Si la pantalla es menor a 900px (móvil/tablet)
            if (window.innerWidth < 900) {
                // Modo móvil: ocultamos sidebar y sugerencias
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                // Mostramos la barra de navegación inferior
                responsiveBar.style.display = 'block';
            } else {
                // Modo desktop: mostramos sidebar y sugerencias
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                // Ocultamos la barra de navegación inferior
                responsiveBar.style.display = 'none';
            }
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default LuladaExplore;