// Se crea un nuevo componente llamado CambiarContraseñaF
class CambiarContraseñaF extends HTMLElement {
  constructor() {
    super(); // Llama al constructor de HTMLElement
    this.attachShadow({ mode: 'open' }); // Crea un Shadow DOM para encapsular estilos y estructura

    // Si el shadowRoot existe, se le agrega el HTML y CSS del componente
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          /* Estilos generales para la página */
          :host { ... }

          /* Estilos para el encabezado en modo escritorio */
          .header-wrapper { ... }

          /* Estilos para el logo */
          .logo-container { ... }

          /* Contenedor principal que agrupa todo */
          .main-container { ... }

          /* Estilos para el menú lateral (sidebar) */
          .sidebar-wrapper { ... }

          /* Contenedor del contenido principal */
          .content-container { ... }

          /* Estilos del formulario para cambiar contraseña */
          .form-container { ... }

          /* Botón para volver atrás */
          .back-button { ... }

          .back-arrow { ... }

          /* Título de la sección */
          .title { ... }

          /* Estilos de los campos de entrada (input) */
          .input-field { ... }

          /* Estilos del botón de guardar */
          .save-button { ... }

          /* Menú de navegación que aparece en pantallas pequeñas (móvil) */
          .responsive-nav { ... }

          /* Estilos para pantallas menores a 900px */
          @media (max-width: 900px) { ... }

          /* Estilos para pantallas aún más pequeñas */
          @media (max-width: 600px) { ... }
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
              <input type="password" id="current-password" class="input-field" placeholder="Contraseña actual">
              <input type="password" id="new-password" class="input-field" placeholder="Nueva Contraseña">
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
    this.resizeHandler = this.resizeHandler.bind(this);
    this.resizeHandler();
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
  private setupEventListeners() {
    if (!this.shadowRoot) return;

    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.addEventListener('click', this.handleBackClick.bind(this));
    }

    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', this.handleSaveClick.bind(this));
    }
  }

  // Elimina los eventos para evitar errores cuando el componente se borra
  private removeEventListeners() {
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
  private resizeHandler() {
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

  // Evento que se dispara al hacer clic en "Volver"
  private handleBackClick() {
    const navEvent = new CustomEvent('navigate', {
      detail: '/configurations', // Ruta a la que se quiere ir
      bubbles: true,
      composed: true
    });
    document.dispatchEvent(navEvent); // Dispara el evento de navegación
  }

  // Evento que se dispara al hacer clic en "Guardar"
  private handleSaveClick() {
    const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
    const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;

    if (currentPasswordField && newPasswordField) {
      const currentPassword = currentPasswordField.value;
      const newPassword = newPasswordField.value;

      // Si ambos campos están llenos
      if (currentPassword && newPassword) {
        if (!window.UserActions) {
          alert('Error: Sistema de usuario no disponible');
          return;
        }

try {
  // Intenta actualizar la contraseña
  window.UserActions.updatePassword(currentPassword, newPassword);

  // Limpia los campos del formulario
  currentPasswordField.value = '';
  newPasswordField.value = '';

  // Muestra un mensaje de éxito
  this.showSuccessMessage();

  // Lanza un evento personalizado con los datos
  this.dispatchEvent(new CustomEvent('save', {
    detail: { currentPassword, newPassword }
  }));
} catch (error) {
  console.error('Error al actualizar la contraseña:', error); // ✅ ahora se usa la variable
  alert('Error al actualizar la contraseña');
}

      }
    }
  }

  // Muestra un mensaje tipo "toast" cuando se cambia la contraseña
  private showSuccessMessage(): void {
    const toast = document.createElement('div');

    // Estilos del mensaje flotante
    toast.style.cssText = `...`;
    toast.textContent = '🔒 Tu contraseña cambió con éxito';

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

// Se exporta el componente para que se pueda usar en otras partes
export default CambiarContraseñaF;
