import RootComponent from "./Components/Root/RootComponent";
import Home from "./Pages/Home/home"
import HeaderHome from "./Components/Home/Header/Header";
import LuladaSidebar from "./Components/Home/Navbars/sidebar";
import Lulada from "./Components/Home/Header/logo";
import Publication from "./Components/Home/posts/publications";
import Review from "./Components/Home/posts/reviews";
import ReviewsContainer from "./Components/Home/posts/reviewscontainer";
import Navigation from "./Components/Home/navigation";
import Suggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";






customElements.define('root-component', RootComponent);
customElements.define('lulada-home', Home);
customElements.define('home-header', HeaderHome);
customElements.define('lulada-sidebar', LuladaSidebar);
customElements.define('lulada-logo', Lulada);
customElements.define('lulada-publication', Publication);
customElements.define('lulada-review', Review);
customElements.define('lulada-reviews-container', ReviewsContainer);
customElements.define('lulada-navigation', Navigation);
customElements.define('lulada-suggestions', Suggestions);
customElements.define('lulada-card-notifications', CardNotifications);


 //inicio
 import Notifications from "./Pages/Notifications/Notifications";
 customElements.define('lulada-notifications', Notifications);
