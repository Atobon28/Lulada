// src/Components/Newaccount/buttonNewAccount.ts - REGISTRO CON FIREBASE Y ROL
class ButtonNewAccount extends HTMLElement {
    private isLoading = false;
    private currentStep = 1;

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

                    .register-container {
                        width: 100%;
                        background: transparent;
                        text-align: center;
                    }

                    .step-indicator {
                        display: flex;
                        justify-content: center;
                        margin-bottom: 30px;
                        gap: 15px;
                    }

                    .step {
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #e5e7eb;
                        transition: all 0.3s ease;
                    }

                    .step.active {
                        background: #AAAB54;
                        transform: scale(1.2);
                    }

                    .step.completed {
                        background: #16a34a;
                    }

                    .form-step {
                        display: none;
                        animation: fadeIn 0.4s ease;
                    }

                    .form-step.active {
                        display: block;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .step-title {
                        font-size: 24px;
                        font-weight: 700;
                        color: #333;
                        margin-bottom: 10px;
                        font-family: 'Poppins', sans-serif;
                    }

                    .step-subtitle {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 30px;
                    }

                    .form-group {
                        margin-bottom: 20px;
                        text-align: left;
                    }

                    .form-label {
                        display: block;
                        margin-bottom: 6px;
                        font-weight: 600;
                        color: #333;
                        font-size: 13px;
                    }

                    .form-input {
                        width: 100%;
                        padding: 12px 16px;
                        border: 2px solid #e1e5e9;
                        border-radius: 10px;
                        font-size: 15px;
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
                    }

                    .role-selection {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 30px;
                    }

                    .role-option {
                        padding: 20px 15px;
                        border: 2px solid #e1e5e9;
                        border-radius: 12px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        text-align: center;
                        background: #fafbfc;
                    }

                    .role-option:hover {
                        border-color: #AAAB54;
                        background: white;
                        transform: translateY(-2px);
                    }

                    .role-option.selected {
                        border-color: #AAAB54;
                        background: rgba(170, 171, 84, 0.1);
                        box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                    }

                    .role-icon {
                        font-size: 28px;
                        margin-bottom: 10px;
                    }

                    .role-title {
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 5px;
                        font-size: 14px;
                    }

                    .role-description {
                        font-size: 12px;
                        color: #666;
                        line-height: 1.4;
                    }

                    .action-button {
                        width: 100%;
                        padding: 14px 24px;
                        background: linear-gradient(135deg, #AAAB54, #999A4A);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 15px;
                        position: relative;
                        letter-spacing: 0.3px;
                    }

                    .action-button:hover:not(:disabled) {
                        background: linear-gradient(135deg, #999A4A, #8a8b3a);
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(170, 171, 84, 0.3);
                    }

                    .action-button:disabled {
                        background: #e5e7eb;
                        color: #9ca3af;
                        cursor: not-allowed;
                        transform: none;
                        box-shadow: none;
                    }

                    .secondary-button {
                        width: 100%;
                        padding: 12px 24px;
                        background: transparent;
                        color: #666;
                        border: 2px solid #e1e5e9;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 20px;
                    }

                    .secondary-button:hover {
                        border-color: #AAAB54;
                        color: #AAAB54;
                    }

                    .loading-spinner {
                        display: none;
                        width: 18px;
                        height: 18px;
                        border: 2px solid transparent;
                        border-top: 2px solid currentColor;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-right: 8px;
                    }

                    .loading .loading-spinner {
                        display: inline-block;
                    }

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    .error-message, .success-message {
                        padding: 10px 14px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        font-size: 13px;
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

                    .login-link {
                        color: #666;
                        font-size: 13px;
                        text-align: center;
                        margin-top: 20px;
                    }

                    .login-link a {
                        color: #AAAB54;
                        text-decoration: none;
                        font-weight: 600;
                    }

                    .login-link a:hover {
                        text-decoration: underline;
                    }

                    @media (max-width: 480px) {
                        .role-selection {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>

                <div class="register-container">
                    <!-- Indicador de pasos -->
                    <div class="step-indicator">
                        <div class="step active" id="step-1"></div>
                        <div class="step" id="step-2"></div>
                        <div class="step" id="step-3"></div>
                    </div>

                    <!-- Mensajes -->
                    <div class="error-message" id="error-message"></div>
                    <div class="success-message" id="success-message"></div>

                    <!-- Paso 1: Datos personales -->
                    <div class="form-step active" id="form-step-1">
                        <h3 class="step-title">Datos Personales</h3>
                        <p class="step-subtitle">Cuéntanos un poco sobre ti</p>

                        <div class="form-group">
                            <label class="form-label" for="firstName">Nombre</label>
                            <input type="text" id="firstName" class="form-input" placeholder="Tu nombre" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="lastName">Apellido</label>
                            <input type="text" id="lastName" class="form-input" placeholder="Tu apellido" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="email">Correo Electrónico</label>
                            <input type="email" id="email" class="form-input" placeholder="tu@email.com" required>
                        </div>

                        <button type="button" class="action-button" id="next-step-1">
                            Continuar
                        </button>

                        <div class="login-link">
                            ¿Ya tienes cuenta? <a href="#" id="login-link">Inicia sesión</a>
                        </div>
                    </div>

                    <!-- Paso 2: Contraseña -->
                    <div class="form-step" id="form-step-2">
                        <h3 class="step-title">Contraseña</h3>
                        <p class="step-subtitle">Crea una contraseña segura</p>

                        <div class="form-group">
                            <label class="form-label" for="password">Contraseña</label>
                            <input type="password" id="password" class="form-input" placeholder="Mínimo 6 caracteres" required>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="confirmPassword">Confirmar Contraseña</label>
                            <input type="password" id="confirmPassword" class="form-input" placeholder="Repite tu contraseña" required>
                        </div>

                        <button type="button" class="action-button" id="next-step-2">
                            Continuar
                        </button>

                        <button type="button" class="secondary-button" id="back-step-2">
                            ← Atrás
                        </button>
                    </div>

                    <!-- Paso 3: Seleccionar rol -->
                    <div class="form-step" id="form-step-3">
                        <h3 class="step-title">¿Cómo usarás Lulada?</h3>
                        <p class="step-subtitle">Esto nos ayuda a personalizar tu experiencia</p>

                        <div class="role-selection">
                            <div class="role-option" data-role="persona">
                                <div class="role-icon">👤</div>
                                <div class="role-title">Usuario Personal</div>
                                <div class="role-description">Buscar y reseñar restaurantes</div>
                            </div>
                            <div class="role-option" data-role="restaurante">
                                <div class="role-icon">🍽️</div>
                                <div class="role-title">Restaurante</div>
                                <div class="role-description">Gestionar mi negocio gastronómico</div>
                            </div>
                        </div>

                        <button type="button" class="action-button" id="complete-registration" disabled>
                            <div class="loading-spinner"></div>
                            <span class="button-text">Crear Cuenta</span>
                        </button>

                        <button type="button" class="secondary-button" id="back-step-3">
                            ← Atrás
                        </button>
                    </div>
                </div>
            `;
        }
    }

    private setupEventListeners(): void {
        // Navegación entre pasos
        this.shadowRoot?.getElementById('next-step-1')?.addEventListener('click', () => this.nextStep(1));
        this.shadowRoot?.getElementById('next-step-2')?.addEventListener('click', () => this.nextStep(2));
        this.shadowRoot?.getElementById('back-step-2')?.addEventListener('click', () => this.prevStep(2));
        this.shadowRoot?.getElementById('back-step-3')?.addEventListener('click', () => this.prevStep(3));

        // Selección de rol
        this.shadowRoot?.querySelectorAll('.role-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                this.selectRole(target.dataset.role as 'persona' | 'restaurante');
            });
        });

        // Registro final
        this.shadowRoot?.getElementById('complete-registration')?.addEventListener('click', () => this.handleRegistration());

        // Link de login
        this.shadowRoot?.getElementById('login-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateToLogin();
        });
    }

    private nextStep(currentStep: number): void {
        if (!this.validateStep(currentStep)) return;

        this.currentStep = currentStep + 1;
        this.updateStepDisplay();
    }

    private prevStep(currentStep: number): void {
        this.currentStep = currentStep - 1;
        this.updateStepDisplay();
    }

    private validateStep(step: number): boolean {
        switch (step) {
            case 1:
                const firstName = (this.shadowRoot?.getElementById('firstName') as HTMLInputElement)?.value.trim();
                const lastName = (this.shadowRoot?.getElementById('lastName') as HTMLInputElement)?.value.trim();
                const email = (this.shadowRoot?.getElementById('email') as HTMLInputElement)?.value.trim();

                if (!firstName || !lastName || !email) {
                    this.showError('Por favor, completa todos los campos');
                    return false;
                }

                if (!this.isValidEmail(email)) {
                    this.showError('Por favor, ingresa un email válido');
                    return false;
                }
                break;

            case 2:
                const password = (this.shadowRoot?.getElementById('password') as HTMLInputElement)?.value;
                const confirmPassword = (this.shadowRoot?.getElementById('confirmPassword') as HTMLInputElement)?.value;

                if (!password || !confirmPassword) {
                    this.showError('Por favor, completa ambos campos de contraseña');
                    return false;
                }

                if (password.length < 6) {
                    this.showError('La contraseña debe tener al menos 6 caracteres');
                    return false;
                }

                if (password !== confirmPassword) {
                    this.showError('Las contraseñas no coinciden');
                    return false;
                }
                break;
        }

        return true;
    }

    private updateStepDisplay(): void {
        // Actualizar indicadores
        for (let i = 1; i <= 3; i++) {
            const stepEl = this.shadowRoot?.getElementById(`step-${i}`);
            const formEl = this.shadowRoot?.getElementById(`form-step-${i}`);

            if (i < this.currentStep) {
                stepEl?.classList.add('completed');
                stepEl?.classList.remove('active');
            } else if (i === this.currentStep) {
                stepEl?.classList.add('active');
                stepEl?.classList.remove('completed');
            } else {
                stepEl?.classList.remove('active', 'completed');
            }

            if (i === this.currentStep) {
                formEl?.classList.add('active');
            } else {
                formEl?.classList.remove('active');
            }
        }
    }

    private selectRole(role: 'persona' | 'restaurante'): void {
        // Remover selección anterior
        this.shadowRoot?.querySelectorAll('.role-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Seleccionar nueva opción
        const selectedOption = this.shadowRoot?.querySelector(`[data-role="${role}"]`);
        selectedOption?.classList.add('selected');

        // Habilitar botón
        const completeButton = this.shadowRoot?.getElementById('complete-registration') as HTMLButtonElement;
        completeButton.disabled = false;
    }

    private async handleRegistration(): Promise<void> {
        if (this.isLoading) return;

        const selectedRole = this.shadowRoot?.querySelector('.role-option.selected')?.getAttribute('data-role') as 'persona' | 'restaurante';
        
        if (!selectedRole) {
            this.showError('Por favor, selecciona cómo usarás Lulada');
            return;
        }

        // Obtener datos del formulario
        const formData = {
            firstName: (this.shadowRoot?.getElementById('firstName') as HTMLInputElement)?.value.trim(),
            lastName: (this.shadowRoot?.getElementById('lastName') as HTMLInputElement)?.value.trim(),
            email: (this.shadowRoot?.getElementById('email') as HTMLInputElement)?.value.trim(),
            password: (this.shadowRoot?.getElementById('password') as HTMLInputElement)?.value,
            role: selectedRole
        };

        this.setLoading(true);

        try {
            // Intentar registro con Firebase
            const firebaseSuccess = await this.attemptFirebaseRegistration(formData);
            
            if (firebaseSuccess) {
                this.showSuccess('¡Cuenta creada exitosamente con Firebase!');
                setTimeout(() => this.navigateToProfile(), 1500);
                return;
            }

            // Fallback: registro local
            await this.attemptLocalRegistration(formData);
            
        } catch (error) {
            console.error('Error en registro:', error);
            this.showError('Error al crear la cuenta. Intenta de nuevo.');
        } finally {
            this.setLoading(false);
        }
    }

    private async attemptFirebaseRegistration(formData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: 'persona' | 'restaurante';
    }): Promise<boolean> {
        try {
            const { registerUser } = await import('../../Services/firebase/Authservice');
            
            // CORREGIDO: Preparar userData para Firebase (3er parámetro)
            const userData = {
                foto: "https://randomuser.me/api/portraits/women/44.jpg",
                nombreDeUsuario: `@${formData.email.split('@')[0]}`,
                nombre: `${formData.firstName} ${formData.lastName}`,
                descripcion: formData.role === 'restaurante' 
                    ? "Propietario de restaurante en Lulada" 
                    : "Usuario de Lulada",
                locationText: "",
                menuLink: "",
                rol: formData.role
            };
            
            // CORREGIDO: Pasar los 3 argumentos requeridos
            const result = await registerUser(formData.email, formData.password, userData);
            
            if (result.success && result.user) {
                console.log('✅ Registro exitoso con Firebase:', result.user.email);
                
                // Guardar datos completos del usuario
                const userStorageData = {
                    email: result.user.email,
                    name: `${formData.firstName} ${formData.lastName}`,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    uid: result.user.uid,
                    role: formData.role
                };
                
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify(userStorageData));
                
                // Disparar evento de selección de rol
                document.dispatchEvent(new CustomEvent('user-role-selected', {
                    detail: { role: formData.role },
                    bubbles: true
                }));
                
                return true;
            } else {
                if (result.error) {
                    this.showError(result.error);
                }
                return false;
            }
            
        } catch (error) {
            console.log('⚠️ Firebase no disponible, usando registro local');
            return false;
        }
    }

    private async attemptLocalRegistration(formData: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: 'persona' | 'restaurante';
    }): Promise<void> {
        // Simulación de registro local
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const userData = {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            uid: `local-${Date.now()}`,
            role: formData.role
        };
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Disparar evento de selección de rol
        document.dispatchEvent(new CustomEvent('user-role-selected', {
            detail: { role: formData.role },
            bubbles: true
        }));
        
        this.showSuccess('¡Cuenta creada exitosamente!');
        setTimeout(() => this.navigateToProfile(), 1500);
    }

    private navigateToProfile(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/profile',
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(navEvent);
    }

    private navigateToLogin(): void {
        const navEvent = new CustomEvent('navigate', {
            detail: '/login',
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(navEvent);
    }

    private setLoading(loading: boolean): void {
        this.isLoading = loading;
        const completeButton = this.shadowRoot?.getElementById('complete-registration') as HTMLButtonElement;
        
        if (loading) {
            completeButton?.classList.add('loading');
            completeButton.disabled = true;
        } else {
            completeButton?.classList.remove('loading');
            // Solo habilitar si hay un rol seleccionado
            const hasRoleSelected = !!this.shadowRoot?.querySelector('.role-option.selected');
            completeButton.disabled = !hasRoleSelected;
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

export default ButtonNewAccount;