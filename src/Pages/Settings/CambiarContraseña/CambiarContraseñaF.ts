// Esta clase crea una página completa para cambiar la contraseña del usuario
// Extiende HTMLElement para crear un componente web personalizado
class CambiarContraseñaF extends HTMLElement {
  constructor() {
    super(); // Llama al constructor de la clase padre (HTMLElement)
    
    // Crea un shadow DOM para aislar los estilos de esta página
    this.attachShadow({ mode: 'open' });
    
    // Si el shadow DOM se creó correctamente, dibuja toda la página
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          /* ESTILOS CSS PARA LA PÁGINA DE CAMBIAR CONTRASEÑA */
          
          /* El componente principal ocupa toda la pantalla */
          :host {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: white;
          }
          
          /* Contenedor del header (logo) que se ve en desktop */
          .header-wrapper {
            width: 100%;
            background-color: white;
            padding: 20px 0 10px 20px;
            border-bottom: 1px solid #eaeaea;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          /* Contenedor del logo en el header */
          .logo-container {
            width: 300px;
          }
          
          /* Contenedor principal que tiene el sidebar y el contenido */
          .main-container {
            display: flex;
            width: 100%;
            flex: 1;
            background-color: white;
            overflow: hidden;
          }
          
          /* Sidebar (barra lateral) que contiene la navegación */
          .sidebar-wrapper {
            width: 250px;
            height: 100%;
            overflow-y: auto;
          }
          
          /* Área donde va el formulario de cambiar contraseña */
          .content-container {
            flex-grow: 1;
            padding-left: 20px;
            padding-top: 20px;
            height: 100%;
            overflow-y: auto;
            padding-bottom: 80px;
          }
          
          /* Caja blanca que contiene el formulario */
          .form-container {
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 32px;
            max-width: 600px;
          }
          
          /* Botón para volver a la página anterior */
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
          }
          
          /* Flecha del botón volver */
          .back-arrow {
            margin-right: 8px;
          }
          
          /* Título principal "Cambiar contraseña" */
          .title {
            font-size: 22px;
            font-weight: bold;
            color: #000;
            margin: 0 0 24px 0;
          }
          
          /* Estilos para los campos de entrada de texto (inputs) */
          .input-field {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 16px;
            box-sizing: border-box;
          }
          
          /* Color del texto de ayuda en los inputs */
          .input-field::placeholder {
            color: #aaa;
          }
          
          /* Botón verde para guardar los cambios */
          .save-button {
            background-color: #b4c13b;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 16px;
            margin-top: 8px;
          }
          
          /* Efecto cuando pasas el mouse sobre el botón guardar */
          .save-button:hover {
            background-color: #9aa732;
          }
          
          /* Barra de navegación que aparece abajo en móviles */
          .responsive-nav {
            display: none;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: white;
            border-top: 1px solid #e0e0e0;
            padding: 10px 0;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
            z-index: 1000;
          }
          
          /* DISEÑO RESPONSIVE PARA MÓVILES (pantallas menores a 900px) */
          @media (max-width: 900px) {
            /* Ocultar el header normal en móvil */
            .header-wrapper {
              display: none;
            }
            
            /* Ocultar el sidebar en móvil */
            .sidebar-wrapper {
              display: none;
            }
            
            /* Ajustar espacios en móvil */
            .content-container {
              padding-left: 10px;
              padding-right: 10px;
              padding-top: 10px;
            }
            
            /* Hacer la caja del formulario más simple en móvil */
            .form-container {
              padding: 20px;
              margin: 10px 0;
              box-shadow: none;
              border-radius: 8px;
            }
            
            /* Título más pequeño en móvil */
            .title {
              font-size: 20px;
            }
            
            /* Mostrar la barra de navegación inferior en móvil */
            .responsive-nav {
              display: block;
            }
          }
          
          /* DISEÑO PARA MÓVILES MUY PEQUEÑOS (pantallas menores a 600px) */
          @media (max-width: 600px) {
            /* Menos espacio en el formulario */
            .form-container {
              padding: 15px;
              margin: 5px;
            }
            
            /* Título aún más pequeño */
            .title {
              font-size: 18px;
            }
            
            /* Campos de entrada más pequeños */
            .input-field {
              padding: 12px;
              font-size: 14px;
            }
            
            /* Botón ocupa todo el ancho en móviles pequeños */
            .save-button {
              width: 100%;
              padding: 14px;
            }
          }
        </style>
        
        <!-- Header que aparece solo en móviles (inicialmente oculto) -->
        <lulada-responsive-header style="display: none;"></lulada-responsive-header>
        
        <!-- Header normal que aparece solo en desktop (con el logo) -->
        <div class="header-wrapper">
          <div class="logo-container">
            <lulada-logo></lulada-logo>
          </div>
        </div>
        
        <!-- Contenedor principal con sidebar y formulario -->
        <div class="main-container">
          <!-- Sidebar con navegación (solo visible en desktop) -->
          <div class="sidebar-wrapper">
            <lulada-sidebar></lulada-sidebar>
          </div>
          
          <!-- Área del contenido principal -->
          <div class="content-container">
            <!-- Botón para volver a configuraciones -->
            <button id="back-btn" class="back-button">
              <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- Formulario para cambiar contraseña -->
            <div class="form-container">
              <h2 class="title">Cambiar contraseña</h2>
              
              <!-- Campo para la contraseña actual -->
              <input type="password" id="current-password" class="input-field" placeholder="Contraseña actual">
              
              <!-- Campo para la nueva contraseña -->
              <input type="password" id="new-password" class="input-field" placeholder="Nueva Contraseña">
              
              <!-- Botón para guardar los cambios -->
              <button id="save-btn" class="save-button">Guardar</button>
            </div>
          </div>
        </div>
        
        <!-- Barra de navegación que aparece solo en móviles -->
        <div class="responsive-nav">
          <lulada-responsive-bar></lulada-responsive-bar>
        </div>
      `;
    }
    
    // Configurar el manejador de cambio de tamaño de pantalla
    this.resizeHandler = this.resizeHandler.bind(this);
    this.resizeHandler(); // Ejecutar inmediatamente
  }

  // Se ejecuta cuando el componente se añade a la página
  connectedCallback() {
    console.log('CambiarContra añadido al DOM'); // Log para debug
    this.setupEventListeners(); // Configurar clicks de botones
    window.addEventListener('resize', this.resizeHandler); // Escuchar cambios de tamaño
  }

  // Se ejecuta cuando el componente se quita de la página
  disconnectedCallback() {
    console.log('CambiarContra eliminado del DOM'); // Log para debug
    this.removeEventListeners(); // Quitar listeners de botones
    window.removeEventListener('resize', this.resizeHandler); // Quitar listener de resize
  }

  // Configurar los eventos de click para los botones
  private setupEventListeners() {
    if (!this.shadowRoot) return; // Si no hay shadow DOM, salir
    
    // Encontrar el botón "Volver" y configurar su click
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.addEventListener('click', this.handleBackClick.bind(this));
    }
    
    // Encontrar el botón "Guardar" y configurar su click
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', this.handleSaveClick.bind(this));
    }
  }

  // Quitar los eventos de click de los botones (limpieza)
  private removeEventListeners() {
    if (!this.shadowRoot) return; // Si no hay shadow DOM, salir
    
    // Quitar listener del botón "Volver"
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.removeEventListener('click', this.handleBackClick.bind(this));
    }
    
    // Quitar listener del botón "Guardar"
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.removeEventListener('click', this.handleSaveClick.bind(this));
    }
  }
  
  // Manejar cambios en el tamaño de la pantalla (responsive)
  private resizeHandler() {
    // Encontrar todos los elementos que necesitan cambiar según el tamaño
    const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
    const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
    const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
    const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;
    
    // Si todos los elementos existen, aplicar los cambios
    if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
      // Si la pantalla es pequeña (móvil)
      if (window.innerWidth <= 900) {
        responsiveHeader.style.display = 'block'; // Mostrar header móvil
        normalHeader.style.display = 'none';      // Ocultar header desktop
        responsiveNav.style.display = 'block';    // Mostrar navegación inferior
        sidebar.style.display = 'none';           // Ocultar sidebar
      } else {
        // Si la pantalla es grande (desktop)
        responsiveHeader.style.display = 'none';  // Ocultar header móvil
        normalHeader.style.display = 'block';     // Mostrar header desktop
        responsiveNav.style.display = 'none';     // Ocultar navegación inferior
        sidebar.style.display = 'block';          // Mostrar sidebar
      }
    }
  }

  // Manejar click del botón "Volver"
  private handleBackClick() {
    // Crear evento de navegación para volver a configuraciones
    const navEvent = new CustomEvent('navigate', {
        detail: '/configurations', // Ir a la página de configuraciones
        bubbles: true,             // El evento puede subir por el DOM
        composed: true             // El evento puede salir del shadow DOM
    });
    document.dispatchEvent(navEvent); // Enviar el evento globalmente
  }

  // Manejar click del botón "Guardar"
  private handleSaveClick() {
    // Obtener los campos de contraseña actual y nueva
    const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
    const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
    
    // Si ambos campos existen
    if (currentPasswordField && newPasswordField) {
      // Obtener los valores escritos por el usuario
      const currentPassword = currentPasswordField.value;
      const newPassword = newPasswordField.value;
      
      // Verificar que ambos campos tengan contenido
      if (currentPassword && newPassword) {
        // Verificar que el sistema Flux esté disponible para guardar cambios
        if (!window.UserActions) {
          console.error('❌ UserActions no disponible');
          alert('Error: Sistema de usuario no disponible');
          return;
        }

        try {
          // Intentar actualizar la contraseña usando Flux
          window.UserActions.updatePassword(currentPassword, newPassword);
          console.log('✅ Contraseña actualizada via Flux');
          
          // Limpiar los campos después de guardar exitosamente
          currentPasswordField.value = '';
          newPasswordField.value = '';
          
          // Mostrar mensaje de éxito al usuario
          this.showSuccessMessage();
          
          // Emitir evento para notificar que se guardó
          this.dispatchEvent(new CustomEvent('save', { 
            detail: { currentPassword, newPassword } 
          }));
          
        } catch (error) {
          // Si hay error, mostrarlo en consola y al usuario
          console.error('❌ Error:', error);
          alert('Error al actualizar la contraseña');
        }
      } else {
        // Si falta llenar algún campo, avisar al usuario
        alert('Por favor completa ambos campos de contraseña');
      }
    }
  }

  // Mostrar mensaje bonito de éxito (mismo estilo que las publicaciones)
  private showSuccessMessage(): void {
    // Crear elemento para el mensaje
    const toast = document.createElement('div');
    
    // Estilos para que se vea bonito y animado
    toast.style.cssText = `
        position: fixed;              /* Quedarse fijo en la pantalla */
        top: 20px;                   /* 20px desde arriba */
        right: 20px;                 /* 20px desde la derecha */
        background: linear-gradient(135deg, #4CAF50, #45a049); /* Fondo verde degradado */
        color: white;                /* Texto blanco */
        padding: 16px 24px;          /* Espacio interno */
        border-radius: 12px;         /* Bordes redondeados */
        z-index: 10001;              /* Aparecer encima de todo */
        font-family: Arial, sans-serif;
        font-weight: 600;            /* Texto en negrita */
        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3); /* Sombra verde */
        transform: translateX(100%); /* Empezar fuera de la pantalla */
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Animación suave */
        backdrop-filter: blur(10px); /* Efecto de desenfoque */
        border: 1px solid rgba(255, 255, 255, 0.2); /* Borde sutil */
    `;
    toast.textContent = '🔒 Tu contraseña cambió con éxito'; // Texto del mensaje
    
    document.body.appendChild(toast); // Añadir el mensaje a la página
    
    // Animación de entrada: hacer que aparezca deslizándose
    setTimeout(() => {
        toast.style.transform = 'translateX(0)'; // Mover a su posición final
    }, 100);
    
    // Animación de salida: hacer que desaparezca después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)'; // Mover fuera de la pantalla
        // Quitar completamente del DOM después de la animación
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 400);
    }, 3000); // Esperar 3 segundos antes de ocultar
  }
}

// Exportar la clase para que pueda ser usada en otros archivos
export default CambiarContraseñaF;