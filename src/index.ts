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

//Inicio Pagina Login
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from './Components/Login/CajaLogin';
import LoginPage from "./Pages/LogIn/Login";
//Cierre pagina Login

//Inicio pagina settings
import CajonTexto from "./Components/Settings/CajonTexto";
import CajonList from "./Components/Settings/CajonList";
import LuladaSettings from "./Pages/Settings/Settings";
//Cierre pagina settings



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
//cierre pagina settings