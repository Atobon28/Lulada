// index.ts - VERSIÓN CORREGIDA CON IMPORTS/EXPORTS ARREGLADOS
// ====================================================================

// =======================
// DECLARACIONES GLOBALES
// =======================
export {};

// Importar servicios básicos primero
import './services-global';

// =======================
// INTERFACES TIPADAS
// =======================

interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

interface PublicationsServiceInstance {
    getInstance?(): PublicationsServiceInstance;
    [key: string]: unknown;
}

interface AntojarServiceInstance {
    getInstance?(): AntojarServiceInstance;
    initialize?(): void;
    [key: string]: unknown;
}

interface InteractionServiceInstance {
    getInstance(): InteractionServiceInstance;
    loadInteractions?(): void;
    [key: string]: unknown;
}

interface SidebarElement extends HTMLElement {
    debugNavigation?(): void;
}

interface LuladaServices {
    publicationsService: PublicationsServiceInstance | null;
    antojarService: AntojarServiceInstance | null;
}

// CORREGIDO: Interface que extiende Window correctamente
interface WindowWithGlobalProperties extends Window {
    AntojarPopupService?: unknown;
    LuladaServices?: LuladaServices;
    debugSidebar?: () => void;
    luladaStatus?: () => void;
    luladaDebug?: () => void;
    // CORREGIDO: UserActions debe tener métodos específicos
    UserActions?: {
        loadUserData: (userData: UserData) => void;
        updateUserData: (userData: UserData) => void;
        updateUsername: (newUsername: string) => void;
        updateFullName: (newName: string) => void;
        resetProfile: () => void;
    };
    userStore?: unknown;
    authGuard?: unknown;
    authManager?: AuthenticationManager;
}

// AGREGADO: Interface UserData que faltaba
interface UserData {
    foto?: string;
    nombreDeUsuario?: string;
    nombre?: string;
    descripcion?: string;
    rol?: string;
}

// =======================
// IMPORTS - TODOS LOS COMPONENTES EXISTENTES
// =======================

// CORE
import RootComponent from "./Components/Root/RootComponent";
import LoadPage from "./Components/LoadPages/LoadPage";

// PÁGINAS
import Home from "./Pages/Home/home";
import LuladaExplore from "./Pages/Explore/explore";
import PUser from "./Pages/PUser/puser";
import RestaurantProfile from "./Pages/RestaurantProfile/RestaurantProfile";
import Save from "./Pages/Save/Save";
import LoginPage from "./Pages/LogIn/Login";
import LuladaSettings from "./Pages/Settings/Settings";
import LuladaNotifications from './Pages/Notifications/Notifications';
import NewAccount from "./Pages/NewAccount/containernewaccount";
import ConfirmRole from "./Pages/ConfirmRole/ConfirRole";

// SETTINGS
import CambiarCorreoF from "./Pages/Settings/CambiarCorreo/CambiarCorreoF";
import NombreUsuraio from "./Pages/Settings/CambiarNombre/CambiarNombreF";
import CambiarContraseñaF from "./Pages/Settings/CambiarContraseña/CambiarContraseñaF";

// NAVEGACIÓN
import Navigation from "./Components/Home/navigation";
import './Components/Home/Header/reponsiveheader';
import LuladaSidebar from "./Components/Home/Navbars/sidebar";

// HEADERS
import HeaderCompleto from './Components/Home/Header/HeaderCompleto';
import HeaderHome from "./Components/Home/Header/Header";
import Lulada from "./Components/Home/Header/logo";
import HeaderExplorer from "./Components/Explore/exploreHeader";

// PUBLICACIONES
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";

// EXPLORACIÓN
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";

// USUARIO
// CORREGIDO: Import con alias para evitar conflictos
import { UserInfo } from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
// CORREGIDO: Import con destructuring
import { EditProfileModal } from "./Components/PUser/userProfile/EditProfileModal";
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";

// OTROS
import LuladaSuggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";

// LOGIN
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";

// NEW ACCOUNT
import BoxText from "./Components/Newaccount/boxtext";
import ButtonNewAccount from "./Components/Newaccount/buttonNewAccount";

// SETTINGS COMPONENTS
import CajonTexto from "./Components/Settings/CajonTexto";
import CajonList from "./Components/Settings/CajonList";
import CajonListInteractive from "./Components/Settings/CajonListInteractive";
import CambiarNU from "./Components/Settings/CambiarNombre/cambiarNU";
import Cambiarco from "./Components/Settings/CambiarCorreo/cambiarco";
import CambiarContra from "./Components/Settings/CambiarContraseña/cambiarcontra";
import CambiarCorreoSimple from "./Components/Settings/CambiarCorreoSimple";
import CambiarNombreSimple from "./Components/Settings/CambiarNombreSimple";
import CambiarContrasenaSimple from "./Components/Settings/CambiarContrasenaSimple";

// =======================
// IMPORTS OPCIONALES (QUE PUEDEN FALLAR)
// =======================
let NavigationBar: ComponentConstructor | null = null;
let LuladaAntojar: ComponentConstructor | null = null;
let LuladaAntojarBoton: ComponentConstructor | null = null;
let PublicationsService: PublicationsServiceInstance | null = null;
let AntojarPopupService: AntojarServiceInstance | null = null;
let InteractionService: InteractionServiceInstance | null = null;

// Función helper para imports seguros
function safeImport(path: string, componentName: string): ComponentConstructor | null {
    try {
        const module = require(path);
        return module[componentName] || module.default || null;
    } catch (error) {
        console.log(`${componentName} no disponible`);
        return null;
    }
}

// Cargar componentes opcionales
NavigationBar = safeImport('./Components/Home/Navbars/responsivebar', 'NavigationBar');
LuladaAntojar = safeImport('./Components/Home/Antojar/antojar', 'LuladaAntojar');
LuladaAntojarBoton = safeImport('./Components/Home/Antojar/antojar-boton', 'LuladaAntojarBoton');

// Cargar servicios opcionales
try {
    const PublicationsServiceModule = require('./Services/PublicationsService');
    PublicationsService = PublicationsServiceModule.default;
} catch (error) {
    console.log('PublicationsService no disponible');
}

try {
    const AntojarPopupServiceModule = require('./Components/Home/Antojar/antojar-popup');
    AntojarPopupService = AntojarPopupServiceModule.default;
} catch (error) {
    console.log('AntojarPopupService no disponible');
}

try {
    const interactionModule = require('./Services/flux/Interactionservice');
    InteractionService = interactionModule.InteractionService;
} catch (error) {
    console.log('InteractionService no disponible');
}

// =======================
// SISTEMA DE AUTENTICACIÓN CORREGIDO
// =======================

class AuthenticationManager {
    private isAuthenticated: boolean = false;
    private currentUser: unknown = null;
    private loadPage: any = null;
    private initializationComplete: boolean = false;

    constructor() {
        console.log('🔐 Inicializando AuthenticationManager...');
        this.checkAuthenticationStatus();
        this.setupAuthenticationListeners();
        this.waitForComponents();
    }

    private async waitForComponents(): Promise<void> {
        // Esperar a que LoadPage esté disponible
        let attempts = 0;
        const maxAttempts = 50;
        
        while (!this.loadPage && attempts < maxAttempts) {
            this.loadPage = document.querySelector('load-pages');
            if (!this.loadPage) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
        }

        if (this.loadPage) {
            console.log('✅ LoadPage encontrado, configurando navegación inicial');
            this.initializeNavigation();
        } else {
            console.warn('⚠️ LoadPage no encontrado después de 5 segundos, usando navegación básica');
            this.fallbackNavigation();
        }
    }

    private initializeNavigation(): void {
        this.initializationComplete = true;
        
        // Determinar ruta inicial basada en autenticación
        const currentRoute = window.location.pathname;
        console.log('🧭 Ruta actual:', currentRoute);
        
        if (this.isAuthenticated) {
            if (currentRoute === '/login' || currentRoute === '/register' || currentRoute === '/') {
                console.log('✅ Usuario autenticado, redirigiendo a home');
                this.navigateToPage('/home');
            } else {
                console.log('✅ Usuario autenticado, manteniendo ruta actual:', currentRoute);
                this.navigateToPage(currentRoute);
            }
        } else {
            console.log('🔒 Usuario no autenticado, redirigiendo a login');
            this.navigateToPage('/login');
        }
    }

    private fallbackNavigation(): void {
        this.initializationComplete = true;
        
        if (!this.isAuthenticated) {
            console.log('🔒 Navegación fallback: redirigiendo a login');
            window.location.href = '/login';
        } else {
            console.log('✅ Navegación fallback: redirigiendo a home');
            window.location.href = '/home';
        }
    }

    private checkAuthenticationStatus(): void {
        try {
            const authStatus = localStorage.getItem('isAuthenticated') === 'true';
            const currentUser = localStorage.getItem('currentUser');
            
            this.isAuthenticated = authStatus && !!currentUser;
            if (currentUser) {
                this.currentUser = JSON.parse(currentUser);
            }
            
            console.log('🔐 Estado de autenticación:', this.isAuthenticated ? 'Autenticado' : 'No autenticado');
            console.log('👤 Usuario actual:', this.currentUser ? 'Cargado' : 'No disponible');
        } catch (error) {
            console.error('❌ Error verificando autenticación:', error);
            this.isAuthenticated = false;
            this.currentUser = null;
        }
    }

    private setupAuthenticationListeners(): void {
        // Escuchar eventos de autenticación exitosa
        document.addEventListener('auth-success', (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('✅ Autenticación exitosa detectada');
            this.isAuthenticated = true;
            this.currentUser = customEvent.detail.userData || customEvent.detail;
            
            // Actualizar localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            // Navegar a home después de autenticación exitosa
            setTimeout(() => {
                this.navigateToPage('/home');
            }, 1000);
        });

        // Escuchar eventos de logout
        document.addEventListener('auth-logout', () => {
            console.log('🚪 Logout detectado');
            this.logout();
        });

        // Escuchar eventos de navegación
        document.addEventListener('navigate', (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            const route = customEvent.detail;
            if (this.initializationComplete) {
                this.handleNavigation(route);
            }
        });

        // Escuchar cambios en la ruta del navegador
        window.addEventListener('popstate', () => {
            if (this.initializationComplete) {
                const currentRoute = window.location.pathname;
                console.log('🔄 Navegación del navegador detectada:', currentRoute);
                this.handleNavigation(currentRoute);
            }
        });
    }

    private handleNavigation(route: string): void {
        console.log(`🧭 Navegación solicitada: ${route}`);
        
        // Rutas que requieren autenticación
        const protectedRoutes = [
            '/home', '/profile', '/save', '/explore', '/settings', 
            '/notifications', '/restaurant-profile', '/configurations',
            '/cambiar-correo', '/cambiar-nombre', '/cambiar-contraseña'
        ];
        
        // Rutas públicas
        const publicRoutes = ['/login', '/register'];
        
        // Verificar si es una ruta protegida
        const isProtectedRoute = protectedRoutes.includes(route) || route.startsWith('/restaurant-profile/');
        
        if (isProtectedRoute && !this.isAuthenticated) {
            console.log('🔒 Ruta protegida, redirigiendo a login');
            this.navigateToPage('/login');
            return;
        }

        // Si ya está autenticado y trata de ir a rutas de autenticación, redirigir a home
        if (publicRoutes.includes(route) && this.isAuthenticated) {
            console.log('✅ Usuario ya autenticado, redirigiendo a home');
            this.navigateToPage('/home');
            return;
        }

        // Navegación normal
        this.navigateToPage(route);
    }

    private navigateToPage(route: string): void {
        console.log(`📍 Navegando a: ${route}`);
        
        // Actualizar URL del navegador si es diferente
        if (window.location.pathname !== route) {
            window.history.pushState({}, '', route);
        }

        // Usar LoadPage si está disponible
        if (this.loadPage && typeof this.loadPage.updateView === 'function') {
            this.loadPage.updateView(route);
        } else {
            // Fallback: usar root-component directamente
            this.showPageWithRootComponent(route);
        }
    }

    private showPageWithRootComponent(route: string): void {
        console.log(`📄 Mostrando página usando root-component: ${route}`);
        
        // Buscar o crear root-component
        let rootComponent = document.querySelector('root-component');
        if (!rootComponent) {
            rootComponent = document.createElement('root-component');
            document.body.innerHTML = '';
            document.body.appendChild(rootComponent);
        }

        // Crear el contenido basado en la ruta
        let pageContent = '';
        
        switch (route) {
            case '/login':
                pageContent = '<login-page></login-page>';
                break;
            case '/register':
                pageContent = '<register-new-account></register-new-account>';
                break;
            case '/home':
                pageContent = `
                    <lulada-header-complete></lulada-header-complete>
                    <lulada-home></lulada-home>
                    <lulada-navigation></lulada-navigation>
                `;
                break;
            case '/profile':
                pageContent = `
                    <lulada-header-complete></lulada-header-complete>
                    <puser-page></puser-page>
                    <lulada-navigation></lulada-navigation>
                `;
                break;
            case '/explore':
                pageContent = `
                    <lulada-header-complete></lulada-header-complete>
                    <lulada-explore></lulada-explore>
                    <lulada-navigation></lulada-navigation>
                `;
                break;
            case '/save':
                pageContent = `
                    <lulada-header-complete></lulada-header-complete>
                    <save-page></save-page>
                    <lulada-navigation></lulada-navigation>
                `;
                break;
            case '/settings':
            case '/configurations':
                pageContent = `
                    <lulada-header-complete></lulada-header-complete>
                    <lulada-settings></lulada-settings>
                    <lulada-navigation></lulada-navigation>
                `;
                break;
            case '/notifications':
                pageContent = `
                    <lulada-header-complete></lulada-header-complete>
                    <lulada-notifications></lulada-notifications>
                    <lulada-navigation></lulada-navigation>
                `;
                break;
            default:
                if (route.startsWith('/restaurant-profile')) {
                    pageContent = `
                        <lulada-header-complete></lulada-header-complete>
                        <restaurant-profile></restaurant-profile>
                        <lulada-navigation></lulada-navigation>
                    `;
                } else {
                    // Ruta no reconocida
                    if (this.isAuthenticated) {
                        this.navigateToPage('/home');
                    } else {
                        this.navigateToPage('/login');
                    }
                    return;
                }
                break;
        }

        // Actualizar contenido del root component
        rootComponent.innerHTML = pageContent;
        
        // Scroll al top
        window.scrollTo(0, 0);
    }

    public logout(): void {
        console.log('🚪 Cerrando sesión...');
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Limpiar localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        
        // Disparar evento de logout
        document.dispatchEvent(new CustomEvent('auth-logout'));
        
        // Navegar a login
        this.navigateToPage('/login');
    }

    public getCurrentRoute(): string {
        return window.location.pathname;
    }

    public getAuthStatus(): boolean {
        return this.isAuthenticated;
    }

    public getCurrentUser(): unknown {
        return this.currentUser;
    }

    public forceNavigate(route: string): void {
        this.navigateToPage(route);
    }

    // Método público para debug
    public debug(): void {
        console.group('🔍 AuthenticationManager Debug');
        console.log('- Autenticado:', this.isAuthenticated);
        console.log('- Usuario actual:', this.currentUser);
        console.log('- Ruta actual:', this.getCurrentRoute());
        console.log('- LoadPage disponible:', !!this.loadPage);
        console.log('- Inicialización completa:', this.initializationComplete);
        console.groupEnd();
    }
}

// =======================
// INICIALIZACIÓN DE SERVICIOS
// =======================
let publicationsService: PublicationsServiceInstance | null = null;
let antojarService: AntojarServiceInstance | null = null;

if (PublicationsService) {
    try {
        publicationsService = PublicationsService.getInstance ? PublicationsService.getInstance() : PublicationsService;
    } catch (error) {
        console.log('Error inicializando PublicationsService');
    }
}

if (AntojarPopupService) {
    try {
        antojarService = AntojarPopupService.getInstance ? AntojarPopupService.getInstance() : AntojarPopupService;
        if (antojarService && antojarService.initialize) {
            antojarService.initialize();
        }
    } catch (error) {
        console.log('Error inicializando AntojarPopupService');
    }
}

// Asignar a window de forma segura
if (typeof window !== 'undefined') {
    try {
        const globalWindow = window as WindowWithGlobalProperties;
        
        if (AntojarPopupService) {
            globalWindow.AntojarPopupService = AntojarPopupService;
        }

        if (publicationsService || antojarService) {
            globalWindow.LuladaServices = {
                publicationsService: publicationsService,
                antojarService: antojarService
            };
        }

        // Debug sidebar
        if (!globalWindow.debugSidebar) {
            globalWindow.debugSidebar = () => {
                const sidebar = document.querySelector('lulada-sidebar') as SidebarElement;
                if (sidebar?.debugNavigation) {
                    sidebar.debugNavigation();
                } else {
                    console.log("🔍 Sidebar no encontrado o sin debugNavigation");
                }
            };
        }

    } catch (error) {
        console.error('Error asignando servicios a window:', error);
    }
}

// =======================
// REGISTRO DE COMPONENTES
// =======================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (component && !customElements.get(name)) {
            customElements.define(name, component);
            console.log(`✅ ${name} registrado`);
            return true;
        } else if (!component) {
            console.log(`⚠️ ${name} no disponible`);
            return false;
        } else {
            console.log(`✅ ${name} ya registrado`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Error registrando ${name}:`, error);
        return false;
    }
}

console.log('🚀 === REGISTRANDO COMPONENTES ===');

// CORE - LOS MÁS IMPORTANTES
registerComponent('root-component', RootComponent);
registerComponent('load-pages', LoadPage);

// PÁGINAS DE AUTENTICACIÓN
registerComponent('login-page', LoginPage);
registerComponent('register-new-account', NewAccount);

// HEADERS
registerComponent('lulada-header-complete', HeaderCompleto);
registerComponent('lulada-header', HeaderHome);
registerComponent('lulada-logo', Lulada);
registerComponent('header-explorer', HeaderExplorer);

// NAVEGACIÓN
registerComponent('lulada-navigation', Navigation);
registerComponent('lulada-sidebar', LuladaSidebar);

// PÁGINAS PRINCIPALES
registerComponent('lulada-home', Home);
registerComponent('lulada-explore', LuladaExplore);
registerComponent('puser-page', PUser);
registerComponent('restaurant-profile', RestaurantProfile);
registerComponent('save-page', Save);
registerComponent('lulada-settings', LuladaSettings);
registerComponent('lulada-notifications', LuladaNotifications);
registerComponent('confirm-role', ConfirmRole);

// SETTINGS
registerComponent('lulada-cambiar-correo', CambiarCorreoF);
registerComponent('lulada-cambiar-nombre', NombreUsuraio);
registerComponent('lulada-cambiar-contraseña', CambiarContraseñaF);

// PUBLICACIONES
registerComponent('lulada-publication', Publication);
registerComponent('lulada-review', Review);
registerComponent('lulada-reviews-container', ReviewsContainer);

// EXPLORACIÓN
registerComponent('explore-container', ExploreContainer);
registerComponent('images-explore', ImagesExplore);
registerComponent('text-card', TextCard);

// USUARIO - CORREGIDO: Registrar con las clases correctas
registerComponent('user-info', UserInfo as any);
registerComponent('user-profile', UserSelftProfile);
registerComponent('user-edit', UserEdit);
registerComponent('edit-profile-modal', EditProfileModal as any);
registerComponent('restaurant-info', restaurantInfo);

// OTROS
registerComponent('lulada-suggestions', LuladaSuggestions);
registerComponent('lulada-card-notifications', CardNotifications);

// LOGIN
registerComponent("caja-de-texto", CajaDeTexto);
registerComponent("boton-login", BotonLogin);
registerComponent("login-form", LoginForm);

// NEW ACCOUNT
registerComponent('lulada-boxtext', BoxText);
registerComponent('button-new-account', ButtonNewAccount);

// SETTINGS COMPONENTS
registerComponent('cajon-texto', CajonTexto);
registerComponent('cajon-list', CajonList);
registerComponent('cajon-list-interactive', CajonListInteractive);
registerComponent('cambiar-nombre-usuario', CambiarNU);
registerComponent('cambiar-correo-electronico', Cambiarco);
registerComponent('cambiar-contrasena', CambiarContra);
registerComponent('cambiar-correo-simple', CambiarCorreoSimple);
registerComponent('cambiar-nombre-simple', CambiarNombreSimple);
registerComponent('cambiar-contrasena-simple', CambiarContrasenaSimple);

// COMPONENTES OPCIONALES
if (NavigationBar) {
    registerComponent('navigation-bar', NavigationBar);
}

if (LuladaAntojar) {
    registerComponent('lulada-antojar', LuladaAntojar);
}

if (LuladaAntojarBoton) {
    registerComponent('lulada-antojar-boton', LuladaAntojarBoton);
}

// =======================
// INICIALIZACIÓN PRINCIPAL
// =======================

let authManager: AuthenticationManager;

// Función para inicializar la aplicación
function initializeApp(): void {
    console.log('🎯 Inicializando aplicación Lulada...');
    
    // Crear el LoadPage si no existe
    if (!document.querySelector('load-pages')) {
        const loadPage = document.createElement('load-pages');
        
        // Limpiar body y agregar load-pages
        document.body.innerHTML = '';
        document.body.appendChild(loadPage);
        
        console.log('📄 LoadPage creado e insertado en el DOM');
    }
    
    // Inicializar sistema de autenticación
    authManager = new AuthenticationManager();
    
    // Hacer disponible globalmente para debug
    if (typeof window !== 'undefined') {
        (window as WindowWithGlobalProperties).authManager = authManager;
    }
    
    // Inicializar InteractionService
    if (InteractionService) {
        try {
            const interactionService = InteractionService.getInstance();
            if (interactionService && interactionService.loadInteractions) {
                interactionService.loadInteractions();
            }
        } catch (error) {
            console.log('Error inicializando InteractionService');
        }
    }

    // Re-inicializar antojarService
    if (antojarService && antojarService.initialize) {
        try {
            antojarService.initialize();
        } catch (error) {
            console.log('Error re-inicializando antojarService');
        }
    }
}

// Configurar la inicialización
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        console.log('⏳ Esperando a que termine de cargar el DOM...');
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        console.log('✅ DOM ya está listo, inicializando inmediatamente...');
        // Dar un pequeño delay para asegurar que todos los componentes estén registrados
        setTimeout(initializeApp, 100);
    }
}

// =======================
// FUNCIONES DE DEBUG MEJORADAS
// =======================
if (typeof window !== 'undefined') {
    const globalWindow = window as WindowWithGlobalProperties;
    
    globalWindow.luladaStatus = () => {
        console.log('📊 === STATUS LULADA ===');
        console.log('✅ Componentes críticos:');
        console.log('- LoadPage:', !!customElements.get('load-pages'));
        console.log('- LoginPage:', !!customElements.get('login-page'));
        console.log('- Home:', !!customElements.get('lulada-home'));
        
        console.log('🔧 Servicios:');
        console.log('- UserActions:', !!globalWindow.UserActions);
        console.log('- userStore:', !!globalWindow.userStore);
        console.log('- LuladaServices:', !!globalWindow.LuladaServices);
        
        console.log('🌐 DOM:');
        console.log('- load-pages en DOM:', !!document.querySelector('load-pages'));
        
        if (authManager) {
            console.log('🔐 Autenticación:');
            console.log('- Estado:', authManager.getAuthStatus() ? 'Autenticado' : 'No autenticado');
            console.log('- Ruta actual:', authManager.getCurrentRoute());
        }
        
        console.log('====================');
    };

    globalWindow.luladaDebug = () => {
        console.log('🐛 === DEBUG COMPLETO ===');
        globalWindow.luladaStatus?.();
        
        if (authManager) {
            authManager.debug();
        }
        
        console.log('📋 Componentes de autenticación:');
        const authComponents = ['login-page', 'register-new-account', 'lulada-home'];
        authComponents.forEach(name => {
            const registered = !!customElements.get(name);
            const inDOM = !!document.querySelector(name);
            console.log(`- ${name}: ${registered ? '✅' : '❌'} registrado, ${inDOM ? '✅' : '❌'} en DOM`);
        });
        
        console.log('========================');
    };
}

console.log('✅ === APLICACIÓN LULADA CON AUTENTICACIÓN INICIALIZADA ===');

// =======================
// EXPORTS CORREGIDOS
// =======================
export {
    Home,
    LuladaExplore,
    PUser,
    RestaurantProfile,
    Save,
    LoginPage,
    LuladaSettings,
    LuladaNotifications,
    HeaderCompleto,
    LuladaSidebar,
    Publication,
    ReviewsContainer,
    RootComponent,
    LoadPage,
    NewAccount,
    AuthenticationManager,
    // AGREGADOS: Exports que faltaban
    UserInfo,
    EditProfileModal,
    CambiarNombreSimple
};