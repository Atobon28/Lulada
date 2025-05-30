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

// Clase principal que maneja la carga y navegación entre páginas
class LoadPage extends HTMLElement implements LoadPageElement {
    private isSetup = false;
    private currentRoute = '/';
    
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
    }

    connectedCallback(){
        this.render();
        if (!this.isSetup) {
            this.setupNavigation();
            this.isSetup = true;
        }
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
    this.updateView(route);
});


        // Navegación a perfil de restaurante
        document.addEventListener('restaurant-selected', () => {
    this.updateView('/restaurant-profile');
});



        // Maneja navegación del navegador (botón atrás/adelante)
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            this.updateView(currentPath);
        });
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
    }

    // Función principal: cambia qué página se muestra
    updateView(route: string){
        if (!this.shadowRoot) {
            return;
        }
        
        const cleanRoute = route.startsWith('/') ? route : '/' + route;
        this.currentRoute = cleanRoute;
        
        // Mapeo de rutas a componentes
        const routeComponentMap: { [key: string]: string } = {
            '/': '<lulada-home></lulada-home>',
            '/home': '<lulada-home></lulada-home>',
            '/notifications': '<lulada-notifications></lulada-notifications>',
            '/save': '<save-page></save-page>',
            '/explore': '<lulada-explore></lulada-explore>',
            '/configurations': '<lulada-settings></lulada-settings>',
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
                newComponent = '<lulada-home></lulada-home>';
                componentName = 'lulada-home';
            }
        } else {
            const match = newComponent.match(/<([^>\s]+)/);
            componentName = match ? match[1] : '';
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

    // Muestra error cuando un componente no se puede cargar
    private showComponentError(route: string, componentName: string): void {
        const main = this.shadowRoot?.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="component-error">
                    <h2> Error de Navegación</h2>
                    <p><strong>Ruta solicitada:</strong> ${route}</p>
                    <p><strong>Componente:</strong> ${componentName}</p>
                    <p><strong>Estado:</strong> ${this.isComponentRegistered(componentName) ? 'Registrado pero falló al cargar' : 'No registrado'}</p>
                    <button class="error-button" onclick="document.dispatchEvent(new CustomEvent('navigate', {detail: '/home'}))">
                         Volver al Inicio
                    </button>
                    <button class="error-button" onclick="window.debugLoadPage?.()" style="margin-left: 10px;">
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
        this.updateView(route);
    }
    
    public isComponentRegistered(componentName: string): boolean {
        return !!customElements.get(componentName);
    }
    
    // Método para debugging
    public debugInfo(): void {
        console.log(' LoadPage Debug Info:');
        console.log('- Ruta actual:', this.getCurrentRoute());
        console.log('- URL actual:', window.location.pathname);
        console.log('- Setup completado:', this.isSetup);
        console.log('- Shadow DOM:', !!this.shadowRoot);
        
        const main = this.shadowRoot?.querySelector('main');
        const currentComponent = main?.querySelector('*');
        console.log('- Componente cargado:', currentComponent?.tagName.toLowerCase() || 'ninguno');
        
        // Verificar componentes críticos
        const componentes = [
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
        this.updateView(this.currentRoute);
    }

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
            saveComponentRegistered: this.isComponentRegistered('save-page'),
            restaurantProfileRegistered: this.isComponentRegistered('restaurant-profile')
        };
    }

    public debugRestaurantNavigation(): void {
        console.log(' LoadPage: Debug de navegación de restaurantes');
        
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
        
        const main = this.shadowRoot?.querySelector('main');
        const restaurantComponent = main?.querySelector('restaurant-profile');
        console.log('- Componente restaurant-profile en DOM:', !!restaurantComponent);
    }
}

// Funciones globales para debugging
if (typeof window !== 'undefined') {
    if (!window.debugLoadPage) {
        window.debugLoadPage = () => {
            const loadPage = document.querySelector('load-pages') as LoadPageElement | null;
            if (loadPage && typeof loadPage.debugInfo === 'function') {
                loadPage.debugInfo();
            } else {
                console.log(' No se encontró el componente load-pages o no tiene método debugInfo');
            }
        };
    }
    
    if (!window.debugRestaurantNav) {
        window.debugRestaurantNav = () => {
            const loadPage = document.querySelector('load-pages') as LoadPage | null;
            if (loadPage && typeof loadPage.debugRestaurantNavigation === 'function') {
                loadPage.debugRestaurantNavigation();
            } else {
                console.log(' No se encontró el componente load-pages');
            }
        };
    }
}

export default LoadPage;