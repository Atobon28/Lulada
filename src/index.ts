import LuladaNotifications from './Pages/Notifications/Notifications';
import NavigationBar from './Components/Home/Navbars/responsivebar';

//Root Component
import RootComponent from "./Components/Root/RootComponent";

//App container
import LoadPage from "./Components/LoadPages/LoadPage";

//Home components
import Home from "./Pages/Home/home"
import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import HeaderHome from "./Components/Home/Header/Header";
import Lulada from "./Components/Home/Header/logo";
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";
import Navigation from "./Components/Home/navigation";
import Suggestions from "./Components/Home/suggestions";

//Notifications
import CardNotifications from "./Components/Nofications/CardNotifications";

//Explorer
import HeaderExplorer from "./Components/Explore/exploreHeader";
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";
import LuladaExplore from "./Pages/Explore/explore";

//Profile User
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import PUser from "./Pages/PUser/puser";

//Restaurant Profile
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";
import RestaurantProfile from "./Pages/RestaurantProfile/RestaurantProfile";

//Save
import Save from "./Pages/Save/Save";

//Login
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";
import LoginPage from "./Pages/LogIn/Login";

//Settings
import CajonTexto from "./Components/Settings/CajonTexto";
import CajonList from "./Components/Settings/CajonList";
import LuladaSettings from "./Pages/Settings/Settings";
import CambiarCo from "./Components/Settings/CambiarCorreo/cambiarco";
import CambiarNU from "./Components/Settings/CambiarNombre/cambiarNU";
import CambiarContra from "./Components/Settings/CambiarContraseña/cambiarcontra";
import CambiarContraseñaF from "./Pages/Settings/CambiarContraseña/CambiarContraseñaF"
import CambiarCorreoF from "./Pages/Settings/CambiarCorreo/CambiarCorreoF";
import CajonListInteractive from "./Components/Settings/CajonListInteractive";
import CambiarCorreoSimple from "./Components/Settings/CambiarCorreoSimple";
import CambiarNombreSimple from "./Components/Settings/CambiarNombreSimple";
import CambiarContrasenaSimple from "./Components/Settings/CambiarContrasenaSimple";

//New Account
import BoxText from "./Components/Newaccount/boxtext";
import NewAccount from "./Pages/NewAccount/containernewaccount";

//Confirm Role
import ConfirmRole from "./Pages/ConfirmRole/ConfirRole";

//Headers
import HeaderCompleto from './Components/Home/Header/HeaderCompleto';

//Antojar
import { LuladaAntojar } from './Components/Home/Antojar/antojar';
import { LuladaAntojarBoton } from './Components/Home/Antojar/antojar-boton';
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';

// Flux System
import { userStore } from './Services/flux/UserStore';
import { UserActions } from './Services/flux/UserActions';

// Inicializar AntojarPopupService
const antojarService = AntojarPopupService.getInstance();
antojarService.initialize();
window.AntojarPopupService = AntojarPopupService;

// Exponer Flux globalmente
window.userStore = userStore;
window.UserActions = UserActions;

// === REGISTRO DE CUSTOM ELEMENTS ===

// Headers
customElements.define('lulada-header-complete', HeaderCompleto);

// Root
customElements.define('root-component', RootComponent);

// App container
customElements.define('load-pages', LoadPage);

// Home
customElements.define('lulada-home', Home);
customElements.define('lulada-header', HeaderHome);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-logo', Lulada);
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);
customElements.define('lulada-navigation', Navigation);
customElements.define('lulada-suggestions', Suggestions);

// Navigation
customElements.define('lulada-responsive-bar', NavigationBar);

// Explorer
customElements.define('header-explorer', HeaderExplorer);
customElements.define('explore-container', ExploreContainer);
customElements.define('images-explore', ImagesExplore);
customElements.define('text-card', TextCard);
customElements.define('lulada-explore', LuladaExplore);

// Profile User
customElements.define('user-info', UserInfo);
customElements.define('puser-page', PUser);
customElements.define('user-profile', UserSelftProfile);
customElements.define('user-edit', UserEdit);

// Restaurant Profile
customElements.define('restaurant-info', restaurantInfo);
customElements.define('restaurant-profile', RestaurantProfile);

// Save
customElements.define('save-page', Save);

// Login
customElements.define("caja-de-texto", CajaDeTexto);
customElements.define("boton-login", BotonLogin);
customElements.define("login-form", LoginForm);
customElements.define("login-page", LoginPage);

// Settings
customElements.define("cajon-texto", CajonTexto);
customElements.define("cajon-list", CajonList);
customElements.define('lulada-settings', LuladaSettings);
customElements.define('cambiar-correo', CambiarCo);
customElements.define('cambiar-nombre', CambiarNU);
customElements.define('cambiar-contraseña', CambiarContra);
customElements.define('lulada-cambiar-contraseña', CambiarContraseñaF);
customElements.define('lulada-cambiar-correo', CambiarCorreoF);
customElements.define('cajon-list-interactive', CajonListInteractive);
customElements.define('cambiar-correo-simple', CambiarCorreoSimple);
customElements.define('cambiar-nombre-simple', CambiarNombreSimple);
customElements.define('cambiar-contrasena-simple', CambiarContrasenaSimple);

// Notifications
customElements.define('lulada-card-notifications', CardNotifications);
customElements.define('lulada-boxtext', BoxText)
customElements.define('lulada-notifications', LuladaNotifications);

// New Account
customElements.define('register-new-account', NewAccount);

// Confirm Role
customElements.define('confirm-role', ConfirmRole);



document.addEventListener('DOMContentLoaded', () => {
  // Inicializar AntojarPopupService
  AntojarPopupService.getInstance().initialize();
  
  // Inicializar datos del usuario por defecto si no existen
  const currentUser = userStore.getCurrentUser();
  if (!currentUser) {
    console.log(' Inicializando datos de usuario por defecto...');
    UserActions.loadUserData({
      foto: "https://randomuser.me/api/portraits/women/44.jpg",
      nombreDeUsuario: "@CrisTiJauregui",
      nombre: "Cristina Jauregui",
      descripcion: "Me encanta el alcohol, los cocteles me vuelven loca",
      rol: "persona"
    });
  }
  
  console.log(' Aplicación Lulada inicializada correctamente');
});

// Exportar componentes principales
export { 
  LuladaAntojar, 
  LuladaAntojarBoton, 
  AntojarPopupService, 
  userStore, 
  UserActions 
};