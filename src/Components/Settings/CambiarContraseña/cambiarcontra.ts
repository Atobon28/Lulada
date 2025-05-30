// Definimos una nueva clase que crea un componente personalizado para cambiar contraseñas
class CambiarContra extends HTMLElement {
  constructor() {
    // Llamamos al constructor de la clase padre (HTMLElement)
    super();
    
    // Creamos un shadow DOM para aislar los estilos de este componente
    this.attachShadow({ mode: 'open' });
    
    // Dibujamos el contenido del componente en la pantalla
    this.render();
  }
  
  // Este método se ejecuta cuando el componente se añade al DOM de la página
  connectedCallback() {
    // Configuramos todos los eventos (clicks, etc.) del componente
    this.setupEventListeners();
  }
  
  // Esta función se encarga de dibujar todo el HTML y CSS del componente
  private render() {
    // Si no hay shadow DOM, no podemos dibujar nada
    if (!this.shadowRoot) return;
    
    // Aquí definimos todo el HTML y CSS que verá el usuario
    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos para el componente principal */
        :host {
          display: block;                    /* El componente se muestra como un bloque */
          font-family: sans-serif;          /* Usamos una fuente sin serifa */
        }
        
        /* Contenedor principal de la página */
        .page-container {
          max-width: 600px;                 /* Ancho máximo de 600px */
          margin: 0 auto;                   /* Centrado horizontalmente */
          padding: 16px;                    /* Espacio interno de 16px */
        }
        
        /* Estilos para el botón de "volver" */
        .back-button {
          background: none;                 /* Sin fondo */
          border: none;                     /* Sin borde */
          cursor: pointer;                  /* Cursor de mano al pasar por encima */
          display: flex;                    /* Elementos en fila */
          align-items: center;              /* Centrados verticalmente */
          padding: 8px 0;                  /* Espacio interno arriba y abajo */
          color: #666;                      /* Color gris */
          font-size: 16px;                 /* Tamaño de fuente */
          margin-bottom: 16px;             /* Margen inferior */
        }
        
        /* Espacio entre la flecha y el texto "Volver" */
        .back-arrow {
          margin-right: 8px;               /* Margen derecho de 8px */
        }
        
        /* Contenedor del formulario principal */
        .form-container {
          background-color: white;          /* Fondo blanco */
          border-radius: 16px;              /* Bordes redondeados */
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);  /* Sombra suave */
          padding: 32px;                    /* Espacio interno */
        }
        
        /* Estilos para el título "Cambiar contraseña" */
        .title {
          font-size: 22px;                 /* Tamaño de fuente grande */
          font-weight: bold;               /* Texto en negrita */
          color: #000;                      /* Color negro */
          margin: 0 0 24px 0;              /* Margen solo abajo */
        }
        
        /* Estilos para los campos de entrada de texto */
        .input-field {
          width: 100%;                      /* Ocupa todo el ancho disponible */
          padding: 14px;                    /* Espacio interno */
          font-size: 16px;                 /* Tamaño de fuente */
          border: 1px solid #ddd;          /* Borde gris claro */
          border-radius: 8px;              /* Bordes redondeados */
          margin-bottom: 16px;             /* Margen inferior */
          box-sizing: border-box;          /* Incluye padding y border en el ancho */
        }
        
        /* Color del texto de ayuda (placeholder) en los campos */
        .input-field::placeholder {
          color: #aaa;                      /* Color gris claro */
        }
        
        /* Estilos para el botón "Guardar" */
        .save-button {
          background-color: #b4c13b;       /* Color verde */
          color: white;                     /* Texto blanco */
          border: none;                     /* Sin borde */
          padding: 12px 24px;              /* Espacio interno */
          border-radius: 8px;              /* Bordes redondeados */
          font-weight: 600;                /* Texto semi-negrita */
          cursor: pointer;                  /* Cursor de mano */
          font-size: 16px;                 /* Tamaño de fuente */
          margin-top: 8px;                 /* Margen superior */
        }
        
        /* Efecto cuando pasas el mouse sobre el botón "Guardar" */
        .save-button:hover {
          background-color: #9aa732;       /* Color verde más oscuro */
        }
      </style>
      
      <!-- Contenedor principal de toda la página -->
      <div class="page-container">
        <!-- Botón para volver atrás -->
        <button id="back-btn" class="back-button">
          <span class="back-arrow">←</span> Volver
        </button>
        
        <!-- Formulario principal -->
        <div class="form-container">
          <!-- Título de la página -->
          <h2 class="title">Cambiar contraseña</h2>
          
          <!-- Campo para escribir la contraseña actual -->
          <input type="password" id="current-password" class="input-field" placeholder="Contraseña actual">
          
          <!-- Campo para escribir la nueva contraseña -->
          <input type="password" id="new-password" class="input-field" placeholder="Nueva Contraseña">
          
          <!-- Botón para guardar los cambios -->
          <button id="save-btn" class="save-button">Guardar</button>
        </div>
      </div>
    `;
  }
  
  // Esta función configura todos los eventos (clicks) del componente
  private setupEventListeners() {
    // Si no hay shadow DOM, no podemos configurar eventos
    if (!this.shadowRoot) return;
    
    // Buscamos el botón "Volver" en el DOM
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      // Cuando alguien hace click en "Volver"
      backButton.addEventListener('click', () => {
        // Enviamos un mensaje (evento) indicando que se quiere volver atrás
        this.dispatchEvent(new CustomEvent('back'));
      });
    }
    
    // Buscamos el botón "Guardar" en el DOM
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      // Cuando alguien hace click en "Guardar"
      saveButton.addEventListener('click', () => {
        // Obtenemos los campos de contraseña del formulario
        const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
        const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
        
        // Verificamos que ambos campos existan
        if (currentPasswordField && newPasswordField) {
          // Obtenemos el texto que escribió el usuario en cada campo
          const currentPassword = currentPasswordField.value;
          const newPassword = newPasswordField.value;
          
          // Solo procedemos si el usuario escribió algo en ambos campos
          if (currentPassword && newPassword) {
            // Enviamos un mensaje (evento) con las contraseñas para que otro componente las procese
            this.dispatchEvent(new CustomEvent('save', { 
              detail: { currentPassword, newPassword }  // Aquí van los datos que enviamos
            }));
          }
        }
      });
    }
  }
}

// Exportamos la clase para que se pueda usar en otros archivos
export default CambiarContra;