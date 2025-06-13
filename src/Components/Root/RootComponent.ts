// Definimos una clase que extiende HTMLElement para crear un componente web personalizado
class RootComponent extends HTMLElement {
    // Propiedad para guardar qué sección está activa actualmente
    seccionActual: string; 

    // Constructor: se ejecuta cuando se crea una nueva instancia del componente
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super()
        
        // Creamos un Shadow DOM para encapsular nuestros estilos y HTML
        // El modo 'open' significa que se puede acceder desde fuera del componente
        this.attachShadow({ mode: 'open' })
        
        // Establecemos 'main' como la sección inicial por defecto
        this.seccionActual = 'main';
        
        // Si el shadowRoot se creó correctamente
        if (this.shadowRoot) {
            // ✅ CRÍTICO: Definimos el HTML interno del componente con load-pages
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                    }
                    
                    .app-wrapper {
                        width: 100%;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                    }
                    
                    load-pages {
                        flex: 1;
                        width: 100%;
                        height: 100%;
                    }
                </style>
                <div class="app-wrapper">
                    <load-pages></load-pages>
                </div>
            `;
        }
    }

    // ✅ CRÍTICO: connectedCallback para inicializar la aplicación
    connectedCallback() {
        console.log('🚀 RootComponent conectado al DOM');
        
        // Verificar y configurar datos de usuario para la presentación
        this.setupDemoUser();
        
        // Pequeño delay para asegurar que todos los componentes están registrados
        setTimeout(() => {
            this.initializeApp();
        }, 100);
    }

    // ✅ Configurar usuario demo para la presentación
    private setupDemoUser() {
        const isAuth = localStorage.getItem('isAuthenticated');
        const hasUser = localStorage.getItem('currentUser');
        
        if (!isAuth || !hasUser) {
            console.log('🎭 Configurando usuario demo para presentación...');
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                nombreDeUsuario: 'demo_lulada',
                nombre: 'Usuario Demo',
                descripcion: 'Bienvenido a Lulada - Descubre los mejores restaurantes de Cali. Esta es una demostración de nuestra plataforma de reseñas gastronómicas.',
                rol: 'persona',
                locationText: 'Cali, Colombia',
                menuLink: ''
            }));
            console.log('✅ Usuario demo configurado exitosamente');
        } else {
            console.log('ℹ️ Usuario ya configurado');
        }
    }

    // ✅ Método para inicializar la aplicación
    private initializeApp() {
        const loadPagesComponent = this.shadowRoot?.querySelector('load-pages');
        
        if (!loadPagesComponent) {
            console.error('❌ load-pages no encontrado, reintentando...');
            setTimeout(() => {
                this.initializeApp();
            }, 100);
            return;
        }

        console.log('✅ load-pages encontrado, iniciando navegación...');
        
        // Determinar ruta inicial - siempre ir a home para la presentación
        const currentPath = window.location.pathname;
        let initialRoute = '/home';
        
        // Si hay una ruta específica en la URL, usarla
        if (currentPath && currentPath !== '/') {
            initialRoute = currentPath;
        }
        
        console.log('🎯 Navegando a ruta inicial:', initialRoute);
        
        // Navegar a la ruta inicial
        setTimeout(() => {
            const navigationEvent = new CustomEvent('navigate', {
                detail: initialRoute,
                bubbles: true,
                composed: true
            });
            document.dispatchEvent(navigationEvent);
            console.log('🎉 Navegación inicial completada');
        }, 150);
    }
       
    // Método para cambiar de página/sección dentro de la aplicación
    // Recibe como parámetro el nombre de la sección a la que queremos ir
    changePage(section: string) { // Ejemplos: 'profile', 'settings', 'antojar', etc.
        
        // Actualizamos la propiedad con la nueva sección actual
        this.seccionActual = section;
        
        // Emitir evento de navegación en lugar de manipular DOM directamente
        const navEvent = new CustomEvent('navigate', {
            detail: section,
            bubbles: true,
            composed: true
        });
        document.dispatchEvent(navEvent);
        
        console.log(`🧭 RootComponent: Navegando a ${section}`);
    }

    // ✅ Método público para navegación durante la presentación
    public navigateToPage(pageName: string) {
        const routes: { [key: string]: string } = {
            'home': '/home',
            'inicio': '/home',
            'explore': '/explore',
            'explorar': '/explore',
            'settings': '/settings',
            'configuracion': '/settings',
            'profile': '/profile',
            'perfil': '/profile',
            'save': '/save',
            'guardados': '/save',
            'notifications': '/notifications',
            'notificaciones': '/notifications',
            'login': '/login'
        };

        const route = routes[pageName.toLowerCase()] || '/home';
        this.changePage(route);
    }

    // ✅ Método para debuggear durante la presentación
    public debugStatus() {
        console.log('🔍 === ESTADO DE LA APLICACIÓN ===');
        console.log('- RootComponent activo:', !!this.isConnected);
        console.log('- LoadPages presente:', !!this.shadowRoot?.querySelector('load-pages'));
        console.log('- Usuario autenticado:', localStorage.getItem('isAuthenticated'));
        
        try {
            const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
            console.log('- Datos de usuario:', userData);
        } catch {
            console.log('- Datos de usuario: Error al parsear');
        }
        
        console.log('- Sección actual:', this.seccionActual);
        console.log('- URL actual:', window.location.pathname);
        
        // Verificar estado de load-pages
        const loadPages = this.shadowRoot?.querySelector('load-pages') as any;
        if (loadPages && typeof loadPages.debugInfo === 'function') {
            loadPages.debugInfo();
        }
        
        console.log('=== FIN ESTADO ===');
    }

    // ✅ Método para forzar reinicialización
    public forceRestart() {
        console.log('🔄 Forzando reinicio de la aplicación...');
        
        // Limpiar y reconfigurar
        this.setupDemoUser();
        
        // Reinicializar navegación
        setTimeout(() => {
            this.initializeApp();
        }, 100);
    }

    // ✅ Método para navegación rápida durante la presentación
    public quickNav(destination: string) {
        const quickRoutes: { [key: string]: string } = {
            'h': '/home',
            'home': '/home',
            'p': '/profile', 
            'profile': '/profile',
            'e': '/explore',
            'explore': '/explore',
            's': '/settings',
            'settings': '/settings',
            'save': '/save',
            'g': '/save',
            'guardados': '/save',
            'n': '/notifications',
            'notifications': '/notifications'
        };

        const route = quickRoutes[destination.toLowerCase()];
        if (route) {
            this.changePage(route);
            console.log(`⚡ Navegación rápida a: ${destination} -> ${route}`);
        } else {
            console.log('❌ Ruta no reconocida. Opciones:', Object.keys(quickRoutes).join(', '));
        }
    }
}

// ✅ Hacer métodos disponibles globalmente para la presentación
if (typeof window !== 'undefined') {
    // Navegación simple
    (window as any).nav = (pageName: string) => {
        const rootComponent = document.querySelector('root-component') as RootComponent;
        if (rootComponent) {
            rootComponent.navigateToPage(pageName);
        } else {
            // Fallback directo
            document.dispatchEvent(new CustomEvent('navigate', {
                detail: pageName.startsWith('/') ? pageName : `/${pageName}`,
                bubbles: true,
                composed: true
            }));
        }
    };

    // Navegación ultra-rápida
    (window as any).go = (destination: string) => {
        const rootComponent = document.querySelector('root-component') as RootComponent;
        if (rootComponent) {
            rootComponent.quickNav(destination);
        }
    };

    // Debug completo
    (window as any).debug = () => {
        const rootComponent = document.querySelector('root-component') as RootComponent;
        if (rootComponent) {
            rootComponent.debugStatus();
        }
    };

    // Reinicio de emergencia
    (window as any).restart = () => {
        const rootComponent = document.querySelector('root-component') as RootComponent;
        if (rootComponent) {
            rootComponent.forceRestart();
        } else {
            window.location.reload();
        }
    };

    // Setup inicial para presentación
    (window as any).setupPresentation = () => {
        console.log('🎯 === CONFIGURACIÓN DE PRESENTACIÓN ===');
        console.log('Comandos disponibles:');
        console.log('- nav("home") o nav("profile") - Navegación normal');
        console.log('- go("h") o go("p") - Navegación rápida');
        console.log('- debug() - Ver estado completo');
        console.log('- restart() - Reiniciar aplicación');
        console.log('=====================================');
        
        // Auto-configurar usuario demo
        const rootComponent = document.querySelector('root-component') as RootComponent;
        if (rootComponent) {
            rootComponent.forceRestart();
        }
    };

    // Auto-ejecutar setup cuando se carga la página
    setTimeout(() => {
        if (!(window as any).presentationSetup) {
            (window as any).setupPresentation();
            (window as any).presentationSetup = true;
        }
    }, 2000);
}

// Exportamos la clase para que pueda ser importada y usada en otros archivos
export default RootComponent;