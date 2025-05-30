// Definimos interfaces para que TypeScript nos ayude con los tipos de datos
// Esto es como crear un "contrato" que dice qué propiedades y métodos debe tener cada elemento
interface NavigationElement extends HTMLElement {
    setActiveItem(nav: string): void; // Función para marcar un botón como activo
    detectCurrentPage(): void; // Función para detectar en qué página estamos
    updateActiveFromRoute(route: string): void; // Función para actualizar basado en una ruta
 }
 
 // Interface para el servicio que maneja los popups de "antojar"
 interface AntojarServiceInstance {
    initialize(): void; // Inicializar el servicio
    showPopup(): void; // Mostrar el popup
    hidePopup?(): void; // Ocultar el popup (opcional)
 }
 
 // Interface principal del servicio de antojar
 interface AntojarService {
    getInstance(): AntojarServiceInstance; // Obtener una instancia del servicio
 }
 
 // Extendemos la definición de Window para incluir nuestros servicios personalizados
 // Esto permite que TypeScript reconozca window.AntojarPopupService
 declare global {
    interface Window {
        AntojarPopupService?: AntojarService; // Servicio para los popups de antojar
        debugNavigationBar?: () => void; // Función de debug para la barra de navegación
    }
 }
 
 // Clase principal que representa la barra de navegación responsiva (para móviles)
 export class NavigationBar extends HTMLElement implements NavigationElement {
    // Variable que guarda cuál botón está actualmente seleccionado (por defecto 'home')
    private currentActive: string = 'home';
 
    // Constructor: se ejecuta cuando se crea una nueva instancia del componente
    constructor() {
        super(); // Llama al constructor de HTMLElement
        this.attachShadow({ mode: 'open' }); // Crea el shadow DOM para aislar estilos
        this.render(); // Dibuja el componente en pantalla
    }
 
    // Función que crea y dibuja todo el HTML y CSS de la barra de navegación
    render() {
        if (this.shadowRoot) {
            // Aquí ponemos todo el HTML con estilos CSS incluidos
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* Estilos para el elemento principal (:host se refiere a este componente) */
                    :host {
                        display: flex; /* Los elementos internos se acomodan en fila */
                        justify-content: center; /* Centrar horizontalmente */
                        align-items: center; /* Centrar verticalmente */
                        background-color: #fff; /* Fondo blanco */
                        border-top: 1px solid #e0e0e0; /* Línea gris arriba */
                        padding: 15px 0; /* Espacio interno arriba y abajo */
                        width: 100%; /* Ocupar todo el ancho */
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* Sombra hacia arriba */
                    }
                    
                    /* Contenedor principal de los botones de navegación */
                    .container-navbar {
                        display: flex; /* Elementos en fila */
                        justify-content: space-around; /* Distribuir espacio igualmente */
                        align-items: center; /* Centrar verticalmente */
                        width: 100%; /* Ocupar todo el ancho */
                        max-width: 350px; /* Ancho máximo de 350px */
                        margin: 0 auto; /* Centrar el contenedor */
                    }
                    
                    /* Estilo de cada botón individual de navegación */
                    .nav-item {
                        display: flex; /* Para centrar el contenido */
                        justify-content: center; /* Centrar horizontalmente */
                        align-items: center; /* Centrar verticalmente */
                        cursor: pointer; /* Mostrar manita al pasar el mouse */
                        padding: 12px; /* Espacio interno */
                        color: #AAAB54; /* Color verde de la marca */
                        transition: all 0.2s ease; /* Animación suave para cambios */
                        border-radius: 12px; /* Bordes redondeados */
                        min-width: 48px; /* Ancho mínimo para facilitar el toque */
                        min-height: 48px; /* Altura mínima para facilitar el toque */
                        opacity: 0.6; /* Un poco transparente por defecto */
                    }
 
                    /* Efecto cuando pasas el mouse por encima de un botón */
                    .nav-item:hover {
                        color: #74753a; /* Color más oscuro */
                        background-color: rgba(170, 171, 84, 0.1); /* Fondo verde claro */
                        transform: translateY(-2px); /* Se eleva un poco */
                        opacity: 0.9; /* Menos transparente */
                    }
 
                    /* Estilo del botón que está actualmente seleccionado */
                    .nav-item.active {
                        color: #74753a; /* Color más oscuro */
                        background-color: rgba(170, 171, 84, 0.15); /* Fondo verde más visible */
                        opacity: 1; /* Completamente opaco */
                        transform: scale(1.05); /* Un poquito más grande */
                    }
 
                    /* Estilo de los iconos dentro de cada botón */
                    .nav-icon {
                        width: 28px; /* Ancho del icono */
                        height: 28px; /* Altura del icono */
                        transition: transform 0.2s ease; /* Animación suave */
                    }
                    
                    /* Efecto en el icono cuando pasas el mouse */
                    .nav-item:hover .nav-icon {
                        transform: scale(1.1); /* Crece un 10% */
                    }
                    
                    /* El texto está oculto (solo usamos iconos en móvil) */
                    .nav-text {
                        display: none;
                    }
                </style>
 
                <!-- Contenedor principal de la barra de navegación -->
                <div class="container-navbar">
                    <!-- Botón de INICIO -->
                    <div class="nav-item ${this.currentActive === 'home' ? 'active' : ''}" data-nav="home" data-route="/home">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNiAxOWgzdi02aDZ2Nmgzdi05bC02LTQuNUw2IDEwem0tMiAyVjlsOC02bDggNnYxMmgtN3YtNmgtMnY2em04LTguNzUiLz48L3N2Zz4=" class="nav-icon" alt="Inicio">
                        <span class="nav-text">Inicio</span>          
                    </div>
 
                    <!-- Botón de EXPLORAR -->
                    <div class="nav-item ${this.currentActive === 'explore' ? 'active' : ''}" data-nav="explore" data-route="/explore">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMyAxMGE3IDcgMCAxIDAgMTQgMGE3IDcgMCAxIDAtMTQgMG0xOCAxMWwtNi02Ii8+PC9zdmc+" class="nav-icon" alt="Explorar">
                        <span class="nav-text">Buscar</span>            
                    </div>
 
                    <!-- Botón de ANTOJAR (crear reseñas) -->
                    <div class="nav-item ${this.currentActive === 'antojar' ? 'active' : ''}" data-nav="antojar" data-route="/antojar">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNBQUFCNTQiIGQ9Ik0xOC4yOTMgMTcuMjkzYTEgMSAwIDAgMSAxLjQ5OCAxLjMybC0uMDg0LjA5NGwtMS41IDEuNWEzLjEyIDMuMTIgMCAwIDEtNC40MTQgMGExLjEyIDEuMTIgMCAwIDAtMS40ODgtLjA4N2wtLjA5OC4wODdsLS41LjVhMSAxIDAgMCAxLTEuNDk3LTEuMzJsLjA4My0uMDk0bC41LS41YTMuMTIgMy4xMiAwIDAgMSA0LjQxNCAwYTEuMTIgMS4xMiAwIDAgMCAxLjQ4OC4wODdsLjA5OC0uMDg3em0tMS44MS0xMy4zMWEyLjUgMi41IDAgMCAxIDMuNjU3IDMuNDA1bC0uMTIyLjEzMUw4LjQ0MyAxOS4wOTRhMS41IDEuNSAwIDAgMS0uNTA2LjMzM2wtLjE0NS4wNWwtMi44MzcuODA3YTEgMSAwIDAgMS0xLjI2MS0xLjEzbC4wMjQtLjEwN2wuODA3LTIuODM4YTEuNSAxLjUgMCAwIDEgLjI4LS41MzdsLjEwMi0uMTEzem0yLjEyIDEuNDE1YS41LjUgMCAwIDAtLjYzNy0uMDU4bC0uMDcuMDU4TDYuNDE0IDE2Ljg4bC0uMjguOTg4bC45ODctLjI4TDE4LjYwNCA2LjEwNGEuNS41IDAgMCAwIDAtLjcwNyIvPjwvZz48L3N2Zz4=" class="nav-icon" alt="Antojar">
                        <span class="nav-text">Antojar</span> 
                    </div>
 
                    <!-- Botón de GUARDADOS -->
                    <div class="nav-item ${this.currentActive === 'save' ? 'active' : ''}" data-nav="save" data-route="/save">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAyMVY1cTAtLjgyNS41ODgtMS40MTJUNyAzaDEwcS44MjUgMCAxLjQxMy41ODhUMTkgNXYxNmwtNy0zem0yLTMuMDVsNS0yLjE1bDUgMi4xNVY1SDd6TTcgNWgxMHoiLz48L3N2Zz4=" class="nav-icon" alt="Guardado">
                        <span class="nav-text">Guardado</span>
                    </div>
 
                    <!-- Botón de PERFIL -->
                    <div class="nav-item ${this.currentActive === 'profile' ? 'active' : ''}" data-nav="profile" data-route="/profile">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNCAxOGE0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMloiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjMiLz48L2c+PC9zdmc+" class="nav-icon" alt="Perfil">
                        <span class="nav-text">Perfil</span>
                    </div>
                </div>
            `;
            
            // Después de crear el HTML, configuramos los eventos de navegación
            this.setupNavigation();
        }
    }
 
    // Se ejecuta cuando el componente se añade al DOM de la página
    connectedCallback(): void {
        console.log(' NavigationBar conectado al DOM');
        this.detectCurrentPage(); // Detectar en qué página estamos para marcar el botón correcto
    }
 
    // Se ejecuta cuando el componente se quita del DOM de la página
    disconnectedCallback(): void {
        console.log(' NavigationBar desconectado del DOM');
    }
 
    // Función que configura los eventos de click para todos los botones
    setupNavigation() {
        if (!this.shadowRoot) return; // Si no hay shadow DOM, salir
        
        console.log(' NavigationBar: Configurando navegación...');
        // Buscar todos los elementos con clase "nav-item" (nuestros botones)
        const navItems = this.shadowRoot.querySelectorAll(".nav-item");
        console.log(` NavigationBar: Encontrados ${navItems.length} items`);
        
        // Para cada botón, añadir un evento de click
        navItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault(); // Prevenir el comportamiento por defecto del navegador
                
                // Obtener la ruta y el nombre del botón desde sus atributos HTML
                const route = item.getAttribute("data-route"); // ej: "/home"
                const nav = item.getAttribute("data-nav"); // ej: "home"
                
                console.log(` NavigationBar: Click en ${nav} -> ${route}`);
                
                if (route && nav) {
                    // Marcar este botón como activo visualmente
                    this.setActiveItem(nav);
                    
                    // Caso especial: si clickearon "antojar", abrir popup en lugar de navegar
                    if (route === "/antojar") {
                        console.log(' NavigationBar: Abriendo popup de antojar...');
                        this.handleAntojarClick();
                    } else {
                        // Para los demás botones, navegar a la página correspondiente
                        console.log(` NavigationBar: Navegando a ${route}`);
                        this.navigate(route);
                    }
                } else {
                    console.warn(' NavigationBar: Item sin ruta o nav definidos');
                }
            });
        });
        
        console.log(' NavigationBar: Navegación configurada');
    }
 
    // Función especial para manejar el click en el botón "antojar"
    // En lugar de navegar a una página, abre un popup para crear reseñas
    private handleAntojarClick(): void {
        try {
            // Intentar obtener el servicio de popups desde window
            const antojarService = window.AntojarPopupService;
            if (antojarService) {
                // Si existe el servicio, mostrar el popup
                antojarService.getInstance().showPopup();
                console.log(' NavigationBar: Popup de antojar abierto');
            } else {
                // Si no existe, mostrar error
                console.error(" AntojarPopupService no disponible");
                alert("Esta función no está disponible");
            }
        } catch (error) {
            console.error(" Error con popup antojar:", error);
        }
    }
 
    // Función pública para marcar un botón como activo (seleccionado)
    public setActiveItem(activeNav: string): void {
        this.currentActive = activeNav; // Guardar cuál está activo
        
        if (!this.shadowRoot) return;
        
        // Buscar todos los botones y actualizar sus clases CSS
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach((item) => {
            const nav = item.getAttribute('data-nav');
            if (nav === activeNav) {
                // Si es el botón activo, añadir la clase "active"
                item.classList.add('active');
            } else {
                // Si no es el activo, quitar la clase "active"
                item.classList.remove('active');
            }
        });
        
        console.log(` NavigationBar: Item activo: ${activeNav}`);
    }
 
    // Función para detectar automáticamente en qué página estamos
    // Útil cuando la página se carga por primera vez
    public detectCurrentPage(): void {
        const currentPath = window.location.pathname; // Obtener la ruta actual del navegador
        console.log(` NavigationBar: Detectando página actual: ${currentPath}`);
        
        // Dependiendo de la ruta, marcar el botón correspondiente como activo
        if (currentPath.includes('/home') || currentPath === '/') {
            this.setActiveItem('home');
        } else if (currentPath.includes('/explore')) {
            this.setActiveItem('explore');
        } else if (currentPath.includes('/save')) {
            this.setActiveItem('save');
        } else if (currentPath.includes('/profile')) {
            this.setActiveItem('profile');
        } else if (currentPath.includes('/antojar')) {
            this.setActiveItem('antojar');
        }
    }
 
    // Función similar a detectCurrentPage pero recibe la ruta como parámetro
    // Útil cuando otros componentes nos dicen a qué ruta navegar
    public updateActiveFromRoute(route: string): void {
        if (route.includes('/home')) {
            this.setActiveItem('home');
        } else if (route.includes('/explore')) {
            this.setActiveItem('explore');
        } else if (route.includes('/save')) {
            this.setActiveItem('save');
        } else if (route.includes('/profile')) {
            this.setActiveItem('profile');
        } else if (route.includes('/antojar')) {
            this.setActiveItem('antojar');
        }
    }
 
    // Función principal para navegar a una nueva página
    navigate(route: string): void {
        console.log(` NavigationBar: Creando evento para: ${route}`);
        
        // Crear un evento personalizado que otros componentes pueden escuchar
        const event = new CustomEvent("navigate", { 
            detail: route, // La ruta a donde queremos ir
            bubbles: true, // El evento puede subir por el DOM
            composed: true  // El evento puede salir del shadow DOM
        });
        
        // Enviar el evento globalmente para que LoadPage lo capture
        document.dispatchEvent(event);
        console.log(` NavigationBar: Evento enviado: ${route}`);
        
        // También actualizar la URL del navegador sin recargar la página
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', route);
        }
    }
 
    // Función pública para hacer debugging (útil para desarrolladores)
    public debugInfo(): void {
        console.log('🔍 NavigationBar Debug:');
        console.log('- Current active:', this.currentActive);
        console.log('- URL actual:', window.location.pathname);
        console.log('- Shadow DOM:', !!this.shadowRoot);
        
        // Mostrar información de todos los botones
        const navItems = this.shadowRoot?.querySelectorAll('.nav-item');
        console.log('- Items de navegación:');
        navItems?.forEach((item, index) => {
            const route = item.getAttribute('data-route');
            const nav = item.getAttribute('data-nav');
            const isActive = item.classList.contains('active');
            console.log(`  ${index}: ${nav} (${route}) - ${isActive ? 'Activo' : 'Inactivo'}`);
        });
    }
 }
 
 // Exponer función de debugging globalmente para que los desarrolladores la puedan usar
 if (typeof window !== 'undefined') {
    if (!window.debugNavigationBar) {
        // Función global que los desarrolladores pueden llamar desde la consola del navegador
        window.debugNavigationBar = () => {
            const navigationBar = document.querySelector('lulada-responsive-bar') as NavigationElement | null;
            if (navigationBar && typeof (navigationBar as NavigationBar).debugInfo === 'function') {
                (navigationBar as NavigationBar).debugInfo();
            } else {
                console.log(' NavigationBar no encontrado o sin método debug');
            }
        };
    }
 }
 
 // Exportar la clase para que otros archivos la puedan usar
 export default NavigationBar;