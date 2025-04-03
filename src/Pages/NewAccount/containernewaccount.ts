
class ResgisterNewAccount extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open' });
        if(this.shadowRoot){
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                 .from-container{
                    background:white;
                    padding:20px;
                    border-radius:10px;
                    box-shadow:0 4px 8px rgba(0,0,0,0.1);
                    text-align:center;
                    width:300px;
                    margin:auto;
                 }
                 .btn-yellow {
                    background: #E0A800;
                    color: white;
                    border: none;
                    padding: 10px;
                    width:100%;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-top: 10px;
                 }
                 p{
                    margin-top:10px;
                    font-size:14px;
                 }
            </style>
            <div class="from-container">
            <h2>Registrate</h2>
            <box-text placeholder="Correo Electronico"></box-text>
            <box-text placeholder="Contraseña"></box-text>
            <box-text placeholder="Nombre completo"></box-text>
            <box-text placeholder="Nombre de Usuario"></box-text>
            
            
            </div>
            
            `;

        }
    }

}
customElements.define("register-new-account", ResgisterNewAccount);
export default ResgisterNewAccount;
