// Página de registro de nuevos usuarios
import { registerUser } from '../../Services/firebase/Authservice';

class RegisterNewAccount extends HTMLElement {
  //Tiene una propiedad privada selectedRole para almacenar el tipo de cuenta seleccionado
  private selectedRole: 'person' | 'restaurant' | '' = '';

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.addInputListeners();
  }

  // Dibuja la página de registro
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            font-family: 'Poppins', sans-serif;
            width: 100%;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%,rgb(255, 255, 255) 100%);
            overflow-x: hidden;
          }

          #title {
            font-size: 20px;
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

          .from-container {
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: white;
            padding: 30px;
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
            gap: 8px;
            width: 90%;
            margin-top: 10px;
            margin-bottom: 30px;
          }

          /* Estilos para los inputs personalizados */
          .input-wrapper {
            position: relative;
            margin-bottom: 15px;
          }

          .custom-input {
            width: 100%;
            padding: 12px 15px;
            border: 2px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
            font-family: 'Poppins', sans-serif;
            transition: all 0.3s ease;
            box-sizing: border-box;
          }

          .custom-input:focus {
            outline: none;
            border-color: #AAAB54;
            box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
          }

          .custom-input::placeholder {
            color: #999;
          }

          .role-selection {
            width: 90%;
            margin: 20px 0 25px 0;
          }

          .role-title {
            font-size: 14px;
            color: #333;
            font-weight: 90;
            margin-bottom: 20px;
            text-align: center;
          }

          .options-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 100%;
          }

          .option-label {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #333;
            cursor: pointer;
            padding: 15px;
            border: 2px solid rgb(255, 255, 255);
            border-radius: 12px;
            transition: all 0.3s ease;
            background: white;
          }

          .option-label:hover {
            border-color: #AAAB54;
            box-shadow: 0 4px 12px rgba(170, 171, 84, 0.2);
            transform: translateY(-2px);
          }

          .option-label.selected {
            border-color: #AAAB54;
            background-color: rgba(170, 171, 84, 0.1);
            box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3);
          }

          .custom-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 4px;
            margin-right: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
          }

          .checkbox-input:checked + .custom-checkbox {
            background-color: #AAAB54;
            border-color: #AAAB54;
          }

          .checkbox-input:checked + .custom-checkbox::after {
            content: '✓';
            color: white;
            font-weight: bold;
            font-size: 14px;
          }

          .checkbox-input {
            display: none;
          }

          .continue-btn {
            background: #E0A800;
            color: white;
            border: none;
            padding: 12px 24px;
            width: 70%;
            cursor: pointer;
            border-radius: 8px;
            margin-top: 15px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .continue-btn:hover:not(:disabled) {
            background: rgb(183, 140, 21);
            transform: translateY(-1px);
          }

          .continue-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
          }

          /* Estilos para mensajes de feedback */
          .message {
            margin-top: 15px;
            padding: 10px 15px;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
            display: none;
          }

          .error-message {
            background-color: #ffebee;
            color: #c62828;
            border: 1px solid #e57373;
          }

          .success-message {
            background-color: #e8f5e8;
            color: #2e7d32;
            border: 1px solid #81c784;
          }

          .loading {
            display: none;
            margin-top: 10px;
            text-align: center;
            color: #666;
            font-size: 14px;
          }

          .loading.show {
            display: block;
          }

          .line {
            width: 90%;
            height: 1px;
            background-color: rgb(155, 148, 148);
            margin-top: 28px;
            margin-bottom: 15px;
          }

          .container-new-account {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
          }

          .container-new-account p {
            margin: 0;
            color: black;
            font-size: 16px;
          }

          .login-btn {
            background: #AAAB54;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }

          .login-btn:hover {
            background: rgb(132, 134, 58);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .main { padding: 15px; }
            .from-container { padding: 30px 25px; max-width: 100%; }
            .container-input { width: 100%; }
            .role-selection { width: 100%; }
            .continue-btn { width: 100%; }
          }

          @media (max-width: 480px) {
            .main { padding: 10px; }
            .from-container { padding: 25px 20px; }
            .option-label { padding: 12px; font-size: 15px; }
          }
        </style>

        <div class="main">
          <lulada-logo></lulada-logo>
          
          <div class="from-container">
            <h2 id="title">Registrate</h2>
            
            <div class="container-input">
              <div class="input-wrapper">
                <input type="text" class="custom-input" id="firstName" placeholder="Nombre" required>
              </div>
              <div class="input-wrapper">
                <input type="text" class="custom-input" id="lastName" placeholder="Apellido" required>
              </div>
              <div class="input-wrapper">
                <input type="email" class="custom-input" id="email" placeholder="Correo Electrónico" required>
              </div>
              <div class="input-wrapper">
                <input type="password" class="custom-input" id="password" placeholder="Contraseña" required>
              </div>
            </div>

            <div class="role-selection">
              <div class="role-title">¿Cómo quieres usar Lulada?</div>
              <div class="options-container">
                <label class="option-label">
                  <input type="checkbox" class="checkbox-input" id="person-checkbox" name="userType" value="person">
                  <span class="custom-checkbox"></span>
                  Persona
                </label>
                
                <label class="option-label">
                  <input type="checkbox" class="checkbox-input" id="restaurant-checkbox" name="userType" value="restaurant">
                  <span class="custom-checkbox"></span>
                  Restaurante
                </label>
              </div>
            </div>

            <button class="continue-btn" id="continue-button" disabled>Continuar</button>
            
            <!-- Elementos de feedback -->
            <div class="loading" id="loading">Registrando usuario...</div>
            <div class="message error-message" id="error-message"></div>
            <div class="message success-message" id="success-message"></div>
            
            <div class="line"></div>
            
            <div class="container-new-account">
              <p>¿Ya tienes una cuenta?</p>
              <button class="login-btn" id="login-button">Iniciar sesión</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Configura eventos de la página
  setupEventListeners() {
    if (!this.shadowRoot) return;
    
    const personCheckbox = this.shadowRoot.getElementById('person-checkbox') as HTMLInputElement;
    const restaurantCheckbox = this.shadowRoot.getElementById('restaurant-checkbox') as HTMLInputElement;
    const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
    const loginButton = this.shadowRoot.getElementById('login-button') as HTMLButtonElement;

    // Evento para selección de "Persona"
    personCheckbox?.addEventListener('change', () => {
      if (personCheckbox.checked) {//Implementa selección exclusiva (solo un rol puede estar seleccionado)
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
    restaurantCheckbox?.addEventListener('change', () => {
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

    // Manejar envío del formulario
    continueButton?.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.handleRegister();
    });

    // Botón para ir al login
    loginButton?.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }
//Escucha cambios en todos los inputs
//Llama a updateContinueButton para validar el formulario
  addInputListeners() {
    if (!this.shadowRoot) return;
    
    // Esperar a que los elementos estén renderizados
    setTimeout(() => {
      const inputs = this.shadowRoot?.querySelectorAll('.custom-input');
      inputs?.forEach(input => {
        input.addEventListener('input', () => this.updateContinueButton());
      });
    }, 100);
  }
//Valida en tiempo real que todos los campos estén llenos
//Habilita/deshabilita el botón de continuar según la validación
  updateContinueButton() {
    if (!this.shadowRoot) return;
    
    const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
    if (!continueButton) return;
    
    const firstName = (this.shadowRoot.getElementById('firstName') as HTMLInputElement)?.value?.trim();
    const lastName = (this.shadowRoot.getElementById('lastName') as HTMLInputElement)?.value?.trim();
    const email = (this.shadowRoot.getElementById('email') as HTMLInputElement)?.value?.trim();
    const password = (this.shadowRoot.getElementById('password') as HTMLInputElement)?.value?.trim();
    
    const allFieldsFilled = firstName && lastName && email && password && this.selectedRole;
    continueButton.disabled = !allFieldsFilled;
  }

  async handleRegister() {
    if (!this.shadowRoot) return;

    // Obtener elementos del DOM
    const firstNameInput = this.shadowRoot.getElementById('firstName') as HTMLInputElement;
    const lastNameInput = this.shadowRoot.getElementById('lastName') as HTMLInputElement;
    const emailInput = this.shadowRoot.getElementById('email') as HTMLInputElement;
    const passwordInput = this.shadowRoot.getElementById('password') as HTMLInputElement;
    const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
    const errorMessage = this.shadowRoot.getElementById('error-message') as HTMLElement;
    const successMessage = this.shadowRoot.getElementById('success-message') as HTMLElement;
    const loading = this.shadowRoot.getElementById('loading') as HTMLElement;

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
      this.showError('Por favor, completa todos los campos y selecciona un tipo de cuenta', errorMessage);
      return;
    }

    if (password.length < 6) {
      this.showError('La contraseña debe tener al menos 6 caracteres', errorMessage);
      return;
    }

    // Mostrar loading
    continueButton.disabled = true;
    loading.classList.add('show');
    this.hideMessages();

    try {
      console.log('Iniciando registro...', { email, firstName, lastName, userType: this.selectedRole });
      
      // LLAMAR AL SERVICIO DE FIREBASE
      const response = await registerUser(email, password, firstName, lastName, this.selectedRole);
      
      if (response.success) {
        this.showSuccess('¡Registro exitoso! Redirigiendo...', successMessage);
        
        // Limpiar formulario
        this.clearForm();
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        this.showError(response.error || 'Error al registrar usuario', errorMessage);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      this.showError('Error inesperado. Intenta nuevamente', errorMessage);
    } finally {
      continueButton.disabled = false;
      loading.classList.remove('show');
    }
  }

  private showError(message: string, errorElement: HTMLElement) {
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  private showSuccess(message: string, successElement: HTMLElement) {
    if (successElement) {
      successElement.textContent = message;
      successElement.style.display = 'block';
    }
  }

  private hideMessages() {
    const errorMessage = this.shadowRoot?.getElementById('error-message') as HTMLElement;
    const successMessage = this.shadowRoot?.getElementById('success-message') as HTMLElement;
    
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'none';
  }

  private clearForm() {
    if (!this.shadowRoot) return;
    
    const inputs = this.shadowRoot.querySelectorAll('.custom-input') as NodeListOf<HTMLInputElement>;
    inputs.forEach(input => input.value = '');
    
    const checkboxes = this.shadowRoot.querySelectorAll('.checkbox-input') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => checkbox.checked = false);
    
    const labels = this.shadowRoot.querySelectorAll('.option-label');
    labels.forEach(label => label.classList.remove('selected'));
    
    this.selectedRole = '';
    this.updateContinueButton();
  }
}

// Definir el custom element
customElements.define('register-new-account', RegisterNewAccount);

export default RegisterNewAccount;