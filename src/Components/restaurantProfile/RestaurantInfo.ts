import getUsers from "../../Services/UserServices";

type User = {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText: string;
    menuLink: string;
    rol: string;
}

class restaurantInfo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        if (this.shadowRoot) {
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
            }

            .etiquetados {
                font-family: 'Inter', sans-serif;
                font-size: 0.80rem;
                font-weight: bold;
                margin-left: 3rem;
            }
            
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
                max-width: 100%;
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

            }

            .locationText {
                font-size: 1rem;
            }

            .location-icon {
                width: 1.5rem;
                height: 1.5rem;
            }

            .link {
                display: flex;
                gap: 0.3rem;
                align-items: center;
            }
            
            /* Responsive */
            @media (max-width: 768px) {

                .userTopCompleto {
                    
                }
                .userTopFoto img {
                    width: 10rem;
                    height: 10rem;
                }
            
                .nombre {
                    font-size: 1.25rem;
                    margin: 0.1rem;
                }

                .etiquetados {
                    font-size: 0.65rem;
                    font-weight: bold;
                }
            
                .nombreDeUsuario {
                    font-size: 1rem;
                    margin: 0.1rem;
                }
            
                .descripcion {
                    font-size: 0.75rem;
                    margin: 0.1rem;
                }

                .stars {
                    font-size: 0.8rem;
                    margin: 0.2rem;
                }

                .locationText {
                    font-size: 0.8rem;
                    margin: 0.2rem;
                }
                .location-icon {
                    width: 1rem;
                    height: 1rem;
                    margin: 0.2rem;
                }

                .MenuLink {
                    font-size: 0.8rem;
                    margin: 0.2rem; 
                }

                
            }
            </style>            
            <div class="userTopCompleto">
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
                            <div class="location">
                                <svg class="action-icon location-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle   circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <p class="locationText">${User.locationText ?? "No se ha registrado una ubicacion aun"}</p>
                            </div>
        
                        <div class="link"> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g fill="currentColor"><path d="M12.243 3.757a2 2 0 0 0-2.829 0L7.293 5.88L5.879 4.464L8 2.344a4 4 0 0 1 5.657 0l.707.706l-.09.09A4 4 0 0 1 13.658 8l-2.121 2.121l-1.415-1.414l2.122-2.121a2 2 0 0 0 0-2.829Zm-8.486 8.486a2 2 0 0 0 2.829 0l2.121-2.122l1.414 1.415L8 13.655a4 4 0 0 1-5.657 0l-.707-.706l.09-.09A4 4 0 0 1 2.342 8l2.121-2.121L5.88 7.293L3.757 9.414a2 2 0 0 0 0 2.829"/><path d="M10.828 6.586L9.414 5.172L5.172 9.414l1.414 1.414z"/></g></svg>
                            <p class="MenuLink">${User.menuLink ?? ' '}</p>
                        </div>
        
                        <div class="stars">
                            ${'☆'.repeat(5)}
                        </div> 
                    </div>
                </div>
            </div>
                `) . join('')}
            </div>

            <div class="etiquetados">
                    <h2>Etiquetados</h2>
            </div>
            `
        } 
    }
}    
export default restaurantInfo;