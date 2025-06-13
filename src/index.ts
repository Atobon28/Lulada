// index.ts - RESTAURADO CON ARREGLOS PARA QUE FUNCIONE

// =======================
// DECLARACIONES GLOBALES
// =======================
export {};

// Importar servicios básicos primero
import './services-global';
import './Services/realtime-sync-init';


interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

// Interfaces para servicios y componentes
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

// Declaraciones globales para window - REMOVIDAS PARA EVITAR DUPLICADOS
// Las declaraciones están en services-global.ts

// Interface para window con propiedades necesarias
interface WindowWithGlobalProperties extends Window {
    AntojarPopupService?: unknown;
    LuladaServices?: LuladaServices;
    debugSidebar?: () => void;
    luladaStatus?: () => void;
    luladaDebug?: () => void;
    UserActions?: unknown;
    userStore?: unknown;
}

// =======================
// IMPORTS - SOLO LOS QUE EXISTEN
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
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import EditProfileModal from "./Components/PUser/userProfile/EditProfileModal";
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

// IMPORTS OPCIONALES (que pueden fallar)
let NavigationBar: ComponentConstructor | null = null;
let LuladaAntojar: ComponentConstructor | null = null;
let LuladaAntojarBoton: ComponentConstructor | null = null;
let PublicationsService: PublicationsServiceInstance | null = null;
let AntojarPopupService: AntojarServiceInstance | null = null;
let InteractionService: InteractionServiceInstance | null = null;

// Importar los que pueden fallar de forma segura
try {
    const NavigationBarModule = require('./Components/Home/Navbars/responsivebar');
    NavigationBar = NavigationBarModule.default;
} catch (_e: unknown) {
    console.log('NavigationBar no disponible');
}

try {
    const antojarModule = require('./Components/Home/Antojar/antojar');
    LuladaAntojar = antojarModule.LuladaAntojar;
} catch (_e: unknown) {
    console.log('LuladaAntojar no disponible');
}

try {
    const antojarBotonModule = require('./Components/Home/Antojar/antojar-boton');
    LuladaAntojarBoton = antojarBotonModule.LuladaAntojarBoton;
} catch (_e: unknown) {
    console.log('LuladaAntojarBoton no disponible');
}

try {
    const PublicationsServiceModule = require('./Services/PublicationsService');
    PublicationsService = PublicationsServiceModule.default;
} catch (_e: unknown) {
    console.log('PublicationsService no disponible');
}

try {
    const AntojarPopupServiceModule = require('./Components/Home/Antojar/antojar-popup');
    AntojarPopupService = AntojarPopupServiceModule.default;
} catch (_e: unknown) {
    console.log('AntojarPopupService no disponible');
}

try {
    const interactionModule = require('./Services/flux/Interactionservice');
    InteractionService = interactionModule.InteractionService;
} catch (_e: unknown) {
    console.log('InteractionService no disponible');
}

// =======================
// INICIALIZACIÓN DE SERVICIOS
// =======================
let publicationsService: PublicationsServiceInstance | null = null;
let antojarService: AntojarServiceInstance | null = null;

if (PublicationsService) {
    try {
        publicationsService = PublicationsService.getInstance ? PublicationsService.getInstance() : PublicationsService;
    } catch (_e: unknown) {
        console.log('Error inicializando PublicationsService');
    }
}

if (AntojarPopupService) {
    try {
        antojarService = AntojarPopupService.getInstance ? AntojarPopupService.getInstance() : AntojarPopupService;
        if (antojarService && antojarService.initialize) {
            antojarService.initialize();
        }
    } catch (_e: unknown) {
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

    } catch (_error: unknown) {
        console.error('Error asignando servicios a window:', _error);
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
    } catch (_error: unknown) {
        console.error(`❌ Error registrando ${name}:`, _error);
        return false;
    }
}

console.log('🚀 === REGISTRANDO COMPONENTES ===');

// CORE
registerComponent('root-component', RootComponent);
registerComponent('load-pages', LoadPage);

// HEADERS
registerComponent('lulada-header-complete', HeaderCompleto);
registerComponent('lulada-header', HeaderHome);
registerComponent('lulada-logo', Lulada);
registerComponent('header-explorer', HeaderExplorer);

// NAVEGACIÓN
registerComponent('lulada-navigation', Navigation);
registerComponent('lulada-sidebar', LuladaSidebar);

// PÁGINAS
registerComponent('lulada-home', Home);
registerComponent('lulada-explore', LuladaExplore);
registerComponent('puser-page', PUser);
registerComponent('restaurant-profile', RestaurantProfile);
registerComponent('save-page', Save);
registerComponent('login-page', LoginPage);
registerComponent('lulada-settings', LuladaSettings);
registerComponent('lulada-notifications', LuladaNotifications);
registerComponent('register-new-account', NewAccount);
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

// USUARIO
registerComponent('user-info', UserInfo);
registerComponent('user-profile', UserSelftProfile);
registerComponent('user-edit', UserEdit);
registerComponent('edit-profile-modal', EditProfileModal);
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
// INICIALIZACIÓN FINAL
// =======================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM listo, inicializando servicios finales...');
    
    if (InteractionService) {
        try {
            const interactionService = InteractionService.getInstance();
            if (interactionService && interactionService.loadInteractions) {
                interactionService.loadInteractions();
            }
        } catch (_e: unknown) {
            console.log('Error inicializando InteractionService');
        }
    }

    if (antojarService && antojarService.initialize) {
        try {
            antojarService.initialize();
        } catch (_e: unknown) {
            console.log('Error re-inicializando antojarService');
        }
    }
});

// Crear root-component si no existe al cargar
if (typeof document !== 'undefined') {
    setTimeout(() => {
        if (!document.querySelector('root-component')) {
            const root = document.createElement('root-component');
            document.body.appendChild(root);
            console.log('✅ Root component creado y agregado al DOM');
        }
    }, 100);
}

// =======================
// FUNCIONES DE DEBUG
// =======================
if (typeof window !== 'undefined') {
    const globalWindow = window as WindowWithGlobalProperties;
    
    globalWindow.luladaStatus = () => {
        console.log('📊 === STATUS LULADA ===');
        console.log('✅ Componentes críticos:');
        console.log('- RootComponent:', !!customElements.get('root-component'));
        console.log('- LoadPage:', !!customElements.get('load-pages'));
        console.log('- Home:', !!customElements.get('lulada-home'));
        console.log('- Login:', !!customElements.get('login-page'));
        console.log('- NewAccount:', !!customElements.get('register-new-account'));
        
        console.log('🔧 Servicios:');
        console.log('- UserActions:', !!globalWindow.UserActions);
        console.log('- userStore:', !!globalWindow.userStore);
        console.log('- LuladaServices:', !!globalWindow.LuladaServices);
        
        console.log('🌐 DOM:');
        console.log('- root-component en DOM:', !!document.querySelector('root-component'));
        console.log('- load-pages en DOM:', !!document.querySelector('load-pages'));
        
        console.log('🔐 Auth:');
        console.log('- Autenticado:', localStorage.getItem('isAuthenticated'));
        console.log('- Usuario:', !!localStorage.getItem('currentUser'));
        
        console.log('====================');
    };

    globalWindow.luladaDebug = () => {
        console.log('🐛 === DEBUG COMPLETO ===');
        globalWindow.luladaStatus?.();
        
        console.log('📋 Todos los componentes registrados:');
        const allComponents = [
            'root-component', 'load-pages', 'lulada-home', 'login-page', 'register-new-account',
            'lulada-header', 'lulada-navigation', 'lulada-sidebar', 'user-info'
        ];
        
        allComponents.forEach(name => {
            const registered = !!customElements.get(name);
            const inDOM = !!document.querySelector(name);
            console.log(`- ${name}: ${registered ? '✅' : '❌'} registrado, ${inDOM ? '✅' : '❌'} en DOM`);
        });
        
        console.log('========================');
    };
}

console.log('✅ === APLICACIÓN LULADA RESTAURADA ===');

// =======================
// EXPORTS
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
    ReviewsContainer
};