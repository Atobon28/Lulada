// src/Components/Login/CajaLogin.ts - CON AUTENTICACIÓN FIREBASE
class LoginForm extends HTMLElement {
    private isLoading = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
        this.checkExistingAuth();
    }

    // NUEVO: Verificar si ya está autenticado al cargar
    private async checkExistingAuth(): Promise<void> {
        try {
            // Intentar importar Firebase Auth
            const { getCurrentUser, isAuthenticated } = await import('../../Services/firebase/Authservice');
            
            if (isAuthenticated()) {
                const currentUser = getCurrentUser();
                console.log('✅ Usuario ya autenticado:', currentUser?.email);
                
                // Navegar directamente a home
                this.navigateToHome();
            }
        } catch (_error) {
            // Firebase no disponible, continuar con login normal
            console.log('⚠️ Firebase no disponible, usando login local');
        }
    }

    private render(): void {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        max-width: 400px;
                        margin: 0 auto;
                    }

                    .login-container {
                        width: 100%;
                        padding: 0;
                        background: transparent;
                        text-align: center;
                        box-sizing: border-box;
                    }

                    .login-title {
                        font-size: 32px;
                        font-weight: 700;
                        color: #333;
                        margin-bottom: 10px;
                        font-family: 'Poppins', sans-serif;
                        letter-spacing: -0.5px;
                    }

                    .login-subtitle {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 40px;
                        font-weight: 400;
                    }

                    .form-group {
                        margin-bottom: 25px;
                        text-align: left;
                    }

                    .form-label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: 600;
                        color: #333;
                        font-size: 14px;
                        letter-spacing: 0.5px;
                    }

                    .form-input {
                        width: 100%;
                        padding: 15px 18px;
                        border: 2px solid #e1e5e9;
                        border-radius: 12px;
                        font-size: 16px;
                        font-family: inherit;
                        transition: all 0.3s ease;
                        box-sizing: border-box;
                        background: #fafbfc;
                    }

                    .form-input:focus {
                        outline: none;
                        border-color: #AAAB54;
                        box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                        background: white;
                        transform: translateY(-1px);
                    }

                    .form-input::placeholder {
                        color: #9ca3af;
                        font-weight: 400;
                    }

                    .login-button {
                        width: 100%;
                        padding: 16px 24px;
                        background: linear-gradient(135deg, #AAAB54, #999A4A);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 20px;
                        position: relative;
                        overflow: hidden;
                        letter-spacing: 0.5px;
                        box-shadow: 0 4px 15px rgba(170, 171, 84, 0.2);
                    }

                    .login-button:hover:not(:disabled) {
                        background: linear-gradient(135deg, #999A4A, #8a8b3a);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(170, 171, 84, 0.3);
                    }

                    .login-button:active {
                        transform: translateY(0);
                        box-shadow: 0 4px 15px rgba(170, 171, 84, 0.2);
                    }

                    .login-button:disabled {
                        background: #e5e7eb;
                        color: #9ca3af;
                        cursor: not-allowed;
                        transform: none;
                        box-shadow: none;
                    }

                    .loading-spinner {
                        display: none;
                        width: 20px;
                        height: 20px;
                        border: 2px solid transparent;
                        border-top: 2px solid currentColor;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-right: 10px;
                    }

                    .loading .loading-spinner {
                        display: inline-block;
                    }

                    .loading .button-text {
                        opacity: 0.7;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .button-text {
                        transition: opacity 0.3s ease;
                    }

                    .forgot-password {
                        color: #666;
                        font-size: 14px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 30px;
                        font-weight: 500;
                    }

                    .forgot-password:hover {
                        color: #AAAB54;
                        text-decoration: underline;
                    }

                    .divider {
                        height: 1px;
                        background: linear-gradient(to right, transparent, #e1e5e9, transparent);
                        margin: 30px 0;
                        position: relative;
                    }

                    .divider::after {
                        content: 'O';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 0 15px;
                        color: #9ca3af;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .register-link {
                        color: #666;
                        font-size: 14px;
                        text-align: center;
                        font-weight: 500;
                    }

                    .register-link a {
                        color: #AAAB54;
                        text-decoration: none;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    }

                    .register-link a:hover {
                        color: #999A4A;
                        text-decoration: underline;
                    }

                    .error-message, .success-message {
                        padding: 12px 16px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: center;
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: all 0.3s ease;
                    }

                    .error-message.show, .success-message.show {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .error-message {
                        background: #fef2f2;
                        color: #dc2626;
                        border: 1px solid #fecaca;
                    }

                    .success-message {
                        background: #f0fdf4;
                        color: #16a34a;
                        border: 1px solid #bbf7d0;
                    }

                    /* Responsive */
                    @media (max-width: 480px) {
                        .login-title {
                            font-size: 28px;
                            margin-bottom: 8px;
                        }

                        .login-subtitle {
                            font-size: 14px;
                            margin-bottom: 30px;
                        }

                        .form-input {
                            padding: 14px 16px;
                            font-size: 16px;
                        }

                        .login-button {
                            padding: 15px 20px;
                            font-size: 15px;
                        }
                    }
                </style>

                <div class="login-container">
                    <h2 class="login-title">¡Bienvenido de vuelta!</h2>
                    <p class="login-subtitle">Ingresa a tu cuenta para continuar</p>
                    
                    <!-- Mensajes de error y éxito -->
                    <div class="error-message" id="error-message"></div>
                    <div class="success-message" id="success-message"></div>
                    
                    <form id="login-form" novalidate>
                        <div class="form-group">
                            <label class="form-label" for="email">Correo Electrónico</label>
                            <input 
                                type="email" 
                                id="email" 
                                class="form-input" 
                                placeholder="tu@email.com"
                                required
                                autocomplete="email"
                                spellcheck="false"
                            >
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="password">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                class="form-input" 
                                placeholder="Tu contraseña"
                                required
                                autocomplete="current-password"
                                minlength="6"
                            >
                        </div>
                        
                        <button type="submit" class="login-button" id="login-button">
                            <div class="loading-spinner"></div>
                            <span class="button-text">Iniciar Sesión</span>
                        </button>
                    </form>
                    
                    <p class="forgot-password" id="forgot-password">¿Olvidaste tu contraseña?</p>
                    
                    <div class="divider"></div>
                    
                    <p class="register-link">
                        ¿No tienes cuenta? <a href="#" id="register-link">Regístrate aquí</a>
                    </p>
                </div>
            `;
        }
    }

    private setupEventListeners(): void {
        const form = this.shadowRoot?.getElementById('login-form') as HTMLFormElement;
        const registerLink = this.shadowRoot?.getElementById('register-link') as HTMLAnchorElement;
        const forgotPassword = this.shadowRoot?.getElementById('forgot-password') as HTMLElement;

        // Envío del formulario
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Enlace de registro
        registerLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToRegister();
        });

        // Olvidaste contraseña
        forgotPassword?.addEventListener('click', () => {
            this.handleForgotPassword();
        });
    }

    // NUEVO: Método principal de login con Firebase
    private async handleLogin(): Promise<void> {
        if (this.isLoading) return;

        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;

        const email = emailInput?.value.trim();
        const password = passwordInput?.value;

        // Validaciones básicas
        if (!email || !password) {
            this.showError('Por favor, completa todos los campos');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Por favor, ingresa un email válido');
            return;
        }

        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Mostrar loading
        this.setLoading(true);

        try {
            // NUEVO: Intentar login con Firebase primero
            const firebaseSuccess = await this.attemptFirebaseLogin(email, password);
            
            if (firebaseSuccess) {
                this.showSuccess('¡Inicio de sesión exitoso con Firebase!');
                setTimeout(() => this.navigateToHome(), 1000);
                return;
            }

            // Fallback: Login local (simulado)
            await this.attemptLocalLogin(email, password);
            
        } catch (error) {
            console.error('Error en login:', error);
            this.showError('Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            this.setLoading(false);
        }
    }

    // NUEVO: Intentar login con Firebase
    private async attemptFirebaseLogin(email: string, password: string): Promise<boolean> {
        try {
            const { loginUser } = await import('../../Services/firebase/Authservice');
            
            const result = await loginUser(email, password);
            
            if (result.success && result.user) {
                console.log('✅ Login exitoso con Firebase:', result.user.email);
                
                // Guardar en localStorage para compatibilidad
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    email: result.user.email,
                    name: result.user.displayName || 'Usuario',
                    uid: result.user.uid
                }));
                
                return true;
            } else {
                if (result.error) {
                    this.showError(result.error);
                }
                return false;
            }
            
        } catch (_error) {
            console.log('⚠️ Firebase no disponible, intentando login local');
            return false;
        }
    }

    // NUEVO: Login local como fallback
    private async attemptLocalLogin(email: string, password: string): Promise<void> {
        // Simulación de login local
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Verificar credenciales básicas (demo)
        if (email === 'demo@lulada.com' && password === '123456') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                email: email,
                name: 'Usuario Demo',
                uid: 'demo-user'
            }));
            
            this.showSuccess('¡Inicio de sesión exitoso!');
            setTimeout(() => this.navigateToHome(), 1000);
        } else {
            throw new Error('Credenciales inválidas');
        }
    }

    // NUEVO: Navegación a home
    private navigateToHome(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/home',
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(navEvent);
    }

    private navigateToRegister(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/register',
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(navEvent);
    }

    private handleForgotPassword(): void {
        alert('Funcionalidad de recuperación de contraseña próximamente');
    }

    private setLoading(loading: boolean): void {
        this.isLoading = loading;
        const loginButton = this.shadowRoot?.getElementById('login-button') as HTMLButtonElement;
        
        if (loading) {
            loginButton?.classList.add('loading');
            loginButton.disabled = true;
        } else {
            loginButton?.classList.remove('loading');
            loginButton.disabled = false;
        }
    }

    private showError(message: string): void {
        this.showMessage(message, 'error');
    }

    private showSuccess(message: string): void {
        this.showMessage(message, 'success');
    }

    private showMessage(message: string, type: 'error' | 'success'): void {
        const messageEl = this.shadowRoot?.getElementById(`${type}-message`) as HTMLElement;
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.classList.add('show');

            setTimeout(() => {
                messageEl.classList.remove('show');
            }, 4000);
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

export default LoginForm;