// src/Components/LoadPages/LoadPage.ts - VERSIÓN CORREGIDA SIN ANY Y TOTALMENTE FUNCIONAL

// Interfaces para tipos seguros
interface LoadPageElement extends HTMLElement {
    getCurrentRoute(): string;
    navigateTo(route: string): void;
    debugInfo(): void;
    isComponentRegistered(componentName: string): boolean;
}

interface NavigationComponent extends HTMLElement {
    updateActive?(route: string): void;
    updateActiveFromRoute?(route: string): void;
}

class LoadPage extends HTMLElement implements LoadPageElement {
    private isSetup = false; // Para evitar múltiples configuraciones
    private currentRoute = '/';
    
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        console.log('🔧 LoadPage: Constructor ejecutado');
    }

    connectedCallback(){
        console.log('🔧 LoadPage: ConnectedCallback ejecutado');
        this.render();
        if (!this.isSetup) {
            this.setupNavigation();
            this.isSetup = true;
        }
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
            const customEvent = event as CustomEvent<string>;
            const route = customEvent.detail;
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
                
                /* Estilos para componentes que fallan al cargar */
                .component-error {
                    padding: 40px;
                    text-align: center;
                    background: white;
                    margin: 20px;
                    border-radius: 10px;
                    border: 2px dashed #ff6b6b;
                    color: #d63031;
                }
                
                .loading {
                    padding: 40px;
                    text-align: center;
                    background: white;
                    margin: 20px;
                    border-radius: 10px;
                    color: #666;
                }

                .fallback-content {
                    padding: 40px;
                    text-align: center;
                    background-color: white;
                    border-radius: 10px;
                    margin: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .fallback-content h1 {
                    color: #AAAB54;
                    margin-bottom: 20px;
                }

                .fallback-content p {
                    color: #666;
                    line-height: 1.6;
                }

                .error-button {
                    background: #AAAB54;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
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
        
        // Limpiar la ruta
        const cleanRoute = route.startsWith('/') ? route : '/' + route;
        this.currentRoute = cleanRoute;
        console.log('🧹 LoadPage: Ruta limpia:', cleanRoute);
        
        // Mapeo completo de rutas a componentes con verificación
        const routeComponentMap: { [key: string]: string } = {
            '/': '<lulada-home></lulada-home>',
            '/home': '<lulada-home></lulada-home>',
            '/notifications': '<lulada-notifications></lulada-notifications>',
            '/save': '<save-page></save-page>',
            '/explore': '<lulada-explore></lulada-explore>',
            '/configurations': '<lulada-settings></lulada-settings>',
            '/profile': '<puser-page></puser-page>',
            '/cambiar-correo': '<lulada-cambiar-correo></lulada-cambiar-correo>',
            '/cambiar-nombre': '<lulada-cambiar-nombre></lulada-cambiar-nombre>',
            '/cambiar-contraseña': '<lulada-cambiar-contraseña></lulada-cambiar-contraseña>',
            '/login': '<login-page></login-page>',
            '/register': '<register-new-account></register-new-account>'
        };
        
        // Obtener el componente para la ruta
        let newComponent = routeComponentMap[cleanRoute];
        let componentName = '';
        
        if (!newComponent) {
            console.warn('⚠️ LoadPage: Ruta no reconocida:', cleanRoute, '- Mostrando home');
            newComponent = '<lulada-home></lulada-home>';
            componentName = 'lulada-home';
        } else {
            // Extraer el nombre del componente
            const match = newComponent.match(/<([^>\s]+)/);
            componentName = match ? match[1] : '';
        }
        
        // Verificar si el componente está registrado
        if (componentName && !this.isComponentRegistered(componentName)) {
            console.error(`❌ LoadPage: Componente ${componentName} no está registrado`);
            this.showComponentError(cleanRoute, componentName);
            return;
        }
        
        // Buscar el elemento <main> y actualizar su contenido
        const main = this.shadowRoot.querySelector('main');
        if (main) {
            console.log('✅ LoadPage: Cargando componente:', componentName);
            
            // Mostrar estado de carga
            main.innerHTML = '<div class="loading">Cargando...</div>';
            
            // Pequeño delay para mejor UX
            setTimeout(() => {
                main.innerHTML = newComponent;
                
                // Verificar que el componente se haya cargado correctamente
                setTimeout(() => {
                    const loadedComponent = main.querySelector('*');
                    if (loadedComponent) {
                        console.log('✅ LoadPage: Componente cargado exitosamente:', loadedComponent.tagName.toLowerCase());
                        
                        // Verificar si el componente tiene contenido
                        if (loadedComponent.shadowRoot || loadedComponent.innerHTML.trim()) {
                            console.log('✅ LoadPage: Componente tiene contenido');
                        } else {
                            console.warn('⚠️ LoadPage: Componente cargado pero sin contenido visible');
                            
                            // Dar un poco más de tiempo para componentes que cargan de forma asíncrona
                            setTimeout(() => {
                                if (!loadedComponent.shadowRoot && !loadedComponent.innerHTML.trim()) {
                                    console.error('❌ LoadPage: Componente sin contenido después de espera adicional');
                                    this.showComponentError(cleanRoute, componentName);
                                }
                            }, 1000);
                        }
                    } else {
                        console.error('❌ LoadPage: El componente no se cargó correctamente');
                        this.showComponentError(cleanRoute, componentName);
                    }
                }, 100);
            }, 50);
        } else {
            console.error('❌ LoadPage: No se encontró el elemento main');
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Actualizar URL sin recargar la página
        if (window.history && window.history.pushState && window.location.pathname !== cleanRoute) {
            window.history.pushState(null, '', cleanRoute);
            console.log('🌐 LoadPage: URL actualizada a:', cleanRoute);
        }
        
        // Actualizar componentes de navegación
        this.updateNavigationComponents(cleanRoute);
    }

    private showComponentError(route: string, componentName: string): void {
        const main = this.shadowRoot?.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="component-error">
                    <h2>❌ Error de Navegación</h2>
                    <p><strong>Ruta solicitada:</strong> ${route}</p>
                    <p><strong>Componente:</strong> ${componentName}</p>
                    <p><strong>Estado:</strong> ${this.isComponentRegistered(componentName) ? 'Registrado pero falló al cargar' : 'No registrado'}</p>
                    <button class="error-button" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: '/home'}))">
                        🏠 Volver al Inicio
                    </button>
                    <button class="error-button" onclick="window.debugNav?.completo()" style="margin-left: 10px;">
                        🔧 Debug Info
                    </button>
                </div>
            `;
        }
    }
    
    private updateNavigationComponents(route: string): void {
        console.log('🔄 LoadPage: Actualizando componentes de navegación para:', route);
        
        // Actualizar sidebar si existe
        const sidebar = document.querySelector('lulada-sidebar') as NavigationComponent | null;
        if (sidebar && typeof sidebar.updateActive === 'function') {
            sidebar.updateActive(route);
            console.log('✅ LoadPage: Sidebar actualizado');
        }
        
        // Actualizar responsive bar si existe  
        const responsiveBar = document.querySelector('lulada-responsive-bar') as NavigationComponent | null;
        if (responsiveBar && typeof responsiveBar.updateActiveFromRoute === 'function') {
            responsiveBar.updateActiveFromRoute(route);
            console.log('✅ LoadPage: ResponsiveBar actualizado');
        }
    }

    // Método público para debugging
    public getCurrentRoute(): string {
        return this.currentRoute;
    }

    // Método público para navegación programática
    public navigateTo(route: string): void {
        console.log('🚀 LoadPage: Navegación programática a:', route);
        this.updateView(route);
    }
    
    // Método público para verificar si un componente está registrado
    public isComponentRegistered(componentName: string): boolean {
        return !!customElements.get(componentName);
    }
    
    // Método público para debug completo
    public debugInfo(): void {
        console.log('🔍 LoadPage Debug Info:');
        console.log('- Ruta actual:', this.getCurrentRoute());
        console.log('- URL actual:', window.location.pathname);
        console.log('- Setup completado:', this.isSetup);
        console.log('- Shadow DOM:', !!this.shadowRoot);
        
        const main = this.shadowRoot?.querySelector('main');
        const currentComponent = main?.querySelector('*');
        console.log('- Componente cargado:', currentComponent?.tagName.toLowerCase() || 'ninguno');
        
        const componentes = [
            'lulada-home',
            'lulada-notifications', 
            'save-page',
            'lulada-explore',
            'lulada-settings',
            'puser-page',
            'lulada-cambiar-correo',
            'lulada-cambiar-nombre',
            'lulada-cambiar-contraseña'
        ];
        
        console.log('- Componentes críticos:');
        componentes.forEach(name => {
            const registered = this.isComponentRegistered(name);
            const inDOM = !!document.querySelector(name);
            console.log(`  ${registered ? '✅' : '❌'} ${name}: ${registered ? 'Registrado' : 'NO Registrado'} | ${inDOM ? 'En DOM' : 'NO en DOM'}`);
        });
        
        // Debug de navegación
        console.log('- Componentes de navegación:');
        const sidebar = document.querySelector('lulada-sidebar');
        const responsiveBar = document.querySelector('lulada-responsive-bar');
        console.log(`  Sidebar: ${sidebar ? 'Encontrado' : 'NO encontrado'}`);
        console.log(`  ResponsiveBar: ${responsiveBar ? 'Encontrado' : 'NO encontrado'}`);
    }

    // Método público para forzar actualización
    public forceUpdate(): void {
        console.log('🔄 LoadPage: Forzando actualización...');
        this.updateView(this.currentRoute);
    }

    // Método público para verificar estado del sistema
    public healthCheck(): { [key: string]: boolean } {
        return {
            shadowRootExists: !!this.shadowRoot,
            isSetup: this.isSetup,
            mainElementExists: !!this.shadowRoot?.querySelector('main'),
            navigationConfigured: this.isSetup,
            currentRouteSet: this.currentRoute !== '',
            homeComponentRegistered: this.isComponentRegistered('lulada-home'),
            notificationsComponentRegistered: this.isComponentRegistered('lulada-notifications'),
            settingsComponentRegistered: this.isComponentRegistered('lulada-settings'),
            exploreComponentRegistered: this.isComponentRegistered('lulada-explore'),
            profileComponentRegistered: this.isComponentRegistered('puser-page'),
            saveComponentRegistered: this.isComponentRegistered('save-page')
        };
    }
}

// Exponer para debugging
if (typeof window !== 'undefined') {
    if (!window.debugLoadPage) {
        window.debugLoadPage = () => {
            const loadPage = document.querySelector('load-pages') as LoadPageElement | null;
            if (loadPage && typeof loadPage.debugInfo === 'function') {
                loadPage.debugInfo();
            } else {
                console.log('❌ No se encontró el componente load-pages o no tiene método debugInfo');
            }
        };
    }
}

export default LoadPage;