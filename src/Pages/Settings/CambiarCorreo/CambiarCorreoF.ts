// src/Pages/Settings/CambiarCorreo/CambiarCorreoF.ts - CORREGIDO

// Esta es una clase que crea una página completa para cambiar el correo electrónico del usuario
class CambiarCorreoF extends HTMLElement {
  // Variable privada que guarda el correo actual del usuario
  private email: string;
  
  // Constructor: se ejecuta cuando se crea una nueva instancia de esta página
  constructor() {
    super(); // Llama al constructor de la clase padre (HTMLElement)
    
    // Obtiene el correo actual desde los atributos HTML, si no existe usa una cadena vacía
    this.email = this.getAttribute('email') || '';
    
    // Crea un shadow DOM para aislar los estilos de esta página
    this.attachShadow({ mode: 'open' });
    
    // Si el shadow DOM se creó correctamente, construye toda la página
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <style>
          /* === ESTILOS CSS PARA LA PÁGINA === */
          
          /* El componente principal ocupa toda la pantalla */
          :host {
            display: flex;
            flex-direction: column;  /* Los elementos se apilan verticalmente */
            width: 100%;
            height: 100vh;          /* Altura completa de la ventana */
            font-family: Arial, sans-serif;
            background-color: white;
          }
          
          /* Contenedor del header (logo) en la parte superior */
          .header-wrapper {
            width: 100%;
            background-color: white;
            padding: 20px 0 10px 20px;
            border-bottom: 1px solid #eaeaea;  /* Línea gris en la parte inferior */
          }
          
          /* Contenedor específico para el logo */
          .logo-container {
            width: 300px;
          }
          
          /* Contenedor principal que divide la página en sidebar y contenido */
          .main-container {
            display: flex;              /* Los elementos van lado a lado */
            width: 100%;
            flex: 1;                   /* Ocupa todo el espacio restante */
            background-color: white;
            overflow: hidden;          /* Oculta contenido que se salga */
          }
          
          /* Barra lateral izquierda con el menú de navegación */
          .sidebar-wrapper {
            width: 250px;
            height: 100%;
            overflow-y: auto;          /* Permite scroll vertical si es necesario */
          }
          
          /* Área principal donde va el formulario */
          .content-container {
            flex-grow: 1;              /* Ocupa todo el espacio restante */
            padding-left: 20px;
            padding-top: 20px;
            height: 100%;
            overflow-y: auto;          /* Permite scroll vertical */
          }
          
          /* Botón para regresar a la página anterior */
          .back-button {
            background: none;          /* Sin fondo */
            border: none;             /* Sin borde */
            cursor: pointer;          /* Muestra manita al pasar el mouse */
            display: flex;
            align-items: center;      /* Centra verticalmente el contenido */
            padding: 8px 0;
            color: #666;             /* Color gris */
            font-size: 16px;
            margin-bottom: 16px;
          }
          
          /* Flecha del botón de regreso */
          .back-arrow {
            margin-right: 8px;       /* Espacio entre la flecha y el texto */
          }
          
          /* Contenedor del formulario principal */
          .form-container {
            background-color: white;
            border-radius: 16px;      /* Bordes redondeados */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* Sombra suave */
            padding: 32px;            /* Espacio interno */
            max-width: 600px;        /* Ancho máximo */
          }
          
          /* Título principal del formulario */
          .title {
            font-size: 22px;
            font-weight: bold;
            color: #000;
            margin: 0 0 8px 0;
          }
          
          /* Subtítulo que explica qué campo se muestra */
          .subtitle {
            font-size: 16px;
            color: #aaa;             /* Color gris claro */
            margin: 0 0 4px 0;
          }
          
          /* Segundo subtítulo con el correo actual hardcodeado */
          .subtitle2 {
            font-size: 16px;
            margin: 0 0 4px 0;
          }
          
          /* Texto que muestra el correo actual del usuario */
          .current-email {
            font-size: 16px;
            color: #333;             /* Color gris oscuro */
            margin-bottom: 24px;
          }
          
          /* Campo de entrada donde el usuario escribe el nuevo correo */
          .input-field {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            border: 1px solid #ddd;   /* Borde gris claro */
            border-radius: 8px;       /* Bordes ligeramente redondeados */
            margin-bottom: 24px;
            box-sizing: border-box;   /* Incluye padding en el ancho total */
          }
          
          /* Texto de ejemplo dentro del campo de entrada */
          .input-field::placeholder {
            color: #ccc;             /* Color gris muy claro */
          }
          
          /* Botón para guardar los cambios */
          .save-button {
            background-color: #b4c13b;  /* Color verde característico */
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;         /* Texto en negrita */
            cursor: pointer;          /* Muestra manita al pasar el mouse */
            font-size: 16px;
          }
          
          /* Efecto cuando el mouse pasa sobre el botón guardar */
          .save-button:hover {
            background-color: #9aa732;  /* Color verde más oscuro */
          }
          
          /* Barra de navegación para móviles (inicialmente oculta) */
          .responsive-nav {
            display: none;            /* Oculta por defecto */
            position: fixed;          /* Se queda fijo en la pantalla */
            bottom: 0;               /* Pegado al fondo */
            left: 0;
            right: 0;
            background-color: white;
            border-top: 1px solid #e0e0e0;
            padding: 10px 0;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);  /* Sombra hacia arriba */
            z-index: 1000;          /* Se muestra por encima de otros elementos */
          }
          
          /* === DISEÑO RESPONSIVO PARA MÓVILES === */
          /* Estas reglas se aplican solo en pantallas de 900px o menos */
          @media (max-width: 900px) {
            /* En móvil: ocultar el header normal */
            .header-wrapper {
              display: none;
            }
            
            /* En móvil: ocultar la barra lateral */
            .sidebar-wrapper {
              display: none;
            }
            
            /* En móvil: ajustar el contenido principal */
            .content-container {
              padding-left: 10px;      /* Menos espacio a los lados */
              padding-right: 10px;
              padding-top: 10px;
              padding-bottom: 80px;    /* Espacio extra abajo para la barra de navegación */
            }
            
            /* En móvil: hacer el formulario más compacto */
            .form-container {
              padding: 20px;           /* Menos padding interno */
              margin: 10px 0;
              box-shadow: none;        /* Sin sombra */
              border-radius: 8px;      /* Bordes menos redondeados */
            }
            
            /* En móvil: título más pequeño */
            .title {
              font-size: 20px;
            }
            
            /* En móvil: mostrar la barra de navegación inferior */
            .responsive-nav {
              display: block;
            }
          }
          
          /* Para pantallas muy pequeñas (600px o menos) */
          @media (max-width: 600px) {
            /* Formulario aún más compacto */
            .form-container {
              padding: 15px;
              margin: 5px;
            }
            
            /* Título aún más pequeño */
            .title {
              font-size: 18px;
            }
            
            /* Campo de entrada más pequeño */
            .input-field {
              padding: 12px;
              font-size: 14px;
            }
            
            /* Botón de ancho completo en móvil */
            .save-button {
              width: 100%;
              padding: 14px;
            }
          }
        </style>
        
        <!-- Header responsive (SOLO visible en mobile) -->
        <!-- Este componente muestra el logo y navegación en móviles -->
        <lulada-responsive-header style="display: none;"></lulada-responsive-header>
        
        <!-- Header normal (NO tocar - se mantiene igual - USANDO LULADA-LOGO) -->
        <!-- Este div contiene el logo para pantallas de escritorio -->
        <div class="header-wrapper">
          <div class="logo-container">
            <lulada-logo></lulada-logo>
          </div>
        </div>
        
        <!-- Contenedor principal que divide la página -->
        <div class="main-container">
          <!-- Barra lateral con el menú de navegación -->
          <div class="sidebar-wrapper">
            <lulada-sidebar></lulada-sidebar>
          </div>
          
          <!-- Área principal con el formulario -->
          <div class="content-container">
            <!-- Botón para regresar a configuraciones -->
            <button id="back-btn" class="back-button">
              <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- El formulario para cambiar el correo -->
            <div class="form-container">
              <h2 class="title">Cambiar correo</h2>
              <p class="subtitle">Correo actual</p>
              <p class="subtitle2">cristijau@gmail.com</p>
              <p class="current-email">${this.email}</p>
              
              <!-- Campo donde el usuario escribe el nuevo correo -->
              <input type="email" id="email-input" class="input-field" placeholder="Correo nuevo">
              
              <!-- Botón para guardar los cambios -->
              <button id="save-btn" class="save-button">Guardar</button>
            </div>
          </div>
        </div>
        
        <!-- Barra navegación responsive (SOLO visible en mobile) -->
        <!-- Esta barra aparece en la parte inferior en móviles -->
        <div class="responsive-nav">
          <lulada-responsive-bar></lulada-responsive-bar>
        </div>
      `;
    }
    
    // Configura el manejador de redimensionamiento y lo ejecuta inmediatamente
    this.resizeHandler = this.resizeHandler.bind(this);
    this.resizeHandler();
  }
  
  // Define qué atributos HTML deben ser observados para cambios
  static get observedAttributes() {
    return ['email'];  // Solo observa cambios en el atributo 'email'
  }
  
  // Se ejecuta cuando cambia un atributo observado
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Si el atributo 'email' cambió, actualiza la variable interna
    if (name === 'email' && oldValue !== newValue) {
      this.email = newValue;
      this.updateEmail();  // Actualiza lo que se muestra en pantalla
    }
  }
  
  // Se ejecuta cuando el componente se añade al DOM de la página
  connectedCallback() {
    console.log('CambiarCorreoF añadido al DOM');
    this.setupEventListeners();  // Configura los eventos de clicks y cambios
    window.addEventListener('resize', this.resizeHandler);  // Escucha cambios de tamaño de ventana
  }
  
  // Se ejecuta cuando el componente se quita del DOM
  disconnectedCallback() {
    console.log('CambiarCorreoF eliminado del DOM');
    this.removeEventListeners();  // Limpia los eventos para evitar problemas de memoria
    window.removeEventListener('resize', this.resizeHandler);
  }
  
  // Actualiza el texto que muestra el correo actual en la interfaz
  private updateEmail() {
    if (!this.shadowRoot) return;
    
    // Busca el elemento que muestra el correo actual
    const currentEmailEl = this.shadowRoot.querySelector('.current-email');
    if (currentEmailEl) {
      currentEmailEl.textContent = this.email;  // Actualiza el texto mostrado
    }
  }
  
  // Configura todos los eventos de la página (clicks, cambios, etc.)
  private setupEventListeners() {
    if (!this.shadowRoot) return;
    
    // Configura el botón de "Volver"
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.addEventListener('click', this.handleBackClick.bind(this));
    }
    
    // Configura el botón de "Guardar"
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', this.handleSaveClick.bind(this));
    }
  }
  
  // Quita todos los event listeners para evitar problemas de memoria
  private removeEventListeners() {
    if (!this.shadowRoot) return;
    
    // Quita el evento del botón "Volver"
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.removeEventListener('click', this.handleBackClick.bind(this));
    }
    
    // Quita el evento del botón "Guardar"
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.removeEventListener('click', this.handleSaveClick.bind(this));
    }
  }
  
  // Maneja el cambio de tamaño de ventana para el diseño responsivo
  private resizeHandler() {
    // Obtiene referencias a los elementos que cambian con el tamaño de pantalla
    const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
    const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
    const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
    const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;
    
    // Si todos los elementos existen, decide qué mostrar según el tamaño de pantalla
    if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
      if (window.innerWidth <= 900) {
        // En pantallas pequeñas (móvil): mostrar elementos móviles
        responsiveHeader.style.display = 'block';   // Mostrar header móvil
        normalHeader.style.display = 'none';        // Ocultar header normal
        responsiveNav.style.display = 'block';      // Mostrar barra inferior
        sidebar.style.display = 'none';             // Ocultar sidebar
      } else {
        // En pantallas grandes (escritorio): mostrar elementos de escritorio
        responsiveHeader.style.display = 'none';    // Ocultar header móvil
        normalHeader.style.display = 'block';       // Mostrar header normal
        responsiveNav.style.display = 'none';       // Ocultar barra inferior
        sidebar.style.display = 'block';            // Mostrar sidebar
      }
    }
  }

  // Se ejecuta cuando el usuario hace click en el botón "Volver"
  private handleBackClick() {
    // Crea un evento personalizado para navegar de regreso a configuraciones
    const navEvent = new CustomEvent('navigate', {
        detail: '/configurations',    // La ruta a la que queremos ir
        bubbles: true,               // El evento puede subir por el DOM
        composed: true               // El evento puede salir del shadow DOM
    });
    // Envía el evento al documento para que el sistema de navegación lo capture
    document.dispatchEvent(navEvent);
  }
  
  // Se ejecuta cuando el usuario hace click en el botón "Guardar"
  private handleSaveClick() {
    // Obtiene el campo de entrada donde el usuario escribió el nuevo correo
    const inputField = this.shadowRoot?.querySelector('#email-input') as HTMLInputElement;
    
    // Verifica que el campo exista y tenga contenido
    if (inputField && inputField.value) {
      const newEmail = inputField.value;  // Obtiene el nuevo correo escrito
      
      this.showSuccessMessage();  // Muestra mensaje de confirmación
      inputField.value = '';      // Limpia el campo de entrada
      
      // Envía un evento personalizado con el nuevo correo
      this.dispatchEvent(new CustomEvent('save', { 
        detail: { newEmail }       // Incluye el nuevo correo en los detalles del evento
      }));
    }
  }

  // Muestra un mensaje de éxito cuando se guarda el correo
  // Este mensaje aparece como una notificación en la esquina superior derecha
  private showSuccessMessage(): void {
    // Crea un elemento div para el mensaje
    const toast = document.createElement('div');
    
    // Aplica estilos CSS en línea para que se vea como una notificación elegante
    toast.style.cssText = `
        position: fixed;             /* Se queda fijo en la pantalla */
        top: 20px;                  /* 20px desde arriba */
        right: 20px;                /* 20px desde la derecha */
        background: linear-gradient(135deg, #4CAF50, #45a049);  /* Fondo verde degradado */
        color: white;               /* Texto blanco */
        padding: 16px 24px;         /* Espacio interno */
        border-radius: 12px;        /* Bordes redondeados */
        z-index: 10001;            /* Por encima de otros elementos */
        font-family: Arial, sans-serif;
        font-weight: 600;          /* Texto en negrita */
        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);  /* Sombra verde */
        transform: translateX(100%);  /* Inicialmente fuera de la pantalla */
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Animación suave */
        backdrop-filter: blur(10px);  /* Efecto de desenfoque */
        border: 1px solid rgba(255, 255, 255, 0.2);  /* Borde sutil */
    `;
    toast.textContent = '📧 Tu correo cambió con éxito';  // El texto del mensaje
    
    document.body.appendChild(toast);  // Añade el mensaje al final del body
    
    // Animación de entrada: después de 100ms, desliza el mensaje hacia la pantalla
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Animación de salida y eliminación después de 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';  // Desliza fuera de la pantalla
        setTimeout(() => {
            // Después de la animación, elimina el elemento del DOM
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 400);
    }, 3000);
  }
}

// Exporta la clase para que pueda ser usada en otros archivos
export default CambiarCorreoF;