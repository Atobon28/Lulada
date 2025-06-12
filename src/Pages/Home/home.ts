import { FirebaseUserService, AuthState } from '../../Services/firebase/FirebaseUserService';

// Interfaces para tipificación estricta
interface FirebaseModule {
    FirebaseUserService: typeof FirebaseUserService;
}

export class Home extends HTMLElement {
    private firebaseService?: FirebaseUserService;
    private unsubscribe?: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        font-family: Arial, sans-serif;
                        width: 100%;
                        min-height: 100vh;
                        background-color: #f8f9fa;
                        position: relative;
                    }
                    
                    /* Header móvil - oculto por defecto */
                    .responsive-header {
                        display: none;
                    }
                    
                    /* Header desktop - sticky */
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        position: sticky;
                        top: 0;
                        z-index: 100;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }
                    
                    /* Layout principal: sidebar + contenido + sugerencias */
                    .main-layout {
                        display: flex;
                        width: 100%;
                        min-height: calc(100vh - 80px);
                    }
                    
                    /* Sidebar izquierdo */
                    .sidebar {
                        width: 250px;
                        flex-shrink: 0;
                        background-color: white;
                        border-right: 1px solid #e0e0e0;
                    }
                    
                    /* Contenedor del contenido principal */
                    .content {
                        flex-grow: 1;
                        display: flex;
                        min-width: 0;
                    }
                    
                    /* Sección de reseñas/publicaciones */
                    .reviews-section {
                        padding: 20px;
                        background-color: #f8f9fa;
                        flex-grow: 1;
                        box-sizing: border-box;
                        position: relative;
                    }
                    
                    /* Sidebar derecho con sugerencias */
                    .suggestions-section {
                        width: 250px;
                        padding: 20px 10px;
                        flex-shrink: 0;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                    }
                    
                    /* Barra navegación móvil - oculta por defecto */
                    .responsive-nav-bar {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: white;
                        z-index: 1000;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }

                    /* Indicador discreto de autenticación */
                    .auth-status {
                        position: absolute;
                        top: 10px;
                        right: 20px;
                        background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05));
                        border: 1px solid rgba(34, 197, 94, 0.2);
                        border-radius: 6px;
                        padding: 4px 8px;
                        font-size: 11px;
                        color: #16a34a;
                        font-weight: 500;
                        display: none;
                        align-items: center;
                        gap: 4px;
                        font-family: 'Inter', sans-serif;
                        z-index: 10;
                    }

                    .auth-status.visible {
                        display: flex;
                    }

                    .status-dot {
                        width: 6px;
                        height: 6px;
                        background: #22c55e;
                        border-radius: 50%;
                        animation: pulse 2s infinite;
                    }

                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }

                    /* Estilos cuando usuario está autenticado */
                    :host(.authenticated) .reviews-section {
                        border-left: 3px solid rgba(34, 197, 94, 0.3);
                    }

                    /* Responsive: pantallas ≤ 900px */
                    @media (max-width: 900px) {
                        .responsive-header { display: block !important; }
                        .header-wrapper { display: none !important; }
                        .sidebar { display: none !important; }
                        .suggestions-section { display: none !important; }
                        .responsive-nav-bar { display: block !important; }
                        
                        .content {
                            padding-bottom: 80px;
                            width: 100%;
                        }
                        
                        .reviews-section {
                            padding: 15px;
                        }

                        .auth-status {
                            top: 5px;
                            right: 10px;
                            font-size: 10px;
                            padding: 3px 6px;
                        }
                    }

                    /* Pantallas muy pequeñas ≤ 600px */
                    @media (max-width: 600px) {
                        .reviews-section {
                            padding: 10px;
                        }
                        
                        .content {
                            padding-bottom: 85px;
                        }
                    }
                </style>
                
                <!-- Header móvil -->
                <div class="responsive-header">
                    <lulada-responsive-header></lulada-responsive-header>
                </div>
                
                <!-- Header desktop -->
                <div class="header-wrapper">
                    <lulada-header></lulada-header>
                </div>
                
                <!-- Layout principal -->
                <div class="main-layout">
                    <!-- Sidebar izquierdo -->
                    <div class="sidebar">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <!-- Contenido principal -->
                    <div class="content">
                        <div class="reviews-section">
                            <!-- Indicador discreto de autenticación -->
                            <div class="auth-status" id="auth-status">
                                <div class="status-dot"></div>
                                Sesión activa
                            </div>
                            
                            <lulada-reviews-container></lulada-reviews-container>
                        </div>
                        
                        <!-- Sugerencias -->
                        <div class="suggestions-section">
                            <lulada-suggestions></lulada-suggestions>
                        </div>
                    </div>
                </div>
                
                <!-- Barra navegación móvil -->
                <div class="responsive-nav-bar">
                    <lulada-responsive-bar></lulada-responsive-bar>
                </div>
            `;
        }
    }
    
    // Se ejecuta cuando el componente se añade al DOM
    connectedCallback(): void {
        this.setupLocationFiltering();
        this.initializeFirebaseIntegration();
    }

    disconnectedCallback(): void {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    private async initializeFirebaseIntegration(): Promise<void> {
        try {
            // Intentar cargar Firebase solo si está disponible
            const firebaseModule = await import('../../Services/firebase/FirebaseUserService') as FirebaseModule;
            this.firebaseService = firebaseModule.FirebaseUserService.getInstance();
            this.unsubscribe = this.firebaseService.subscribe(this.handleAuthStateChange.bind(this));
        } catch {
            // Firebase no disponible o error al cargar, continuar sin él
            console.log('Firebase no disponible, continuando sin autenticación');
        }
    }

    private handleAuthStateChange(authState: AuthState): void {
        const authStatusElement = this.shadowRoot?.getElementById('auth-status');
        
        if (authState.isAuthenticated && authState.user) {
            // Mostrar indicador de sesión activa
            if (authStatusElement) {
                authStatusElement.classList.add('visible');
            }
            this.classList.add('authenticated');
            
            // Toast de bienvenida discreto
            this.showWelcomeToast(authState.user.displayName || 'Usuario');
        } else {
            // Ocultar indicador
            if (authStatusElement) {
                authStatusElement.classList.remove('visible');
            }
            this.classList.remove('authenticated');
        }
    }

    private showWelcomeToast(displayName: string): void {
        // Solo mostrar una vez por sesión
        const lastWelcome = this.getSessionStorageValue('last_welcome_shown');
        const now = Date.now();
        
        if (lastWelcome && (now - parseInt(lastWelcome, 10)) < 60000) {
            return;
        }

        const toast = this.createWelcomeToast(displayName);
        document.body.appendChild(toast);

        this.animateToastIn(toast);
        this.scheduleToastRemoval(toast);

        this.setSessionStorageValue('last_welcome_shown', now.toString());
    }

    private createWelcomeToast(displayName: string): HTMLDivElement {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 280px;
        `;

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="font-size: 16px;">👋</div>
                <div>¡Hola ${this.escapeHtml(displayName)}!</div>
            </div>
        `;

        return toast;
    }

    private animateToastIn(toast: HTMLDivElement): void {
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
    }

    private scheduleToastRemoval(toast: HTMLDivElement): void {
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    private getSessionStorageValue(key: string): string | null {
        try {
            return sessionStorage.getItem(key);
        } catch (error) {
            console.warn('No se pudo acceder a sessionStorage:', error);
            return null;
        }
    }

    private setSessionStorageValue(key: string, value: string): void {
        try {
            sessionStorage.setItem(key, value);
        } catch (error) {
            console.warn('No se pudo escribir en sessionStorage:', error);
        }
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    // Configurar filtros de ubicación (funcionalidad existente)
    private setupLocationFiltering(): void {
        document.addEventListener('location-filter-changed', () => {
            // Lógica existente de filtros
        });
    }

    // Métodos públicos para debug y uso externo
    public getAuthState(): AuthState | null {
        return this.firebaseService?.getAuthState() || null;
    }

    public isUserAuthenticated(): boolean {
        return this.firebaseService?.isAuthenticated() || false;
    }

    // Método para debug
    public debugInfo(): void {
        console.log('🏠 Home Component Debug:');
        console.log('- Firebase Service:', !!this.firebaseService);
        console.log('- Is Authenticated:', this.isUserAuthenticated());
        console.log('- Auth State:', this.getAuthState());
        console.log('- Shadow DOM:', !!this.shadowRoot);
        console.log('- Connected to DOM:', this.isConnected);
    }
}

export default Home;