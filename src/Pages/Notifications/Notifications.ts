// Clase que crea el componente de notificaciones para la app Lulada
export default class LuladaNotifications extends HTMLElement {
    constructor() {
        super(); // Llama al constructor de la clase padre (HTMLElement)
        
        // Crea un shadow DOM para encapsular el HTML y CSS del componente
        // Esto evita que los estilos de este componente afecten otros elementos
        this.attachShadow({ mode: 'open' });
        
        // Si el shadow DOM se creó correctamente, crear el contenido
        if (this.shadowRoot) {
            // Aquí va todo el HTML y CSS del componente
            this.shadowRoot.innerHTML = `
            <style>
                /* Estilos para el elemento principal del componente */
                :host {
                    display: block; /* El componente se muestra como un bloque */
                    font-family: Arial, sans-serif; /* Fuente de texto */
                    width: 100%; /* Ocupa todo el ancho disponible */
                    overflow-x: hidden; /* No permite scroll horizontal */
                }

                /* Contenedor del header (logo) que se queda fijo en la parte superior */
                .header-wrapper {
                    width: 100%; /* Ocupa todo el ancho */
                    background-color: white; /* Fondo blanco */
                    position: sticky; /* Se queda pegado arriba al hacer scroll */
                    top: 0; /* Posición desde arriba */
                    z-index: 100; /* Aparece por encima de otros elementos */
                    margin: 0; /* Sin márgenes */
                    padding: 0; /* Sin espaciado interno */
                }

                /* Contenedor principal que organiza la página en columnas */
                .main-layout {
                    display: flex; /* Los elementos se alinean en fila */
                    width: 100%; /* Ocupa todo el ancho */
                    box-sizing: border-box; /* Incluye padding y border en el tamaño */
                    margin: 0; /* Sin márgenes */
                }

                /* Barra lateral izquierda (solo visible en computadoras) */
                .sidebar {
                    width: 250px; /* Ancho fijo de 250 píxeles */
                    flex-shrink: 0; /* No se encoge aunque falte espacio */
                    background-color: white; /* Fondo blanco */
                    border-right: 1px solid #e0e0e0; /* Línea gris a la derecha */
                }

                /* Contenedor del contenido principal */
                .content {
                    flex-grow: 1; /* Ocupa todo el espacio restante */
                    display: flex; /* Los elementos internos se alinean */
                    min-width: 0; /* Ancho mínimo de 0 */
                }

                /* Área donde va el contenido principal */
                .content-area {
                    display: flex; /* Los elementos se alinean */
                    flex-grow: 1; /* Ocupa todo el espacio disponible */
                    background-color: white; /* Fondo blanco */
                }

                /* Sección donde van las notificaciones */
                .reviews-section {
                    max-width: 650px; /* Ancho máximo de 650 píxeles */
                    margin: 0 auto; /* Centrado horizontalmente */
                    padding: 16px; /* Espaciado interno de 16 píxeles */
                    background-color: white; /* Fondo blanco */
                    flex-grow: 1; /* Ocupa todo el espacio disponible */
                    min-width: 0; /* Ancho mínimo de 0 */
                }

                /* Estilo para el título "Notificaciones" */
                .reviews-content h2 {
                    margin-top: 0; /* Sin margen arriba */
                    font-size: 22px; /* Tamaño de letra de 22 píxeles */
                    color: #333; /* Color gris oscuro */
                    margin-bottom: 20px; /* Espacio de 20 píxeles abajo */
                }

                /* Sección de sugerencias (solo visible en computadoras) */
                .suggestions-section {
                    width: 250px; /* Ancho fijo de 250 píxeles */
                    padding: 20px 10px; /* Espaciado interno */
                    flex-shrink: 0; /* No se encoge */
                    box-sizing: border-box; /* Incluye padding en el tamaño */
                    background-color: white; /* Fondo blanco */
                    border-left: 1px solid #e0e0e0; /* Línea gris a la izquierda */
                }

                /* Mensaje cuando no hay contenido */
                .no-content {
                    padding: 40px; /* Espaciado interno de 40 píxeles */
                    text-align: center; /* Texto centrado */
                    color: #666; /* Color gris */
                    font-style: italic; /* Texto en cursiva */
                    background-color: #f9f9f9; /* Fondo gris claro */
                    border-radius: 8px; /* Bordes redondeados */
                    margin-top: 20px; /* Margen superior de 20 píxeles */
                }

                /* Barra de navegación para móviles (inicialmente oculta) */
                .responsive-nav-bar {
                    display: none; /* Oculta por defecto */
                    position: fixed; /* Posición fija en la pantalla */
                    bottom: 0; /* Pegada al fondo */
                    left: 0; /* Desde la izquierda */
                    right: 0; /* Hasta la derecha */
                    background-color: white; /* Fondo blanco */
                    z-index: 1000; /* Aparece por encima de todo */
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Sombra hacia arriba */
                }

                /* Reglas CSS que se aplican cuando la pantalla es menor a 900px (móviles y tablets) */
                @media (max-width: 900px) {
                    /* MOSTRAR header responsive en móvil */
                    .responsive-header {
                        display: block !important; /* Forzar que se muestre */
                    }
                    
                    /* OCULTAR logo de desktop en móvil */
                    .desktop-logo {
                        display: none !important; /* Forzar que se oculte */
                    }
                    
                    /* Ocultar la barra lateral en móviles */
                    .sidebar {
                        display: none; /* No se muestra */
                    }
                    
                    /* Ocultar las sugerencias en móviles */
                    .suggestions-section {
                        display: none; /* No se muestra */
                    }
                    
                    /* Mostrar la barra de navegación inferior en móviles */
                    .responsive-bar {
                        display: block; /* Se muestra */
                    }
                    
                    /* Ajustar el contenido en móviles */
                    .reviews-section {
                        margin-left: 1rem; /* Margen izquierdo de 1rem */
                        margin-right: 1rem; /* Margen derecho de 1rem */
                    }

                    /* Ajustar el header guardado en móviles */
                    .saved-header {
                        margin-bottom: 20px; /* Margen inferior */
                        padding: 15px; /* Espaciado interno */
                    }

                    /* Ajustar el tamaño del título en móviles */
                    .saved-header h2 {
                        font-size: 20px; /* Tamaño de letra más pequeño */
                    }
                }
            </style>

            <!-- Header con el logo (parte superior de la página) -->
            <div class="header-wrapper">
                <lulada-logo></lulada-logo>
            </div>
            
            <!-- Contenedor principal que organiza todo en columnas -->
            <div class="main-layout">
                <!-- Barra lateral izquierda (solo se ve en computadoras) -->
                <div class="sidebar">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido principal del centro -->
                <div class="content">
                    <div class="content-area">
                        <div class="reviews-section">
                            <div class="reviews-content">
                                <!-- Título de la página -->
                                <h2>Notificaciones</h2>
                                <!-- Componente que muestra las tarjetas de notificaciones -->
                                <lulada-card-notifications></lulada-card-notifications>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sección de sugerencias (solo se ve en computadoras) -->
                <div class="suggestions-section">
                    <lulada-suggestions></lulada-suggestions>
                </div>
            </div>
            
            <!-- Barra de navegación inferior (solo se ve en móviles) -->
            <div class="responsive-bar">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
            `;

            // Configurar los eventos que escucha este componente
            this.setupEventListeners();
            // Configurar el manejo de cambios de tamaño de pantalla
            this.setupResizeHandler();
        }
    }

    // Función que se ejecuta cuando el componente se añade a la página
    connectedCallback() {
        console.log(' LuladaNotifications conectado'); // Mensaje en la consola
        this.setupResizeHandler(); // Configurar el manejo de redimensionamiento
    }

    // Función que se ejecuta cuando el componente se quita de la página
    disconnectedCallback() {
        console.log(' LuladaNotifications desconectado'); // Mensaje en la consola
        // Quitar el escuchador de eventos de redimensionamiento para evitar errores
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    // Función que configura todos los eventos que escucha este componente
    setupEventListeners() {
        // Si existe el shadow DOM, configurar los eventos
        if (this.shadowRoot) {
            // Escuchar cuando se selecciona una ubicación
            this.shadowRoot.addEventListener('location-select', (e: Event) => {
                const event = e as CustomEvent; // Convertir el evento al tipo correcto
                console.log("Se seleccionó ubicación: " + event.detail); // Mostrar en consola
            });

            // Escuchar cuando se selecciona un elemento del menú
            this.shadowRoot.addEventListener('menuselect', (e: Event) => {
                const event = e as CustomEvent; // Convertir el evento al tipo correcto
                console.log("Se seleccionó menú: " + event.detail.menuItem); // Mostrar en consola
            });

            // Escuchar eventos de navegación de la barra inferior móvil
            this.shadowRoot.addEventListener('navigate', (event: Event) => {
                const customEvent = event as CustomEvent; // Convertir al tipo correcto
                // Reenviar el evento hacia arriba para que lo maneje el componente principal
                document.dispatchEvent(new CustomEvent('navigate', {
                    detail: customEvent.detail // Pasar la información del evento
                }));
            });
        }
    }

    // Función que configura el manejo de cambios de tamaño de pantalla
    setupResizeHandler() {
        // Escuchar cuando cambia el tamaño de la ventana del navegador
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize(); // Ejecutar inmediatamente para configurar el estado inicial
    }

    // Función que maneja los cambios de tamaño de pantalla
    handleResize() {
        // Obtener referencias a los elementos que necesitamos mostrar/ocultar
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;

        // Si la pantalla es menor a 900px, oculta sidebar y sugerencias, muestra barra móvil
        if (sidebar && suggestions && responsiveBar) {
            if (window.innerWidth < 900) { // Si la pantalla es pequeña (móvil/tablet)
                sidebar.style.display = 'none'; // Ocultar barra lateral
                suggestions.style.display = 'none'; // Ocultar sugerencias
                responsiveBar.style.display = 'block'; // Mostrar barra inferior móvil
            } else { // Si la pantalla es grande (computadora)
                sidebar.style.display = 'block'; // Mostrar barra lateral
                suggestions.style.display = 'block'; // Mostrar sugerencias
                responsiveBar.style.display = 'none'; // Ocultar barra inferior móvil
            }
        }
    }
}