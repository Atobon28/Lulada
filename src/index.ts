//Root Component
import RootComponent from "./Components/Root/RootComponent";
//Root component

//home
import Home from "./Pages/Home/home"
import Header from "./Components/Home/Header/Header";
import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import Lulada from "./Components/Home/Header/logo";
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";
import Navigation from "./Components/Home/navigation";
import Suggestions from "./Components/Home/suggestions";
//home

//inicio de notifications
import CardNotifications from "./Components/Nofications/CardNotifications";
import Notifications from "./Pages/Notifications/Notifications";
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
import CambiarNombreUsuraio from "./Pages/Settings/CambiarNombre/CambiarNombreF";
//Cierre pagina settings

//newaccount
import BoxText from "./Components/Newaccount/boxtext";
import ButtonNewAccount from "./Components/Newaccount/buttonNewAccount";
import NewAccount from "./Pages/NewAccount/containernewaccount";
//ciere de newaccount

//inicio de confirmRole
import ConfirmRole from "./Pages/ConfirmRole/ConfirRole";
//fin de confirmRole


//Root
customElements.define('root-component', RootComponent);
//fin Root

//inicio home
customElements.define('lulada-home', Home);
customElements.define('lulada-header', Header);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-logo', Lulada);
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);
customElements.define('lulada-navigation', Navigation);
customElements.define('lulada-suggestions', Suggestions);
//fin home

//Inicio Explorer
customElements.define('header-explorer', HeaderExplorer);
customElements.define('explore-container', ExploreContainer);
customElements.define('images-explore', ImagesExplore);
customElements.define('text-card', TextCard);
customElements.define('lulada-explore', Explore);
//Final explorer

//puser
customElements.define('user-info', UserInfo);
customElements.define('puser-component', PUser);
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
customElements.define('lulada-cambiar-nombre', CambiarNombreUsuraio);
//Cierre pagina settings

//inicio de notifications
customElements.define('lulada-card-notifications', CardNotifications);
customElements.define('lulada-boton-login', BotonLogin);
customElements.define('lulada-boxtext',BoxText)
customElements.define('lulada-notifications', Notifications);
//fin de notifications

//inicio de newaccount
customElements.define('register-new-account', NewAccount);
customElements.define('lulada-button-newaccount',ButtonNewAccount)
//fin de newaccount

//inicio de confirmRole
customElements.define('confirm-role', ConfirmRole);
//fin de confirmRole
