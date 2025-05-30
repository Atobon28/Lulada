// Definir interfaces para tipos seguros
// Una interfaz es como un contrato que define qué métodos debe tener un elemento
interface LuladaSidebarElement extends HTMLElement {
    updateActive(route: string): void; // Método para actualizar qué botón está activo
    debugNavigation(): void; // Método para hacer debug de la navegación
}

// Interfaz para el servicio que maneja el popup de "antojar"
interface AntojarServiceInstance {
    initialize(): void; // Inicializar el servicio
    showPopup(): void; // Mostrar el popup
    hidePopup?(): void; // Ocultar el popup (opcional)
}

// Interfaz para el servicio completo de antojar
interface AntojarService {
    getInstance(): AntojarServiceInstance; // Obtener una instancia del servicio
}

// Extender Window para tipos seguros
// Esto le dice a TypeScript qué propiedades globales existen en window
declare global {
    interface Window {
        AntojarPopupService?: AntojarService; // Servicio global para el popup de antojar
        debugSidebar?: () => void; // Función global para hacer debug del sidebar
    }
}

// Clase principal del componente sidebar (menú lateral)
class LuladaSidebar extends HTMLElement implements LuladaSidebarElement {
    // Variable privada que guarda qué ruta está actualmente seleccionada
    private currentActiveRoute: string = '/home';

    constructor() {
        super(); // Llamar al constructor del elemento HTML base
        // Crear un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open' });

        // Si se creó correctamente el shadow DOM
        if (this.shadowRoot) {
            // Insertar todo el HTML y CSS del componente
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* Estilos para el contenedor principal del sidebar */
                    :host {
                        width: 250px; /* Ancho fijo del sidebar */
                        background-color: white; /* Fondo blanco */
                        border-right: 1px solid #e0e0e0; /* Borde derecho gris claro */
                        display: flex; /* Usar flexbox para organizar elementos */
                        flex-direction: column; /* Organizar elementos en columna */
                        padding: 20px; /* Espacio interno */
                        align-items: center; /* Centrar elementos horizontalmente */
                    }
                    
                    /* Estilos para el logo del sidebar */
                    .sidebar-logo {
                        margin-bottom: 30px; /* Espacio debajo del logo */
                        text-align: center; /* Centrar el logo */
                    }
                    
                    /* Estilos para las etiquetas de ubicación */
                    .location-tags {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 20px;
                        font-size: 18px;
                        color: #AAAB54; /* Color verde característico */
                    }
                    
                    /* Contenedor de todos los elementos del menú */
                    .menu-items {
                        width: 100%; /* Ocupar todo el ancho disponible */
                    }
                    
                    /* Estilos para cada elemento individual del menú */
                    .menu-item {
                        display: flex; /* Usar flexbox para organizar ícono y texto */
                        align-items: center; /* Centrar verticalmente */
                        padding: 10px; /* Espacio interno */
                        cursor: pointer; /* Mostrar cursor de mano al pasar por encima */
                        border-radius: 5px; /* Bordes redondeados */
                        margin-bottom: 10px; /* Espacio debajo de cada elemento */
                        color: #AAAB54; /* Color verde característico */
                        transition: all 0.2s ease; /* Animación suave para cambios */
                        user-select: none; /* Evitar que se pueda seleccionar el texto */
                    }
                    
                    /* Efectos cuando pasas el mouse por encima de un elemento del menú */
                    .menu-item:hover {
                        background-color: #f0f0f0; /* Fondo gris claro */
                        transform: translateX(5px); /* Mover ligeramente a la derecha */
                    }
                    
                    /* Estilos para el elemento del menú que está actualmente seleccionado */
                    .menu-item.active {
                        background-color: rgba(170, 171, 84, 0.1); /* Fondo verde claro */
                        border-left: 3px solid #AAAB54; /* Borde izquierdo verde */
                        font-weight: bold; /* Texto en negrita */
                    }
                    
                    /* Estilos para los íconos de cada elemento del menú */
                    .menu-icon {
                        margin-right: 10px; /* Espacio a la derecha del ícono */
                        width: 24px; /* Ancho fijo */
                        height: 24px; /* Altura fija */
                        transition: transform 0.2s ease; /* Animación para transformaciones */
                    }
                    
                    /* Efecto de agrandamiento del ícono al pasar el mouse */
                    .menu-item:hover .menu-icon {
                        transform: scale(1.1); /* Agrandar el ícono 10% */
                    }
                    
                    /* Estilos para el texto de cada elemento del menú */
                    .menu-text {
                        font-size: 16px; /* Tamaño de fuente */
                    }
                </style>
                
                <!-- Contenedor de todos los elementos del menú -->
                <div class="menu-items">
                    <!-- Elemento del menú: Inicio -->
                    <div class="menu-item active" data-route="/home">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNiAxOWgzdi02aDZ2Nmgzdi05bC02LTQuNUw2IDEwem0tMiAyVjlsOC02bDggNnYxMmgtN3YtNmgtMnY2em04LTguNzUiLz48L3N2Zz4=" class="menu-icon" alt="Inicio">
                        <span class="menu-text">Inicio</span>
                    </div>

                    <!-- Elemento del menú: Notificaciones -->
                    <div class="menu-item" data-route="/notifications">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAxOXEtLjQyNSAwLS43MTItLjI4OFQ0IDE4dC4yODgtLjcxMlQ1IDE3aDF2LTdxMC0yLjA3NSAxLjI1LTMuNjg3VDEwLjUgNC4ydi0uN3EwLS42MjUuNDM4LTEuMDYyVDEyIDJ0MS4wNjMuNDM4VDEzLjUgMy41di43cTIgLjUgMy4yNSAyLjExM1QxOCAxMHY3aDFxLjQyNSAwIC43MTMuMjg4VDIwIDE4dC0uMjg4LjcxM1QxOSAxOXptNyAzcS0uODI1IDAtMS40MTItLjU4N1QxMCAyMGg0cTAgLjgyNS0uNTg3IDEuNDEzVDEyIDIybS00LTVoOHYtN3EwLTEuNjUtMS4xNzUtMi44MjVUMTIgNlQ5LjE3NSA7LjE3NVQ4IDEweiIvPjwvc3ZnPg==" class="menu-icon" alt="Notificaciones">
                        <span class="menu-text">Notificaciones</span>
                    </div>

                    <!-- Elemento del menú: Guardado -->
                    <div class="menu-item" data-route="/save">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAyMVY1cTAtLjgyNS41ODgtMS40MTJUNyAzaDEwcS44MjUgMCAxLjQxMy41ODhUMTkgNXYxNmwtNy0zem0yLTMuMDVsNS0yLjE1bDUgMi4xNVY1SDd6TTcgNWgxMHoiLz48L3N2Zz4=" class="menu-icon" alt="Guardado">
                        <span class="menu-text">Guardado</span>
                    </div>

                    <!-- Elemento del menú: Explorar -->
                    <div class="menu-item" data-route="/explore">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iLTIuNSAtMi41IDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNOCAxNEE2IDYgMCAxIDAgOCAyYTYgNiAwIDAgMCAwIDEybTYuMzItMS4wOTRsMy41OCAzLjU4YTEgMSAwIDEgMS0xLjQxNSAxLjQxM2wtMy41OC0zLjU4YTggOCAwIDEgMSAxLjQxNC0xLjQxNHoiLz48L3N2Zz4=" class="menu-icon" alt="Explorar">
                        <span class="menu-text">Explorar</span>  
                    </div>

                    <!-- Elemento del menú: Antojar (escribir reseñas) -->
                    <div class="menu-item" data-route="/antojar">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNBQUFCNTQiIGQ9Ik0xOC4yOTMgMTcuMjkzYTEgMSAwIDAgMSAxLjQ5OCAxLjMybC0uMDg0LjA5NGwtMS41IDEuNWEzLjEyIDMuMTIgMCAwIDEtNC40MTQgMGExLjEyIDEuMTIgMCAwIDAtMS40ODgtLjA4N2wtLjA5OC4wODdsLS41LjVhMSAxIDAgMCAxLTEuNDk3LTEuMzJsLjA4My0uMDk0bC41LS41YTMuMTIgMy4xMiAwIDAgMSA0LjQxNCAwYTEuMTIgMS4xMiAwIDAgMCAxLjQ4OC4wODdsLjA5OC0uMDg3em0tMS44MS0xMy4zMWEyLjUgMi41IDAgMCAxIDMuNjU3IDMuNDA1bC0uMTIyLjEzMUw4LjQ0MyAxOS4wOTRhMS41IDEuNSAwIDAgMS0uNTA2LjMzM2wtLjE0NS4wNWwtMi44MzcuODA3YTEgMSAwIDAgMS0xLjI2MS0xLjEzbC4wMjQtLjEwN2wuODA3LTIuODM4YTEuNSAxLjUgMCAwIDEgLjI4LS41MzdsLjEwMi0uMTEzem0yLjEyIDEuNDE1YS41LjUgMCAwIDAtLjYzNy0uMDU4bC0uMDcuMDU4TDYuNDE0IDE2Ljg4bC0uMjguOTg4bC45ODctLjI4TDE4LjYwNCA2LjEwNGEuNS41IDAgMCAwIDAtLjcwNyIvPjwvZz48L3N2Zz4=" class="menu-icon" alt="Antojar">
                        <span class="menu-text">Antojar</span>
                    </div>

                    <!-- Elemento del menú: Configuración -->
                    <div class="menu-item" data-route="/configurations">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2YS41LjUgMCAwIDAtLjYxLS4yMmwtMi40OSAxYy0uNTItLjQtMS4wOC0uNzMtMS42OS0uOThsLS4zOC0yLjY1QS40OS40OSAwIDAgMCAxNCAyaC00Yy0uMjUgMC0uNDYuMTgtLjQ5LjQybC0uMzggMi42NWMtLjYxLjI1LTEuMTcuNTktMS42OS45OGwtMi40OS0xYS42LjYgMCAwIDAtLjE4LS4wM2MtLjE3IDAtLjM0LjA5LS40My4yNWwtMiAzLjQ2Yy0uMTMuMjItLjA3LjQ5LjEyLjY0bDIuMTEgMS42NWMtLjA0LjMyLS4wNy42NS0uMDcuOThzLjAzLjY2LjA3Ljk4bC0yLjExIDEuNjVjLS4xOS4xNS0uMjQuNDItLjEyLjY0bDIgMy40NmEuNS41IDAgMCAwIC42MS4yMmwyLjQ5LTFjLjUyLjQgMS4wOC43MyAxLjY5Ljk4bC4zOCAyLjY1Yy4wMy4yNC4yNC40Mi40OS40Mmg0Yy4yNSAwIC40Ni0uMTguNDktLjQybC4zOC0yLjY1Yy42MS0uMjUgMS4xNy0uNTkgMS42OS0uOThsMi40OSAxcS4wOS4wMy4xOC4wM2MuMTcgMCAuMzQtLjA5LjQzLS4yNWwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NHptLTEuOTgtMS43MWMuMDQuMzEuMDUuNTIuMDUuNzNzLS4wMi40My0uMDUuNzNsLS4xNCAxLjEzbC44OS43bDEuMDguODRsLS43IDEuMjFsLTEuMjctLjUxbC0xLjA0LS40MmwtLjkuNjhjLS40My4zMi0uODQuNTYtMS4yNS43M2wtMS4wNi40M2wtLjE2IDEuMTNsLS4yIDEuMzVoLTEuNGwtLjE5LTEuMzVsLS4xNi0xLjEzbC0xLjA2LS40M2MtLjQzLS4xOC0uODMtLjQxLTEuMjMtLjcxbC0uOTEtLjdsLTEuMDYuNDNsLTEuMjcuNTFsLS43LTEuMjFsMS4wOC0uODRsLjg5LS43bC0uMTQtMS4xM2MtLjAzLS4zMS0uMDUtLjU0LS4wNS0uNzRzLjAyLS40My4wNS0uNzNsLjE0LTEuMTNsLS44OS0uN2wtMS4wOC0uODRsLjctMS4yMWwxLjI3LjUxbDEuMDQuNDJsLjktLjY4Yy40My0uMzIuODQtLjU2IDEuMjUtLjczbDEuMDYtLjQzbC4xNi0xLjEzbC4yLTEuMzVoMS4zOWwuMTkgMS4zNWwuMTYgMS4xM2wxLjA2LjQzYy40My4xOC44My40MSAxLjIzLjcxbC45MS43bDEuMDYtLjQzbDEuMjctLjUxbC43IDEuMjFsLTEuMDcuODVsLS44OS43ek0xMiA4Yy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0czQtMS43OSA0LTRzLTEuNzktNC00LTRtMCA2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMnMyIC45IDIgMnMtLjkgMi0yIDIiLz48L3N2Zz4=" class="menu-icon" alt="Configuración">
                        <span class="menu-text">Configuración</span>
                    </div>

                    <!-- Elemento del menú: Perfil -->
                    <div class="menu-item" data-route="/profile">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNCAxOGE0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMloiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjMiLz48L2c+PC9zdmc+" class="menu-icon" alt="Perfil">
                        <span class="menu-text">Perfil</span>
                    </div>
                </div>
            `;
        }
    }
    
    // Se ejecuta cuando el componente se conecta al DOM (cuando aparece en la página)
    connectedCallback(): void {
        console.log(' LuladaSidebar: Componente conectado');
        this.setupNavigation(); // Configurar los eventos de navegación
        this.updateActiveState(); // Actualizar qué elemento está activo
    }
    
    // Se ejecuta cuando el componente se desconecta del DOM (cuando se quita de la página)
    disconnectedCallback(): void {
        console.log(' LuladaSidebar: Componente desconectado');
    }
    
    // Actualizar qué elemento del menú está activo basándose en la URL actual
    private updateActiveState(): void {
        const currentPath = window.location.pathname; // Obtener la ruta actual de la URL
        this.setActiveItem(currentPath); // Marcar como activo el elemento correspondiente
    }
    
    // Marcar un elemento específico del menú como activo
    private setActiveItem(route: string): void {
        if (!this.shadowRoot) return; // Si no hay shadow DOM, no hacer nada
        
        this.currentActiveRoute = route; // Guardar la ruta activa actual
        const menuItems = this.shadowRoot.querySelectorAll('.menu-item'); // Obtener todos los elementos del menú
        
        // Recorrer todos los elementos del menú
        menuItems.forEach(item => {
            const itemRoute = item.getAttribute('data-route'); // Obtener la ruta de cada elemento
            // Si la ruta coincide con la ruta actual, marcarlo como activo
            if (itemRoute === route || (route === '/' && itemRoute === '/home')) {
                item.classList.add('active'); // Agregar clase 'active'
            } else {
                item.classList.remove('active'); // Quitar clase 'active'
            }
        });
        
        console.log(` LuladaSidebar: Item activo establecido: ${route}`);
    }
    
    // Configurar todos los eventos de navegación del sidebar
    setupNavigation() {
        console.log(' LuladaSidebar: Configurando navegación...');
        
        // Verificar que el shadow DOM existe
        if (!this.shadowRoot) {
            console.error(' LuladaSidebar: No hay shadowRoot');
            return;
        }
        
        // Obtener todos los elementos del menú
        const menuItems = this.shadowRoot.querySelectorAll(".menu-item");
        console.log(` LuladaSidebar: Encontrados ${menuItems.length} elementos de menú`);
        
        // Agregar evento de click a cada elemento del menú
        menuItems.forEach((menuItem, index) => {
            const route = menuItem.getAttribute("data-route"); // Obtener la ruta del elemento
            console.log(` LuladaSidebar: Configurando item ${index}: ${route}`);
            
            // Agregar evento de click
            menuItem.addEventListener("click", () => {
                console.log(` LuladaSidebar: Click en menú: ${route}`);
                
                if (route) {
                    // Actualizar estado visual inmediatamente
                    this.setActiveItem(route);
                    
                    // Caso especial para "antojar" - abrir popup en lugar de navegar
                    if (route === "/antojar") {
                        console.log(' LuladaSidebar: Abriendo popup de antojar...');
                        this.handleAntojarClick();
                    } else {
                        // Para otras rutas, navegar normalmente
                        console.log(` LuladaSidebar: Navegando a: ${route}`);
                        this.navigate(route);
                    }
                } else {
                    console.warn(' LuladaSidebar: No hay ruta definida para este item');
                }
            });
        });
        
        console.log(' LuladaSidebar: Navegación configurada');
    }

    // Manejar el click en el botón "Antojar" (escribir reseña)
    private handleAntojarClick(): void {
        try {
            // Obtener el servicio de popup de antojar del objeto global window
            const antojarService = window.AntojarPopupService;
            if (antojarService) {
                // Mostrar el popup para escribir una reseña
                antojarService.getInstance().showPopup();
                console.log(' LuladaSidebar: Popup de antojar abierto');
            } else {
                // Si el servicio no está disponible, mostrar error
                console.error(" AntojarPopupService no disponible");
                alert("Esta función no está disponible en este momento");
            }
        } catch (error) {
            console.error("Error con popup antojar:", error);
        }
    }
    
    // Navegar a una ruta específica
    navigate(route: string): void {
        console.log(` LuladaSidebar: Creando evento de navegación para: ${route}`);
        
        // Crear un evento personalizado para notificar que se quiere navegar
        const event = new CustomEvent("navigate", { 
            detail: route, // La ruta a la que se quiere navegar
            bubbles: true, // El evento puede "burbujear" hacia arriba en el DOM
            composed: true // El evento puede salir del shadow DOM
        });
        
        // Enviar el evento globalmente para que otros componentes lo escuchen
        document.dispatchEvent(event);
        console.log(` LuladaSidebar: Evento enviado para: ${route}`);
        
        // También actualizar la URL del navegador si es posible
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', route);
        }
    }
    
    // Método público para actualizar el estado activo desde fuera del componente
    public updateActive(route: string): void {
        this.setActiveItem(route);
    }
    
    // Método público para hacer debugging de la navegación
    public debugNavigation(): void {
        console.log(' LuladaSidebar Debug:');
        console.log('- Ruta activa actual:', this.currentActiveRoute);
        console.log('- Shadow DOM disponible:', !!this.shadowRoot);
        
        // Mostrar información de todos los elementos del menú
        const menuItems = this.shadowRoot?.querySelectorAll('.menu-item');
        console.log('- Items de menú:');
        menuItems?.forEach((item, index) => {
            const route = item.getAttribute('data-route');
            const isActive = item.classList.contains('active');
            console.log(`  ${index}: ${route} - ${isActive ? 'Activo' : 'Inactivo'}`);
        });
    }
}

// Exponer función de debugging globalmente para poder usarla desde la consola del navegador
if (typeof window !== 'undefined') {
    // Solo crear la función si no existe ya
    if (!window.debugSidebar) {
        window.debugSidebar = () => {
            // Buscar el componente sidebar en la página
            const sidebar = document.querySelector('lulada-sidebar') as LuladaSidebarElement | null;
            if (sidebar && typeof sidebar.debugNavigation === 'function') {
                sidebar.debugNavigation(); // Llamar al método de debug
            } else {
                console.log(' Sidebar no encontrado o sin método debug');
            }
        };
    }
}

// Exportar la clase para que pueda ser usada en otros archivos
export default LuladaSidebar;