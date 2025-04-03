class checkboxContainer extends HTMLElement {
    construtor () {

        this.attachShadow({ mode: 'open' });
        if(this.shadowRoot) {
            this.shadowRoot.innerHTML = `
               <style>
                 .container {
                 background:white;
                 padding:20px;
                 border-radius:10px;
                 box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                 text-align:center;
                 }
               </style>
               <div class="checkboxcontainer">
               <p>¿Eres persona o restaurante?</p><br/>
               <label><input type="chackbox"/>persona</label>

               
               </div>
            
            
            
            
            
            `;
        }
    }
}
export default checkboxContainer;