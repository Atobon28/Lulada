// Importamos el componente principal de Antojar
import { LuladaAntojar } from './antojar';

// Esta clase maneja la ventana emergente (popup) donde aparece el formulario para crear reseñas
export class AntojarPopupService {
    // Variable estática para asegurar que solo exista una instancia del servicio (patrón Singleton)
    static instance: AntojarPopupService;
    
    // El contenedor principal del popup (la caja que contiene todo)
    popupContainer: HTMLDivElement | null = null;
    
    // El componente del formulario de reseñas que va dentro del popup
    antojarComponent: LuladaAntojar | null = null;

    constructor() {
        // Constructor vacío - toda la lógica está en otros métodos
    }

    // Método para obtener la única instancia del servicio (patrón Singleton)
    // Esto asegura que siempre usemos el mismo popup en toda la aplicación
    public static getInstance(): AntojarPopupService {
        if (!AntojarPopupService.instance) {
            AntojarPopupService.instance = new AntojarPopupService();
        }
        return AntojarPopupService.instance;
    }

    // Prepara el contenedor del popup (la ventana de fondo oscuro)
    public initialize(): void {
        // Solo crear el contenedor si no existe ya
        if (!this.popupContainer) {
            // Crear el elemento div que será nuestro contenedor
            this.popupContainer = document.createElement('div');
            this.popupContainer.className = 'antojar-popup-container';
            
            // Aplicar estilos CSS para que cubra toda la pantalla
            this.popupContainer.style.cssText = `
                position: fixed;           /* Se queda fijo en la pantalla */
                top: 0;                   /* Empieza desde arriba */
                left: 0;                  /* Empieza desde la izquierda */
                width: 100vw;             /* Ocupa todo el ancho de la pantalla */
                height: 100vh;            /* Ocupa toda la altura de la pantalla */
                background-color: rgba(0, 0, 0, 0.5);  /* Fondo negro semi-transparente */
                display: none;            /* Inicialmente oculto */
                justify-content: center;  /* Centra el contenido horizontalmente */
                align-items: center;      /* Centra el contenido verticalmente */
                z-index: 10000;          /* Aparece por encima de todo lo demás */
                opacity: 0;              /* Empieza invisible */
                transition: opacity 0.3s ease;  /* Animación suave al aparecer/desaparecer */
                padding: 20px;           /* Espacio interno */
                box-sizing: border-box;  /* Incluye padding en el tamaño total */
                overflow-y: auto;        /* Permite scroll si el contenido es muy alto */
            `;

            // Añadir el contenedor al final del body de la página
            document.body.appendChild(this.popupContainer);

            // Configurar para cerrar el popup cuando se hace click fuera del formulario
            this.popupContainer.addEventListener('click', (e) => {
                // Si el click fue en el fondo oscuro (no en el formulario), cerrar popup
                if (e.target === this.popupContainer) {
                    this.hidePopup();
                }
            });
        }
    }

    // Función principal para mostrar el popup
    public showPopup(): void {
        console.log(" Mostrando popup de antojar");
        
        // Primero asegurarse de que el contenedor esté listo
        this.initialize();

        // Verificar si el componente del formulario ya está registrado en el navegador
        if (!customElements.get('lulada-antojar')) {
            console.warn(" El componente lulada-antojar no está registrado");
            
            // Si no está registrado, intentar cargarlo dinámicamente
            import('./antojar').then(module => {
                // Registrar el componente para que el navegador lo reconozca
                if (!customElements.get('lulada-antojar')) {
                    customElements.define('lulada-antojar', module.LuladaAntojar);
                }
                // Una vez registrado, crear y mostrar el componente
                this.createAndShowComponent();
            }).catch(error => {
                // Si hay error al cargar, mostrar mensaje de error
                console.error(" Error al cargar componente antojar:", error);
                alert("Error al cargar el formulario de reseñas");
            });
        } else {
            // Si ya está registrado, crear y mostrar directamente
            this.createAndShowComponent();
        }
    }

    // Crea el formulario de reseñas y lo muestra en el popup
    private createAndShowComponent(): void {
        // Solo crear el componente si no existe ya
        if (!this.antojarComponent) {
            console.log(" Creando nuevo componente lulada-antojar");

            // Crear una nueva instancia del formulario de reseñas
            this.antojarComponent = document.createElement('lulada-antojar') as LuladaAntojar;

            // Aplicar estilos al formulario para que se vea bien en el popup
            this.antojarComponent.style.cssText = `
                width: 100%;              /* Ocupa todo el ancho disponible */
                max-width: 550px;         /* Pero no más de 550px */
                max-height: 90vh;         /* No más del 90% de la altura de pantalla */
                overflow-y: auto;         /* Scroll si el contenido es muy alto */
                transform: translateY(20px);  /* Empieza un poco más abajo para animación */
                transition: transform 0.3s ease;  /* Animación suave al aparecer */
                margin: auto;             /* Se centra automáticamente */
                box-sizing: border-box;   /* Incluye padding en el tamaño */
            `;

            // Configurar eventos del formulario

            // Cuando el usuario cierra el formulario (botón X)
            this.antojarComponent.addEventListener('antojar-cerrado', () => {
                console.log(" Evento antojar-cerrado recibido");
                this.hidePopup();
            });

            // Cuando el usuario publica una reseña exitosamente
            this.antojarComponent.addEventListener('resena-publicada', (e: Event) => {
                const detail = (e as CustomEvent).detail;
                console.log(' Reseña publicada:', detail);
                
                // Cerrar el popup
                this.hidePopup();
                
                // Mostrar mensaje de éxito
                this.showSuccessMessage();
                
                // Avisar a otros componentes que hay una nueva publicación
                document.dispatchEvent(new CustomEvent('nueva-publicacion', {
                    detail: detail,
                    bubbles: true
                }));
            });

            // Añadir el formulario dentro del contenedor del popup
            if (this.popupContainer) {
                this.popupContainer.appendChild(this.antojarComponent);
                console.log("Componente añadido al contenedor");
            }
        }

        // Mostrar el popup con animación suave
        if (this.popupContainer) {
            // Hacer visible el contenedor
            this.popupContainer.style.display = 'flex';
            
            // Pequeña pausa para que el navegador procese el cambio anterior
            setTimeout(() => {
                // Hacer aparecer el fondo oscuro gradualmente
                if (this.popupContainer) {
                    this.popupContainer.style.opacity = '1';
                }
                // Hacer que el formulario se deslice hacia arriba
                if (this.antojarComponent) {
                    this.antojarComponent.style.transform = 'translateY(0)';
                }
            }, 10);
        }
    }

    // Oculta el popup con animación
    public hidePopup(): void {
        console.log("👋 Ocultando popup de antojar");
        
        if (this.popupContainer) {
            // Hacer que el fondo oscuro desaparezca gradualmente
            this.popupContainer.style.opacity = '0';
            
            // Hacer que el formulario se deslice hacia abajo
            if (this.antojarComponent) {
                this.antojarComponent.style.transform = 'translateY(20px)';
            }

            // Después de la animación, ocultar completamente el popup
            setTimeout(() => {
                if (this.popupContainer) {
                    this.popupContainer.style.display = 'none';
                }
            }, 300);  // 300ms = duración de la animación
        }
    }

    // Muestra un mensaje de éxito cuando se publica una reseña
    private showSuccessMessage(): void {
        // Crear un elemento para el mensaje
        const toast = document.createElement('div');
        
        // Aplicar estilos para que sea un mensaje bonito en la esquina
        toast.style.cssText = `
            position: fixed;             /* Se queda fijo en la pantalla */
            top: 20px;                  /* 20px desde arriba */
            right: 20px;                /* 20px desde la derecha */
            background: linear-gradient(135deg, #4CAF50, #45a049);  /* Fondo verde degradado */
            color: white;               /* Texto blanco */
            padding: 16px 24px;         /* Espacio interno */
            border-radius: 12px;        /* Bordes redondeados */
            z-index: 10001;            /* Por encima del popup */
            font-family: Arial, sans-serif;  /* Fuente */
            font-weight: 600;           /* Texto en negrita */
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.3);  /* Sombra verde */
            transform: translateX(100%); /* Empieza fuera de la pantalla (derecha) */
            transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* Animación elástica */
            backdrop-filter: blur(10px); /* Efecto de difuminado */
            border: 1px solid rgba(255, 255, 255, 0.2);  /* Borde semi-transparente */
        `;
        
        // Texto del mensaje
        toast.textContent = '🎉 ¡Reseña publicada con éxito!';
        
        // Añadir el mensaje a la página
        document.body.appendChild(toast);
        
        // Animación de entrada: deslizar desde la derecha
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Después de 3 segundos, quitar el mensaje
        setTimeout(() => {
            // Animación de salida: deslizar hacia la derecha
            toast.style.transform = 'translateX(100%)';
            
            // Después de la animación, eliminar del DOM
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 400);
        }, 3000);  // 3000ms = 3 segundos
    }

    // Limpia completamente el servicio (elimina todo)
    public cleanup(): void {
        // Si el contenedor existe y está en la página, eliminarlo
        if (this.popupContainer && document.body.contains(this.popupContainer)) {
            document.body.removeChild(this.popupContainer);
        }
        
        // Resetear las variables
        this.popupContainer = null;
        this.antojarComponent = null;
    }

    // Verifica si el popup está actualmente visible
    public isVisible(): boolean {
        return this.popupContainer?.style.display === 'flex' || false;
    }
}

// Hacer que el servicio esté disponible globalmente en toda la aplicación
// Esto permite que otros componentes puedan usarlo fácilmente
if (typeof window !== 'undefined') {
    window.AntojarPopupService = AntojarPopupService;
}

// Exportar para que otros archivos puedan importarlo
export default AntojarPopupService;