export class LuladaApp extends HTMLElement {
    constructor() {
        super();
        this.currentLocation = 'cali';
        this.currentPage = 'home';
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.shadowRoot.addEventListener('location-select', (e) => {
            const event = e;
            this.currentLocation = event.detail;
            this.render();
        });

        this.shadowRoot.addEventListener('menuselect', (e) => {
            const event = e;
            const menuItem = event.detail.menuItem.toLowerCase();
            
            const menuToPage = {
                'inicio': 'home',
                'explorar': 'explore',
                'guardado': 'saved',
                'perfil': 'profile',
                'configuración': 'settings'
            };
            
            if (menuToPage[menuItem]) {
                this.currentPage = menuToPage[menuItem];
                this.render();
            }
        });
    }

    render() {
        let pageContent = '';
        
        switch(this.currentPage) {
            case 'home':
                pageContent = `<lulada-home current-location="${this.currentLocation}"></lulada-home>`;
                break;
            case 'explore':
                pageContent = `<div>Explore Page (Not Implemented)</div>`;
                break;
            default:
                pageContent = `<lulada-home current-location="${this.currentLocation}"></lulada-home>`;
        }
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    font-family: Arial, sans-serif;
                }
            </style>
            
            ${pageContent}
        `;
    }
}

// Definición del componente LuladaHome
class LuladaHome extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['current-location'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'current-location' && oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const location = this.getAttribute('current-location') || 'cali';
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .location-selector {
                    margin-bottom: 20px;
                }
                .menu {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .menu-item {
                    cursor: pointer;
                    padding: 8px 16px;
                    background-color: #f0f0f0;
                    border-radius: 4px;
                }
                .menu-item:hover {
                    background-color: #e0e0e0;
                }
            </style>
            
            <div class="container">
                <div class="location-selector">
                    <select id="location">
                        <option value="cali" ${location === 'cali' ? 'selected' : ''}>Cali</option>
                        <option value="bogota" ${location === 'bogota' ? 'selected' : ''}>Bogotá</option>
                        <option value="medellin" ${location === 'medellin' ? 'selected' : ''}>Medellín</option>
                    </select>
                </div>
                
                <div class="menu">
                    <div class="menu-item" data-menu="inicio">Inicio</div>
                    <div class="menu-item" data-menu="explorar">Explorar</div>
                    <div class="menu-item" data-menu="guardado">Guardado</div>
                    <div class="menu-item" data-menu="perfil">Perfil</div>
                    <div class="menu-item" data-menu="configuración">Configuración</div>
                </div>
                
                <div class="content">
                    <h1>Bienvenido a Lulada - ${location.charAt(0).toUpperCase() + location.slice(1)}</h1>
                    <p>Esta es la página principal para ${location}.</p>
                </div>
            </div>
        `;
        
        // Agregar event listeners
        this.shadowRoot.querySelector('#location').addEventListener('change', (e) => {
            const newLocation = e.target.value;
            this.dispatchEvent(new CustomEvent('location-select', {
                bubbles: true,
                composed: true,
                detail: newLocation
            }));
        });
        
        this.shadowRoot.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const menuItem = e.target.dataset.menu;
                this.dispatchEvent(new CustomEvent('menuselect', {
                    bubbles: true,
                    composed: true,
                    detail: { menuItem }
                }));
            });
        });
    }
}

// Registrar los componentes
customElements.define('lulada-app', LuladaApp);
customElements.define('lulada-home', LuladaHome);