import "../../Components/Newaccount/boxtext";
import "../../Components/Newaccount/buttonNewAccount";


class RegisterNewAccount extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = /*html*/ `
            <style>
                #title {
                    font-size: 28px;
                }
                .main {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                 .from-container{
                    font-family: 'Poppins', sans-serif;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    background:white;
                    padding:10px 40px 40px 20px;
                    border-radius:10px;
                    box-shadow:0 4px 8px rgba(0,0,0,0.1);
                    background-color:rgb(246, 245, 245);
                    width:600px;

                 }
                 .container-input{
                    display:flex;
                    flex-direction:column;
                    gap:18px;
                    Width:90%;
                    margin-top:10px;
                }
                 .continue-btn {
                    background: #E0A800;
                    color: white;
                    border: none;
                    padding: 10px;
                    margin-left: 10px;
                    width:60%;
                    cursor: pointer;
                    border-radius: 5px;
                    margin-top: 26px;
                    font-size: 16px;
                 } .continue-btn:hover {
                    background:rgb(183, 140, 21);
                    }
                .line {
                    width: 90%;
                    height: 1px;
                    background-color:rgb(155, 148, 148);
                    margin-top: 28px;
                    margin-bottom: 5px;
                }
                .container-new-account {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .container-new-account p {
                    margin-left: 12px;
                    margin-bottom: 8px;
                    color: black;
                    font-size: 16px;
                }

            </style>
            <div class="main">
                <lulada-logo></lulada-logo>
                
                
                <div class="from-container">
                    <h2 id="title" style="margin-left: 20px">Registrate</h2>
                    <div class="container-input">
                    
                        <lulada-boxtext placeholder="Nombre"></lulada-boxtext>
                        <lulada-boxtext placeholder="Apellido"></lulada-boxtext>
                        <lulada-boxtext placeholder="Apodo"></lulada-boxtext>
                        <lulada-boxtext placeholder="Correo Electronico"></lulada-boxtext>
                        <lulada-boxtext placeholder="Contraseña"></lulada-boxtext>
                    </div>
                    <button class="continue-btn">Continuar</button>
                    <div class="line"></div>
                    <div class="container-new-account">
                        <p>¿Ya tienes una cuenta?</p>
                        <button-new-account style="margin-left: 20px"></button-new-account>
                    </div>
                    <div class="Buttonregister">
                    <lulada-boton-login></lulada-boton-login>
                    </div>
                </div>
            </div>
            
            `;
    }
  }
}

export default RegisterNewAccount;
