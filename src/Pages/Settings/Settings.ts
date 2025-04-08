class LuladaSettings extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100vh;
                        font-family: Arial, sans-serif;
                        background-color: white;
                    }
                    
                    .header-wrapper {
                        width: 100%;
                        background-color: white;
                        padding: 20px 0 10px 20px;
                        border-bottom: 1px solid #eaeaea;
                    }
                    
                    .logo-container {
                        width: 300px;
                    }
                    
                    .main-container {
                        display: flex;
                        width: 100%;
                        flex: 1;
                        background-color: white;
                        overflow: hidden;
                    }
                    
                    .sidebar-wrapper {
                        width: 250px;
                        height: 100%;
                        overflow-y: auto;
                    }
                    
                    .content-container {
                        flex-grow: 1;
                        padding-left: 20px;
                        padding-top: 20px;
                        height: 100%;
                        overflow-y: auto;
                    }
                    
                    ::slotted(lulada-sidebar) {
                        height: 100%;
                    }
                    
                    
                    ::slotted(cajon-list) {
                        width: 100%;
                        max-width: 500px;
                        margin-left: 20px !important;
                    }
                    
                   
                    :host ::slotted(cajon-list) div.list-container {
                        margin-left: 0 !important;
                        padding-left: 0 !important;
                    }
                </style>
                
                <div class="header-wrapper">
                    <div class="logo-container">
                        <lulada-logo></lulada-logo>
                    </div>
                </div>
                
                <div class="main-container">
                    <div class="sidebar-wrapper">
                        <lulada-sidebar></lulada-sidebar>
                    </div>
                    
                    <div class="content-container">
                        <cajon-list id="settings-list"></cajon-list>
                    </div>
                </div>
            `;
        }
    }

    connectedCallback() {
        console.log('LuladaSettings añadido al DOM');
        
        
        setTimeout(() => {
            const cajonList = this.shadowRoot?.querySelector('cajon-list');
            if (cajonList && cajonList.shadowRoot) {
               
                const style = document.createElement('style');
                style.textContent = `
                    .list-container {
                        margin: 0 !important;
                        padding-left: 20px !important;
                    }
                `;
                cajonList.shadowRoot.appendChild(style);
            }
        }, 0);
    }

    disconnectedCallback() {
        console.log('LuladaSettings eliminado del DOM');
    }
}

customElements.define('lulada-settings', LuladaSettings);
export default LuladaSettings;