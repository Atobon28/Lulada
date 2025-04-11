import { LuladaAntojar } from './antojar'; // Importamos el componente que se mostrará en el popup

export class AntojarPopupService {
    static instance: AntojarPopupService; // Propiedad estática para aplicar el patrón singleton
    popupContainer: HTMLDivElement | null = null; // Contenedor del popup (fondo semitransparente)
    antojarComponent: LuladaAntojar | null = null; // Instancia del componente personalizado que va dentro del popup

    constructor() {
        // Constructor vacío, solo se usa internamente desde getInstance()
    }

    // Método que retorna siempre la misma instancia del servicio
    public static getInstance(): AntojarPopupService {
        if (!AntojarPopupService.instance) {
            AntojarPopupService.instance = new AntojarPopupService(); // Si no existe, la crea
        }
        return AntojarPopupService.instance; // Devuelve la instancia existente
    }

    // Inicializa el contenedor del popup si no existe aún
    public initialize(): void {
        if (!this.popupContainer) {
            this.popupContainer = document.createElement('div'); // Creamos el div que actuará como fondo
            this.popupContainer.className = 'antojar-popup-container'; // Le damos una clase para identificarlo
            this.popupContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `; // Estilos para cubrir toda la pantalla como fondo modal

            document.body.appendChild(this.popupContainer); // Lo añadimos al body

            // Si el usuario hace clic fuera del contenido (sobre el fondo), se cierra el popup
            this.popupContainer.addEventListener('click', (e) => {
                if (e.target === this.popupContainer) {
                    this.hidePopup(); // Cierra el popup
                }
            });
        }
    }

    // Muestra el popup en pantalla
    public showPopup(): void {
        console.log("Mostrando popup de antojar");
        this.initialize(); // Asegura que el contenedor exista

        // Verifica si el componente ya está registrado
        if (!customElements.get('lulada-antojar')) {
            console.warn("El componente lulada-antojar no está registrado, intentando registrarlo ahora");

            // Lo importa dinámicamente y lo registra si hace falta
            import('./antojar').then(module => {
                if (!customElements.get('lulada-antojar')) {
                    customElements.define('lulada-antojar', module.LuladaAntojar);
                }
                this.createAndShowComponent(); // Luego lo muestra
            });
        } else {
            this.createAndShowComponent(); // Si ya está registrado, simplemente lo muestra
        }
    }

    // Crea el componente antojar (si no existe) y lo muestra en pantalla
    private createAndShowComponent(): void {
        if (!this.antojarComponent) {
            console.log("Creando nuevo componente lulada-antojar");

            this.antojarComponent = document.createElement('lulada-antojar') as LuladaAntojar;

            // Le damos algunos estilos básicos para posicionarlo
            this.antojarComponent.style.cssText = `
                width: 95%;
                max-width: 500px;
                transform: translateY(20px); /* animación de entrada */
                transition: transform 0.3s ease;
            `;

            // Escuchamos cuando el usuario cierra el componente
            this.antojarComponent.addEventListener('antojar-cerrado', () => {
                console.log("Evento antojar-cerrado recibido");
                this.hidePopup(); // Oculta el popup
            });

            // Escuchamos si el usuario publica una reseña
            this.antojarComponent.addEventListener('resena-publicada', (e: Event) => {
                const detail = (e as CustomEvent).detail;
                console.log('Reseña publicada:', detail);
                this.hidePopup(); // Oculta el popup después de publicar
            });

            // Finalmente añadimos el componente al contenedor
            if (this.popupContainer) {
                this.popupContainer.appendChild(this.antojarComponent);
                console.log("Componente añadido al contenedor");
            }
        }

        // Mostramos el contenedor con una pequeña animación
        if (this.popupContainer) {
            this.popupContainer.style.display = 'flex';
            setTimeout(() => {
                if (this.popupContainer) {
                    this.popupContainer.style.opacity = '1'; // Suavemente lo hacemos visible
                }
                if (this.antojarComponent) {
                    this.antojarComponent.style.transform = 'translateY(0)'; // Animación de entrada hacia arriba
                }
            }, 10); // Pequeño delay para permitir el efecto CSS
        }
    }

    // Oculta el popup con transición
    public hidePopup(): void {
        if (this.popupContainer) {
            this.popupContainer.style.opacity = '0'; // Lo hacemos invisible
            if (this.antojarComponent) {
                this.antojarComponent.style.transform = 'translateY(20px)'; // Animación de salida hacia abajo
            }

            // Después del tiempo de la transición, lo ocultamos del layout
            setTimeout(() => {
                if (this.popupContainer) {
                    this.popupContainer.style.display = 'none';
                }
            }, 300); // Tiempo igual al de la transición CSS
        }
    }
}


// Hacemos el servicio accesible globalmente si se necesita desde otras partes de la app
window.AntojarPopupService = AntojarPopupService;

export default AntojarPopupService;
