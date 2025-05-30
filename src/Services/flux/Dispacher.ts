// Este archivo define el sistema de comunicación entre diferentes partes de la aplicación

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
        this._listeners = [];
    }

    // Método para "registrar" un nuevo oyente
    register(callback: (action: Action) => void): void {
        this._listeners.push(callback);
    }

    // Método para "enviar" un mensaje a todos los oyentes registrados
    dispatch(action: Action): void {
        for (const listener of this._listeners) {
            listener(action);
        }
    }
}

// Crea una instancia global del Dispatcher que usará toda la aplicación
export const AppDispatcher = new Dispatcher();