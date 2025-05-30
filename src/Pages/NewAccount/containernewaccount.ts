// Página de registro de nuevos usuarios
class RegisterNewAccount extends HTMLElement {
  private selectedRole: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
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
              <lulada-boxtext placeholder="Nombre"></lulada-boxtext>
              <lulada-boxtext placeholder="Apellido"></lulada-boxtext>
              <lulada-boxtext placeholder="Correo Electronico"></lulada-boxtext>
              <lulada-boxtext placeholder="Contraseña"></lulada-boxtext>
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

    continueButton?.addEventListener('click', () => {
      this.handleContinue();
    });

    loginButton?.addEventListener('click', () => {
      window.location.href = '/login';
    });
  }

  // Habilita/deshabilita el botón "Continuar"
  updateContinueButton() {
    const continueButton = this.shadowRoot?.getElementById('continue-button') as HTMLButtonElement;
    if (!continueButton) return;
    continueButton.disabled = !this.selectedRole;
  }

  // Maneja el click en "Continuar"
  handleContinue() {
    if (!this.selectedRole) {
      alert('Por favor, selecciona un tipo de cuenta.');
      return;
    }

    const roleText = this.selectedRole === 'person' ? 'Persona' : 'Restaurante';
    alert(`¡Registro exitoso! Tu cuenta como ${roleText} ha sido creada.`);
    window.location.href = '/home';
  }
}

export default RegisterNewAccount;