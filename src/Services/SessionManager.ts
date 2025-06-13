// SessionManager.ts - Versión corregida sin conflictos de tipos
export class SessionManager {
    private static instance: SessionManager;

    private constructor() {}

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    public async performLogout(): Promise<boolean> {
        try {
            console.log('🚪 Iniciando proceso de logout...');

            // Logout de Firebase si está disponible
            await this.logoutFromFirebase();

            // Limpiar datos locales
            this.clearLocalData();

            // Limpiar datos de sesión
            this.clearSessionData();

            // Navegar a login
            this.navigateToLogin();

            console.log('✅ Logout completado exitosamente');
            return true;

        } catch (error) {
            console.error('❌ Error durante logout:', error);
            return false;
        }
    }

    private async logoutFromFirebase(): Promise<void> {
        try {
            const { logoutUser } = await import('./firebase/Authservice');
            const result = await logoutUser();
            
            if (result.success) {
                console.log('✅ Logout de Firebase exitoso');
            }
        } catch (error) {
            console.log('ℹ Firebase no disponible:', error);
        }
    }

    private clearLocalData(): void {
        try {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('userToken');
            localStorage.removeItem('lulada_user_data');
            localStorage.removeItem('firebase:authUser');
            console.log('✅ LocalStorage limpiado');
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
        }
    }

    private clearSessionData(): void {
        try {
            sessionStorage.clear();
            console.log('✅ SessionStorage limpiado');
        } catch (error) {
            console.error('Error limpiando sessionStorage:', error);
        }
    }

    private navigateToLogin(): void {
        try {
            const loginEvent = new CustomEvent('navigate', {
                detail: '/login',
                bubbles: true,
                composed: true
            });
            
            document.dispatchEvent(loginEvent);

            // Fallback
            setTimeout(() => {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }, 100);

        } catch (error) {
            console.error('Error navegando a login:', error);
            window.location.href = '/login';
        }
    }

    public isAuthenticated(): boolean {
        try {
            const localAuth = localStorage.getItem('isAuthenticated') === 'true';
            const hasUser = !!localStorage.getItem('currentUser');
            return localAuth || hasUser;
        } catch (error) {
            return false;
        }
    }

    public getCurrentUser(): any {
        try {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            return null;
        }
    }

    public setupLogoutButton(buttonSelector: string, component: HTMLElement): void {
        try {
            const shadowRoot = component.shadowRoot;
            if (!shadowRoot) return;

            const logoutBtn = shadowRoot.querySelector(buttonSelector);
            if (!logoutBtn) {
                console.warn(`Botón de logout no encontrado: ${buttonSelector}`);
                return;
            }

            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');
                if (confirmed) {
                    const success = await this.performLogout();
                    if (!success) {
                        alert('Error al cerrar sesión. Intenta de nuevo.');
                    }
                }
            });

            console.log(`✅ Botón de logout configurado: ${buttonSelector}`);

        } catch (error) {
            console.error('Error configurando botón de logout:', error);
        }
    }
}