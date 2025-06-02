class RegisterNewAccount extends HTMLElement {
  private selectedRole: string = '';

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = /*html*/ `
        <style>
          :host {
            display: block;
            font-family: 'Poppins', sans-serif;
            width: 100%;
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%,rgb(255, 255, 255) 100%);
            overflow-x: hidden;
          }

          #title {
            font-size: 20px;
            color: #333;
            font-weight: bold;
            margin: 0 0 25px 0;
            text-align: center;
          }

          .main {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
          }

          .from-container {
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            background-color: rgb(246, 245, 245);
            width: 100%;
            max-width: 600px;
            box-sizing: border-box;
          }

          .container-input {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 90%;
            margin-top: 10px;
            margin-bottom: 30px;
          }

          
          .role-selection {
            width: 90%;
            margin: 20px 0 25px 0;
          }

          .role-title {
            font-size: 14px;
            color: #333;
          
            font-weight: 90;
            margin-bottom: 20px;
            text-align: center;
          }

          .options-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 100%;
          }

          .option-label {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #333;
            cursor: pointer;
            padding: 15px;
            border: 2px solidrgb(255, 255, 255);
            border-radius: 12px;
            transition: all 0.3s ease;
            background: white;
          }

          .option-label:hover {
            border-color: #AAAB54;
            box-shadow: 0 4px 12px rgba(170, 171, 84, 0.2);
            transform: translateY(-2px);
          }

          .option-label.selected {
            border-color: #AAAB54;
            background-color: rgba(170, 171, 84, 0.1);
            box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3);
          }

          .custom-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #ccc;
            border-radius: 4px;
            margin-right: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
          }

          .checkbox-input:checked + .custom-checkbox {
            background-color: #AAAB54;
            border-color: #AAAB54;
          }

          .checkbox-input:checked + .custom-checkbox::after {
            content: '✓';
            color: white;
            font-weight: bold;
            font-size: 14px;
          }

          .checkbox-input {
            display: none;
          }

          .continue-btn {
            background: #E0A800;
            color: white;
            border: none;
            padding: 12px 24px;
            width: 70%;
            cursor: pointer;
            border-radius: 8px;
            margin-top: 15px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .continue-btn:hover:not(:disabled) {
            background: rgb(183, 140, 21);
            transform: translateY(-1px);
          }

          .continue-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
          }

          .line {
            width: 90%;
            height: 1px;
            background-color: rgb(155, 148, 148);
            margin-top: 28px;
            margin-bottom: 15px;
          }

          .container-new-account {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
          }

          .container-new-account p {
            margin: 0;
            color: black;
            font-size: 16px;
          }

          .login-btn {
            background: #AAAB54;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }

          .login-btn:hover {
            background: rgb(132, 134, 58);
          }

          /* RESPONSIVE DESIGN */
          @media (max-width: 768px) {
            .main {
              padding: 15px;
              min-height: 100vh;
            }

            .from-container {
              padding: 30px 25px;
              max-width: 100%;
              margin: 0;
            }

            #title {
              font-size: 24px;
              margin-bottom: 20px;
            }

            .container-input {
              width: 100%;
              gap: 15px;
              margin-bottom: 25px;
            }

            .role-selection {
              width: 100%;
              margin: 15px 0 20px 0;
            }

            .role-title {
              font-size: 16px;
              margin-bottom: 15px;
            }

            .continue-btn {
              width: 100%;
              padding: 12px;
            }

            .line {
              width: 100%;
            }
          }

          @media (max-width: 480px) {
            .main {
              padding: 10px;
            }

            .from-container {
              padding: 25px 20px;
              border-radius: 15px;
            }

            #title {
              font-size: 22px;
              margin-bottom: 18px;
            }

            .container-input {
              gap: 12px;
              margin-bottom: 20px;
            }

            .role-selection {
              margin: 12px 0 18px 0;
            }

            .role-title {
              font-size: 15px;
              margin-bottom: 12px;
            }

            .option-label {
              padding: 12px;
              font-size: 15px;
            }

            .custom-checkbox {
              width: 18px;
              height: 18px;
            }

            .continue-btn {
              padding: 11px;
              font-size: 15px;
            }

            .container-new-account p {
              font-size: 15px;
            }

            .login-btn {
              padding: 9px 18px;
              font-size: 15px;
            }
          }

          @media (max-width: 320px) {
            .from-container {
              padding: 20px 15px;
            }

            #title {
              font-size: 20px;
            }

            .role-title {
              font-size: 14px;
            }

            .option-label {
              padding: 10px;
              font-size: 14px;
            }

            .custom-checkbox {
              width: 16px;
              height: 16px;
              margin-right: 10px;
            }
            /* Barra de navegación responsiva - oculta en desktop */
                    .responsive-nav-bar {
                        display: none;
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        background-color: white;
                        z-index: 1000;
                        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                    }

                    /* RESPONSIVE: Móvil */
                    @media (max-width: 900px) {
                        /* MOSTRAR header responsive en móvil */
                        .responsive-header {
                            display: block !important;
                        }
                        
                        /* OCULTAR header normal en móvil */
                        .header-wrapper {
                            display: none !important;
                        }
                        
                        /* Ocultar sidebar y suggestions en móvil */
                        .sidebar {
                            display: none !important;
                        }
                        .suggestions-section {
                            display: none !important;
                        }
                        
                        /* Mostrar barra de navegación inferior */
                        .responsive-nav-bar {
                            display: block !important;
                        }
                        
                        /* Ajustar contenido para la barra inferior */
                        .content {
                            padding-bottom: 80px;
                            width: 100%;
                        }
                        
                        .reviews-section {
                            padding: 15px;
                        }
                    }

                    @media (max-width: 600px) {
                        .reviews-section {
                            padding: 10px;
                        }
                        
                        .content {
                            padding-bottom: 85px;
                        }
                    }

                    /* Fallback si los componentes no cargan */
                    .fallback-content {
                        padding: 40px;
                        text-align: center;
                        background-color: white;
                        border-radius: 10px;
                        margin: 20px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .fallback-content h1 {
                        color: #AAAB54;
                        margin-bottom: 20px;
                    }

                    .fallback-content p {
                        color: #666;
                        line-height: 1.6;
                    }
          }
        </style>

        <div class="main">
          <lulada-logo></lulada-logo>
          
          <div class="from-container">
            <h2 id="title">Registrate</h2>
            
            <div class="container-input">
              <lulada-boxtext placeholder="Nombre"></lulada-boxtext>
              <lulada-boxtext placeholder="Apellido"></lulada-boxtext>
              <lulada-boxtext placeholder="Correo Electronico"></lulada-boxtext>
              <lulada-boxtext placeholder="Contraseña"></lulada-boxtext>
            </div>

            <div class="role-selection">
              <div class="role-title">¿Cómo quieres usar Lulada?</div>
              <div class="options-container">
                <label class="option-label">
                  <input type="checkbox" class="checkbox-input" id="person-checkbox" name="userType" value="person">
                  <span class="custom-checkbox"></span>
                  Persona
                </label>
                
                <label class="option-label">
                  <input type="checkbox" class="checkbox-input" id="restaurant-checkbox" name="userType" value="restaurant">
                  <span class="custom-checkbox"></span>
                  Restaurante
                </label>
              </div>
            </div>

            <button class="continue-btn" id="continue-button" disabled>Continuar</button>
            
            <div class="line"></div>
            
            <div class="container-new-account">
              <p>¿Ya tienes una cuenta?</p>
              <button class="login-btn" id="login-button">Iniciar sesión</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  setupEventListeners() {
    if (!this.shadowRoot) return;
// Obtener elementos 
    const personCheckbox = this.shadowRoot.getElementById('person-checkbox') as HTMLInputElement;
    const restaurantCheckbox = this.shadowRoot.getElementById('restaurant-checkbox') as HTMLInputElement;
    const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
    const loginButton = this.shadowRoot.getElementById('login-button') as HTMLButtonElement;

    // Lógica para manejar la selección de checkboxes (solo uno puede estar seleccionado)
    personCheckbox?.addEventListener('change', () => {
      if (personCheckbox.checked) {
        restaurantCheckbox.checked = false;
        this.selectedRole = 'person';
        personCheckbox.closest('.option-label')?.classList.add('selected');
        restaurantCheckbox.closest('.option-label')?.classList.remove('selected');
      } else {
        this.selectedRole = '';
        personCheckbox.closest('.option-label')?.classList.remove('selected');
      }
      this.updateContinueButton();
    });

    restaurantCheckbox?.addEventListener('change', () => {
      if (restaurantCheckbox.checked) {
        personCheckbox.checked = false;
        this.selectedRole = 'restaurant';
        restaurantCheckbox.closest('.option-label')?.classList.add('selected');
        personCheckbox.closest('.option-label')?.classList.remove('selected');
      } else {
        this.selectedRole = '';
        restaurantCheckbox.closest('.option-label')?.classList.remove('selected');
      }
      this.updateContinueButton();
    });

    // Continue button
    continueButton?.addEventListener('click', () => {
      this.handleContinue();
    });

    // Login button
    loginButton?.addEventListener('click', () => {
      window.location.href = '/login'; // o la ruta que necesites
    });
  }

  updateContinueButton() {
    const continueButton = this.shadowRoot?.getElementById('continue-button') as HTMLButtonElement;
    if (!continueButton) return;

    // Habilitar botón solo si se selecciona un rol
    continueButton.disabled = !this.selectedRole;
  }

  handleContinue() {
    if (!this.selectedRole) {
      alert('Por favor, selecciona un tipo de cuenta.');
      return;
    }

    // Mensaje de éxito
    const roleText = this.selectedRole === 'person' ? 'Persona' : 'Restaurante';
    alert(`¡Registro exitoso! Tu cuenta como ${roleText} ha sido creada.`);
    
    // Redirigir a home
    window.location.href = '/home';
  }
   handleResize() {
        const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
        const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
        const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;
//Si la pantalla es menor a 900px, oculta sidebar y sugerencias, muestra barra móvil
        if (sidebar && suggestions && responsiveBar) {
            if (window.innerWidth < 900) {
                sidebar.style.display = 'none';
                suggestions.style.display = 'none';
                responsiveBar.style.display = 'block';
            } else {
                sidebar.style.display = 'block';
                suggestions.style.display = 'block';
                responsiveBar.style.display = 'none';
            }
        }
    }
}

export default RegisterNewAccount;