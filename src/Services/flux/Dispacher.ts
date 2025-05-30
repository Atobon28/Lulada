// Este archivo define el sistema de comunicación entre diferentes partes de la aplicación
// Es como el "sistema de mensajería" que permite que los componentes se comuniquen entre sí

// Define la estructura de un "mensaje" que se envía por la aplicación
export interface Action {
    type: string;                        // El tipo de acción (ej: "GUARDAR_USUARIO", "ELIMINAR_POST")
    payload?: string | object | undefined; // Los datos que acompañan la acción (opcional)
}

// Esta es la clase principal que maneja todo el sistema de mensajería
export class Dispatcher {
    // Lista privada de "oyentes" - componentes que escuchan los mensajes
    private _listeners: Array<(action: Action) => void>;

    // Constructor - se ejecuta cuando se crea una nueva instancia del Dispatcher
    constructor() {
        // Inicializa la lista de oyentes como un array vacío
        this._listeners = [];
    }

    // Método para "registrar" un nuevo oyente
    // Es como decir: "avísame cuando pase algo"
    register(callback: (action: Action) => void): void {
        // Añade el nuevo oyente a la lista
        this._listeners.push(callback);
    }

    // Método para "enviar" un mensaje a todos los oyentes registrados
    // Es como gritar un anuncio para que todos los que están escuchando lo oigan
    dispatch(action: Action): void {
        // Recorre todos los oyentes en la lista
        for (const listener of this._listeners) {
            // Llama a cada oyente pasándole el mensaje (action)
            listener(action);
        }
    }
}

// Crea una instancia global del Dispatcher que usará toda la aplicación
// Es como tener un "sistema de altavoces" único para toda la app
export const AppDispatcher = new Dispatcher();