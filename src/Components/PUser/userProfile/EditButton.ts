// Esta es una definición de tipo que nos dice qué métodos debe tener el modal de edición
interface EditProfileModal extends HTMLElement {
    show(): void; // Método para mostrar el modal
    hide(): void; // Método para ocultar el modal
}

// Esta es la clase principal que crea el botón de "Editar" perfil
class UserEditButton extends HTMLElement {
    // Variable privada que guarda la referencia al modal de edición
    private modal: EditProfileModal | null = null;

    // Constructor: se ejecuta cuando se crea una nueva instancia del botón
    constructor() {
        super(); // Llamamos al constructor de la clase padre (HTMLElement)
        
        // Creamos un shadow DOM para aislar nuestros estilos del resto de la página
        this.attachShadow({ mode: 'open' });
        
        // Si el shadow DOM se creó correctamente, insertamos el HTML y CSS
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = /*html*/ `
            <style>
            /* Estilos para el contenedor del botón */
            .userEditar {
                max-width: 100%; /* El contenedor ocupa máximo el 100% del ancho */
                text-align: right; /* Alinea el contenido a la derecha */
                padding: 1rem; /* Espacio interno de 1rem */
            }

            /* Estilos para el botón de editar */
            .userEditar button {
                padding: 0.5rem 1rem; /* Espacio interno: 0.5rem arriba/abajo, 1rem izquierda/derecha */
                background-color: #AAAB54; /* Color de fondo verde */
                border: none; /* Sin borde */
                color: white; /* Texto en color blanco */
                border-radius: 0.5rem; /* Bordes redondeados */
                cursor: pointer; /* Cambia el cursor a una mano cuando se pasa por encima */
                font-size: 1rem; /* Tamaño de fuente */
                width: 5rem; /* Ancho fijo del botón */
                height: 2.5rem; /* Altura fija del botón */
                font-family: 'Inter', sans-serif; /* Tipo de fuente */
                transition: all 0.3s ease; /* Animación suave para todos los cambios */
                display: flex; /* Usa flexbox para alinear contenido */
                align-items: center; /* Centra verticalmente el contenido */
                justify-content: center; /* Centra horizontalmente el contenido */
                gap: 0.5rem; /* Espacio entre el ícono y el texto */
                font-weight: 600; /* Texto en negrita */
            }

            /* Efectos cuando el usuario pasa el mouse por encima del botón */
            .userEditar button:hover {
                background-color: #999A4A; /* Cambia a un verde más oscuro */
                transform: translateY(-2px); /* Mueve el botón 2px hacia arriba */
                box-shadow: 0 4px 8px rgba(170, 171, 84, 0.3); /* Añade una sombra */
            }

            /* Efecto cuando el usuario hace clic en el botón */
            .userEditar button:active {
                transform: translateY(0); /* Regresa el botón a su posición original */
            }

            /* Estilos para el ícono de editar */
            .edit-icon {
                width: 16px; /* Ancho del ícono */
                height: 16px; /* Altura del ícono */
                fill: currentColor; /* El ícono toma el color del texto */
            }

            /* ESTILOS RESPONSIVOS - Para tablets y pantallas medianas */
            @media (max-width: 768px) {
                .userEditar {
                    text-align: center; /* Centra el botón en lugar de alinearlo a la derecha */
                    padding: 0.5rem; /* Reduce el espacio interno */
                }
                
                .userEditar button {
                    width: auto; /* El ancho se ajusta automáticamente */
                    min-width: 5rem; /* Pero tiene un ancho mínimo */
                    font-size: 0.9rem; /* Reduce ligeramente el tamaño de fuente */
                    padding: 0.5rem 1rem; /* Mantiene el mismo espacio interno */
                    height: 2.5rem; /* Mantiene la misma altura */
                }
            }

            /* ESTILOS RESPONSIVOS - Para móviles */
            @media (max-width: 480px) {
                .userEditar button {
                    font-size: 0.8rem; /* Reduce más el tamaño de fuente */
                    padding: 0.4rem 0.8rem; /* Reduce el espacio interno */
                    height: 2.2rem; /* Reduce ligeramente la altura */
                    width: 100%; /* El botón ocupa todo el ancho disponible */
                    max-width: 120px; /* Pero no más de 120px */
                }
            }

            /* Estilos cuando el botón está deshabilitado */
            .userEditar button:disabled {
                background-color: #ccc; /* Color gris */
                cursor: not-allowed; /* Cursor que indica que no se puede hacer clic */
                transform: none; /* Sin efectos de movimiento */
                box-shadow: none; /* Sin sombra */
            }

            /* Estilos cuando el botón está en estado de carga */
            .userEditar button.loading {
                position: relative; /* Posicionamiento relativo para el spinner */
                color: transparent; /* Oculta el texto */
            }

            /* Spinner de carga que aparece cuando el botón está cargando */
            .userEditar button.loading::after {
                content: ''; /* Sin contenido de texto */
                position: absolute; /* Posicionamiento absoluto */
                width: 16px; /* Ancho del spinner */
                height: 16px; /* Altura del spinner */
                top: 50%; /* Posiciona en el centro vertical */
                left: 50%; /* Posiciona en el centro horizontal */
                margin-left: -8px; /* Ajuste para centrar horizontalmente */
                margin-top: -8px; /* Ajuste para centrar verticalmente */
                border: 2px solid #ffffff; /* Borde blanco */
                border-radius: 50%; /* Forma circular */
                border-top-color: transparent; /* La parte superior es transparente */
                animation: spin 1s linear infinite; /* Animación de rotación infinita */
            }

            /* Definición de la animación de rotación para el spinner */
            @keyframes spin {
                to {
                    transform: rotate(360deg); /* Rota 360 grados */
                }
            }
            </style>
            
            <!-- HTML del botón -->
            <div class="userEditar">
                <button id="edit-btn">
                    <!-- Ícono SVG de editar -->
                    <svg class="edit-icon" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                </button>
            </div>
            `;
        }
    }

    // Se ejecuta cuando el componente se añade al DOM (página web)
    connectedCallback(): void {
        console.log('🔧 UserEditButton: Conectado al DOM'); // Mensaje de depuración
        this.setupEventListeners(); // Configura los eventos del botón
        this.createModal(); // Crea el modal de edición
    }

    // Se ejecuta cuando el componente se quita del DOM
    disconnectedCallback(): void {
        console.log('🔧 UserEditButton: Desconectado del DOM'); // Mensaje de depuración
        this.removeModal(); // Elimina el modal para liberar memoria
    }

    // Función privada que crea el modal de edición de perfil
    private createModal(): void {
        // Primero verifica si ya existe un modal en la página
        const existingModal = document.querySelector('edit-profile-modal') as EditProfileModal | null;
        
        // Si ya existe, simplemente lo guarda en nuestra variable
        if (existingModal) {
            this.modal = existingModal;
            return;
        }

        // Si no existe, crea uno nuevo
        const newModal = document.createElement('edit-profile-modal') as EditProfileModal;
        document.body.appendChild(newModal); // Lo añade al final del body
        this.modal = newModal; // Guarda la referencia
        
        console.log(' UserEditButton: Modal de edición creado'); // Mensaje de depuración
    }

    // Función privada que elimina el modal del DOM
    private removeModal(): void {
        // Verifica si el modal existe y está en el DOM
        if (this.modal && document.body.contains(this.modal)) {
            document.body.removeChild(this.modal); // Lo elimina del DOM
            this.modal = null; // Limpia la referencia
        }
    }

    // Función privada que configura los eventos (como hacer clic en el botón)
    private setupEventListeners(): void {
        // Busca el botón de editar en nuestro shadow DOM
        const editBtn = this.shadowRoot?.querySelector('#edit-btn');
        
        // Si encuentra el botón, le añade un listener para el evento click
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                console.log(' UserEditButton: Botón editar clickeado'); // Mensaje de depuración
                this.handleEditClick(); // Llama a la función que maneja el clic
            });
        }
    }

    // Función privada que se ejecuta cuando el usuario hace clic en "Editar"
    private handleEditClick(): void {
        // Busca el botón en el shadow DOM
        const button = this.shadowRoot?.querySelector('#edit-btn') as HTMLButtonElement;
        
        // Si no encuentra el botón, sale de la función
        if (!button) return;

        // Deshabilita el botón y añade el estado de carga
        button.disabled = true; // El usuario no puede hacer clic mientras carga
        button.classList.add('loading'); // Añade la clase CSS para mostrar el spinner

        try {
            // Verifica si el modal existe, si no, lo crea
            if (!this.modal) {
                console.log(' UserEditButton: Creando modal...');
                this.createModal();
            }

            // Espera 300ms (para mostrar la animación de carga) y luego abre el modal
            setTimeout(() => {
                // Verifica que el modal existe y tiene el método 'show'
                if (this.modal && this.hasShowMethod(this.modal)) {
                    console.log(' UserEditButton: Abriendo modal de edición');
                    this.modal.show(); // Muestra el modal
                } else {
                    // Si algo salió mal, muestra un error
                    console.error(' Modal no disponible o sin método show');
                    alert('Error: No se pudo abrir el editor de perfil');
                }

                // Restaura el botón a su estado normal
                button.disabled = false; // Habilita el botón otra vez
                button.classList.remove('loading'); // Quita el spinner de carga
            }, 300); // Espera 300 milisegundos

        } catch (error) {
            // Si ocurre algún error, lo registra y muestra un mensaje al usuario
            console.error(' Error al abrir modal:', error);
            alert('Error al abrir el editor de perfil');
            
            // Restaura el botón a su estado normal
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    // Función auxiliar que verifica si un elemento tiene el método 'show'
    private hasShowMethod(element: HTMLElement): element is EditProfileModal {
        return typeof (element as EditProfileModal).show === 'function';
    }

    // Método público que permite abrir el modal desde fuera del componente
    public openEditModal(): void {
        this.handleEditClick(); // Simplemente llama a la función de manejo de clic
    }

    // Método público que verifica si el modal está disponible y funcionando
    public isModalAvailable(): boolean {
        return !!this.modal && this.hasShowMethod(this.modal);
    }

    // Método público para depuración - muestra información útil en la consola
    public debugInfo(): void {
        console.log(' UserEditButton Debug:');
        console.log('- Modal exists:', !!this.modal); // ¿Existe el modal?
        console.log('- Modal in DOM:', this.modal ? document.body.contains(this.modal) : false); // ¿Está en el DOM?
        console.log('- Modal has show method:', this.modal ? this.hasShowMethod(this.modal) : false); // ¿Tiene método show?
        console.log('- Button element:', !!this.shadowRoot?.querySelector('#edit-btn')); // ¿Existe el botón?
    }
}

// Exporta la clase para que pueda ser usada en otros archivos
export default UserEditButton;