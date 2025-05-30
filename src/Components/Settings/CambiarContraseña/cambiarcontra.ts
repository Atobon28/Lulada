// Componente personalizado para cambiar contraseñas
class CambiarContra extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  
  connectedCallback() {
    this.setupEventListeners();
  }
  
  // Dibuja todo el HTML y CSS del componente
  private render() {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }
        
        .page-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 16px;
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
        }
        
        .back-arrow {
          margin-right: 8px;
        }
        
        .form-container {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 32px;
        }
        
        .title {
          font-size: 22px;
          font-weight: bold;
          color: #000;
          margin: 0 0 24px 0;
        }
        
        .input-field {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 16px;
          box-sizing: border-box;
        }
        
        .input-field::placeholder {
          color: #aaa;
        }
        
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
        
        .save-button:hover {
          background-color: #9aa732;
        }
      </style>
      
      <div class="page-container">
        <button id="back-btn" class="back-button">
          <span class="back-arrow">←</span> Volver
        </button>
        
        <div class="form-container">
          <h2 class="title">Cambiar contraseña</h2>
          
          <input type="password" id="current-password" class="input-field" placeholder="Contraseña actual">
          
          <input type="password" id="new-password" class="input-field" placeholder="Nueva Contraseña">
          
          <button id="save-btn" class="save-button">Guardar</button>
        </div>
      </div>
    `;
  }
  
  // Configura todos los eventos del componente
  private setupEventListeners() {
    if (!this.shadowRoot) return;
    
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.addEventListener('click', () => {
        // Envía evento para volver atrás
        this.dispatchEvent(new CustomEvent('back'));
      });
    }
    
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const currentPasswordField = this.shadowRoot?.querySelector('#current-password') as HTMLInputElement;
        const newPasswordField = this.shadowRoot?.querySelector('#new-password') as HTMLInputElement;
        
        if (currentPasswordField && newPasswordField) {
          const currentPassword = currentPasswordField.value;
          const newPassword = newPasswordField.value;
          
          if (currentPassword && newPassword) {
            // Envía evento con las contraseñas
            this.dispatchEvent(new CustomEvent('save', { 
              detail: { currentPassword, newPassword }
            }));
          }
        }
      });
    }
  }
}

export default CambiarContra;