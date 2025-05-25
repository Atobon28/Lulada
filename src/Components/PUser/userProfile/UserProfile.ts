class UserSelftProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                h1 {
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 20px;
                    padding-left: 26px;
                    margin-top: 0px;
                    color: #333;
                }

                .user-publication-Tittle {
                    margin-left: 5.8rem;
                    margin-right: 5.8rem;
                }

                .userTopCompleto {
                    position: relative;
                }

                @media (max-width: 1024px) {
                    .user-publication-Tittle {
                        margin-left: 2rem;
                        margin-right: 2rem;
                    }
                    
                    h1 {
                        padding-left: 20px;
                        font-size: 18px;
                    }
                }

                @media (max-width: 768px) {
                    .user-publication-Tittle {
                        margin-left: 1rem;
                        margin-right: 1rem;
                    }
                    
                    h1 {
                        padding-left: 15px;
                        font-size: 16px;
                        text-align: center;
                        margin-top: 1rem;
                    }
                }

                @media (max-width: 480px) {
                    .user-publication-Tittle {
                        margin-left: 0.5rem;
                        margin-right: 0.5rem;
                    }
                    
                    h1 {
                        padding-left: 10px;
                        font-size: 14px;
                        margin-top: 0.5rem;
                    }
                }

            </style>
            <div class="user-publication-Tittle">
                <div class="userTopCompleto">
                    <user-info></user-info>
                    <user-edit></user-edit>
                </div>
                <h1>Publicaciones</h1>
            </div>
            `;
        }
    }
}

export default UserSelftProfile;