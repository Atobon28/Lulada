// Importamos las herramientas que necesitamos para manejar los datos
import { AppDispatcher, Action } from './Dispacher';

// Definimos que "State" puede ser cualquier tipo de objeto
export type State = object;

// Definimos que tipo de función será un "Listener" (escuchador)
// Un listener es una función que se ejecuta cuando algo cambia
type Listener = (state: State) => void;

// Esta es la clase principal que guarda y maneja todos los datos de la app
class Store {
    // Aquí guardamos todos los datos de la aplicación
    // Empieza como un objeto vacío
    private _myState: State = {}

    // Esta lista guarda todas las funciones que quieren ser notificadas
    // cuando los datos cambien
    private _listeners: Listener[] = [];

    // Cuando se crea el Store, se conecta al Dispatcher
    // El Dispatcher es como un cartero que entrega mensajes (acciones)
    constructor() {
        // Le decimos al Dispatcher: "cuando llegue una acción, avisame"
        AppDispatcher.register(this._handleActions.bind(this));
    }

    // Esta función permite que otros componentes lean los datos
    // Devuelve una copia de los datos actuales
    getState(): State {
        return this._myState;
    }

    // Esta función se ejecuta cada vez que llega una nueva acción
    // Es como un buzón que recibe diferentes tipos de mensajes
    _handleActions(action: Action): void {
        // Aquí revisamos qué tipo de acción llegó y decidimos qué hacer
        switch (action.type) {
            // Por ahora solo hay un caso de ejemplo llamado "UNO"
            case "UNO":
                // Aquí iría el código para manejar esta acción
                break;
            // Si llega una acción que no conocemos, no hacemos nada
        }
    }

    // Esta función avisa a todos los que están escuchando que algo cambió
    // Es como tocar una campana para que todos sepan que hay noticias nuevas
    private _emitChange(): void {
        // Recorremos la lista de todos los que quieren ser notificados
        for (const listener of this._listeners) {
            // Le decimos a cada uno: "hey, los datos cambiaron, aquí están los nuevos"
            listener(this._myState);
        }
    }

    // Esta función permite que otros componentes se "suscriban" a los cambios
    // Es como apuntarse a una lista de correo para recibir noticias
    subscribe(listener: Listener): void {
        // Agregamos la función del componente a nuestra lista de notificaciones
        this._listeners.push(listener);
    }

    // Esta función permite que los componentes se "desuscriban" de los cambios
    // Es como darse de baja de la lista de correo
    unsubscribe(listener: Listener): void {
        // Quitamos la función del componente de nuestra lista
        this._listeners = this._listeners.filter((l: Listener) => l !== listener);
    }
}

// Creamos una instancia única del Store que toda la app puede usar
// Es como tener una única caja fuerte donde guardamos todos los datos importantes
export const store = new Store();