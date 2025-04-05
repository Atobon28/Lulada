class UserSelftProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {

            if (UserSelftProfile) 
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
                h1 {
                font-family: 'Inter', sans-serif;
                weight: semi-bold;
                font-size: 20px;
                padding-left: 26px;
                margin-Top: 0px;
                }
            </style>
            <div class="userTopCompleto">
                <user-info></user-info>
                <user-edit></user-edit>
            </div>
           <h1>Publicaciones</h1>
            `;
        }
    }
}


export default UserSelftProfile;
