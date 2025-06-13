// CajaLogin.ts - VERSIÓN CORREGIDA CON IDS CORRECTOS
// =====================================================

class LoginForm extends HTMLElement {
    private isLoading = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
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
                        padding: 30px;
                        background: white;
                        border-radius: 15px;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        box-sizing: border-box;
                    }

                    .login-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 25px;
                        font-family: 'Poppins', sans-serif;
                    }

                    .form-group {
                        margin-bottom: 20px;
                        text-align: left;
                    }

                    .form-label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: 500;
                        color: #333;
                        font-size: 14px;
                    }

                    .form-input {
                        width: 100%;
                        padding: 12px 15px;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                        font-size: 16px;
                        font-family: inherit;
                        transition: border-color 0.3s ease, box-shadow 0.3s ease;
                        box-sizing: border-box;
                    }

                    .form-input:focus {
                        outline: none;
                        border-color: #AAAB54;
                        box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                    }

                    .form-input:disabled {
                        background-color: #f5f5f5;
                        cursor: not-allowed;
                    }

                    .login-button {
                        width: 100%;
                        padding: 14px;
                        background: linear-gradient(135deg, #AAAB54, #9a9b4a);
                        border: none;
                        color: white;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 15px;
                        position: relative;
                        overflow: hidden;
                    }

                    .login-button:hover:not(:disabled) {
                        background: linear-gradient(135deg, #9a9b4a, #8a8b3a);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3);
                    }

                    .login-button:disabled {
                        background: #ccc;
                        cursor: not-allowed;
                        transform: none;
                        box-shadow: none;
                    }

                    .loading-spinner {
                        display: none;
                        width: 20px;
                        height: 20px;
                        border: 2px solid #ffffff40;
                        border-top: 2px solid #ffffff;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-right: 10px;
                    }

                    .login-button.loading .loading-spinner {
                        display: inline-block;
                    }

                    .login-button.loading .button-text {
                        opacity: 0.7;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .forgot-password {
                        font-size: 14px;
                        color: #666;
                        margin: 15px 0;
                        cursor: pointer;
                        transition: color 0.3s ease;
                    }

                    .forgot-password:hover {
                        color: #AAAB54;
                        text-decoration: underline;
                    }

                    .divider {
                        width: 100%;
                        height: 1px;
                        background: linear-gradient(to right, transparent, #ddd, transparent);
                        margin: 20px 0;
                        position: relative;
                    }

                    .divider::after {
                        content: 'o';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 0 15px;
                        color: #999;
                        font-size: 14px;
                    }

                    .register-button {
                        width: 100%;
                        padding: 12px;
                        background: linear-gradient(135deg, #F4B400, #E09E00);
                        border: none;
                        color: white;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    }

                    .register-button:hover {
                        background: linear-gradient(135deg, #E09E00, #CC8E00);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(244, 180, 0, 0.3);
                    }

                    .error-message {
                        background: #ffebee;
                        color: #c62828;
                        padding: 12px;
                        border-radius: 6px;
                        margin-bottom: 15px;
                        font-size: 14px;
                        border-left: 4px solid #f44336;
                        text-align: left;
                        display: none;
                    }

                    .success-message {
                        background: #e8f5e8;
                        color: #2e7d32;
                        padding: 12px;
                        border-radius: 6px;
                        margin-bottom: 15px;
                        font-size: 14px;
                        border-left: 4px solid #4caf50;
                        text-align: left;
                        display: none;
                    }

                    .show-message {
                        display: block !important;
                        animation: slideIn 0.3s ease-out;
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    /* Responsive design */
                    @media (max-width: 480px) {
                        .login-container {
                            padding: 20px;
                            margin: 0 10px;
                        }
                        
                        .login-title {
                            font-size: 20px;
                            margin-bottom: 20px;
                        }
                        
                        .form-input, .login-button, .register-button {
                            font-size: 14px;
                        }
                    }
                </style>
                
                <div class="login-container">
                    <h2 class="login-title">Iniciar Sesión</h2>
                    
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
                        
                        <!-- ✅ CORRECCIÓN: ID corregido de 'login-btn' a 'login-button' -->
                        <button type="submit" class="login-button" id="login-button">
                            <div class="loading-spinner"></div>
                            <span class="button-text">Iniciar Sesión</span>
                        </button>
                    </form>
                    
                    <p class="forgot-password" id="forgot-password">¿Olvidaste tu contraseña?</p>
                    
                    <div class="divider"></div>
                    
                    <!-- ✅ CORRECCIÓN: ID corregido de 'register-btn' a 'register-button' -->
                    <button class="register-button" id="register-button">
                        Crear Cuenta Nueva
                    </button>
                </div>
            `;
        }
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const form = this.shadowRoot.getElementById('login-form') as HTMLFormElement;
        const emailInput = this.shadowRoot.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot.getElementById('password') as HTMLInputElement;
        
        // ✅ CORRECCIÓN: Usando los IDs correctos
        const loginBtn = this.shadowRoot.getElementById('login-button') as HTMLButtonElement;
        const registerBtn = this.shadowRoot.getElementById('register-button') as HTMLButtonElement;
        const forgotPassword = this.shadowRoot.getElementById('forgot-password') as HTMLElement;

        // Verificar que todos los elementos existan
        if (!form || !emailInput || !passwordInput || !loginBtn || !registerBtn || !forgotPassword) {
            console.error('LoginForm: No se encontraron todos los elementos necesarios');
            return;
        }

        // Manejar envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Manejar navegación a registro
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToRegister();
        });

        // Manejar "olvidé mi contraseña"
        forgotPassword.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        // Limpiar mensajes de error cuando el usuario empiece a escribir
        [emailInput, passwordInput].forEach(input => {
            input.addEventListener('input', () => {
                this.clearMessages();
            });
        });

        // Manejar Enter en los inputs
        [emailInput, passwordInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !this.isLoading) {
                    this.handleLogin();
                }
            });
        });
    }

    private async handleLogin(): Promise<void> {
        if (this.isLoading) return;

        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;
        
        // ✅ CORRECCIÓN: Usando el ID correcto
        const loginBtn = this.shadowRoot?.getElementById('login-button') as HTMLButtonElement;

        if (!emailInput || !passwordInput || !loginBtn) {
            console.error('No se encontraron los elementos del formulario');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validaciones básicas
        if (!email || !password) {
            this.showError('Por favor, completa todos los campos');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Por favor, ingresa un correo electrónico válido');
            return;
        }

        if (password.length < 6) {
            this.showError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Iniciar proceso de login
        this.setLoading(true);
        this.clearMessages();

        try {
            console.log('Iniciando proceso de login...');

            // Importar y usar el servicio de autenticación de Firebase
            const { loginUser } = await import('../../Services/firebase/Authservice');
            const result = await loginUser(email, password);

            if (result.success && result.user && result.userData) {
                console.log('✅ Login exitoso:', result.user.email);
                
                // Guardar datos de autenticación en localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify(result.userData));

                // Mostrar mensaje de éxito
                this.showSuccess('¡Bienvenido! Redirigiendo...');

                // Disparar evento de autenticación exitosa
                document.dispatchEvent(new CustomEvent('auth-success', {
                    detail: {
                        user: result.user,
                        userData: result.userData
                    },
                    bubbles: true,
                    composed: true
                }));

                // Redirigir a home después de un breve delay
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('navigate', {
                        detail: '/home',
                        bubbles: true,
                        composed: true
                    }));
                }, 1500);

            } else {
                console.error('❌ Error en login:', result.error);
                this.showError(result.error || 'Error al iniciar sesión. Verifica tus credenciales.');
            }

        } catch (error) {
            console.error('❌ Error inesperado en login:', error);
            this.showError('Error inesperado. Verifica tu conexión e intenta de nuevo.');
        } finally {
            this.setLoading(false);
        }
    }

    private navigateToRegister(): void {
        console.log('Navegando a registro...');
        document.dispatchEvent(new CustomEvent('navigate', {
            detail: '/register',
            bubbles: true,
            composed: true
        }));
    }

    private handleForgotPassword(): void {
        // Por ahora, mostrar un mensaje
        this.showError('Función de recuperación de contraseña en desarrollo. Contacta al administrador.');
    }

    private setLoading(loading: boolean): void {
        this.isLoading = loading;
        
        // ✅ CORRECCIÓN: Usando el ID correcto
        const loginBtn = this.shadowRoot?.getElementById('login-button') as HTMLButtonElement;
        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;
        const registerBtn = this.shadowRoot?.getElementById('register-button') as HTMLButtonElement;

        if (loginBtn) {
            loginBtn.disabled = loading;
            if (loading) {
                loginBtn.classList.add('loading');
            } else {
                loginBtn.classList.remove('loading');
            }
        }

        // Deshabilitar inputs durante el loading
        [emailInput, passwordInput, registerBtn].forEach(element => {
            if (element) {
                element.disabled = loading;
            }
        });
    }

    private showError(message: string): void {
        this.clearMessages();
        const errorElement = this.shadowRoot?.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show-message');
        }
    }

    private showSuccess(message: string): void {
        this.clearMessages();
        const successElement = this.shadowRoot?.getElementById('success-message');
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.add('show-message');
        }
    }

    private clearMessages(): void {
        const errorElement = this.shadowRoot?.getElementById('error-message');
        const successElement = this.shadowRoot?.getElementById('success-message');
        
        [errorElement, successElement].forEach(element => {
            if (element) {
                element.classList.remove('show-message');
                element.textContent = '';
            }
        });
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Método público para limpiar el formulario
    public clearForm(): void {
        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;
        
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        this.clearMessages();
    }

    // Método público para enfocar el primer input
    public focusFirstInput(): void {
        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        if (emailInput) {
            emailInput.focus();
        }
    }

    // Método para debug
    public debug(): void {
        console.log('🔍 LoginForm Debug Info:');
        console.log('- isLoading:', this.isLoading);
        console.log('- shadowRoot:', !!this.shadowRoot);
        
        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;
        
        console.log('- Email value:', emailInput?.value || 'N/A');
        console.log('- Password length:', passwordInput?.value?.length || 0);
        console.log('- Form valid:', this.isFormValid());
        
        // Verificar que todos los elementos existan
        const elements = {
            'login-form': !!this.shadowRoot?.getElementById('login-form'),
            'email': !!this.shadowRoot?.getElementById('email'),
            'password': !!this.shadowRoot?.getElementById('password'),
            'login-button': !!this.shadowRoot?.getElementById('login-button'),
            'register-button': !!this.shadowRoot?.getElementById('register-button'),
            'forgot-password': !!this.shadowRoot?.getElementById('forgot-password'),
            'error-message': !!this.shadowRoot?.getElementById('error-message'),
            'success-message': !!this.shadowRoot?.getElementById('success-message')
        };
        
        console.log('- Elementos encontrados:', elements);
    }

    private isFormValid(): boolean {
        const emailInput = this.shadowRoot?.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;
        
        if (!emailInput || !passwordInput) return false;
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        return this.isValidEmail(email) && password.length >= 6;
    }
}

// Definir el custom element
if (!customElements.get('login-form')) {
    customElements.define('login-form', LoginForm);
}

export default LoginForm;