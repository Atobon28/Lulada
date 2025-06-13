// index.ts - VERSIÓN FINAL SIN ERRORES DE TYPESCRIPT

// ===========================
// IMPORTS DE TIPOS
// ===========================
import type { UserData, UserActionsType, WindowAntojarServiceType } from './types';

// ===========================
// IMPORTS PRINCIPALES
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

// SERVICES
import './Services/PublicationsService';

// ===========================
// TIPOS Y INTERFACES
// ===========================
type ComponentConstructor = new () => HTMLElement;

// ===========================
// IMPLEMENTACIÓN COMPLETA DE UserActions
// ===========================
const UserActionsImplementation: UserActionsType = {
    loadUserData: (userData: UserData) => {
        console.log('📥 Cargando datos de usuario:', userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    },

    updateUserData: (userData: UserData) => {
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

    updateLocation: (newLocation: string) => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.locationText = newLocation;
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Ubicación actualizada:', newLocation);
            } catch (error) {
                console.error('❌ Error actualizando ubicación:', error);
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

    updatePassword: (newPassword: string) => {
        console.log('🔒 Actualizando contraseña...');
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const userData = JSON.parse(currentUser);
                userData.lastPasswordUpdate = Date.now();
                localStorage.setItem('currentUser', JSON.stringify(userData));
                console.log('✅ Contraseña actualizada');
            } catch (error) {
                console.error('❌ Error actualizando contraseña:', error);
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
// IMPLEMENTACIÓN DEL ANTOJAR SERVICE
// ===========================
class AntojarServiceImplementation {
    private static instance: AntojarServiceImplementation;
    private isInitialized: boolean = false;
    
    public popupContainer: HTMLDivElement | null = null;
    public antojarComponent: HTMLElement | null = null;

    private constructor() {}

    public static getInstance(): AntojarServiceImplementation {
        if (!AntojarServiceImplementation.instance) {
            AntojarServiceImplementation.instance = new AntojarServiceImplementation();
        }
        return AntojarServiceImplementation.instance;
    }

    public initialize(): void {
        if (this.isInitialized) return;
        
        console.log('🔧 Inicializando AntojarService...');
        this.isInitialized = true;
        
        const style = document.createElement('style');
        style.textContent = `
            .antojar-popup-overlay {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(0,0,0,0.6) !important;
                z-index: 9998 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ AntojarService inicializado');
    }

    public showPopup(): void {
        console.log('📝 Mostrando popup de Antojar');
        this.initialize();
        this.hidePopup();

        const overlay = document.createElement('div');
        overlay.className = 'antojar-popup-overlay';
        overlay.id = 'antojar-overlay';

        this.antojarComponent = document.createElement('lulada-antojar');
        this.antojarComponent.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;

        overlay.appendChild(this.antojarComponent);
        document.body.appendChild(overlay);
        this.popupContainer = overlay;

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hidePopup();
            }
        });
    }

    public hidePopup(): void {
        const existingOverlay = document.getElementById('antojar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        this.popupContainer = null;
        this.antojarComponent = null;
    }

    public togglePopup(): void {
        if (this.popupContainer) {
            this.hidePopup();
        } else {
            this.showPopup();
        }
    }
}

// ===========================
// ASIGNACIÓN SEGURA A WINDOW SIN REDECLARACIÓN
// ===========================
if (typeof window !== 'undefined' && !window.UserActions) {
    window.UserActions = UserActionsImplementation;
}

if (typeof window !== 'undefined' && !window.AntojarPopupService) {
    window.AntojarPopupService = {
        getInstance: () => AntojarServiceImplementation.getInstance()
    };
}

// Funciones de debug (solo si no existen)
if (typeof window !== 'undefined') {
    if (!window.debugSuggestions) {
        window.debugSuggestions = (): void => {
            console.log('🔍 === DEBUG SUGGESTIONS ===');
            const suggestions = document.querySelectorAll('lulada-suggestions');
            console.log('Componentes suggestions encontrados:', suggestions.length);
            console.log('=== FIN DEBUG SUGGESTIONS ===');
        };
    }

    if (!window.debugUserInfo) {
        window.debugUserInfo = (): void => {
            console.log('🔍 === DEBUG USER INFO ===');
            console.log('Usuario actual:', localStorage.getItem('currentUser'));
            console.log('Estado de autenticación:', localStorage.getItem('isAuthenticated'));
            console.log('=== FIN DEBUG USER INFO ===');
        };
    }

    if (!window.debugHome) {
        window.debugHome = (): void => {
            console.log('🔍 === DEBUG HOME ===');
            const homeComponents = document.querySelectorAll('lulada-home');
            console.log('Componentes home encontrados:', homeComponents.length);
            console.log('=== FIN DEBUG HOME ===');
        };
    }

    if (!window.debugLoadPage) {
        window.debugLoadPage = (): void => {
            console.log('🔍 === DEBUG LOAD PAGE ===');
            const loadPages = document.querySelectorAll('load-pages');
            console.log('LoadPages activos:', loadPages.length);
            console.log('Ruta actual:', window.location.pathname);
            console.log('=== FIN DEBUG LOAD PAGE ===');
        };
    }

    if (!window.debugRestaurantNav) {
        window.debugRestaurantNav = (): void => {
            console.log('🔍 === DEBUG RESTAURANT NAV ===');
            console.log('Navegación de restaurante debuggeada');
            console.log('=== FIN DEBUG RESTAURANT NAV ===');
        };
    }

    if (!window.luladaStatus) {
        window.luladaStatus = (): void => {
            console.log('=== 🚀 LULADA STATUS ===');
            console.log('📱 Usuario:', localStorage.getItem('currentUser'));
            console.log('🔐 Autenticado:', localStorage.getItem('isAuthenticated'));
            console.log('⚙️ UserActions:', !!window.UserActions);
            console.log('🍽️ AntojarPopupService:', !!window.AntojarPopupService);
            console.log('🌐 URL actual:', window.location.href);
            console.log('=== FIN STATUS ===');
        };
    }

    if (!window.luladaLogout) {
        window.luladaLogout = (): void => {
            const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');
            if (confirmed) {
                localStorage.clear();
                sessionStorage.clear();
                console.log('🚪 Sesión cerrada correctamente');
                window.location.href = '/login';
            }
        };
    }

    if (!window.luladaEmergencyLogout) {
        window.luladaEmergencyLogout = (): void => {
            console.log('🚨 === LOGOUT DE EMERGENCIA ===');
            localStorage.clear();
            sessionStorage.clear();
            console.log('🧹 Todos los datos limpiados');
            window.location.href = '/';
        };
    }

    if (!window.saveUserRole) {
        window.saveUserRole = (role: 'persona' | 'restaurante'): void => {
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
// REGISTRO DE COMPONENTES SEGURO
// ===========================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (customElements.get(name)) {
            console.log(`⚠️ ${name} ya registrado, saltando...`);
            return true;
        }
        
        customElements.define(name, component);
        console.log(`✅ ${name} registrado`);
        return true;
    } catch (error) {
        console.error(`❌ Error registrando ${name}:`, error);
        return false;
    }
}

console.log('🚀 Iniciando registro de componentes...');

// ===========================
// ORDEN CRÍTICO DE REGISTRO
// ===========================

// CORE (SIEMPRE PRIMERO)
registerComponent('root-component', RootComponent);
registerComponent('load-pages', LoadPage);

// USUARIO (antes de usarlos en otros componentes)
registerComponent('lulada-user-info', UserInfo);
registerComponent('lulada-user-edit', UserEdit);
registerComponent('lulada-edit-profile-modal', EditProfileModal);
registerComponent('lulada-user-profile', UserSelftProfile);

// PÁGINAS
registerComponent('lulada-home', Home);
registerComponent('lulada-explore', LuladaExplore);
registerComponent('lulada-puser', PUser);
registerComponent('lulada-restaurant-profile', RestaurantProfile);
registerComponent('lulada-save', Save);
registerComponent('lulada-login', LoginPage);
registerComponent('lulada-settings', LuladaSettings);
registerComponent('lulada-notifications', LuladaNotifications);
registerComponent('lulada-new-account', NewAccount);
registerComponent('lulada-confirm-role', ConfirmRole);

// SETTINGS PAGES
registerComponent('cambiar-correo-f', CambiarCorreoF);
registerComponent('cambiar-nombre-f', NombreUsuraio);
registerComponent('cambiar-contrasena-f', CambiarContraseñaF);

// NAVEGACIÓN
registerComponent('lulada-navigation', Navigation);
registerComponent('lulada-sidebar', LuladaSidebar);

// HEADERS
registerComponent('lulada-header-completo', HeaderCompleto);
registerComponent('lulada-header-home', HeaderHome);
registerComponent('lulada-logo', Lulada);
registerComponent('lulada-header-explorer', HeaderExplorer);

// PUBLICACIONES
registerComponent('lulada-publication', Publication);
registerComponent('lulada-review', Review);
registerComponent('lulada-reviews-container', ReviewsContainer);

// EXPLORACIÓN
registerComponent('lulada-explore-container', ExploreContainer);
registerComponent('lulada-images-explore', ImagesExplore);
registerComponent('lulada-text-card', TextCard);

// RESTAURANT
registerComponent('lulada-restaurant-info', restaurantInfo);

// OTROS
registerComponent('lulada-suggestions', LuladaSuggestions);
registerComponent('lulada-card-notifications', CardNotifications);

// LOGIN
registerComponent('lulada-login-form', LoginForm);
registerComponent('lulada-caja-de-texto', CajaDeTexto);
registerComponent('lulada-boton-login', BotonLogin);

// NEW ACCOUNT
registerComponent('lulada-box-text', BoxText);
registerComponent('lulada-button-new-account', ButtonNewAccount);

// SETTINGS
registerComponent('cajon-texto', CajonTexto);
registerComponent('cajon-list', CajonList);
registerComponent('cajon-list-interactive', CajonListInteractive);
registerComponent('cambiar-nu', CambiarNU);
registerComponent('cambiar-co', Cambiarco);
registerComponent('cambiar-contra', CambiarContra);
registerComponent('cambiar-correo-simple', CambiarCorreoSimple);
registerComponent('cambiar-nombre-simple', CambiarNombreSimple);
registerComponent('cambiar-contrasena-simple', CambiarContrasenaSimple);

// ===========================
// INICIALIZACIÓN CRÍTICA
// ===========================
console.log('✅ Registro de componentes completado');

// Auto-inicializar AntojarService
window.AntojarPopupService.getInstance().initialize();

// ===========================
// VERIFICACIÓN DE INICIO
// ===========================
setTimeout(() => {
    console.log('🔍 Verificando inicio de la app...');
    
    let rootComponent = document.querySelector('root-component');
    if (!rootComponent) {
        console.log('🚑 EMERGENCIA: Creando root-component...');
        rootComponent = document.createElement('root-component');
        document.body.appendChild(rootComponent);
    }
    
    // Diagnóstico disponible desde consola
    if (!(window as any).diagnosticStartup) {
        (window as any).diagnosticStartup = () => {
            console.log('🔍 === DIAGNÓSTICO COMPLETO ===');
            console.log('root-component existe:', !!document.querySelector('root-component'));
            console.log('load-pages existe:', !!document.querySelector('load-pages'));
            console.log('UserActions disponible:', !!window.UserActions);
            console.log('AntojarPopupService disponible:', !!window.AntojarPopupService);
            console.log('Autenticado:', localStorage.getItem('isAuthenticated'));
            console.log('Usuario actual:', localStorage.getItem('currentUser'));
            console.log('=== FIN DIAGNÓSTICO ===');
        };
    }
    
    // Verificar carga después de 2 segundos
    setTimeout(() => {
        const loadPages = document.querySelector('load-pages');
        if (!loadPages) {
            console.error('❌ CRÍTICO: load-pages no encontrado después de 2s');
            console.log('🔧 Ejecuta window.diagnosticStartup() para más detalles');
        } else {
            console.log('✅ App cargada exitosamente');
        }
    }, 2000);
    
}, 100);

export { };