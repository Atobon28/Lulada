class AppLogo extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot){
            this.shadowRoot.innerHTML= `
            <style>
             .logo{
              display:flex;
              justify-content:center;
              aling-items:center;
              margin-bottom:20px;
              }
              img{
                width:80px;
                height:auto;
              }

              </style>
              <div class="logo">
                <img src="../Asstes/capa 2.png" alt="lulada logo">
              </div>
            
            
            
            
            `;

        }

    }
}
export default AppLogo;