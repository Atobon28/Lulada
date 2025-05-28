// src/index.ts - VERSIÓN CORREGIDA SIN REFERENCIAS ROTAS

// ============================================================================
// INTERFACES SIMPLES
// ============================================================================
interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

// ============================================================================
// SERVICIOS GLOBALES - Importar primero
// ============================================================================
import './services-global';
import PublicationsService from './Services/PublicationsService';

// ============================================================================
// COMPONENTES CORE
// ============================================================================
import RootComponent from "./Components/Root/RootComponent";
import LoadPage from "./Components/LoadPages/LoadPage";

// ============================================================================
// PÁGINAS PRINCIPALES
// ============================================================================
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

// ============================================================================
// CONFIGURACIÓN PÁGINAS SETTINGS
// ============================================================================
import CambiarCorreoF from "./Pages/Settings/CambiarCorreo/CambiarCorreoF";
import NombreUsuraio from "./Pages/Settings/CambiarNombre/CambiarNombreF";
import CambiarContraseñaF from "./Pages/Settings/CambiarContraseña/CambiarContraseñaF";

// ============================================================================
// NAVEGACIÓN
// ============================================================================
import Navigation from "./Components/Home/navigation";
import './Components/Home/Header/reponsiveheader';
import NavigationBar from './Components/Home/Navbars/responsivebar';
import LuladaSidebar from "./Components/Home/Navbars/sidebar";

// ============================================================================
// HEADERS
// ============================================================================
import HeaderCompleto from './Components/Home/Header/HeaderCompleto';
import HeaderHome from "./Components/Home/Header/Header";
import Lulada from "./Components/Home/Header/logo";
import HeaderExplorer from "./Components/Explore/exploreHeader";

// ============================================================================
// PUBLICACIONES Y REVIEWS
// ============================================================================
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";

// ============================================================================
// ANTOJAR
// ============================================================================
import { LuladaAntojar } from './Components/Home/Antojar/antojar';
import { LuladaAntojarBoton } from './Components/Home/Antojar/antojar-boton';
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';

// ============================================================================
// EXPLORACIÓN
// ============================================================================
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";

// ============================================================================
// USUARIO
// ============================================================================
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";

// ============================================================================
// OTROS COMPONENTES - CORREGIDO
// ============================================================================
import LuladaSuggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";

// ============================================================================
// LOGIN
// ============================================================================
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";

// ============================================================================
// NEW ACCOUNT
// ============================================================================
import BoxText from "./Components/Newaccount/boxtext";

// ============================================================================
// SETTINGS COMPONENTS
// ============================================================================
import CajonTexto from "./Components/Settings/CajonTexto";
import CajonList from "./Components/Settings/CajonList";
import CajonListInteractive from "./Components/Settings/CajonListInteractive";
import CambiarNU from "./Components/Settings/CambiarNombre/cambiarNU";
import Cambiarco from "./Components/Settings/CambiarCorreo/cambiarco";
import CambiarContra from "./Components/Settings/CambiarContraseña/cambiarcontra";
import CambiarCorreoSimple from "./Components/Settings/CambiarCorreoSimple";
import CambiarNombreSimple from "./Components/Settings/CambiarNombreSimple";
import CambiarContrasenaSimple from "./Components/Settings/CambiarContrasenaSimple";
import ButtonNewAccount from "./Components/Newaccount/buttonNewAccount";

// ============================================================================
// INICIALIZACIÓN DE SERVICIOS
// ============================================================================
console.log('🚀 Inicializando servicios Lulada...');

const publicationsService = PublicationsService.getInstance();
const antojarService = AntojarPopupService.getInstance();

antojarService.initialize();

// Asignar servicios a window
if (typeof window !== 'undefined') {
    try {
        window.AntojarPopupService = AntojarPopupService;
        
        if (!window.LuladaServices) {
            window.LuladaServices = {
                publicationsService,
                antojarService
            };
        }
        
        console.log('✅ Servicios asignados a window correctamente');
    } catch (error) {
        console.warn('⚠️ Error asignando servicios a window:', error);
    }
}

console.log('✅ Servicios inicializados correctamente');

// ============================================================================
// FUNCIÓN PARA VERIFICAR Y REGISTRAR COMPONENTES
// ============================================================================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (!customElements.get(name)) {
            customElements.define(name, component);
            console.log(`✅ ${name}: Registrado correctamente`);
            return true;
        } else {
            console.log(`⚠️ ${name}: Ya estaba registrado`);
            return true;
        }
    } catch (error) {
        console.error(`❌ ${name}: Error al registrar -`, error);
        return false;
    }
}

// ============================================================================
// REGISTRO DE COMPONENTES
// ============================================================================
console.log('📦 Registrando componentes...');

// CORE - CRÍTICOS
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

// PÁGINAS PRINCIPALES
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

// PÁGINAS DE SETTINGS
registerComponent('lulada-cambiar-correo', CambiarCorreoF);
registerComponent('lulada-cambiar-nombre', NombreUsuraio);
registerComponent('lulada-cambiar-contraseña', CambiarContraseñaF);

// PUBLICACIONES
registerComponent('lulada-publication', Publication);
registerComponent('lulada-review', Review);
registerComponent('lulada-reviews-container', ReviewsContainer);

// ANTOJAR
registerComponent('lulada-antojar', LuladaAntojar);
registerComponent('lulada-antojar-boton', LuladaAntojarBoton);

// EXPLORACIÓN
registerComponent('explore-container', ExploreContainer);
registerComponent('images-explore', ImagesExplore);
registerComponent('text-card', TextCard);

// USUARIO
registerComponent('user-info', UserInfo);
registerComponent('user-profile', UserSelftProfile);
registerComponent('user-edit', UserEdit);
registerComponent('restaurant-info', restaurantInfo);

// OTROS - CORREGIDO
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

console.log('✅ Registro de componentes completado');

// ============================================================================
// VERIFICACIÓN DE COMPONENTES CRÍTICOS
// ============================================================================
function verifyComponents(): void {
    console.log('🔍 Verificando componentes críticos...');
    
    const criticalComponents = [
        'root-component',
        'load-pages',
        'lulada-home',
        'lulada-notifications',
        'lulada-settings',
        'lulada-explore',
        'puser-page',
        'save-page',
        'lulada-sidebar'
    ];
    
    let allRegistered = true;
    
    criticalComponents.forEach((componentName: string) => {
        const isRegistered = !!customElements.get(componentName);
        if (isRegistered) {
            console.log(`✅ ${componentName}: OK`);
        } else {
            console.error(`❌ ${componentName}: FALTA`);
            allRegistered = false;
        }
    });
    
    if (allRegistered) {
        console.log('🎉 Todos los componentes críticos registrados');
    } else {
        console.error('❌ Faltan componentes críticos');
    }
}

// ============================================================================
// INICIALIZACIÓN FINAL
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM cargado - Inicializando Lulada...');
    
    // Verificar componentes
    verifyComponents();
    
    // Inicializar servicios
    AntojarPopupService.getInstance().initialize();
    
    console.log('🎉 Lulada App iniciada correctamente');
});

// ============================================================================
// DEBUG SIMPLE (SIN SISTEMA COMPLEJO)
// ============================================================================
if (typeof window !== 'undefined') {
    try {
        if (!window.LuladaDebug) {
            window.LuladaDebug = {
                services: {
                    publications: publicationsService,
                    antojar: antojarService
                },
                components: {
                    registered: [
                        'lulada-home',
                        'lulada-notifications',
                        'lulada-settings', 
                        'lulada-explore',
                        'puser-page',
                        'save-page'
                    ].map((name: string) => ({
                        name,
                        registered: !!customElements.get(name)
                    }))
                }
            };
        }
        
        console.log('🛠️ Debug básico disponible en window.LuladaDebug');
    } catch (error) {
        console.warn('⚠️ Debug no disponible:', error);
    }
}

// ============================================================================
// EXPORTS
// ============================================================================
export {
    PublicationsService,
    AntojarPopupService,
    LuladaAntojar,
    LuladaAntojarBoton,
    Home,
    LuladaExplore,
    PUser,
    RestaurantProfile,
    Save,
    LoginPage,
    LuladaSettings,
    LuladaNotifications,
    NavigationBar,
    HeaderCompleto,
    LuladaSidebar,
    Publication,
    ReviewsContainer
};

export default {
    registerAll: () => console.log('Todos los componentes ya registrados'),
    verify: verifyComponents,
    Publication,
    LuladaAntojar,
    ReviewsContainer,
    AntojarPopupService
};

console.log('📦 Lulada Components Module cargado - VERSIÓN CORREGIDA');