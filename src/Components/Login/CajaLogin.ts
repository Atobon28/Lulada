// Esta clase crea un formulario de inicio de sesión personalizado
class LoginForm extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un Shadow DOM para aislar nuestros estilos del resto de la página
        this.attachShadow({ mode: 'open' });
        
        // Verificamos que el Shadow DOM se haya creado correctamente
        if (this.shadowRoot) {
            // Insertamos todo el HTML y CSS del formulario
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                /* Estilos para el contenedor principal del formulario */
                .login-container {
                    width: 350px;              /* Ancho fijo del formulario */
                    padding: 25px;             /* Espacio interno */
                    background: white;         /* Fondo blanco */
                    border-radius: 15px;       /* Bordes redondeados */
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* Sombra suave */
                    text-align: center;        /* Centrar todo el contenido */
                }

                /* Estilos para la línea divisoria */
                .linea {
                    width: 100%;               /* Ocupa todo el ancho */
                    border: 0.5px solid #D9D9D9;  /* Línea gris clara */
                    margin: 15px 0;            /* Margen arriba y abajo */
                }

                /* Estilos para el texto "¿Olvidaste tu contraseña?" */
                .forgot-password {
                    font-size: 14px;           /* Tamaño de fuente pequeño */
                    color: #555;               /* Color gris */
                    margin: 15px 0;           /* Margen arriba y abajo */
                    cursor: pointer;          /* Cursor de mano al pasar por encima */
                }

                /* Estilos para el botón de registro */
                .register-button {
                    display: block;            /* Elemento de bloque */
                    width: 100%;              /* Ocupa todo el ancho */
                    padding: 12px;            /* Espacio interno */
                    background-color: #F4B400; /* Color amarillo/dorado */
                    border: none;             /* Sin borde */
                    color: white;             /* Texto blanco */
                    border-radius: 10px;      /* Bordes redondeados */
                    font-size: 16px;          /* Tamaño de fuente */
                    cursor: pointer;          /* Cursor de mano */
                    text-align: center;       /* Texto centrado */
                    font-weight: bold;        /* Texto en negrita */
                    margin-top: 5px;          /* Margen superior */
                }

                /* Efecto hover para el botón de registro */
                .register-button:hover {
                    background-color: #E09E00; /* Color más oscuro al pasar el mouse */
                }
                
                /* Estilos para el componente de texto personalizado */
                caja-de-texto {
                    display: block;            /* Elemento de bloque */
                    margin-bottom: 15px;       /* Margen inferior */
                }
                </style>
                
                <!-- Estructura HTML del formulario -->
                <div class="login-container">
                    <!-- Componente personalizado para los campos de texto (usuario y contraseña) -->
                    <caja-de-texto></caja-de-texto>
                    
                    <!-- Componente personalizado para el botón de iniciar sesión -->
                    <boton-login></boton-login>
                    
                    <!-- Texto para recuperar contraseña -->
                    <p class="forgot-password">¿Olvidaste tu contraseña?</p>
                    
                    <!-- Línea divisoria -->
                    <div class="linea"></div>
                    
                    <!-- Botón para ir a la página de registro -->
                    <button class="register-button">Registrate</button>
                </div>
            `;
        } else {
            // Si no se pudo crear el Shadow DOM, mostramos un error en la consola
            console.error('shadowRoot is null');
        }
    }
}

// Exportamos la clase para poder usarla en otros archivos
export default LoginForm;