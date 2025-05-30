// Interface para el elemento de navegación
interface NavigationElement extends HTMLElement {
    setActiveItem(nav: string): void;
    detectCurrentPage(): void;
    updateActiveFromRoute(route: string): void;
}

// Barra de navegación responsiva
export class NavigationBar extends HTMLElement implements NavigationElement {
    private currentActive: string = 'home';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-color: #fff;
                        border-top: 1px solid #e0e0e0;
                        padding: 15px 0;
                        width: 100%;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    .container-navbar {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        width: 100%;
                        max-width: 350px;
                        margin: 0 auto;
                    }
                    
                    .nav-item {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                        padding: 12px;
                        color: #AAAB54;
                        transition: all 0.2s ease;
                        border-radius: 12px;
                        min-width: 48px;
                        min-height: 48px;
                        opacity: 0.6;
                    }

                    .nav-item:hover {
                        color: #74753a;
                        background-color: rgba(170, 171, 84, 0.1);
                        transform: translateY(-2px);
                        opacity: 0.9;
                    }

                    .nav-item.active {
                        color: #74753a;
                        background-color: rgba(170, 171, 84, 0.15);
                        opacity: 1;
                        transform: scale(1.05);
                    }

                    .nav-icon {
                        width: 28px;
                        height: 28px;
                        transition: transform 0.2s ease;
                    }
                    
                    .nav-item:hover .nav-icon {
                        transform: scale(1.1);
                    }
                </style>

                <div class="container-navbar">
                    <div class="nav-item ${this.currentActive === 'home' ? 'active' : ''}" data-nav="home" data-route="/home">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNiAxOWgzdi02aDZ2Nmgzdi05bC02LTQuNUw2IDEwem0tMiAyVjlsOC02bDggNnYxMmgtN3YtNmgtMnY2em04LTguNzUiLz48L3N2Zz4=" class="nav-icon" alt="Inicio">
                    </div>

                    <div class="nav-item ${this.currentActive === 'explore' ? 'active' : ''}" data-nav="explore" data-route="/explore">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMyAxMGE3IDcgMCAxIDAgMTQgMGE3IDcgMCAxIDAtMTQgMG0xOCAxMWwtNi02Ii8+PC9zdmc+" class="nav-icon" alt="Explorar">
                    </div>

                    <div class="nav-item ${this.currentActive === 'antojar' ? 'active' : ''}" data-nav="antojar" data-route="/antojar">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNBQUFCNTQiIGQ9Ik0xOC4yOTMgMTcuMjkzYTEgMSAwIDAgMSAxLjQ5OCAxLjMybC0uMDg0LjA5NGwtMS41IDEuNWEzLjEyIDMuMTIgMCAwIDEtNC40MTQgMGExLjEyIDEuMTIgMCAwIDAtMS40ODgtLjA4N2wtLjA5OC4wODdsLS41LjVhMSAxIDAgMCAxLTEuNDk3LTEuMzJsLjA4My0uMDk0bC41LS41YTMuMTIgMy4xMiAwIDAgMSA0LjQxNCAwYTEuMTIgMS4xMiAwIDAgMCAxLjQ4OC4wODdsLjA5OC0uMDg3em0tMS44MS0xMy4zMWEyLjUgMi41IDAgMCAxIDMuNjU3IDMuNDA1bC0uMTIyLjEzMUw4LjQ0MyAxOS4wOTRhMS41IDEuNSAwIDAgMS0uNTA2LjMzM2wtLjE0NS4wNWwtMi44MzcuODA3YTEgMSAwIDAgMS0xLjI2MS0xLjEzbC4wMjQtLjEwN2wuODA3LTIuODM4YTEuNSAxLjUgMCAwIDEgLjI4LS41MzdsLjEwMi0uMTEzem0yLjEyIDEuNDE1YS41LjUgMCAwIDAtLjYzNy0uMDU4bC0uMDcuMDU4TDYuNDE0IDE2Ljg4bC0uMjguOTg4bC45ODctLjI4TDE4LjYwNCA2LjEwNGEuNS41IDAgMCAwIDAtLjcwNyIvPjwvZz48L3N2Zz4=" class="nav-icon" alt="Antojar">
                    </div>

                    <div class="nav-item ${this.currentActive === 'save' ? 'active' : ''}" data-nav="save" data-route="/save">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAyMVY1cTAtLjgyNS41ODgtMS40MTJUNyAzaDEwcS44MjUgMCAxLjQxMy41ODhUMTkgNXYxNmwtNy0zem0yLTMuMDVsNS0yLjE1bDUgMi4xNVY1SDd6TTcgNWgxMHoiLz48L3N2Zz4=" class="nav-icon" alt="Guardado">
                    </div>

                    <div class="nav-item ${this.currentActive === 'profile' ? 'active' : ''}" data-nav="profile" data-route="/profile">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNCAxOGE0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMloiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjMiLz48L2c+PC9zdmc+" class="nav-icon" alt="Perfil">
                    </div>
                </div>
            `;
            
            this.setupNavigation();
        }
    }

    // Se ejecuta cuando se conecta al DOM
    connectedCallback(): void {
        this.detectCurrentPage();
    }

    // Configurar eventos de click
    setupNavigation() {
        if (!this.shadowRoot) return;
        
        const navItems = this.shadowRoot.querySelectorAll(".nav-item");
        
        navItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                
                const route = item.getAttribute("data-route");
                const nav = item.getAttribute("data-nav");
                
                if (route && nav) {
                    this.setActiveItem(nav);
                    
                    // Caso especial para antojar - abre popup
                    if (route === "/antojar") {
                        this.handleAntojarClick();
                    } else {
                        this.navigate(route);
                    }
                }
            });
        });
    }

    // Manejar click en antojar - SIN DECLARACIÓN DE TIPOS DUPLICADA
    private handleAntojarClick(): void {
        try {
            if (window.AntojarPopupService) {
                window.AntojarPopupService.getInstance().showPopup();
            }
        } catch (error) {
            console.error("Error con popup antojar:", error);
        }
    }

    // Marcar botón como activo
    public setActiveItem(activeNav: string): void {
        this.currentActive = activeNav;
        
        if (!this.shadowRoot) return;
        
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach((item) => {
            const nav = item.getAttribute('data-nav');
            if (nav === activeNav) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Detectar página actual y marcar botón correspondiente
    public detectCurrentPage(): void {
        const currentPath = window.location.pathname;
        
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

    // Actualizar activo basado en ruta
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

    // Navegar a nueva página
    navigate(route: string): void {
        // Crear evento personalizado para navegación
        const event = new CustomEvent("navigate", { 
            detail: route,
            bubbles: true,
            composed: true
        });
        
        document.dispatchEvent(event);
        
        // Actualizar URL del navegador
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', route);
        }
    }
}

export default NavigationBar;