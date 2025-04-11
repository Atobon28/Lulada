import LuladaNotifications from './Pages/Notifications/Notifications';
import NavigationBar from './Components/Home/Navbars/responsivebar';
//Root Component
import RootComponent from "./Components/Root/RootComponent";
//Root component

//app container
import LoadPage from "./Components/LoadPages/LoadPage";
//app container

//home
import Home from "./Pages/Home/home"

import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import HeaderHome from "./Components/Home/Header/Header";
import Lulada from "./Components/Home/Header/logo";
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";
import Navigation from "./Components/Home/navigation";
import Suggestions from "./Components/Home/suggestions";
//home

//inicio de notifications
import CardNotifications from "./Components/Nofications/CardNotifications";
//fin de notifications

//Inicio Explorer
import HeaderExplorer from "./Components/Explore/exploreHeader";
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";
import Explore from "./Pages/Explore/explore";
//Final explorer

//puser
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import PUser from "./Pages/PUser/puser";
//final puser

//restaurantprofile
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";
import RestaurantProfile from "./Pages/RestaurantProfile/RestaurantProfile";
//final restaurantprofile

//Save
import Save from "./Pages/Save/Save";
//Final Save

//Inicio Pagina Login
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";
import LoginPage from "./Pages/LogIn/Login";
//Cierre pagina Login

//Inicio pagina settings
import CajonTexto from "./Components/Settings/CajonTexto";
import CajonList from "./Components/Settings/CajonList";
import LuladaSettings from "./Pages/Settings/Settings";
import CambiarCo from "./Components/Settings/CambiarCorreo/cambiarco";
import CambiarNU from "./Components/Settings/CambiarNombre/cambiarNU";
import CambiarContra from "./Components/Settings/CambiarContraseña/cambiarcontra";
import CambiarContraseñaF from "./Pages/Settings/CambiarContraseña/CambiarContraseñaF"
import CambiarCorreoF from "./Pages/Settings/CambiarCorreo/CambiarCorreoF";
//Cierre pagina settings

//newaccount
import BoxText from "./Components/Newaccount/boxtext";
import NewAccount from "./Pages/NewAccount/containernewaccount";
//ciere de newaccount

//inicio de confirmRole
import ConfirmRole from "./Pages/ConfirmRole/ConfirRole";

//fin de confirmRole

import luladaResponsiveHeader from "./Components/Home/Header/reponsiveheader";
import HeaderCompleto from './Components/Home/Header/HeaderCompleto';

//inicio de antojar
import { LuladaAntojar } from './Components/Home/Antojar/antojar';
import { LuladaAntojarBoton } from './Components/Home/Antojar/antojar-boton';
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';
//Fin de antojar

// IMPORTANTE: Inicializar y exponer el servicio inmediatamente
const antojarService = AntojarPopupService.getInstance();
antojarService.initialize();
(window as any).AntojarPopupService = AntojarPopupService;

customElements.define('lulada-header-complete', HeaderCompleto);

//Root
customElements.define('root-component', RootComponent);
//fin Root

//app container
customElements.define('load-pages', LoadPage);
//fin app container

//inicio home
customElements.define('lulada-home', Home);
customElements.define('lulada-header', HeaderHome);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-logo', Lulada);
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);
customElements.define('lulada-navigation', Navigation);
customElements.define('lulada-suggestions', Suggestions);
//fin home

//inico de componete de header 
customElements.define('lulada-responsive-header', luladaResponsiveHeader);
// final responsive header

//inicio de barra
customElements.define('lulada-responsive-bar', NavigationBar);
//Inicio Explorer
customElements.define('header-explorer', HeaderExplorer);
customElements.define('explore-container', ExploreContainer);
customElements.define('images-explore', ImagesExplore);
customElements.define('text-card', TextCard);
customElements.define('lulada-explore', Explore);
//Final explorer

//puser
customElements.define('user-info', UserInfo);
customElements.define('puser-page', PUser);
customElements.define('user-profile', UserSelftProfile);
customElements.define('user-edit', UserEdit);
//Final puser

//restaurantprofile
customElements.define('restaurant-info', restaurantInfo);
customElements.define('restaurant-profile', RestaurantProfile);
//Final restaurantprofile

//Save
customElements.define('save-page', Save);
//Final Save

//Inicio pagina Login
customElements.define("caja-de-texto", CajaDeTexto);
customElements.define("boton-login", BotonLogin);
customElements.define("login-form", LoginForm);
customElements.define("login-page", LoginPage);
//Cierre pagina Login   

//inicio pagina settings
customElements.define("cajon-texto", CajonTexto);
customElements.define("cajon-list", CajonList);
customElements.define('lulada-settings', LuladaSettings);
customElements.define('cambiar-correo', CambiarCo);
customElements.define('cambiar-nombre', CambiarNU);
customElements.define('cambiar-contraseña', CambiarContra);
customElements.define('lulada-cambiar-contraseña', CambiarContraseñaF);
customElements.define('lulada-cambiar-correo', CambiarCorreoF);
//Cierre pagina settings

//inicio de notifications
customElements.define('lulada-card-notifications', CardNotifications);
customElements.define('lulada-boxtext',BoxText)
customElements.define('lulada-notifications',LuladaNotifications);
//fin de notifications

//inicio de newaccount
customElements.define('register-new-account', NewAccount);

//fin de newaccount

//inicio de confirmRole
customElements.define('confirm-role', ConfirmRole);
//fin de confirmRole

// Registrar los componentes personalizados
customElements.define('lulada-antojar', LuladaAntojar);
customElements.define('lulada-antojar-boton', LuladaAntojarBoton);
//Fin de registrar los componentes personalizados

// Inicializar el servicio cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar el servicio de popup
  AntojarPopupService.getInstance().initialize();
});

// Exportar todo para uso en la aplicación
export { LuladaAntojar, LuladaAntojarBoton, AntojarPopupService };
