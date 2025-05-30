// Definimos una nueva clase que será nuestro componente web personalizado
class Cambiarco extends HTMLElement {
  // Variable privada para guardar el email actual del usuario
  private email: string;
  
  // Constructor: se ejecuta cuando se crea una nueva instancia del componente
  constructor() {
    // Llamamos al constructor de la clase padre (HTMLElement)
    super();
    // Obtenemos el email desde los atributos HTML, si no hay ninguno usamos texto vacío
    this.email = this.getAttribute('email') || '';
    // Creamos un shadow DOM para aislar los estilos de este componente
    this.attachShadow({ mode: 'open' });
    // Dibujamos el componente en pantalla
    this.render();
  }
  
  // Lista de atributos HTML que queremos "observar" para detectar cambios
  static get observedAttributes() {
    return ['email'];
  }
  
  // Se ejecuta automáticamente cuando cambia un atributo observado
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // Si cambió el atributo 'email' y realmente es diferente
    if (name === 'email' && oldValue !== newValue) {
      // Actualizamos nuestra variable interna
      this.email = newValue;
      // Volvemos a dibujar el componente con el nuevo valor
      this.render();
    }
  }
  
  // Se ejecuta cuando el componente se añade al DOM de la página
  connectedCallback() {
    // Configuramos los eventos (clicks, etc.)
    this.setupEventListeners();
  }
  
  // Función que dibuja todo el HTML y CSS del componente
  private render() {
    // Si no tenemos shadow DOM, no podemos dibujar nada
    if (!this.shadowRoot) return;
    
    // Aquí ponemos todo el HTML y CSS del formulario
    this.shadowRoot.innerHTML = `
      <style>
        /* Estilos CSS para que el componente se vea bonito */
        
        /* El componente principal */
        :host {
          display: block;
          font-family: sans-serif;
        }
        
        /* Contenedor principal con ancho limitado y centrado */
        .page-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 16px;
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
        
        /* Caja blanca que contiene el formulario */
        .form-container {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 32px;
        }
        
        /* Título principal "Cambiar correo" */
        .title {
          font-size: 22px;
          font-weight: bold;
          color: #000;
          margin: 0 0 8px 0;
        }
        
        /* Texto "Correo actual" en gris claro */
        .subtitle {
          font-size: 16px;
          color: #aaa;
          margin: 0 0 4px 0;
        }
        
        /* Texto que muestra el email actual */
        .subtitle2 {
          font-size: 16px;
          margin: 0 0 4px 0;
        }
        
        /* Área que muestra el email actual del usuario */
        .current-email {
          font-size: 16px;
          color: #333;
          margin-bottom: 24px;
        }
        
        /* Campo de texto donde el usuario escribe el nuevo email */
        .input-field {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 24px;
          box-sizing: border-box;
        }
        
        /* Color del texto de ayuda en el campo */
        .input-field::placeholder {
          color: #ccc;
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
        }
        
        /* Efecto cuando pasas el mouse sobre el botón guardar */
        .save-button:hover {
          background-color: #9aa732;
        }
      </style>
      
      <!-- HTML del formulario -->
      <div class="page-container">
        <!-- Botón para volver atrás -->
        <button id="back-btn" class="back-button">
          <span class="back-arrow">←</span> Volver
        </button>
        
        <!-- Formulario principal -->
        <div class="form-container">
          <h2 class="title">Cambiar correo</h2>
          <p class="subtitle">Correo actual</p>
          <p class="subtitle2">cristijau@gmail.com</p>
          <p class="current-email">${this.email}</p>
          
          <!-- Campo donde el usuario escribe el nuevo email -->
          <input type="email" id="email-input" class="input-field" placeholder="Correo nuevo">
          
          <!-- Botón para guardar los cambios -->
          <button id="save-btn" class="save-button">Guardar</button>
        </div>
      </div>
    `;
  }
  
  // Función que configura los eventos (qué pasa cuando haces click en los botones)
  private setupEventListeners() {
    // Si no hay shadow DOM, no podemos configurar eventos
    if (!this.shadowRoot) return;
    
    // Encontramos el botón "Volver"
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      // Cuando hagan click en "Volver"
      backButton.addEventListener('click', () => {
        // Enviamos un evento personalizado llamado 'back'
        // Otros componentes pueden escuchar este evento para saber que el usuario quiere volver
        this.dispatchEvent(new CustomEvent('back'));
      });
    }
    
    // Encontramos el botón "Guardar"
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      // Cuando hagan click en "Guardar"
      saveButton.addEventListener('click', () => {
        // Encontramos el campo de texto donde escribió el nuevo email
        const inputField = this.shadowRoot?.querySelector('#email-input') as HTMLInputElement;
        // Si existe el campo y tiene algo escrito
        if (inputField && inputField.value) {
          // Obtenemos el nuevo email que escribió
          const newEmail = inputField.value;
          // Enviamos un evento personalizado llamado 'save' con el nuevo email
          // Otros componentes pueden escuchar este evento para guardar el cambio
          this.dispatchEvent(new CustomEvent('save', { 
            detail: { newEmail } 
          }));
        }
      });
    }
  }
}

// Exportamos la clase para que otros archivos puedan usarla
export default Cambiarco;