class Lulada extends HTMLElement {
    shadowRoot: ShadowRoot;
  
    constructor() {
      super();
      
      this.shadowRoot = this.attachShadow({ mode: 'open' });
  
      this.shadowRoot.innerHTML = `
          <style>
              :host {
                  display: block;
                  text-align: left;
              }
              
              img {
                  max-width: 300px;
                  height: auto;
              }
              
              .error {
                  color: red;
                  background-color: #ffeeee;
                  padding: 10px;
              }
          </style>
          
          <img 
              src="" 
              alt="Lulada Logo"
          >
      `;

      const img = this.shadowRoot.querySelector('img');
      if (img) {
        img.onerror = () => {
          img.onerror = null;
          img.classList.add('error');
          img.insertAdjacentHTML('afterend', '<div class="error">Image Load Failed: ' + img.src + '</div>');
        };
      }
    }
  }
  
  
  export default Lulada;