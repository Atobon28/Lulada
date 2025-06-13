// src/index.ts - VERSIÓN SIMPLE SIN CONFLICTOS DE TIPOS
export {};

// Importar servicios básicos primero
import './services-global';

// =======================
// INTERFACES BÁSICAS
// =======================

interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

interface SidebarElement extends HTMLElement {
    debugNavigation?(): void;
}

// =======================
// FUNCIONES PARA MANEJO DE ROLES (DECLARADAS AL INICIO)
// =======================

// Función para detectar tipo de usuario
async function getUserRole(): Promise<'persona' | 'restaurante' | null> {
    try {
        // Intentar obtener el rol desde Firebase
        const { getCurrentUser } = await import('./Services/firebase/Authservice');
        const user = getCurrentUser();
        
        if (user) {
            // Verificar si el usuario tiene rol guardado en localStorage
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                if (userData.role) {
                    return userData.role;
                }
            }
            
            // Si no hay rol guardado, verificar en Firebase/Firestore
            // Por ahora usamos una lógica simple basada en el email
            if (user.email?.includes('restaurant') || user.email?.includes('negocio')) {
                return 'restaurante';
            }
            
            // Por defecto, asumir que es persona
            return 'persona';
        }
        
        // Fallback: verificar localStorage
        const isAuth = localStorage.getItem('isAuthenticated');
        if (isAuth === 'true') {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                return userData.role || 'persona';
            }
        }
        
        return null;
        
    } catch (error) {
        console.log('⚠️ Error detectando rol de usuario, usando default');
        
        // Fallback final: verificar localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                return userData.role || 'persona';
            } catch {
                return 'persona';
            }
        }
        
        return null;
    }
}

// Función para guardar rol de usuario
function saveUserRole(role: 'persona' | 'restaurante'): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            userData.role = role;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log(`✅ Rol de usuario guardado: ${role}`);
        } catch (error) {
            console.error('Error guardando rol de usuario:', error);
        }
    }
}

// =======================
// IMPORTS BÁSICOS SOLAMENTE
// =======================

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

// EXPLORACIÓN
import ExploreContainer from "./Components/Explore/explorecontainer";
import ImagesExplore from "./Components/Explore/imagesExplore";
import TextCard from "./Components/Explore/textCard";

// USUARIO
import { UserInfo } from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import { EditProfileModal } from "./Components/PUser/userProfile/EditProfileModal";
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";

// OTROS
import LuladaSuggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";

// LOGIN - COMPONENTES NECESARIOS
import LoginForm from "./Components/Login/CajaLogin";
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";

// NEW ACCOUNT - COMPONENTES NECESARIOS
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
// REGISTRO DE COMPONENTES
// =======================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (!customElements.get(name)) {
            customElements.define(name, component);
            console.log(`✅ ${name} registrado`);
        }
        return true;
    } catch (error) {
        console.error(`❌ Error registrando ${name}:`, error);
        return false;
    }
}

console.log('🚀 === REGISTRANDO COMPONENTES ===');

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
registerComponent('cambiar-correo-f', CambiarCorreoF);
registerComponent('nombre-usuario', NombreUsuraio);
registerComponent('cambiar-contraseña-f', CambiarContraseñaF);

// PUBLICACIONES
registerComponent('lulada-publication', Publication);
registerComponent('lulada-review', Review);
registerComponent('lulada-reviews-container', ReviewsContainer);

// EXPLORACIÓN
registerComponent('explore-container', ExploreContainer);
registerComponent('images-explore', ImagesExplore);
registerComponent('text-card', TextCard);

// USUARIO
registerComponent('user-info', UserInfo as ComponentConstructor);
registerComponent('user-profile', UserSelftProfile);
registerComponent('user-edit', UserEdit);
registerComponent('edit-profile-modal', EditProfileModal as ComponentConstructor);
registerComponent('restaurant-info', restaurantInfo);

// OTROS
registerComponent('lulada-suggestions', LuladaSuggestions);
registerComponent('lulada-card-notifications', CardNotifications);

// LOGIN - COMPONENTES ESENCIALES
registerComponent("caja-de-texto", CajaDeTexto);
registerComponent("boton-login", BotonLogin);
registerComponent("login-form", LoginForm);

// NEW ACCOUNT - COMPONENTES ESENCIALES
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

console.log('✅ Todos los componentes registrados');

// =======================
// NAVEGACIÓN PRINCIPAL
// =======================
function showPage(route: string): void {
    console.log(`📍 Navegando a: ${route}`);
    
    // Buscar el contenedor de la app
    let appContainer = document.getElementById('app-container');
    if (!appContainer) {
        // Si no existe, crear uno
        appContainer = document.createElement('div');
        appContainer.id = 'app-container';
        document.body.appendChild(appContainer);
    }

    // Limpiar contenido anterior
    appContainer.innerHTML = '';

    // Mostrar la página correspondiente
    let pageContent = '';
    
    switch (route) {
        case '/':
        case '/login':
            pageContent = '<login-page></login-page>';
            break;
            
        case '/register':
        case '/newaccount':
            pageContent = '<register-new-account></register-new-account>';
            break;
            
        case '/home':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <lulada-home></lulada-home>
                <lulada-navigation></lulada-navigation>
            `;
            break;
            
        case '/profile':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <puser-page></puser-page>
                <lulada-navigation></lulada-navigation>
            `;
            break;
            
        case '/explore':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <lulada-explore></lulada-explore>
                <lulada-navigation></lulada-navigation>
            `;
            break;

        case '/save':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <save-page></save-page>
                <lulada-navigation></lulada-navigation>
            `;
            break;

        case '/settings':
        case '/configurations':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <lulada-settings></lulada-settings>
                <lulada-navigation></lulada-navigation>
            `;
            break;

        case '/notifications':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <lulada-notifications></lulada-notifications>
                <lulada-navigation></lulada-navigation>
            `;
            break;

        case '/confirm-role':
            pageContent = '<confirm-role></confirm-role>';
            break;

        case '/cambiar-correo':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <cambiar-correo-f></cambiar-correo-f>
                <lulada-navigation></lulada-navigation>
            `;
            break;

        case '/cambiar-nombre':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <nombre-usuario></nombre-usuario>
                <lulada-navigation></lulada-navigation>
            `;
            break;

        case '/cambiar-contraseña':
            pageContent = `
                <lulada-header-complete></lulada-header-complete>
                <cambiar-contraseña-f></cambiar-contraseña-f>
                <lulada-navigation></lulada-navigation>
            `;
            break;
            
        default:
            console.warn(`⚠️ Ruta no reconocida: ${route}, redirigiendo a /login`);
            pageContent = '<login-page></login-page>';
            break;
    }

    // Insertar el contenido en el contenedor
    appContainer.innerHTML = pageContent;
    
    // Actualizar URL del navegador
    if (window.location.hash !== '#' + route) {
        window.location.hash = route;
    }
}

// =======================
// MANEJO DE NAVEGACIÓN - ACTUALIZADO
// =======================
function handleRouteChange(): void {
    const hash = window.location.hash.substring(1);
    const route = hash || '/login'; // Por defecto, ir a login
    showPage(route);
}

// Escuchar eventos de navegación personalizados
document.addEventListener('navigate', (event: Event) => {
    const customEvent = event as CustomEvent;
    const route = customEvent.detail;
    console.log(`🚀 Evento de navegación recibido: ${route}`);
    showPage(route);
});

// NUEVO: Agregar listeners para selección de rol
document.addEventListener('user-role-selected', (event: Event) => {
    const customEvent = event as CustomEvent;
    const selectedRole = customEvent.detail.role;
    
    console.log(`👤 Usuario seleccionó rol: ${selectedRole}`);
    saveUserRole(selectedRole);
    
    // Navegar al perfil apropiado
    const navEvent = new CustomEvent('navigate', {
        detail: '/profile',
        bubbles: true,
        composed: true
    });
    document.dispatchEvent(navEvent);
});

// =======================
// FUNCIONES DE DEBUG ACTUALIZADAS
// =======================
const setupDebugFunctions = () => {
    const w = window as unknown as Record<string, unknown>;
    
    // NUEVO: Debug de rol de usuario
    if (!w.debugUserRole) {
        w.debugUserRole = async () => {
            const role = await getUserRole();
            console.log('👤 Rol de usuario actual:', role);
            
            const isAuth = localStorage.getItem('isAuthenticated');
            const currentUser = localStorage.getItem('currentUser');
            
            console.log('🔐 Estado de autenticación:', {
                isAuthenticated: isAuth === 'true',
                userData: currentUser ? JSON.parse(currentUser) : null,
                userRole: role
            });
        };
    }
    
    // NUEVO: Cambiar rol de usuario
    if (!w.switchUserRole) {
        w.switchUserRole = (newRole: 'persona' | 'restaurante') => {
            saveUserRole(newRole);
            console.log(`🔄 Rol cambiado a: ${newRole}`);
            
            // Recargar la página de perfil si estamos en ella
            if (window.location.hash.includes('/profile')) {
                const navEvent = new CustomEvent('navigate', {
                    detail: '/profile',
                    bubbles: true,
                    composed: true
                });
                document.dispatchEvent(navEvent);
            }
        };
    }

    if (!w.debugSidebar) {
        w.debugSidebar = () => {
            const sidebar = document.querySelector('lulada-sidebar') as SidebarElement | null;
            if (sidebar?.debugNavigation) {
                sidebar.debugNavigation();
            } else {
                console.log("🔍 Sidebar no encontrado o sin método debug");
            }
        };
    }

    if (!w.luladaStatus) {
        w.luladaStatus = () => {
            console.log("📊 Estado de Lulada:", {
                currentRoute: window.location.hash,
                componentsLoaded: {
                    appContainer: !!document.getElementById('app-container'),
                    sidebar: !!document.querySelector('lulada-sidebar'),
                    navigation: !!document.querySelector('lulada-navigation')
                },
                registeredComponents: [
                    'login-page',
                    'login-form',
                    'register-new-account',
                    'button-new-account',
                    'lulada-home',
                    'lulada-navigation',
                    'lulada-sidebar',
                    'puser-page',
                    'restaurant-profile'
                ].map(name => ({
                    name,
                    registered: !!customElements.get(name)
                }))
            });
        };
    }

    // NUEVO: Debug completo con información de usuario
    if (!w.luladaDebugComplete) {
        w.luladaDebugComplete = async () => {
            console.log('🚀 === DEBUG COMPLETO LULADA ===');
            
            // Estado de usuario
            const role = await getUserRole();
            const isAuth = localStorage.getItem('isAuthenticated') === 'true';
            const currentUser = localStorage.getItem('currentUser');
            
            console.log('\n👤 USUARIO:');
            console.log('- Autenticado:', isAuth);
            console.log('- Rol:', role);
            console.log('- Datos:', currentUser ? JSON.parse(currentUser) : null);
            
            // Estado de la app
            console.log('\n📱 APLICACIÓN:');
            console.log('- Ruta actual:', window.location.hash);
            console.log('- Contenedor app:', !!document.getElementById('app-container'));
            
            // Componentes registrados
            console.log('\n🔧 COMPONENTES:');
            ['login-page', 'register-new-account', 'lulada-home', 'puser-page', 'restaurant-profile'].forEach(name => {
                console.log(`- ${name}:`, !!customElements.get(name) ? '✅' : '❌');
            });
            
            console.log('\n🎯 COMANDOS DISPONIBLES:');
            console.log('- window.debugUserRole() - Ver rol actual');
            console.log('- window.switchUserRole("persona"|"restaurante") - Cambiar rol');
            console.log('- window.luladaStatus() - Estado general');
            
            console.log('\n=== FIN DEBUG ===');
        };
    }
};

// =======================
// INICIALIZACIÓN PRINCIPAL
// =======================
const initializeApp = () => {
    console.log('🚀 Iniciando aplicación Lulada...');
    
    try {
        // Ocultar loader si existe
        const loader = document.getElementById('app-loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Setup debug functions
        setupDebugFunctions();
        
        // Configurar navegación
        window.addEventListener('hashchange', handleRouteChange);
        window.addEventListener('popstate', handleRouteChange);
        
        // Mostrar página inicial
        handleRouteChange();
        
        console.log('✅ Aplicación Lulada iniciada correctamente');
        
    } catch (error) {
        console.error('❌ Error iniciando la aplicación:', error);
    }
};

// Inicializar cuando esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // Si ya está cargado, dar tiempo a que terminen de registrarse los componentes
    setTimeout(initializeApp, 100);
}

// =======================
// EXPORTS BÁSICOS
// =======================
export {
    Home,
    LuladaExplore,
    PUser,
    RestaurantProfile,
    Save,
    LoginPage,
    LuladaSettings,
    LuladaNotifications,
    HeaderCompleto,
    LuladaSidebar,
    Publication,
    ReviewsContainer
};

export default {
    Publication,
    ReviewsContainer
};