class Buttonregisterconfirm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if(this,this.shadowRoot){
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                .button{
                    display:block;
                    width:100%;
                    padding:10px;
                    background-color:#AAAB54;
                    border: none;
                    color:white;
                    border-radius:10px;
                    font-size:16px;
                    cursor:pointer;
                    text-align:center;
                }
                button:hover{
                    background-color:#999A45;
                }




            </style>
            <button class="button">register</button>
            `;

            const button = this.shadowRoot.querySelector(".button");
            if (button) {
                button.addEventListener("click", () => {
                    window.location.href = "";

            });}
        }else {
            console.error(`shadowRoot is null`);
        }

        


    }
}

export default Buttonregisterconfirm;