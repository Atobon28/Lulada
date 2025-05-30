class CajonTexto extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    const label = this.getAttribute('label');
    
    if (!label) return;
    
    this.shadowRoot!.innerHTML = /*html*/ `
      <style>
        .card {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          background-color: white;
          font-family: sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-bottom: 16px;
          box-sizing: border-box;
        }
        
        .card:hover {
          background-color: #f9f9f9;
        }
      </style>
      
      <div class="card">
        ${label}
      </div>
    `;
  }
}

export default CajonTexto;