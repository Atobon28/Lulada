// Definimos interfaces para que TypeScript sepa qué métodos deben tener nuestros componentes
interface LoadPageElement extends HTMLElement {
    getCurrentRoute(): string;  // Método para obtener la ruta actual
    navigateTo(route: string): void;  // Método para navegar a una ruta específica
    debugInfo(): void;  // Método para mostrar información de debug
    isComponentRegistered(componentName: string): boolean;  // Verificar si un componente está registrado
 }
 
 // Interface para componentes de navegación como sidebar y barra responsive
 interface NavigationComponent extends HTMLElement {
    updateActive?(route: string): void;  // Actualizar qué elemento está activo
    updateActiveFromRoute?(route: string): void;  // Actualizar desde una ruta específica
 }
 
 // Clase principal que maneja la carga y navegación entre diferentes páginas
 class LoadPage extends HTMLElement implements LoadPageElement {
    private isSetup = false;  // Bandera para saber si ya se configuró la navegación
    private currentRoute = '/';  // Almacena la ruta actual en la que estamos
    
    constructor(){
        super();
        // Creamos un shadow DOM para aislar los estilos de este componente
        this.attachShadow({ mode: 'open'});
        console.log(' LoadPage: Constructor ejecutado');
    }
 
    // Se ejecuta cuando el componente se conecta al DOM
    connectedCallback(){
        console.log(' LoadPage: ConnectedCallback ejecutado');
        this.render();  // Dibujamos el componente
        // Solo configuramos la navegación una vez
        if (!this.isSetup) {
            this.setupNavigation();
            this.isSetup = true;
        }
    }
 
    // Configura todos los event listeners para la navegación
    private setupNavigation(){
        console.log(' LoadPage: Configurando navegación...');
        
        // Intercepta clicks en enlaces dentro del componente
        this.shadowRoot!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
 
            // Si alguien hace click en un enlace, prevenir el comportamiento normal
            if (link && link.href) {
                e.preventDefault();
                console.log(' LoadPage: Link interceptado:', link.href);
            }
        });
 
        // Escucha eventos de navegación que vienen de otros componentes
        document.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            const route = customEvent.detail;  // La ruta a la que queremos ir
            console.log(' LoadPage: Recibido evento de navegación:', route);
            this.updateView(route);  // Cambiamos la vista
        });
 
        // Escucha cuando alguien selecciona un restaurante (caso especial)
        document.addEventListener('restaurant-selected', (event: Event) => {
            const customEvent = event as CustomEvent;
            const restaurantInfo = customEvent.detail;
            console.log(' LoadPage: Restaurante seleccionado:', restaurantInfo);
            
            // Automáticamente navegamos al perfil del restaurante
            this.updateView('/restaurant-profile');
        });
 
        // Maneja la navegación del navegador (botón atrás/adelante)
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            console.log(' LoadPage: Navegación del navegador:', currentPath);
            this.updateView(currentPath);
        });
 
        console.log(' LoadPage: Navegación configurada');
    }
 
    // Dibuja el HTML básico del componente
    render(){
        console.log(' LoadPage: Renderizando...');
        
        if (!this.shadowRoot) {
            console.error('LoadPage: No hay shadowRoot disponible');
            return;
        }
 
        // Definimos todo el HTML y CSS del componente
        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* El componente ocupa toda la pantalla */
                :host {
                    display: block;
                    width: 100%;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                /* Contenedor principal de la aplicación */
                .app-container {
                    width: 100%;
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                /* Elemento main donde se cargan las diferentes páginas */
                main {
                    width: 100%;
                    min-height: 100vh;
                    display: block;
                }
                
                /* Estilos para cuando un componente falla al cargar */
                .component-error {
                    padding: 40px;
                    text-align: center;
                    background: white;
                    margin: 20px;
                    border-radius: 10px;
                    border: 2px dashed #ff6b6b;
                    color: #d63031;
                }
                
                /* Mensaje de carga mientras se cargan los componentes */
                .loading {
                    padding: 40px;
                    text-align: center;
                    background: white;
                    margin: 20px;
                    border-radius: 10px;
                    color: #666;
                }
 
                /* Contenido de respaldo si algo falla */
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
 
                /* Estilo para botones de error */
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
            
            <!-- Estructura básica: un contenedor con un main donde van las páginas -->
            <div class="app-container">
                <main>
                    <lulada-home></lulada-home>
                </main>
            </div>
        `;
        
        console.log(' LoadPage: Renderizado completado');
    }
 
    // La función más importante: cambia qué página se muestra
    updateView(route: string){
        console.log(' LoadPage: Actualizando vista a:', route);
        
        if (!this.shadowRoot) {
            console.error(' LoadPage: No hay shadowRoot para actualizar');
            return;
        }
        
        // Limpiamos la ruta: nos aseguramos que empiece con "/"
        const cleanRoute = route.startsWith('/') ? route : '/' + route;
        this.currentRoute = cleanRoute;
        console.log('🧹 LoadPage: Ruta limpia:', cleanRoute);
        
        // Este es el "diccionario" que dice qué componente mostrar para cada ruta
        const routeComponentMap: { [key: string]: string } = {
            '/': '<lulada-home></lulada-home>',                              // Página principal
            '/home': '<lulada-home></lulada-home>',                          // También página principal
            '/notifications': '<lulada-notifications></lulada-notifications>',  // Notificaciones
            '/save': '<save-page></save-page>',                              // Guardados
            '/explore': '<lulada-explore></lulada-explore>',                 // Explorar
            '/configurations': '<lulada-settings></lulada-settings>',        // Configuraciones
            '/profile': '<puser-page></puser-page>',                         // Perfil de usuario
            '/restaurant-profile': '<restaurant-profile></restaurant-profile>', // Perfil de restaurante
            '/cambiar-correo': '<lulada-cambiar-correo></lulada-cambiar-correo>',      // Cambiar correo
            '/cambiar-nombre': '<lulada-cambiar-nombre></lulada-cambiar-nombre>',      // Cambiar nombre
            '/cambiar-contraseña': '<lulada-cambiar-contraseña></lulada-cambiar-contraseña>', // Cambiar contraseña
            '/login': '<login-page></login-page>',                           // Página de login
            '/register': '<register-new-account></register-new-account>'      // Registro
        };
        
        // Buscamos qué componente corresponde a la ruta
        let newComponent = routeComponentMap[cleanRoute];
        let componentName = '';
        
        // Si no encontramos una ruta exacta, verificamos rutas especiales
        if (!newComponent) {
            // Ruta dinámica para perfiles de restaurante específicos
            if (cleanRoute.startsWith('/restaurant-profile/')) {
                newComponent = '<restaurant-profile></restaurant-profile>';
                componentName = 'restaurant-profile';
                console.log(' LoadPage: Ruta dinámica de restaurante detectada:', cleanRoute);
            } else {
                // Si no sabemos qué mostrar, mostramos el home
                console.warn(' LoadPage: Ruta no reconocida:', cleanRoute, '- Mostrando home');
                newComponent = '<lulada-home></lulada-home>';
                componentName = 'lulada-home';
            }
        } else {
            // Extraemos el nombre del componente del HTML
            const match = newComponent.match(/<([^>\s]+)/);
            componentName = match ? match[1] : '';
        }
        
        // Verificamos que el componente esté registrado en el navegador
        if (componentName && !this.isComponentRegistered(componentName)) {
            console.error(` LoadPage: Componente ${componentName} no está registrado`);
            this.showComponentError(cleanRoute, componentName);
            return;
        }
        
        // Buscamos el elemento <main> donde vamos a poner la nueva página
        const main = this.shadowRoot.querySelector('main');
        if (main) {
            console.log(' LoadPage: Cargando componente:', componentName);
            
            // Mostramos un mensaje de "Cargando..." mientras cambiamos
            main.innerHTML = '<div class="loading">Cargando...</div>';
            
            // Pequeña pausa para mejor experiencia de usuario
            setTimeout(() => {
                // Reemplazamos el contenido con el nuevo componente
                main.innerHTML = newComponent;
                
                // Verificamos que el componente se haya cargado bien
                setTimeout(() => {
                    const loadedComponent = main.querySelector('*');
                    if (loadedComponent) {
                        console.log(' LoadPage: Componente cargado exitosamente:', loadedComponent.tagName.toLowerCase());
                        
                        // Verificamos que el componente tenga contenido
                        if (loadedComponent.shadowRoot || loadedComponent.innerHTML.trim()) {
                            console.log(' LoadPage: Componente tiene contenido');
                        } else {
                            console.warn(' LoadPage: Componente cargado pero sin contenido visible');
                            
                            // Damos más tiempo para componentes que cargan lento
                            setTimeout(() => {
                                if (!loadedComponent.shadowRoot && !loadedComponent.innerHTML.trim()) {
                                    console.error(' LoadPage: Componente sin contenido después de espera adicional');
                                    this.showComponentError(cleanRoute, componentName);
                                }
                            }, 1000);
                        }
                    } else {
                        console.error(' LoadPage: El componente no se cargó correctamente');
                        this.showComponentError(cleanRoute, componentName);
                    }
                }, 100);
            }, 50);
        } else {
            console.error(' LoadPage: No se encontró el elemento main');
        }
        
        // Hacemos scroll hacia arriba cuando cambiamos de página
        window.scrollTo(0, 0);
        
        // Actualizamos la URL del navegador sin recargar la página
        if (window.history && window.history.pushState && window.location.pathname !== cleanRoute) {
            window.history.pushState(null, '', cleanRoute);
            console.log(' LoadPage: URL actualizada a:', cleanRoute);
        }
        
        // Actualizamos los componentes de navegación para que muestren la página activa
        this.updateNavigationComponents(cleanRoute);
    }
 
    // Muestra un mensaje de error cuando un componente no se puede cargar
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
    
    // Actualiza los componentes de navegación (sidebar, barra responsive) para mostrar qué página está activa
    private updateNavigationComponents(route: string): void {
        console.log(' LoadPage: Actualizando componentes de navegación para:', route);
        
        // Actualizamos el sidebar si existe
        const sidebar = document.querySelector('lulada-sidebar') as NavigationComponent | null;
        if (sidebar && typeof sidebar.updateActive === 'function') {
            sidebar.updateActive(route);
            console.log(' LoadPage: Sidebar actualizado');
        }
        
        // Actualizamos la barra responsive si existe
        const responsiveBar = document.querySelector('lulada-responsive-bar') as NavigationComponent | null;
        if (responsiveBar && typeof responsiveBar.updateActiveFromRoute === 'function') {
            responsiveBar.updateActiveFromRoute(route);
            console.log(' LoadPage: ResponsiveBar actualizado');
        }
    }
 
    // Método público para obtener la ruta actual
    public getCurrentRoute(): string {
        return this.currentRoute;
    }
 
    // Método público para navegar programáticamente a una ruta
    public navigateTo(route: string): void {
        console.log(' LoadPage: Navegación programática a:', route);
        this.updateView(route);
    }
    
    // Método público para verificar si un componente está registrado en el navegador
    public isComponentRegistered(componentName: string): boolean {
        return !!customElements.get(componentName);
    }
    
    // Método público para mostrar información completa de debug
    public debugInfo(): void {
        console.log(' LoadPage Debug Info:');
        console.log('- Ruta actual:', this.getCurrentRoute());
        console.log('- URL actual:', window.location.pathname);
        console.log('- Setup completado:', this.isSetup);
        console.log('- Shadow DOM:', !!this.shadowRoot);
        
        // Información sobre el componente actual
        const main = this.shadowRoot?.querySelector('main');
        const currentComponent = main?.querySelector('*');
        console.log('- Componente cargado:', currentComponent?.tagName.toLowerCase() || 'ninguno');
        
        // Lista de componentes críticos para verificar
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
        
        // Verificamos el estado de cada componente
        console.log('- Componentes críticos:');
        componentes.forEach(name => {
            const registered = this.isComponentRegistered(name);
            const inDOM = !!document.querySelector(name);
            console.log(`  ${registered ? '✅' : '❌'} ${name}: ${registered ? 'Registrado' : 'NO Registrado'} | ${inDOM ? 'En DOM' : 'NO en DOM'}`);
        });
        
        // Debug de componentes de navegación
        console.log('- Componentes de navegación:');
        const sidebar = document.querySelector('lulada-sidebar');
        const responsiveBar = document.querySelector('lulada-responsive-bar');
        console.log(`  Sidebar: ${sidebar ? 'Encontrado' : 'NO encontrado'}`);
        console.log(`  ResponsiveBar: ${responsiveBar ? 'Encontrado' : 'NO encontrado'}`);
        
        // Debug específico para restaurantes
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
 
    // Método público para forzar una actualización completa
    public forceUpdate(): void {
        console.log('LoadPage: Forzando actualización...');
        this.updateView(this.currentRoute);
    }
 
    // Método público para verificar el estado general del sistema
    public healthCheck(): { [key: string]: boolean } {
        return {
            shadowRootExists: !!this.shadowRoot,                    // ¿Existe el shadow DOM?
            isSetup: this.isSetup,                                   // ¿Se configuró la navegación?
            mainElementExists: !!this.shadowRoot?.querySelector('main'), // ¿Existe el elemento main?
            navigationConfigured: this.isSetup,                     // ¿Navegación configurada?
            currentRouteSet: this.currentRoute !== '',              // ¿Hay ruta actual?
            homeComponentRegistered: this.isComponentRegistered('lulada-home'),           // ¿Home registrado?
            notificationsComponentRegistered: this.isComponentRegistered('lulada-notifications'), // ¿Notificaciones registrado?
            settingsComponentRegistered: this.isComponentRegistered('lulada-settings'),   // ¿Settings registrado?
            exploreComponentRegistered: this.isComponentRegistered('lulada-explore'),     // ¿Explore registrado?
            profileComponentRegistered: this.isComponentRegistered('puser-page'),         // ¿Profile registrado?
            saveComponentRegistered: this.isComponentRegistered('save-page'),            // ¿Save registrado?
            restaurantProfileRegistered: this.isComponentRegistered('restaurant-profile') // ¿Restaurant profile registrado?
        };
    }
 
    // Método público específico para hacer debug de la navegación de restaurantes
    public debugRestaurantNavigation(): void {
        console.log(' LoadPage: Debug de navegación de restaurantes');
        
        // Verificamos si el componente de restaurante está registrado
        const isRegistered = this.isComponentRegistered('restaurant-profile');
        console.log('- restaurant-profile registrado:', isRegistered);
        
        // Verificamos la información almacenada en sessionStorage
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
        
        // Verificamos si estamos en una ruta de restaurante
        const isRestaurantRoute = this.currentRoute.includes('restaurant-profile');
        console.log('- En ruta de restaurante:', isRestaurantRoute);
        console.log('- Ruta actual:', this.currentRoute);
        
        // Verificamos si el componente está en el DOM
        const main = this.shadowRoot?.querySelector('main');
        const restaurantComponent = main?.querySelector('restaurant-profile');
        console.log('- Componente restaurant-profile en DOM:', !!restaurantComponent);
    }
 }
 
 // Exponemos funciones para debugging en la consola del navegador
 if (typeof window !== 'undefined') {
    // Función global para hacer debug del LoadPage
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
    
    // Función específica para debug de navegación de restaurantes
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