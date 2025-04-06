class LuladaSidebar extends HTMLElement {
    shadowRoot: ShadowRoot;

    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
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
                    color: #666;
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
                }
                .menu-item:hover {
                    background-color: #f0f0f0;
                }
                .menu-icon {
                    margin-right: 10px;
                    width: 24px;
                    height: 24px;
                }
            </style>
            <div class="menu-items">
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Inicio">
                    <span>Inicio</span>
                </div>
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Notificaciones">
                    <span>Notificaciones</span>
                </div>
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Guardado">
                    <span>Guardado</span>
                </div>
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Explorar">
                    <span>Explorar</span>
                </div>
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Antojar">
                    <span>Antojar</span>
                </div>
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Configuración">
                    <span>Configuración</span>
                </div>
                <div class="menu-item">
                    <img src="" class="menu-icon" alt="Perfil">
                    <span>Perfil</span>
                </div>
            </div>
        `;

        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
    }

    connectedCallback(): void {
        this.setupEventListeners();
    }

    disconnectedCallback(): void {
        this.removeEventListeners();
    }

    setupEventListeners(): void {
        const menuItems: NodeListOf<HTMLElement> = this.shadowRoot.querySelectorAll('.menu-item');
        menuItems.forEach((item: HTMLElement) => {
            item.addEventListener('click', this.handleMenuItemClick);
        });
    }

    removeEventListeners(): void {
        const menuItems: NodeListOf<HTMLElement> = this.shadowRoot.querySelectorAll('.menu-item');
        menuItems.forEach((item: HTMLElement) => {
            item.removeEventListener('click', this.handleMenuItemClick);
        });
    }

    handleMenuItemClick(event: Event): void {
        const menuItem = event.currentTarget as HTMLElement;
        const menuText = menuItem.querySelector('span')?.textContent || '';
        
        const customEvent = new CustomEvent('menuselect', {
            bubbles: true,
            composed: true,
            detail: {
                menuItem: menuText
            }
        });
        
        this.dispatchEvent(customEvent);
    }
}

customElements.define('lulada-sidebar', LuladaSidebar);

export default LuladaSidebar;