// LoadPage.ts - VERSIÓN COMPLETAMENTE CORREGIDA

// Interfaces para componentes de navegación
interface LoadPageElement extends HTMLElement {
    getCurrentRoute(): string;
    navigateTo(route: string): void;
    debugInfo(): void;
    isComponentRegistered(componentName: string): boolean;
    updateView(route: string): void;
}

interface NavigationComponent extends HTMLElement {
    updateActive?(route: string): void;
    updateActiveFromRoute?(route: string): void;
}

// Clase principal que maneja la carga y navegación entre páginas
class LoadPage extends HTMLElement implements LoadPageElement {
    private isSetup = false;
    private currentRoute = '/';
    private isAuthenticated = false;
    
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
    }

    connectedCallback(){
        console.log('🔧 LoadPage conectado');
        this.render();
        if (!this.isSetup) {
            this.setupNavigation();
            this.checkAuthentication();
            this.isSetup = true;
        }
    }

    // Verificar estado de autenticación
    private checkAuthentication(): void {
        try {
            const authStatus = localStorage.getItem('isAuthenticated') === 'true';
            const currentUser = localStorage.getItem('currentUser');
            this.isAuthenticated = authStatus && !!currentUser;
            
            console.log('🔐 Estado de autenticación:', this.isAuthenticated);
            
            // Actualizar indicador visual
            this.updateAuthStatus();
        } catch (error) {
            console.error('LoadPage: Error verificando autenticación:', error);
            this.isAuthenticated = false;
        }
    }

    render(){
        if (!this.shadowRoot) return;

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
                    font-size: 18px;
                }

                .auth-error {
                    padding: 40px;
                    text-align: center;
                    background: #fff5f5;
                    margin: 20px;
                    border-radius: 10px;
                    border: 2px solid #fed7d7;
                    color: #c53030;
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
                    padding: 12px 24px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin: 10px;
                    font-size: 16px;
                    transition: background-color 0.2s;
                }

                .error-button:hover {
                    background: #9a9b4a;
                }

                .auth-status {
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: bold;
                    z-index: 1000;
                    opacity: 0.8;
                }

                .auth-status.authenticated {
                    background: #48bb78;
                    color: white;
                }

                .auth-status.not-authenticated {
                    background: #f56565;
                    color: white;
                }
            </style>
            
            <div class="app-container">
                <!-- Indicador de estado de autenticación -->
                <div class="auth-status ${this.isAuthenticated ? 'authenticated' : 'not-authenticated'}">
                    ${this.isAuthenticated ? '✅ Autenticado' : '🔒 No autenticado'}
                </div>
                
                <main>
                    <!-- El contenido se carga dinámicamente aquí -->
                    <div class="loading">🚀 Inicializando Lulada...</div>
                </main>
            </div>
        `;
    }

    // ✅ FUNCIÓN PRINCIPAL CORREGIDA - Cambia qué página se muestra
    updateView(route: string){
        if (!this.shadowRoot) return;
        
        const cleanRoute = route.startsWith('/') ? route : '/' + route;
        this.currentRoute = cleanRoute;
        
        console.log('🧭 LoadPage: Navegando a:', cleanRoute);
        
        // Actualizar indicador de autenticación
        this.updateAuthStatus();
        
        // ✅ MAPEO CORRECTO DE RUTAS A COMPONENTES - NOMBRES REALES
        const routeComponentMap: { [key: string]: string } = {
            '/': this.isAuthenticated ? 'lulada-home' : 'lulada-login',
            '/home': 'lulada-home',
            '/notifications': 'lulada-notifications',
            '/save': 'lulada-save',
            '/explore': 'lulada-explore',
            '/configurations': 'lulada-settings',
            '/settings': 'lulada-settings',
            '/profile': 'lulada-puser',
            '/restaurant-profile': 'lulada-restaurant-profile',
            '/cambiar-correo': 'cambiar-correo-f',
            '/cambiar-nombre': 'cambiar-nombre-f',
            '/cambiar-contraseña': 'cambiar-contrasena-f',
            '/login': 'lulada-login',
            '/register': 'lulada-new-account'
        };
        
        const componentName = routeComponentMap[cleanRoute];
        
        if (!componentName) {
            // Verificar rutas dinámicas
            if (cleanRoute.startsWith('/restaurant-profile/')) {
                this.loadComponent('lulada-restaurant-profile');
                return;
            } else {
                // Ruta no reconocida, redirigir según autenticación
                console.log('⚠️ Ruta no reconocida:', cleanRoute);
                if (this.isAuthenticated) {
                    this.updateView('/home');
                } else {
                    this.updateView('/login');
                }
                return;
            }
        }

        // Verificar permisos antes de mostrar componente
        if (this.isProtectedRoute(cleanRoute) && !this.isAuthenticated) {
            console.log('🔒 Ruta protegida sin autenticación, redirigiendo a login');
            this.showAuthError();
            return;
        }

        // Verificar que el componente esté registrado
        if (!this.isComponentRegistered(componentName)) {
            console.error('❌ Componente no registrado:', componentName);
            this.showComponentError(cleanRoute, componentName);
            return;
        }

        // Cargar el componente
        this.loadComponent(componentName);
        
        // Actualizar URL del navegador
        if (window.history && window.history.pushState && window.location.pathname !== cleanRoute) {
            window.history.pushState(null, '', cleanRoute);
        }
        
        // Actualizar componentes de navegación
        this.updateNavigationComponents(cleanRoute);
    }

    // ✅ Cargar componente de forma segura
    private loadComponent(componentName: string) {
        const main = this.shadowRoot?.querySelector('main');
        if (!main) return;

        main.innerHTML = '<div class="loading">Cargando...</div>';
        
        setTimeout(() => {
            try {
                main.innerHTML = `<${componentName}></${componentName}>`;
                console.log(`✅ ${componentName} cargado exitosamente`);
                
                // Verificar que se cargó correctamente
                setTimeout(() => {
                    const loadedComponent = main.querySelector(componentName);
                    if (loadedComponent) {
                        // Verificar si el componente tiene contenido
                        if (!loadedComponent.shadowRoot && !loadedComponent.innerHTML.trim()) {
                            setTimeout(() => {
                                if (!loadedComponent.shadowRoot && !loadedComponent.innerHTML.trim()) {
                                    console.warn('⚠️ Componente cargado pero sin contenido:', componentName);
                                    this.showComponentError(this.currentRoute, componentName);
                                }
                            }, 1000);
                        }
                    } else {
                        console.error('❌ Componente no encontrado en DOM:', componentName);
                        this.showComponentError(this.currentRoute, componentName);
                    }
                }, 100);
                
            } catch (error) {
                console.error('❌ Error cargando componente:', componentName, error);
                this.showComponentError(this.currentRoute, componentName);
            }
        }, 50);
    }

    // Verificar si una ruta requiere autenticación
    private isProtectedRoute(route: string): boolean {
        const protectedRoutes = [
            '/home', '/profile', '/save', '/explore', '/settings', 
            '/notifications', '/restaurant-profile', '/configurations',
            '/cambiar-correo', '/cambiar-nombre', '/cambiar-contraseña'
        ];
        return protectedRoutes.includes(route) || route.startsWith('/restaurant-profile/');
    }

    // Verificar si una ruta es pública (no requiere autenticación)
    private isPublicRoute(route: string): boolean {
        const publicRoutes = ['/login', '/register'];
        return publicRoutes.includes(route);
    }

    // Actualizar indicador visual de autenticación
    private updateAuthStatus(): void {
        const authStatus = this.shadowRoot?.querySelector('.auth-status');
        if (authStatus) {
            authStatus.className = `auth-status ${this.isAuthenticated ? 'authenticated' : 'not-authenticated'}`;
            authStatus.textContent = this.isAuthenticated ? '✅ Autenticado' : '🔒 No autenticado';
        }
    }

    // Muestra error de autenticación
    private showAuthError(): void {
        const main = this.shadowRoot?.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="auth-error">
                    <h2>🔒 Acceso Restringido</h2>
                    <p>Necesitas iniciar sesión para acceder a esta página.</p>
                    <button class="error-button" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: '/login'}))">
                        Iniciar Sesión
                    </button>
                </div>
            `;
        }
    }

    // Muestra error cuando un componente no se puede cargar
    private showComponentError(route: string, componentName: string): void {
        const main = this.shadowRoot?.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="component-error">
                    <h2>⚠️ Error de Navegación</h2>
                    <p><strong>Ruta solicitada:</strong> ${route}</p>
                    <p><strong>Componente:</strong> ${componentName}</p>
                    <p><strong>Estado:</strong> ${this.isComponentRegistered(componentName) ? 'Registrado pero falló al cargar' : 'No registrado'}</p>
                    <p><strong>Autenticación:</strong> ${this.isAuthenticated ? 'Autenticado' : 'No autenticado'}</p>
                    <button class="error-button" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: '${this.isAuthenticated ? '/home' : '/login'}'}))">
                        ${this.isAuthenticated ? 'Volver al Inicio' : 'Ir a Login'}
                    </button>
                    <button class="error-button" onclick="window.location.reload()">
                        🔄 Recargar Aplicación
                    </button>
                </div>
            `;
        }
    }
    
    // Actualiza componentes de navegación para mostrar página activa
    private updateNavigationComponents(route: string): void {
        const sidebar = document.querySelector('lulada-sidebar') as NavigationComponent | null;
        if (sidebar && typeof sidebar.updateActive === 'function') {
            sidebar.updateActive(route);
        }
        
        const responsiveBar = document.querySelector('lulada-responsive-bar') as NavigationComponent | null;
        if (responsiveBar && typeof responsiveBar.updateActiveFromRoute === 'function') {
            responsiveBar.updateActiveFromRoute(route);
        }
    }

    // Configura los event listeners para navegación
    private setupNavigation(){
        // Escucha eventos de navegación de otros componentes
        document.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            const route = customEvent.detail;
            this.handleNavigationRequest(route);
        });

        // Navegación a perfil de restaurante
        document.addEventListener('restaurant-selected', () => {
            this.handleNavigationRequest('/restaurant-profile');
        });

        // Escuchar eventos de autenticación
        document.addEventListener('auth-success', () => {
            console.log('LoadPage: Autenticación exitosa detectada');
            this.isAuthenticated = true;
            this.updateAuthStatus();
        });

        document.addEventListener('auth-logout', () => {
            console.log('LoadPage: Logout detectado');
            this.isAuthenticated = false;
            this.updateView('/login');
        });

        // Maneja navegación del navegador (botón atrás/adelante)
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            this.handleNavigationRequest(currentPath);
        });
    }

    // Maneja las solicitudes de navegación con validación de autenticación
    private handleNavigationRequest(route: string): void {
        console.log('🧭 LoadPage: Solicitud de navegación a:', route);
        
        // Actualizar estado de autenticación
        this.checkAuthentication();
        
        // Verificar permisos de navegación
        if (this.isProtectedRoute(route) && !this.isAuthenticated) {
            console.log('🔒 LoadPage: Ruta protegida sin autenticación, redirigiendo a login');
            this.updateView('/login');
            return;
        }

        // Si está autenticado y trata de ir a login/register, redirigir a home
        if (this.isPublicRoute(route) && this.isAuthenticated) {
            console.log('🏠 LoadPage: Usuario autenticado intentando acceder a ruta pública, redirigiendo a home');
            this.updateView('/home');
            return;
        }

        // Navegación permitida
        this.updateView(route);
    }

    // Métodos públicos de la interfaz
    public getCurrentRoute(): string {
        return this.currentRoute;
    }

    public navigateTo(route: string): void {
        this.handleNavigationRequest(route);
    }
    
    public isComponentRegistered(componentName: string): boolean {
        return !!customElements.get(componentName);
    }
    
    // Método para debugging
    public debugInfo(): void {
        console.log('🔍 LoadPage Debug Info:');
        console.log('- Ruta actual:', this.getCurrentRoute());
        console.log('- URL actual:', window.location.pathname);
        console.log('- Setup completado:', this.isSetup);
        console.log('- Shadow DOM:', !!this.shadowRoot);
        console.log('- Autenticado:', this.isAuthenticated);
        console.log('- Estado localStorage:', {
            isAuthenticated: localStorage.getItem('isAuthenticated'),
            hasUserData: !!localStorage.getItem('currentUser')
        });
        
        const main = this.shadowRoot?.querySelector('main');
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
        
        console.log('- Componentes de navegación:');
        const sidebar = document.querySelector('lulada-sidebar');
        const responsiveBar = document.querySelector('lulada-responsive-bar');
        console.log(`  Sidebar: ${sidebar ? 'Encontrado' : 'NO encontrado'}`);
        console.log(`  ResponsiveBar: ${responsiveBar ? 'Encontrado' : 'NO encontrado'}`);
    }

    public forceUpdate(): void {
        this.checkAuthentication();
        this.updateView(this.currentRoute);
    }

    public healthCheck(): { [key: string]: boolean } {
        return {
            shadowRootExists: !!this.shadowRoot,
            isSetup: this.isSetup,
            mainElementExists: !!this.shadowRoot?.querySelector('main'),
            navigationConfigured: this.isSetup,
            currentRouteSet: this.currentRoute !== '',
            isAuthenticated: this.isAuthenticated
        };
    }
}

// ✅ FUNCIONES GLOBALES PARA DEBUGGING
if (typeof window !== 'undefined') {
    (window as any).debugLoadPage = () => {
        const loadPage = document.querySelector('load-pages') as LoadPage | null;
        if (loadPage && typeof loadPage.debugInfo === 'function') {
            loadPage.debugInfo();
        } else {
            console.log('❌ No se encontró el componente load-pages o no tiene método debugInfo');
        }
    };
    
    (window as any).debugAuth = () => {
        const loadPage = document.querySelector('load-pages') as LoadPage | null;
        if (loadPage && typeof loadPage.forceUpdate === 'function') {
            loadPage.forceUpdate();
        } else {
            console.log('❌ No se encontró el componente load-pages');
        }
    };
}

export default LoadPage;