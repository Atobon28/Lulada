
// ============================================================================
// SERVICIOS - Importar primero para garantizar disponibilidad
// ============================================================================
import { PublicationLocationService } from './Services/PublicationLocationService';
import PublicationsService from './Services/PublicationsService';

// ============================================================================
// COMPONENTES CORE - Root y LoadPage
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
// COMPONENTES DE NAVEGACIÓN
// ============================================================================
import NavigationBar from './Components/Home/Navbars/responsivebar';
import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import Navigation from "./Components/Home/navigation";

// ============================================================================
// COMPONENTES DE HEADER
// ============================================================================
import HeaderCompleto from './Components/Home/Header/HeaderCompleto';
import HeaderHome from "./Components/Home/Header/Header";
import Lulada from "./Components/Home/Header/logo";
import HeaderExplorer from "./Components/Explore/exploreHeader";

// ============================================================================
// COMPONENTES DE PUBLICACIONES Y REVIEWS
// ============================================================================
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";

// ============================================================================
// COMPONENTES DE GOOGLE MAPS (NUEVOS)
// ============================================================================
import GoogleMapsLocationPicker from './Components/Home/Antojar/GoogleMapsLocationPicker';
import GoogleMapsLocationViewer from './Components/Home/posts/GoogleMapsLocationViewer';

// ============================================================================
// COMPONENTES DE ANTOJAR (Crear publicaciones)
// ============================================================================
import { LuladaAntojar } from './Components/Home/Antojar/antojar';
import { LuladaAntojarBoton } from './Components/Home/Antojar/antojar-boton';
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';

// ============================================================================
// COMPONENTES DE EXPLORACIÓN
// ============================================================================
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";

// ============================================================================
// COMPONENTES DE USUARIO
// ============================================================================
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";

// ============================================================================
// COMPONENTES DE SUGERENCIAS Y OTROS
// ============================================================================
import Suggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";

// ============================================================================
// COMPONENTES DE LOGIN
// ============================================================================
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";

// ============================================================================
// COMPONENTES DE SETTINGS
// ============================================================================
import CajonTexto from "./Components/Settings/CajonTexto";
import CajonList from "./Components/Settings/CajonList";
import CambiarCo from "./Components/Settings/CambiarCorreo/cambiarco";
import CambiarNU from "./Components/Settings/CambiarNombre/cambiarNU";
import CambiarContra from "./Components/Settings/CambiarContraseña/cambiarcontra";
import CambiarContraseñaF from "./Pages/Settings/CambiarContraseña/CambiarContraseñaF";
import CambiarCorreoF from "./Pages/Settings/CambiarCorreo/CambiarCorreoF";
import CambiarNombreUsuraio from "./Pages/Settings/CambiarNombre/CambiarNombreF";
import CajonListInteractive from "./Components/Settings/CajonListInteractive";
import CambiarCorreoSimple from "./Components/Settings/CambiarCorreoSimple";
import CambiarNombreSimple from "./Components/Settings/CambiarNombreSimple";
import CambiarContrasenaSimple from "./Components/Settings/CambiarContrasenaSimple";

// ============================================================================
// COMPONENTES DE NEW ACCOUNT
// ============================================================================
import BoxText from "./Components/Newaccount/boxtext";

// ============================================================================
// INICIALIZACIÓN DE SERVICIOS
// ============================================================================
console.log('🚀 Inicializando servicios Lulada con Google Maps...');

// Inicializar servicios principales
const locationService = PublicationLocationService.getInstance();
const publicationsService = PublicationsService.getInstance();
const antojarService = AntojarPopupService.getInstance();

// Configurar servicio de Antojar
antojarService.initialize();

// Hacer servicios disponibles globalmente para debugging
(window as any).LuladaServices = {
    locationService,
    publicationsService,
    antojarService
};

console.log('✅ Servicios inicializados correctamente');
console.log('🗺️ Google Maps integrado en componentes de ubicación');

// ============================================================================
// REGISTRO DE COMPONENTES - ORDEN JERÁRQUICO
// ============================================================================
console.log('📦 Registrando componentes...');

// 1. COMPONENTES BASE
customElements.define('root-component', RootComponent);
customElements.define('load-pages', LoadPage);

// 2. HEADERS (Header completo debe ir primero)
customElements.define('lulada-header-complete', HeaderCompleto);
customElements.define('lulada-header', HeaderHome);
customElements.define('lulada-logo', Lulada);
customElements.define('header-explorer', HeaderExplorer);

// 3. NAVEGACIÓN
customElements.define('lulada-responsive-bar', NavigationBar);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-navigation', Navigation);

// 4. PÁGINAS PRINCIPALES
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

// 5. COMPONENTES DE PUBLICACIONES
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);

// 6. COMPONENTES DE GOOGLE MAPS (NUEVOS)
customElements.define('google-maps-location-picker', GoogleMapsLocationPicker);
customElements.define('google-maps-location-viewer', GoogleMapsLocationViewer);

// 7. COMPONENTES DE ANTOJAR
customElements.define('lulada-antojar', LuladaAntojar);
customElements.define('lulada-antojar-boton', LuladaAntojarBoton);

// 8. COMPONENTES DE EXPLORACIÓN
customElements.define('explore-container', ExploreContainer);
customElements.define('images-explore', ImagesExplore);
customElements.define('text-card', TextCard);

// 9. COMPONENTES DE USUARIO
customElements.define('user-info', UserInfo);
customElements.define('user-profile', UserSelftProfile);
customElements.define('user-edit', UserEdit);
customElements.define('restaurant-info', restaurantInfo);

// 10. OTROS COMPONENTES
customElements.define('lulada-suggestions', Suggestions);
customElements.define('lulada-card-notifications', CardNotifications);

// 11. COMPONENTES DE LOGIN
customElements.define("caja-de-texto", CajaDeTexto);
customElements.define("boton-login", BotonLogin);
customElements.define("login-form", LoginForm);

// 12. COMPONENTES DE SETTINGS
customElements.define("cajon-texto", CajonTexto);
customElements.define("cajon-list", CajonList);
customElements.define('cambiar-correo', CambiarCo);
customElements.define('cambiar-nombre', CambiarNU);
customElements.define('cambiar-contraseña', CambiarContra);
customElements.define('lulada-cambiar-contraseña', CambiarContraseñaF);
customElements.define('lulada-cambiar-correo', CambiarCorreoF);
customElements.define('lulada-cambiar-nombre', CambiarNombreUsuraio);
customElements.define('cajon-list-interactive', CajonListInteractive);
customElements.define('cambiar-correo-simple', CambiarCorreoSimple);
customElements.define('cambiar-nombre-simple', CambiarNombreSimple);
customElements.define('cambiar-contrasena-simple', CambiarContrasenaSimple);

// 13. COMPONENTES DE NEW ACCOUNT
customElements.define('lulada-boxtext', BoxText);

console.log('✅ Todos los componentes registrados');
console.log('🗺️ Componentes de Google Maps disponibles:');
console.log('   - google-maps-location-picker');
console.log('   - google-maps-location-viewer');

// ============================================================================
// INICIALIZACIÓN FINAL
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM cargado - Verificando componentes...');
    
    // Verificar componentes críticos incluyendo Google Maps
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
// EXPORTS PARA USO EXTERNO
// ============================================================================
export {
    // Servicios
    PublicationLocationService,
    PublicationsService,
    AntojarPopupService,
    
    // Componentes principales de Antojar
    LuladaAntojar,
    LuladaAntojarBoton,
    
    // Componentes de Google Maps
    GoogleMapsLocationPicker,
    GoogleMapsLocationViewer,
    
    // Páginas
    Home,
    LuladaExplore,
    PUser,
    
    // Componentes de navegación
    NavigationBar,
    HeaderCompleto
};

// ============================================================================
// DEBUGGING (Remover en producción)
// ============================================================================
if (process.env.NODE_ENV === 'development') {
    const criticalComponents = [
        'root-component',
        'lulada-home',
        'lulada-header-complete',
        'lulada-responsive-bar',
        'lulada-antojar',
        'google-maps-location-picker',
        'google-maps-location-viewer'
    ];

    (window as any).LuladaDebug = {
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
            available: !!window.google,
            components: ['google-maps-location-picker', 'google-maps-location-viewer']
        }
    };
    console.log('🛠️ Debug info disponible en window.LuladaDebug');
    console.log('🗺️ Google Maps components ready for use');
}

// Log inicial
console.log('📦 Lulada Components Module con Google Maps cargado');
console.log('🛠️ Usa window.LuladaDebug para debugging');
console.log('🗺️ Google Maps integrado exitosamente');

export default {
    registerAll: () => console.log('Todos los componentes ya registrados'),
    verify: () => console.log('Verificación de componentes disponible en LuladaDebug'),
    GoogleMapsLocationPicker,
    GoogleMapsLocationViewer,
    Publication,
    LuladaAntojar,
    ReviewsContainer
};