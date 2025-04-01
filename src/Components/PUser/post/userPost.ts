class UserPost extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['foto', 'nombreDeUsuario', 'texo', 'imgPost' ];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            .userPostContainer {
                background-color: #ffffff;
            }

            .userPostCard {
                border-radius: 30px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                border: 2px solid #E9E8E8;
                display: flex;
                align-items: center;
            }

            .foto img {
                border-radius: 50%;
                object-fit: cover;
                margin-right: 10px;
            }

            </style>
            <div class="userPostContainer">
                <h1>Publicaciones</h1>
                <div class="userPostCard">
                    <div class="userFotoPerfil">
                        <img src="${this.getAttribute('foto')}"></img>
                    </div>
                    <div class="userPostInfo">
                        <h2>${this.getAttribute('nombreDeUsuario')}</h2>
                        <p>${this.getAttribute('texo')}</p>
                        ${this.getAttribute('imgPost') !== "undefined" ? `<img class="img-post" src="${this.getAttribute('imgPost')}"></img>` : ''}
                            <div class="userPostIconos">
-----/*Aqui falta poner los iconos de guarda, like y estrellas*/----  
                            </div>                   
                    </div>
            </div>



            `;
        }
    }
}
 export default UserPost;