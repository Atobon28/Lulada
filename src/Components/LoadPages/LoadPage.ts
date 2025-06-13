// LoadPage.ts - VERSIÓN CORREGIDA CON ERRORES DE SINTAXIS SOLUCIONADOS
// ========================================================================

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

// ✅ AÑADIR INTERFAZ PARA WINDOW CON FUNCIONES DE DEBUG
declare global {
    interface Window {
        debugLoadPage?: () => void;
        debugRestaurantNav?: () => void;
        debugAuth?: () => void;
    }
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
            
            console.log('LoadPage: Estado de autenticación:', this.isAuthenticated);
            
            // Si no está autenticado, ir a login
            if (!this.isAuthenticated && !this.isPublicRoute(window.location.pathname)) {
                console.log('LoadPage: Usuario no autenticado, redirigiendo a login');
                this.updateView('/login');
            }
        } catch (error) {
            console.error('LoadPage: Error verificando autenticación:', error);
            this.isAuthenticated = false;
        }
    }

    // Verificar si una ruta es pública (no requiere autenticación)
    private isPublicRoute(route: string): boolean {
        const publicRoutes = ['/login', '/register'];
        return publicRoutes.includes(route);
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

    // Configura los event listeners para navegación
    private setupNavigation(){
        // Intercepta clicks en enlaces
        this.shadowRoot!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href) {
                e.preventDefault();
            }
        });

        // Escucha eventos de navegación de otros componentes
        document.addEventListener('navigate', (event: Event) => {
            const route = (event as CustomEvent<string>).detail;
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
        console.log('LoadPage: Solicitud de navegación a:', route);
        
        // Actualizar estado de autenticación
        this.checkAuthentication();
        
        // Verificar permisos de navegación
        if (this.isProtectedRoute(route) && !this.isAuthenticated) {
            console.log('LoadPage: Ruta protegida sin autenticación, redirigiendo a login');
            this.updateView('/login');
            return;
        }

        // Si está autenticado y trata de ir a login/register, redirigir a home
        if (this.isPublicRoute(route) && this.isAuthenticated) {
            console.log('LoadPage: Usuario autenticado intentando acceder a ruta pública, redirigiendo a home');
            this.updateView('/home');
            return;
        }

        // Navegación permitida
        this.updateView(route);
    }

    render(){
        if (!this.shadowRoot) {
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
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                    margin-right: 10px;
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
                    <div class="loading">Inicializando aplicación...</div>
                </main>
            </div>
        `;
    }

    // Función principal: cambia qué página se muestra
    updateView(route: string){
        if (!this.shadowRoot) {
            return;
        }
        
        const cleanRoute = route.startsWith('/') ? route : '/' + route;
        this.currentRoute = cleanRoute;
        
        console.log('LoadPage: Actualizando vista a:', cleanRoute);
        
        // Actualizar indicador de autenticación
        this.updateAuthStatus();
        
        // Mapeo de rutas a componentes
        const routeComponentMap: { [key: string]: string } = {
            '/': this.isAuthenticated ? '<lulada-home></lulada-home>' : '<login-page></login-page>',
            '/home': '<lulada-home></lulada-home>',
            '/notifications': '<lulada-notifications></lulada-notifications>',
            '/save': '<save-page></save-page>',
            '/explore': '<lulada-explore></lulada-explore>',
            '/configurations': '<lulada-settings></lulada-settings>',
            '/settings': '<lulada-settings></lulada-settings>',
            '/profile': '<puser-page></puser-page>',
            '/restaurant-profile': '<restaurant-profile></restaurant-profile>',
            '/cambiar-correo': '<lulada-cambiar-correo></lulada-cambiar-correo>',
            '/cambiar-nombre': '<lulada-cambiar-nombre></lulada-cambiar-nombre>',
            '/cambiar-contraseña': '<lulada-cambiar-contraseña></lulada-cambiar-contraseña>',
            '/login': '<login-page></login-page>',
            '/register': '<register-new-account></register-new-account>'
        };
        
        let newComponent = routeComponentMap[cleanRoute];
        let componentName = '';
        
        // Verificar rutas dinámicas
        if (!newComponent) {
            if (cleanRoute.startsWith('/restaurant-profile/')) {
                newComponent = '<restaurant-profile></restaurant-profile>';
                componentName = 'restaurant-profile';
            } else {
                // Ruta no reconocida, redirigir según autenticación
                if (this.isAuthenticated) {
                    this.updateView('/home');
                } else {
                    this.updateView('/login');
                }
                return;
            }
        } else {
            const match = newComponent.match(/<([^>\s]+)/);
            componentName = match ? match[1] : '';
        }
        
        // Verificar permisos antes de mostrar componente
        if (this.isProtectedRoute(cleanRoute) && !this.isAuthenticated) {
            this.showAuthError();
            return;
        }
        
        // Verificar que el componente esté registrado
        if (componentName && !this.isComponentRegistered(componentName)) {
            this.showComponentError(cleanRoute, componentName);
            return;
        }
        
        const main = this.shadowRoot.querySelector('main');
        if (main) {
            main.innerHTML = '<div class="loading">Cargando...</div>';
            
            setTimeout(() => {
                main.innerHTML = newComponent;
                
                setTimeout(() => {
                    const loadedComponent = main.querySelector('*');
                    if (loadedComponent) {
                        if (!loadedComponent.shadowRoot && !loadedComponent.innerHTML.trim()) {
                            setTimeout(() => {
                                if (!loadedComponent.shadowRoot && !loadedComponent.innerHTML.trim()) {
                                    this.showComponentError(cleanRoute, componentName);
                                }
                            }, 1000);
                        }
                    } else {
                        this.showComponentError(cleanRoute, componentName);
                    }
                }, 100);
            }, 50);
        }
        
        window.scrollTo(0, 0);
        
        // Actualizar URL del navegador
        if (window.history && window.history.pushState && window.location.pathname !== cleanRoute) {
            window.history.pushState(null, '', cleanRoute);
        }
        
        this.updateNavigationComponents(cleanRoute);
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
                    <button class="error-button" onclick="window.debugLoadPage?.()">
                        Debug Info
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
            'login-page',
            'register-new-account',
            'lulada-home',
            'lulada-notifications', 
            'save-page',
            'lulada-explore',
            'lulada-settings',
            'puser-page',
            'restaurant-profile'
        ];
        
        console.log('- Componentes críticos:');
        componentes.forEach(name => {
            const registered = this.isComponentRegistered(name);
            const inDOM = !!document.querySelector(name);
            console.log(`  ${registered ? '✅' : '❌'} ${name}: ${registered ? 'Registrado' : 'NO Registrado'} | ${inDOM ? 'En DOM' : 'NO en DOM'}`);
        });
        
        console.log('- Componentes de navegación:');
        const sidebar = document.querySelector('lulada-sidebar');
        const responsiveBar = document.querySelector('lulada-responsive-bar');
        console.log(`  Sidebar: ${sidebar ? 'Encontrado' : 'NO encontrado'}`);
        console.log(`  ResponsiveBar: ${responsiveBar ? 'Encontrado' : 'NO encontrado'}`);
        
        try {
            const restaurantInfo = sessionStorage.getItem('selectedRestaurant');
            if (restaurantInfo) {
                const parsed = JSON.parse(restaurantInfo);
                console.log('- Información de restaurante seleccionado:', parsed);
            } else {
                console.log('- No hay restaurante seleccionado en sessionStorage');
            }
        } catch (error) {
            console.log('- Error leyendo información de restaurante:', error);
        }
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
            isAuthenticated: this.isAuthenticated,
            loginComponentRegistered: this.isComponentRegistered('login-page'),
            homeComponentRegistered: this.isComponentRegistered('lulada-home'),
            registerComponentRegistered: this.isComponentRegistered('register-new-account'),
            notificationsComponentRegistered: this.isComponentRegistered('lulada-notifications'),
            settingsComponentRegistered: this.isComponentRegistered('lulada-settings'),
            exploreComponentRegistered: this.isComponentRegistered('lulada-explore'),
            profileComponentRegistered: this.isComponentRegistered('puser-page'),
            saveComponentRegistered: this.isComponentRegistered('save-page'),
            restaurantProfileRegistered: this.isComponentRegistered('restaurant-profile')
        };
    }

    public debugRestaurantNavigation(): void {
        console.log('🔍 LoadPage: Debug de navegación de restaurantes');
        
        const isRegistered = this.isComponentRegistered('restaurant-profile');
        console.log('- restaurant-profile registrado:', isRegistered);
        
        try {
            const restaurantInfo = sessionStorage.getItem('selectedRestaurant');
            if (restaurantInfo) {
                const parsed = JSON.parse(restaurantInfo);
                console.log('- Restaurante en sessionStorage:', parsed);
                console.log('- Tiempo desde selección:', Date.now() - parsed.timestamp, 'ms');
            } else {
                console.log('- No hay restaurante en sessionStorage');
            }
        } catch (error) {
            console.error('- Error leyendo sessionStorage:', error);
        }
        
        const isRestaurantRoute = this.currentRoute.includes('restaurant-profile');
        console.log('- En ruta de restaurante:', isRestaurantRoute);
        console.log('- Ruta actual:', this.currentRoute);
        console.log('- Autenticado:', this.isAuthenticated);
        
        const main = this.shadowRoot?.querySelector('main');
        const restaurantComponent = main?.querySelector('restaurant-profile');
        console.log('- Componente restaurant-profile en DOM:', !!restaurantComponent);
    }

    // Método público para forzar re-autenticación
    public forceAuthCheck(): void {
        console.log('LoadPage: Forzando verificación de autenticación');
        this.checkAuthentication();
        this.updateAuthStatus();
        
        // Si la ruta actual no es válida para el estado de autenticación, redirigir
        if (this.isProtectedRoute(this.currentRoute) && !this.isAuthenticated) {
            this.updateView('/login');
        } else if (this.isPublicRoute(this.currentRoute) && this.isAuthenticated) {
            this.updateView('/home');
        }
    }
}

// ✅ FUNCIONES GLOBALES PARA DEBUGGING - VERSIÓN CORREGIDA
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
    
    if (!window.debugRestaurantNav) {
        window.debugRestaurantNav = () => {
            const loadPage = document.querySelector('load-pages') as LoadPage | null;
            if (loadPage && typeof loadPage.debugRestaurantNavigation === 'function') {
                loadPage.debugRestaurantNavigation();
            } else {
                console.log('❌ No se encontró el componente load-pages');
            }
        };
    }

    // ✅ CORRECCIÓN: Nueva función para debug de autenticación - SINTAXIS CORRECTA
    if (!window.debugAuth) {
        window.debugAuth = () => {
            const loadPage = document.querySelector('load-pages') as LoadPage | null;
            if (loadPage && typeof loadPage.forceAuthCheck === 'function') {
                loadPage.forceAuthCheck();
            } else {
                console.log('❌ No se encontró el componente load-pages');
            }
        };
    }
}

export default LoadPage;