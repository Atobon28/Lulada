// src/Components/LoadPages/LoadPage.ts - Integrado con Firebase AuthGuard manteniendo estilos originales

import { getFirebaseUserService, AuthState } from '../../Services/firebase/FirebaseUserService';

// Interfaces para componentes de navegación
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

// Interface específica para LoadPage con métodos adicionales
interface LoadPageWithMethods extends LoadPageElement {
    forceLogin(): void;
    forceHome(): void;
    debugRestaurantNavigation(): void;
    refresh(): void;
    healthCheck(): { [key: string]: boolean };
}

// Declaraciones globales para TypeScript
declare global {
    interface Window {
        // Removed duplicate declaration of debugLoadPage
        forceLogin?: () => void;
        forceHome?: () => void;
        // debugRestaurantNav?: () => void; // Removed to avoid duplicate identifier
        cleanLoadPageComponents?: () => void;
        debugFirebaseAuth?: () => void;
    }
}

class LoadPage extends HTMLElement implements LoadPageElement {
    declare shadowRoot: ShadowRoot;
    private currentRoute = '/login';
    private isSetup = false;
    private authState: AuthState = {
        isAuthenticated: false,
        user: null,
        isLoading: true,
        error: null
    };
    private firebaseUserService = getFirebaseUserService();
    private authUnsubscribe?: () => void;
    
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
        console.log('[LoadPage] 🔐 Constructor ejecutado con AuthGuard Firebase');
    }

    connectedCallback(){
        // PREVENIR CONFIGURACIÓN MÚLTIPLE
        if (this.isSetup) {
            console.log('⚠️ LoadPage ya configurado, evitando duplicación');
            return;
        }

        console.log('[LoadPage] 🚀 Conectando al DOM con autenticación Firebase');
        
        this.render();
        this.setupFirebaseAuth();
        this.setupCompleteNavigation();
        this.isSetup = true;
    }

    disconnectedCallback(): void {
        this.isSetup = false;
        this.cleanupAuth();
        console.log('[LoadPage] Desconectado del DOM');
    }

    private setupFirebaseAuth(): void {
        console.log('[LoadPage] 🔐 Configurando autenticación Firebase...');
        
        // Suscribirse a cambios de autenticación
        this.authUnsubscribe = this.firebaseUserService.subscribe((authState: AuthState) => {
            console.log('[LoadPage] 🔄 Estado de auth cambió:', authState);
            this.authState = authState;
            this.handleAuthStateChange(authState);
        });

        // Obtener estado inicial
        const initialState = this.firebaseUserService.getAuthState();
        this.authState = initialState;
        
        console.log('[LoadPage] ✅ Autenticación Firebase configurada');
    }

    private handleAuthStateChange(authState: AuthState): void {
        console.log('[LoadPage] 🔐 Manejando cambio de estado auth:', {
            isAuthenticated: authState.isAuthenticated,
            isLoading: authState.isLoading,
            error: authState.error,
            user: authState.user?.email
        });

        if (authState.isLoading) {
            this.showFirebaseLoading();
            return;
        }

        if (authState.error) {
            this.showAuthError(authState.error);
            return;
        }

        if (authState.isAuthenticated && authState.user) {
            console.log('✅ Usuario autenticado:', authState.user.email);
            this.handleAuthenticatedUser();
        } else {
            console.log('🔑 Usuario no autenticado, mostrando login');
            this.handleUnauthenticatedUser();
        }
    }

    private handleAuthenticatedUser(): void {
        // Actualizar localStorage para compatibilidad con el sistema existente
        localStorage.setItem('isAuthenticated', 'true');
        if (this.authState.user) {
            localStorage.setItem('currentUser', JSON.stringify({
                uid: this.authState.user.uid,
                email: this.authState.user.email,
                displayName: this.authState.user.displayName,
                photoURL: this.authState.user.photoURL
            }));
        }

        // Si está en una ruta de autenticación, redirigir a home
        if (this.currentRoute === '/login' || this.currentRoute === '/register') {
            console.log('[LoadPage] Usuario autenticado en ruta de auth, redirigiendo a home');
            setTimeout(() => {
                this.navigateTo('/home');
            }, 500);
        } else {
            // Determinar ruta inicial para usuario autenticado
            const initialRoute = this.getInitialRouteForAuthenticatedUser();
            this.handleNavigation(initialRoute);
        }
    }

    private handleUnauthenticatedUser(): void {
        // Limpiar localStorage
        this.clearAuth();
        
        // Si está en una ruta protegida, redirigir a login
        if (!this.isPublicRoute(this.currentRoute)) {
            console.log('[LoadPage] Usuario no autenticado en ruta protegida, redirigiendo a login');
            this.navigateTo('/login');
        } else {
            // Ya está en una ruta pública, mostrar el componente correspondiente
            this.routeToPage(this.currentRoute);
        }
    }

    private getInitialRouteForAuthenticatedUser(): string {
        const pathname = window.location.pathname;
        
        // Rutas válidas para usuarios autenticados
        const validAuthenticatedRoutes = [
            '/home', 
            '/profile', 
            '/puser',
            '/explore', 
            '/antojar',
            '/save',
            '/settings',
            '/configurations',
            '/notifications',
            '/restaurant-profile',
            '/cambiar-correo',
            '/cambiar-nombre',
            '/cambiar-contraseña'
        ];
        
        // Si la ruta actual es válida, usarla
        if (validAuthenticatedRoutes.includes(pathname)) {
            return pathname;
        }
        
        // Por defecto, ir a home
        return '/home';
    }

    private showFirebaseLoading(): void {
        const main = this.shadowRoot?.querySelector('#main-content');
        if (!main) return;

        main.innerHTML = `
            <div class="firebase-loading">
                <div class="loading-content">
                    <div class="spinner"></div>
                    <h2>🍴 Lulada</h2>
                    <p>Verificando autenticación...</p>
                </div>
            </div>
        `;
    }

    private showAuthError(error: string): void {
        const main = this.shadowRoot?.querySelector('#main-content');
        if (!main) return;

        main.innerHTML = `
            <div class="auth-error">
                <div class="error-content">
                    <h2>⚠️ Error de Autenticación</h2>
                    <p>${error}</p>
                    <button onclick="location.reload()" class="retry-button">
                        Intentar de nuevo
                    </button>
                    <button onclick="window.debugFirebaseAuth?.()" class="debug-button">
                        Debug Firebase
                    </button>
                </div>
            </div>
        `;
    }

    private cleanupAuth(): void {
        if (this.authUnsubscribe) {
            this.authUnsubscribe();
        }
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
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
                    position: relative;
                    display: block;
                }

                /* Firebase Loading Styles */
                .firebase-loading {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                }

                .loading-content {
                    text-align: center;
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .loading-content h2 {
                    font-size: 2.5rem;
                    margin: 20px 0;
                    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                }

                .loading-content p {
                    font-size: 1.2rem;
                    opacity: 0.9;
                }

                .spinner {
                    border: 4px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top: 4px solid white;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                /* Auth Error Styles */
                .auth-error {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                }

                .error-content {
                    text-align: center;
                    color: white;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 40px;
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                }

                .retry-button, .debug-button {
                    background: white;
                    color: #ee5a24;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                    margin: 10px 5px;
                    transition: all 0.3s ease;
                }

                .retry-button:hover, .debug-button:hover {
                    background: #f8f8f8;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                /* Existing styles */
                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
                    font-size: 1.1rem;
                    color: #666;
                    background: white;
                    margin: 20px;
                    border-radius: 10px;
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

                .error-button {
                    background: #AAAB54;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin: 5px;
                    transition: background 0.3s ease;
                }

                .error-button:hover {
                    background: #8B9B3A;
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

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            
            <div class="app-container">
                <main id="main-content">
                    <div class="loading">Inicializando aplicación...</div>
                </main>
            </div>
        `;
    }

    private setupCompleteNavigation(): void {
        console.log('[LoadPage] Configurando navegación completa');

        // Interceptar clicks en enlaces
        this.shadowRoot!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href) {
                e.preventDefault();
                const url = new URL(link.href);
                this.handleNavigation(url.pathname);
            }
        });

        // Escuchar eventos de navegación
        document.addEventListener('navigate', (event: Event) => {
            const route = (event as CustomEvent<string>).detail;
            console.log('[LoadPage] Navegación solicitada a:', route);
            this.handleNavigation(route);
        });

        // Escuchar cambios de URL (botón atrás/adelante)
        window.addEventListener('popstate', () => {
            const newPath = window.location.pathname;
            console.log('[LoadPage] Popstate detectado:', newPath);
            this.handleNavigation(newPath);
        });

        // Navegación a perfil de restaurante
        document.addEventListener('restaurant-selected', () => {
            console.log('[LoadPage] Restaurant selected - navegando a perfil');
            this.handleNavigation('/restaurant-profile');
        });

        // Escuchar logout (a través de Firebase)
        document.addEventListener('auth-logout', () => {
            console.log('[LoadPage] Logout detectado');
            this.firebaseUserService.signOut();
        });

        console.log('[LoadPage] Navegación completa configurada');
    }

    private handleNavigation(route: string): void {
        console.log('[LoadPage] === Manejando navegación a:', route, '===');
        
        const cleanRoute = route.startsWith('/') ? route : '/' + route;
        this.currentRoute = cleanRoute;
        
        // Actualizar URL
        if (window.location.pathname !== cleanRoute) {
            window.history.pushState(null, '', cleanRoute);
        }
        
        // Verificar autenticación para rutas protegidas usando Firebase
        if (!this.isPublicRoute(cleanRoute)) {
            if (!this.authState.isAuthenticated) {
                console.log('[LoadPage] Ruta protegida sin auth Firebase, redirigiendo a login');
                this.navigateTo('/login');
                return;
            }
        }
        
        // Enrutar a la página correcta
        this.routeToPage(cleanRoute);
        
        // Actualizar componentes de navegación
        this.updateNavigationComponents(cleanRoute);
        
        // Scroll al inicio
        window.scrollTo(0, 0);
    }

    private routeToPage(route: string): void {
        console.log('[LoadPage] Enrutando a:', route);
        
        // Mapeo completo de rutas - MANTIENE TUS COMPONENTES ORIGINALES
        const routeComponentMap: { [key: string]: string } = {
            // Rutas de autenticación - USAR TUS COMPONENTES ORIGINALES
            '/login': '<login-page></login-page>',
            '/register': '<register-new-account></register-new-account>',
            
            // Rutas principales
            '/': '<lulada-home></lulada-home>',
            '/home': '<lulada-home></lulada-home>',
            
            // Rutas de navegación principal
            '/notifications': '<lulada-notifications></lulada-notifications>',
            '/save': '<save-page></save-page>',
            '/explore': '<lulada-explore></lulada-explore>',
            '/antojar': '<lulada-antojar></lulada-antojar>',
            
            // Rutas de configuración (ambos nombres para compatibilidad)
            '/configurations': '<lulada-settings></lulada-settings>',
            '/settings': '<lulada-settings></lulada-settings>',
            
            // Rutas de perfil (ambos nombres para compatibilidad) 
            '/profile': '<puser-page></puser-page>',
            '/puser': '<puser-page></puser-page>',
            
            // Rutas de restaurante
            '/restaurant-profile': '<restaurant-profile></restaurant-profile>',
            
            // Rutas de configuración específicas
            '/cambiar-correo': '<lulada-cambiar-correo></lulada-cambiar-correo>',
            '/cambiar-nombre': '<lulada-cambiar-nombre></lulada-cambiar-nombre>',
            '/cambiar-contraseña': '<lulada-cambiar-contraseña></lulada-cambiar-contraseña>'
        };
        
        let componentHtml = routeComponentMap[route];
        let componentName = '';
        
        // Verificar rutas dinámicas
        if (!componentHtml) {
            if (route.startsWith('/restaurant-profile/')) {
                componentHtml = '<restaurant-profile></restaurant-profile>';
                componentName = 'restaurant-profile';
            } else {
                // Ruta no encontrada
                console.warn('[LoadPage] Ruta no encontrada:', route);
                if (this.authState.isAuthenticated) {
                    componentHtml = '<lulada-home></lulada-home>';
                    componentName = 'lulada-home';
                    this.currentRoute = '/home';
                    window.history.replaceState(null, '', '/home');
                } else {
                    componentHtml = '<login-page></login-page>';
                    componentName = 'login-page';
                    this.currentRoute = '/login';
                    window.history.replaceState(null, '', '/login');
                }
            }
        } else {
            // Extraer nombre del componente
            const match = componentHtml.match(/<([^>\s]+)/);
            componentName = match ? match[1] : '';
        }
        
        // Renderizar el componente
        this.renderComponent(componentHtml, componentName);
    }

    private renderComponent(html: string, componentName: string): void {
        console.log(`[LoadPage] Renderizando ${componentName}`);
        
        const main = this.shadowRoot?.querySelector('#main-content');
        if (!main) {
            console.error('[LoadPage] main-content no encontrado');
            return;
        }
        
        // PREVENIR CARGA MÚLTIPLE DEL MISMO COMPONENTE
        const existingComponent = main.querySelector(componentName);
        if (existingComponent) {
            console.log(`⚠️ ${componentName} ya cargado, evitando duplicación`);
            return;
        }
        
        // LIMPIAR COMPLETAMENTE EL CONTENIDO ANTERIOR
        main.innerHTML = '';
        
        // Mostrar loading primero
        main.innerHTML = '<div class="loading">Cargando...</div>';
        
        // Cargar componente con delay para mostrar loading
        setTimeout(() => {
            try {
                // LIMPIAR DE NUEVO Y RENDERIZAR SOLO EL NUEVO COMPONENTE
                main.innerHTML = '';
                main.innerHTML = html;
                console.log(`✅ ${componentName} renderizado`);
                
                // Verificar después de un momento
                setTimeout(() => {
                    const hasContent = main.children.length > 0;
                    console.log(`[LoadPage] Verificación ${componentName}: ${hasContent ? 'OK' : 'FALLO'}`);
                    
                    if (!hasContent) {
                        this.showGenericError(componentName);
                    }
                }, 500);
                
            } catch (error) {
                console.error(`❌ Error renderizando ${componentName}:`, error);
                this.showGenericError(componentName);
            }
        }, 100);
    }

    private isPublicRoute(route: string): boolean {
        const publicRoutes = ['/login', '/register'];
        return publicRoutes.includes(route);
    }

    private showComponentError(route: string, componentName: string): void {
        const main = this.shadowRoot?.querySelector('#main-content');
        if (!main) return;
        
        main.innerHTML = `
            <div class="component-error">
                <h2>⚠️ Error de Navegación</h2>
                <p><strong>Ruta solicitada:</strong> ${route}</p>
                <p><strong>Componente:</strong> ${componentName}</p>
                <p><strong>Estado:</strong> ${this.isComponentRegistered(componentName) ? 'Registrado pero falló al cargar' : 'No registrado'}</p>
                <button class="error-button" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: '/home'}))">
                    🏠 Volver al Inicio
                </button>
                <button class="error-button" onclick="window.debugLoadPage?.()" style="margin-left: 10px;">
                    🔍 Debug Info
                </button>
                <button class="error-button" onclick="location.reload()" style="margin-left: 10px;">
                    🔄 Recargar
                </button>
            </div>
        `;
    }

    private showGenericError(componentName: string): void {
        const main = this.shadowRoot?.querySelector('#main-content');
        if (!main) return;
        
        main.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; padding: 20px; text-align: center; background: white; margin: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
                <h1 style="color: #dc3545; margin-bottom: 20px;">⚠️ Error de Componente</h1>
                <p style="color: #666; margin-bottom: 30px; line-height: 1.6; font-size: 16px;">
                    No se pudo cargar el componente <strong>"${componentName}"</strong>.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" 
                            style="background: #007bff; color: white; border: none; padding: 15px 25px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px;">
                        🔄 Recargar Página
                    </button>
                    <button onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: '/home'}))" 
                            style="background: #28a745; color: white; border: none; padding: 15px 25px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px;">
                        🏠 Ir al Inicio
                    </button>
                    <button onclick="window.debugLoadPage?.()" 
                            style="background: #6f42c1; color: white; border: none; padding: 15px 25px; border-radius: 8px; cursor: pointer; font-weight: 500; font-size: 14px;">
                        🔍 Ver Debug
                    </button>
                </div>
            </div>
        `;
    }

    // Actualizar componentes de navegación para mostrar página activa
    private updateNavigationComponents(route: string): void {
        const sidebar = document.querySelector('lulada-sidebar') as NavigationComponent | null;
        if (sidebar && typeof sidebar.updateActive === 'function') {
            try {
                sidebar.updateActive(route);
            } catch (error) {
                console.warn('[LoadPage] Error actualizando sidebar:', error);
            }
        }
        
        const responsiveBar = document.querySelector('lulada-responsive-bar') as NavigationComponent | null;
        if (responsiveBar && typeof responsiveBar.updateActiveFromRoute === 'function') {
            try {
                responsiveBar.updateActiveFromRoute(route);
            } catch (error) {
                console.warn('[LoadPage] Error actualizando responsive bar:', error);
            }
        }
    }

    private clearAuth(): void {
        try {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('currentUser');
            sessionStorage.clear();
            console.log('[LoadPage] Auth limpiada');
        } catch (error) {
            console.log('[LoadPage] Error limpiando auth:', error);
        }
    }

    // Métodos públicos de la interfaz
    public getCurrentRoute(): string {
        return this.currentRoute;
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
        this.handleNavigation(cleanRoute);
    }

    public isComponentRegistered(componentName: string): boolean {
        try {
            return !!customElements.get(componentName);
        } catch (error) {
            console.error('Error verificando componente:', error);
            return false;
        }
    }

    public debugInfo(): void {
        console.log('=== LOADPAGE DEBUG INFO ===');
        console.log('- Setup completado:', this.isSetup);
        console.log('- Ruta actual:', this.currentRoute);
        console.log('- URL actual:', window.location.pathname);
        console.log('- Firebase Auth State:', this.authState);
        console.log('- Legacy Auth state:', localStorage.getItem('isAuthenticated'));
        console.log('- Current user:', localStorage.getItem('currentUser'));
        
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
            'restaurant-profile',
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
        
        // Verificar componentes de navegación
        const sidebar = document.querySelector('lulada-sidebar');
        const responsiveBar = document.querySelector('lulada-responsive-bar');
        console.log('- Componentes de navegación:');
        console.log(`  Sidebar: ${sidebar ? 'Encontrado' : 'NO encontrado'}`);
        console.log(`  ResponsiveBar: ${responsiveBar ? 'Encontrado' : 'NO encontrado'}`);
        
        const main = this.shadowRoot?.querySelector('#main-content');
        if (main) {
            console.log('- Contenido actual:', main.innerHTML.substring(0, 100) + '...');
            console.log('- Elementos hijos:', main.children.length);
        }
        
        // Debug específico de Firebase
        this.firebaseUserService.debugInfo();
        
        console.log('===========================');
    }

    // Métodos públicos para forzar navegación
    public forceLogin(): void {
        console.log('[LoadPage] 🔧 Forzando login');
        this.navigateTo('/login');
    }

    public forceHome(): void {
        console.log('[LoadPage] 🔧 Forzando home');
        if (!this.authState.isAuthenticated) {
            console.log('[LoadPage] No autenticado con Firebase, redirigiendo a login');
            this.navigateTo('/login');
            return;
        }
        this.navigateTo('/home');
    }

    public async forceLogout(): Promise<void> {
        console.log('[LoadPage] 🔧 Forzando logout Firebase');
        await this.firebaseUserService.signOut();
    }

    public refresh(): void {
        console.log('🔄 Refrescando LoadPage...');
        const currentRoute = this.currentRoute;
        this.handleNavigation(currentRoute);
    }

    public healthCheck(): { [key: string]: boolean } {
        return {
            shadowRootExists: !!this.shadowRoot,
            isSetup: this.isSetup,
            mainElementExists: !!this.shadowRoot?.querySelector('#main-content'),
            navigationConfigured: this.isSetup,
            currentRouteSet: this.currentRoute !== '',
            firebaseAuthenticated: this.authState.isAuthenticated,
            firebaseLoading: this.authState.isLoading,
            firebaseError: !!this.authState.error,
            firebaseUserExists: !!this.authState.user,
            legacyAuthExists: localStorage.getItem('isAuthenticated') === 'true',
            loginComponentRegistered: this.isComponentRegistered('login-page'),
            registerComponentRegistered: this.isComponentRegistered('register-new-account'),
            homeComponentRegistered: this.isComponentRegistered('lulada-home'),
            notificationsComponentRegistered: this.isComponentRegistered('lulada-notifications'),
            settingsComponentRegistered: this.isComponentRegistered('lulada-settings'),
            exploreComponentRegistered: this.isComponentRegistered('lulada-explore'),
            profileComponentRegistered: this.isComponentRegistered('puser-page'),
            saveComponentRegistered: this.isComponentRegistered('save-page'),
            restaurantProfileRegistered: this.isComponentRegistered('restaurant-profile')
        };
    }

    public debugRestaurantNavigation(): void {
        console.log('🍽️ LoadPage: Debug de navegación de restaurantes');
        
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
        
        const main = this.shadowRoot?.querySelector('#main-content');
        const restaurantComponent = main?.querySelector('restaurant-profile');
        console.log('- Componente restaurant-profile en DOM:', !!restaurantComponent);
    }

    // Método para verificar estado de Firebase desde fuera
    public getFirebaseAuthState(): AuthState {
        return { ...this.authState };
    }
}

// Funciones globales para debugging - ACTUALIZADAS
if (typeof window !== 'undefined') {
    // Solo crear las funciones si no existen ya
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
    
    if (!window.forceLogin) {
        window.forceLogin = () => {
            const loadPage = document.querySelector('load-pages') as LoadPageWithMethods | null;
            if (loadPage && typeof loadPage.forceLogin === 'function') {
                loadPage.forceLogin();
            } else {
                console.log('❌ No se encontró el componente load-pages');
            }
        };
    }
    
    if (!window.forceHome) {
        window.forceHome = () => {
            const loadPage = document.querySelector('load-pages') as LoadPageWithMethods | null;
            if (loadPage && typeof loadPage.forceHome === 'function') {
                loadPage.forceHome();
            } else {
                console.log('❌ No se encontró el componente load-pages');
            }
        };
    }
    
    if (!window.debugRestaurantNav) {
        window.debugRestaurantNav = () => {
            const loadPage = document.querySelector('load-pages') as LoadPageWithMethods | null;
            if (loadPage && typeof loadPage.debugRestaurantNavigation === 'function') {
                loadPage.debugRestaurantNavigation();
            } else {
                console.log('❌ No se encontró el componente load-pages');
            }
        };
    }

    if (!window.cleanLoadPageComponents) {
        window.cleanLoadPageComponents = () => {
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

    // Nueva función para debug de Firebase Auth
    if (!window.debugFirebaseAuth) {
        window.debugFirebaseAuth = () => {
            const loadPage = document.querySelector('load-pages') as any;
            if (loadPage && typeof loadPage.getFirebaseAuthState === 'function') {
                const authState = loadPage.getFirebaseAuthState();
                console.log('🔥 Firebase Auth State desde LoadPage:', authState);
                
                // También llamar al debug del servicio
                const firebaseService = getFirebaseUserService();
                firebaseService.debugInfo();
            } else {
                console.log('❌ No se encontró LoadPage con método getFirebaseAuthState');
            }
        };
    }
}

// Registrar el componente
customElements.define('load-pages', LoadPage);

export default LoadPage;