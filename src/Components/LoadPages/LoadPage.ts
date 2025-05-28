// src/Components/LoadPages/LoadPage.ts

class LoadPage extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: 'open'});
    }

    connectedCallback(){
        this.render();
        this.setupNavigation();
    }

    private setupNavigation(){
        //escuchar los clicks dentro del componente
        this.shadowRoot!.addEventListener('click', (e) => {
            const target = e.target as HTMLElement; //obtiene el elemento que disparo el evento
            const link = target.closest('a'); //busca el enlace mas cercano al elemento clickeado

            if (link && link.href) {
                e.preventDefault(); //evitar el comportamiento por defecto
            }
        });

        //escuchar evento global (navigate) 
        document.addEventListener('navigate', (event: Event) => {
            //convierte el evento a un customevento 
            const route = (event as CustomEvent).detail; //toma la ruta del evento
            console.log('🎯 LoadPage: Recibido evento de navegación:', route);
            this.updateView(route); //actualiza la vista a esa ruta
        });

        // Manejar navegación del navegador (botón atrás/adelante)
        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            console.log('🔙 LoadPage: Navegación del navegador:', currentPath);
            this.updateView(currentPath);
        });
    }

    render(){
        this.shadowRoot!.innerHTML = /*html*/ `
        <div class="app-container">
            <main>
                <lulada-home></lulada-home>
            </main>
        </div>
        `;
    }

    updateView(route: string){
        console.log('🔄 LoadPage: Actualizando vista a:', route);
        
        //actualiza el componente dependiendo de la ruta
        let newComponent = "";
        //cambiar el componente dependiendo de la ruta
        switch(route) {
            case "/home":
            case "/":
                newComponent = `<lulada-home></lulada-home>`;
                break;
            case "/notifications":
                newComponent = `<lulada-notifications></lulada-notifications>`;
                break;
            case "/save":
                newComponent = `<save-page></save-page>`;
                break;
            case "/explore":
                newComponent = `<lulada-explore></lulada-explore>`;
                break;
            case "/configurations":
                newComponent = `<lulada-settings></lulada-settings>`;
                break;
            case "/profile":
                newComponent = `<puser-page></puser-page>`;
                break;
            case "/cambiar-correo":
                newComponent = `<lulada-cambiar-correo></lulada-cambiar-correo>`;
                break;
            case "/cambiar-nombre":
                newComponent = `<lulada-cambiar-nombre></lulada-cambiar-nombre>`;
                break;
            case "/cambiar-contraseña":
                newComponent = `<lulada-cambiar-contraseña></lulada-cambiar-contraseña>`;
                break;
            case "/login":
                newComponent = `<login-page></login-page>`;
                break;
            case "/register":
                newComponent = `<register-new-account></register-new-account>`;
                break;
            default:
                console.warn('⚠️ LoadPage: Ruta no reconocida:', route, '- Mostrando home');
                newComponent = `<lulada-home></lulada-home>`;
        }
        
        //busca el elemento <main> y actualiza su contenido con el nuevo componente
        const main = this.shadowRoot!.querySelector('main');
        if (main) {
            console.log('✅ LoadPage: Cargando componente:', newComponent.match(/<([^>]+)>/)?.[1] || 'unknown');
            main.innerHTML = newComponent;
        } else {
            console.error('❌ LoadPage: No se encontró el elemento main');
        }
        
        //para que la ventana al cambiarla aparezca siempre arriba
        window.scrollTo(0, 0);
    }
}

export default LoadPage;