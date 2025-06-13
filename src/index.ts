// index.ts - VERSIÓN CORREGIDA BASADA EN LA QUE FUNCIONABA

// ===========================
// EXPORTAR PARA COMPATIBILIDAD
// ===========================
export {};

// ===========================
// INTERFACES Y TIPOS
// ===========================
interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

interface WindowWithGlobal extends Window {
    AntojarPopupService?: {
        getInstance(): unknown;
    };
    UserActions?: unknown;
    debugSidebar?: () => void;
    luladaStatus?: () => void;
    luladaDebug?: () => void;
    debugLoadPage?: () => void;
    debugComponents?: () => void;
    luladaLogout?: () => void;
    luladaEmergencyLogout?: () => void;
    saveUserRole?: (role: 'persona' | 'restaurante') => void;
}

// ===========================
// IMPORTS PRINCIPALES - SOLO LOS QUE EXISTEN
// ===========================

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

// SETTINGS PAGES
import CambiarCorreoF from "./Pages/Settings/CambiarCorreo/CambiarCorreoF";
import NombreUsuraio from "./Pages/Settings/CambiarNombre/CambiarNombreF";
import CambiarContraseñaF from "./Pages/Settings/CambiarContraseña/CambiarContraseñaF";

// NAVEGACIÓN
import Navigation from "./Components/Home/navigation";
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
import UserInfo from "./Components/PUser/userProfile/UserInfo";
import UserSelftProfile from "./Components/PUser/userProfile/UserProfile";
import UserEdit from "./Components/PUser/userProfile/EditButton";
import EditProfileModal from "./Components/PUser/userProfile/EditProfileModal";
import restaurantInfo from "./Components/restaurantProfile/RestaurantInfo";

// OTROS
import LuladaSuggestions from "./Components/Home/suggestions";
import CardNotifications from "./Components/Nofications/CardNotifications";

// LOGIN
import LoginForm from "./Components/Login/CajaLogin";
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";

// NEW ACCOUNT
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

// ===========================
// IMPORTS OPCIONALES (pueden fallar)
// ===========================
let NavigationBar: ComponentConstructor | null = null;
let ResponsiveHeader: ComponentConstructor | null = null;
let LuladaAntojar: ComponentConstructor | null = null;
let LuladaAntojarBoton: ComponentConstructor | null = null;
let AntojarPopupService: unknown = null;
let ResponsiveBar: ComponentConstructor | null = null;
let ConfirmRole: ComponentConstructor | null = null;

// Importar componentes opcionales de forma segura
try {
    const navBarModule = require('./Components/Home/Navbars/responsivebar');
    NavigationBar = navBarModule.default || navBarModule.NavigationBar;
} catch (e) {
    console.log('NavigationBar no disponible');
}

try {
    const responsiveHeaderModule = require('./Components/Home/Header/reponsiveheader');
    ResponsiveHeader = responsiveHeaderModule.default || responsiveHeaderModule.LuladaResponsiveHeader;
} catch (e) {
    console.log('ResponsiveHeader no disponible');
}

try {
    const antojarModule = require('./Components/Home/Antojar/antojar');
    LuladaAntojar = antojarModule.LuladaAntojar || antojarModule.default;
} catch (e) {
    console.log('LuladaAntojar no disponible');
}

try {
    const antojarBotonModule = require('./Components/Home/Antojar/antojar-boton');
    LuladaAntojarBoton = antojarBotonModule.LuladaAntojarBoton || antojarBotonModule.default;
} catch (e) {
    console.log('LuladaAntojarBoton no disponible');
}

try {
    const antojarPopupModule = require('./Components/Home/Antojar/antojar-popup');
    AntojarPopupService = antojarPopupModule.default;
} catch (e) {
    console.log('AntojarPopupService no disponible');
}

try {
    const responsiveBarModule = require('./Components/Home/Navbars/responsivebar');
    ResponsiveBar = responsiveBarModule.default || responsiveBarModule.LuladaResponsiveBar;
} catch (e) {
    console.log('ResponsiveBar no disponible');
}

try {
    const confirmRoleModule = require('./Pages/ConfirmRole/ConfirRole');
    ConfirmRole = confirmRoleModule.default;
} catch (e) {
    console.log('ConfirmRole no disponible');
}

// ===========================
// IMPLEMENTACIÓN DE UserActions (desde la versión que funcionaba)
// ===========================
const UserActionsImplementation = {
    loadUserData: (userData: unknown) => {
        console.log('📥 Cargando datos de usuario:', userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    },

    updateUserData: (userData: unknown) => {
        console.log('🔄 Actualizando datos de usuario:', userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        const updateEvent = new CustomEvent('userDataUpdated', {
            detail: userData,
            bubbles: true
        });
        document.dispatchEvent(updateEvent);
    },

    updateUsername: (newUsername: string) => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.nombreDeUsuario = newUsername;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Username actualizado:', newUsername);
            } catch (error) {
                console.error('❌ Error actualizando username:', error);
            }
        }
    },

    updateFullName: (newName: string) => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.nombre = newName;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Nombre completo actualizado:', newName);
            } catch (error) {
                console.error('❌ Error actualizando nombre:', error);
            }
        }
    },

    updateDescription: (newDescription: string) => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.descripcion = newDescription;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Descripción actualizada:', newDescription);
            } catch (error) {
                console.error('❌ Error actualizando descripción:', error);
            }
        }
    },

    updatePhoto: (newPhotoUrl: string) => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.foto = newPhotoUrl;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Foto actualizada:', newPhotoUrl);
            } catch (error) {
                console.error('❌ Error actualizando foto:', error);
            }
        }
    },

    updateRole: (newRole: string) => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.rol = newRole;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Rol actualizado:', newRole);
            } catch (error) {
                console.error('❌ Error actualizando rol:', error);
            }
        }
    },

    resetProfile: () => {
        console.log('🔄 Reseteando perfil...');
        localStorage.removeItem('currentUser');
        localStorage.setItem('isAuthenticated', 'false');
        
        const resetEvent = new CustomEvent('userProfileReset', {
            bubbles: true
        });
        document.dispatchEvent(resetEvent);
    }
};

// ===========================
// IMPLEMENTACIÓN DE AntojarService SIMPLE
// ===========================
class SimpleAntojarService {
    private static instance: SimpleAntojarService;
    
    public static getInstance(): SimpleAntojarService {
        if (!SimpleAntojarService.instance) {
            SimpleAntojarService.instance = new SimpleAntojarService();
        }
        return SimpleAntojarService.instance;
    }

    public initialize(): void {
        console.log('🔧 AntojarService simple inicializado');
    }

    public showPopup(): void {
        console.log('📝 Mostrando popup de Antojar (simple)');
        
        // Buscar si existe el componente lulada-antojar
        const existingAntojar = document.querySelector('lulada-antojar');
        if (existingAntojar) {
            console.log('✅ Componente lulada-antojar encontrado');
            return;
        }

        // Crear overlay simple
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.6);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const antojarComponent = document.createElement('lulada-antojar');
        antojarComponent.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        overlay.appendChild(antojarComponent);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    public hidePopup(): void {
        console.log('🚫 Ocultando popup de Antojar');
    }
}

// ===========================
// REGISTRO SEGURO DE COMPONENTES
// ===========================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (!component) {
            console.log(`⚠️ ${name} - componente no disponible`);
            return false;
        }

        if (customElements.get(name)) {
            console.log(`⚠️ ${name} ya registrado, saltando...`);
            return true;
        }
        
        customElements.define(name, component);
        console.log(`✅ ${name} registrado exitosamente`);
        return true;
    } catch (error) {
        console.error(`❌ Error registrando ${name}:`, error);
        return false;
    }
}

console.log('🚀 === INICIANDO REGISTRO DE COMPONENTES ===');

// ===========================
// REGISTRO EN ORDEN CORRECTO (basado en la versión que funcionaba)
// ===========================

// CORE (SIEMPRE PRIMERO)
registerComponent('root-component', RootComponent);
registerComponent('load-pages', LoadPage);

// HEADERS (nombres corregidos)
registerComponent('lulada-header-completo', HeaderCompleto);
registerComponent('lulada-header-home', HeaderHome);
registerComponent('lulada-header', HeaderHome); // Alias para compatibilidad
registerComponent('lulada-logo', Lulada);
registerComponent('lulada-header-explorer', HeaderExplorer);
registerComponent('header-explorer', HeaderExplorer); // Alias para compatibilidad

// NAVEGACIÓN
registerComponent('lulada-navigation', Navigation);
registerComponent('lulada-sidebar', LuladaSidebar);

// NAVEGACIÓN OPCIONAL
if (NavigationBar) {
    registerComponent('lulada-responsive-bar', NavigationBar);
}

if (ResponsiveHeader) {
    registerComponent('lulada-responsive-header', ResponsiveHeader);
}

// PÁGINAS PRINCIPALES
registerComponent('lulada-home', Home);
registerComponent('lulada-explore', LuladaExplore);
registerComponent('puser-page', PUser);
registerComponent('restaurant-profile', RestaurantProfile);
registerComponent('save-page', Save);
registerComponent('login-page', LoginPage);
registerComponent('lulada-settings', LuladaSettings);
registerComponent('lulada-notifications', LuladaNotifications);
registerComponent('register-new-account', NewAccount);

// SETTINGS PAGES
registerComponent('lulada-cambiar-correo', CambiarCorreoF);
registerComponent('lulada-cambiar-nombre', NombreUsuraio);
registerComponent('lulada-cambiar-contraseña', CambiarContraseñaF);

// COMPONENTES OPCIONALES
if (ConfirmRole) {
    registerComponent('lulada-confirm-role', ConfirmRole);
}

// USUARIO (nombres corregidos)
registerComponent('lulada-user-info', UserInfo);
registerComponent('lulada-user-profile', UserSelftProfile);
registerComponent('user-profile', UserSelftProfile); // Alias para compatibilidad
registerComponent('lulada-user-edit', UserEdit);
registerComponent('lulada-edit-profile-modal', EditProfileModal);
registerComponent('lulada-restaurant-info', restaurantInfo);

// PUBLICACIONES
registerComponent('lulada-publication', Publication);
registerComponent('lulada-review', Review);
registerComponent('lulada-reviews-container', ReviewsContainer);

// EXPLORACIÓN (nombres corregidos)
registerComponent('lulada-explore-container', ExploreContainer);
registerComponent('explore-container', ExploreContainer); // Alias para compatibilidad
registerComponent('lulada-images-explore', ImagesExplore);
registerComponent('images-explore', ImagesExplore); // Alias para compatibilidad
registerComponent('lulada-text-card', TextCard);
registerComponent('text-card', TextCard); // Alias para compatibilidad

// OTROS
registerComponent('lulada-suggestions', LuladaSuggestions);
registerComponent('lulada-card-notifications', CardNotifications);

// LOGIN
registerComponent('login-form', LoginForm);
registerComponent('lulada-caja-de-texto', CajaDeTexto);
registerComponent('lulada-boton-login', BotonLogin);

// NEW ACCOUNT
registerComponent('lulada-box-text', BoxText);
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

// ANTOJAR (OPCIONAL)
if (LuladaAntojar) {
    registerComponent('lulada-antojar', LuladaAntojar);
}

if (LuladaAntojarBoton) {
    registerComponent('lulada-antojar-boton', LuladaAntojarBoton);
}

// ===========================
// ASIGNACIÓN GLOBAL SEGURA
// ===========================
if (typeof window !== 'undefined') {
    const globalWindow = window as WindowWithGlobal;
    
    // UserActions
    if (!globalWindow.UserActions) {
        globalWindow.UserActions = UserActionsImplementation;
    }
    
    // AntojarPopupService (usar el real si está disponible, sino el simple)
    if (!globalWindow.AntojarPopupService) {
        if (AntojarPopupService) {
            globalWindow.AntojarPopupService = AntojarPopupService as { getInstance(): unknown };
        } else {
            globalWindow.AntojarPopupService = {
                getInstance: () => SimpleAntojarService.getInstance()
            };
        }
    }

    // Funciones de debug (solo si no existen)
    if (!globalWindow.debugLoadPage) {
        globalWindow.debugLoadPage = () => {
            const loadPage = document.querySelector('load-pages');
            console.log('🔍 === DEBUG LOAD PAGE ===');
            console.log('LoadPages en DOM:', !!loadPage);
            console.log('Ruta actual:', window.location.pathname);
            console.log('Autenticado:', localStorage.getItem('isAuthenticated'));
            console.log('===========================');
        };
    }

    if (!globalWindow.luladaStatus) {
        globalWindow.luladaStatus = () => {
            console.log('📊 === STATUS LULADA ===');
            console.log('✅ Componentes críticos:');
            console.log('- RootComponent:', !!customElements.get('root-component'));
            console.log('- LoadPage:', !!customElements.get('load-pages'));
            console.log('- Home:', !!customElements.get('lulada-home'));
            console.log('- Login:', !!customElements.get('login-page'));
            console.log('- NewAccount:', !!customElements.get('register-new-account'));
            
            console.log('🔧 Servicios:');
            console.log('- UserActions:', !!globalWindow.UserActions);
            console.log('- AntojarPopupService:', !!globalWindow.AntojarPopupService);
            
            console.log('🌐 DOM:');
            console.log('- root-component en DOM:', !!document.querySelector('root-component'));
            console.log('- load-pages en DOM:', !!document.querySelector('load-pages'));
            
            console.log('🔐 Auth:');
            console.log('- Autenticado:', localStorage.getItem('isAuthenticated'));
            console.log('- Usuario:', !!localStorage.getItem('currentUser'));
            
            console.log('====================');
        };
    }

    if (!globalWindow.luladaLogout) {
        globalWindow.luladaLogout = () => {
            const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');
            if (confirmed) {
                localStorage.clear();
                sessionStorage.clear();
                console.log('🚪 Sesión cerrada correctamente');
                window.location.href = '/login';
            }
        };
    }

    if (!globalWindow.luladaEmergencyLogout) {
        globalWindow.luladaEmergencyLogout = () => {
            console.log('🚨 === LOGOUT DE EMERGENCIA ===');
            localStorage.clear();
            sessionStorage.clear();
            console.log('🧹 Todos los datos limpiados');
            window.location.href = '/';
        };
    }

    if (!globalWindow.saveUserRole) {
        globalWindow.saveUserRole = (role: 'persona' | 'restaurante') => {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    userData.role = role;
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    console.log(`✅ Rol "${role}" guardado exitosamente`);
                } catch (error) {
                    console.error('❌ Error guardando rol:', error);
                }
            } else {
                console.warn('⚠️ No hay usuario actual para asignar rol');
            }
        };
    }
}

// ===========================
// INICIALIZACIÓN FINAL
// ===========================

// Inicializar AntojarService
if (typeof window !== 'undefined') {
    try {
        const service = (window as WindowWithGlobal).AntojarPopupService?.getInstance();
        if (service && typeof (service as any).initialize === 'function') {
            (service as any).initialize();
        }
    } catch (error) {
        console.log('Info: AntojarService simple en uso');
    }
}

// Crear root-component automáticamente
setTimeout(() => {
    if (!document.querySelector('root-component')) {
        const root = document.createElement('root-component');
        document.body.appendChild(root);
        console.log('✅ Root component creado automáticamente');
    }
}, 100);

// Verificación de salud de la app
setTimeout(() => {
    const loadPages = document.querySelector('load-pages');
    if (!loadPages) {
        console.error('❌ CRÍTICO: load-pages no encontrado después de 2s');
        console.log('🔧 Ejecuta window.luladaStatus() para diagnóstico');
    } else {
        console.log('✅ App cargada exitosamente');
    }
}, 2000);

console.log('✅ === APLICACIÓN LULADA INICIALIZADA CORRECTAMENTE ===');

// ===========================
// EXPORTS (para compatibilidad)
// ===========================
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