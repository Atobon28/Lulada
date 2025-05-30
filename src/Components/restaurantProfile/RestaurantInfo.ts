// Importamos la función para obtener datos de usuarios
import getUsers from "../../Services/UserServices";

// Definimos la estructura de un objeto Usuario
type User = {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText: string;
    menuLink: string;
    rol: string;
}

// Componente para mostrar información de restaurantes
class restaurantInfo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        if (this.shadowRoot) {
            // Obtenemos la información de todos los usuarios
            const InformationResponse = await getUsers()
            
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            .userTopCompleto {
                background-color: #ffffff;
                padding: 1.25rem;
                border-radius: 0.9375rem;
                font-family: 'Inter', sans-serif;
                max-width: 90%;
                margin: auto;
                margin-left: 5.8rem;
                margin-right: 5.8rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .etiquetados {
                font-family: 'Inter', sans-serif;
                font-size: 0.80rem;
                font-weight: bold;
                margin-left: 3rem;
            }
            
            /* Contenedor principal que organiza foto e información */
            .userTop {
                display: flex;
                align-items: center;
                gap: 1rem;
                min-width: 18.75rem;
                min-height: 6.25rem;
            }
            
            .userTopFoto img {
                border-radius: 50%;
                width: 13.4375rem;
                height: 13.4375rem;
                object-fit: cover;
            }
            
            .userTopInfo {
                flex: 1;
            }
            
            .nombreDeUsuario {
                font-size: 1.25rem;
                color: #4D4D4D;
                font-weight: bold;
                margin-top: 0.8rem;
                margin-bottom: 0.8rem;
            }
            
            .nombre {
                font-size: 1.625rem;
                font-weight: bold;
                color: #000;
                margin-top: 0.4rem;
                margin-bottom: 0.5rem;
            }
            
            .descripcion {
                font-size: 1rem;
                color: #333;
                margin-top: 0.375rem;
                line-height: 1.4;
            }
            
            hr {
                width: 100%;
                border: 1px solid #D9D9D9;
                margin: 0.5rem 0;
            }

            .location {
                display: flex;
                gap: 0.3rem;
                align-items: center;
                margin-top: 0.05rem;
                flex-wrap: wrap;
            }

            .locationText {
                font-size: 1rem;
                color: #666;
            }

            .location-icon {
                width: 1.5rem;
                height: 1.5rem;
                flex-shrink: 0;
            }

            .link {
                display: flex;
                gap: 0.3rem;
                align-items: center;
                margin-top: 0.5rem;
                flex-wrap: wrap;
            }

            .MenuLink {
                color: #AAAB54;
                text-decoration: none;
                font-size: 1rem;
            }

            .MenuLink:hover {
                text-decoration: underline;
                color: #999A4A;
            }

            .stars {
                color: #FFD700;
                font-size: 1.2rem;
                margin-top: 0.5rem;
            }

            /* RESPONSIVE DESIGN */
            /* Tablets */
            @media (max-width: 1024px) {
                .userTopCompleto {
                    margin-left: 2rem;
                    margin-right: 2rem;
                    max-width: 95%;
                }
                
                .userTopFoto img {
                    width: 12rem;
                    height: 12rem;
                }
            }
            
            /* Móviles */
            @media (max-width: 768px) {
                .userTopCompleto {
                    margin-left: 1rem;
                    margin-right: 1rem;
                    max-width: 100%;
                    padding: 1rem;
                }

                .userTop {
                    flex-direction: column;
                    text-align: center;
                    min-width: auto;
                    gap: 1rem;
                }

                .userTopFoto img {
                    width: 10rem;
                    height: 10rem;
                }
            
                .nombre {
                    font-size: 1.25rem;
                    margin: 0.3rem 0;
                }

                .etiquetados {
                    font-size: 0.65rem;
                    font-weight: bold;
                    margin-left: 1rem;
                    text-align: center;
                }
            
                .nombreDeUsuario {
                    font-size: 1rem;
                    margin: 0.3rem 0;
                }
            
                .descripcion {
                    font-size: 0.85rem;
                    margin: 0.3rem 0;
                    text-align: center;
                }

                .location {
                    justify-content: center;
                    margin-top: 0.5rem;
                }

                .link {
                    justify-content: center;
                }

                .stars {
                    font-size: 1rem;
                    margin: 0.5rem 0;
                }

                .locationText {
                    font-size: 0.9rem;
                    margin: 0.2rem;
                }
                
                .location-icon {
                    width: 1.2rem;
                    height: 1.2rem;
                    margin: 0.2rem;
                }

                .MenuLink {
                    font-size: 0.9rem;
                    margin: 0.2rem; 
                }
            }

            /* Móviles muy pequeños */
            @media (max-width: 480px) {
                .userTopCompleto {
                    margin: 0.5rem;
                    padding: 0.75rem;
                }

                .userTopFoto img {
                    width: 8rem;
                    height: 8rem;
                }
                
                .nombre {
                    font-size: 1.1rem;
                }
                
                .nombreDeUsuario {
                    font-size: 0.9rem;
                }
                
                .descripcion {
                    font-size: 0.8rem;
                }

                .etiquetados {
                    margin-left: 0.5rem;
                }

                .stars {
                    font-size: 0.9rem;
                }

                .locationText {
                    font-size: 0.8rem;
                }
                
                .location-icon {
                    width: 1rem;
                    height: 1rem;
                }

                .MenuLink {
                    font-size: 0.8rem;
                }
            }
            </style>            
            
            <!-- Contenedor principal del perfil del restaurante -->
            <div class="userTopCompleto">
                
                <!-- Filtramos usuarios para mostrar solo restaurantes -->
                ${InformationResponse.filter((User: User) => User.rol === "restaurante").map((User: User) => /*html*/ `   
                
                <div class="userTop"> 
                    <div class="userTopFoto">
                        <img class="foto" src="${User.foto ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s'}">
                    </div>
                    
                    <div class="userTopInfo">
                        <p class="nombreDeUsuario">${User.nombreDeUsuario ?? 'Nombre de usuario por defecto'}</p>
                        
                        <p class="nombre">${User.nombre ?? "Nombre por defecto"}</p>
                        
                        <hr>
                        
                        <p class="descripcion">${User.descripcion ?? " "}</p>
                        
                        <div class="additional-info">
                            <!-- Sección de ubicación con icono -->
                            <div class="location">
                                <svg class="action-icon location-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <p class="locationText">${User.locationText ?? "No se ha registrado una ubicacion aun"}</p>
                            </div>
        
                        <!-- Sección del enlace al menú -->
                        <div class="link"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M12.243 3.757a2 2 0 0 0-2.829 0L7.293 5.88L5.879 4.464L8 2.344a4 4 0 0 1 5.657 0l.707.706l-.09.09A4 4 0 0 1 13.658 8l-2.121 2.121l-1.415-1.414l2.122-2.121a2 2 0 0 0 0-2.829Zm-8.486 8.486a2 2 0 0 0 2.829 0l2.121-2.122l1.414 1.415L8 13.655a4 4 0 0 1-5.657 0l-.707-.706l.09-.09A4 4 0 0 1 2.342 8l2.121-2.121L5.88 7.293L3.757 9.414a2 2 0 0 0 0 2.829"/><path d="M10.828 6.586L9.414 5.172L5.172 9.414l1.414 1.414z"/></g></svg>
                            <a href="${User.menuLink}" class="MenuLink" target="_blank">${User.menuLink ?? 'Sin menú disponible'}</a>
                        </div>
        
                        <!-- Calificación con estrellas -->
                        <div class="stars">
                            ${'★'.repeat(5)}
                        </div> 
                    </div>
                </div>
            </div>
                `) . join('')}

            <!-- Título para la sección de etiquetados -->
            <div class="etiquetados">
                    <h2>Etiquetados</h2>
            </div>
            </div>
            `
        } 
    }
}    

export default restaurantInfo;