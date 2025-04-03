class BoxText extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const placeholder = this.getAttribute("placeholder") || "correo electronico";
        
        if (this.shadowRoot){
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
             .input-container 
             {
                position: relative;
                display:inline-block;
             }
             input{
                width:100%;
                padding:10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                color:#AAA;
                font-size:16px;
             }
               </style>
                <div class="input-container">
                <input type="text" value="correo elecronico";>
               </div>
            `;

            const input = this.shadowRoot.querySelector("input");
            if (input){
                input.addEventListener("focus",()=>{
                 if(input.value === "correo electonico"){
                    input.value ="";
                    input.style.color = "#000";
                 }

                });
                input.addEventListener("blur", ()=>{
                    if(input.value === ""){
                        input.value ="correo electronico";
                        input.style.color = "#000";
                     }

                });

            }


            
        }else {
            console.log(`shadowRoot is null`);
        }

    }
}

export default BoxText;