// src/index.ts - VERSIÓN LIMPIA SIN ERRORES ESLINT

// ============================================================================
// SERVICIOS GLOBALES - Importar primero
// ============================================================================
import './services-global';
import { PublicationLocationService } from './Services/PublicationLocationService';
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
// NAVEGACIÓN
// ============================================================================
import NavigationBar from './Components/Home/Navbars/responsivebar';
import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import Navigation from "./Components/Home/navigation";

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
// GOOGLE MAPS
// ============================================================================
import GoogleMapsLocationPicker from './Components/Home/Antojar/GoogleMapsLocationPicker';
import GoogleMapsLocationViewer from './Components/Home/posts/GoogleMapsLocationViewer';

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
// INTERFACES
// ============================================================================
interface AntojarService {
    getInstance(): {
        initialize(): void;
        showPopup(): void;
    };
}

interface WindowWithServices extends Window {
    AntojarPopupService?: AntojarService;
    LuladaServices?: {
        locationService: PublicationLocationService;
        publicationsService: PublicationsService;
        antojarService: AntojarPopupService;
    };
    LuladaDebug?: {
        services: {
            location: PublicationLocationService;
            publications: PublicationsService;
            antojar: AntojarPopupService;
        };
        components: {
            registered: Array<{
                name: string;
                registered: boolean;
            }>;
        };
        googleMaps: {
            available: boolean;
            components: string[];
        };
    };
    google?: unknown;
}

// ============================================================================
// INICIALIZACIÓN DE SERVICIOS
// ============================================================================
console.log('🚀 Inicializando servicios Lulada con Google Maps...');

const locationService = PublicationLocationService.getInstance();
const publicationsService = PublicationsService.getInstance();
const antojarService = AntojarPopupService.getInstance();

antojarService.initialize();

(window as WindowWithServices).AntojarPopupService = AntojarPopupService;
(window as WindowWithServices).LuladaServices = {
    locationService,
    publicationsService,
    antojarService
};

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

// NAVEGACIÓN
customElements.define('lulada-responsive-bar', NavigationBar);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-navigation', Navigation);

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

// PUBLICACIONES
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);

// GOOGLE MAPS
customElements.define('google-maps-location-picker', GoogleMapsLocationPicker);
customElements.define('google-maps-location-viewer', GoogleMapsLocationViewer);

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
        'lulada-antojar',
        'google-maps-location-picker',
        'google-maps-location-viewer'
    ];
    
    criticalComponents.forEach((componentName: string) => {
        const isRegistered = customElements.get(componentName);
        if (isRegistered) {
            console.log(`✅ ${componentName}: Registrado`);
        } else {
            console.warn(`❌ ${componentName}: NO registrado`);
        }
    });
    
    console.log('🎉 Lulada App con Google Maps iniciada correctamente');
});

// ============================================================================
// DEBUGGING
// ============================================================================
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    const criticalComponents = [
        'root-component',
        'lulada-home',
        'lulada-header-complete',
        'lulada-responsive-bar',
        'lulada-antojar',
        'google-maps-location-picker',
        'google-maps-location-viewer'
    ];
    
    (window as WindowWithServices).LuladaDebug = {
        services: {
            location: locationService,
            publications: publicationsService,
            antojar: antojarService
        },
        components: {
            registered: criticalComponents.map((name: string) => ({
                name,
                registered: !!customElements.get(name)
            }))
        },
        googleMaps: {
            available: !!(window as WindowWithServices).google,
            components: ['google-maps-location-picker', 'google-maps-location-viewer']
        }
    };
    
    console.log('🛠️ Debug info disponible en window.LuladaDebug');
}

// ============================================================================
// EXPORTS
// ============================================================================
export {
    PublicationLocationService,
    PublicationsService,
    AntojarPopupService,
    LuladaAntojar,
    LuladaAntojarBoton,
    GoogleMapsLocationPicker,
    GoogleMapsLocationViewer,
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
    GoogleMapsLocationPicker,
    GoogleMapsLocationViewer,
    Publication,
    LuladaAntojar,
    ReviewsContainer,
    AntojarPopupService
};

console.log('📦 Lulada Components Module con Google Maps cargado');
console.log('🗺️ Google Maps integrado exitosamente');