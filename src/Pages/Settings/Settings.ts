// Settings.ts - Versión sin any con tipos seguros

// ✅ Interfaces para tipado seguro
interface UserData {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    rol: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user?: FirebaseUser | null;
}

interface FirebaseUser {
    photoURL?: string | null;
    displayName?: string | null;
    email?: string | null;
}

interface FirebaseService {
    subscribe(callback: (authState: AuthState) => void): () => void;
}

interface Publication {
    username: string;
    [key: string]: unknown;
}

class LuladaSettings extends HTMLElement {
    private currentUser: UserData | null = null;
    private firebaseService: FirebaseService | null = null;
    private unsubscribe?: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        console.log('🔧 Inicializando LuladaSettings...');
        
        // Aplicar todas las correcciones
        this.initializeAllFixes();
        
        // Renderizar y configurar
        this.render();
        this.setupEventListeners();
        this.resizeHandler();
        
        // Inicializar Firebase
        this.initializeFirebase();
        
        window.addEventListener('resize', this.resizeHandler.bind(this));
    }

    disconnectedCallback(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        window.removeEventListener('resize', this.resizeHandler.bind(this));
    }

    // ===========================
    // CORRECCIONES INTEGRADAS
    // ===========================
    private initializeAllFixes(): void {
        try {
            console.log('🔧 Aplicando correcciones...');
            
            // 1. Cargar perfil
            this.loadUserProfile();
            
            // 2. Prevenir duplicación
            this.preventPageDuplication();
            
            // 3. Filtrar publicaciones
            this.filterUserPublications();
            
            // 4. Limpiar elementos Firebase
            setTimeout(() => this.cleanFirebaseElements(), 1000);
            
            console.log('✅ Correcciones aplicadas');
        } catch (error) {
            console.error('❌ Error aplicando correcciones:', error);
        }
    }

    private loadUserProfile(): void {
        try {
            const userData = localStorage.getItem('currentUser');
            
            if (!userData) {
                const defaultUser: UserData = {
                    nombre: 'Usuario de Lulada',
                    nombreDeUsuario: '@usuario',
                    foto: 'https://randomuser.me/api/portraits/women/44.jpg',
                    descripcion: 'Usuario registrado en Lulada',
                    rol: 'persona'
                };
                
                localStorage.setItem('currentUser', JSON.stringify(defaultUser));
                localStorage.setItem('isAuthenticated', 'true');
                this.currentUser = defaultUser;
            } else {
                this.currentUser = JSON.parse(userData) as UserData;
            }
            
            console.log('✅ Perfil cargado:', this.currentUser);
        } catch (error) {
            console.error('❌ Error cargando perfil:', error);
        }
    }

    private preventPageDuplication(): void {
        try {
            this.setAttribute('data-page', 'settings');
            this.setAttribute('data-page-id', `settings-${Date.now()}`);
            
            const existingPages = document.querySelectorAll('[data-page="settings"]');
            
            if (existingPages.length > 1) {
                console.warn('⚠ Duplicación detectada, limpiando...');
                existingPages.forEach((page, index) => {
                    if (page !== this && index > 0) {
                        page.remove();
                    }
                });
            }
        } catch (error) {
            console.error('❌ Error previniendo duplicación:', error);
        }
    }

    private filterUserPublications(): void {
        try {
            if (!this.currentUser) return;
            
            const publicationsData = sessionStorage.getItem('lulada_publications') || '[]';
            const allPublications: Publication[] = JSON.parse(publicationsData);
            const userPublications = allPublications.filter((pub: Publication) => {
                return pub.username === this.currentUser?.nombreDeUsuario;
            });
            
            sessionStorage.setItem('user_publications', JSON.stringify(userPublications));
            
            // Ocultar publicaciones de otros usuarios
            setTimeout(() => {
                const publications = document.querySelectorAll('lulada-publication');
                publications.forEach(pub => {
                    const username = pub.getAttribute('username');
                    if (username && username !== this.currentUser?.nombreDeUsuario) {
                        (pub as HTMLElement).style.display = 'none';
                    }
                });
            }, 500);
            
            console.log(`✅ Publicaciones filtradas: ${userPublications.length}`);
        } catch (error) {
            console.error('❌ Error filtrando publicaciones:', error);
        }
    }

    private cleanFirebaseElements(): void {
        try {
            const elementsToRemove = [
                '.verification-badge',
                '.verified-icon', 
                '.firebase-status',
                '.auth-indicator'
            ];

            elementsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });

            // Limpiar textos
            const textElements = document.querySelectorAll('*');
            textElements.forEach(element => {
                if (element.textContent) {
                    element.textContent = element.textContent
                        .replace(/✓ Verificado con Firebase/g, '')
                        .replace(/Usuario verificado/g, '')
                        .replace(/Autenticado con Firebase/g, '')
                        .trim();
                }
            });

            console.log('🧹 Elementos de Firebase limpiados');
        } catch (error) {
            console.error('❌ Error limpiando elementos:', error);
        }
    }

    // ===========================
    // FIREBASE INTEGRATION
    // ===========================
    private async initializeFirebase(): Promise<void> {
        try {
            const firebaseModule = await import('../../Services/firebase/FirebaseUserService');
            this.firebaseService = firebaseModule.FirebaseUserService.getInstance() as FirebaseService;
            
            this.unsubscribe = this.firebaseService.subscribe((authState: AuthState) => {
                this.handleAuthStateChange(authState);
            });
            
            console.log('✅ Firebase inicializado');
        } catch (_error: unknown) {
            console.log('ℹ Firebase no disponible');
        }
    }

    private handleAuthStateChange(authState: AuthState): void {
        if (authState.isAuthenticated && authState.user) {
            this.syncFirebaseToLocal(authState.user);
            this.render();
        }
    }

    private syncFirebaseToLocal(firebaseUser: FirebaseUser): void {
        const userData: UserData = {
            foto: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/women/44.jpg',
            nombreDeUsuario: `@${firebaseUser.displayName?.replace(/\s+/g, '').toLowerCase() || firebaseUser.email?.split('@')[0] || 'usuario'}`,
            nombre: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
            descripcion: 'Usuario autenticado',
            rol: 'persona'
        };

        this.currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    }

    // ===========================
    // RENDERIZADO
    // ===========================
    private render(): void {
        if (!this.shadowRoot) return;

        const userDisplay: UserData = this.currentUser || {
            nombre: 'Usuario',
            nombreDeUsuario: '@usuario',
            foto: 'https://randomuser.me/api/portraits/women/44.jpg',
            descripcion: 'Usuario de Lulada',
            rol: 'persona'
        };

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                
                .header-wrapper {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    padding: 20px 0 10px 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .logo-container {
                    width: 300px;
                }
                
                .main-container {
                    display: flex;
                    width: 100%;
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    overflow: hidden;
                }
                
                .sidebar-wrapper {
                    width: 250px;
                    height: 100%;
                    overflow-y: auto;
                    background: rgba(255, 255, 255, 0.1);
                    border-right: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .content-container {
                    flex-grow: 1;
                    height: 100%;
                    overflow-y: auto;
                    padding: 20px;
                }

                /* PERFIL DEL USUARIO */
                .profile-section {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 25px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .profile-photo {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                }

                .profile-info {
                    flex: 1;
                }

                .profile-name {
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                    margin: 0 0 5px 0;
                }

                .profile-username {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 16px;
                    margin: 0 0 8px 0;
                }

                .profile-description {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                    margin: 0;
                }

                .auth-status {
                    background: rgba(76, 175, 80, 0.2);
                    color: #4CAF50;
                    padding: 6px 12px;
                    border-radius: 15px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                    margin-top: 10px;
                    display: inline-block;
                }

                .responsive-nav {
                    display: none;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-top: 1px solid rgba(255, 255, 255, 0.2);
                }

                @media (max-width: 900px) {
                    .header-wrapper {
                        display: none;
                    }
                    
                    .sidebar-wrapper {
                        display: none;
                    }
                    
                    .responsive-nav {
                        display: block;
                    }
                    
                    .main-container {
                        flex-direction: column;
                    }
                    
                    .content-container {
                        padding: 15px;
                    }

                    .profile-section {
                        flex-direction: column;
                        text-align: center;
                    }

                    .profile-photo {
                        width: 100px;
                        height: 100px;
                    }
                    
                    :host {
                        height: auto !important;
                        min-height: 100vh;
                        overflow-y: auto;
                    }
                    
                    .main-container {
                        height: auto;
                        overflow: visible;
                    }
                }
            </style>
            
            <!-- Header responsive -->
            <lulada-responsive-header style="display: none;"></lulada-responsive-header>
            
            <!-- Header normal -->
            <div class="header-wrapper">
                <div class="logo-container">
                    <lulada-logo></lulada-logo>
                </div>
            </div>
            
            <!-- Contenedor principal -->
            <div class="main-container">
                <!-- Sidebar -->
                <div class="sidebar-wrapper">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Contenido -->
                <div class="content-container">
                    <!-- PERFIL DEL USUARIO -->
                    <div class="profile-section">
                        <img src="${userDisplay.foto}" alt="Foto de perfil" class="profile-photo">
                        <div class="profile-info">
                            <h2 class="profile-name">${userDisplay.nombre}</h2>
                            <p class="profile-username">${userDisplay.nombreDeUsuario}</p>
                            <p class="profile-description">${userDisplay.descripcion}</p>
                            <div class="auth-status">✓ Sesión Activa</div>
                        </div>
                    </div>

                    <!-- Lista de configuraciones -->
                    <cajon-list-interactive id="settings-list"></cajon-list-interactive>
                </div>
            </div>
            
            <!-- Navegación móvil -->
            <div class="responsive-nav">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;
    }

    // ===========================
    // EVENT LISTENERS
    // ===========================
    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        // Configurar logout
        this.setupLogoutButton();
    }

    private setupLogoutButton(): void {
        try {
            setTimeout(() => {
                const logoutSelectors = [
                    '[data-option="cerrar-sesion"]',
                    '#logout-btn',
                    '.logout-button'
                ];

                logoutSelectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        element.addEventListener('click', (e) => {
                            e.preventDefault();
                            this.handleLogout();
                        });
                    });
                });
            }, 500);
        } catch (error) {
            console.error('❌ Error configurando logout:', error);
        }
    }

    private async handleLogout(): Promise<void> {
        const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
        
        if (confirmLogout) {
            try {
                console.log('🚪 Iniciando logout...');

                // Logout de Firebase si está disponible
                if (this.firebaseService) {
                    const authModule = await import('../../Services/firebase/Authservice');
                    await authModule.logoutUser();
                }

                // Limpiar datos
                localStorage.removeItem('currentUser');
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userToken');
                sessionStorage.clear();

                // Navegar a login
                const loginEvent = new CustomEvent('navigate', {
                    detail: '/login',
                    bubbles: true,
                    composed: true
                });
                
                document.dispatchEvent(loginEvent);
                
                console.log('✅ Logout completado');
            } catch (error) {
                console.error('❌ Error durante logout:', error);
                alert('Error al cerrar sesión. Intenta de nuevo.');
            }
        }
    }

    private resizeHandler(): void {
        const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
        const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
        const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
        const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;

        if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
            if (window.innerWidth <= 900) {
                responsiveHeader.style.display = 'block';
                normalHeader.style.display = 'none';
                responsiveNav.style.display = 'block';
                sidebar.style.display = 'none';
            } else {
                responsiveHeader.style.display = 'none';
                normalHeader.style.display = 'block';
                responsiveNav.style.display = 'none';
                sidebar.style.display = 'block';
            }
        }
    }
}

// Registrar componente
if (!customElements.get('lulada-settings')) {
    customElements.define('lulada-settings', LuladaSettings);
}

export default LuladaSettings;