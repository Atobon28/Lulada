// Definimos una clase que crea un componente personalizado para mostrar el perfil del usuario
class UserSelftProfile extends HTMLElement {
    constructor() {
        // Llamamos al constructor de la clase padre (HTMLElement)
        super();
        
        // Creamos un shadow DOM para aislar nuestros estilos del resto de la página
        this.attachShadow({ mode: 'open' });

        // Si el shadow DOM se creó correctamente, agregamos nuestro contenido HTML y CSS
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* Estilos para el título "Publicaciones" */
                h1 {
                    font-family: 'Inter', sans-serif;  /* Fuente moderna */
                    font-weight: 600;                   /* Texto semi-negrita */
                    font-size: 20px;                    /* Tamaño de letra */
                    padding-left: 26px;                 /* Espacio a la izquierda */
                    margin-top: 0px;                    /* Sin margen superior */
                    color: #333;                        /* Color gris oscuro */
                }

                /* Contenedor principal que controla los márgenes laterales */
                .user-publication-Tittle {
                    margin-left: 5.8rem;    /* Margen izquierdo grande (pantallas grandes) */
                    margin-right: 5.8rem;   /* Margen derecho grande (pantallas grandes) */
                }

                /* Contenedor para la información completa del usuario */
                .userTopCompleto {
                    position: relative;  /* Posicionamiento relativo para otros elementos */
                }

                /* RESPONSIVE DESIGN: Adaptación para tablets */
                @media (max-width: 1024px) {
                    .user-publication-Tittle {
                        margin-left: 2rem;   /* Márgenes más pequeños en tablets */
                        margin-right: 2rem;
                    }
                    
                    h1 {
                        padding-left: 20px;  /* Menos padding en tablets */
                        font-size: 18px;     /* Texto un poco más pequeño */
                    }
                }

                /* RESPONSIVE DESIGN: Adaptación para móviles */
                @media (max-width: 768px) {
                    .user-publication-Tittle {
                        margin-left: 1rem;   /* Márgenes aún más pequeños */
                        margin-right: 1rem;
                    }
                    
                    h1 {
                        padding-left: 15px;     /* Menos padding */
                        font-size: 16px;        /* Texto más pequeño */
                        text-align: center;     /* Centrar el texto en móviles */
                        margin-top: 1rem;       /* Agregar margen superior */
                    }
                }

                /* RESPONSIVE DESIGN: Adaptación para móviles muy pequeños */
                @media (max-width: 480px) {
                    .user-publication-Tittle {
                        margin-left: 0.5rem;   /* Márgenes mínimos */
                        margin-right: 0.5rem;
                    }
                    
                    h1 {
                        padding-left: 10px;     /* Padding mínimo */
                        font-size: 14px;        /* Texto más pequeño */
                        margin-top: 0.5rem;     /* Margen superior reducido */
                    }
                }

            </style>
            
            <!-- Estructura HTML del componente -->
            <div class="user-publication-Tittle">
                <div class="userTopCompleto">
                    <!-- Componente que muestra la información del usuario (foto, nombre, etc.) -->
                    <user-info></user-info>
                    
                    <!-- Componente que muestra el botón de "Editar" perfil -->
                    <user-edit></user-edit>
                </div>
                
                <!-- Título de la sección de publicaciones -->
                <h1>Publicaciones</h1>
            </div>
            `;
        }
    }
}

// Exportamos la clase para que pueda ser usada en otros archivos
export default UserSelftProfile;