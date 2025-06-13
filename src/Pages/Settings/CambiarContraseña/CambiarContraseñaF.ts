// ✅ Interfaz local para UserActions
interface UserActionsInterface {
  updatePassword: (newPassword: string) => void;
  validateCurrentPassword?: (currentPassword: string) => boolean;
}

// Se crea un nuevo componente llamado CambiarContraseñaF
class CambiarContraseñaF extends HTMLElement {
  private resizeHandler: () => void;

  constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this.resizeHandler = () => {
          // Lógica de resize si es necesaria
      };

      if (this.shadowRoot) {
          this.shadowRoot.innerHTML = `
              <style>
                  :host {
                      display: block;
                      width: 100%;
                      min-height: 100vh;
                      background-color: #f8f9fa;
                      font-family: Arial, sans-serif;
                  }

                  .header-wrapper {
                      display: block;
                      background: white;
                      padding: 0;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      position: sticky;
                      top: 0;
                      z-index: 100;
                  }

                  .logo-container {
                      padding: 15px 30px;
                      border-bottom: 1px solid #eee;
                  }

                  .main-container {
                      display: flex;
                      min-height: calc(100vh - 80px);
                      background-color: #f8f9fa;
                  }

                  .sidebar-wrapper {
                      width: 250px;
                      background: white;
                      border-right: 1px solid #eee;
                      position: sticky;
                      top: 80px;
                      height: fit-content;
                  }

                  .content-wrapper {
                      flex: 1;
                      padding: 30px;
                      overflow-y: auto;
                  }

                  .form-container {
                      background-color: white;
                      border-radius: 16px;
                      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                      padding: 32px;
                      max-width: 600px;
                      margin: 0 auto;
                  }

                  .back-button {
                      background: none;
                      border: none;
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      padding: 8px 0;
                      color: #666;
                      font-size: 16px;
                      margin-bottom: 16px;
                      transition: color 0.2s;
                  }

                  .back-button:hover {
                      color: #333;
                  }

                  .back-arrow {
                      margin-right: 8px;
                      font-size: 18px;
                  }

                  .title {
                      font-size: 24px;
                      font-weight: bold;
                      color: #000;
                      margin: 0 0 24px 0;
                  }

                  .input-group {
                      margin-bottom: 20px;
                  }

                  .input-label {
                      display: block;
                      margin-bottom: 8px;
                      font-weight: 600;
                      color: #333;
                      font-size: 14px;
                  }

                  .input-field {
                      width: 100%;
                      padding: 14px 16px;
                      font-size: 16px;
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      box-sizing: border-box;
                      transition: border-color 0.2s, box-shadow 0.2s;
                  }

                  .input-field:focus {
                      outline: none;
                      border-color: #AAAB54;
                      box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                  }

                  .input-field::placeholder {
                      color: #aaa;
                  }

                  .button-group {
                      display: flex;
                      gap: 12px;
                      margin-top: 32px;
                  }

                  .save-button {
                      background-color: #AAAB54;
                      color: white;
                      border: none;
                      padding: 14px 28px;
                      border-radius: 8px;
                      font-weight: 600;
                      cursor: pointer;
                      font-size: 16px;
                      transition: background-color 0.2s, transform 0.1s;
                      flex: 1;
                  }

                  .save-button:hover {
                      background-color: #999A4A;
                  }

                  .save-button:active {
                      transform: translateY(1px);
                  }

                  .save-button:disabled {
                      background-color: #ccc;
                      cursor: not-allowed;
                      transform: none;
                  }

                  .status-container {
                      margin-top: 20px;
                  }

                  .status-message {
                      padding: 12px 16px;
                      border-radius: 8px;
                      font-size: 14px;
                      font-weight: 500;
                      text-align: center;
                  }

                  .status-message.success {
                      background-color: #d4f7dc;
                      color: #0d7224;
                      border: 1px solid #a3e6b8;
                  }

                  .status-message.error {
                      background-color: #fce8e8;
                      color: #a91b1b;
                      border: 1px solid #f5b8b8;
                  }

                  @media (max-width: 768px) {
                      .main-container {
                          flex-direction: column;
                      }

                      .sidebar-wrapper {
                          width: 100%;
                          position: static;
                          order: 2;
                      }

                      .content-wrapper {
                          padding: 20px;
                          order: 1;
                      }

                      .form-container {
                          padding: 24px;
                      }

                      .button-group {
                          flex-direction: column;
                      }

                      .title {
                          font-size: 20px;
                      }
                  }
              </style>

              <div class="header-wrapper">
                  <div class="logo-container">
                      <lulada-logo></lulada-logo>
                  </div>
              </div>

              <div class="main-container">
                  <div class="sidebar-wrapper">
                      <cajon-list></cajon-list>
                  </div>

                  <div class="content-wrapper">
                      <button id="back-btn" class="back-button">
                          <span class="back-arrow">←</span> Volver
                      </button>

                      <div class="form-container">
                          <h2 class="title">Cambiar contraseña</h2>

                          <div class="input-group">
                              <label class="input-label" for="current-password">Contraseña actual</label>
                              <input type="password" id="current-password" class="input-field" placeholder="Ingresa tu contraseña actual">
                          </div>

                          <div class="input-group">
                              <label class="input-label" for="new-password">Nueva contraseña</label>
                              <input type="password" id="new-password" class="input-field" placeholder="Ingresa tu nueva contraseña">
                          </div>

                          <div class="input-group">
                              <label class="input-label" for="confirm-password">Confirmar nueva contraseña</label>
                              <input type="password" id="confirm-password" class="input-field" placeholder="Confirma tu nueva contraseña">
                          </div>

                          <div class="button-group">
                              <button id="save-btn" class="save-button">Guardar cambios</button>
                          </div>

                          <div id="status-container" class="status-container"></div>
                      </div>
                  </div>
              </div>
          `;
      }
  }

  connectedCallback() {
      this.setupEventListeners();
      window.addEventListener('resize', this.resizeHandler);
  }

  disconnectedCallback() {
      window.removeEventListener('resize', this.resizeHandler);
  }

  private setupEventListeners() {
      if (!this.shadowRoot) return;

      const backBtn = this.shadowRoot.querySelector('#back-btn');
      const saveBtn = this.shadowRoot.querySelector('#save-btn');

      backBtn?.addEventListener('click', () => this.handleBackClick());
      saveBtn?.addEventListener('click', () => this.handleSaveClick());
  }

  // ✅ MÉTODO CORREGIDO QUE SÍ COMPILA
  private validatePasswords(): boolean {
      const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
      const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
      const confirmPasswordField = this.shadowRoot?.querySelector('#confirm-password') as HTMLInputElement;

      if (!currentPasswordField || !newPasswordField || !confirmPasswordField) {
          return false;
      }

      const currentPassword = currentPasswordField.value.trim();
      const newPassword = newPasswordField.value.trim();
      const confirmPassword = confirmPasswordField.value.trim();

      // ✅ Convertir explícitamente a boolean para evitar errores de TypeScript
      const areFieldsFilled = Boolean(currentPassword && newPassword && confirmPassword);
      const isNewPasswordValid = Boolean(newPassword.length >= 6);
      const doPasswordsMatch = Boolean(newPassword === confirmPassword);
      const arePasswordsDifferent = Boolean(currentPassword !== newPassword);

      return areFieldsFilled && isNewPasswordValid && doPasswordsMatch && arePasswordsDifferent;
  }

  private showStatusMessage(message: string, type: 'success' | 'error'): void {
      const statusContainer = this.shadowRoot?.querySelector('#status-container');
      if (statusContainer) {
          statusContainer.innerHTML = `
              <div class="status-message ${type}">
                  ${message}
              </div>
          `;

          setTimeout(() => {
              statusContainer.innerHTML = '';
          }, 5000);
      }
  }

  private handleBackClick(): void {
      const navEvent = new CustomEvent('navigate', {
          detail: '/configurations',
          bubbles: true,
          composed: true
      });
      document.dispatchEvent(navEvent);
  }

  // ✅ MÉTODO CORREGIDO SIN ERRORES DE TYPESCRIPT
  private handleSaveClick(): void {
      const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
      const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
      const confirmPasswordField = this.shadowRoot?.querySelector('#confirm-password') as HTMLInputElement;

      if (!currentPasswordField || !newPasswordField || !confirmPasswordField) {
          this.showStatusMessage('Error: No se pudieron encontrar los campos del formulario', 'error');
          return;
      }

      const currentPassword = currentPasswordField.value.trim();
      const newPassword = newPasswordField.value.trim();
      const confirmPassword = confirmPasswordField.value.trim();

      if (!currentPassword || !newPassword || !confirmPassword) {
          this.showStatusMessage('Por favor complete todos los campos', 'error');
          return;
      }

      if (newPassword.length < 6) {
          this.showStatusMessage('La nueva contraseña debe tener al menos 6 caracteres', 'error');
          return;
      }

      if (newPassword !== confirmPassword) {
          this.showStatusMessage('Las nuevas contraseñas no coinciden', 'error');
          return;
      }

      if (currentPassword === newPassword) {
          this.showStatusMessage('La nueva contraseña debe ser diferente a la actual', 'error');
          return;
      }

      // ✅ SOLUCIÓN SIN ANY QUE SÍ COMPILA
      const windowWithUserActions = window as Window & { UserActions: UserActionsInterface };
      
      if (!windowWithUserActions.UserActions) {
          this.showStatusMessage('Error: Sistema de usuario no disponible', 'error');
          return;
      }

      try {
          windowWithUserActions.UserActions.updatePassword(newPassword);

          currentPasswordField.value = '';
          newPasswordField.value = '';
          confirmPasswordField.value = '';

          this.showStatusMessage('¡Contraseña actualizada exitosamente!', 'success');

          const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;
          if (saveButton) {
              saveButton.disabled = true;
              setTimeout(() => {
                  saveButton.disabled = false;
              }, 3000);
          }

      } catch (error) {
          console.error('Error al actualizar la contraseña:', error);
          this.showStatusMessage('Error al actualizar la contraseña. Intente nuevamente.', 'error');
      }
  }
}

export default CambiarContraseñaF;