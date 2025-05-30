import { userStore, UserState } from "../../../Services/flux/UserStore";
import { UserData } from "../../../Services/flux/UserActions";

// Definimos las funciones públicas del componente
interface UserInfoElement extends HTMLElement {
    forceUpdate(): void;
    debugInfo(): void;
}

// URL de la foto fija para todos los usuarios
const FIXED_PROFILE_PHOTO = "https://randomuser.me/api/portraits/women/44.jpg";

// Componente personalizado para mostrar información del usuario
class UserInfo extends HTMLElement implements UserInfoElement {
    
    private currentUser: UserData | null = null;
    private storeListener = this.handleStoreChange.bind(this);
    private _isConnected = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this._isConnected = true;
        
        // Nos suscribimos para recibir notificaciones de cambios en los datos del usuario
        userStore.subscribe(this.storeListener);
        
        // Obtenemos los datos iniciales del usuario
        setTimeout(() => {
            const initialState = userStore.getState();
            this.handleStoreChange(initialState);
        }, 100);
    }

    disconnectedCallback() {
        this._isConnected = false;
        
        if (userStore) {
            userStore.unsubscribe(this.storeListener);
        }
    }

    // Se ejecuta cuando cambian los datos del usuario
    private handleStoreChange(state: UserState): void {
        if (!this._isConnected) {
            return;
        }

        const newUser = state.currentUser;
        
        // Comparamos si realmente hubo cambios
        const userChanged = !this.currentUser || 
                          !newUser || 
                          JSON.stringify(this.currentUser) !== JSON.stringify(newUser);
        
        if (userChanged) {
            this.currentUser = newUser ? { ...newUser } : null;
            this.render();
            
            // También actualizamos elementos específicos
            setTimeout(() => {
                if (newUser) {
                    this.updateDOMDirectly(newUser);
                }
            }, 50);
        }
    }

    // Actualiza elementos específicos sin redibujar todo
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

    // Función principal para dibujar el componente
    private render(): void {
        if (!this.shadowRoot || !this._isConnected) return;

        // Si no hay datos del usuario, mostramos pantalla de carga
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

        // Dibujamos el perfil completo
        this.shadowRoot.innerHTML = /*html*/ `
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
                }

                .userTopCompleto:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateY(-2px);
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
                    border: 3px solid #AAAB54;
                }
                
                .userTopFoto img:hover {
                    transform: scale(1.05);
                }
                
                .userTopInfo {
                    flex: 1;
                }
                
                .nombreDeUsuario {
                    font-size: 1.25rem;
                    color: #AAAB54;
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

                /* RESPONSIVE DESIGN */
                /* Tablets */
                @media (max-width: 1024px) {
                    .userTopCompleto {
                        max-width: 95%;
                        padding: 1rem;
                    }
                    
                    .userTopFoto img {
                        width: 12rem;
                        height: 12rem;
                    }
                }
                
                /* Móviles */
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
                }

                /* Móviles muy pequeños */
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
                ${this.renderUsuario(this.currentUser)}
            </div>
        `;
    }

    // Genera el HTML del usuario con sus datos
    private renderUsuario(user: UserData): string {
        return /*html*/ `
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

    // Función para forzar actualización manual
    public forceUpdate(): void {
        const currentState = userStore.getState();
        this.handleStoreChange(currentState);
    }

    // Función para debugging
    public debugInfo(): void {
        console.log('UserInfo: === INFORMACIÓN DE DEBUG ===');
        console.log('- Usuario actual guardado:', this.currentUser);
        console.log('- Estado completo del store:', userStore.getState());
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