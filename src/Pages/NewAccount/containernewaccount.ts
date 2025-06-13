// containernewaccount.ts - VERSIÓN CORREGIDA SIN ERRORES
// ============================================================

class RegisterNewAccount extends HTMLElement {
  private selectedRole: 'person' | 'restaurant' | '' = '';
  private isLoading = false;

  constructor() {
      super();
      this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
      this.render();
      this.setupEventListeners();
      this.addInputListeners();
  }

  render() {
      if (this.shadowRoot) {
          this.shadowRoot.innerHTML = `
              <style>
                  :host {
                      display: block;
                      font-family: 'Poppins', sans-serif;
                      width: 100%;
                      min-height: 100vh;
                      background: linear-gradient(135deg, #f5f7fa 0%, rgb(255, 255, 255) 100%);
                      overflow-x: hidden;
                  }

                  #title {
                      font-size: 24px;
                      color: #333;
                      font-weight: bold;
                      margin: 0 0 25px 0;
                      text-align: center;
                  }

                  .main {
                      width: 100%;
                      min-height: 100vh;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      padding: 20px;
                      box-sizing: border-box;
                  }

                  .logo-container {
                      margin-bottom: 20px;
                  }

                  .from-container {
                      font-family: 'Poppins', sans-serif;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      background: white;
                      padding: 40px;
                      border-radius: 20px;
                      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                      background-color: rgb(246, 245, 245);
                      width: 100%;
                      max-width: 600px;
                      box-sizing: border-box;
                  }

                  .container-input {
                      display: flex;
                      flex-direction: column;
                      gap: 12px;
                      width: 90%;
                      margin-top: 15px;
                      margin-bottom: 25px;
                  }

                  .input-wrapper {
                      position: relative;
                      margin-bottom: 5px;
                  }

                  .custom-input {
                      width: 100%;
                      padding: 14px 16px;
                      border: 2px solid #ddd;
                      border-radius: 10px;
                      font-size: 15px;
                      font-family: 'Poppins', sans-serif;
                      transition: all 0.3s ease;
                      box-sizing: border-box;
                      background: white;
                  }

                  .custom-input:focus {
                      outline: none;
                      border-color: #AAAB54;
                      box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                      transform: translateY(-1px);
                  }

                  .custom-input:disabled {
                      background-color: #f5f5f5;
                      cursor: not-allowed;
                  }

                  .custom-input::placeholder {
                      color: #999;
                  }

                  .role-selection {
                      width: 90%;
                      margin: 25px 0;
                  }

                  .role-title {
                      font-size: 16px;
                      color: #333;
                      font-weight: 600;
                      margin-bottom: 20px;
                      text-align: center;
                  }

                  .options-container {
                      display: flex;
                      flex-direction: column;
                      gap: 12px;
                      width: 100%;
                  }

                  .option-label {
                      display: flex;
                      align-items: center;
                      font-size: 16px;
                      color: #333;
                      cursor: pointer;
                      padding: 18px 20px;
                      border: 2px solid #e0e0e0;
                      border-radius: 12px;
                      transition: all 0.3s ease;
                      background: white;
                      position: relative;
                      overflow: hidden;
                  }

                  .option-label::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: -100%;
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(90deg, transparent, rgba(170, 171, 84, 0.1), transparent);
                      transition: left 0.6s ease;
                  }

                  .option-label:hover::before {
                      left: 100%;
                  }

                  .option-label:hover {
                      border-color: #AAAB54;
                      box-shadow: 0 4px 15px rgba(170, 171, 84, 0.2);
                      transform: translateY(-2px);
                  }

                  .option-label.selected {
                      border-color: #AAAB54;
                      background: linear-gradient(135deg, rgba(170, 171, 84, 0.1), rgba(170, 171, 84, 0.05));
                      box-shadow: 0 4px 15px rgba(170, 171, 84, 0.3);
                      transform: translateY(-1px);
                  }

                  .custom-checkbox {
                      width: 22px;
                      height: 22px;
                      border: 2px solid #ccc;
                      border-radius: 6px;
                      margin-right: 15px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      transition: all 0.3s ease;
                      flex-shrink: 0;
                      position: relative;
                  }

                  .checkbox-input:checked + .custom-checkbox {
                      background: linear-gradient(135deg, #AAAB54, #9a9b4a);
                      border-color: #AAAB54;
                      transform: scale(1.1);
                  }

                  .checkbox-input:checked + .custom-checkbox::after {
                      content: '✓';
                      color: white;
                      font-weight: bold;
                      font-size: 14px;
                      animation: checkmark 0.3s ease-in-out;
                  }

                  @keyframes checkmark {
                      0% { transform: scale(0); }
                      50% { transform: scale(1.2); }
                      100% { transform: scale(1); }
                  }

                  .checkbox-input {
                      display: none;
                  }

                  .continue-btn {
                      background: linear-gradient(135deg, #E0A800, #CC9600);
                      color: white;
                      border: none;
                      padding: 16px 32px;
                      width: 80%;
                      cursor: pointer;
                      border-radius: 12px;
                      margin-top: 20px;
                      font-size: 16px;
                      font-weight: 600;
                      transition: all 0.3s ease;
                      position: relative;
                      overflow: hidden;
                  }

                  .continue-btn:hover:not(:disabled) {
                      background: linear-gradient(135deg, #CC9600, #B88500);
                      transform: translateY(-2px);
                      box-shadow: 0 6px 20px rgba(224, 168, 0, 0.4);
                  }

                  .continue-btn:disabled {
                      background: #ccc;
                      cursor: not-allowed;
                      transform: none;
                      box-shadow: none;
                  }

                  .continue-btn.loading {
                      pointer-events: none;
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

                  .continue-btn.loading .loading-spinner {
                      display: inline-block;
                  }

                  @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                  }

                  .message {
                      margin-top: 15px;
                      padding: 12px 16px;
                      border-radius: 8px;
                      text-align: center;
                      font-size: 14px;
                      display: none;
                      animation: slideIn 0.3s ease-out;
                  }

                  .error-message {
                      background-color: #ffebee;
                      color: #c62828;
                      border: 1px solid #e57373;
                      border-left: 4px solid #f44336;
                  }

                  .success-message {
                      background-color: #e8f5e8;
                      color: #2e7d32;
                      border: 1px solid #81c784;
                      border-left: 4px solid #4caf50;
                  }

                  .show-message {
                      display: block !important;
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

                  .loading {
                      display: none;
                      margin-top: 15px;
                      text-align: center;
                      color: #666;
                      font-size: 14px;
                      font-weight: 500;
                  }

                  .loading.show {
                      display: block;
                  }

                  .line {
                      width: 90%;
                      height: 1px;
                      background: linear-gradient(to right, transparent, #ddd, transparent);
                      margin: 30px 0 20px 0;
                      position: relative;
                  }

                  .line::after {
                      content: 'o';
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      background: rgb(246, 245, 245);
                      padding: 0 15px;
                      color: #999;
                      font-size: 14px;
                  }

                  .container-new-account {
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      gap: 15px;
                  }

                  .container-new-account p {
                      margin: 0;
                      color: #333;
                      font-size: 15px;
                      font-weight: 500;
                  }

                  .login-btn {
                      background: linear-gradient(135deg, #AAAB54, #9a9b4a);
                      color: white;
                      border: none;
                      padding: 12px 24px;
                      border-radius: 8px;
                      cursor: pointer;
                      font-size: 15px;
                      font-weight: 600;
                      transition: all 0.3s ease;
                  }

                  .login-btn:hover {
                      background: linear-gradient(135deg, #9a9b4a, #8a8b3a);
                      transform: translateY(-1px);
                      box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3);
                  }

                  /* Responsive */
                  @media (max-width: 768px) {
                      .main { padding: 15px; }
                      .from-container { padding: 30px 25px; max-width: 100%; }
                      .container-input { width: 100%; }
                      .role-selection { width: 100%; }
                      .continue-btn { width: 100%; }
                      #title { font-size: 20px; }
                  }

                  @media (max-width: 480px) {
                      .main { padding: 10px; }
                      .from-container { padding: 25px 20px; }
                      .option-label { padding: 15px; font-size: 15px; }
                      .custom-input { padding: 12px; font-size: 14px; }
                  }
              </style>

              <div class="main">
                  <div class="logo-container">
                      <lulada-logo></lulada-logo>
                  </div>
                  
                  <div class="from-container">
                      <h2 id="title">Crear Cuenta</h2>
                      
                      <form id="register-form" novalidate>
                          <div class="container-input">
                              <div class="input-wrapper">
                                  <input type="text" class="custom-input" id="firstName" placeholder="Nombre" required autocomplete="given-name">
                              </div>
                              <div class="input-wrapper">
                                  <input type="text" class="custom-input" id="lastName" placeholder="Apellido" required autocomplete="family-name">
                              </div>
                              <div class="input-wrapper">
                                  <input type="email" class="custom-input" id="email" placeholder="Correo Electrónico" required autocomplete="email">
                              </div>
                              <div class="input-wrapper">
                                  <input type="password" class="custom-input" id="password" placeholder="Contraseña (mín. 6 caracteres)" required autocomplete="new-password" minlength="6">
                              </div>
                          </div>

                          <div class="role-selection">
                              <div class="role-title">¿Cómo quieres usar Lulada?</div>
                              <div class="options-container">
                                  <label class="option-label" for="person-checkbox">
                                      <input type="checkbox" class="checkbox-input" id="person-checkbox" name="userType" value="person">
                                      <span class="custom-checkbox"></span>
                                      <div>
                                          <div style="font-weight: 600;">Persona</div>
                                          <div style="font-size: 13px; color: #666; margin-top: 4px;">Descubre y califica restaurantes</div>
                                      </div>
                                  </label>
                                  
                                  <label class="option-label" for="restaurant-checkbox">
                                      <input type="checkbox" class="checkbox-input" id="restaurant-checkbox" name="userType" value="restaurant">
                                      <span class="custom-checkbox"></span>
                                      <div>
                                          <div style="font-weight: 600;">Restaurante</div>
                                          <div style="font-size: 13px; color: #666; margin-top: 4px;">Promociona tu negocio gastronómico</div>
                                      </div>
                                  </label>
                              </div>
                          </div>

                          <button type="submit" class="continue-btn" id="continue-button" disabled>
                              <div class="loading-spinner"></div>
                              <span class="button-text">Crear Cuenta</span>
                          </button>
                      </form>
                      
                      <!-- Elementos de feedback -->
                      <div class="loading" id="loading">Creando tu cuenta...</div>
                      <div class="message error-message" id="error-message"></div>
                      <div class="message success-message" id="success-message"></div>
                      
                      <div class="line"></div>
                      
                      <div class="container-new-account">
                          <p>¿Ya tienes una cuenta?</p>
                          <button type="button" class="login-btn" id="login-button">Iniciar Sesión</button>
                      </div>
                  </div>
              </div>
          `;
      }
  }

  setupEventListeners() {
      if (!this.shadowRoot) return;
      
      const form = this.shadowRoot.getElementById('register-form') as HTMLFormElement;
      const personCheckbox = this.shadowRoot.getElementById('person-checkbox') as HTMLInputElement;
      const restaurantCheckbox = this.shadowRoot.getElementById('restaurant-checkbox') as HTMLInputElement;
      const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
      const loginButton = this.shadowRoot.getElementById('login-button') as HTMLButtonElement;

      // ✅ VERIFICACIÓN DE ELEMENTOS ANTES DE AGREGAR LISTENERS
      if (!form || !personCheckbox || !restaurantCheckbox || !continueButton || !loginButton) {
          console.error('RegisterNewAccount: No se encontraron todos los elementos necesarios');
          return;
      }

      // Manejar envío del formulario
      form.addEventListener('submit', async (e) => {
          e.preventDefault();
          await this.handleRegister();
      });

      // Evento para selección de "Persona"
      personCheckbox.addEventListener('change', () => {
          if (personCheckbox.checked) {
              restaurantCheckbox.checked = false;
              this.selectedRole = 'person';
              personCheckbox.closest('.option-label')?.classList.add('selected');
              restaurantCheckbox.closest('.option-label')?.classList.remove('selected');
          } else {
              this.selectedRole = '';
              personCheckbox.closest('.option-label')?.classList.remove('selected');
          }
          this.updateContinueButton();
      });

      // Evento para selección de "Restaurante"
      restaurantCheckbox.addEventListener('change', () => {
          if (restaurantCheckbox.checked) {
              personCheckbox.checked = false;
              this.selectedRole = 'restaurant';
              restaurantCheckbox.closest('.option-label')?.classList.add('selected');
              personCheckbox.closest('.option-label')?.classList.remove('selected');
          } else {
              this.selectedRole = '';
              restaurantCheckbox.closest('.option-label')?.classList.remove('selected');
          }
          this.updateContinueButton();
      });

      // Botón para ir al login
      loginButton.addEventListener('click', () => {
          this.navigateToLogin();
      });

      // Limpiar mensajes cuando el usuario empiece a escribir
      const inputs = this.shadowRoot.querySelectorAll('.custom-input');
      inputs.forEach(input => {
          input.addEventListener('input', () => {
              this.clearMessages();
          });
      });
  }

  addInputListeners() {
      if (!this.shadowRoot) return;
      
      // Esperar a que los elementos estén renderizados
      setTimeout(() => {
          const inputs = this.shadowRoot?.querySelectorAll('.custom-input');
          inputs?.forEach(input => {
              input.addEventListener('input', () => this.updateContinueButton());
              input.addEventListener('blur', (e) => this.validateField(e.target as HTMLInputElement));
          });
      }, 100);
  }

  // ✅ CORRECCIÓN: Función validateField sin variable errorMessage no utilizada
  private validateField(input: HTMLInputElement): void {
      const value = input.value.trim();
      let isValid = true;

      switch (input.id) {
          case 'firstName':
          case 'lastName':
              isValid = value.length >= 2;
              break;
          case 'email':
              isValid = this.isValidEmail(value);
              break;
          case 'password':
              isValid = value.length >= 6;
              break;
      }

      // Aplicar estilos visuales basados en la validación
      if (value && !isValid) {
          input.style.borderColor = '#f44336';
          input.style.boxShadow = '0 0 0 3px rgba(244, 67, 54, 0.1)';
      } else if (value && isValid) {
          input.style.borderColor = '#4caf50';
          input.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.1)';
      } else {
          input.style.borderColor = '#ddd';
          input.style.boxShadow = 'none';
      }
  }

  private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  }

  updateContinueButton() {
      if (!this.shadowRoot) return;
      
      const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
      if (!continueButton) return;
      
      const firstName = (this.shadowRoot.getElementById('firstName') as HTMLInputElement)?.value?.trim();
      const lastName = (this.shadowRoot.getElementById('lastName') as HTMLInputElement)?.value?.trim();
      const email = (this.shadowRoot.getElementById('email') as HTMLInputElement)?.value?.trim();
      const password = (this.shadowRoot.getElementById('password') as HTMLInputElement)?.value?.trim();
      
      const allFieldsFilled = firstName && lastName && email && password && this.selectedRole;
      const formValid = allFieldsFilled && 
                       firstName.length >= 2 && 
                       lastName.length >= 2 && 
                       this.isValidEmail(email) && 
                       password.length >= 6;
      
      continueButton.disabled = !formValid || this.isLoading;
  }

  async handleRegister() {
      if (!this.shadowRoot || this.isLoading) return;

      // Obtener elementos del DOM
      const firstNameInput = this.shadowRoot.getElementById('firstName') as HTMLInputElement;
      const lastNameInput = this.shadowRoot.getElementById('lastName') as HTMLInputElement;
      const emailInput = this.shadowRoot.getElementById('email') as HTMLInputElement;
      const passwordInput = this.shadowRoot.getElementById('password') as HTMLInputElement;

      // Verificar que todos los elementos existan
      if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput) {
          console.error('No se encontraron todos los elementos del formulario');
          return;
      }

      // Obtener valores
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // Validaciones
      if (!firstName || !lastName || !email || !password || !this.selectedRole) {
          this.showError('Por favor, completa todos los campos y selecciona un tipo de cuenta');
          return;
      }

      if (firstName.length < 2 || lastName.length < 2) {
          this.showError('El nombre y apellido deben tener al menos 2 caracteres');
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

      // Iniciar proceso de registro
      this.setLoading(true);
      this.clearMessages();

      try {
          console.log('Iniciando registro...', { email, firstName, lastName, userType: this.selectedRole });
          
          // Crear datos de usuario para Firebase
          const userData = {
              foto: "https://randomuser.me/api/portraits/women/44.jpg", // Foto por defecto
              nombreDeUsuario: `@${email.split('@')[0]}`, // Username basado en email
              nombre: `${firstName} ${lastName}`, // Nombre completo
              descripcion: this.selectedRole === 'restaurant' 
                  ? "Restaurante en Lulada" 
                  : "Usuario de Lulada", // Descripción por defecto
              locationText: "", // Ubicación vacía inicialmente
              menuLink: "", // Link de menú vacío inicialmente
              rol: this.selectedRole // Rol seleccionado
          };

          // Importar y usar el servicio de registro de Firebase
          const { registerUser } = await import('../../Services/firebase/Authservice');
          const response = await registerUser(email, password, userData);
          
          if (response.success && response.user && response.userData) {
              console.log('✅ Registro exitoso:', response.user.email);
              
              // Guardar datos de autenticación en localStorage
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('currentUser', JSON.stringify(response.userData));

              this.showSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
              
              // Disparar evento de autenticación exitosa
              document.dispatchEvent(new CustomEvent('auth-success', {
                  detail: {
                      user: response.user,
                      userData: response.userData
                  },
                  bubbles: true,
                  composed: true
              }));

              // Limpiar formulario
              this.clearForm();
              
              // Redirigir después de un breve delay
              setTimeout(() => {
                  document.dispatchEvent(new CustomEvent('navigate', {
                      detail: '/home',
                      bubbles: true,
                      composed: true
                  }));
              }, 2000);

          } else {
              console.error('❌ Error en registro:', response.error);
              this.showError(response.error || 'Error al registrar usuario');
          }
      } catch (error) {
          console.error('❌ Error inesperado en registro:', error);
          this.showError('Error inesperado. Intenta nuevamente');
      } finally {
          this.setLoading(false);
      }
  }

  private navigateToLogin(): void {
      console.log('Navegando a login...');
      document.dispatchEvent(new CustomEvent('navigate', {
          detail: '/login',
          bubbles: true,
          composed: true
      }));
  }

  private setLoading(loading: boolean): void {
      this.isLoading = loading;
      const continueButton = this.shadowRoot?.getElementById('continue-button') as HTMLButtonElement;
      const inputs = this.shadowRoot?.querySelectorAll('.custom-input') as NodeListOf<HTMLInputElement>;
      const checkboxes = this.shadowRoot?.querySelectorAll('.checkbox-input') as NodeListOf<HTMLInputElement>;
      const loginButton = this.shadowRoot?.getElementById('login-button') as HTMLButtonElement;

      // Actualizar botón principal
      if (continueButton) {
          continueButton.disabled = loading;
          if (loading) {
              continueButton.classList.add('loading');
          } else {
              continueButton.classList.remove('loading');
          }
      }

      // Deshabilitar todos los inputs durante el loading
      [...inputs, ...checkboxes, loginButton].forEach(element => {
          if (element) {
              element.disabled = loading;
          }
      });

      this.updateContinueButton();
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

  private clearForm(): void {
      if (!this.shadowRoot) return;
      
      const inputs = this.shadowRoot.querySelectorAll('.custom-input') as NodeListOf<HTMLInputElement>;
      inputs.forEach(input => {
          input.value = '';
          input.style.borderColor = '#ddd';
          input.style.boxShadow = 'none';
      });
      
      const checkboxes = this.shadowRoot.querySelectorAll('.checkbox-input') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(checkbox => checkbox.checked = false);
      
      const labels = this.shadowRoot.querySelectorAll('.option-label');
      labels.forEach(label => label.classList.remove('selected'));
      
      this.selectedRole = '';
      this.updateContinueButton();
  }

  // Métodos públicos para debug y uso externo
  public getSelectedRole(): string {
      return this.selectedRole;
  }

  public isFormValid(): boolean {
      if (!this.shadowRoot) return false;
      
      const firstName = (this.shadowRoot.getElementById('firstName') as HTMLInputElement)?.value?.trim();
      const lastName = (this.shadowRoot.getElementById('lastName') as HTMLInputElement)?.value?.trim();
      const email = (this.shadowRoot.getElementById('email') as HTMLInputElement)?.value?.trim();
      const password = (this.shadowRoot.getElementById('password') as HTMLInputElement)?.value?.trim();
      
      return !!(firstName && lastName && email && password && this.selectedRole &&
               firstName.length >= 2 && lastName.length >= 2 && 
               this.isValidEmail(email) && password.length >= 6);
  }

  public debug(): void {
      console.log('🔍 RegisterNewAccount Debug Info:');
      console.log('- Selected role:', this.selectedRole);
      console.log('- Is loading:', this.isLoading);
      console.log('- Form valid:', this.isFormValid());
      console.log('- Shadow DOM:', !!this.shadowRoot);
      
      if (this.shadowRoot) {
          const firstName = (this.shadowRoot.getElementById('firstName') as HTMLInputElement)?.value;
          const lastName = (this.shadowRoot.getElementById('lastName') as HTMLInputElement)?.value;
          const email = (this.shadowRoot.getElementById('email') as HTMLInputElement)?.value;
          const password = (this.shadowRoot.getElementById('password') as HTMLInputElement)?.value;
          
          console.log('- Form data:', {
              firstName: firstName?.length || 0,
              lastName: lastName?.length || 0,
              email: email || 'empty',
              passwordLength: password?.length || 0
          });
          
          // Verificar que todos los elementos críticos existan
          const elements = {
              'register-form': !!this.shadowRoot.getElementById('register-form'),
              'firstName': !!this.shadowRoot.getElementById('firstName'),
              'lastName': !!this.shadowRoot.getElementById('lastName'),
              'email': !!this.shadowRoot.getElementById('email'),
              'password': !!this.shadowRoot.getElementById('password'),
              'person-checkbox': !!this.shadowRoot.getElementById('person-checkbox'),
              'restaurant-checkbox': !!this.shadowRoot.getElementById('restaurant-checkbox'),
              'continue-button': !!this.shadowRoot.getElementById('continue-button'),
              'login-button': !!this.shadowRoot.getElementById('login-button'),
              'error-message': !!this.shadowRoot.getElementById('error-message'),
              'success-message': !!this.shadowRoot.getElementById('success-message')
          };
          
          console.log('- Elementos encontrados:', elements);
      }
  }
}

// Definir el custom element
if (!customElements.get('register-new-account')) {
  customElements.define('register-new-account', RegisterNewAccount);
}

export default RegisterNewAccount;