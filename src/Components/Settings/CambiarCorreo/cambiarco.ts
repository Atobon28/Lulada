class Cambiarco extends HTMLElement {
  private email: string;
  
  constructor() {
    super();
    this.email = this.getAttribute('email') || '';
    this.attachShadow({ mode: 'open' });
    this.render();
  }
  
  static get observedAttributes() {
    return ['email'];
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'email' && oldValue !== newValue) {
      this.email = newValue;
      this.render();
    }
  }
  
  connectedCallback() {
    this.setupEventListeners();
  }
  
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
      </style>
      
      <div class="page-container">
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
    `;
  }
  
  private setupEventListeners() {
    if (!this.shadowRoot) return;
    
    const backButton = this.shadowRoot.querySelector('#back-btn');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('back'));
      });
    }
    
    const saveButton = this.shadowRoot.querySelector('#save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const inputField = this.shadowRoot?.querySelector('#email-input') as HTMLInputElement;
        if (inputField && inputField.value) {
          const newEmail = inputField.value;
          this.dispatchEvent(new CustomEvent('save', { 
            detail: { newEmail } 
          }));
        }
      });
    }
  }
}


customElements.define('cambiar-correo', Cambiarco);
export default Cambiarco;