// =======================
// DECLARACIONES GLOBALES
// =======================
export {};

import PublicationsService from './Services/PublicationsService';
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';

declare global {
    interface Window {
        debugSidebar?: () => void;
        AntojarPopupService?: typeof AntojarPopupService;
        LuladaServices?: {
            publicationsService: ReturnType<typeof PublicationsService.getInstance>;
            antojarService: ReturnType<typeof AntojarPopupService.getInstance>;
        };
    }
}

interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

// =======================
// IMPORTS
// =======================
import './services-global';
import { InteractionService } from './Services/flux/Interactionservice';

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
import NavigationBar from './Components/Home/Navbars/responsivebar';
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

// ANTOJAR
import { LuladaAntojar } from './Components/Home/Antojar/antojar';
import { LuladaAntojarBoton } from './Components/Home/Antojar/antojar-boton';

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

// =======================
// INICIALIZACIÓN DE SERVICIOS
// =======================
const publicationsService = PublicationsService.getInstance();
const antojarService = AntojarPopupService.getInstance();
antojarService.initialize();

if (typeof window !== 'undefined') {
    try {
        window.AntojarPopupService = AntojarPopupService;

        if (!window.LuladaServices) {
            window.LuladaServices = {
                publicationsService,
                antojarService
            };
        }

        if (!window.debugSidebar) {
            window.debugSidebar = () => {
                const sidebar = document.querySelector('lulada-sidebar') as any;
                if (sidebar?.debugNavigation) {
                    sidebar.debugNavigation();
                } else {
                    console.log("🔍 Sidebar no encontrado o sin debugNavigation");
                }
            };
        }

    } catch (error) {
        console.error('Error asignando servicios:', error);
    }
}

// =======================
// REGISTRO DE COMPONENTES
// =======================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (!customElements.get(name)) {
            customElements.define(name, component);
        }
        return true;
    } catch (error) {
        console.error(`Error registrando ${name}:`, error);
        return false;
    }
}

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

// =======================
// INICIALIZACIÓN FINAL
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const interactionService = InteractionService.getInstance();
    interactionService.loadInteractions();

    antojarService.initialize();
});

// =======================
// EXPORTS
// =======================
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
    Publication,
    LuladaAntojar,
    ReviewsContainer,
    AntojarPopupService
};
