// Definimos una clase que representa la página para cambiar el nombre de usuario
class NombreUsuraio extends HTMLElement {
  private username: string;
  
  constructor() {
    super();
    
    this.username = this.getAttribute('username') || '';
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
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
            padding-bottom: 80px;
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
            .header-wrapper {
              display: none;
            }
            
            .sidebar-wrapper {
              display: none;
            }
            
            .content-container {
              padding-left: 10px;
              padding-right: 10px;
              padding-top: 10px;
            }
            
            .form-container {
              padding: 20px;
              margin: 10px 0;
              box-shadow: none;
              border-radius: 8px;
            }
            
            .title {
              font-size: 20px;
            }
            
            .responsive-nav {
              display: block;
            }
          }
          
          @media (max-width: 600px) {
            .form-container {
              padding: 15px;
              margin: 5px;
            }
            
            .title {
              font-size: 18px;
            }
            
            .input-field {
              padding: 12px;
              font-size: 14px;
            }
            
            .save-button {
              width: 100%;
              padding: 14px;
            }
          }
        </style>
        
        <lulada-responsive-header style="display: none;"></lulada-responsive-header>
        
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
              <h2 class="title">Cambiar nombre de usuario</h2>
              <p class="subtitle">Nombre de usuario actual</p>
              <p class="subtitle2">@CrisTiJauregui</p>
              <p class="current-username">${this.username}</p>
              
              <input type="text" id="username-input" class="input-field" placeholder="Nuevo nombre de usuario">
              
              <button id="save-btn" class="save-button">Guardar</button>
            </div>
          </div>
        </div>
        
        <div class="responsive-nav">
          <lulada-responsive-bar></lulada-responsive-bar>
        </div>
      `;
    }
    
    this.resizeHandler = this.resizeHandler.bind(this);
    this.resizeHandler();
  }
  
  static get observedAttributes() {
    return ['username'];
  }
  
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'username' && oldValue !== newValue) {
      this.username = newValue;
      this.updateUsername();
    }
  }
  
  connectedCallback() {
    console.log('CambiarNU añadido al DOM');
    this.setupEventListeners();
    window.addEventListener('resize', this.resizeHandler);
  }
  
  disconnectedCallback() {
    console.log('CambiarNU eliminado del DOM');
    this.removeEventListeners();
    window.removeEventListener('resize', this.resizeHandler);
  }
  
  private updateUsername() {
    if (!this.shadowRoot) return;
    
    const currentUsernameEl = this.shadowRoot.querySelector('.current-username');
    if (currentUsernameEl) {
      currentUsernameEl.textContent = this.username;
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
  
  private resizeHandler() {
    const responsiveHeader = this.shadowRoot?.querySelector('lulada-responsive-header') as HTMLElement;
    const normalHeader = this.shadowRoot?.querySelector('.header-wrapper') as HTMLElement;
    const responsiveNav = this.shadowRoot?.querySelector('.responsive-nav') as HTMLElement;
    const sidebar = this.shadowRoot?.querySelector('.sidebar-wrapper') as HTMLElement;
    
    if (responsiveHeader && normalHeader && responsiveNav && sidebar) {
      if (window.innerWidth <= 900) {
        responsiveHeader.style.display = 'block';
        normalHeader.style.display = 'none';
        responsiveNav.style.display = 'block';
        sidebar.style.display = 'none';
      } else {
        responsiveHeader.style.display = 'none';
        normalHeader.style.display = 'block';
        responsiveNav.style.display = 'none';
        sidebar.style.display = 'block';
      }
    }
  }
  
  private handleBackClick() {
    const navEvent = new CustomEvent('navigate', {
        detail: '/configurations',
        bubbles: true,
        composed: true
    });
    document.dispatchEvent(navEvent);
  }
  
  private handleSaveClick() {
    const inputField = this.shadowRoot?.querySelector('#username-input') as HTMLInputElement;
    
    if (!inputField || !inputField.value.trim()) {
      alert('Por favor ingresa un nuevo nombre de usuario');
      return;
    }

    const newUsername = inputField.value.trim();
    console.log(' Intentando cambiar username a:', newUsername);
    
    if (!window.UserActions) {
      console.error(' UserActions no disponible');
      alert('Error: Sistema de usuario no disponible');
      return;
    }

    try {
      window.UserActions.updateUsername(newUsername);
      console.log(' Username actualizado via Flux');
      
      inputField.value = '';
      this.showSuccessMessage();
      
      this.dispatchEvent(new CustomEvent('save', { 
        detail: { newUsername } 
      }));
      
    } catch (error) {
      console.error(' Error:', error);
      alert('Error al actualizar el nombre de usuario');
    }
  }

  private showSuccessMessage(): void {
    const toast = document.createElement('div');
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10001;
        font-family: Arial, sans-serif;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    toast.textContent = ' Tu nombre de usuario cambió con éxito';
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 400);
    }, 3000);
  }
}

export default NombreUsuraio;