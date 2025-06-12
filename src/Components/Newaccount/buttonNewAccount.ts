// src/Components/Newaccount/buttonNewAccount.ts - Versión corregida y simplificada
import { registerUser } from '../../Services/firebase/Authservice';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    userType: 'person' | 'restaurant';
}

interface ValidationResult {
    isValid: boolean;
}

class ButtonNewAccount extends HTMLElement {
    private isLoading = false;
    private formData: Partial<RegisterFormData> = {};

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback(): void {
        // Los event listeners se limpian automáticamente
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

                .form-container {
                    background: white;
                    border-radius: 16px;
                    padding: 32px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 8px 0;
                    text-align: center;
                }

                .subtitle {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 24px 0;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 600;
                    color: #333;
                    font-size: 14px;
                }

                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    font-size: 16px;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #AAAB54;
                }

                .form-input.error {
                    border-color: #dc2626;
                }

                .error-message {
                    display: none;
                    margin-top: 6px;
                    padding: 8px 12px;
                    background: #fef2f2;
                    border-radius: 6px;
                    color: #dc2626;
                    font-size: 12px;
                }

                .error-message.visible {
                    display: block;
                }

                .user-type-selector {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .user-type-option {
                    padding: 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s ease;
                }

                .user-type-option:hover {
                    border-color: #AAAB54;
                }

                .user-type-option.selected {
                    border-color: #AAAB54;
                    background: rgba(170, 171, 84, 0.1);
                }

                .user-type-title {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }

                .user-type-desc {
                    font-size: 12px;
                    color: #666;
                }

                .btn {
                    width: 100%;
                    padding: 14px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    margin-bottom: 12px;
                }

                .btn-primary {
                    background: #AAAB54;
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background: #999A4A;
                }

                .btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .login-link {
                    text-align: center;
                    font-size: 14px;
                    color: #666;
                }

                .login-link button {
                    background: none;
                    border: none;
                    color: #AAAB54;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: inherit;
                    font-family: inherit;
                }

                .login-link button:hover {
                    color: #999A4A;
                }
            </style>

            <div class="form-container">
                <h1 class="title">Crear Cuenta</h1>
                <p class="subtitle">Únete a la comunidad de Lulada</p>

                <div class="form-group">
                    <label for="firstName" class="form-label">Nombre</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        class="form-input"
                        placeholder="Tu nombre"
                        required
                    >
                    <div class="error-message" id="firstName-error"></div>
                </div>

                <div class="form-group">
                    <label for="lastName" class="form-label">Apellido</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        class="form-input"
                        placeholder="Tu apellido"
                        required
                    >
                    <div class="error-message" id="lastName-error"></div>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="form-input"
                        placeholder="tu@email.com"
                        required
                    >
                    <div class="error-message" id="email-error"></div>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-input"
                        placeholder="Mínimo 6 caracteres"
                        required
                    >
                    <div class="error-message" id="password-error"></div>
                </div>

                <div class="form-group">
                    <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        class="form-input"
                        placeholder="Confirma tu contraseña"
                        required
                    >
                    <div class="error-message" id="confirmPassword-error"></div>
                </div>

                <div class="form-group">
                    <label class="form-label">Tipo de cuenta</label>
                    <div class="user-type-selector">
                        <div class="user-type-option" data-type="person">
                            <div class="user-type-title">Personal</div>
                            <div class="user-type-desc">Para usuarios</div>
                        </div>
                        <div class="user-type-option" data-type="restaurant">
                            <div class="user-type-title">Restaurante</div>
                            <div class="user-type-desc">Para propietarios</div>
                        </div>
                    </div>
                    <div class="error-message" id="userType-error"></div>
                </div>

                <button type="button" class="btn btn-primary" id="register-btn">
                    Crear Cuenta
                </button>

                <div class="login-link">
                    ¿Ya tienes cuenta? <button type="button" id="login-link">Inicia sesión</button>
                </div>
            </div>
        `;
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot) return;

        const registerBtn = this.shadowRoot.getElementById('register-btn') as HTMLButtonElement;
        const loginLink = this.shadowRoot.getElementById('login-link') as HTMLButtonElement;
        const userTypeOptions = this.shadowRoot.querySelectorAll('.user-type-option');

        registerBtn?.addEventListener('click', this.handleRegister.bind(this));
        loginLink?.addEventListener('click', this.handleLoginClick.bind(this));

        // Selección de tipo de usuario
        userTypeOptions.forEach(option => {
            option.addEventListener('click', () => {
                userTypeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                this.formData.userType = option.getAttribute('data-type') as 'person' | 'restaurant';
                this.clearFieldError('userType');
            });
        });

        // Validación en tiempo real
        const inputs = this.shadowRoot.querySelectorAll('.form-input');
        inputs.forEach(input => {
            const inputElement = input as HTMLInputElement;
            inputElement.addEventListener('input', () => {
                this.clearFieldError(inputElement.name);
            });
        });
    }

    private async handleRegister(): Promise<void> {
        if (!this.validateForm()) {
            return;
        }

        this.setLoadingState(true);

        try {
            const result = await registerUser(
                this.formData.email!,
                this.formData.password!,
                this.formData.firstName!,
                this.formData.lastName!,
                this.formData.userType!
            );

            if (result.success && result.user) {
                this.handleRegistrationSuccess();
            } else {
                this.handleRegistrationError(result.error || 'Error desconocido');
            }
        } catch {
            this.handleRegistrationError('Error de conexión');
        } finally {
            this.setLoadingState(false);
        }
    }

    private validateForm(): boolean {
        const firstName = (this.shadowRoot?.getElementById('firstName') as HTMLInputElement)?.value.trim() || '';
        const lastName = (this.shadowRoot?.getElementById('lastName') as HTMLInputElement)?.value.trim() || '';
        const email = (this.shadowRoot?.getElementById('email') as HTMLInputElement)?.value.trim() || '';
        const password = (this.shadowRoot?.getElementById('password') as HTMLInputElement)?.value || '';
        const confirmPassword = (this.shadowRoot?.getElementById('confirmPassword') as HTMLInputElement)?.value || '';

        let isValid = true;

        // Validar nombre
        if (!firstName) {
            this.showFieldError('firstName', 'El nombre es requerido');
            isValid = false;
        } else if (firstName.length < 2) {
            this.showFieldError('firstName', 'Mínimo 2 caracteres');
            isValid = false;
        }

        // Validar apellido
        if (!lastName) {
            this.showFieldError('lastName', 'El apellido es requerido');
            isValid = false;
        } else if (lastName.length < 2) {
            this.showFieldError('lastName', 'Mínimo 2 caracteres');
            isValid = false;
        }

        // Validar email
        if (!email) {
            this.showFieldError('email', 'El correo es requerido');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            this.showFieldError('email', 'Formato de correo inválido');
            isValid = false;
        }

        // Validar contraseña
        if (!password) {
            this.showFieldError('password', 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('password', 'Mínimo 6 caracteres');
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (!confirmPassword) {
            this.showFieldError('confirmPassword', 'Confirma tu contraseña');
            isValid = false;
        } else if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Las contraseñas no coinciden');
            isValid = false;
        }

        // Validar tipo de usuario
        if (!this.formData.userType) {
            this.showFieldError('userType', 'Selecciona el tipo de cuenta');
            isValid = false;
        }

        // Guardar datos si es válido
        if (isValid) {
            this.formData = {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                userType: this.formData.userType!
            };
        }

        return isValid;
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

    private setLoadingState(loading: boolean): void {
        this.isLoading = loading;
        const registerBtn = this.shadowRoot?.getElementById('register-btn') as HTMLButtonElement;

        if (registerBtn) {
            registerBtn.disabled = loading;
            registerBtn.textContent = loading ? 'Creando cuenta...' : 'Crear Cuenta';
        }
    }

    private handleRegistrationSuccess(): void {
        this.showToast(`¡Bienvenido ${this.formData.firstName}! Cuenta creada exitosamente`, 'success');

        setTimeout(() => {
            const navEvent = new CustomEvent('navigate', {
                detail: '/home',
                bubbles: true,
                composed: true
            });
            document.dispatchEvent(navEvent);
        }, 2000);
    }

    private handleRegistrationError(errorMessage: string): void {
        const friendlyErrors: { [key: string]: string } = {
            'auth/email-already-in-use': 'Ya existe una cuenta con este correo',
            'auth/invalid-email': 'El correo electrónico es inválido',
            'auth/weak-password': 'La contraseña es muy débil',
            'auth/operation-not-allowed': 'El registro no está habilitado'
        };

        const userMessage = friendlyErrors[errorMessage] || errorMessage;
        this.showToast(userMessage, 'error');

        if (errorMessage.includes('email')) {
            this.showFieldError('email', userMessage);
        }
    }

    private handleLoginClick(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/login',
            bubbles: true,
            composed: true
        });
        document.dispatchEvent(navEvent);
    }

    private showToast(message: string, type: 'success' | 'error'): void {
        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isSuccess ? '#22c55e' : '#dc2626'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        toast.textContent = message;
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
            }, 300);
        }, 4000);
    }

    // Métodos públicos
    public getValidationResult(): ValidationResult {
        return { isValid: this.validateForm() };
    }

    public getFormData(): Partial<RegisterFormData> {
        return { ...this.formData };
    }

    public resetForm(): void {
        this.formData = {};
        this.render();
    }

    public debugInfo(): void {
        console.log('📝 ButtonNewAccount Debug:');
        console.log('- Datos del formulario:', this.formData);
        console.log('- Estado de carga:', this.isLoading);
        console.log('- Validación:', this.getValidationResult());
    }
}

export default ButtonNewAccount;