class CajonList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
                <style>
                    .list-container {
                        display: flex;
                        flex-direction: column;
                        gap: 16px; 
                        width: 100%;
                        max-width: 500px; 
                        margin: 0 auto;
                        padding: 20px;
                    }
                </style>
                <div class="list-container">
                    <cajon-texto label="Cambiar correo"></cajon-texto>
                    <cajon-texto label="Cambiar nombre de usuario"></cajon-texto>
                    <cajon-texto label="Cambiar contraseña"></cajon-texto>
                    <cajon-texto label="Cerrar sesión"></cajon-texto>
                    <cajon-texto label="Cambiar foto de perfil"></cajon-texto>
                    <cajon-texto label="Editar biografía o descripción personal"></cajon-texto>
                    <cajon-texto label="Seleccionar idioma de la app"></cajon-texto>
                    <cajon-texto label="Configurar quién puede ver mi perfil (público/privado)"></cajon-texto>
                    <cajon-texto label="Borrar historial de búsqueda"></cajon-texto>
                    <cajon-texto label="Elegir color principal de la interfaz"></cajon-texto>
                    <cajon-texto label="Cambiar tema (claro/oscuro/sistema)"></cajon-texto>
                    <cajon-texto label="Tamaño del texto"></cajon-texto>
                </div>
            `;
        }
    }
}

customElements.define('cajon-list', CajonList);
export default CajonList;