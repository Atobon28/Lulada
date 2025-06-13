// src/Components/Login/CajaLogin.ts - CON AUTENTICACIÓN FIREBASE Y ESTILO ORIGINAL
import { loginUser, registerUser } from '../../Services/firebase/Authservice';
import { UserData } from '../../flux/UserActions';

class LoginForm extends HTMLElement {
    private isLoading = false;
    private isLoginMode = true;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
        this.checkExistingAuth();
    }

    // Verificar si ya está autenticado al cargar
    private async checkExistingAuth(): Promise<void> {
        try {
            // Importar Firebase Auth
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

                    /* Campos de registro */
                    .register-fields {
                        display: none;
                        animation: fadeIn 0.3s ease;
                    }

                    .register-fields.show {
                        display: block;
                    }

                    @keyframes fadeIn {
                        from { 
                            opacity: 0; 
                            transform: translateY(-10px); 
                        }
                        to { 
                            opacity: 1; 
                            transform: translateY(0); 
                        }
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
                        display: block;
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

                    .register-link .toggle-link {
                        color: #AAAB54;
                        text-decoration: none;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        cursor: pointer;
                        border: none;
                        background: none;
                        font-size: inherit;
                        font-family: inherit;
                    }

                    .register-link .toggle-link:hover {
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
                    <h2 class="login-title" id="form-title">¡Bienvenido de vuelta!</h2>
                    <p class="login-subtitle" id="form-subtitle">Ingresa a tu cuenta para continuar</p>
                    
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

                        <!-- Campos de registro (inicialmente ocultos) -->
                        <div class="register-fields" id="register-fields">
                            <div class="form-group">
                                <label class="form-label" for="nombre">Nombre completo</label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    class="form-input" 
                                    placeholder="Tu nombre completo"
                                    autocomplete="name"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="nombreDeUsuario">Nombre de usuario</label>
                                <input 
                                    type="text" 
                                    id="nombreDeUsuario" 
                                    class="form-input" 
                                    placeholder="usuario123 (sin @)"
                                    autocomplete="username"
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="descripcion">Descripción (opcional)</label>
                                <input 
                                    type="text" 
                                    id="descripcion" 
                                    class="form-input" 
                                    placeholder="Cuéntanos un poco sobre ti..."
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="rol">Tipo de cuenta</label>
                                <select id="rol" class="form-input">
                                    <option value="persona">Usuario Personal</option>
                                    <option value="restaurante">Restaurante</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" class="login-button" id="login-button">
                            <div class="loading-spinner"></div>
                            <span class="button-text" id="button-text">Iniciar Sesión</span>
                        </button>
                    </form>
                    
                    <div class="forgot-password" id="forgot-password">¿Olvidaste tu contraseña?</div>
                    
                    <div class="divider"></div>
                    
                    <p class="register-link">
                        <span id="toggle-text">¿No tienes cuenta?</span> 
                        <button class="toggle-link" id="register-link">Regístrate aquí</button>
                    </p>
                </div>
            `;
        }
    }

    private setupEventListeners(): void {
        const form = this.shadowRoot?.getElementById('login-form') as HTMLFormElement;
        const registerLink = this.shadowRoot?.getElementById('register-link') as HTMLButtonElement;
        const forgotPassword = this.shadowRoot?.getElementById('forgot-password') as HTMLElement;

        // Envío del formulario
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Toggle entre login y registro
        registerLink?.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthMode();
        });

        // Olvidaste contraseña
        forgotPassword?.addEventListener('click', () => {
            this.handleForgotPassword();
        });
    }

    private toggleAuthMode(): void {
        this.isLoginMode = !this.isLoginMode;
        
        const formTitle = this.shadowRoot?.getElementById('form-title');
        const formSubtitle = this.shadowRoot?.getElementById('form-subtitle');
        const registerFields = this.shadowRoot?.getElementById('register-fields');
        const toggleText = this.shadowRoot?.getElementById('toggle-text');
        const registerLink = this.shadowRoot?.getElementById('register-link');
        const buttonText = this.shadowRoot?.getElementById('button-text');

        if (this.isLoginMode) {
            // Modo Login
            if (formTitle) formTitle.textContent = '¡Bienvenido de vuelta!';
            if (formSubtitle) formSubtitle.textContent = 'Ingresa a tu cuenta para continuar';
            if (registerFields) registerFields.classList.remove('show');
            if (toggleText) toggleText.textContent = '¿No tienes cuenta?';
            if (registerLink) registerLink.textContent = 'Regístrate aquí';
            if (buttonText) buttonText.textContent = 'Iniciar Sesión';
            
            this.setFieldsRequired(false);
        } else {
            // Modo Registro
            if (formTitle) formTitle.textContent = '¡Únete a Lulada!';
            if (formSubtitle) formSubtitle.textContent = 'Crea tu cuenta y descubre sabores únicos';
            if (registerFields) registerFields.classList.add('show');
            if (toggleText) toggleText.textContent = '¿Ya tienes cuenta?';
            if (registerLink) registerLink.textContent = 'Inicia sesión';
            if (buttonText) buttonText.textContent = 'Crear Cuenta';
            
            this.setFieldsRequired(true);
        }

        this.hideMessage();
    }

    private setFieldsRequired(required: boolean): void {
        const nombre = this.shadowRoot?.getElementById('nombre') as HTMLInputElement;
        const nombreDeUsuario = this.shadowRoot?.getElementById('nombreDeUsuario') as HTMLInputElement;
        
        if (nombre) nombre.required = required;
        if (nombreDeUsuario) nombreDeUsuario.required = required;
    }

    // Método principal de autenticación con Firebase
    private async handleSubmit(): Promise<void> {
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

        // Validaciones adicionales para registro
        if (!this.isLoginMode) {
            const nombreInput = this.shadowRoot?.getElementById('nombre') as HTMLInputElement;
            const nombreDeUsuarioInput = this.shadowRoot?.getElementById('nombreDeUsuario') as HTMLInputElement;
            
            const nombre = nombreInput?.value.trim();
            const nombreDeUsuario = nombreDeUsuarioInput?.value.trim();

            if (!nombre || !nombreDeUsuario) {
                this.showError('Nombre y nombre de usuario son requeridos');
                return;
            }
        }

        // Mostrar loading
        this.setLoading(true);

        try {
            if (this.isLoginMode) {
                await this.attemptFirebaseLogin(email, password);
            } else {
                await this.attemptFirebaseRegister(email, password);
            }
            
        } catch (error) {
            console.error('Error en autenticación:', error);
            this.showError('Error al procesar la solicitud. Intenta de nuevo.');
        } finally {
            this.setLoading(false);
        }
    }

    // Login con Firebase
    private async attemptFirebaseLogin(email: string, password: string): Promise<void> {
        console.log('🔐 Intentando login con Firebase...');
        
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
            
            this.showSuccess('¡Inicio de sesión exitoso!');
            setTimeout(() => this.navigateToHome(), 1000);
        } else {
            this.showError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    }

    // Registro con Firebase
    private async attemptFirebaseRegister(email: string, password: string): Promise<void> {
        console.log('🔐 Intentando registro con Firebase...');
        
        const nombreInput = this.shadowRoot?.getElementById('nombre') as HTMLInputElement;
        const nombreDeUsuarioInput = this.shadowRoot?.getElementById('nombreDeUsuario') as HTMLInputElement;
        const descripcionInput = this.shadowRoot?.getElementById('descripcion') as HTMLInputElement;
        const rolSelect = this.shadowRoot?.getElementById('rol') as HTMLSelectElement;

        const userData: UserData = {
            foto: "https://randomuser.me/api/portraits/women/44.jpg",
            nombreDeUsuario: this.formatUsername(nombreDeUsuarioInput?.value || ''),
            nombre: nombreInput?.value || '',
            descripcion: descripcionInput?.value || "Nuevo usuario de Lulada",
            rol: (rolSelect?.value as UserData['rol']) || 'persona'
        };

        const result = await registerUser(email, password, userData);
        
        if (result.success && result.user) {
            console.log('✅ Registro exitoso con Firebase:', result.user.email);
            
            // Guardar en localStorage para compatibilidad
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify({
                email: result.user.email,
                name: result.user.displayName || userData.nombre,
                uid: result.user.uid
            }));
            
            this.showSuccess('¡Cuenta creada exitosamente! Bienvenido a Lulada');
            setTimeout(() => this.navigateToHome(), 1500);
        } else {
            this.showError(result.error || 'Error al crear la cuenta. Intenta de nuevo.');
        }
    }

    private formatUsername(username: string): string {
        if (!username) return '@usuario';
        return username.startsWith('@') ? username : `@${username}`;
    }

    // Navegación a home
    private navigateToHome(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/home',
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(navEvent);
    }

    private handleForgotPassword(): void {
        this.showError('Funcionalidad de recuperación de contraseña próximamente');
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

    private hideMessage(): void {
        const errorEl = this.shadowRoot?.getElementById('error-message') as HTMLElement;
        const successEl = this.shadowRoot?.getElementById('success-message') as HTMLElement;
        
        if (errorEl) errorEl.classList.remove('show');
        if (successEl) successEl.classList.remove('show');
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Registrar el componente
customElements.define('login-form', LoginForm);

export default LoginForm;