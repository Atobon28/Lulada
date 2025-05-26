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
            this.updateView(route); //actualiza la vista a esa ruta
        });

        // Escuchar eventos de "back" desde componentes de configuración
        document.addEventListener('back', () => {
            console.log('Back button pressed, returning to configurations');
            this.updateView('/configurations');
        });

        // Escuchar eventos de "save" desde componentes de configuración
        document.addEventListener('save', () => {
            console.log('Save button pressed, returning to configurations');
            this.updateView('/configurations');
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
        //actualiza el componente dependiendo de la ruta
        let newComponent = "";
        //cambiar el componente dependiendo de la ruta
        switch(route) {
            case "/home":
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
            //aqui agregar antojar
            case "/configurations":
                newComponent = `<lulada-settings></lulada-settings>`;
                break;
            case "/profile":
                newComponent = `<puser-page></puser-page>`;
                break;
            // NUEVAS RUTAS para páginas de configuración específicas
            case "/cambiar-correo":
                newComponent = `<lulada-cambiar-correo></lulada-cambiar-correo>`;
                break;
            case "/cambiar-nombre":
                newComponent = `<lulada-cambiar-nombre></lulada-cambiar-nombre>`;
                break;
            case "/cambiar-contraseña":
                newComponent = `<lulada-cambiar-contraseña></lulada-cambiar-contraseña>`;
                break;
            default:
                newComponent = `<lulada-home></lulada-home>`;
        }
        //busca el elemento <main> y actualiza su contenido con el nuevo componente
        const main = this.shadowRoot!.querySelector('main');
        if (main) {
            main.innerHTML = newComponent;
        }
        //para que la ventana al cambiarla aparezca siempre arriba
        window.scrollTo(0, 0);
    }
}

export default LoadPage;