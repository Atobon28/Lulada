import { User, onAuthStateChanged } from 'firebase/auth';
import { Auth } from './firebase';
import { UserActions, UserData } from '../flux/UserActions';
import { AppDispatcher } from '../flux/Dispatcher';

export interface FirebaseUserProfile {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    isVerified: boolean;
    createdAt: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: FirebaseUserProfile | null;
    isLoading: boolean;
    error: string | null;
}

type AuthStateListener = (state: AuthState) => void;

export class FirebaseUserService {
    private static instance: FirebaseUserService;
    private authState: AuthState = {
        isAuthenticated: false,
        user: null,
        isLoading: true,
        error: null
    };
    private listeners: AuthStateListener[] = [];
    private unsubscribeAuth?: () => void;

    private constructor() {
        this.initializeAuthListener();
        AppDispatcher.register(this.handleActions.bind(this));
    }

    public static getInstance(): FirebaseUserService {
        if (!FirebaseUserService.instance) {
            FirebaseUserService.instance = new FirebaseUserService();
        }
        return FirebaseUserService.instance;
    }

    private initializeAuthListener(): void {
        this.unsubscribeAuth = onAuthStateChanged(Auth, (user: User | null) => {
            this.handleAuthStateChange(user);
        });
    }

    private handleAuthStateChange(user: User | null): void {
        console.log('🔥 Firebase Auth state changed:', user ? 'logged in' : 'logged out');

        if (user) {
            const firebaseProfile: FirebaseUserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName,
                photoURL: user.photoURL,
                isVerified: user.emailVerified,
                createdAt: user.metadata.creationTime || new Date().toISOString()
            };

            this.authState = {
                isAuthenticated: true,
                user: firebaseProfile,
                isLoading: false,
                error: null
            };

            // Sincronizar con el sistema Flux existente
            this.syncWithFluxStore(firebaseProfile);
        } else {
            this.authState = {
                isAuthenticated: false,
                user: null,
                isLoading: false,
                error: null
            };

            // Resetear el store de Flux
            UserActions.resetProfile();
        }

        this.notifyListeners();
        this.updateGlobalAuthState();
    }

    private syncWithFluxStore(firebaseProfile: FirebaseUserProfile): void {
        // Crear datos compatibles con el sistema Flux existente
        const fluxUserData: UserData = {
            foto: firebaseProfile.photoURL || "https://randomuser.me/api/portraits/women/44.jpg",
            nombreDeUsuario: this.generateUsername(firebaseProfile.displayName, firebaseProfile.email),
            nombre: firebaseProfile.displayName || this.extractNameFromEmail(firebaseProfile.email),
            descripcion: "Usuario autenticado con Firebase",
            rol: "persona"
        };

        // Actualizar el store de Flux
        UserActions.loadUserData(fluxUserData);
    }

    private generateUsername(displayName: string | null, email: string): string {
        if (displayName) {
            const cleaned = displayName.replace(/\s+/g, '').toLowerCase();
            return `@${cleaned}`;
        }
        
        const emailName = email.split('@')[0];
        return `@${emailName}`;
    }

    private extractNameFromEmail(email: string): string {
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    private updateGlobalAuthState(): void {
        // Agregar estado de autenticación al objeto global window
        const globalWindow = window as typeof window & {
            LuladaAuth?: AuthState;
        };

        globalWindow.LuladaAuth = { ...this.authState };

        // Disparar evento global para componentes que escuchen
        document.dispatchEvent(new CustomEvent('auth-state-changed', {
            detail: this.authState
        }));
    }

    private handleActions(action: { type: string; payload?: unknown }): void {
        switch (action.type) {
            case 'FIREBASE_SIGN_OUT':
                this.signOut();
                break;
            case 'FIREBASE_REFRESH_AUTH':
                this.refreshAuthState();
                break;
            default:
                break;
        }
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => {
            try {
                listener(this.authState);
            } catch (error) {
                console.error('Error en listener de FirebaseUserService:', error);
            }
        });
    }

    // Métodos públicos
    public getAuthState(): AuthState {
        return { ...this.authState };
    }

    public isAuthenticated(): boolean {
        return this.authState.isAuthenticated;
    }

    public getCurrentUser(): FirebaseUserProfile | null {
        return this.authState.user ? { ...this.authState.user } : null;
    }

    public subscribe(listener: AuthStateListener): () => void {
        this.listeners.push(listener);
        
        // Enviar estado actual inmediatamente
        try {
            listener(this.authState);
        } catch (error) {
            console.error('Error en listener inicial:', error);
        }

        // Retornar función para desuscribirse
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public async signOut(): Promise<void> {
        try {
            await Auth.signOut();
            console.log('🔥 Usuario desconectado exitosamente');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            this.authState.error = 'Error al cerrar sesión';
            this.notifyListeners();
        }
    }

    public refreshAuthState(): void {
        const currentUser = Auth.currentUser;
        this.handleAuthStateChange(currentUser);
    }

    public cleanup(): void {
        if (this.unsubscribeAuth) {
            this.unsubscribeAuth();
        }
        this.listeners = [];
    }

    // Métodos de debugging
    public debugInfo(): void {
        console.log('🔥 FirebaseUserService Debug:');
        console.log('- Estado de autenticación:', this.authState);
        console.log('- Usuario actual de Firebase:', Auth.currentUser);
        console.log('- Listeners activos:', this.listeners.length);
        console.log('- Estado global window.LuladaAuth:', (window as unknown as { LuladaAuth?: AuthState }).LuladaAuth);
    }
}

// Funciones de conveniencia para exportar
export const getFirebaseUserService = (): FirebaseUserService => {
    return FirebaseUserService.getInstance();
};

export const isUserAuthenticated = (): boolean => {
    return FirebaseUserService.getInstance().isAuthenticated();
};

export const getCurrentFirebaseUser = (): FirebaseUserProfile | null => {
    return FirebaseUserService.getInstance().getCurrentUser();
};

// Agregar función de debug global
if (typeof window !== 'undefined') {
    const globalWindow = window as typeof window & {
        debugFirebaseAuth?: () => void;
    };

    globalWindow.debugFirebaseAuth = () => {
        FirebaseUserService.getInstance().debugInfo();
    };
}