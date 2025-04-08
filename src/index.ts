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
import ButtonNewAccount from "./Components/Newaccount/buttonNewAccount";
import BoxText from "./Components/Newaccount/boxtext";







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
