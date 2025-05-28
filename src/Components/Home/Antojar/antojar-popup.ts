// src/Components/Home/Antojar/antojar-popup.ts - LIMPIO SIN MAPAS

import { LuladaAntojar } from './antojar';

export class AntojarPopupService {
    static instance: AntojarPopupService;
    popupContainer: HTMLDivElement | null = null;
    antojarComponent: LuladaAntojar | null = null;

    constructor() {
        // Constructor vacío
    }

    public static getInstance(): AntojarPopupService {
        if (!AntojarPopupService.instance) {
            AntojarPopupService.instance = new AntojarPopupService();
        }
        return AntojarPopupService.instance;
    }

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

            // Cerrar popup al hacer click fuera del contenido
            this.popupContainer.addEventListener('click', (e) => {
                if (e.target === this.popupContainer) {
                    this.hidePopup();
                }
            });
        }
    }

    public showPopup(): void {
        console.log("📝 Mostrando popup de antojar");
        this.initialize();

        // Verificar si el componente ya está registrado
        if (!customElements.get('lulada-antojar')) {
            console.warn("⚠️ El componente lulada-antojar no está registrado");
            
            // Intentar importarlo dinámicamente
            import('./antojar').then(module => {
                if (!customElements.get('lulada-antojar')) {
                    customElements.define('lulada-antojar', module.LuladaAntojar);
                }
                this.createAndShowComponent();
            }).catch(error => {
                console.error("❌ Error al cargar componente antojar:", error);
                alert("Error al cargar el formulario de reseñas");
            });
        } else {
            this.createAndShowComponent();
        }
    }

    private createAndShowComponent(): void {
        if (!this.antojarComponent) {
            console.log("🆕 Creando nuevo componente lulada-antojar");

            this.antojarComponent = document.createElement('lulada-antojar') as LuladaAntojar;

            // Estilos para el componente
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

            // Escuchar evento de cierre
            this.antojarComponent.addEventListener('antojar-cerrado', () => {
                console.log("🔔 Evento antojar-cerrado recibido");
                this.hidePopup();
            });

            // Escuchar evento de publicación exitosa
            this.antojarComponent.addEventListener('resena-publicada', (e: Event) => {
                const detail = (e as CustomEvent).detail;
                console.log('✅ Reseña publicada:', detail);
                this.hidePopup();
                
                // Mostrar mensaje de éxito
                this.showSuccessMessage();
                
                // Disparar evento global para que otros componentes se actualicen
                document.dispatchEvent(new CustomEvent('nueva-publicacion', {
                    detail: detail,
                    bubbles: true
                }));
            });

            // Añadir componente al contenedor
            if (this.popupContainer) {
                this.popupContainer.appendChild(this.antojarComponent);
                console.log("✅ Componente añadido al contenedor");
            }
        }

        // Mostrar el contenedor con animación
        if (this.popupContainer) {
            this.popupContainer.style.display = 'flex';
            
            // Pequeño delay para permitir que el display se aplique
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

    public hidePopup(): void {
        console.log("👋 Ocultando popup de antojar");
        
        if (this.popupContainer) {
            this.popupContainer.style.opacity = '0';
            
            if (this.antojarComponent) {
                this.antojarComponent.style.transform = 'translateY(20px)';
            }

            // Ocultar después de la animación
            setTimeout(() => {
                if (this.popupContainer) {
                    this.popupContainer.style.display = 'none';
                }
            }, 300);
        }
    }

    private showSuccessMessage(): void {
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
        
        // Animación de entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Animación de salida y eliminación
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }

    // Método público para limpiar el servicio
    public cleanup(): void {
        if (this.popupContainer && document.body.contains(this.popupContainer)) {
            document.body.removeChild(this.popupContainer);
        }
        this.popupContainer = null;
        this.antojarComponent = null;
    }

    // Método para verificar si el popup está visible
    public isVisible(): boolean {
        return this.popupContainer?.style.display === 'flex' || false;
    }
}

// Hacer el servicio accesible globalmente
if (typeof window !== 'undefined') {
    window.AntojarPopupService = AntojarPopupService;
}

export default AntojarPopupService;