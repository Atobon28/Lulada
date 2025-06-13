import { LuladaAntojar } from './antojar';

// Servicio para manejar el popup de reseñas
export class AntojarPopupService {
    static instance: AntojarPopupService;
    
    // ✅ Propiedades públicas requeridas
    public popupContainer: HTMLDivElement | null = null;
    public antojarComponent: HTMLElement | null = null;

    constructor() {
        // Constructor vacío
    }

    // Singleton - obtener única instancia
    public static getInstance(): AntojarPopupService {
        if (!AntojarPopupService.instance) {
            AntojarPopupService.instance = new AntojarPopupService();
        }
        return AntojarPopupService.instance;
    }

    // Preparar contenedor del popup
    public initialize(): void {
        if (!this.popupContainer) {
            this.popupContainer = document.createElement('div');
            this.popupContainer.className = 'antojar-popup-container';
            
            this.popupContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.5);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 20px;
                box-sizing: border-box;
                overflow-y: auto;
            `;

            document.body.appendChild(this.popupContainer);

            // Cerrar al hacer click fuera del formulario
            this.popupContainer.addEventListener('click', (e) => {
                if (e.target === this.popupContainer) {
                    this.hidePopup();
                }
            });
        }
    }

    // Mostrar popup
    public showPopup(): void {
        this.initialize();

        if (!customElements.get('lulada-antojar')) {
            import('./antojar').then(module => {
                if (!customElements.get('lulada-antojar')) {
                    customElements.define('lulada-antojar', module.LuladaAntojar);
                }
                this.createAndShowComponent();
            }).catch(error => {
                console.error("Error al cargar componente antojar:", error);
                alert("Error al cargar el formulario de reseñas");
            });
        } else {
            this.createAndShowComponent();
        }
    }

    // ✅ Crear y mostrar el componente - PÚBLICO
    public createAndShowComponent(): void {
        if (!this.antojarComponent) {
            const luladaAntojarComponent = document.createElement('lulada-antojar') as LuladaAntojar;
            
            // ✅ Asignar como HTMLElement para cumplir con la interfaz
            this.antojarComponent = luladaAntojarComponent;

            this.antojarComponent.style.cssText = `
                width: 100%;
                max-width: 550px;
                max-height: 90vh;
                overflow-y: auto;
                transform: translateY(20px);
                transition: transform 0.3s ease;
                margin: auto;
                box-sizing: border-box;
            `;

            // Eventos del componente usando la referencia tipada
            luladaAntojarComponent.addEventListener('antojar-cerrado', () => {
                this.hidePopup();
            });

            luladaAntojarComponent.addEventListener('resena-publicada', (e: Event) => {
                const detail = (e as CustomEvent).detail;
                
                this.hidePopup();
                this.showSuccessMessage();
                
                document.dispatchEvent(new CustomEvent('nueva-publicacion', {
                    detail: detail,
                    bubbles: true
                }));
            });

            if (this.popupContainer) {
                this.popupContainer.appendChild(this.antojarComponent);
            }
        }

        // Mostrar con animación
        if (this.popupContainer) {
            this.popupContainer.style.display = 'flex';
            
            setTimeout(() => {
                if (this.popupContainer) {
                    this.popupContainer.style.opacity = '1';
                }
                if (this.antojarComponent) {
                    this.antojarComponent.style.transform = 'translateY(0)';
                }
            }, 10);
        }
    }

    // Ocultar popup
    public hidePopup(): void {
        if (this.popupContainer) {
            this.popupContainer.style.opacity = '0';
            
            if (this.antojarComponent) {
                this.antojarComponent.style.transform = 'translateY(20px)';
            }

            setTimeout(() => {
                if (this.popupContainer) {
                    this.popupContainer.style.display = 'none';
                }
            }, 300);
        }
    }

    // Alternar visibilidad del popup
    public togglePopup(): void {
        if (this.isVisible()) {
            this.hidePopup();
        } else {
            this.showPopup();
        }
    }

    // ✅ Mensaje de éxito - PÚBLICO
    public showSuccessMessage(): void {
        const toast = document.createElement('div');
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #45a049);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        toast.textContent = '🎉 ¡Reseña publicada con éxito!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }

    // Limpiar servicio
    public cleanup(): void {
        if (this.popupContainer && document.body.contains(this.popupContainer)) {
            document.body.removeChild(this.popupContainer);
        }
        
        this.popupContainer = null;
        this.antojarComponent = null;
    }

    // Verificar si está visible
    public isVisible(): boolean {
        return this.popupContainer?.style.display === 'flex' || false;
    }
}

// ✅ ASIGNACIÓN SIN ANY - USANDO EXTENSIÓN DE INTERFAZ
interface WindowWithAntojar extends Window {
    AntojarPopupService: {
        getInstance(): AntojarPopupService;
    };
}

if (typeof window !== 'undefined') {
    (window as WindowWithAntojar).AntojarPopupService = {
        getInstance: () => AntojarPopupService.getInstance()
    };
}

export default AntojarPopupService;