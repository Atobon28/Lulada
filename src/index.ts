// src/index.ts - VERSIÓN CORREGIDA SIN ERRORES DE TIPOS

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
// Importar ResponsiveHeader ANTES del registro para evitar conflictos
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
// No importar LuladaResponsiveHeader aquí porque ya se registra en su propio archivo

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
// OTROS COMPONENTES
// ============================================================================
import Suggestions from "./Components/Home/suggestions";
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

// Asignar servicios a window de manera consistente con los tipos
if (typeof window !== 'undefined') {
    try {
        window.AntojarPopupService = AntojarPopupService;
        
        // Asignar LuladaServices según la interfaz definida
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
// REGISTRO DE COMPONENTES
// ============================================================================
console.log('📦 Registrando componentes...');

// CORE
customElements.define('root-component', RootComponent);
customElements.define('load-pages', LoadPage);

// HEADERS
customElements.define('lulada-header-complete', HeaderCompleto);
customElements.define('lulada-header', HeaderHome);
customElements.define('lulada-logo', Lulada);
customElements.define('header-explorer', HeaderExplorer);
// lulada-responsive-header ya se registra en su propio archivo

// NAVEGACIÓN
customElements.define('lulada-navigation', Navigation);
// lulada-responsive-header y lulada-responsive-bar ya se registran en sus archivos
customElements.define('lulada-sidebar', LuladaSidebar);

// PÁGINAS
customElements.define('lulada-home', Home);
customElements.define('lulada-explore', LuladaExplore);
customElements.define('puser-page', PUser);
customElements.define('restaurant-profile', RestaurantProfile);
customElements.define('save-page', Save);
customElements.define('login-page', LoginPage);
customElements.define('lulada-settings', LuladaSettings);
customElements.define('lulada-notifications', LuladaNotifications);
customElements.define('register-new-account', NewAccount);
customElements.define('confirm-role', ConfirmRole);

// PÁGINAS DE SETTINGS
customElements.define('lulada-cambiar-correo', CambiarCorreoF);
customElements.define('lulada-cambiar-nombre', NombreUsuraio);
customElements.define('lulada-cambiar-contraseña', CambiarContraseñaF);

// PUBLICACIONES
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);

// ANTOJAR
customElements.define('lulada-antojar', LuladaAntojar);
customElements.define('lulada-antojar-boton', LuladaAntojarBoton);

// EXPLORACIÓN
customElements.define('explore-container', ExploreContainer);
customElements.define('images-explore', ImagesExplore);
customElements.define('text-card', TextCard);

// USUARIO
customElements.define('user-info', UserInfo);
customElements.define('user-profile', UserSelftProfile);
customElements.define('user-edit', UserEdit);
customElements.define('restaurant-info', restaurantInfo);

// OTROS
customElements.define('lulada-suggestions', Suggestions);
customElements.define('lulada-card-notifications', CardNotifications);

// LOGIN
customElements.define("caja-de-texto", CajaDeTexto);
customElements.define("boton-login", BotonLogin);
customElements.define("login-form", LoginForm);

// NEW ACCOUNT
customElements.define('lulada-boxtext', BoxText);
customElements.define('button-new-account', ButtonNewAccount);

// SETTINGS COMPONENTS
customElements.define('cajon-texto', CajonTexto);
customElements.define('cajon-list', CajonList);
customElements.define('cajon-list-interactive', CajonListInteractive);
customElements.define('cambiar-nombre-usuario', CambiarNU);
customElements.define('cambiar-correo-electronico', Cambiarco);
customElements.define('cambiar-contrasena', CambiarContra);
customElements.define('cambiar-correo-simple', CambiarCorreoSimple);
customElements.define('cambiar-nombre-simple', CambiarNombreSimple);
customElements.define('cambiar-contrasena-simple', CambiarContrasenaSimple);

console.log('✅ Todos los componentes registrados');

// ============================================================================
// INICIALIZACIÓN FINAL
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM cargado - Verificando componentes...');
    
    AntojarPopupService.getInstance().initialize();
    
    const criticalComponents = [
        'root-component',
        'lulada-home',
        'lulada-header-complete',
        'lulada-responsive-bar',
        'lulada-antojar'
    ];
    
    criticalComponents.forEach((componentName: string) => {
        const isRegistered = customElements.get(componentName);
        if (isRegistered) {
            console.log(`✅ ${componentName}: Registrado`);
        } else {
            console.warn(`❌ ${componentName}: NO registrado`);
        }
    });
    
    console.log('🎉 Lulada App iniciada correctamente');
});

// ============================================================================
// DEBUGGING - Solo en desarrollo Y con verificación de tipos
// ============================================================================
if (typeof window !== 'undefined') {
    // Solo en modo desarrollo
    try {
        const criticalComponents = [
            'root-component',
            'lulada-home',
            'lulada-header-complete',
            'lulada-responsive-bar',
            'lulada-antojar'
        ];
        
        // Solo asignar si la propiedad no existe ya
        if (!window.LuladaDebug) {
            window.LuladaDebug = {
                services: {
                    publications: publicationsService,
                    antojar: antojarService
                },
                components: {
                    registered: criticalComponents.map((name: string) => ({
                        name,
                        registered: !!customElements.get(name)
                    }))
                }
            };
        }
        
        console.log('🛠️ Debug info disponible en window.LuladaDebug');
    } catch (error) {
        console.warn('⚠️ No se pudo configurar el debugging:', error);
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
    verify: () => console.log('Verificación de componentes disponible en LuladaDebug'),
    Publication,
    LuladaAntojar,
    ReviewsContainer,
    AntojarPopupService
};

console.log('📦 Lulada Components Module cargado');