export class AppLogo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot){
            this.shadowRoot.innerHTML= /*html*/ `
            <style>
             .logo{
              display:flex;
              justify-content:center;
              align-items:center;
              margin-bottom:20px;
              }
              img{
                width:80px;
                height:auto;
              }

              </style>
              <div class="logo">
                <img src="../../../Assets/styles/Capa2.png" alt="lulada logo">
              </div>
            
            `;

        }

    }
}

customElements.define("app-logo", AppLogo);