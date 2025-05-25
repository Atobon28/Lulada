export class LuladaAntojar extends HTMLElement {
    shadow: ShadowRoot;
    selectedStars: number = 0;
    locationSelected: boolean = false;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        console.log("Componente LuladaAntojar creado");
    }

    connectedCallback() {
        console.log("Componente LuladaAntojar conectado al DOM");
        this.render();
        this.setupEvents();
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                /* Estilos del popup */
                .popup {
                    background: white;
                    padding: 25px;
                    border-radius: 20px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                    max-width: 550px;
                    width: 100%;
                    font-family: Arial, sans-serif;
                    position: relative;
                }
                .close-button {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #333;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    z-index: 10;
                }
                .close-button:hover {
                    transform: scale(1.1);
                }
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    margin-left: 10px;
                }
                .profile-pic {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    margin-right: 12px;
                    object-fit: cover;
                }
                .header-text {
                    font-size: 18px;
                    color: #999;
                    font-weight: normal;
                }
                textarea {
                    width: 100%;
                    min-height: 140px;
                    border: none;
                    resize: none;
                    font-size: 16px;
                    margin-bottom: 16px;
                    outline: none;
                    font-family: Arial, sans-serif;
                    line-height: 1.5;
                    color: #333;
                    box-sizing: border-box;
                }
                .bottom-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid #f0f0f0;
                }
                .icon-buttons {
                    display: flex;
                    gap: 15px;
                }
                .action-icon {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #666;
                    width: 24px;
                    height: 24px;
                    stroke: currentColor;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    fill: none;
                }
                .action-icon:hover {
                    transform: scale(1.1);
                }
                
                /* Modificado para que sea azul al hover y amarillo cuando activo */
                .location-icon:hover {
                    color: #4285F4 !important; /* Azul de Google */
                }
                .location-icon.active {
                    color: rgb(244, 238, 66) !important; /* Amarillo */
                }
                .stars {
                    display: flex;
                    gap: 5px;
                }
                .star {
                    color: #FFD700;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .star-outline {
                    color: #FFD700;
                    display: inline-block;
                    font-size: 24px;
                    cursor: pointer;
                }
                .star-outline.active {
                    color: #FFD700 !important;
                }
                .publish-button {
                    background-color: #AAAB54;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    padding: 10px 30px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                }
                .publish-button:hover {
                    transform: scale(1.05);
                    background-color: rgb(132, 134, 58);
                }
                .icon-container {
                    display: flex;
                    align-items: center;
                }
                .icon-wrapper {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                .rating-stars {
                    display: flex;
                    align-items: center;
                }
            </style>
            <div class="popup">
                <button id="cerrar" class="close-button">✕</button>
                <div class="header">
                    <img 
                        id="profile-pic"
                        src=""
                        alt="Profile" 
                        class="profile-pic"
                    >
                    <div class="header-text">Que probaste?</div>
                </div>
                <textarea placeholder=""></textarea>
                <div class="bottom-actions">
                    <div class="icon-container">
                        <div class="icon-wrapper">
                            <svg class="action-icon photo-icon" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                        </div>
                        <div class="icon-wrapper">
                            <svg id="location-icon" class="action-icon location-icon" viewBox="0 0 24 24">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                    </div>
                    <div class="rating-stars">
                        <span class="star-outline" data-value="1">☆</span>
                        <span class="star-outline" data-value="2">☆</span>
                        <span class="star-outline" data-value="3">☆</span>
                        <span class="star-outline" data-value="4">☆</span>
                        <span class="star-outline" data-value="5">☆</span>
                    </div>
                    <button id="publicar" class="publish-button">Publicar</button>
                </div>
            </div>
        `;

        // Generar una imagen de perfil aleatoria al cargar inicialmente
        this.updateProfilePicture();
    }

    setupEvents() {
        console.log("Configurando eventos del componente LuladaAntojar"); // Muestra un mensaje en la consola indicando que se están configurando los eventos
        const cerrar = this.shadow.querySelector('#cerrar'); // Busca el elemento con id 'cerrar' en el shadow DOM
        const publicar = this.shadow.querySelector('#publicar'); // Busca el elemento con id 'publicar' en el shadow DOM
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement; // Busca el elemento textarea y lo convierte al tipo HTMLTextAreaElement
        const estrellas = this.shadow.querySelectorAll('.star-outline'); // Busca todos los elementos con clase 'star-outline'
        const locationIcon = this.shadow.querySelector('#location-icon'); // Busca el elemento con id 'location-icon'

        if (cerrar) {
            cerrar.addEventListener('click', () => { // Agrega un evento click al botón cerrar
                console.log("Botón cerrar clickeado"); // Muestra mensaje en consola cuando se hace clic
                // Reiniciar el estado del componente al cerrar
                this.resetComponentState(); // Llama al método para reiniciar el estado del componente
                this.dispatchEvent(new CustomEvent('antojar-cerrado', { bubbles: true, composed: true })); // Dispara un evento personalizado 'antojar-cerrado' que puede ser escuchado por componentes padre
            });
        } else {
            console.error("Botón cerrar no encontrado"); // Muestra un error si no se encuentra el botón
        }

        if (publicar) {
            publicar.addEventListener('click', () => { // Agrega un evento click al botón publicar
                console.log("Botón publicar clickeado"); // Muestra mensaje en consola
                const texto = textarea.value.trim(); // Obtiene el texto del textarea y elimina espacios en blanco
                if (texto) { // Verifica que el texto no esté vacío
                    this.dispatchEvent(new CustomEvent('resena-publicada', { // Dispara evento personalizado con los datos de la reseña
                        detail: { // Incluye detalles de la reseña
                            texto: texto, // El texto escrito en el textarea
                            estrellas: this.selectedStars, // Cantidad de estrellas seleccionadas
                            ubicacion: this.locationSelected // Si se seleccionó compartir ubicación
                        },
                        bubbles: true, // Permite que el evento se propague hacia arriba en el DOM
                        composed: true // Permite que el evento cruce los límites del Shadow DOM
                    }));
                    // Reiniciar el estado del componente después de publicar
                    this.resetComponentState(); // Limpia el formulario después de publicar
                }
            });
        } else {
            console.error("Botón publicar no encontrado"); // Muestra error si no encuentra el botón
        }

        // Funcionalidad para las estrellas (ahora con ☆)
        estrellas.forEach((estrella) => { // Itera sobre cada elemento de estrella
            estrella.addEventListener('click', (e) => { // Agrega evento click a cada estrella
                const target = e.target as HTMLElement; // Convierte el objetivo del evento a HTMLElement
                const value = parseInt(target.getAttribute('data-value') || '0'); // Obtiene el valor numérico de la estrella desde el atributo data-value
                this.selectedStars = value; // Guarda el valor seleccionado

                // Actualizar visualmente las estrellas con clase active para mantener el color
                estrellas.forEach((e) => { // Recorre todas las estrellas para actualizar su aspecto
                    const starValue = parseInt(e.getAttribute('data-value') || '0'); // Obtiene el valor de cada estrella
                    if (starValue <= value) { // Si la estrella debe estar activa (menor o igual al valor seleccionado)
                        e.textContent = '★'; // Cambia a estrella rellena
                        e.classList.add('active'); // Agrega clase para estilo visual
                    } else {
                        e.textContent = '☆'; // Cambia a estrella vacía
                        e.classList.remove('active'); // Quita clase de estilo
                    }
                });
            });
        });

        // Funcionalidad para el icono de ubicación
        if (locationIcon) {
            locationIcon.addEventListener('click', () => { // Agrega evento click al icono de ubicación
                this.locationSelected = !this.locationSelected; // Invierte el estado de selección de ubicación
                if (this.locationSelected) {
                    locationIcon.classList.add('active'); // Agrega clase si está activo
                } else {
                    locationIcon.classList.remove('active'); // Quita clase si está inactivo
                }
            });
        }
    }

    // Método para actualizar la imagen de perfil con una aleatoria
    updateProfilePicture() {
        const profilePic = this.shadow.querySelector('#profile-pic') as HTMLImageElement; // Busca la imagen de perfil
        if (profilePic) {
            const gender = Math.random() > 0.5 ? 'men' : 'women'; // Selecciona género aleatorio (hombre o mujer)
            const randomId = Math.floor(Math.random() * 100); // Genera un ID aleatorio entre 0 y 99
            profilePic.src = `https://randomuser.me/api/portraits/thumb/${gender}/${randomId}.jpg`; // Asigna una URL de imagen aleatoria
        }
    }

    // Método para reiniciar el estado del componente
    resetComponentState() {
        console.log("Reiniciando estado del componente"); // Mensaje de depuración
        const textarea = this.shadow.querySelector('textarea') as HTMLTextAreaElement; // Obtiene el textarea
        const estrellas = this.shadow.querySelectorAll('.star-outline'); // Obtiene todas las estrellas
        const locationIcon = this.shadow.querySelector('#location-icon'); // Obtiene el icono de ubicación

        // Limpiar texto
        if (textarea) {
            textarea.value = ''; // Vacía el contenido del textarea
        }

        // Resetear estrellas
        this.selectedStars = 0; // Reinicia la variable de estrellas seleccionadas
        estrellas.forEach((estrella) => {
            estrella.textContent = '☆'; // Cambia todas las estrellas a vacías
            estrella.classList.remove('active'); // Elimina la clase active de todas las estrellas
        });

        // Resetear ubicación
        this.locationSelected = false; // Desactiva la selección de ubicación
        if (locationIcon) {
            locationIcon.classList.remove('active'); // Quita la clase active del icono
        }

        // Generar una nueva imagen de perfil aleatoria
        this.updateProfilePicture(); // Llama al método para actualizar la imagen de perfil
    }
}

// Asegúrate de que el componente esté registrado una sola vez
if (!customElements.get('lulada-antojar')) { // Verifica si el componente ya está registrado
    console.log("Registrando componente LuladaAntojar"); // Mensaje de registro
    customElements.define('lulada-antojar', LuladaAntojar); // Registra el componente web personalizado
} else {
    console.log("Componente LuladaAntojar ya está registrado"); // Informa que ya estaba registrado
}