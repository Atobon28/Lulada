import RootComponent from "./Components/Root/RootComponent";
import Home from "./Pages/Home/home"
import Header from "./Components/Home/Header/Header";
import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import Lulada from "./Components/Home/Header/logo";
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";
import Navigation from "./Components/Home/navigation";
import Suggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";

//Inicio Explorer
import HeaderExplorer from "./Components/Explore/exploreHeader";
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";
import Explore from "./Pages/Explore/explore";
//Final explorer
//Inicio Pagina Login
import CajaDeTexto from "./Components/Login/CajaTexto";
import BoxText from "./Components/Newaccount/boxtext";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";
import LoginPage from "./Pages/LogIn/Login";


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
import ButtonNewAccount from "./Components/Newaccount/buttonNewAccount";








customElements.define('root-component', RootComponent);
customElements.define('lulada-home', Home);
customElements.define('lulada-header', Header);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-logo', Lulada);
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);
customElements.define('lulada-navigation', Navigation);
customElements.define('lulada-suggestions', Suggestions);

//Inicio Explorer
customElements.define('header-explorer', HeaderExplorer);
customElements.define('explore-container', ExploreContainer);
customElements.define('images-explore', ImagesExplore);
customElements.define('text-card', TextCard);
customElements.define('lulada-explore', Explore);
//Final explorer

//puser
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import PUser from "./Pages/PUser/puser";

customElements.define('user-info', UserInfo);
customElements.define('puser-component', PUser);
customElements.define('user-profile', UserSelftProfile);
customElements.define('user-edit', UserEdit);
//Final puser

//restaurantprofile
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";
import RestaurantProfile from "./Pages/RestaurantProfile/RestaurantProfile";

customElements.define('restaurant-info', restaurantInfo);
customElements.define('restaurant-profile', RestaurantProfile);
//Final restaurantprofile

//Save
import Save from "./Pages/Save/Save";
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


customElements.define('lulada-card-notifications', CardNotifications);
customElements.define('lulada-boton-login', BotonLogin);
customElements.define('lulada-boxtext',BoxText)




 //inicio

 customElements.define('lulada-notifications', Notifications);
//fin
//inicio

customElements.define('register-new-account', NewAccount);
customElements.define('lulada-card-notifications', CardNotifications);
customElements.define('lulada-button-newaccount',ButtonNewAccount)
customElements.define('lulada-boxtext',BoxText)


 //inicio
 import Notifications from "./Pages/Notifications/Notifications";
 customElements.define('lulada-notifications', Notifications);
//fin
//inicio
import NewAccount from "./Pages/NewAccount/containernewaccount";
customElements.define('register-new-account', NewAccount);
//fin
//inicio
import ConfirmRole from "./Pages/ConfirmRole/ConfirRole";
customElements.define('confirm-role', ConfirmRole);
