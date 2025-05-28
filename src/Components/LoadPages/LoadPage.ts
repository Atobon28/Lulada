// src/Components/LoadPages/LoadPage.ts

class LoadPage extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        console.log('🔧 LoadPage: Constructor ejecutado');
    }

    connectedCallback(){
        console.log('🔧 LoadPage: ConnectedCallback ejecutado');
        this.render();
        this.setupNavigation();
    }

    private setupNavigation(){
        console.log('🔧 LoadPage: Configurando navegación...');
        
        // Escuchar los clicks dentro del componente
        this.shadowRoot!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href) {
                e.preventDefault();
                console.log('🔧 LoadPage: Link interceptado:', link.href);
            }
        });

        // Escuchar evento global (navigate) 
        document.addEventListener('navigate', (event: Event) => {
            const route = (event as CustomEvent).detail;
            console.log('🎯 LoadPage: Recibido evento de navegación:', route);
            this.updateView(route);
        });

        // Manejar navegación del navegador (botón atrás/adelante)
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            console.log('🔙 LoadPage: Navegación del navegador:', currentPath);
            this.updateView(currentPath);
        });

        console.log('✅ LoadPage: Navegación configurada');
    }

    render(){
        console.log('🎨 LoadPage: Renderizando...');
        
        if (!this.shadowRoot) {
            console.error('❌ LoadPage: No hay shadowRoot disponible');
            return;
        }

        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .app-container {
                    width: 100%;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                main {
                    width: 100%;
                    min-height: 100vh;
                    display: block;
                }
            </style>
            
            <div class="app-container">
                <main>
                    <lulada-home></lulada-home>
                </main>
            </div>
        `;
        
        console.log('✅ LoadPage: Renderizado completado');
    }

    updateView(route: string){
        console.log('🔄 LoadPage: Actualizando vista a:', route);
        
        if (!this.shadowRoot) {
            console.error('❌ LoadPage: No hay shadowRoot para actualizar');
            return;
        }
        
        // Actualizar el componente dependiendo de la ruta
        let newComponent = "";
        
        // Cambiar el componente dependiendo de la ruta
        switch(route) {
            case "/home":
            case "/":
                newComponent = `<lulada-home></lulada-home>`;
                break;
            case "/notifications":
                newComponent = `<lulada-notifications></lulada-notifications>`;
                break;
            case "/save":
                newComponent = `<save-page></save-page>`;
                break;
            case "/explore":
                newComponent = `<lulada-explore></lulada-explore>`;
                break;
            case "/configurations":
                newComponent = `<lulada-settings></lulada-settings>`;
                break;
            case "/profile":
                newComponent = `<puser-page></puser-page>`;
                break;
            case "/cambiar-correo":
                newComponent = `<lulada-cambiar-correo></lulada-cambiar-correo>`;
                break;
            case "/cambiar-nombre":
                newComponent = `<lulada-cambiar-nombre></lulada-cambiar-nombre>`;
                break;
            case "/cambiar-contraseña":
                newComponent = `<lulada-cambiar-contraseña></lulada-cambiar-contraseña>`;
                break;
            case "/login":
                newComponent = `<login-page></login-page>`;
                break;
            case "/register":
                newComponent = `<register-new-account></register-new-account>`;
                break;
            default:
                console.warn('⚠️ LoadPage: Ruta no reconocida:', route, '- Mostrando home');
                newComponent = `<lulada-home></lulada-home>`;
        }
        
        // Buscar el elemento <main> y actualizar su contenido con el nuevo componente
        const main = this.shadowRoot.querySelector('main');
        if (main) {
            console.log('✅ LoadPage: Cargando componente:', newComponent.match(/<([^>]+)>/)?.[1] || 'unknown');
            main.innerHTML = newComponent;
            
            // Verificar que el componente se haya cargado
            const loadedComponent = main.querySelector('*');
            if (loadedComponent) {
                console.log('✅ LoadPage: Componente cargado exitosamente:', loadedComponent.tagName.toLowerCase());
            } else {
                console.warn('⚠️ LoadPage: El componente no se cargó correctamente');
            }
        } else {
            console.error('❌ LoadPage: No se encontró el elemento main');
        }
        
        // Para que la ventana al cambiarla aparezca siempre arriba
        window.scrollTo(0, 0);
    }

    // Método público para debugging
    public getCurrentRoute(): string {
        const main = this.shadowRoot?.querySelector('main');
        const currentComponent = main?.querySelector('*');
        return currentComponent?.tagName.toLowerCase() || 'none';
    }

    // Método público para navegación programática
    public navigateTo(route: string): void {
        console.log('🚀 LoadPage: Navegación programática a:', route);
        this.updateView(route);
        
        // Actualizar URL si es posible
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', route);
        }
    }
}

// Exponer para debugging
if (typeof window !== 'undefined') {
    // Solo asignar si no existe ya
    if (!window.debugLoadPage) {
        window.debugLoadPage = () => {
            const loadPage = document.querySelector('load-pages') as LoadPage;
            if (loadPage) {
                console.log('LoadPage actual:', loadPage.getCurrentRoute());
            } else {
                console.log('No se encontró el componente load-pages');
            }
        };
    }
}

export default LoadPage;