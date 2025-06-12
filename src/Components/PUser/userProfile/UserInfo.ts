// src/Components/PUser/userProfile/UserInfo.ts - CORREGIDO
import { userStore, UserState } from "../../../Services/flux/UserStore";
import { UserData } from "../../../Services/flux/UserActions";

// Interfaces para Firebase (solo si está disponible)
interface FirebaseUserProfile {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    isVerified: boolean;
}

interface AuthState {
    isAuthenticated: boolean;
    user: FirebaseUserProfile | null;
    isLoading: boolean;
    error: string | null;
}

interface UserInfoElement extends HTMLElement {
    forceUpdate(): void;
    debugInfo(): void;
}

const FIXED_PROFILE_PHOTO = "https://randomuser.me/api/portraits/women/44.jpg";

class UserInfo extends HTMLElement implements UserInfoElement {
    private currentUser: UserData | null = null;
    private storeListener = this.handleStoreChange.bind(this);
    private _isConnected = false;
    
    // Firebase integration (opcional)
    private firebaseService?: unknown;
    private firebaseUnsubscribe?: () => void;
    private authState: AuthState | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this._isConnected = true;
        
        userStore.subscribe(this.storeListener);
        
        // Intentar inicializar Firebase si está disponible
        this.initializeFirebaseIfAvailable();
        
        setTimeout(() => {
            const initialState = userStore.getState();
            this.handleStoreChange(initialState);
        }, 100);
    }

    disconnectedCallback(): void {
        this._isConnected = false;
        
        if (userStore) {
            userStore.unsubscribe(this.storeListener);
        }
        
        if (this.firebaseUnsubscribe) {
            this.firebaseUnsubscribe();
        }
    }

    private async initializeFirebaseIfAvailable(): Promise<void> {
        try {
            const { FirebaseUserService } = await import('../../../Services/firebase/FirebaseUserService');
            this.firebaseService = FirebaseUserService.getInstance();
            
            // Type assertion para acceder a los métodos
            const service = this.firebaseService as {
                subscribe: (callback: (state: AuthState) => void) => () => void;
            };
            
            this.firebaseUnsubscribe = service.subscribe(this.handleFirebaseAuthChange.bind(this));
        } catch {
            // ✅ CORREGIDO: Sin usar variable error
            console.log('Firebase no disponible, usando solo sistema Flux');
        }
    }

    private handleFirebaseAuthChange(authState: AuthState): void {
        this.authState = authState;
        
        // Si hay usuario de Firebase y no hay usuario en Flux, sincronizar
        if (authState.isAuthenticated && authState.user && !this.currentUser) {
            this.syncFirebaseToFlux(authState.user);
        }
        
        this.render();
    }

    private syncFirebaseToFlux(firebaseUser: FirebaseUserProfile): void {
        // Crear datos compatibles con Flux desde Firebase
        const fluxUserData: UserData = {
            foto: firebaseUser.photoURL || FIXED_PROFILE_PHOTO,
            nombreDeUsuario: this.generateUsername(firebaseUser.displayName, firebaseUser.email),
            nombre: firebaseUser.displayName || this.extractNameFromEmail(firebaseUser.email),
            descripcion: `Usuario verificado ${firebaseUser.isVerified ? '✓' : ''}`.trim(),
            rol: "persona"
        };

        // Importar dinámicamente UserActions solo si es necesario
        import('../../../Services/flux/UserActions')
            .then(({ UserActions }) => {
                UserActions.loadUserData(fluxUserData);
            })
            .catch(() => {
                console.log('No se pudo sincronizar con UserActions');
            });
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

    private handleStoreChange(state: UserState): void {
        if (!this._isConnected) {
            return;
        }

        const newUser = state.currentUser;
        
        const userChanged = !this.currentUser || 
                          !newUser || 
                          JSON.stringify(this.currentUser) !== JSON.stringify(newUser);
        
        if (userChanged) {
            this.currentUser = newUser ? { ...newUser } : null;
            this.render();
            
            setTimeout(() => {
                if (newUser) {
                    this.updateDOMDirectly(newUser);
                }
            }, 50);
        }
    }

    private updateDOMDirectly(user: UserData): void {
        if (!this.shadowRoot || !this._isConnected) return;
        
        const elements = {
            username: this.shadowRoot.querySelector('.nombreDeUsuario') as HTMLElement | null,
            name: this.shadowRoot.querySelector('.nombre') as HTMLElement | null,
            description: this.shadowRoot.querySelector('.descripcion') as HTMLElement | null,
            photo: this.shadowRoot.querySelector('.foto') as HTMLImageElement | null
        };
        
        if (elements.username && user.nombreDeUsuario) {
            elements.username.textContent = user.nombreDeUsuario;
        }
        
        if (elements.name && user.nombre) {
            elements.name.textContent = user.nombre;
        }
        
        if (elements.description && user.descripcion) {
            elements.description.textContent = user.descripcion;
        }
        
        if (elements.photo) {
            elements.photo.src = FIXED_PROFILE_PHOTO;
        }
    }

    private render(): void {
        if (!this.shadowRoot || !this._isConnected) return;

        if (!this.currentUser) {
            this.shadowRoot.innerHTML = `
                <style>
                    .loading {
                        text-align: center;
                        padding: 2rem;
                        color: #666;
                        font-family: 'Inter', sans-serif;
                        background-color: #f9f9f9;
                        border-radius: 10px;
                        margin: 1rem;
                    }
                    .loading-spinner {
                        border: 2px solid #f3f3f3;
                        border-top: 2px solid #AAAB54;
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 10px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
                <div class="loading">
                    <div class="loading-spinner"></div>
                    Cargando información del usuario...
                </div>
            `;
            return;
        }

        // Determinar si mostrar indicador de Firebase
        const isFirebaseUser = this.authState?.isAuthenticated && this.authState.user;

        this.shadowRoot.innerHTML = `
            <style>
                .userTopCompleto {
                    background-color: #ffffff;
                    padding: 1.25rem;
                    border-radius: 0.9375rem;
                    font-family: 'Inter', sans-serif;
                    max-width: 90%;
                    margin: auto;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .userTopCompleto:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
                }

                /* Indicador de Firebase */
                .firebase-badge {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: linear-gradient(135deg, #4285f4, #34a853);
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                    display: ${isFirebaseUser ? 'flex' : 'none'};
                    align-items: center;
                    gap: 4px;
                    box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
                }

                .firebase-icon {
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                }

                .etiquetados {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.80rem;
                    font-weight: bold;
                    margin-left: 3rem;
                }
                
                .userTop {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    min-width: 18.75rem;
                    min-height: 6.25rem;
                }
                
                .userTopFoto img {
                    border-radius: 50%;
                    width: 13.4375rem;
                    height: 13.4375rem;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                    border: 3px solid ${isFirebaseUser ? '#4285f4' : '#AAAB54'};
                }
                
                .userTopFoto img:hover {
                    transform: scale(1.05);
                }
                
                .userTopInfo {
                    flex: 1;
                }
                
                .nombreDeUsuario {
                    font-size: 1.25rem;
                    color: ${isFirebaseUser ? '#4285f4' : '#AAAB54'};
                    font-weight: bold;
                    margin-top: 0.8rem;
                    margin-bottom: 0.8rem;
                    transition: all 0.3s ease;
                }
                
                .nombre {
                    font-size: 1.625rem;
                    font-weight: bold;
                    color: #000;
                    margin-top: 0.4rem;
                    margin-bottom: 0.5rem;
                    transition: color 0.3s ease;
                }
                
                .descripcion {
                    font-size: 1rem;
                    color: #333;
                    margin-top: 0.375rem;
                    line-height: 1.4;
                    transition: color 0.3s ease;
                }
                
                hr {
                    width: 100%;
                    border: 1px solid #D9D9D9;
                    margin: 0.5rem 0;
                    transition: border-color 0.3s ease;
                }

                .location {
                    display: flex;
                    gap: 0.3rem;
                    align-items: center;
                    margin-top: 0.05rem;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .userTopCompleto {
                        max-width: 95%;
                        padding: 1rem;
                    }
                    
                    .userTopFoto img {
                        width: 12rem;
                        height: 12rem;
                    }

                    .firebase-badge {
                        top: 8px;
                        right: 12px;
                        font-size: 9px;
                        padding: 2px 6px;
                    }
                }
                
                @media (max-width: 768px) {
                    .userTopCompleto {
                        max-width: 100%;
                        margin: 0.5rem;
                        padding: 1rem;
                        position: relative;
                    }

                    .userTop {
                        flex-direction: column;
                        text-align: center;
                        min-width: auto;
                        gap: 1rem;
                    }

                    .userTopFoto img {
                        width: 10rem;
                        height: 10rem;
                    }
                
                    .nombre {
                        font-size: 1.25rem;
                        margin: 0.3rem 0;
                    }

                    .etiquetados {
                        font-size: 0.65rem;
                        font-weight: bold;
                        margin-left: 1rem;
                    }
                
                    .nombreDeUsuario {
                        font-size: 1rem;
                        margin: 0.3rem 0;
                    }
                
                    .descripcion {
                        font-size: 0.85rem;
                        margin: 0.3rem 0;
                        text-align: center;
                    }

                    .firebase-badge {
                        top: 5px;
                        right: 8px;
                        font-size: 8px;
                        padding: 2px 5px;
                    }
                }

                @media (max-width: 480px) {
                    .userTopCompleto {
                        margin: 0.25rem;
                        padding: 0.75rem;
                    }

                    .userTopFoto img {
                        width: 8rem;
                        height: 8rem;
                    }
                    
                    .nombre {
                        font-size: 1.1rem;
                    }
                    
                    .nombreDeUsuario {
                        font-size: 0.9rem;
                    }
                    
                    .descripcion {
                        font-size: 0.8rem;
                    }

                    .etiquetados {
                        margin-left: 0.5rem;
                    }
                }
            </style>            
            
            <div class="userTopCompleto">
                ${isFirebaseUser ? `
                    <div class="firebase-badge">
                        <div class="firebase-icon"></div>
                        Verificado
                    </div>
                ` : ''}
                ${this.renderUsuario(this.currentUser)}
            </div>
        `;
    }

    private renderUsuario(user: UserData): string {
        return `
            <div class="userTop"> 
                <div class="userTopFoto">
                    <img class="foto" 
                         src="${FIXED_PROFILE_PHOTO}" 
                         alt="Foto de perfil" 
                         onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s'">
                </div>
                
                <div class="userTopInfo">
                    <p class="nombreDeUsuario">${user.nombreDeUsuario || '@Usuario'}</p>
                    
                    <p class="nombre">${user.nombre || "Nombre del usuario"}</p>
                    
                    <hr>
                    
                    <p class="descripcion">${user.descripcion || "Sin descripción"}</p>
                    
                    <div id="additional-info"></div>
                </div>
            </div>
        `;
    }

    public forceUpdate(): void {
        const currentState = userStore.getState();
        this.handleStoreChange(currentState);
    }

    public debugInfo(): void {
        console.log('UserInfo: === INFORMACIÓN DE DEBUG ===');
        console.log('- Usuario actual guardado:', this.currentUser);
        console.log('- Estado completo del store:', userStore.getState());
        console.log('- Estado de Firebase:', this.authState);
        console.log('- Shadow DOM existe:', !!this.shadowRoot);
        console.log('- Componente conectado:', this._isConnected);
        
        if (this.shadowRoot) {
            const elements = {
                username: this.shadowRoot.querySelector('.nombreDeUsuario'),
                name: this.shadowRoot.querySelector('.nombre'),
                description: this.shadowRoot.querySelector('.descripcion'),
                photo: this.shadowRoot.querySelector('.foto')
            };
            console.log('- Elementos del DOM encontrados:', elements);
        } else {
            console.log('No hay shadow DOM disponible');
        }
        console.log('=== FIN DEBUG ===');
    }
}

// Funciones globales para debugging (solo en navegador)
if (typeof window !== 'undefined') {
    if (!window.debugUserInfo) {
        window.debugUserInfo = () => {
            const userInfoEl = document.querySelector('user-info') as UserInfoElement | null;
            if (userInfoEl && userInfoEl.debugInfo) {
                userInfoEl.debugInfo();
            } else {
                console.log('No se encontró ningún componente user-info en la página');
            }
        };
    }
    
    if (!window.forceUpdateUserInfo) {
        window.forceUpdateUserInfo = () => {
            const userInfoEl = document.querySelector('user-info') as UserInfoElement | null;
            if (userInfoEl && userInfoEl.forceUpdate) {
                userInfoEl.forceUpdate();
                console.log('Actualización forzada completada');
            } else {
                console.log('No se encontró ningún componente user-info en la página');
            }
        };
    }
}

export default UserInfo;