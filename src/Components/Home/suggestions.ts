class LuladaSuggestions extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        width: 300px;
                        background-color: white;
                        border-left: 1px solid #e0e0e0;
                        padding: 20px;
                    }
                    .suggestions-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .suggestion-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                        cursor: pointer;
                    }
                    .suggestion-image {
                        width: 50px;
                        height: 50px;
                        border-radius: 8px;
                        margin-right: 15px;
                        object-fit: cover;
                    }
                    .suggestion-details {
                        flex-grow: 1;
                    }
                    .suggestion-name {
                        font-weight: bold;
                    }
                    .suggestion-view {
                        color: #AAAB54;
                        font-weight: bold;
                    }
                    .suggestion-view:hover {
                        text-decoration: underline;
                        color:rgb(114, 114, 56);
                    }
                </style>
                
                <div class="suggestions-title">Sugerencias</div>
                
                <div class="suggestions-list">
                    <div class="suggestion-item">
                        <img src="https://marketplace.canva.com/EAFpeiTrl4c/2/0/1600w/canva-abstract-chef-cooking-restaurant-free-logo-a1RYzvS1EFo.jpg" class="suggestion-image" alt="BarBurguer">
                        <div class="suggestion-details">
                            <div class="suggestion-name">BarBurguer</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                    <div class="suggestion-item">
                        <img src="https://img.pikbest.com/png-images/20241030/culinary-restaurant-logo-design_11027332.png!sw800" class="suggestion-image" alt="Frenchrico">
                        <div class="suggestion-details">
                            <div class="suggestion-name">Frenchrico</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                    <div class="suggestion-item">
                        <img src="https://justcreative.com/wp-content/uploads/2023/02/Restaurant-Logo-Templates.png.webp" class="suggestion-image" alt="NoMames!">
                        <div class="suggestion-details">
                            <div class="suggestion-name">NoMames!</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                    <div class="suggestion-item">
                        <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/chef-logo%2Ccooking-logo%2Crestaurant-logo-design-template-8048c6b88c3702da6e0804bc38ce7f33_screen.jpg?ts=1672750337" class="suggestion-image" alt="LaCocina">
                        <div class="suggestion-details">
                            <div class="suggestion-name">LaCocina</div>
                        </div>
                        <div class="suggestion-view">Ver</div>
                    </div>
                </div>
            `
        }
    }

    connectedCallback() {
        if (!this.shadowRoot) return
        
        const viewButtons = this.shadowRoot.querySelectorAll('.suggestion-view')
        
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const item = button.closest('.suggestion-item')
                if (item) {
                    const nameElement = item.querySelector('.suggestion-name')
                    const name = nameElement ? nameElement.textContent : ''
                    alert('Has hecho clic en: ' + name)
                }
            })
        })
    }
}


export default LuladaSuggestions