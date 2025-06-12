// src/Components/Login/CajaLogin.ts - Actualizado con funcionalidad Firebase completa
import { loginUser } from '../../Services/firebase/Authservice';

interface LoginFormData {
    email: string;
    password: string;
}

interface ValidationResult {
    isValid: boolean;
    errors: { [key: string]: string };
}

class LoginForm extends HTMLElement {
    private isLoading = false;
    private loginAttempts = 0;
    private readonly maxAttempts = 5;
    private cooldownTimeout: number | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
        this.checkCooldown();
    }

    disconnectedCallback(): void {
        this.removeEventListeners();
        if (this.cooldownTimeout) {
            clearTimeout(this.cooldownTimeout);
        }
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 400px;
                    margin: 0 auto;
                    font-family: 'Inter', sans-serif;
                }

                .login-container {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    position: relative;
                    overflow: hidden;
                }

                .login-container::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #AAAB54, #999A4A, #AAAB54);
                    background-size: 200% 100%;
                    animation: shimmer 3s ease-in-out infinite;
                }

                @keyframes shimmer {
                    0%, 100% { background-position: 200% 0; }
                    50% { background-position: -200% 0; }
                }

                .header {
                    text-align: center;
                    margin-bottom: 32px;
                    position: relative;
                }

                .title {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 8px 0;
                    letter-spacing: -0.5px;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .subtitle {
                    font-size: 16px;
                    color: #666;
                    margin: 0 0 20px 0;
                    font-weight: 400;
                }

                .firebase-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 12px;
                    background: linear-gradient(135deg, rgba(66, 133, 244, 0.1), rgba(52, 168, 83, 0.1));
                    border: 1px solid rgba(66, 133, 244, 0.2);
                    border-radius: 20px;
                    font-size: 12px;
                    color: #4285f4;
                    font-weight: 600;
                }

                .firebase-icon {
                    width: 12px;
                    height: 12px;
                    background: linear-gradient(135deg, #4285f4, #34a853);
                    border-radius: 50%;
                }

                .form-group {
                    margin-bottom: 24px;
                    position: relative;
                }

                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }

                .form-input {
                    width: 100%;
                    padding: 16px 20px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                    font-family: inherit;
                    background: #fafafa;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #AAAB54;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(170, 171, 84, 0.1);
                    transform: translateY(-2px);
                }

                .form-input.error {
                    border-color: #dc2626;
                    background: #fef2f2;
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .password-container {
                    position: relative;
                }

                .password-toggle {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 8px;
                    color: #666;
                    transition: all 0.2s ease;
                    border-radius: 6px;
                }

                .password-toggle:hover {
                    color: #AAAB54;
                    background: rgba(170, 171, 84, 0.1);
                }

                .error-message {
                    display: none;
                    margin-top: 8px;
                    padding: 12px 16px;
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    color: #dc2626;
                    font-size: 14px;
                    font-weight: 500;
                    animation: slideDown 0.3s ease;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .error-message.visible {
                    display: block;
                }

                .submit-button {
                    width: 100%;
                    padding: 18px;
                    background: linear-gradient(135deg, #AAAB54, #999A4A);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    font-family: inherit;
                    margin-bottom: 24px;
                    overflow: hidden;
                }

                .submit-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s ease;
                }

                .submit-button:hover:not(:disabled)::before {
                    left: 100%;
                }

                .submit-button:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(170, 171, 84, 0.4);
                }

                .submit-button:active:not(:disabled) {
                    transform: translateY(-1px);
                }

                .submit-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .submit-button.loading {
                    color: transparent;
                }

                .loading-spinner {
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 24px;
                    height: 24px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s linear infinite;
                }

                .submit-button.loading .loading-spinner {
                    display: block;
                }

                @keyframes spin {
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }

                .divider {
                    text-align: center;
                    margin: 24px 0;
                    position: relative;
                    color: #999;
                    font-size: 14px;
                }

                .divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
                    z-index: 1;
                }

                .divider span {
                    background: white;
                    padding: 0 20px;
                    position: relative;
                    z-index: 2;
                }

                .register-link {
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }

                .register-link button {
                    background: none;
                    border: none;
                    color: #AAAB54;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: inherit;
                    font-family: inherit;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: all 0.2s ease;
                }

                .register-link button:hover {
                    color: #999A4A;
                    background: rgba(170, 171, 84, 0.1);
                    transform: translateY(-1px);
                }

                .attempts-warning {
                    display: none;
                    margin-bottom: 20px;
                    padding: 16px;
                    background: linear-gradient(135deg, #fef3cd, #fde68a);
                    border: 1px solid #f6e05e;
                    border-radius: 12px;
                    color: #92400e;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: center;
                    animation: slideDown 0.3s ease;
                }

                .attempts-warning.visible {
                    display: block;
                }

                .success-message {
                    display: none;
                    margin-bottom: 20px;
                    padding: 16px;
                    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
                    border: 1px solid #6ee7b7;
                    border-radius: 12px;
                    color: #047857;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: center;
                    animation: slideDown 0.3s ease;
                }

                .success-message.visible {
                    display: block;
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .login-container {
                        padding: 24px;
                        margin: 16px;
                        border-radius: 16px;
                    }

                    .title {
                        font-size: 28px;
                    }

                    .form-input {
                        padding: 14px 16px;
                        font-size: 16px;
                    }

                    .submit-button {
                        padding: 16px;
                        font-size: 16px;
                    }
                }
            </style>

            <div class="login-container">
                <div class="header">
                    <h1 class="title">Iniciar Sesión</h1>
                    <p class="subtitle">Accede a tu cuenta de Lulada</p>
                    <div class="firebase-badge">
                        <div class="firebase-icon"></div>
                        <span>Seguro con Firebase</span>
                    </div>
                </div>

                <div class="success-message" id="success-message">
                    ✅ ¡Iniciando sesión exitosamente!
                </div>

                <div class="attempts-warning" id="attempts-warning">
                    ⚠️ <strong>Demasiados intentos.</strong> Espera <span id="countdown">60</span> segundos.
                </div>

                <form id="login-form" novalidate>
                    <div class="form-group">
                        <label for="email" class="form-label">📧 Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-input"
                            placeholder="tu@email.com"
                            autocomplete="email"
                            required
                        >
                        <div class="error-message" id="email-error"></div>
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">🔒 Contraseña</label>
                        <div class="password-container">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                class="form-input"
                                placeholder="Tu contraseña"
                                autocomplete="current-password"
                                required
                            >
                            <button type="button" class="password-toggle" id="password-toggle">
                                👁️
                            </button>
                        </div>
                        <div class="error-message" id="password-error"></div>
                    </div>

                    <button type="submit" class="submit-button" id="submit-button">
                        <span>Iniciar Sesión</span>
                        <div class="loading-spinner"></div>
                    </button>
                </form>

                <div class="divider">
                    <span>¿No tienes cuenta?</span>
                </div>

                <div class="register-link">
                    <button type="button" id="register-link">Crear cuenta nueva</button>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const form = this.shadowRoot.getElementById('login-form') as HTMLFormElement;
        const passwordToggle = this.shadowRoot.getElementById('password-toggle') as HTMLButtonElement;
        const registerLink = this.shadowRoot.getElementById('register-link') as HTMLButtonElement;
        const emailInput = this.shadowRoot.getElementById('email') as HTMLInputElement;
        const passwordInput = this.shadowRoot.getElementById('password') as HTMLInputElement;

        // Envío del formulario
        form?.addEventListener('submit', this.handleSubmit.bind(this));

        // Toggle de contraseña
        passwordToggle?.addEventListener('click', this.togglePasswordVisibility.bind(this));

        // Link de registro
        registerLink?.addEventListener('click', this.handleRegisterClick.bind(this));

        // Validación en tiempo real
        emailInput?.addEventListener('blur', () => this.validateField('email'));
        passwordInput?.addEventListener('blur', () => this.validateField('password'));
        emailInput?.addEventListener('input', () => this.clearFieldError('email'));
        passwordInput?.addEventListener('input', () => this.clearFieldError('password'));

        // Enter key en campos
        emailInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') passwordInput?.focus();
        });
        passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSubmit(e);
        });
    }

    private removeEventListeners(): void {
        if (!this.shadowRoot) return;
        
        const form = this.shadowRoot.getElementById('login-form') as HTMLFormElement;
        const passwordToggle = this.shadowRoot.getElementById('password-toggle') as HTMLButtonElement;
        const registerLink = this.shadowRoot.getElementById('register-link') as HTMLButtonElement;

        form?.removeEventListener('submit', this.handleSubmit.bind(this));
        passwordToggle?.removeEventListener('click', this.togglePasswordVisibility.bind(this));
        registerLink?.removeEventListener('click', this.handleRegisterClick.bind(this));
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        
        if (this.isLoading || this.isInCooldown()) {
            return;
        }

        const formData = this.getFormData();
        const validation = this.validateForm(formData);

        if (!validation.isValid) {
            this.showValidationErrors(validation.errors);
            return;
        }

        this.setLoadingState(true);

        try {
            const result = await loginUser(formData.email, formData.password);

            if (result.success && result.user) {
                this.handleLoginSuccess(result.user.displayName || result.user.email || 'Usuario');
                this.loginAttempts = 0; // Reset en éxito
            } else {
                this.handleLoginError(result.error || 'Error desconocido');
                this.loginAttempts++;
                
                if (this.loginAttempts >= this.maxAttempts) {
                    this.startCooldown();
                }
            }
        } catch (error) {
            console.error('Error en login:', error);
            this.handleLoginError('Error de conexión. Verifica tu internet.');
            this.loginAttempts++;
        } finally {
            this.setLoadingState(false);
        }
    }

    private getFormData(): LoginFormData {
        const email = (this.shadowRoot?.getElementById('email') as HTMLInputElement)?.value.trim() || '';
        const password = (this.shadowRoot?.getElementById('password') as HTMLInputElement)?.value || '';
        return { email, password };
    }

    private validateForm(data: LoginFormData): ValidationResult {
        const errors: { [key: string]: string } = {};

        // Validación email
        if (!data.email) {
            errors.email = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Formato de correo inválido';
        }

        // Validación password
        if (!data.password) {
            errors.password = 'La contraseña es requerida';
        } else if (data.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    private showValidationErrors(errors: { [key: string]: string }): void {
        for (const [field, message] of Object.entries(errors)) {
            this.showFieldError(field, message);
        }
    }

    private showFieldError(field: string, message: string): void {
        const input = this.shadowRoot?.getElementById(field) as HTMLInputElement;
        const errorDiv = this.shadowRoot?.getElementById(`${field}-error`) as HTMLElement;

        if (input && errorDiv) {
            input.classList.add('error');
            errorDiv.textContent = message;
            errorDiv.classList.add('visible');
        }
    }

    private clearFieldError(field: string): void {
        const input = this.shadowRoot?.getElementById(field) as HTMLInputElement;
        const errorDiv = this.shadowRoot?.getElementById(`${field}-error`) as HTMLElement;

        if (input && errorDiv) {
            input.classList.remove('error');
            errorDiv.classList.remove('visible');
        }
    }

    private validateField(field: string): void {
        const formData = this.getFormData();
        const validation = this.validateForm(formData);

        if (validation.errors[field]) {
            this.showFieldError(field, validation.errors[field]);
        } else {
            this.clearFieldError(field);
        }
    }

    private setLoadingState(loading: boolean): void {
        this.isLoading = loading;
        const button = this.shadowRoot?.getElementById('submit-button') as HTMLButtonElement;
        const form = this.shadowRoot?.getElementById('login-form') as HTMLFormElement;

        if (button && form) {
            if (loading) {
                button.classList.add('loading');
                button.disabled = true;
                form.style.pointerEvents = 'none';
            } else {
                button.classList.remove('loading');
                button.disabled = this.isInCooldown();
                form.style.pointerEvents = 'auto';
            }
        }
    }

    private handleLoginSuccess(displayName: string): void {
        const successMsg = this.shadowRoot?.getElementById('success-message') as HTMLElement;
        if (successMsg) {
            successMsg.classList.add('visible');
        }

        // Toast de éxito
        this.showToast(`¡Bienvenido ${displayName}!`, 'success');

        // Redirigir después de un breve delay
        setTimeout(() => {
            const navEvent = new CustomEvent('navigate', {
                detail: '/home',
                bubbles: true,
                composed: true
            });
            document.dispatchEvent(navEvent);
        }, 1500);
    }

    private handleLoginError(errorMessage: string): void {
        // Mapear errores de Firebase a mensajes user-friendly
        const friendlyErrors: { [key: string]: string } = {
            'auth/user-not-found': 'No existe una cuenta con este correo',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/invalid-email': 'Formato de correo inválido',
            'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
            'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
            'auth/invalid-credential': 'Credenciales incorrectas. Verifica tus datos'
        };

        const userMessage = friendlyErrors[errorMessage] || errorMessage;
        this.showToast(userMessage, 'error');

        // Mostrar error específico si es de contraseña o email
        if (errorMessage.includes('password') || errorMessage.includes('wrong-password')) {
            this.showFieldError('password', 'Contraseña incorrecta');
        } else if (errorMessage.includes('email') || errorMessage.includes('user-not-found')) {
            this.showFieldError('email', 'Usuario no encontrado');
        }
    }

    private togglePasswordVisibility(): void {
        const passwordInput = this.shadowRoot?.getElementById('password') as HTMLInputElement;
        const toggle = this.shadowRoot?.getElementById('password-toggle') as HTMLButtonElement;

        if (passwordInput && toggle) {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggle.textContent = isPassword ? '🙈' : '👁️';
        }
    }

    private handleRegisterClick(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/register',
            bubbles: true,
            composed: true
        });
        document.dispatchEvent(navEvent);
    }

    private isInCooldown(): boolean {
        return this.loginAttempts >= this.maxAttempts;
    }

    private checkCooldown(): void {
        const lastAttempt = localStorage.getItem('lastLoginAttempt');
        const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
        
        if (lastAttempt && attempts >= this.maxAttempts) {
            const timePassed = Date.now() - parseInt(lastAttempt);
            if (timePassed < 60000) { // 60 segundos
                this.loginAttempts = attempts;
                this.startCooldown(60 - Math.floor(timePassed / 1000));
            } else {
                // Reset después del cooldown
                localStorage.removeItem('lastLoginAttempt');
                localStorage.removeItem('loginAttempts');
            }
        }
    }

    private startCooldown(seconds = 60): void {
        localStorage.setItem('lastLoginAttempt', Date.now().toString());
        localStorage.setItem('loginAttempts', this.loginAttempts.toString());

        const warningDiv = this.shadowRoot?.getElementById('attempts-warning') as HTMLElement;
        const countdownSpan = this.shadowRoot?.getElementById('countdown') as HTMLElement;
        const submitButton = this.shadowRoot?.getElementById('submit-button') as HTMLButtonElement;

        if (warningDiv && countdownSpan && submitButton) {
            warningDiv.classList.add('visible');
            submitButton.disabled = true;

            let remaining = seconds;
            const interval = setInterval(() => {
                countdownSpan.textContent = remaining.toString();
                remaining--;

                if (remaining < 0) {
                    clearInterval(interval);
                    warningDiv.classList.remove('visible');
                    submitButton.disabled = false;
                    this.loginAttempts = 0;
                    localStorage.removeItem('lastLoginAttempt');
                    localStorage.removeItem('loginAttempts');
                }
            }, 1000);
        }
    }

    private showToast(message: string, type: 'success' | 'error'): void {
        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, ${isSuccess ? '#22c55e, #16a34a' : '#dc2626, #b91c1c'});
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 10001;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px ${isSuccess ? 'rgba(34, 197, 94, 0.3)' : 'rgba(220, 38, 38, 0.3)'};
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 300px;
        `;
        
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">${isSuccess ? '✅' : '❌'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 4000);
    }

    // Método público para debug
    public debugInfo(): void {
        console.log('🔐 LoginForm Debug:');
        console.log('- Intentos de login:', this.loginAttempts);
        console.log('- En cooldown:', this.isInCooldown());
        console.log('- Estado de carga:', this.isLoading);
        console.log('- Formulario válido:', this.validateForm(this.getFormData()).isValid);
    }
}

export default LoginForm;