class LoadPage extends HTMLElement {
    declare shadowRoot: ShadowRoot;
    private isSetup: boolean = false;
    private currentRoute: string = '';
    private isAuthenticated: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.checkAuthentication();
    }

    connectedCallback(): void {
        // PREVENIR CONFIGURACIÓN MÚLTIPLE
        if (this.isSetup) {
            console.log('⚠️ LoadPage ya configurado, evitando duplicación');
            return;
        }

        console.log('📄 LoadPage conectando...');
        this.setupComponent();
        this.setupEventListeners();
        this.isSetup = true;
        
        // Navegar a la ruta inicial
        const initialRoute = this.getInitialRoute();
        this.navigateTo(initialRoute);
    }

    disconnectedCallback(): void {
        this.isSetup = false;
        console.log('📄 LoadPage desconectado');
    }

    private setupComponent(): void {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: 100%;
                    font-family: Arial, sans-serif;
                }
                
                main {
                    width: 100%;
                    height: 100%;
                    position: relative;
                }
                
                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    font-size: 1.1rem;
                    color: #666;
                }
                
                .error {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 2rem;
                    text-align: center;
                }
                
                .error-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    color: #dc3545;
                }
                
                .error-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    color: #333;
                }
                
                .error-message {
                    color: #666;
                    margin-bottom: 2rem;
                    max-width: 400px;
                    line-height: 1.5;
                }
                
                .retry-button {
                    background: #AAAB54;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background 0.3s ease;
                }
                
                .retry-button:hover {
                    background: #8B9B3A;
                }
            </style>
            
            <main>
                <div class="loading">Cargando...</div>
            </main>
        `;
    }

    private setupEventListeners(): void {
        // Escuchar eventos de navegación
        document.addEventListener('navigate', this.handleNavigateEvent.bind(this));
        
        // Escuchar cambios en el historial del navegador
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        console.log('👂 LoadPage event listeners configurados');
    }

    private handleNavigateEvent(event: Event): void {
        const customEvent = event as CustomEvent;
        const route = customEvent.detail;
        
        if (typeof route === 'string') {
            this.navigateTo(route);
        }
    }

    private handlePopState(event: PopStateEvent): void {
        const currentPath = window.location.pathname;
        this.navigateTo(currentPath);
    }

    private getInitialRoute(): string {
        const pathname = window.location.pathname;
        
        // Rutas válidas de la aplicación
        const validRoutes = [
            '/home', 
            '/profile', 
            '/puser', 
            '/explore', 
            '/antojar',
            '/save',
            '/settings',
            '/notifications',
            '/login'
        ];
        
        // Si la ruta actual es válida, usarla
        if (validRoutes.includes(pathname)) {
            return pathname;
        }
        
        // Si es la raíz, ir a home
        if (pathname === '/' || pathname === '') {
            return '/home';
        }
        
        // Por defecto, ir a home
        return '/home';
    }

    public navigateTo(route: string): void {
        if (!route || typeof route !== 'string') {
            console.error('❌ Ruta inválida:', route);
            return;
        }
        
        // Limpiar la ruta
        const cleanRoute = route.startsWith('/') ? route : `/${route}`;
        
        // Evitar navegación redundante
        if (cleanRoute === this.currentRoute) {
            console.log('⚠️ Ya estás en la ruta:', cleanRoute);
            return;
        }
        
        console.log(`🧭 Navegando de ${this.currentRoute} a ${cleanRoute}`);
        this.currentRoute = cleanRoute;
        
        // Actualizar vista
        this.updateView(cleanRoute);
    }

    private updateView(route: string): void {
        // Mapear rutas a componentes
        const routeMap: { [key: string]: string } = {
            '/home': 'lulada-home',
            '/profile': 'lulada-user-profile',
            '/puser': 'lulada-puser',
            '/explore': 'lulada-explore',
            '/antojar': 'lulada-antojar',
            '/save': 'lulada-save',
            '/settings': 'lulada-settings',
            '/notifications': 'lulada-notifications',
            '/login': 'lulada-login'
        };
        
        const componentName = routeMap[route];
        
        if (!componentName) {
            console.error('❌ Ruta no reconocida:', route);
            this.showComponentError(route, 'unknown-route');
            return;
        }
        
        // COMENTAR ESTA VERIFICACIÓN PROBLEMÁTICA:
        /*
        if (!this.isComponentRegistered(componentName)) {
            console.error('❌ Componente no registrado:', componentName);
            this.showComponentError(route, componentName);
            return;
        }
        */

        // Cargar el componente directamente
        this.loadComponent(componentName);
        
        // Actualizar URL del navegador
        if (window.history && window.history.pushState && window.location.pathname !== route) {
            window.history.pushState(null, '', route);
        }
        
        // Actualizar componentes de navegación
        this.updateNavigationComponents(route);
    }

    private loadComponent(componentName: string): void {
        const main = this.shadowRoot.querySelector('main');
        if (!main) return;

        // PREVENIR CARGA MÚLTIPLE DEL MISMO COMPONENTE
        const existingComponent = main.querySelector(componentName);
        if (existingComponent) {
            console.log(`⚠️ ${componentName} ya cargado, evitando duplicación`);
            return;
        }

        // Limpiar contenido anterior
        main.innerHTML = '<div class="loading">Cargando...</div>';
        
        // Cargar nuevo componente con un pequeño delay para mostrar loading
        setTimeout(() => {
            try {
                main.innerHTML = `<${componentName}></${componentName}>`;
                console.log(`✅ ${componentName} cargado exitosamente`);
                
                // Verificar que se cargó correctamente
                setTimeout(() => {
                    const loadedComponent = main.querySelector(componentName);
                    if (loadedComponent) {
                        // Verificar si el componente tiene contenido
                        const hasContent = loadedComponent.shadowRoot || loadedComponent.innerHTML.trim();
                        if (!hasContent) {
                            setTimeout(() => {
                                const recheckContent = loadedComponent.shadowRoot || loadedComponent.innerHTML.trim();
                                if (!recheckContent) {
                                    console.warn('⚠️ Componente cargado pero sin contenido:', componentName);
                                }
                            }, 1000);
                        }
                    } else {
                        console.error('❌ Componente no encontrado después de cargar:', componentName);
                    }
                }, 100);
                
            } catch (error) {
                console.error(`❌ Error cargando ${componentName}:`, error);
                this.showComponentError(this.currentRoute, componentName);
            }
        }, 100);
    }

    private isComponentRegistered(componentName: string): boolean {
        try {
            return !!customElements.get(componentName);
        } catch (error) {
            console.error('Error verificando componente:', error);
            return false;
        }
    }

    private showComponentError(route: string, componentName: string): void {
        const main = this.shadowRoot.querySelector('main');
        if (!main) return;
        
        const isUnknownRoute = componentName === 'unknown-route';
        const errorMessage = isUnknownRoute ? 
            'La ruta solicitada no existe.' : 
            `El componente "${componentName}" no está disponible.`;
        
        main.innerHTML = `
            <div class="error">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Error cargando página</div>
                <div class="error-message">
                    No se pudo cargar el componente para la ruta "${route}".
                    ${errorMessage}
                </div>
                <button class="retry-button" onclick="window.location.href='/home'">
                    Ir al inicio
                </button>
            </div>
        `;
    }

    private updateNavigationComponents(route: string): void {
        // Actualizar sidebar si existe
        const sidebar = document.querySelector('lulada-sidebar');
        if (sidebar && 'updateActiveFromRoute' in sidebar) {
            (sidebar as HTMLElement & { updateActiveFromRoute: (route: string) => void })
                .updateActiveFromRoute(route);
        }
        
        // Actualizar barra responsiva si existe
        const responsiveBar = document.querySelector('lulada-responsive-bar');
        if (responsiveBar && 'updateActiveFromRoute' in responsiveBar) {
            (responsiveBar as HTMLElement & { updateActiveFromRoute: (route: string) => void })
                .updateActiveFromRoute(route);
        }
    }

    private checkAuthentication(): void {
        this.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        console.log('🔐 Estado de autenticación:', this.isAuthenticated);
    }

    // Métodos públicos
    public getCurrentRoute(): string {
        return this.currentRoute;
    }

    public refresh(): void {
        console.log('🔄 Refrescando LoadPage...');
        this.checkAuthentication();
        this.updateView(this.currentRoute);
    }

    public debugInfo(): void {
        console.log('🔍 LoadPage Debug Info:');
        console.log('- Setup completado:', this.isSetup);
        console.log('- Ruta actual:', this.currentRoute);
        console.log('- ShadowRoot existe:', !!this.shadowRoot);
        console.log('- Autenticado:', this.isAuthenticated);
        console.log('- Estado localStorage:', {
            isAuthenticated: localStorage.getItem('isAuthenticated'),
            hasUserData: !!localStorage.getItem('currentUser')
        });
        
        const main = this.shadowRoot.querySelector('main');
        const currentComponent = main?.querySelector('*');
        console.log('- Componente cargado:', currentComponent?.tagName.toLowerCase() || 'ninguno');
        
        // Verificar componentes críticos
        const componentes = [
            'lulada-home',
            'lulada-login',
            'lulada-puser', 
            'lulada-explore',
            'lulada-settings',
            'lulada-save',
            'lulada-notifications'
        ];
        
        console.log('- Componentes críticos:');
        componentes.forEach(name => {
            const registered = this.isComponentRegistered(name);
            console.log(`  ${registered ? '✅' : '❌'} ${name}: ${registered ? 'Registrado' : 'NO Registrado'}`);
        });
    }

    public forceUpdate(): void {
        this.checkAuthentication();
        this.updateView(this.currentRoute);
    }

    public healthCheck(): { [key: string]: boolean } {
        return {
            shadowRootExists: !!this.shadowRoot,
            isSetup: this.isSetup,
            mainElementExists: !!this.shadowRoot.querySelector('main'),
            navigationConfigured: this.isSetup,
            currentRouteSet: this.currentRoute !== '',
            isAuthenticated: this.isAuthenticated
        };
    }
}

// Funciones globales para debugging
if (typeof window !== 'undefined') {
    (window as any).debugLoadPage = (): void => {
        const loadPage = document.querySelector('load-pages') as LoadPage | null;
        if (loadPage && typeof loadPage.debugInfo === 'function') {
            loadPage.debugInfo();
        } else {
            console.log('❌ No se encontró el componente load-pages o no tiene método debugInfo');
        }
    };
    
    (window as any).debugAuth = (): void => {
        const loadPage = document.querySelector('load-pages') as LoadPage | null;
        if (loadPage && typeof loadPage.forceUpdate === 'function') {
            loadPage.forceUpdate();
        } else {
            console.log('❌ No se encontró el componente load-pages');
        }
    };

    (window as any).cleanLoadPageComponents = (): void => {
        const loadPageElements = document.querySelectorAll('load-pages');
        console.log(`🔍 Encontrados ${loadPageElements.length} elementos load-pages`);
        
        if (loadPageElements.length > 1) {
            console.log('🧹 Limpiando duplicados...');
            for (let i = 1; i < loadPageElements.length; i++) {
                loadPageElements[i].remove();
                console.log(`🗑️ Eliminado duplicado ${i}`);
            }
            console.log('✅ Duplicados eliminados');
        } else {
            console.log('✅ No hay duplicados');
        }
    };
}

export default LoadPage;