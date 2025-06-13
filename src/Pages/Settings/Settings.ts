// Settings.ts - VERSIÓN CON DISEÑO ORIGINAL Y FUNCIONALIDAD DE LOGOUT QUE FUNCIONA

class LuladaSettings extends HTMLElement {
    private resizeHandler: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Bind del resize handler
        this.resizeHandler = this.handleResize.bind(this);
    }

    connectedCallback() {
        console.log('[LuladaSettings] Componente añadido al DOM');
        this.render();
        this.setupLogoutButton();
        window.addEventListener('resize', this.resizeHandler);
        this.handleResize();
    }

    disconnectedCallback() {
        console.log('[LuladaSettings] Componente eliminado del DOM');
        window.removeEventListener('resize', this.resizeHandler);
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    background-color: white;
                }
                
                .header-wrapper {
                    width: 100%;
                    background-color: white;
                    padding: 20px 0 10px 20px;
                    border-bottom: 1px solid #eaeaea;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .logo-container {
                    width: 300px;
                }
                
                .main-container {
                    display: flex;
                    width: 100%;
                    flex: 1;
                    background-color: white;
                    overflow: hidden;
                }
                
                .sidebar-wrapper {
                    width: 250px;
                    height: 100%;
                    overflow-y: auto;
                }
                
                .content-container {
                    flex-grow: 1;
                    padding-left: 20px;
                    padding-top: 20px;
                    height: 100%;
                    overflow-y: auto;
                }
                
                .responsive-nav {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border-top: 1px solid #e0e0e0;
                    padding: 10px 0;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }

                /* Estilos para el botón de logout */
                .logout-section {
                    margin-top: 30px;
                    padding: 20px;
                    border-top: 2px solid #f0f0f0;
                    background-color: #fafafa;
                    border-radius: 8px;
                }

                .logout-button {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 16px;
                    width: 100%;
                    max-width: 300px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .logout-button:hover {
                    background: #c82333;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
                }

                .logout-button:active {
                    transform: translateY(0);
                }

                .logout-title {
                    color: #333;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }

                .logout-description {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 20px;
                    line-height: 1.4;
                }
                
                /* Estilos responsivos para pantallas pequeñas (móviles) */
                @media (max-width: 900px) {
                    .header-wrapper {
                        display: none;
                    }
                    
                    .sidebar-wrapper {
                        display: none;
                    }
                    
                    .content-container {
                        padding-left: 10px;
                        padding-right: 10px;
                        padding-top: 10px;
                        padding-bottom: 100px;
                        height: auto;
                        max-height: none;
                        overflow-y: visible;
                    }
                    
                    .responsive-nav {
                        display: block;
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

                    .logout-section {
                        margin-top: 20px;
                        padding: 15px;
                    }

                    .logout-button {
                        font-size: 14px;
                        padding: 12px 20px;
                    }
                }
            </style>
            
            <!-- Header responsive que solo se ve en móviles -->
            <lulada-responsive-header style="display: none;"></lulada-responsive-header>
            
            <!-- Header normal que solo se ve en computadoras -->
            <div class="header-wrapper">
                <div class="logo-container">
                    <lulada-logo></lulada-logo>
                </div>
            </div>
            
            <!-- Contenedor principal con sidebar y contenido -->
            <div class="main-container">
                <!-- Barra lateral izquierda -->
                <div class="sidebar-wrapper">
                    <lulada-sidebar></lulada-sidebar>
                </div>
                
                <!-- Área de contenido donde se muestran las opciones de configuración -->
                <div class="content-container">
                    <!-- COMPONENTE ORIGINAL QUE GENERA EL DISEÑO CORRECTO -->
                    <cajon-list-interactive id="settings-list"></cajon-list-interactive>
                    
                    <!-- Sección de cerrar sesión -->
                    <div class="logout-section">
                        <div class="logout-title">Gestión de Sesión</div>
                        <div class="logout-description">
                            Cierra tu sesión actual de forma segura. Tendrás que volver a iniciar sesión para acceder a tu cuenta.
                        </div>
                        <button class="logout-button" id="logout-btn">
                            🚪 Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Barra de navegación que solo se ve en móviles -->
            <div class="responsive-nav">
                <lulada-responsive-bar></lulada-responsive-bar>
            </div>
        `;
    }

    private setupLogoutButton(): void {
        console.log('[LuladaSettings] Configurando botón de logout');
        
        // Esperar un momento para que el DOM esté listo
        setTimeout(() => {
            const logoutButton = this.shadowRoot?.querySelector('#logout-btn');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    this.handleLogout();
                });
                console.log('[LuladaSettings] ✅ Botón de logout configurado');
            } else {
                console.error('[LuladaSettings] ❌ No se encontró el botón de logout');
            }
        }, 100);
    }

    // FUNCIONALIDAD DE LOGOUT QUE SÍ FUNCIONA (exactamente como el código original)
    private handleLogout(): void {
        console.log('[LuladaSettings] 🚪 Iniciando proceso de logout');
        
        // Mostrar confirmación
        const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?\n\nTendrás que volver a iniciar sesión para acceder a tu cuenta.');
        
        if (!confirmLogout) {
            console.log('[LuladaSettings] Logout cancelado por el usuario');
            return;
        }

        try {
            // Limpiar toda la información de sesión
            console.log('[LuladaSettings] 🧹 Limpiando datos de sesión...');
            
            // Remover elementos específicos de localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            
            // Limpiar sessionStorage completamente
            sessionStorage.clear();
            
            console.log('[LuladaSettings] ✅ Datos de sesión limpiados');
            
            // Disparar evento de logout para que LoadPage lo capture
            const logoutEvent = new CustomEvent('auth-logout', {
                detail: {
                    reason: 'user_logout',
                    timestamp: Date.now()
                },
                bubbles: true,
                composed: true
            });
            
            document.dispatchEvent(logoutEvent);
            console.log('[LuladaSettings] 📡 Evento auth-logout disparado');
            
        } catch (error) {
            console.error('[LuladaSettings] ❌ Error durante el logout:', error);
            
            // En caso de error, intentar limpiar de todas formas
            try {
                localStorage.clear();
                sessionStorage.clear();
                document.dispatchEvent(new CustomEvent('auth-logout', { 
                    bubbles: true, 
                    composed: true 
                }));
            } catch (fallbackError) {
                console.error('[LuladaSettings] ❌ Error en fallback logout:', fallbackError);
            }
        }
    }
    
    private handleResize(): void {
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

    // Método público para logout programático (para testing)
    public logout(): void {
        this.handleLogout();
    }

    // Método para debugging
    public getAuthStatus(): object {
        return {
            isAuthenticated: localStorage.getItem('isAuthenticated'),
            currentUser: localStorage.getItem('currentUser'),
            sessionStorageKeys: Object.keys(sessionStorage),
            localStorageKeys: Object.keys(localStorage)
        };
    }

    // Método público para debug
    public debugInfo(): void {
        console.log('🔍 === LULADA SETTINGS DEBUG ===');
        console.log('- Componente conectado:', this.isConnected);
        console.log('- ShadowRoot existe:', !!this.shadowRoot);
        console.log('- Window width:', window.innerWidth);
        console.log('- Auth status:', this.getAuthStatus());
        
        const settingsList = this.shadowRoot?.querySelector('#settings-list');
        console.log('- Settings list encontrado:', !!settingsList);
        
        const logoutBtn = this.shadowRoot?.querySelector('#logout-btn');
        console.log('- Logout button encontrado:', !!logoutBtn);
        
        console.log('================================');
    }
}

// Funciones globales para debug
if (typeof window !== 'undefined') {
    (window as any).debugSettings = () => {
        const settingsComponent = document.querySelector('lulada-settings') as LuladaSettings;
        if (settingsComponent && typeof settingsComponent.debugInfo === 'function') {
            settingsComponent.debugInfo();
        } else {
            console.log('❌ No se encontró componente lulada-settings');
        }
    };

    // Función de emergencia para logout
    (window as any).emergencyLogout = () => {
        console.log('🚨 LOGOUT DE EMERGENCIA');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    };
}

export default LuladaSettings;