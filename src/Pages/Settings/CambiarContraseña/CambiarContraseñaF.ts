// ✅ SOLUCIÓN 1: Interfaz local sin declaración global

// Interfaz local para UserActions
interface UserActionsInterface {
  updatePassword: (newPassword: string) => void;
  validateCurrentPassword?: (currentPassword: string) => boolean;
}

// Se crea un nuevo componente llamado CambiarContraseñaF
class CambiarContraseñaF extends HTMLElement {
  private resizeHandler: () => void;

  constructor() {
      super(); // Llama al constructor de HTMLElement
      this.attachShadow({ mode: 'open' }); // Crea un Shadow DOM para encapsular estilos y estructura

      // Si el shadowRoot existe, se le agrega el HTML y CSS del componente
      if (this.shadowRoot) {
          this.shadowRoot.innerHTML = `
              <style>
                  /* Estilos generales para la página */
                  :host {
                      display: block;
                      width: 100%;
                      min-height: 100vh;
                      background-color: #f8f9fa;
                      font-family: Arial, sans-serif;
                  }

                  /* Estilos para el encabezado en modo escritorio */
                  .header-wrapper {
                      display: block;
                      background: white;
                      padding: 0;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                      position: sticky;
                      top: 0;
                      z-index: 100;
                  }

                  /* Estilos para el logo */
                  .logo-container {
                      padding: 15px 30px;
                      border-bottom: 1px solid #eee;
                  }

                  /* Contenedor principal que agrupa todo */
                  .main-container {
                      display: flex;
                      min-height: calc(100vh - 80px);
                      background-color: #f8f9fa;
                  }

                  /* Estilos para el menú lateral (sidebar) */
                  .sidebar-wrapper {
                      width: 250px;
                      background: white;
                      border-right: 1px solid #eee;
                      position: sticky;
                      top: 80px;
                      height: fit-content;
                  }

                  /* Contenedor del contenido principal */
                  .content-container {
                      flex: 1;
                      padding: 30px;
                      max-width: 800px;
                      margin: 0 auto;
                  }

                  /* Estilos del formulario para cambiar contraseña */
                  .form-container {
                      background: white;
                      padding: 30px;
                      border-radius: 12px;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                      max-width: 500px;
                  }

                  /* Botón para volver atrás */
                  .back-button {
                      background: none;
                      border: none;
                      color: #666;
                      font-size: 16px;
                      cursor: pointer;
                      display: flex;
                      align-items: center;
                      gap: 8px;
                      margin-bottom: 20px;
                      padding: 8px 0;
                      transition: color 0.2s ease;
                  }

                  .back-button:hover {
                      color: #AAAB54;
                  }

                  .back-arrow {
                      font-size: 18px;
                      font-weight: bold;
                  }

                  /* Título de la sección */
                  .title {
                      color: #333;
                      font-size: 24px;
                      font-weight: bold;
                      margin-bottom: 25px;
                      padding-bottom: 10px;
                      border-bottom: 2px solid #AAAB54;
                  }

                  /* Estilos de los campos de entrada (input) */
                  .input-field {
                      width: 100%;
                      padding: 12px 16px;
                      border: 1px solid #ddd;
                      border-radius: 8px;
                      font-size: 16px;
                      margin-bottom: 20px;
                      box-sizing: border-box;
                      transition: border-color 0.2s ease;
                      background-color: white;
                  }

                  .input-field:focus {
                      outline: none;
                      border-color: #AAAB54;
                      box-shadow: 0 0 0 3px rgba(170, 171, 84, 0.1);
                  }

                  .input-field::placeholder {
                      color: #999;
                  }

                  /* Estilos del botón de guardar */
                  .save-button {
                      background-color: #AAAB54;
                      color: white;
                      border: none;
                      border-radius: 8px;
                      padding: 12px 30px;
                      font-size: 16px;
                      font-weight: bold;
                      cursor: pointer;
                      transition: all 0.2s ease;
                      width: 100%;
                  }

                  .save-button:hover {
                      background-color: #9a9b4a;
                      transform: translateY(-1px);
                  }

                  .save-button:active {
                      transform: translateY(0);
                  }

                  .save-button:disabled {
                      background-color: #ccc;
                      cursor: not-allowed;
                      transform: none;
                  }

                  /* Menú de navegación que aparece en pantallas pequeñas (móvil) */
                  .responsive-nav {
                      display: none;
                      position: fixed;
                      bottom: 0;
                      left: 0;
                      right: 0;
                      background: white;
                      border-top: 1px solid #eee;
                      z-index: 1000;
                  }

                  /* Estilos para pantallas menores a 900px */
                  @media (max-width: 900px) {
                      .header-wrapper {
                          display: none;
                      }

                      .main-container {
                          flex-direction: column;
                          min-height: 100vh;
                          padding-bottom: 80px;
                      }

                      .sidebar-wrapper {
                          display: none;
                      }

                      .content-container {
                          padding: 20px;
                          max-width: none;
                      }

                      .form-container {
                          padding: 20px;
                          margin: 0;
                      }

                      .responsive-nav {
                          display: block;
                      }

                      .title {
                          font-size: 20px;
                          margin-bottom: 20px;
                      }
                  }

                  /* Estilos para pantallas aún más pequeñas */
                  @media (max-width: 600px) {
                      .content-container {
                          padding: 15px;
                      }

                      .form-container {
                          padding: 15px;
                          border-radius: 8px;
                      }

                      .input-field {
                          font-size: 16px; /* Evita zoom en iOS */
                          padding: 14px 16px;
                      }

                      .save-button {
                          padding: 14px 20px;
                          font-size: 16px;
                      }

                      .title {
                          font-size: 18px;
                      }
                  }

                  /* Estilos para mensajes de estado */
                  .status-message {
                      padding: 12px 16px;
                      border-radius: 6px;
                      margin-bottom: 20px;
                      font-size: 14px;
                      font-weight: 500;
                  }

                  .status-message.success {
                      background-color: #d4edda;
                      color: #155724;
                      border: 1px solid #c3e6cb;
                  }

                  .status-message.error {
                      background-color: #f8d7da;
                      color: #721c24;
                      border: 1px solid #f5c6cb;
                  }
              </style>

              <!-- Encabezado solo visible en móvil -->
              <lulada-responsive-header style="display: none;"></lulada-responsive-header>

              <!-- Encabezado en escritorio con logo -->
              <div class="header-wrapper">
                  <div class="logo-container">
                      <lulada-logo></lulada-logo>
                  </div>
              </div>

              <!-- Contenedor principal que incluye menú y contenido -->
              <div class="main-container">
                  <div class="sidebar-wrapper">
                      <lulada-sidebar></lulada-sidebar> <!-- Menú lateral -->
                  </div>
                  
                  <div class="content-container">
                      <!-- Botón para regresar -->
                      <button id="back-btn" class="back-button">
                          <span class="back-arrow">←</span> Volver
                      </button>
                      
                      <!-- Formulario para cambiar la contraseña -->
                      <div class="form-container">
                          <h2 class="title">Cambiar contraseña</h2>
                          
                          <div id="status-container"></div>
                          
                          <input 
                              type="password" 
                              id="current-password" 
                              class="input-field" 
                              placeholder="Contraseña actual"
                              autocomplete="current-password"
                          >
                          <input 
                              type="password" 
                              id="new-password" 
                              class="input-field" 
                              placeholder="Nueva Contraseña"
                              autocomplete="new-password"
                          >
                          <button id="save-btn" class="save-button">Guardar</button>
                      </div>
                  </div>
              </div>

              <!-- Menú inferior para dispositivos móviles -->
              <div class="responsive-nav">
                  <lulada-responsive-bar></lulada-responsive-bar>
              </div>
          `;
      }

      // Se asegura de que el componente sea responsive al tamaño de la pantalla
      this.resizeHandler = this.handleResize.bind(this);
      this.handleResize();
  }

  // Cuando el componente se agrega al DOM
  connectedCallback() {
      this.setupEventListeners(); // Se activan los botones
      window.addEventListener('resize', this.resizeHandler); // Escucha si se cambia el tamaño de la ventana
  }

  // Cuando el componente se elimina del DOM
  disconnectedCallback() {
      this.removeEventListeners(); // Quita los eventos
      window.removeEventListener('resize', this.resizeHandler);
  }

  // Configura los eventos de clic para los botones
  private setupEventListeners(): void {
      if (!this.shadowRoot) return;

      const backButton = this.shadowRoot.querySelector('#back-btn');
      if (backButton) {
          backButton.addEventListener('click', this.handleBackClick.bind(this));
      }

      const saveButton = this.shadowRoot.querySelector('#save-btn');
      if (saveButton) {
          saveButton.addEventListener('click', this.handleSaveClick.bind(this));
      }

      // Agregar validación en tiempo real
      const currentPasswordField = this.shadowRoot.querySelector('#current-password') as HTMLInputElement;
      const newPasswordField = this.shadowRoot.querySelector('#new-password') as HTMLInputElement;

      if (currentPasswordField && newPasswordField) {
          currentPasswordField.addEventListener('input', this.validateForm.bind(this));
          newPasswordField.addEventListener('input', this.validateForm.bind(this));
      }
  }

  // Elimina los eventos para evitar errores cuando el componente se borra
  private removeEventListeners(): void {
      if (!this.shadowRoot) return;

      const backButton = this.shadowRoot.querySelector('#back-btn');
      if (backButton) {
          backButton.removeEventListener('click', this.handleBackClick.bind(this));
      }

      const saveButton = this.shadowRoot.querySelector('#save-btn');
      if (saveButton) {
          saveButton.removeEventListener('click', this.handleSaveClick.bind(this));
      }
  }

  // Cambia entre vista de escritorio y móvil según el tamaño de la pantalla
  private handleResize(): void {
      const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
      const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
      const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
      const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;

      if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
          if (window.innerWidth <= 900) {
              // Modo móvil
              responsiveHeader.style.display = 'block';
              normalHeader.style.display = 'none';
              responsiveNav.style.display = 'block';
              sidebar.style.display = 'none';
          } else {
              // Modo escritorio
              responsiveHeader.style.display = 'none';
              normalHeader.style.display = 'block';
              responsiveNav.style.display = 'none';
              sidebar.style.display = 'block';
          }
      }
  }

  // Validar formulario en tiempo real
  private validateForm(): void {
      const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
      const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
      const saveButton = this.shadowRoot?.querySelector('#save-btn') as HTMLButtonElement;

      if (currentPasswordField && newPasswordField && saveButton) {
          const currentPassword = currentPasswordField.value.trim();
          const newPassword = newPasswordField.value.trim();
          
          // Validaciones básicas
          const isCurrentPasswordValid = currentPassword.length >= 6;
          const isNewPasswordValid = newPassword.length >= 6;
          const arePasswordsDifferent = currentPassword !== newPassword;
          
          saveButton.disabled = !(isCurrentPasswordValid && isNewPasswordValid && arePasswordsDifferent);
      }
  }

  // Mostrar mensaje de estado
  private showStatusMessage(message: string, type: 'success' | 'error'): void {
      const statusContainer = this.shadowRoot?.querySelector('#status-container');
      if (statusContainer) {
          statusContainer.innerHTML = `
              <div class="status-message ${type}">
                  ${message}
              </div>
          `;

          // Ocultar mensaje después de 5 segundos
          setTimeout(() => {
              statusContainer.innerHTML = '';
          }, 5000);
      }
  }

  // Evento que se dispara al hacer clic en "Volver"
  private handleBackClick(): void {
      const navEvent = new CustomEvent('navigate', {
          detail: '/configurations', // Ruta a la que se quiere ir
          bubbles: true,
          composed: true
      });
      document.dispatchEvent(navEvent); // Dispara el evento de navegación
  }

  // ✅ MÉTODO CORREGIDO CON SOLUCIÓN 1
  private handleSaveClick(): void {
      const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
      const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;

      if (currentPasswordField && newPasswordField) {
          const currentPassword = currentPasswordField.value.trim();
          const newPassword = newPasswordField.value.trim();

          // Validaciones
          if (!currentPassword || !newPassword) {
              this.showStatusMessage('Por favor complete todos los campos', 'error');
              return;
          }

          if (newPassword.length < 6) {
              this.showStatusMessage('La nueva contraseña debe tener al menos 6 caracteres', 'error');
              return;
          }

          if (currentPassword === newPassword) {
              this.showStatusMessage('La nueva contraseña debe ser diferente a la actual', 'error');
              return;
          }

          // ✅ NUEVA FORMA: Usar type assertion con interfaz local
          const windowWithUserActions = window as Window & {
            UserActions?: UserActionsInterface;
        };
        const userActions = windowWithUserActions.UserActions;
          
          if (!userActions) {
              this.showStatusMessage('Error: Sistema de usuario no disponible', 'error');
              return;
          }

          try {
              // ✅ Usar el método tipado de la interfaz local
              userActions.updatePassword(newPassword);

              // Limpiar los campos del formulario
              currentPasswordField.value = '';
              newPasswordField.value = '';

              // Mostrar mensaje de éxito
              this.showStatusMessage('¡Contraseña actualizada exitosamente!', 'success');
              this.showSuccessMessage();

              // Lanzar evento personalizado con los datos
              this.dispatchEvent(new CustomEvent('password-updated', {
                  detail: { 
                      timestamp: Date.now(),
                      success: true 
                  },
                  bubbles: true,
                  composed: true
              }));

              // Deshabilitar botón temporalmente
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

  // Muestra un mensaje tipo "toast" cuando se cambia la contraseña
  private showSuccessMessage(): void {
      const toast = document.createElement('div');

      // Estilos del mensaje flotante
      toast.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          z-index: 10001;
          font-family: Arial, sans-serif;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-width: 350px;
          word-wrap: break-word;
      `;
      
      toast.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 18px;">🔒</span>
              <span>Tu contraseña cambió con éxito</span>
          </div>
      `;

      document.body.appendChild(toast);

      // Muestra el toast con animación
      setTimeout(() => {
          toast.style.transform = 'translateX(0)';
      }, 100);

      // Oculta y elimina el toast después de unos segundos
      setTimeout(() => {
          toast.style.transform = 'translateX(100%)';
          setTimeout(() => {
              if (document.body.contains(toast)) {
                  document.body.removeChild(toast);
              }
          }, 400);
      }, 3000);
  }
}

// ✅ VERIFICACIÓN PARA EVITAR DUPLICADOS
if (!customElements.get('lulada-cambiar-contraseña')) {
  customElements.define('lulada-cambiar-contraseña', CambiarContraseñaF);
}

// Se exporta el componente para que se pueda usar en otras partes
export default CambiarContraseñaF;