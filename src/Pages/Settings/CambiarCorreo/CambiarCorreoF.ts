class CambiarCorreoF extends HTMLElement {
    private email: string;
    
    constructor() {
      super();
      this.email = this.getAttribute('email') || '';
      this.attachShadow({ mode: 'open' });
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: flex;
              flex-direction: column;
              width: 100%;
              height: 100vh;
              font-family: Arial, sans-serif;
              background-color: white;
            }
            .header-wrapper {
              width: 100%;
              background-color: white;
              padding: 20px 0 10px 20px;
              border-bottom: 1px solid #eaeaea;
            }
            .logo-container {
              width: 300px;
            }
            .main-container {
              display: flex;
              width: 100%;
              flex: 1;
              background-color: white;
              overflow: hidden;
            }
            .sidebar-wrapper {
              width: 250px;
              height: 100%;
              overflow-y: auto;
            }
            .content-container {
              flex-grow: 1;
              padding-left: 20px;
              padding-top: 20px;
              height: 100%;
              overflow-y: auto;
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
              max-width: 600px;
            }
            .title {
              font-size: 22px;
              font-weight: bold;
              color: #000;
              margin: 0 0 8px 0;
            }
            .subtitle {
              font-size: 16px;
              color: #aaa;
              margin: 0 0 4px 0;
            }
            .subtitle2 {
              font-size: 16px;
              margin: 0 0 4px 0;
            }
            .current-email {
              font-size: 16px;
              color: #333;
              margin-bottom: 24px;
            }
            .input-field {
              width: 100%;
              padding: 14px;
              font-size: 16px;
              border: 1px solid #ddd;
              border-radius: 8px;
              margin-bottom: 24px;
              box-sizing: border-box;
            }
            .input-field::placeholder {
              color: #ccc;
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
            }
            .save-button:hover {
              background-color: #9aa732;
            }
            ::slotted(lulada-sidebar) {
              height: 100%;
            }
          </style>
          
          <div class="header-wrapper">
            <div class="logo-container">
              <lulada-logo></lulada-logo>
            </div>
          </div>
          <div class="main-container">
            <div class="sidebar-wrapper">
              <lulada-sidebar></lulada-sidebar>
            </div>
            <div class="content-container">
              <button id="back-btn" class="back-button">
                <span class="back-arrow">←</span> Volver
              </button>
              
              <div class="form-container">
                <h2 class="title">Cambiar correo</h2>
                <p class="subtitle">Correo actual</p>
                <p class="subtitle2">cristijau@gmail.com</p>
                <p class="current-email">${this.email}</p>
                
                <input type="email" id="email-input" class="input-field" placeholder="Correo nuevo">
                
                <button id="save-btn" class="save-button">Guardar</button>
              </div>
            </div>
          </div>
        `;
      }
    }
    
    static get observedAttributes() {
      return ['email'];
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'email' && oldValue !== newValue) {
        this.email = newValue;
        this.updateEmail();
      }
    }
    
    connectedCallback() {
      console.log('Cambiarco añadido al DOM');
      this.setupEventListeners();
      
      
      setTimeout(() => {
        
      }, 0);
    }
    
    disconnectedCallback() {
      console.log('Cambiarco eliminado del DOM');
      this.removeEventListeners();
    }
    
    private updateEmail() {
      if (!this.shadowRoot) return;
      
      const currentEmailEl = this.shadowRoot.querySelector('.current-email');
      if (currentEmailEl) {
        currentEmailEl.textContent = this.email;
      }
    }
    
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
    
    private handleBackClick() {
      this.dispatchEvent(new CustomEvent('back'));
    }
    
    private handleSaveClick() {
      const inputField = this.shadowRoot?.querySelector('#email-input') as HTMLInputElement;
      if (inputField && inputField.value) {
        const newEmail = inputField.value;
        this.dispatchEvent(new CustomEvent('save', { 
          detail: { newEmail } 
        }));
      }
    }
  }
  
  export default CambiarCorreoF;