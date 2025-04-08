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

//Inicio Explorer
import HeaderExplorer from "./Components/Explore/exploreHeader";
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";
import Explore from "./Pages/Explore/explore";
//Final explorer


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