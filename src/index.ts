// index.ts - Compatible con tipos existentes

// ===========================
// IMPORTS DE TIPOS
// ===========================
import type { UserData, AntojarServiceType } from './types';

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
// IMPLEMENTACIÓN DEL ANTOJAR SERVICE
// ===========================
class AntojarServiceImplementation {
    private static instance: AntojarServiceImplementation;
    private isInitialized: boolean = false;

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
        
        // Configurar estilos globales para el popup si es necesario
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
        
        // Inicializar si no está inicializado
        this.initialize();
        
        // Remover popup existente
        this.hidePopup();

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.id = 'antojar-overlay';
        overlay.className = 'antojar-popup-overlay';

        // Crear popup
        const popup = document.createElement('div');
        popup.id = 'antojar-popup';
        popup.style.cssText = `
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            padding: 35px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            z-index: 9999;
            max-width: 550px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            border: 4px solid #AAAB54;
            position: relative;
            animation: popupSlideIn 0.3s ease-out;
        `;

        // Agregar animación CSS
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            @keyframes popupSlideIn {
                from {
                    transform: scale(0.8) translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(animationStyle);

        popup.innerHTML = `
            <div style="text-align: center;">
                <div style="background: #AAAB54; color: white; padding: 15px; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; font-size: 40px;">
                    🍽️
                </div>
                <h2 style="margin: 0 0 15px 0; color: #AAAB54; font-size: 32px; font-weight: bold;">
                    Antojar
                </h2>
                <p style="margin: 0 0 30px 0; color: #666; font-size: 18px; line-height: 1.6;">
                    ¡Cuéntanos qué se te antoja! Descubre nuevos sabores, explora restaurantes únicos y comparte tus experiencias gastronómicas con la comunidad de Lulada.
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
                    <button onclick="alert('🔍 Función de búsqueda próximamente disponible!')" 
                            style="background: linear-gradient(135deg, #AAAB54, #9aa732); color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s; box-shadow: 0 4px 15px rgba(170, 171, 84, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(170, 171, 84, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(170, 171, 84, 0.3)'">
                        🔍 Buscar Restaurantes
                    </button>
                    <button onclick="window.AntojarPopupService.getInstance().hidePopup()" 
                            style="background: linear-gradient(135deg, #6c757d, #5a6169); color: white; border: none; padding: 15px 30px; border-radius: 10px; cursor: pointer; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(108, 117, 125, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(108, 117, 125, 0.3)'">
                        ❌ Cerrar
                    </button>
                </div>
                <small style="color: #999; font-size: 14px;">
                    Tip: Puedes hacer clic fuera del popup para cerrarlo
                </small>
            </div>
        `;

        // Cerrar al hacer clic en el overlay (pero no en el popup)
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hidePopup();
            }
        });

        // Cerrar con tecla Escape
        const escapeHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.hidePopup();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
    }

    public hidePopup(): void {
        console.log('❌ Ocultando popup de Antojar');
        const overlay = document.getElementById('antojar-overlay');
        if (overlay) {
            // Animación de salida
            overlay.style.animation = 'fadeOut 0.2s ease-in';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 200);
        }
        
        // Agregar animación de salida si no existe
        if (!document.querySelector('#fadeOutAnimation')) {
            const style = document.createElement('style');
            style.id = 'fadeOutAnimation';
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    public togglePopup(): void {
        console.log('🔄 Alternando popup de Antojar');
        const overlay = document.getElementById('antojar-overlay');
        if (overlay) {
            this.hidePopup();
        } else {
            this.showPopup();
        }
    }
}

// ===========================
// ASIGNACIÓN DIRECTA A WINDOW
// ===========================

// UserActions
window.UserActions = {
    loadUserData: (userData: UserData): void => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Datos de usuario cargados:', userData);
    },
    
    updateUserData: (userData: UserData): void => {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('✅ Datos de usuario actualizados:', userData);
    },
    
    updateUsername: (newUsername: string): void => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.nombreDeUsuario = newUsername;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Username actualizado:', newUsername);
        }
    },
    
    updateFullName: (newName: string): void => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.nombre = newName;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Nombre actualizado:', newName);
        }
    },
    
    updateDescription: (newDescription: string): void => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.descripcion = newDescription;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Descripción actualizada:', newDescription);
        }
    },
    
    updatePhoto: (newPhotoUrl: string): void => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.foto = newPhotoUrl;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Foto actualizada:', newPhotoUrl);
        }
    },
    
    updateLocation: (newLocation: string): void => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.locationText = newLocation;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Ubicación actualizada:', newLocation);
        }
    },
    
    updateRole: (newRole: string): void => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.rol = newRole;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            console.log('✅ Rol actualizado:', newRole);
        }
    },
    
    updatePassword: (newPassword: string): void => {
        console.log('🔐 Actualizando contraseña...');
        
        // Simulación de actualización de contraseña
        // En producción, aquí harías la llamada a tu API/Firebase
        
        // Mostrar notificación de éxito con estilo mejorado
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            z-index: 10000;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
            border-left: 5px solid #fff;
            animation: slideInRight 0.4s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 24px;">🔐</span>
                <span>Contraseña actualizada exitosamente</span>
            </div>
        `;
        
        // Agregar animación si no existe
        if (!document.querySelector('#slideInRightAnimation')) {
            const style = document.createElement('style');
            style.id = 'slideInRightAnimation';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remover notificación con animación
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3500);
    },
    
    resetProfile: (): void => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        console.log('✅ Perfil reseteado');
    }
};

// AntojarPopupService - Compatible con tu interfaz existente
window.AntojarPopupService = {
    getInstance: () => AntojarServiceImplementation.getInstance()
};

// Funciones de debug
window.debugSuggestions = (): void => {
    console.log('🔍 === DEBUG SUGGESTIONS ===');
    const suggestions = document.querySelectorAll('lulada-suggestions');
    console.log('Componentes suggestions encontrados:', suggestions.length);
    suggestions.forEach((comp, index) => {
        console.log(`Suggestion ${index + 1}:`, comp);
    });
    console.log('=== FIN DEBUG SUGGESTIONS ===');
};

window.debugUserInfo = (): void => {
    console.log('🔍 === DEBUG USER INFO ===');
    console.log('Usuario actual:', localStorage.getItem('currentUser'));
    console.log('Estado de autenticación:', localStorage.getItem('isAuthenticated'));
    console.log('=== FIN DEBUG USER INFO ===');
};

window.debugHome = (): void => {
    console.log('🔍 === DEBUG HOME ===');
    const homeComponents = document.querySelectorAll('lulada-home');
    console.log('Componentes home encontrados:', homeComponents.length);
    console.log('=== FIN DEBUG HOME ===');
};

window.debugLoadPage = (): void => {
    console.log('🔍 === DEBUG LOAD PAGE ===');
    const loadPages = document.querySelectorAll('load-pages');
    console.log('LoadPages activos:', loadPages.length);
    console.log('Ruta actual:', window.location.pathname);
    console.log('=== FIN DEBUG LOAD PAGE ===');
};

window.debugRestaurantNav = (): void => {
    console.log('🔍 === DEBUG RESTAURANT NAV ===');
    console.log('Navegación de restaurante debuggeada');
    console.log('=== FIN DEBUG RESTAURANT NAV ===');
};

// Funciones de utilidad
window.luladaStatus = (): void => {
    console.log('=== 🚀 LULADA STATUS ===');
    console.log('📱 Usuario:', localStorage.getItem('currentUser'));
    console.log('🔐 Autenticado:', localStorage.getItem('isAuthenticated'));
    console.log('⚙️ UserActions:', !!window.UserActions);
    console.log('🍽️ AntojarPopupService:', !!window.AntojarPopupService);
    console.log('📊 Componentes registrados:', customElements.whenDefined('lulada-home'));
    console.log('🌐 URL actual:', window.location.href);
    console.log('=== FIN STATUS ===');
};

window.luladaLogout = (): void => {
    const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmed) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🚪 Sesión cerrada correctamente');
        window.location.href = '/login';
    }
};

window.luladaEmergencyLogout = (): void => {
    console.log('🚨 === LOGOUT DE EMERGENCIA ===');
    localStorage.clear();
    sessionStorage.clear();
    console.log('🧹 Todos los datos limpiados');
    window.location.href = '/';
};

// Función para guardar rol
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

// ===========================
// REGISTRO DE COMPONENTES
// ===========================
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

console.log('🚀 Iniciando registro de componentes...');

// CORE
registerComponent('root-component', RootComponent);
registerComponent('load-pages', LoadPage);

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

// USUARIO
registerComponent('lulada-user-info', UserInfo);
registerComponent('lulada-user-profile', UserSelftProfile);
registerComponent('lulada-user-edit', UserEdit);
registerComponent('lulada-edit-profile-modal', EditProfileModal);
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
// INICIALIZACIÓN FINAL
// ===========================
console.log('✅ Lulada iniciado correctamente');
console.log('🔧 Servicios globales configurados:');
console.log('   ✅ window.UserActions (completo)');
console.log('   ✅ window.AntojarPopupService (con initialize, showPopup, hidePopup, togglePopup)');
console.log('   ✅ window.debugSuggestions');
console.log('   ✅ window.luladaStatus()');
console.log('   ✅ window.luladaLogout()');

// Auto-inicializar AntojarService
window.AntojarPopupService.getInstance().initialize();

// Exportar función de utilidad
export { };