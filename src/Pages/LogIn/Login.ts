// Definimos una nueva clase que extiende HTMLElement para crear un componente web personalizado
class LoginPage extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un Shadow DOM para aislar los estilos de este componente
        // El modo 'open' permite acceder al shadow DOM desde fuera si es necesario
        this.attachShadow({ mode: 'open' });
        
        // Verificamos que el shadow DOM se haya creado correctamente
        if (this.shadowRoot) {
            
            // Definimos todo el HTML y CSS del componente dentro del shadow DOM
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    /* Estilos para el componente principal */
                    :host {
                        font-family: Arial, sans-serif;
                    }
                    
                    /* Contenedor principal que ocupa toda la pantalla */
                    .login-page-container {
                        display: flex;                    /* Usar flexbox para layout */
                        justify-content: center;         /* Centrar horizontalmente */
                        align-items: center;             /* Centrar verticalmente */
                        height: 100vh;                   /* Altura completa de la pantalla */
                        background-color: white;         /* Fondo blanco */
                        padding: 20px;                   /* Espacio interno */
                    }
                    
                    /* Envoltorio que contiene el logo y el formulario */
                    .content-wrapper {
                        display: flex;                   /* Elementos en fila */
                        align-items: center;             /* Centrados verticalmente */
                        max-width: 900px;                /* Ancho máximo */
                        width: 100%;                     /* Usar todo el ancho disponible */
                    }
                    
                    /* Sección del logo (lado izquierdo) */
                    .logo-section {
                        display: flex;                   /* Usar flexbox */
                        flex-direction: column;          /* Elementos en columna */
                        align-items: center;             /* Centrar elementos */
                        flex: 1;                         /* Ocupar espacio disponible */
                        padding-right: 40px;             /* Espacio a la derecha */
                    }
                    
                    /* Imagen del logo */
                    .logo-section img {
                        width: 400px;                    /* Ancho fijo en desktop */
                        height: auto;                    /* Altura automática para mantener proporción */
                    }
                                
                    
                    /* Estilos responsivos para pantallas pequeñas (móviles/tablets) */
                    @media (max-width: 768px) {
                        /* Cambiar layout a columna en pantallas pequeñas */
                        .content-wrapper {
                            flex-direction: column;      /* Elementos uno debajo del otro */
                            gap: 30px;                   /* Espacio entre elementos */
                        }
                        
                        /* Quitar padding lateral en móvil */
                        .logo-section {
                            padding-right: 0;
                        }
                        
                        /* Logo más pequeño en móvil */
                        .logo-section img {
                            width: 150px;                /* Ancho reducido para móvil */
                        }
                    }
                </style>
                
               <!-- Estructura HTML del componente -->
               <div class="login-page-container">
                    <div class="content-wrapper">
            <!-- Sección que contiene el logo -->
            <div class="logo-section">
                <img 
                    src="https://i.postimg.cc/t44LmL1m/Capa-1.png" 
                    alt="Lulada Logo"
                >
            </div>
            
            <!-- Sección que contiene el formulario de login -->
            <div class="form-section">
                <!-- Componente personalizado que contiene el formulario -->
                <login-form></login-form>
            </div>
        </div>
    </div>
            `;
        } else {
            // Si por alguna razón no se pudo crear el shadow DOM, mostrar error en consola
            console.error('shadowRoot is null');
        }
    }
 }
 
 // Exportamos la clase para que pueda ser usada en otros archivos
 export default LoginPage;