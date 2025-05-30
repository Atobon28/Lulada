// Definimos una clase que representa la página para cambiar el nombre de usuario
// Esta clase hereda de HTMLElement, lo que significa que es un componente web personalizado
class NombreUsuraio extends HTMLElement {
  // Variable privada que guarda el nombre de usuario actual
  private username: string;
  
  // Constructor: se ejecuta cuando se crea una nueva instancia del componente
  constructor() {
    super(); // Llamamos al constructor de la clase padre (HTMLElement)
    
    // Obtenemos el nombre de usuario desde los atributos HTML, o usamos texto vacío si no existe
    this.username = this.getAttribute('username') || '';
    
    // Creamos un shadow DOM para aislar nuestros estilos y contenido
    this.attachShadow({ mode: 'open' });
    
    // Solo si el shadow DOM se creó correctamente
    if (this.shadowRoot) {
      // Aquí definimos todo el HTML y CSS de nuestra página
      this.shadowRoot.innerHTML = `
        <style>
          /* Estilos CSS para toda la página */
          
          /* El componente principal ocupa toda la pantalla */
          :host {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: white;
          }
          
          /* Contenedor del header (parte superior) */
          .header-wrapper {
            width: 100%;
            background-color: white;
            padding: 20px 0 10px 20px;
            border-bottom: 1px solid #eaeaea;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          /* Contenedor del logo */
          .logo-container {
            width: 300px;
          }
          
          /* Contenedor principal que divide la página en columnas */
          .main-container {
            display: flex;
            width: 100%;
            flex: 1;
            background-color: white;
            overflow: hidden;
          }
          
          /* Sidebar (barra lateral izquierda) */
          .sidebar-wrapper {
            width: 250px;
            height: 100%;
            overflow-y: auto;
          }
          
          /* Área de contenido principal (lado derecho) */
          .content-container {
            flex-grow: 1;
            padding-left: 20px;
            padding-top: 20px;
            height: 100%;
            overflow-y: auto;
            padding-bottom: 80px;
          }
          
          /* Botón para volver atrás */
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
          
          /* Contenedor del formulario principal */
          .form-container {
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 32px;
            max-width: 600px;
          }
          
          /* Título principal */
          .title {
            font-size: 22px;
            font-weight: bold;
            color: #000;
            margin: 0 0 8px 0;
          }
          
          /* Subtítulo */
          .subtitle {
            font-size: 16px;
            color: #aaa;
            margin: 0 0 4px 0;
          }
          
          /* Segundo subtítulo */
          .subtitle2 {
            font-size: 16px;
            margin: 0 0 4px 0;
          }
          
          /* Texto que muestra el nombre de usuario actual */
          .current-username {
            font-size: 16px;
            color: #333;
            margin-bottom: 24px;
          }
          
          /* Campo de texto donde el usuario escribe */
          .input-field {
            width: 100%;
            padding: 14px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 24px;
            box-sizing: border-box;
          }
          
          /* Texto placeholder del campo de entrada */
          .input-field::placeholder {
            color: #ccc;
          }
          
          /* Botón para guardar los cambios */
          .save-button {
            background-color: #b4c13b;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 16px;
          }
          
          /* Efecto hover del botón guardar */
          .save-button:hover {
            background-color: #9aa732;
          }
          
          /* Barra de navegación para móviles (inicialmente oculta) */
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
          
          /* RESPONSIVE: Estilos para pantallas pequeñas (móviles) */
          @media (max-width: 900px) {
            /* Ocultar el header normal en móvil */
            .header-wrapper {
              display: none;
            }
            
            /* Ocultar la sidebar en móvil */
            .sidebar-wrapper {
              display: none;
            }
            
            /* Ajustar el contenido para móvil */
            .content-container {
              padding-left: 10px;
              padding-right: 10px;
              padding-top: 10px;
            }
            
            /* Hacer el formulario más compacto en móvil */
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
            
            /* Mostrar la barra de navegación en móvil */
            .responsive-nav {
              display: block;
            }
          }
          
          /* RESPONSIVE: Estilos para pantallas muy pequeñas */
          @media (max-width: 600px) {
            /* Formulario aún más compacto */
            .form-container {
              padding: 15px;
              margin: 5px;
            }
            
            /* Título más pequeño */
            .title {
              font-size: 18px;
            }
            
            /* Campo de texto más pequeño */
            .input-field {
              padding: 12px;
              font-size: 14px;
            }
            
            /* Botón ocupa todo el ancho */
            .save-button {
              width: 100%;
              padding: 14px;
            }
          }
        </style>
        
        <!-- Header responsive (solo se ve en móviles) -->
        <lulada-responsive-header style="display: none;"></lulada-responsive-header>
        
        <!-- Header normal (solo se ve en escritorio) -->
        <div class="header-wrapper">
          <div class="logo-container">
            <lulada-logo></lulada-logo>
          </div>
        </div>
        
        <!-- Contenedor principal -->
        <div class="main-container">
          <!-- Sidebar (barra lateral) -->
          <div class="sidebar-wrapper">
            <lulada-sidebar></lulada-sidebar>
          </div>
          
          <!-- Área de contenido -->
          <div class="content-container">
            <!-- Botón para volver -->
            <button id="back-btn" class="back-button">
              <span class="back-arrow">←</span> Volver
            </button>
            
            <!-- Formulario principal -->
            <div class="form-container">
              <h2 class="title">Cambiar nombre de usuario</h2>
              <p class="subtitle">Nombre de usuario actual</p>
              <p class="subtitle2">@CrisTiJauregui</p>
              <p class="current-username">${this.username}</p>
              
              <!-- Campo donde el usuario escribe el nuevo nombre -->
              <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
              
              <!-- Botón para guardar -->
              <button id="save-btn" class="save-button">Guardar</button>
            </div>
          </div>
        </div>
        
        <!-- Barra de navegación para móviles -->
        <div class="responsive-nav">
          <lulada-responsive-bar></lulada-responsive-bar>
        </div>
      `;
    }
    
    // Configuramos el manejo de cambios de tamaño de pantalla
    this.resizeHandler = this.resizeHandler.bind(this);
    this.resizeHandler(); // Lo ejecutamos una vez al crear el componente
  }
  
  // Define qué atributos HTML queremos "observar" para cambios
  static get observedAttributes() {
    return ['username']; // Solo observamos el atributo "username"
  }
  
  // Se ejecuta cuando cambia un atributo que estamos observando
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Si cambió el username y es diferente al anterior
    if (name === 'username' && oldValue !== newValue) {
      this.username = newValue; // Actualizamos nuestra variable
      this.updateUsername(); // Actualizamos lo que se muestra en pantalla
    }
  }
  
  // Se ejecuta cuando el componente se añade a la página
  connectedCallback() {
    console.log('CambiarNU añadido al DOM');
    this.setupEventListeners(); // Configuramos los eventos (clicks, etc.)
    window.addEventListener('resize', this.resizeHandler); // Escuchamos cambios de tamaño
  }
  
  // Se ejecuta cuando el componente se quita de la página
  disconnectedCallback() {
    console.log('CambiarNU eliminado del DOM');
    this.removeEventListeners(); // Quitamos los eventos
    window.removeEventListener('resize', this.resizeHandler); // Dejamos de escuchar resize
  }
  
  // Función privada para actualizar el username mostrado en pantalla
  private updateUsername() {
    if (!this.shadowRoot) return; // Si no hay shadow DOM, no hacemos nada
    
    // Buscamos el elemento que muestra el username actual
    const currentUsernameEl = this.shadowRoot.querySelector('.current-username');
    if (currentUsernameEl) {
      currentUsernameEl.textContent = this.username; // Lo actualizamos
    }
  }
  
  // Función privada para configurar todos los eventos (clicks)
  private setupEventListeners() {
    if (!this.shadowRoot) return; // Si no hay shadow DOM, no hacemos nada
    
    // Configuramos el botón "Volver"
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      // Cuando se hace click en "Volver", ejecutamos handleBackClick
      backButton.addEventListener('click', this.handleBackClick.bind(this));
    }
    
    // Configuramos el botón "Guardar"
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      // Cuando se hace click en "Guardar", ejecutamos handleSaveClick
      saveButton.addEventListener('click', this.handleSaveClick.bind(this));
    }
  }
  
  // Función privada para quitar todos los eventos
  private removeEventListeners() {
    if (!this.shadowRoot) return;
    
    // Quitamos el evento del botón "Volver"
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.removeEventListener('click', this.handleBackClick.bind(this));
    }
    
    // Quitamos el evento del botón "Guardar"
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.removeEventListener('click', this.handleSaveClick.bind(this));
    }
  }
  
  // Función privada que maneja los cambios de tamaño de pantalla
  private resizeHandler() {
    // Obtenemos referencias a los elementos que queremos mostrar/ocultar
    const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
    const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
    const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
    const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;
    
    // Si encontramos todos los elementos
    if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
      // Si la pantalla es pequeña (móvil)
      if (window.innerWidth <= 900) {
        responsiveHeader.style.display = 'block'; // Mostrar header móvil
        normalHeader.style.display = 'none'; // Ocultar header normal
        responsiveNav.style.display = 'block'; // Mostrar navegación móvil
        sidebar.style.display = 'none'; // Ocultar sidebar
      } else {
        // Si la pantalla es grande (escritorio)
        responsiveHeader.style.display = 'none'; // Ocultar header móvil
        normalHeader.style.display = 'block'; // Mostrar header normal
        responsiveNav.style.display = 'none'; // Ocultar navegación móvil
        sidebar.style.display = 'block'; // Mostrar sidebar
      }
    }
  }
  
  // Función privada que se ejecuta cuando se hace click en "Volver"
  private handleBackClick() {
    // Creamos un evento personalizado para navegar de vuelta a configuraciones
    const navEvent = new CustomEvent('navigate', {
        detail: '/configurations', // La página a la que queremos ir
        bubbles: true, // El evento puede subir por el DOM
        composed: true // El evento puede salir del shadow DOM
    });
    // Enviamos el evento globalmente para que otros componentes lo escuchen
    document.dispatchEvent(navEvent);
  }
  
  // Función privada que se ejecuta cuando se hace click en "Guardar"
  private handleSaveClick() {
    // Obtenemos el campo de texto donde el usuario escribió
    const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
    
    // Si no hay campo o está vacío, mostramos un error
    if (!inputField || !inputField.value.trim()) {
      alert('Por favor ingresa un nuevo nombre de usuario');
      return; // Salimos de la función sin hacer nada más
    }

    // Obtenemos el nuevo nombre (sin espacios al inicio y final)
    const newUsername = inputField.value.trim();
    console.log(' Intentando cambiar username a:', newUsername);
    
    // Verificamos que el sistema Flux esté disponible
    if (!window.UserActions) {
      console.error(' UserActions no disponible');
      alert('Error: Sistema de usuario no disponible');
      return;
    }

    try {
      // Intentamos actualizar el username usando el sistema Flux
      window.UserActions.updateUsername(newUsername);
      console.log(' Username actualizado via Flux');
      
      // Limpiamos el campo de texto
      inputField.value = '';
      
      // Mostramos un mensaje de éxito bonito
      this.showSuccessMessage();
      
      // Emitimos un evento para informar que se guardó
      this.dispatchEvent(new CustomEvent('save', { 
        detail: { newUsername } 
      }));
      
    } catch (error) {
      // Si algo sale mal, mostramos un error
      console.error(' Error:', error);
      alert('Error al actualizar el nombre de usuario');
    }
  }

  // Función privada para mostrar un mensaje de éxito elegante
  private showSuccessMessage(): void {
    // Creamos un elemento div para el mensaje
    const toast = document.createElement('div');
    
    // Le damos estilos CSS para que se vea bonito
    toast.style.cssText = `
        position: fixed; /* Se queda fijo en la pantalla */
        top: 20px; /* A 20px del borde superior */
        right: 20px; /* A 20px del borde derecho */
        background: linear-gradient(135deg, #4CAF50, #45a049); /* Fondo verde gradiente */
        color: white; /* Texto blanco */
        padding: 16px 24px; /* Espacio interno */
        border-radius: 12px; /* Bordes redondeados */
        z-index: 10001; /* Por encima de todo */
        font-family: Arial, sans-serif; /* Fuente */
        font-weight: 600; /* Texto en negrita */
        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3); /* Sombra */
        transform: translateX(100%); /* Inicialmente fuera de la pantalla */
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Animación suave */
        backdrop-filter: blur(10px); /* Efecto de desenfoque */
        border: 1px solid rgba(255, 255, 255, 0.2); /* Borde semitransparente */
    `;
    
    // El texto que se muestra
    toast.textContent = ' Tu nombre de usuario cambió con éxito';
    
    // Añadimos el mensaje a la página
    document.body.appendChild(toast);
    
    // Animación de entrada: el mensaje entra desde la derecha
    setTimeout(() => {
        toast.style.transform = 'translateX(0)'; // Lo movemos a su posición final
    }, 100);
    
    // Después de 3 segundos, lo sacamos de la pantalla
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)'; // Lo movemos fuera de la pantalla
        
        // Y después de la animación, lo eliminamos completamente
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 400);
    }, 3000); // 3000 milisegundos = 3 segundos
  }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default NombreUsuraio;