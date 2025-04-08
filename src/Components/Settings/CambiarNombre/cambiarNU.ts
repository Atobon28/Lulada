class CambiarNU extends HTMLElement {
    private username: string;
    
    constructor() {
      super();
      this.username = this.getAttribute('username') || '';
      this.attachShadow({ mode: 'open' });
      this.render();
    }
    
    static get observedAttributes() {
      return ['username'];
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      if (name === 'username' && oldValue !== newValue) {
        this.username = newValue;
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
            .subtitle {
            font-size: 16px;
            margin: 0 0 4px 0;
          }
          
          .current-username {
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
            <h2 class="title">Cambiar nombre de usuario</h2>
            <p class="subtitle">Nombre de usuario actual</p>
            <p class="subtitle2">@CrisTiJauregui</p>
            <p class="current-username">${this.username}</p>
            
            <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
            
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
          const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
          if (inputField && inputField.value) {
            const newUsername = inputField.value;
            this.dispatchEvent(new CustomEvent('save', { 
              detail: { newUsername } 
            }));
          }
        });
      }
    }
  }
  export default CambiarNU;