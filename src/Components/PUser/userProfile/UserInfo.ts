// Traemos las herramientas que necesitamos para manejar los datos del usuario
import { userStore, UserState } from "../../../Services/flux/UserStore";
import { UserData } from "../../../Services/flux/UserActions";

// === INTERFACES ===
// Definimos qué funciones públicas tendrá nuestro componente
// Es como un "contrato" que dice qué puede hacer el componente desde afuera
interface UserInfoElement extends HTMLElement {
    forceUpdate(): void;  // Para actualizar manualmente el componente
    debugInfo(): void;    // Para ver información de debugging en la consola
}

// === CONFIGURACIÓN ===
// URL de la foto que usaremos para todos los usuarios
// En lugar de fotos aleatorias, usamos siempre la misma foto
const FIXED_PROFILE_PHOTO = "https://randomuser.me/api/portraits/women/44.jpg";

// === DEFINICIÓN DEL COMPONENTE ===
// Creamos nuestro componente personalizado llamado <user-info>
class UserInfo extends HTMLElement implements UserInfoElement {
    
    // === VARIABLES INTERNAS DEL COMPONENTE ===
    private currentUser: UserData | null = null;           // Aquí guardamos los datos del usuario
    private storeListener = this.handleStoreChange.bind(this);  // Función que se ejecuta cuando cambian los datos
    private _isConnected = false;                          // Para saber si el componente está activo

    // === CONSTRUCTOR ===
    // Se ejecuta cuando se crea el componente
    constructor() {
        super(); // Llamamos al constructor padre
        
        // Creamos el shadow DOM (un contenedor aislado para nuestro HTML/CSS)
        this.attachShadow({ mode: 'open' });
        console.log('UserInfo: Componente de perfil creado');
    }

    // === CUANDO EL COMPONENTE SE CONECTA A LA PÁGINA ===
    // Se ejecuta automáticamente cuando el componente aparece en la página
    connectedCallback() {
        console.log('UserInfo: El componente se conectó al DOM');
        this._isConnected = true; // Marcamos que está activo
        
        // PASO 1: Nos suscribimos para recibir notificaciones cuando cambien los datos del usuario
        // Es como decir "avísame cuando el usuario cambie su nombre o descripción"
        userStore.subscribe(this.storeListener);
        console.log('📡 Nos suscribimos al UserStore para recibir actualizaciones del perfil');
        
        // PASO 2: Obtenemos los datos actuales del usuario
        // Esperamos un poquito para asegurar que todo esté listo
        setTimeout(() => {
            const initialState = userStore.getState();
            console.log('Datos iniciales del usuario encontrados:', initialState.currentUser?.nombreDeUsuario);
            this.handleStoreChange(initialState);
        }, 100);
    }

    // === CUANDO EL COMPONENTE SE DESCONECTA DE LA PÁGINA ===
    // Se ejecuta automáticamente cuando el componente desaparece de la página
    disconnectedCallback() {
        console.log(' UserInfo: El componente se desconectó del DOM');
        this._isConnected = false; // Marcamos que ya no está activo
        
        // Nos desuscribimos para no seguir recibiendo notificaciones
        // Es importante hacer esto para evitar problemas de memoria
        if (userStore) {
            userStore.unsubscribe(this.storeListener);
            console.log(' Nos desuscribimos del UserStore');
        }
    }

    // === FUNCIÓN QUE SE EJECUTA CUANDO CAMBIAN LOS DATOS DEL USUARIO ===
    // Es como un "detector de cambios" que actualiza automáticamente la interfaz
    private handleStoreChange(state: UserState): void {
        // Si el componente ya no está en la página, no hacemos nada
        if (!this._isConnected) {
            console.log('UserInfo: Componente desconectado, ignorando cambio de datos');
            return;
        }

        const newUser = state.currentUser; // Obtenemos los nuevos datos del usuario
        console.log('UserInfo: Detectamos cambio en los datos del usuario:', newUser?.nombreDeUsuario);
        
        // Comparamos si realmente hubo cambios importantes
        // Convertimos los objetos a texto para compararlos fácilmente
        const userChanged = !this.currentUser || 
                          !newUser || 
                          JSON.stringify(this.currentUser) !== JSON.stringify(newUser);
        
        if (userChanged) {
            console.log('UserInfo: Los datos del usuario han cambiado, actualizando el perfil...');
            console.log(' Usuario anterior:', this.currentUser?.nombreDeUsuario || 'ninguno');
            console.log(' Usuario nuevo:', newUser?.nombreDeUsuario || 'ninguno');
            
            // Guardamos una copia de los nuevos datos
            this.currentUser = newUser ? { ...newUser } : null;
            
            // Redibujamos todo el componente con los nuevos datos
            this.render();
            
            // También actualizamos elementos específicos para mayor rapidez
            setTimeout(() => {
                if (newUser) {
                    this.updateDOMDirectly(newUser);
                }
            }, 50);
            
        } else {
            console.log('UserInfo: Los datos no cambiaron, no es necesario actualizar');
        }
    }

    // === FUNCIÓN PARA ACTUALIZAR ELEMENTOS ESPECÍFICOS ===
    // En lugar de redibujar todo, solo cambia los elementos que necesitan cambiar
    private updateDOMDirectly(user: UserData): void {
        // Si no tenemos shadow DOM o el componente no está activo, salimos
        if (!this.shadowRoot || !this._isConnected) return;
        
        console.log('UserInfo: Actualizando elementos específicos del DOM con:', user.nombreDeUsuario);
        
        // Buscamos los elementos específicos que muestran información del usuario
        const elements = {
            username: this.shadowRoot.querySelector('.nombreDeUsuario') as HTMLElement | null,     // El @NombreUsuario
            name: this.shadowRoot.querySelector('.nombre') as HTMLElement | null,                   // El nombre real
            description: this.shadowRoot.querySelector('.descripcion') as HTMLElement | null,      // La biografía
            photo: this.shadowRoot.querySelector('.foto') as HTMLImageElement | null               // La foto de perfil
        };
        
        console.log('Elementos encontrados en el DOM:', {
            username: !!elements.username,
            name: !!elements.name,
            description: !!elements.description,
            photo: !!elements.photo
        });
        
        // Actualizamos el username (el @NombreUsuario)
        if (elements.username && user.nombreDeUsuario) {
            console.log('Actualizando username en el DOM:', user.nombreDeUsuario);
            elements.username.textContent = user.nombreDeUsuario;
        }
        
        // Actualizamos el nombre real
        if (elements.name && user.nombre) {
            console.log('Actualizando nombre real en el DOM:', user.nombre);
            elements.name.textContent = user.nombre;
        }
        
        // Actualizamos la descripción/biografía
        if (elements.description && user.descripcion) {
            console.log('Actualizando descripción en el DOM:', user.descripcion);
            elements.description.textContent = user.descripcion;
        }
        
        // Mantenemos siempre la misma foto (no cambia con los datos del usuario)
        if (elements.photo) {
            console.log('Manteniendo la foto fija del perfil');
            elements.photo.src = FIXED_PROFILE_PHOTO;
        }
    }

    // === FUNCIÓN PRINCIPAL PARA DIBUJAR EL COMPONENTE ===
    // Es como el "pincel" que pinta toda la interfaz del perfil en la pantalla
    private render(): void {
        // Si no tenemos shadow DOM o el componente no está activo, no dibujamos nada
        if (!this.shadowRoot || !this._isConnected) return;
        console.log('UserInfo: Comenzando a dibujar el componente del perfil...');

        // Si no tenemos datos del usuario, mostramos una pantalla de "Cargando..."
        if (!this.currentUser) {
            console.log('UserInfo: No hay datos del usuario, mostrando pantalla de carga...');
            this.shadowRoot.innerHTML = `
                <style>
                    .loading {
                        text-align: center;           /* Centrar el contenido */
                        padding: 2rem;                /* Espacio interno */
                        color: #666;                  /* Color gris */
                        font-family: 'Inter', sans-serif;
                        background-color: #f9f9f9;    /* Fondo gris claro */
                        border-radius: 10px;          /* Bordes redondeados */
                        margin: 1rem;                 /* Margen externo */
                    }
                    .loading-spinner {
                        border: 2px solid #f3f3f3;   /* Borde base gris claro */
                        border-top: 2px solid #AAAB54; /* Borde superior verde (el que rota) */
                        border-radius: 50%;           /* Forma circular */
                        width: 20px;
                        height: 20px;
                        animation: spin 1s linear infinite; /* Animación de rotación infinita */
                        margin: 0 auto 10px;         /* Centrado con margen inferior */
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }   /* Empieza sin rotación */
                        100% { transform: rotate(360deg); } /* Termina con rotación completa */
                    }
                </style>
                <div class="loading">
                    <div class="loading-spinner"></div>
                    Cargando información del usuario...
                </div>
            `;
            return;
        }

        console.log('UserInfo: Dibujando perfil completo para el usuario:', this.currentUser.nombreDeUsuario);

        // Dibujamos todo el HTML y CSS del perfil con los datos del usuario
        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                /* === ESTILOS CSS PARA EL PERFIL === */
                
                .userTopCompleto {
                    background-color: #ffffff;        /* Fondo blanco */
                    padding: 1.25rem;                 /* Espacio interno */
                    border-radius: 0.9375rem;         /* Bordes redondeados */
                    font-family: 'Inter', sans-serif; /* Fuente moderna */
                    max-width: 90%;                   /* Ancho máximo del 90% */
                    margin: auto;                     /* Centrado horizontalmente */
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    transition: all 0.3s ease;       /* Animación suave para cambios */
                }

                /* Efecto cuando pasas el mouse por encima: se eleva un poco */
                .userTopCompleto:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Sombra más pronunciada */
                    transform: translateY(-2px);     /* Se eleva ligeramente */
                }

                .etiquetados {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.80rem;
                    font-weight: bold;
                    margin-left: 3rem;
                }
                
                .userTop {
                    display: flex;                    /* Elementos en fila */
                    align-items: center;              /* Centrados verticalmente */
                    gap: 1rem;                       /* Espacio entre elementos */
                    min-width: 18.75rem;             /* Ancho mínimo */
                    min-height: 6.25rem;             /* Altura mínima */
                }
                
                .userTopFoto img {
                    border-radius: 50%;               /* Forma circular */
                    width: 13.4375rem;               /* Ancho fijo */
                    height: 13.4375rem;              /* Altura fija (igual al ancho para círculo perfecto) */
                    object-fit: cover;               /* La imagen se ajusta sin deformarse */
                    transition: transform 0.3s ease; /* Animación suave para transformaciones */
                    border: 3px solid #AAAB54;       /* Borde verde */
                }
                
                /* Efecto cuando pasas el mouse sobre la foto: se agranda un poco */
                .userTopFoto img:hover {
                    transform: scale(1.05);          /* Aumenta 5% el tamaño */
                }
                
                .userTopInfo {
                    flex: 1;                         /* Ocupa todo el espacio restante */
                }
                
                .nombreDeUsuario {
                    font-size: 1.25rem;             /* Tamaño de fuente mediano */
                    color: #AAAB54;                  /* Color verde característico */
                    font-weight: bold;               /* Texto en negrita */
                    margin-top: 0.8rem;
                    margin-bottom: 0.8rem;
                    transition: all 0.3s ease;      /* Animación suave para cambios */
                }
                
                .nombre {
                    font-size: 1.625rem;            /* Tamaño de fuente grande */
                    font-weight: bold;               /* Texto en negrita */
                    color: #000;                     /* Color negro */
                    margin-top: 0.4rem;
                    margin-bottom: 0.5rem;
                    transition: color 0.3s ease;    /* Animación suave para cambios de color */
                }
                
                .descripcion {
                    font-size: 1rem;                /* Tamaño de fuente normal */
                    color: #333;                     /* Color gris oscuro */
                    margin-top: 0.375rem;
                    line-height: 1.4;               /* Altura de línea para mejor lectura */
                    transition: color 0.3s ease;    /* Animación suave para cambios de color */
                }
                
                hr {
                    width: 100%;                     /* Ocupa todo el ancho */
                    border: 1px solid #D9D9D9;       /* Línea gris clara */
                    margin: 0.5rem 0;               /* Margen vertical */
                    transition: border-color 0.3s ease; /* Animación suave para cambios */
                }

                .location {
                    display: flex;                   /* Elementos en fila */
                    gap: 0.3rem;                    /* Espacio pequeño entre elementos */
                    align-items: center;             /* Centrados verticalmente */
                    margin-top: 0.05rem;
                }

                /* === ADAPTACIONES PARA DIFERENTES TAMAÑOS DE PANTALLA === */
                
                /* Para tablets (pantallas medianas) */
                @media (max-width: 1024px) {
                    .userTopCompleto {
                        max-width: 95%;              /* Más ancho en tablets */
                        padding: 1rem;               /* Menos espacio interno */
                    }
                    
                    .userTopFoto img {
                        width: 12rem;                /* Foto más pequeña */
                        height: 12rem;
                    }
                }
                
                /* Para móviles (pantallas pequeñas) */
                @media (max-width: 768px) {
                    .userTopCompleto {
                        max-width: 100%;             /* Ancho completo en móviles */
                        margin: 0.5rem;
                        padding: 1rem;
                        position: relative;
                    }

                    .userTop {
                        flex-direction: column;       /* Elementos en columna en lugar de fila */
                        text-align: center;          /* Texto centrado */
                        min-width: auto;             /* Sin ancho mínimo */
                        gap: 1rem;
                    }

                    .userTopFoto img {
                        width: 10rem;                /* Foto aún más pequeña */
                        height: 10rem;
                    }
                
                    .nombre {
                        font-size: 1.25rem;         /* Texto más pequeño */
                        margin: 0.3rem 0;
                    }

                    .etiquetados {
                        font-size: 0.65rem;
                        font-weight: bold;
                        margin-left: 1rem;
                    }
                
                    .nombreDeUsuario {
                        font-size: 1rem;            /* Username más pequeño */
                        margin: 0.3rem 0;
                    }
                
                    .descripcion {
                        font-size: 0.85rem;         /* Descripción más pequeña */
                        margin: 0.3rem 0;
                        text-align: center;          /* Centrado en móviles */
                    }
                }

                /* Para móviles muy pequeños */
                @media (max-width: 480px) {
                    .userTopCompleto {
                        margin: 0.25rem;
                        padding: 0.75rem;
                    }

                    .userTopFoto img {
                        width: 8rem;                 /* Foto muy pequeña */
                        height: 8rem;
                    }
                    
                    .nombre {
                        font-size: 1.1rem;
                    }
                    
                    .nombreDeUsuario {
                        font-size: 0.9rem;
                    }
                    
                    .descripcion {
                        font-size: 0.8rem;
                    }

                    .etiquetados {
                        margin-left: 0.5rem;
                    }
                }
            </style>            
            
            <!-- Contenedor principal del perfil -->
            <div class="userTopCompleto">
                ${this.renderUsuario(this.currentUser)}
            </div>
        `;

        console.log('UserInfo: Perfil dibujado completamente para:', this.currentUser.nombreDeUsuario);
    }

    // === FUNCIÓN PARA GENERAR EL HTML DEL USUARIO ===
    // Toma los datos del usuario y devuelve el HTML formateado
    private renderUsuario(user: UserData): string {
        console.log('UserInfo: Generando HTML específico para el usuario:', user.nombreDeUsuario);
        
        // Devolvemos el HTML con los datos del usuario insertados
        return /*html*/ `
            <div class="userTop"> 
                <!-- Sección de la foto de perfil -->
                <div class="userTopFoto">
                    <img class="foto" 
                         src="${FIXED_PROFILE_PHOTO}" 
                         alt="Foto de perfil" 
                         onerror="this.src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcQg-lr5__zRqY3mRg6erzAD9n4BGp3G8VfA&s'">
                </div>
                
                <!-- Sección de la información del usuario -->
                <div class="userTopInfo">
                    <!-- Username (ejemplo: @CrisTiJauregui) -->
                    <p class="nombreDeUsuario">${user.nombreDeUsuario || '@Usuario'}</p>
                    
                    <!-- Nombre real (ejemplo: Cristina Jauregui) -->
                    <p class="nombre">${user.nombre || "Nombre del usuario"}</p>
                    
                    <!-- Línea separadora -->
                    <hr>
                    
                    <!-- Biografía/descripción del usuario -->
                    <p class="descripcion">${user.descripcion || "Sin descripción"}</p>
                    
                    <!-- Contenedor para información adicional en el futuro -->
                    <div id="additional-info"></div>
                </div>
            </div>
        `;
    }

    // === MÉTODOS PÚBLICOS ===
    // Estas funciones pueden ser llamadas desde fuera del componente

    // Función para forzar una actualización manual del componente
    // Útil para pruebas o situaciones especiales
    public forceUpdate(): void {
        console.log('UserInfo: Forzando actualización manual del perfil...');
        const currentState = userStore.getState();
        this.handleStoreChange(currentState);
    }

    // Función para mostrar información de debugging en la consola
    // Muy útil para desarrolladores para entender qué está pasando
    public debugInfo(): void {
        console.log('UserInfo: === INFORMACIÓN DE DEBUG ===');
        console.log('- Usuario actual guardado:', this.currentUser);
        console.log('- Estado completo del store:', userStore.getState());
        console.log('- Shadow DOM existe:', !!this.shadowRoot);
        console.log('- Componente conectado:', this._isConnected);
        
        // Verificamos si los elementos del DOM existen y están correctamente creados
        if (this.shadowRoot) {
            const elements = {
                username: this.shadowRoot.querySelector('.nombreDeUsuario'),
                name: this.shadowRoot.querySelector('.nombre'),
                description: this.shadowRoot.querySelector('.descripcion'),
                photo: this.shadowRoot.querySelector('.foto')
            };
            console.log('- Elementos del DOM encontrados:', elements);
        } else {
            console.log('No hay shadow DOM disponible');
        }
        console.log('=== FIN DEBUG ===');
    }
}

// === FUNCIONES GLOBALES PARA DEBUGGING ===
// Estas funciones estarán disponibles en la consola del navegador para hacer pruebas

// Solo las creamos si estamos en un navegador
if (typeof window !== 'undefined') {
    // Solo creamos las funciones si no existen ya (evita sobrescribir)
    if (!window.debugUserInfo) {
        // Función global para hacer debug del componente UserInfo
        // Se puede usar escribiendo: debugUserInfo() en la consola del navegador
        window.debugUserInfo = () => {
            const userInfoEl = document.querySelector('user-info') as UserInfoElement | null;
            if (userInfoEl && userInfoEl.debugInfo) {
                userInfoEl.debugInfo();
            } else {
                console.log('No se encontró ningún componente user-info en la página');
            }
        };
    }
    
    if (!window.forceUpdateUserInfo) {
        // Función global para forzar actualización del componente UserInfo
        // Se puede usar escribiendo: forceUpdateUserInfo() en la consola del navegador
        window.forceUpdateUserInfo = () => {
            const userInfoEl = document.querySelector('user-info') as UserInfoElement | null;
            if (userInfoEl && userInfoEl.forceUpdate) {
                userInfoEl.forceUpdate();
                console.log('Actualización forzada completada');
            } else {
                console.log('No se encontró ningún componente user-info en la página');
            }
        };
    }
}

// Exportamos el componente para que pueda ser usado en otros archivos
export default UserInfo;