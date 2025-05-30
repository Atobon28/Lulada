// Importamos la función que nos ayuda a obtener datos de usuarios
import getUsers from "../../Services/UserServices";

// Definimos cómo debe verse un objeto Usuario
type User = {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText: string;
    menuLink: string;
    rol: string;
}

// Creamos una clase que define un componente web personalizado para mostrar información de restaurantes
class restaurantInfo extends HTMLElement {
    constructor() {
        super(); // Llamamos al constructor de la clase padre (HTMLElement)
        // Creamos un shadow DOM para aislar nuestros estilos del resto de la página
        this.attachShadow({ mode: 'open' });
    }

    // Esta función se ejecuta cuando el componente se conecta al DOM (se añade a la página)
    async connectedCallback() {
        // Verificamos que tenemos acceso al shadow DOM
        if (this.shadowRoot) {
            // Obtenemos la información de todos los usuarios de forma asíncrona
            const InformationResponse = await getUsers()
            
            // Definimos todo el HTML y CSS que va dentro de nuestro componente
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            /* Estilos para el contenedor principal del perfil */
            .userTopCompleto {
                background-color: #ffffff;        /* Fondo blanco */
                padding: 1.25rem;                 /* Espacio interno */
                border-radius: 0.9375rem;         /* Bordes redondeados */
                font-family: 'Inter', sans-serif; /* Tipo de letra */
                max-width: 90%;                   /* Ancho máximo */
                margin: auto;                     /* Centrado automático */
                margin-left: 5.8rem;             /* Margen izquierdo específico */
                margin-right: 5.8rem;            /* Margen derecho específico */
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
            }

            /* Estilos para la sección de etiquetados */
            .etiquetados {
                font-family: 'Inter', sans-serif;
                font-size: 0.80rem;               /* Tamaño de letra pequeño */
                font-weight: bold;                /* Texto en negrita */
                margin-left: 3rem;               /* Margen izquierdo */
            }
            
            /* Contenedor principal que organiza foto e información en fila */
            .userTop {
                display: flex;                    /* Elementos en fila */
                align-items: center;              /* Centrados verticalmente */
                gap: 1rem;                       /* Espacio entre elementos */
                min-width: 18.75rem;             /* Ancho mínimo */
                min-height: 6.25rem;             /* Alto mínimo */
            }
            
            /* Estilos para la foto del restaurante */
            .userTopFoto img {
                border-radius: 50%;               /* Forma circular */
                width: 13.4375rem;               /* Ancho fijo */
                height: 13.4375rem;              /* Alto fijo */
                object-fit: cover;               /* Ajustar imagen sin deformar */
            }
            
            /* Contenedor de la información del restaurante */
            .userTopInfo {
                flex: 1;                         /* Toma todo el espacio disponible */
            }
            
            /* Estilos para el nombre de usuario (@nombreusuario) */
            .nombreDeUsuario {
                font-size: 1.25rem;             /* Tamaño de letra mediano */
                color: #4D4D4D;                  /* Color gris */
                font-weight: bold;               /* Texto en negrita */
                margin-top: 0.8rem;             /* Margen superior */
                margin-bottom: 0.8rem;          /* Margen inferior */
            }
            
            /* Estilos para el nombre del restaurante */
            .nombre {
                font-size: 1.625rem;            /* Tamaño de letra grande */
                font-weight: bold;               /* Texto en negrita */
                color: #000;                     /* Color negro */
                margin-top: 0.4rem;             /* Margen superior */
                margin-bottom: 0.5rem;          /* Margen inferior */
            }
            
            /* Estilos para la descripción del restaurante */
            .descripcion {
                font-size: 1rem;                /* Tamaño de letra normal */
                color: #333;                     /* Color gris oscuro */
                margin-top: 0.375rem;           /* Margen superior */
                line-height: 1.4;               /* Altura de línea para mejor lectura */
            }
            
            /* Estilos para la línea separadora */
            hr {
                width: 100%;                     /* Ancho completo */
                border: 1px solid #D9D9D9;       /* Línea gris clara */
                margin: 0.5rem 0;               /* Margen vertical */
            }

            /* Contenedor para mostrar la ubicación */
            .location {
                display: flex;                   /* Elementos en fila */
                gap: 0.3rem;                    /* Espacio pequeño entre elementos */
                align-items: center;             /* Centrados verticalmente */
                margin-top: 0.05rem;            /* Margen superior pequeño */
                flex-wrap: wrap;                /* Permite que se envuelvan si no caben */
            }

            /* Estilos para el texto de ubicación */
            .locationText {
                font-size: 1rem;                /* Tamaño de letra normal */
                color: #666;                     /* Color gris */
            }

            /* Estilos para el icono de ubicación */
            .location-icon {
                width: 1.5rem;                  /* Ancho del icono */
                height: 1.5rem;                 /* Alto del icono */
                flex-shrink: 0;                 /* No se reduce si falta espacio */
            }

            /* Contenedor para el enlace del menú */
            .link {
                display: flex;                   /* Elementos en fila */
                gap: 0.3rem;                    /* Espacio pequeño entre elementos */
                align-items: center;             /* Centrados verticalmente */
                margin-top: 0.5rem;             /* Margen superior */
                flex-wrap: wrap;                /* Permite que se envuelvan si no caben */
            }

            /* Estilos para el enlace del menú */
            .MenuLink {
                color: #AAAB54;                  /* Color verde característico */
                text-decoration: none;           /* Sin subrayado por defecto */
                font-size: 1rem;                /* Tamaño de letra normal */
            }

            /* Efecto cuando pasas el mouse sobre el enlace */
            .MenuLink:hover {
                text-decoration: underline;      /* Aparece subrayado */
                color: #999A4A;                  /* Color verde más oscuro */
            }

            /* Estilos para las estrellas de calificación */
            .stars {
                color: #FFD700;                  /* Color dorado */
                font-size: 1.2rem;              /* Tamaño ligeramente más grande */
                margin-top: 0.5rem;             /* Margen superior */
            }

            /* === RESPONSIVE DESIGN === */
            /* Adaptaciones para tablets (pantallas medianas) */
            @media (max-width: 1024px) {
                .userTopCompleto {
                    margin-left: 2rem;          /* Menos margen en tablets */
                    margin-right: 2rem;         /* Menos margen en tablets */
                    max-width: 95%;              /* Más ancho en tablets */
                }
                
                .userTopFoto img {
                    width: 12rem;                /* Foto más pequeña en tablets */
                    height: 12rem;               /* Foto más pequeña en tablets */
                }
            }
            
            /* Adaptaciones para móviles (pantallas pequeñas) */
            @media (max-width: 768px) {
                .userTopCompleto {
                    margin-left: 1rem;          /* Margen mínimo en móviles */
                    margin-right: 1rem;         /* Margen mínimo en móviles */
                    max-width: 100%;             /* Ancho completo en móviles */
                    padding: 1rem;               /* Menos padding en móviles */
                }

                .userTop {
                    flex-direction: column;       /* Elementos en columna en lugar de fila */
                    text-align: center;          /* Texto centrado */
                    min-width: auto;             /* Sin ancho mínimo */
                    gap: 1rem;                   /* Espacio entre elementos */
                }

                .userTopFoto img {
                    width: 10rem;                /* Foto más pequeña en móviles */
                    height: 10rem;               /* Foto más pequeña en móviles */
                }
            
                .nombre {
                    font-size: 1.25rem;         /* Nombre más pequeño en móviles */
                    margin: 0.3rem 0;           /* Menos margen en móviles */
                }

                .etiquetados {
                    font-size: 0.65rem;         /* Texto más pequeño */
                    font-weight: bold;
                    margin-left: 1rem;          /* Menos margen */
                    text-align: center;          /* Centrado en móviles */
                }
            
                .nombreDeUsuario {
                    font-size: 1rem;            /* Username más pequeño en móviles */
                    margin: 0.3rem 0;           /* Menos margen en móviles */
                }
            
                .descripcion {
                    font-size: 0.85rem;         /* Descripción más pequeña en móviles */
                    margin: 0.3rem 0;           /* Menos margen en móviles */
                    text-align: center;          /* Centrado en móviles */
                }

                .location {
                    justify-content: center;     /* Ubicación centrada en móviles */
                    margin-top: 0.5rem;
                }

                .link {
                    justify-content: center;     /* Enlace centrado en móviles */
                }

                .stars {
                    font-size: 1rem;            /* Estrellas más pequeñas en móviles */
                    margin: 0.5rem 0;
                }

                .locationText {
                    font-size: 0.9rem;          /* Texto de ubicación más pequeño */
                    margin: 0.2rem;
                }
                
                .location-icon {
                    width: 1.2rem;              /* Icono más pequeño en móviles */
                    height: 1.2rem;
                    margin: 0.2rem;
                }

                .MenuLink {
                    font-size: 0.9rem;          /* Enlace más pequeño en móviles */
                    margin: 0.2rem; 
                }
            }

            /* Adaptaciones para móviles muy pequeños */
            @media (max-width: 480px) {
                .userTopCompleto {
                    margin: 0.5rem;             /* Margen mínimo */
                    padding: 0.75rem;           /* Padding reducido */
                }

                .userTopFoto img {
                    width: 8rem;                 /* Foto muy pequeña */
                    height: 8rem;
                }
                
                .nombre {
                    font-size: 1.1rem;          /* Nombre aún más pequeño */
                }
                
                .nombreDeUsuario {
                    font-size: 0.9rem;          /* Username aún más pequeño */
                }
                
                .descripcion {
                    font-size: 0.8rem;          /* Descripción aún más pequeña */
                }

                .etiquetados {
                    margin-left: 0.5rem;        /* Margen mínimo */
                }

                .stars {
                    font-size: 0.9rem;          /* Estrellas aún más pequeñas */
                }

                .locationText {
                    font-size: 0.8rem;          /* Texto muy pequeño */
                }
                
                .location-icon {
                    width: 1rem;                 /* Icono muy pequeño */
                    height: 1rem;
                }

                .MenuLink {
                    font-size: 0.8rem;          /* Enlace muy pequeño */
                }
            }
            </style>            
            
            <!-- Contenedor principal del perfil del restaurante -->
            <div class="userTopCompleto">
                
                <!-- Aquí filtramos los usuarios para mostrar solo los restaurantes -->
                ${InformationResponse.filter((User: User) => User.rol === "restaurante").map((User: User) => /*html*/ `   
                
                <!-- Contenedor de la información principal del restaurante -->
                <div class="userTop"> 
                    <!-- Sección de la foto del restaurante -->
                    <div class="userTopFoto">
                        <!-- Imagen con foto por defecto si no hay una específica -->
                        <img class="foto" src="${User.foto ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s'}">
                    </div>
                    
                    <!-- Sección con toda la información del restaurante -->
                    <div class="userTopInfo">
                        <!-- Nombre de usuario del restaurante (ej: @RestauranteX) -->
                        <p class="nombreDeUsuario">${User.nombreDeUsuario ?? 'Nombre de usuario por defecto'}</p>
                        
                        <!-- Nombre real del restaurante -->
                        <p class="nombre">${User.nombre ?? "Nombre por defecto"}</p>
                        
                        <!-- Línea separadora -->
                        <hr>
                        
                        <!-- Descripción del restaurante -->
                        <p class="descripcion">${User.descripcion ?? " "}</p>
                        
                        <!-- Contenedor para información adicional -->
                        <div class="additional-info">
                            <!-- Sección de ubicación con icono -->
                            <div class="location">
                                <!-- Icono de ubicación (SVG) -->
                                <svg class="action-icon location-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <!-- Texto con la ubicación del restaurante -->
                                <p class="locationText">${User.locationText ?? "No se ha registrado una ubicacion aun"}</p>
                            </div>
        
                        <!-- Sección del enlace al menú -->
                        <div class="link"> 
                            <!-- Icono de enlace (SVG) -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M12.243 3.757a2 2 0 0 0-2.829 0L7.293 5.88L5.879 4.464L8 2.344a4 4 0 0 1 5.657 0l.707.706l-.09.09A4 4 0 0 1 13.658 8l-2.121 2.121l-1.415-1.414l2.122-2.121a2 2 0 0 0 0-2.829Zm-8.486 8.486a2 2 0 0 0 2.829 0l2.121-2.122l1.414 1.415L8 13.655a4 4 0 0 1-5.657 0l-.707-.706l.09-.09A4 4 0 0 1 2.342 8l2.121-2.121L5.88 7.293L3.757 9.414a2 2 0 0 0 0 2.829"/><path d="M10.828 6.586L9.414 5.172L5.172 9.414l1.414 1.414z"/></g></svg>
                            <!-- Enlace al menú del restaurante -->
                            <a href="${User.menuLink}" class="MenuLink" target="_blank">${User.menuLink ?? 'Sin menú disponible'}</a>
                        </div>
        
                        <!-- Sección de calificación con estrellas -->
                        <div class="stars">
                            <!-- Muestra 5 estrellas doradas -->
                            ${'★'.repeat(5)}
                        </div> 
                    </div>
                </div>
            </div>
                `) . join('')}
                <!-- El .join('') une todos los elementos del array en un solo string -->

            <!-- Título para la sección de etiquetados -->
            <div class="etiquetados">
                    <h2>Etiquetados</h2>
            </div>
            </div>
            `
        } 
    }
}    

// Exportamos la clase para que pueda ser usada en otros archivos
export default restaurantInfo;