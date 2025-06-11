// =======================
// DECLARACIONES GLOBALES
// =======================
export {};

import PublicationsService from './Services/PublicationsService';
import AntojarPopupService from './Components/Home/Antojar/antojar-popup';

declare global {
    interface Window {
        debugSidebar?: () => void;
        AntojarPopupService?: typeof AntojarPopupService;
        LuladaServices?: {
            publicationsService: ReturnType<typeof PublicationsService.getInstance>;
            antojarService: ReturnType<typeof AntojarPopupService.getInstance>;
        };
        LuladaFirebase?: {
            userService: any;
        };
        LuladaFirebasePublications?: {
            service: any;
        };
        debugFirebaseAuth?: () => void;
        debugFirebasePublications?: () => void;
        debugAuthState?: () => void;
        forceAuthRefresh?: () => void;
        createTestPublication?: () => Promise<void>;
        checkLuladaServices?: () => void;
        debugAllLuladaServices?: () => void;
    }
}

interface ComponentConstructor {
    new (...args: unknown[]): HTMLElement;
}

// =======================
// IMPORTS
// =======================
import './services-global';
import { InteractionService } from './Services/flux/Interactionservice';
import { LuladaStorageService,luladaStorage} from './Services/Supabase/ServiceStorage';

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
import NavigationBar from './Components/Home/Navbars/responsivebar';
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

// ANTOJAR
import { LuladaAntojar } from './Components/Home/Antojar/antojar';
import { LuladaAntojarBoton } from './Components/Home/Antojar/antojar-boton';

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
import CajaDeTexto from "./Components/Login/CajaTexto";
import BotonLogin from "./Components/Login/Boton";
import LoginForm from "./Components/Login/CajaLogin";

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

// =======================
// INICIALIZACIÓN DE SERVICIOS
// =======================
const publicationsService = PublicationsService.getInstance();
const antojarService = AntojarPopupService.getInstance();
antojarService.initialize();

if (typeof window !== 'undefined') {
    try {
        window.AntojarPopupService = AntojarPopupService;

        if (!window.LuladaServices) {
            window.LuladaServices = {
                publicationsService,
                antojarService
            };
        }

        if (!window.debugSidebar) {
            window.debugSidebar = () => {
                const sidebar = document.querySelector('lulada-sidebar') as HTMLElement & { debugNavigation?: () => void };
                if (sidebar?.debugNavigation) {
                    sidebar.debugNavigation();
                } else {
                    console.log("Sidebar no encontrado o sin debugNavigation");
                }
            };
        }

    } catch (error) {
        console.error('Error asignando servicios:', error);
    }
}

// =======================
// REGISTRO DE COMPONENTES
// =======================
function registerComponent(name: string, component: ComponentConstructor): boolean {
    try {
        if (!customElements.get(name)) {
            customElements.define(name, component);
        }
        return true;
    } catch (error) {
        console.error(`Error registrando ${name}:`, error);
        return false;
    }
}

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
registerComponent('lulada-cambiar-correo', CambiarCorreoF);
registerComponent('lulada-cambiar-nombre', NombreUsuraio);
registerComponent('lulada-cambiar-contraseña', CambiarContraseñaF);

// PUBLICACIONES
registerComponent('lulada-publication', Publication);
registerComponent('lulada-review', Review);
registerComponent('lulada-reviews-container', ReviewsContainer);

// ANTOJAR
registerComponent('lulada-antojar', LuladaAntojar);
registerComponent('lulada-antojar-boton', LuladaAntojarBoton);

// EXPLORACIÓN
registerComponent('explore-container', ExploreContainer);
registerComponent('images-explore', ImagesExplore);
registerComponent('text-card', TextCard);

// USUARIO
registerComponent('user-info', UserInfo);
registerComponent('user-profile', UserSelftProfile);
registerComponent('user-edit', UserEdit);
registerComponent('edit-profile-modal', EditProfileModal);
registerComponent('restaurant-info', restaurantInfo);

// OTROS
registerComponent('lulada-suggestions', LuladaSuggestions);
registerComponent('lulada-card-notifications', CardNotifications);

// LOGIN
registerComponent("caja-de-texto", CajaDeTexto);
registerComponent("boton-login", BotonLogin);
registerComponent("login-form", LoginForm);

// NEW ACCOUNT
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

// =======================
// FIREBASE INTEGRATION (Opcional)
// =======================
const initializeFirebaseIfAvailable = async (): Promise<void> => {
    try {
        const { FirebaseUserService } = await import('./Services/firebase/FirebaseUserService');
        const firebaseUserService = FirebaseUserService.getInstance();
        
        // Agregar al objeto global para debug
        if (typeof window !== 'undefined') {
            const globalWindow = window as typeof window & {
                LuladaFirebase?: {
                    userService: typeof firebaseUserService;
                };
                debugFirebaseAuth?: () => void;
                debugAuthState?: () => void;
                forceAuthRefresh?: () => void;
            };

            if (!globalWindow.LuladaFirebase) {
                globalWindow.LuladaFirebase = {
                    userService: firebaseUserService
                };
            }

            // Funciones de debug para Firebase
            if (!globalWindow.debugFirebaseAuth) {
                globalWindow.debugFirebaseAuth = () => {
                    firebaseUserService.debugInfo();
                };
            }

            if (!globalWindow.debugAuthState) {
                globalWindow.debugAuthState = () => {
                    console.log('🔥 Estado actual:', firebaseUserService.getAuthState());
                    console.log('🔥 Usuario actual:', firebaseUserService.getCurrentUser());
                    console.log('🔥 ¿Autenticado?:', firebaseUserService.isAuthenticated());
                };
            }

            if (!globalWindow.forceAuthRefresh) {
                globalWindow.forceAuthRefresh = () => {
                    firebaseUserService.refreshAuthState();
                    console.log('🔥 Estado de auth refrescado');
                };
            }
        }

        console.log('🔥 Firebase User Service inicializado');
        console.log('🔥 Estado de autenticación:', firebaseUserService.isAuthenticated());
        
    } catch (error) {
        // Firebase no disponible, continuar sin él
        console.log('Firebase no disponible, la app funcionará sin autenticación');
    }
};

// =======================
// FIREBASE PUBLICATIONS INTEGRATION
// =======================
const initializeFirebasePublications = async (): Promise<void> => {
    try {
        const { FirebasePublicationsService } = await import('./Services/firebase/FirebasePublicationsService');
        const publicationsService = FirebasePublicationsService.getInstance();
        
        // Agregar al objeto global para debug
        if (typeof window !== 'undefined') {
            const globalWindow = window as typeof window & {
                LuladaFirebasePublications?: {
                    service: typeof publicationsService;
                };
                debugFirebasePublications?: () => void;
                createTestPublication?: () => Promise<void>;
            };

            if (!globalWindow.LuladaFirebasePublications) {
                globalWindow.LuladaFirebasePublications = {
                    service: publicationsService
                };
            }

            // Función de debug para publicaciones
            if (!globalWindow.debugFirebasePublications) {
                globalWindow.debugFirebasePublications = () => {
                    const stats = publicationsService.getStats();
                    console.log('🔥 Firebase Publications Debug:');
                    console.log('- Total publicaciones:', stats.total);
                    console.log('- Por ubicación:', stats.byLocation);
                    console.log('- Top restaurantes:', stats.topRestaurants);
                };
            }

            // Función para crear publicación de prueba (solo desarrollo)
            if (!globalWindow.createTestPublication) {
                globalWindow.createTestPublication = async () => {
                    try {
                        const { FirebaseUserService } = await import('./Services/firebase/FirebaseUserService');
                        const userService = FirebaseUserService.getInstance();
                        const authState = userService.getAuthState();
                        
                        if (!authState.isAuthenticated || !authState.user) {
                            console.log('❌ Debes estar autenticado para crear una publicación de prueba');
                            return;
                        }

                        const testPublication = {
                            text: 'Esta es una publicación de prueba desde la consola del navegador. ¡El sistema Firebase está funcionando!',
                            stars: 5,
                            restaurant: 'Restaurante de Prueba',
                            location: 'centro' as const
                        };

                        const publicationId = await publicationsService.createPublication(testPublication, authState.user);
                        
                        if (publicationId) {
                            console.log('✅ Publicación de prueba creada con ID:', publicationId);
                        } else {
                            console.log('❌ Error creando publicación de prueba');
                        }
                    } catch (error) {
                        console.error('Error en publicación de prueba:', error);
                    }
                };
            }
        }

        console.log('🔥 Firebase Publications Service inicializado');
        
    } catch (error) {
        console.log('⚠️ Firebase Publications no disponible:', error);
    }
};

// =======================
// VERIFICACIÓN SUPABASE (SIMPLIFICADA)
// =======================
const verifySupabaseConnection = async (): Promise<void> => {
    try {
        // Importar dinámicamente para evitar errores si no está instalado
        const { supabase } = await import('./Services/Supabase/Supabaseconfig');
        
        console.log('🔍 Verificando Supabase...');
        
        // Test básico de conexión
        const { data, error } = await supabase
            .from('test')
            .select('*')
            .limit(1);
            
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        
        console.log('✅ Supabase está funcionando correctamente');
        
        // Agregar función global para debug
        if (typeof window !== 'undefined') {
            (window as any).debugSupabase = async () => {
                console.log('📊 Estado de Supabase:');
                console.log('- Cliente:', !!supabase);
                console.log('- URL:', supabase ? 'Configurado' : 'No configurado');
                
                try {
                    const { data, error } = await supabase
                        .from('test')
                        .select('*')
                        .limit(1);
                    
                    console.log('- Conexión:', error ? 'Error' : 'OK');
                    if (error) console.log('- Error:', error.message);
                } catch (e) {
                    console.log('- Error de conexión:', e);
                }
            };
        }
        
    } catch (error) {
        console.log('⚠️ Supabase no disponible:', error);
        console.log('📝 La aplicación funcionará sin almacenamiento en la nube');
    }
};

// =======================
// INICIALIZACIÓN FINAL
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const interactionService = InteractionService.getInstance();
    interactionService.loadInteractions();

    antojarService.initialize();
    
    // Inicializar Firebase Auth (opcional)
    initializeFirebaseIfAvailable();
    
    // Inicializar Firebase Publications (opcional)
    initializeFirebasePublications();
    
    // Verificar Supabase (opcional)
    verifySupabaseConnection();
});

// =======================
// LISTENER SILENCIOSO PARA AUTH CHANGES
// =======================
document.addEventListener('auth-state-changed', (event) => {
    const authEvent = event as CustomEvent;
    const authState = authEvent.detail;
    
    // Log silencioso para debug
    if (authState.isAuthenticated) {
        console.log('✅ Usuario autenticado silenciosamente:', authState.user?.email);
    } else if (!authState.isLoading) {
        console.log('❌ Usuario no autenticado');
    }
});

// =======================
// LISTENER PARA NUEVAS PUBLICACIONES
// =======================
document.addEventListener('nueva-publicacion-firebase', (event) => {
    const publicationEvent = event as CustomEvent;
    const { publicationId, userId } = publicationEvent.detail;
    
    console.log('📱 Nueva publicación Firebase creada:', { publicationId, userId });
    
    // Mostrar notificación global
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #4285f4, #34a853);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10001;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
        animation: slideDown 0.3s ease;
    `;
    
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; background: white; border-radius: 50%; animation: pulse 2s infinite;"></div>
            <span>Nueva publicación en el feed</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
});

// =======================
// FUNCIÓN GLOBAL DE ESTADO
// =======================
if (typeof window !== 'undefined') {
    window.checkLuladaServices = () => {
        console.log('🔍 Estado completo de servicios Lulada:');
        console.log('📦 Publications (Local):', !!window.LuladaServices?.publicationsService);
        console.log('📝 Antojar:', !!window.LuladaServices?.antojarService);
        console.log('🔥 Firebase Auth:', !!window.LuladaFirebase?.userService);
        console.log('🔥 Firebase Publications:', !!window.LuladaFirebasePublications?.service);
        console.log('☁️ Supabase:', typeof (window as any).debugSupabase === 'function');
        
        // Test rápido de cada servicio
        if (window.LuladaServices?.publicationsService) {
            const stats = window.LuladaServices.publicationsService.getStats();
            console.log('📊 Publicaciones locales:', stats.total);
        }
        
        if (window.LuladaFirebase?.userService) {
            const authState = window.LuladaFirebase.userService.getAuthState();
            console.log('👤 Usuario autenticado:', authState.isAuthenticated);
            if (authState.isAuthenticated) {
                console.log('👤 Usuario:', authState.user?.displayName || authState.user?.email);
            }
        }

        if (window.LuladaFirebasePublications?.service) {
            const stats = window.LuladaFirebasePublications.service.getStats();
            console.log('🔥 Publicaciones Firebase:', stats.total);
            console.log('🔥 Top restaurantes:', stats.topRestaurants.slice(0, 3));
        }
    };

    // Función para debug completo
    window.debugAllLuladaServices = () => {
        console.log('🚀 === DEBUG COMPLETO LULADA ===');
        
        // Firebase Auth
        if (window.debugFirebaseAuth) {
            console.log('\n🔥 FIREBASE AUTH:');
            window.debugFirebaseAuth();
        }
        
        // Firebase Publications
        if (window.debugFirebasePublications) {
            console.log('\n🔥 FIREBASE PUBLICATIONS:');
            window.debugFirebasePublications();
        }
        
        // Supabase
        if ((window as any).debugSupabase) {
            console.log('\n☁️ SUPABASE:');
            (window as any).debugSupabase();
        }
        
        // Estado general
        console.log('\n📊 RESUMEN:');
        window.checkLuladaServices?.();
        
        console.log('\n🎯 COMANDOS DISPONIBLES:');
        console.log('- window.debugFirebaseAuth()');
        console.log('- window.debugFirebasePublications()');
        console.log('- window.createTestPublication() (si estás autenticado)');
        console.log('- window.checkLuladaServices()');
        console.log('- window.debugAllLuladaServices()');
        
        console.log('\n=== FIN DEBUG ===');
    };
}

// Agregar estilos para animaciones de toast
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translate(-50%, -100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translate(-50%, 0); opacity: 1; }
            to { transform: translate(-50%, -100%); opacity: 0; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
    `;
    document.head.appendChild(style);
}

// =======================
// EXPORTS
// =======================
export {
    PublicationsService,
    AntojarPopupService,
    LuladaAntojar,
    LuladaAntojarBoton,
    Home,
    LuladaExplore,
    PUser,
    RestaurantProfile,
    Save,
    LoginPage,
    LuladaSettings,
    LuladaNotifications,
    NavigationBar,
    HeaderCompleto,
    LuladaSidebar,
    Publication,
    ReviewsContainer
};

export default {
    Publication,
    LuladaAntojar,
    ReviewsContainer,
    AntojarPopupService
};