import RootComponent from "./Components/Root/RootComponent";
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from './Components/Login/CajaLogin';
import LoginPage from "./Pages/LogIn/Login";


customElements.define('root-component', RootComponent);
customElements.define("caja-de-texto", CajaDeTexto);
customElements.define("boton-login", BotonLogin);
customElements.define("login-form", LoginForm);
customElements.define("login-page", LoginPage);
