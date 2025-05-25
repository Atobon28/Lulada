import getUsers from "../../../Services/UserServices";

type User = {
    foto: string;
    nombreDeUsuario: string;
    nombre: string;
    descripcion: string;
    locationText: string;
    MenuLink: string;
    rol: string;
}

class UserInfo extends HTMLElement {
    protected users: User[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.users = await getUsers();
        this.render();
    }

    protected FiltroUser() {
        return this.users.filter(user => user.rol === "persona");
    }

    protected render() {
        if (this.shadowRoot) {
            const FiltradosUsers = this.FiltroUser()
            this.shadowRoot.innerHTML = /*html*/ `

            <style>
            .userTopCompleto {
                background-color: #ffffff;
                padding: 1.25rem;
                border-radius: 0.9375rem;
                font-family: 'Inter', sans-serif;
                max-width: 90%;
                margin: auto;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
            }

            @media (max-width: 1024px) {
                .userTopCompleto {
                    max-width: 95%;
                    padding: 1rem;
                }
                
                .userTopFoto img {
                    width: 12rem;
                    height: 12rem;
                }
            }
            
            @media (max-width: 768px) {
                .userTopCompleto {
                    max-width: 100%;
                    margin: 0.5rem;
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
            }

            @media (max-width: 480px) {
                .userTopCompleto {
                    margin: 0.25rem;
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
            }
            </style>            
            <div class="userTopCompleto">
                ${FiltradosUsers.map(user => this.renderUsuario(user)). join('')}
            </div>`;
        }
    }

    protected renderUsuario(User: User) {
        return /*html*/ `
            <div class="userTop"> 
                <div class="userTopFoto">
                    <img class="foto" src="${User.foto ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s'}">
                </div>
                <div class="userTopInfo">
                    <p class="nombreDeUsuario">${User.nombreDeUsuario ?? 'Nombre de usuario por defecto'}</p>
                    <p class="nombre">${User.nombre ?? "Nombre por defecto"}</p>
                    <hr>
                    <p class="descripcion">${User.descripcion ?? " "}</p>
                    <div id="additional-info"></div>
                </div>
            </div>
        `;
    } 
}
  
export default UserInfo;