// Definimos una nueva clase que será nuestro componente personalizado
// Esta clase extiende HTMLElement, lo que significa que se comporta como un elemento HTML
class CambiarNU extends HTMLElement {
  // Variable privada para guardar el nombre de usuario actual
  private username: string;
  
  // Constructor: se ejecuta cuando se crea una nueva instancia del componente
  constructor() {
    // Llamamos al constructor de la clase padre (HTMLElement)
    super();
    
    // Obtenemos el valor del atributo "username" del HTML, o usamos una cadena vacía si no existe
    this.username = this.getAttribute('username') || '';
    
    // Creamos un shadow DOM para aislar nuestros estilos del resto de la página
    this.attachShadow({ mode: 'open' });
    
    // Dibujamos el componente en la pantalla
    this.render();
  }
  
  // Esta función le dice al navegador qué atributos HTML debe "observar"
  // Si estos atributos cambian, se ejecutará automáticamente "attributeChangedCallback"
  static get observedAttributes() {
    return ['username']; // Solo observamos cambios en el atributo "username"
  }
  
  // Esta función se ejecuta automáticamente cuando cambia un atributo observado
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Si el atributo que cambió fue "username" y realmente cambió de valor
    if (name === 'username' && oldValue !== newValue) {
      // Actualizamos nuestra variable interna con el nuevo valor
      this.username = newValue;
      // Volvemos a dibujar el componente para mostrar el cambio
      this.render();
    }
  }
  
  // Esta función se ejecuta cuando el componente se añade al DOM de la página
  connectedCallback() {
    // Configuramos todos los eventos (clicks, cambios de texto, etc.)
    this.setupEventListeners();
  }
  
  // Esta función se encarga de "dibujar" todo el HTML y CSS del componente
  private render() {
    // Si no tenemos shadow DOM, no podemos dibujar nada
    if (!this.shadowRoot) return;
    
    // Aquí definimos todo el HTML y CSS que se va a mostrar
    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos CSS para que nuestro componente se vea bonito */
        
        /* El componente principal ocupa todo el ancho y usa una fuente estándar */
        :host {
          display: block;
          font-family: sans-serif;
        }
        
        /* Contenedor principal con ancho máximo y centrado */
        .page-container {
          max-width: 600px;      /* No más ancho que 600px */
          margin: 0 auto;        /* Centrado horizontalmente */
          padding: 16px;         /* Espacio interno de 16px */
        }
        
        /* Estilos para el botón "Volver" */
        .back-button {
          background: none;      /* Sin fondo */
          border: none;          /* Sin borde */
          cursor: pointer;       /* Cursor de mano al pasar por encima */
          display: flex;         /* Los elementos internos en fila */
          align-items: center;   /* Centrados verticalmente */
          padding: 8px 0;        /* Espacio interno arriba y abajo */
          color: #666;           /* Color gris */
          font-size: 16px;       /* Tamaño de fuente */
          margin-bottom: 16px;   /* Espacio abajo */
        }
        
        /* La flecha del botón "Volver" */
        .back-arrow {
          margin-right: 8px;     /* Espacio a la derecha de la flecha */
        }
        
        /* Contenedor principal del formulario */
        .form-container {
          background-color: white;           /* Fondo blanco */
          border-radius: 16px;               /* Bordes redondeados */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* Sombra suave */
          padding: 32px;                     /* Espacio interno */
        }
        
        /* Título principal */
        .title {
          font-size: 22px;        /* Tamaño grande */
          font-weight: bold;      /* Texto en negrita */
          color: #000;            /* Color negro */
          margin: 0 0 8px 0;      /* Sin margen arriba, 8px abajo */
        }
        
        /* Subtítulos informativos */
        .subtitle {
          font-size: 16px;        /* Tamaño mediano */
          color: #aaa;            /* Color gris claro */
          margin: 0 0 4px 0;      /* Sin margen arriba, 4px abajo */
        }
        
        /* Segundo subtítulo (parece que está duplicado en el original) */
        .subtitle {
          font-size: 16px;        /* Tamaño mediano */
          margin: 0 0 4px 0;      /* Sin margen arriba, 4px abajo */
        }
        
        /* Texto que muestra el nombre de usuario actual */
        .current-username {
          font-size: 16px;        /* Tamaño mediano */
          color: #333;            /* Color gris oscuro */
          margin-bottom: 24px;    /* Espacio abajo */
        }
        
        /* Campo de texto donde el usuario escribe */
        .input-field {
          width: 100%;                /* Ocupa todo el ancho disponible */
          padding: 14px;              /* Espacio interno */
          font-size: 16px;            /* Tamaño de fuente */
          border: 1px solid #ddd;     /* Borde gris claro */
          border-radius: 8px;         /* Bordes redondeados */
          margin-bottom: 24px;        /* Espacio abajo */
          box-sizing: border-box;     /* Incluye padding y border en el ancho total */
        }
        
        /* Texto de ejemplo dentro del campo de texto */
        .input-field::placeholder {
          color: #ccc;                /* Color gris muy claro */
        }
        
        /* Botón para guardar los cambios */
        .save-button {
          background-color: #b4c13b;  /* Color verde */
          color: white;               /* Texto blanco */
          border: none;               /* Sin borde */
          padding: 12px 24px;         /* Espacio interno */
          border-radius: 8px;         /* Bordes redondeados */
          font-weight: 600;           /* Texto semi-negrita */
          cursor: pointer;            /* Cursor de mano */
          font-size: 16px;            /* Tamaño de fuente */
        }
        
        /* Efecto cuando pasas el mouse por encima del botón */
        .save-button:hover {
          background-color: #9aa732;  /* Verde más oscuro */
        }
      </style>
      
      <!-- HTML del componente -->
      <div class="page-container">
        <!-- Botón para volver atrás -->
        <button id="back-btn" class="back-button">
          <span class="back-arrow">←</span> Volver
        </button>
        
        <!-- Formulario principal -->
        <div class="form-container">
          <h2 class="title">Cambiar nombre de usuario</h2>
          <p class="subtitle">Nombre de usuario actual</p>
          <p class="subtitle2">@CrisTiJauregui</p>
          <p class="current-username">${this.username}</p>
          
          <!-- Campo de texto para escribir el nuevo nombre de usuario -->
          <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
          
          <!-- Botón para guardar los cambios -->
          <button id="save-btn" class="save-button">Guardar</button>
        </div>
      </div>
    `;
  }
  
  // Esta función configura todos los eventos (clicks, cambios de texto, etc.)
  private setupEventListeners() {
    // Si no tenemos shadow DOM, no podemos configurar eventos
    if (!this.shadowRoot) return;
    
    // Buscamos el botón "Volver" en nuestro HTML
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      // Cuando alguien haga click en el botón "Volver"
      backButton.addEventListener('click', () => {
        // Enviamos un evento personalizado llamado 'back'
        // Otros componentes pueden escuchar este evento para saber que el usuario quiere volver
        this.dispatchEvent(new CustomEvent('back'));
      });
    }
    
    // Buscamos el botón "Guardar" en nuestro HTML
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      // Cuando alguien haga click en el botón "Guardar"
      saveButton.addEventListener('click', () => {
        // Buscamos el campo de texto donde el usuario escribió
        const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
        
        // Si encontramos el campo y tiene algo escrito
        if (inputField && inputField.value) {
          // Obtenemos lo que escribió el usuario
          const newUsername = inputField.value;
          
          // Enviamos un evento personalizado llamado 'save' con los datos
          // Otros componentes pueden escuchar este evento para guardar el nuevo nombre
          this.dispatchEvent(new CustomEvent('save', { 
            detail: { newUsername }  // Enviamos el nuevo nombre en los detalles del evento
          }));
        }
      });
    }
  }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default CambiarNU;