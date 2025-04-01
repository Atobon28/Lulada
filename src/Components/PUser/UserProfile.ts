class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                .userTopCompleto {
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }

                .userTop {
                    display: flex;
                    align-items: center;
                }

                .userTopFoto img {
                    border-radius: 50%;
                    width: 120px;
                    height: 120px;
                    object-fit: cover;
                    margin-right: 20px;
                }

                .userTopInfo h2, .userTopInfo h3, .userTopInfo p {
                    margin: 5px 0;
                }

                .userTopEditar {
                    text-align: right;
                }

                .userTopEditar button {
                    margin-top: 10px;
                    padding: 8px 16px;
                    background-color: #AAAB54;
                    border: none;
                    color: white;
                    border-radius: 10px;
                    cursor: pointer;
                }

                hr {
                    width: 100%;
                    border: 0.5px solid #D9D
                    margin: 10px 0;
                }

                </style>
                <div class="userTopCompleto">
                    <div class="userTop"> 
                        <div class="userTopFoto">
                            <img class="foto" src="">
                        </div>
                        <div class="userTopInfo">
                            <div class="nombreDeUsuario"></div>
                            <div class="nombre"></div>
                            <hr>
                            <div class="descripcion"></class>
                        </div>
                    </div>
                    <div class="userTopEditar">
                        <button>Editar</button>
                    </div>
                </div> 
            `;
        } else {
            console.error('shadowRoot is null');
        }
    }
    connectedCallback() { 
        const nombreDeUsuario = this.shadowRoot?.querySelector<HTMLElement>('.nombreDeUsuario');
        const nombre = this.shadowRoot?.querySelector<HTMLElement>('.nombre');
        const descripcion = this.shadowRoot?.querySelector<HTMLElement>('.descripcion');
        const foto = this.shadowRoot?.querySelector<HTMLImageElement>('.foto');

        if (nombreDeUsuario && nombre && descripcion && foto) {
            nombreDeUsuario.innerText = this.getAttribute('nombreDeUsuario') ??
                'Nombre de usuario'; 
            nombre.innerText = this.getAttribute('nombre') ??
            'nombre por defecto'; 
            descripcion.innerText = this.getAttribute('descripcion')??
            'descripcion por defecto';
            foto.src = this.getAttribute('foto') ??
            ' ';
        } 
    }    
}



export default UserProfile;
