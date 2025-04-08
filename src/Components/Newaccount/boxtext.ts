export class BoxText extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const placeholder = this.getAttribute("placeholder");
        
        if (this.shadowRoot){
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
             .input-container 
             {
                display:inline-block;
                width:100%;
             }
             input{
                width:100%;
                padding:10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                color:#000;
                font-size:16px;
             }
               </style>
                <div class="input-container">
                    <input type="text" value="" placeholder="${placeholder}" id="input-correo">
                </div>
            `;

            const input = this.shadowRoot.querySelector("input");
            if (input){
                input.addEventListener("focus",()=>{
                 if(input.value === "correo electonico"){
                    input.value ="";
                    input.style.color = "#000";
                 }
                 if (input.placeholder === "Contraseña") {
                    input.type = "password";
                 }
                });
                

            }


            
        }else {
            console.log(`shadowRoot is null`);
        }

    }
}

export default BoxText;