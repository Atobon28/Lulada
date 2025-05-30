// Clase que crea la página de registro de nuevos usuarios
class RegisterNewAccount extends HTMLElement {
  // Variable para guardar si el usuario eligió "persona" o "restaurante"
  private selectedRole: string = '';

  constructor() {
    super();
    // Crea un espacio aislado para el HTML y CSS de este componente
    this.attachShadow({ mode: "open" });
  }

  // Se ejecuta automáticamente cuando el componente se añade a la página
  connectedCallback() {
    this.render(); // Dibuja la página
    this.setupEventListeners(); // Configura los eventos (clicks, etc.)
  }

  // Función que dibuja toda la página de registro
  render() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = /*html*/ `
        <style>
          /* === ESTILOS CSS === */
          
          /* Estilo principal del componente - ocupa toda la pantalla */
          :host {
            display: block;
            font-family: 'Poppins', sans-serif;
            width: 100%;
            min-height: 100vh; /* Altura mínima de toda la pantalla */
            background: linear-gradient(135deg, #f5f7fa 0%,rgb(255, 255, 255) 100%); /* Fondo degradado */
            overflow-x: hidden; /* No permite scroll horizontal */
          }

          /* Título principal del formulario */
          #title {
            font-size: 20px;
            color: #333;
            font-weight: bold;
            margin: 0 0 25px 0;
            text-align: center;
          }

          /* Contenedor principal que centra todo */
          .main {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: column; /* Elementos en columna */
            justify-content: center; /* Centrado vertical */
            align-items: center; /* Centrado horizontal */
            padding: 20px;
            box-sizing: border-box;
          }

          /* Caja blanca que contiene el formulario */
          .from-container {
            font-family: 'Poppins', sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: white; /* Fondo blanco */
            padding: 30px; /* Espacio interno */
            border-radius: 20px; /* Esquinas redondeadas */
            box-shadow: 0 8px 25px rgba(0,0,0,0.1); /* Sombra suave */
            background-color: rgb(246, 245, 245);
            width: 100%;
            max-width: 600px; /* Ancho máximo */
            box-sizing: border-box;
          }

          /* Contenedor para los campos de texto (nombre, apellido, etc.) */
          .container-input {
            display: flex;
            flex-direction: column;
            gap: 8px; /* Espacio entre campos */
            width: 90%;
            margin-top: 10px;
            margin-bottom: 30px;
          }

          /* Sección donde el usuario elige si es persona o restaurante */
          .role-selection {
            width: 90%;
            margin: 20px 0 25px 0;
          }

          /* Título de la sección de selección de rol */
          .role-title {
            font-size: 14px;
            color: #333;
            font-weight: 90;
            margin-bottom: 20px;
            text-align: center;
          }

          /* Contenedor de las opciones (persona/restaurante) */
          .options-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            width: 100%;
          }

          /* Cada opción (persona o restaurante) */
          .option-label {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #333;
            cursor: pointer; /* Cursor de mano al pasar por encima */
            padding: 15px;
            border: 2px solidrgb(255, 255, 255);
            border-radius: 12px;
            transition: all 0.3s ease; /* Animación suave */
            background: white;
          }

          /* Efecto cuando pasas el mouse por una opción */
          .option-label:hover {
            border-color: #AAAB54; /* Borde verde */
            box-shadow: 0 4px 12px rgba(170, 171, 84, 0.2); /* Sombra */
            transform: translateY(-2px); /* Se eleva un poco */
          }

          /* Estilo cuando una opción está seleccionada */
          .option-label.selected {
            border-color: #AAAB54;
            background-color: rgba(170, 171, 84, 0.1); /* Fondo verde claro */
            box-shadow: 0 4px 12px rgba(170, 171, 84, 0.3);
          }

          /* La cajita del checkbox personalizado */
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
            flex-shrink: 0; /* No se encoge */
          }

          /* Cuando el checkbox está marcado */
          .checkbox-input:checked + .custom-checkbox {
            background-color: #AAAB54; /* Fondo verde */
            border-color: #AAAB54;
          }

          /* La palomita que aparece cuando está marcado */
          .checkbox-input:checked + .custom-checkbox::after {
            content: '✓';
            color: white;
            font-weight: bold;
            font-size: 14px;
          }

          /* Oculta el checkbox original del navegador */
          .checkbox-input {
            display: none;
          }

          /* Botón de "Continuar" */
          .continue-btn {
            background: #E0A800; /* Color dorado */
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

          /* Efecto hover del botón continuar (solo si no está deshabilitado) */
          .continue-btn:hover:not(:disabled) {
            background: rgb(183, 140, 21); /* Color más oscuro */
            transform: translateY(-1px); /* Se eleva un poco */
          }

          /* Cuando el botón está deshabilitado */
          .continue-btn:disabled {
            background: #ccc; /* Color gris */
            cursor: not-allowed; /* Cursor de prohibido */
            transform: none; /* Sin elevación */
          }

          /* Línea divisoria */
          .line {
            width: 90%;
            height: 1px;
            background-color: rgb(155, 148, 148);
            margin-top: 28px;
            margin-bottom: 15px;
          }

          /* Sección de "¿Ya tienes cuenta?" */
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

          /* Botón de "Iniciar sesión" */
          .login-btn {
            background: #AAAB54; /* Color verde */
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
          }

          .login-btn:hover {
            background: rgb(132, 134, 58); /* Verde más oscuro */
          }

          /* === DISEÑO RESPONSIVE === */
          /* Para tablets (pantallas de hasta 768px) */
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

          /* Para móviles (pantallas de hasta 480px) */
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

          /* Para móviles muy pequeños (320px) */
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
            
            /* Estilos responsive adicionales para móviles */
            @media (max-width: 900px) {
                /* MOSTRAR header responsive en móvil */
                .responsive-header {
                    display: block !important;
                }
                
                /* OCULTAR logo de desktop en móvil */
                .desktop-logo {
                    display: none !important;
                }
                
                .sidebar {
                    display: none;
                }
                
                .suggestions-section {
                    display: none;
                }
                
                .responsive-bar {
                    display: block;
                }
                
                .reviews-section {
                    margin-left: 1rem;
                    margin-right: 1rem;
                }

                .saved-header {
                    margin-bottom: 20px;
                    padding: 15px;
                }

                .saved-header h2 {
                    font-size: 20px;
                }
            }
          }
        </style>

        <!-- === HTML DE LA PÁGINA === -->
        <div class="main">
          <!-- Logo de Lulada en la parte superior -->
          <lulada-logo></lulada-logo>
          
          <!-- Formulario principal -->
          <div class="from-container">
            <h2 id="title">Registrate</h2>
            
            <!-- Campos de texto para datos personales -->
            <div class="container-input">
              <lulada-boxtext placeholder="Nombre"></lulada-boxtext>
              <lulada-boxtext placeholder="Apellido"></lulada-boxtext>
              <lulada-boxtext placeholder="Correo Electronico"></lulada-boxtext>
              <lulada-boxtext placeholder="Contraseña"></lulada-boxtext>
            </div>

            <!-- Sección para elegir tipo de cuenta -->
            <div class="role-selection">
              <div class="role-title">¿Cómo quieres usar Lulada?</div>
              <div class="options-container">
                <!-- Opción "Persona" -->
                <label class="option-label">
                  <input type="checkbox" class="checkbox-input" id="person-checkbox" name="userType" value="person">
                  <span class="custom-checkbox"></span>
                  Persona
                </label>
                
                <!-- Opción "Restaurante" -->
                <label class="option-label">
                  <input type="checkbox" class="checkbox-input" id="restaurant-checkbox" name="userType" value="restaurant">
                  <span class="custom-checkbox"></span>
                  Restaurante
                </label>
              </div>
            </div>

            <!-- Botón para continuar (inicialmente deshabilitado) -->
            <button class="continue-btn" id="continue-button" disabled>Continuar</button>
            
            <!-- Línea divisoria -->
            <div class="line"></div>
            
            <!-- Sección para usuarios que ya tienen cuenta -->
            <div class="container-new-account">
              <p>¿Ya tienes una cuenta?</p>
              <button class="login-btn" id="login-button">Iniciar sesión</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Función que configura todos los eventos (clicks, cambios, etc.)
  setupEventListeners() {
    if (!this.shadowRoot) return;
    
    // Obtener elementos del formulario
    const personCheckbox = this.shadowRoot.getElementById('person-checkbox') as HTMLInputElement;
    const restaurantCheckbox = this.shadowRoot.getElementById('restaurant-checkbox') as HTMLInputElement;
    const continueButton = this.shadowRoot.getElementById('continue-button') as HTMLButtonElement;
    const loginButton = this.shadowRoot.getElementById('login-button') as HTMLButtonElement;

    // Evento cuando el usuario marca "Persona"
    personCheckbox?.addEventListener('change', () => {
      if (personCheckbox.checked) {
        // Si marca "Persona", desmarca "Restaurante"
        restaurantCheckbox.checked = false;
        this.selectedRole = 'person'; // Guarda la selección
        // Añade estilo visual de selección
        personCheckbox.closest('.option-label')?.classList.add('selected');
        restaurantCheckbox.closest('.option-label')?.classList.remove('selected');
      } else {
        // Si desmarca, no hay selección
        this.selectedRole = '';
        personCheckbox.closest('.option-label')?.classList.remove('selected');
      }
      this.updateContinueButton(); // Actualiza estado del botón
    });

    // Evento cuando el usuario marca "Restaurante"
    restaurantCheckbox?.addEventListener('change', () => {
      if (restaurantCheckbox.checked) {
        // Si marca "Restaurante", desmarca "Persona"
        personCheckbox.checked = false;
        this.selectedRole = 'restaurant'; // Guarda la selección
        // Añade estilo visual de selección
        restaurantCheckbox.closest('.option-label')?.classList.add('selected');
        personCheckbox.closest('.option-label')?.classList.remove('selected');
      } else {
        // Si desmarca, no hay selección
        this.selectedRole = '';
        restaurantCheckbox.closest('.option-label')?.classList.remove('selected');
      }
      this.updateContinueButton(); // Actualiza estado del botón
    });

    // Evento cuando se hace click en "Continuar"
    continueButton?.addEventListener('click', () => {
      this.handleContinue();
    });

    // Evento cuando se hace click en "Iniciar sesión"
    loginButton?.addEventListener('click', () => {
      window.location.href = '/login'; // Navega a la página de login
    });
  }

  // Función que habilita/deshabilita el botón "Continuar"
  updateContinueButton() {
    const continueButton = this.shadowRoot?.getElementById('continue-button') as HTMLButtonElement;
    if (!continueButton) return;

    // Solo habilita el botón si se seleccionó un rol
    continueButton.disabled = !this.selectedRole;
  }

  // Función que maneja lo que pasa cuando se hace click en "Continuar"
  handleContinue() {
    // Si no se seleccionó ningún rol, muestra un error
    if (!this.selectedRole) {
      alert('Por favor, selecciona un tipo de cuenta.');
      return;
    }

    // Muestra mensaje de éxito dependiendo del rol seleccionado
    const roleText = this.selectedRole === 'person' ? 'Persona' : 'Restaurante';
    alert(`¡Registro exitoso! Tu cuenta como ${roleText} ha sido creada.`);
    
    // Redirige al usuario a la página principal
    window.location.href = '/home';
  }
  
  // Función que ajusta la página para diferentes tamaños de pantalla
  handleResize() {
    const sidebar = this.shadowRoot?.querySelector('.sidebar') as HTMLDivElement;
    const suggestions = this.shadowRoot?.querySelector('.suggestions-section') as HTMLDivElement;
    const responsiveBar = this.shadowRoot?.querySelector('.responsive-bar') as HTMLDivElement;
    
    // Si la pantalla es menor a 900px, oculta sidebar y sugerencias, muestra barra móvil
    if (sidebar && suggestions && responsiveBar) {
        if (window.innerWidth < 900) {
            sidebar.style.display = 'none'; // Oculta la barra lateral
            suggestions.style.display = 'none'; // Oculta las sugerencias
            responsiveBar.style.display = 'block'; // Muestra la barra de navegación móvil
        } else {
            sidebar.style.display = 'block'; // Muestra la barra lateral
            suggestions.style.display = 'block'; // Muestra las sugerencias
            responsiveBar.style.display = 'none'; // Oculta la barra móvil
        }
    }
  }
}

export default RegisterNewAccount;