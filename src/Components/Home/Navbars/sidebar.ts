// src/Components/Home/Navbars/sidebar.ts - VERSIÓN SIN ANY Y COMPLETAMENTE FUNCIONAL

// Definir interfaces para tipos seguros
interface LuladaSidebarElement extends HTMLElement {
    updateActive(route: string): void;
    debugNavigation(): void;
}

interface AntojarServiceInstance {
    initialize(): void;
    showPopup(): void;
    hidePopup?(): void;
}

interface AntojarService {
    getInstance(): AntojarServiceInstance;
}

// Extender Window para tipos seguros
declare global {
    interface Window {
        AntojarPopupService?: AntojarService;
        debugSidebar?: () => void;
    }
}

class LuladaSidebar extends HTMLElement implements LuladaSidebarElement {
    private currentActiveRoute: string = '/home';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        width: 250px;
                        background-color: white;
                        border-right: 1px solid #e0e0e0;
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        align-items: center;
                    }
                    .sidebar-logo {
                        margin-bottom: 30px;
                        text-align: center;
                    }
                    .location-tags {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 20px;
                        font-size: 18px;
                        color: #AAAB54;
                    }
                    .menu-items {
                        width: 100%;
                    }
                    .menu-item {
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        cursor: pointer;
                        border-radius: 5px;
                        margin-bottom: 10px;
                        color: #AAAB54;
                        transition: all 0.2s ease;
                        user-select: none;
                    }
                    .menu-item:hover {
                        background-color: #f0f0f0;
                        transform: translateX(5px);
                    }
                    .menu-item.active {
                        background-color: rgba(170, 171, 84, 0.1);
                        border-left: 3px solid #AAAB54;
                        font-weight: bold;
                    }
                    .menu-icon {
                        margin-right: 10px;
                        width: 24px;
                        height: 24px;
                        transition: transform 0.2s ease;
                    }
                    .menu-item:hover .menu-icon {
                        transform: scale(1.1);
                    }
                    .menu-text {
                        font-size: 16px;
                    }
                </style>
                
                <div class="menu-items">
                    <div class="menu-item active" data-route="/home">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNiAxOWgzdi02aDZ2Nmgzdi05bC02LTQuNUw2IDEwem0tMiAyVjlsOC02bDggNnYxMmgtN3YtNmgtMnY2em04LTguNzUiLz48L3N2Zz4=" class="menu-icon" alt="Inicio">
                        <span class="menu-text">Inicio</span>
                    </div>

                    <div class="menu-item" data-route="/notifications">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAxOXEtLjQyNSAwLS43MTItLjI4OFQ0IDE4dC4yODgtLjcxMlQ1IDE3aDF2LTdxMC0yLjA3NSAxLjI1LTMuNjg3VDEwLjUgNC4ydi0uN3EwLS42MjUuNDM4LTEuMDYyVDEyIDJ0MS4wNjMuNDM4VDEzLjUgMy41di43cTIgLjUgMy4yNSAyLjExM1QxOCAxMHY3aDFxLjQyNSAwIC43MTMuMjg4VDIwIDE4dC0uMjg4LjcxM1QxOSAxOXptNyAzcS0uODI1IDAtMS40MTItLjU4N1QxMCAyMGg0cTAgLjgyNS0uNTg3IDEuNDEzVDEyIDIybS00LTVoOHYtN3EwLTEuNjUtMS4xNzUtMi44MjVUMTIgNlQ5LjE3NSA3LjE3NVQ4IDEweiIvPjwvc3ZnPg==" class="menu-icon" alt="Notificaciones">
                        <span class="menu-text">Notificaciones</span>
                    </div>

                    <div class="menu-item" data-route="/save">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAyMVY1cTAtLjgyNS41ODgtMS40MTJUNyAzaDEwcS44MjUgMCAxLjQxMy41ODhUMTkgNXYxNmwtNy0zem0yLTMuMDVsNS0yLjE1bDUgMi4xNVY1SDd6TTcgNWgxMHoiLz48L3N2Zz4=" class="menu-icon" alt="Guardado">
                        <span class="menu-text">Guardado</span>
                    </div>

                    <div class="menu-item" data-route="/explore">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iLTIuNSAtMi41IDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNOCAxNEE2IDYgMCAxIDAgOCAyYTYgNiAwIDAgMCAwIDEybTYuMzItMS4wOTRsMy41OCAzLjU4YTEgMSAwIDEgMS0xLjQxNSAxLjQxM2wtMy41OC0zLjU4YTggOCAwIDEgMSAxLjQxNC0xLjQxNHoiLz48L3N2Zz4=" class="menu-icon" alt="Explorar">
                        <span class="menu-text">Explorar</span>  
                    </div>

                    <div class="menu-item" data-route="/antojar">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNBQUFCNTQiIGQ9Ik0xOC4yOTMgMTcuMjkzYTEgMSAwIDAgMSAxLjQ5OCAxLjMybC0uMDg0LjA5NGwtMS41IDEuNWEzLjEyIDMuMTIgMCAwIDEtNC40MTQgMGExLjEyIDEuMTIgMCAwIDAtMS40ODgtLjA4N2wtLjA5OC4wODdsLS41LjVhMSAxIDAgMCAxLTEuNDk3LTEuMzJsLjA4My0uMDk0bC41LS41YTMuMTIgMy4xMiAwIDAgMSA0LjQxNCAwYTEuMTIgMS4xMiAwIDAgMCAxLjQ4OC4wODdsLjA5OC0uMDg3em0tMS44MS0xMy4zMWEyLjUgMi41IDAgMCAxIDMuNjU3IDMuNDA1bC0uMTIyLjEzMUw4LjQ0MyAxOS4wOTRhMS41IDEuNSAwIDAgMS0uNTA2LjMzM2wtLjE0NS4wNWwtMi44MzcuODA3YTEgMSAwIDAgMS0xLjI2MS0xLjEzbC4wMjQtLjEwN2wuODA3LTIuODM4YTEuNSAxLjUgMCAwIDEgLjI4LS41MzdsLjEwMi0uMTEzem0yLjEyIDEuNDE1YS41LjUgMCAwIDAtLjYzNy0uMDU4bC0uMDcuMDU4TDYuNDE0IDE2Ljg4bC0uMjguOTg4bC45ODctLjI4TDE4LjYwNCA2LjEwNGEuNS41IDAgMCAwIDAtLjcwNyIvPjwvZz48L3N2Zz4=" class="menu-icon" alt="Antojar">
                        <span class="menu-text">Antojar</span>
                    </div>

                    <div class="menu-item" data-route="/configurations">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2YS41LjUgMCAwIDAtLjYxLS4yMmwtMi40OSAxYy0uNTItLjQtMS4wOC0uNzMtMS42OS0uOThsLS4zOC0yLjY1QS40OS40OSAwIDAgMCAxNCAyaC00Yy0uMjUgMC0uNDYuMTgtLjQ5LjQybC0uMzggMi42NWMtLjYxLjI1LTEuMTcuNTktMS42OS45OGwtMi40OS0xYS42LjYgMCAwIDAtLjE4LS4wM2MtLjE3IDAtLjM0LjA5LS40My4yNWwtMiAzLjQ2Yy0uMTMuMjItLjA3LjQ5LjEyLjY0bDIuMTEgMS42NWMtLjA0LjMyLS4wNy42NS0uMDcuOThzLjAzLjY2LjA3Ljk4bC0yLjExIDEuNjVjLS4xOS4xNS0uMjQuNDItLjEyLjY0bDIgMy40NmEuNS41IDAgMCAwIC42MS4yMmwyLjQ5LTFjLjUyLjQgMS4wOC43MyAxLjY5Ljk4bC4zOCAyLjY1Yy4wMy4yNC4yNC40Mi40OS40Mmg0Yy4yNSAwIC40Ni0uMTguNDktLjQybC4zOC0yLjY1Yy42MS0uMjUgMS4xNy0uNTkgMS42OS0uOThsMi40OSAxcS4wOS4wMy4xOC4wM2MuMTcgMCAuMzQtLjA5LjQzLS4yNWwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NHptLTEuOTgtMS43MWMuMDQuMzEuMDUuNTIuMDUuNzNzLS4wMi40My0uMDUuNzNsLS4xNCAxLjEzbC44OS43bDEuMDguODRsLS43IDEuMjFsLTEuMjctLjUxbC0xLjA0LS40MmwtLjkuNjhjLS40My4zMi0uODQuNTYtMS4yNS43M2wtMS4wNi40M2wtLjE2IDEuMTNsLS4yIDEuMzVoLTEuNGwtLjE5LTEuMzVsLS4xNi0xLjEzbC0xLjA2LS40M2MtLjQzLS4xOC0uODMtLjQxLTEuMjMtLjcxbC0uOTEtLjdsLTEuMDYuNDNsLTEuMjcuNTFsLS43LTEuMjFsMS4wOC0uODRsLjg5LS43bC0uMTQtMS4xM2MtLjAzLS4zMS0uMDUtLjU0LS4wNS0uNzRzLjAyLS40My4wNS0uNzNsLjE0LTEuMTNsLS44OS0uN2wtMS4wOC0uODRsLjctMS4yMWwxLjI3LjUxbDEuMDQuNDJsLjktLjY4Yy40My0uMzIuODQtLjU2IDEuMjUtLjczbDEuMDYtLjQzbC4xNi0xLjEzbC4yLTEuMzVoMS4zOWwuMTkgMS4zNWwuMTYgMS4xM2wxLjA2LjQzYy40My4xOC44My40MSAxLjIzLjcxbC45MS43bDEuMDYtLjQzbDEuMjctLjUxbC43IDEuMjFsLTEuMDcuODVsLS44OS43ek0xMiA4Yy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0czQtMS43OSA0LTRzLTEuNzktNC00LTRtMCA2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMnMyIC45IDIgMnMtLjkgMi0yIDIiLz48L3N2Zz4=" class="menu-icon" alt="Configuración">
                        <span class="menu-text">Configuración</span>
                    </div>

                    <div class="menu-item" data-route="/profile">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNCAxOGE0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMloiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjMiLz48L2c+PC9zdmc+" class="menu-icon" alt="Perfil">
                        <span class="menu-text">Perfil</span>
                    </div>
                </div>
            `;
        }
    }
    
    connectedCallback(): void {
        console.log('🔗 LuladaSidebar: Componente conectado');
        this.setupNavigation();
        this.updateActiveState();
    }
    
    disconnectedCallback(): void {
        console.log('🔌 LuladaSidebar: Componente desconectado');
    }
    
    private updateActiveState(): void {
        const currentPath = window.location.pathname;
        this.setActiveItem(currentPath);
    }
    
    private setActiveItem(route: string): void {
        if (!this.shadowRoot) return;
        
        this.currentActiveRoute = route;
        const menuItems = this.shadowRoot.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const itemRoute = item.getAttribute('data-route');
            if (itemRoute === route || (route === '/' && itemRoute === '/home')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        console.log(`🔄 LuladaSidebar: Item activo establecido: ${route}`);
    }
    
    setupNavigation() {
        console.log('🔧 LuladaSidebar: Configurando navegación...');
        
        if (!this.shadowRoot) {
            console.error('❌ LuladaSidebar: No hay shadowRoot');
            return;
        }
        
        const menuItems = this.shadowRoot.querySelectorAll(".menu-item");
        console.log(`🔧 LuladaSidebar: Encontrados ${menuItems.length} elementos de menú`);
        
        menuItems.forEach((menuItem, index) => {
            const route = menuItem.getAttribute("data-route");
            console.log(`🔧 LuladaSidebar: Configurando item ${index}: ${route}`);
            
            menuItem.addEventListener("click", () => {
                console.log(`🎯 LuladaSidebar: Click en menú: ${route}`);
                
                if (route) {
                    // Actualizar estado visual inmediatamente
                    this.setActiveItem(route);
                    
                    // Caso especial para "antojar"
                    if (route === "/antojar") {
                        console.log('🎯 LuladaSidebar: Abriendo popup de antojar...');
                        this.handleAntojarClick();
                    } else {
                        // Para otras rutas, navegar normalmente
                        console.log(`🚀 LuladaSidebar: Navegando a: ${route}`);
                        this.navigate(route);
                    }
                } else {
                    console.warn('⚠️ LuladaSidebar: No hay ruta definida para este item');
                }
            });
        });
        
        console.log('✅ LuladaSidebar: Navegación configurada');
    }

    private handleAntojarClick(): void {
        try {
            const antojarService = window.AntojarPopupService;
            if (antojarService) {
                antojarService.getInstance().showPopup();
                console.log('✅ LuladaSidebar: Popup de antojar abierto');
            } else {
                console.error("❌ AntojarPopupService no disponible");
                alert("Esta función no está disponible en este momento");
            }
        } catch (error) {
            console.error("❌ Error con popup antojar:", error);
        }
    }
    
    navigate(route: string): void {
        console.log(`🚀 LuladaSidebar: Creando evento de navegación para: ${route}`);
        
        // Crear el evento personalizado
        const event = new CustomEvent("navigate", { 
            detail: route,
            bubbles: true,
            composed: true 
        });
        
        // Enviar el evento globalmente
        document.dispatchEvent(event);
        console.log(`✅ LuladaSidebar: Evento enviado para: ${route}`);
        
        // También actualizar URL si es posible
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', route);
        }
    }
    
    // Método público para actualizar el estado activo desde fuera
    public updateActive(route: string): void {
        this.setActiveItem(route);
    }
    
    // Método público para debugging
    public debugNavigation(): void {
        console.log('🔍 LuladaSidebar Debug:');
        console.log('- Ruta activa actual:', this.currentActiveRoute);
        console.log('- Shadow DOM disponible:', !!this.shadowRoot);
        
        const menuItems = this.shadowRoot?.querySelectorAll('.menu-item');
        console.log('- Items de menú:');
        menuItems?.forEach((item, index) => {
            const route = item.getAttribute('data-route');
            const isActive = item.classList.contains('active');
            console.log(`  ${index}: ${route} - ${isActive ? 'Activo' : 'Inactivo'}`);
        });
    }
}

// Exponer para debugging con tipos seguros
if (typeof window !== 'undefined') {
    if (!window.debugSidebar) {
        window.debugSidebar = () => {
            const sidebar = document.querySelector('lulada-sidebar') as LuladaSidebarElement | null;
            if (sidebar && typeof sidebar.debugNavigation === 'function') {
                sidebar.debugNavigation();
            } else {
                console.log('❌ Sidebar no encontrado o sin método debug');
            }
        };
    }
}

export default LuladaSidebar;