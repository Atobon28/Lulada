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
        
        userStore.unsubscribe(this.storeListener);
        
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
        } catch (error) {
            // Firebase no disponible, continuar solo con Flux
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
            rol: "persona" // ✅ AGREGADO
        };

        // Actualizar Flux store con datos de Firebase
        import('../../../Services/flux/UserActions').then(({ UserActions }) => {
            UserActions.loadUserData(fluxUserData); // ✅ CORREGIDO
        });
    }

    private generateUsername(displayName: string | null, email: string): string {
        if (displayName) {
            return displayName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        }
        
        const emailUsername = email.split('@')[0];
        return emailUsername.replace(/[^a-z0-9_]/g, '');
    }

    private extractNameFromEmail(email: string): string {
        const username = email.split('@')[0];
        return username.split('.').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
    }

    public forceUpdate(): void {
        const currentState = userStore.getState();
        this.handleStoreChange(currentState);
    }

    public getCurrentUser(): UserData | null {
        return this.currentUser;
    }

    public updateUser(userData: Partial<UserData>): void {
        if (!this.currentUser) return;

        const updatedUser = { ...this.currentUser, ...userData };
        
        import('../../../Services/flux/UserActions').then(({ UserActions }) => {
            UserActions.loadUserData(updatedUser); // ✅ CORREGIDO
        });
    }

    public debugInfo(): void {
        console.group('🔍 UserInfo Debug');
        console.log('Usuario actual:', this.currentUser);
        console.log('Conectado:', this._isConnected);
        console.log('AuthState Firebase:', this.authState);
        console.log('Servicio Firebase:', !!this.firebaseService);
        console.groupEnd();
    }

    private handleStoreChange(state: UserState): void {
        const newUser = state.currentUser;
        
        // Solo actualizar si hay cambios reales
        if (JSON.stringify(this.currentUser) !== JSON.stringify(newUser)) {
            this.currentUser = newUser;
            this.render();
        }
    }

    private render(): void {
        if (!this.shadowRoot || !this._isConnected) return;

        // Determinar qué datos mostrar
        const displayUser = this.getDisplayUser();
        const isLoading = this.isLoading();

        this.shadowRoot.innerHTML = `
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                :host {
                    display: block;
                    width: 100%;
                }

                .user-info-container {
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .user-info-container:hover {
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                }

                .loading {
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                }

                .loading-spinner {
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 12px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .no-user {
                    text-align: center;
                    padding: 40px 20px;
                    color: #666;
                }

                .no-user-icon {
                    font-size: 48px;
                    margin-bottom: 12px;
                    opacity: 0.5;
                }

                .user-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #e0e0e0;
                    transition: border-color 0.3s ease;
                }

                .user-avatar:hover {
                    border-color: #007bff;
                }

                .user-basic-info {
                    flex: 1;
                    min-width: 0;
                }

                .user-name {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                    word-wrap: break-word;
                }

                .user-username {
                    font-size: 1rem;
                    color: #666;
                    margin-bottom: 8px;
                    word-wrap: break-word;
                }

                .user-status {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-badge {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .status-online {
                    background: #d4edda;
                    color: #155724;
                }

                .status-synced {
                    background: #cce5ff;
                    color: #004085;
                }

                .status-offline {
                    background: #f8d7da;
                    color: #721c24;
                }

                .user-description {
                    margin-top: 16px;
                    padding: 16px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }

                .description-text {
                    color: #555;
                    line-height: 1.5;
                    font-style: italic;
                }

                .no-description {
                    color: #999;
                    font-style: italic;
                }

                .user-actions {
                    margin-top: 20px;
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                }

                .action-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-primary {
                    background: #007bff;
                    color: white;
                }

                .btn-primary:hover {
                    background: #0056b3;
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #545b62;
                }

                .user-stats {
                    margin-top: 16px;
                    padding: 16px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                    gap: 16px;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #007bff;
                    display: block;
                }

                .stat-label {
                    font-size: 0.8rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                @media (max-width: 600px) {
                    .user-header {
                        flex-direction: column;
                        text-align: center;
                    }
                    
                    .user-actions {
                        justify-content: center;
                    }
                    
                    .action-btn {
                        flex: 1;
                        justify-content: center;
                    }
                }
            </style>

            <div class="user-info-container">
                ${isLoading ? this.renderLoading() : 
                  displayUser ? this.renderUserInfo(displayUser) : this.renderNoUser()}
            </div>
        `;

        this.setupEventListeners();
    }

    private renderLoading(): string {
        return `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Cargando información del usuario...</p>
            </div>
        `;
    }

    private renderNoUser(): string {
        return `
            <div class="no-user">
                <div class="no-user-icon">👤</div>
                <h3>No hay usuario</h3>
                <p>Inicia sesión para ver tu información</p>
            </div>
        `;
    }

    private renderUserInfo(user: UserData): string {
        return `
            <div class="user-header">
                <img 
                    class="user-avatar" 
                    src="${user.foto || FIXED_PROFILE_PHOTO}" 
                    alt="Avatar de ${user.nombre || 'Usuario'}"
                    onerror="this.src='${FIXED_PROFILE_PHOTO}'"
                >
                <div class="user-basic-info">
                    <h2 class="user-name">${user.nombre || 'Usuario'}</h2>
                    <p class="user-username">@${user.nombreDeUsuario || 'usuario'}</p>
                    <div class="user-status">
                        ${this.renderStatusBadges()}
                    </div>
                </div>
            </div>

            ${user.descripcion ? `
                <div class="user-description">
                    <p class="description-text">${user.descripcion}</p>
                </div>
            ` : `
                <div class="user-description">
                    <p class="no-description">Sin descripción</p>
                </div>
            `}

            <div class="user-stats">
                <div class="stat-item">
                    <span class="stat-value">1</span>
                    <span class="stat-label">Perfil</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${this.authState?.isAuthenticated ? '✓' : '○'}</span>
                    <span class="stat-label">Autenticado</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${userStore.getLastSyncTime() ? '✓' : '○'}</span>
                    <span class="stat-label">Sincronizado</span>
                </div>
            </div>

            <div class="user-actions">
                <button class="action-btn btn-primary" id="edit-profile-btn">
                    ✏️ Editar Perfil
                </button>
                <button class="action-btn btn-secondary" id="refresh-btn">
                    🔄 Actualizar
                </button>
            </div>
        `;
    }

    private renderStatusBadges(): string {
        const badges = [];

        if (this.authState?.isAuthenticated) {
            badges.push('<span class="status-badge status-online">En línea</span>');
        }

        if (userStore.getLastSyncTime()) {
            badges.push('<span class="status-badge status-synced">Sincronizado</span>');
        }

        if (badges.length === 0) {
            badges.push('<span class="status-badge status-offline">Sin conexión</span>');
        }

        return badges.join('');
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        // Botón editar perfil
        const editBtn = this.shadowRoot.querySelector('#edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.openEditModal();
            });
        }

        // Botón actualizar
        const refreshBtn = this.shadowRoot.querySelector('#refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.forceUpdate();
            });
        }
    }

    private openEditModal(): void {
        // Buscar modal existente o crearlo
        let modal = document.querySelector('edit-profile-modal') as any;
        
        if (!modal) {
            modal = document.createElement('edit-profile-modal');
            document.body.appendChild(modal);
        }

        // Configurar datos del usuario en el modal
        if (this.currentUser && typeof modal.setUser === 'function') {
            modal.setUser(this.currentUser);
        }

        // Mostrar modal
        if (typeof modal.show === 'function') {
            modal.show();
        }
    }

    private getDisplayUser(): UserData | null {
        // Priorizar datos de Flux, luego Firebase si está disponible
        if (this.currentUser) {
            return this.currentUser;
        }

        // Si no hay datos en Flux pero sí en Firebase, crear datos temporales
        if (this.authState?.user && this.authState.isAuthenticated) {
            return {
                foto: this.authState.user.photoURL || FIXED_PROFILE_PHOTO,
                nombreDeUsuario: this.generateUsername(this.authState.user.displayName, this.authState.user.email),
                nombre: this.authState.user.displayName || this.extractNameFromEmail(this.authState.user.email),
                descripcion: 'Usuario de Firebase',
                rol: "persona" // ✅ AGREGADO
            };
        }

        return null;
    }

    private isLoading(): boolean {
        return userStore.isLoading() || (this.authState?.isLoading ?? false);
    }
}

// Registrar el componente
customElements.define('user-info', UserInfo);

export { UserInfo };