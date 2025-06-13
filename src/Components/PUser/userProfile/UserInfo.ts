import { UserData } from '../../../Services/flux/UserActions';

const FIXED_PROFILE_PHOTO = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

interface AuthState {
    user?: {
        photoURL?: string | null;
        displayName?: string | null;
        email?: string | null;
    } | null;
    isAuthenticated?: boolean;
    isLoading?: boolean;
}

class UserInfo extends HTMLElement {
    private currentUser: UserData | null = null;
    private authState: AuthState | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.loadUserData();
    }

    disconnectedCallback(): void {
        // Cleanup si es necesario
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                .user-info-container {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    border: 1px solid #f0f0f0;
                }

                .user-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .user-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #AAAB54;
                    box-shadow: 0 4px 12px rgba(170, 171, 84, 0.2);
                }

                .user-details {
                    flex: 1;
                }

                .user-name {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 4px 0;
                }

                .user-username {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 8px 0;
                }

                .user-description {
                    font-size: 14px;
                    color: #777;
                    line-height: 1.4;
                    margin: 0;
                }

                .user-stats {
                    display: flex;
                    gap: 24px;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #f0f0f0;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-size: 20px;
                    font-weight: bold;
                    color: #AAAB54;
                }

                .stat-label {
                    font-size: 12px;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .loading-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #f3f3f3;
                    border-top: 3px solid #AAAB54;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-container {
                    text-align: center;
                    padding: 24px;
                    color: #666;
                }

                .edit-button-container {
                    margin-top: 16px;
                }

                @media (max-width: 600px) {
                    .user-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .user-stats {
                        justify-content: center;
                    }

                    .user-name {
                        font-size: 20px;
                    }
                }
            </style>

            <div class="user-info-container" id="user-container">
                <!-- El contenido se renderiza dinámicamente -->
            </div>
        `;
    }

    private loadUserData(): void {
        // Obtener datos de localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
            }
        }

        this.updateDisplay();
    }

    private updateDisplay(): void {
        const container = this.shadowRoot?.querySelector('#user-container');
        if (!container) return;

        if (this.isLoading()) {
            container.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                </div>
            `;
            return;
        }

        const user = this.getDisplayUser();

        if (!user) {
            container.innerHTML = `
                <div class="error-container">
                    <p>No se pudo cargar la información del usuario</p>
                    <button onclick="window.location.reload()">Reintentar</button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="user-header">
                <img src="${user.foto || FIXED_PROFILE_PHOTO}" 
                     alt="Foto de perfil" 
                     class="user-avatar"
                     onerror="this.src='${FIXED_PROFILE_PHOTO}'">
                <div class="user-details">
                    <h2 class="user-name">${user.nombre || 'Usuario'}</h2>
                    <p class="user-username">@${user.nombreDeUsuario || 'usuario'}</p>
                    <p class="user-description">${user.descripcion || 'Sin descripción disponible'}</p>
                </div>
            </div>
            
            <div class="user-stats">
                <div class="stat-item">
                    <span class="stat-number">12</span>
                    <span class="stat-label">Reseñas</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">8</span>
                    <span class="stat-label">Seguidos</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">15</span>
                    <span class="stat-label">Guardados</span>
                </div>
            </div>

            <div class="edit-button-container">
                <lulada-user-edit></lulada-user-edit>
            </div>
        `;
    }

    public refreshUserData(): void {
        this.loadUserData();
    }

    public setUserData(userData: UserData): void {
        this.currentUser = userData;
        this.updateDisplay();
    }

    public openEditModal(): void {
        const editButton = this.shadowRoot?.querySelector('lulada-user-edit') as any;
        if (editButton && typeof editButton.openEditModal === 'function') {
            editButton.openEditModal();
        } else {
            this.createEditModal();
        }
    }

    private createEditModal(): void {
        let modal = document.querySelector('lulada-edit-profile-modal') as any;
        
        if (!modal) {
            modal = document.createElement('lulada-edit-profile-modal');
            document.body.appendChild(modal);
        }

        if (this.currentUser && typeof modal.setUser === 'function') {
            modal.setUser(this.currentUser);
        }

        if (typeof modal.show === 'function') {
            modal.show();
        }
    }

    private getDisplayUser(): UserData | null {
        if (this.currentUser) {
            return this.currentUser;
        }

        if (this.authState?.user && this.authState.isAuthenticated) {
            return {
                foto: this.authState.user.photoURL || FIXED_PROFILE_PHOTO,
                nombreDeUsuario: this.generateUsername(this.authState.user.displayName || null, this.authState.user.email || null),
                nombre: this.authState.user.displayName || this.extractNameFromEmail(this.authState.user.email || null),
                descripcion: 'Usuario de Firebase',
                rol: "persona"
            };
        }

        return null;
    }

    private isLoading(): boolean {
        return this.authState?.isLoading ?? false;
    }

    private generateUsername(displayName: string | null, email: string | null): string {
        if (displayName) {
            return displayName.toLowerCase().replace(/\s+/g, '_');
        }
        if (email) {
            return email.split('@')[0];
        }
        return 'usuario_' + Math.random().toString(36).substr(2, 5);
    }

    private extractNameFromEmail(email: string | null): string {
        if (!email) return 'Usuario';
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    public debug(): void {
        console.group('🔍 UserInfo Debug');
        console.log('Usuario actual:', this.currentUser);
        console.log('Auth state:', this.authState);
        console.log('Componente conectado:', this.isConnected);
        console.groupEnd();
    }
}

// ✅ SIN REGISTRO AUTOMÁTICO - se registra desde index.ts
export { UserInfo };