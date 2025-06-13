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
    private _tokens: Map<string, (action: Action) => void>;
    private _tokenCounter: number;

    // Constructor - se ejecuta cuando se crea una nueva instancia del Dispatcher
    constructor() {
        this._listeners = [];
        this._tokens = new Map();
        this._tokenCounter = 0;
    }

    // Método para "registrar" un nuevo oyente - ahora retorna un token como string
    register(callback: (action: Action) => void): string {
        const token = `ID_${this._tokenCounter++}`;
        this._listeners.push(callback);
        this._tokens.set(token, callback);
        return token;
    }

    // Método para desregistrar un oyente usando su token
    unregister(token: string): void {
        const callback = this._tokens.get(token);
        if (callback) {
            const index = this._listeners.indexOf(callback);
            if (index > -1) {
                this._listeners.splice(index, 1);
            }
            this._tokens.delete(token);
        }
    }

    // Método para "enviar" un mensaje a todos los oyentes registrados
    dispatch(action: Action): void {
        // Crear una copia de los listeners para evitar problemas de concurrencia
        const currentListeners = [...this._listeners];
        
        for (const listener of currentListeners) {
            try {
                listener(action);
            } catch (error) {
                console.error('Error en listener del Dispatcher:', error);
            }
        }
    }

    // Método para verificar si hay listeners registrados
    hasListeners(): boolean {
        return this._listeners.length > 0;
    }

    // Método para obtener el número de listeners registrados
    getListenerCount(): number {
        return this._listeners.length;
    }
}

// Crea una instancia global del Dispatcher que usará toda la aplicación
export const AppDispatcher = new Dispatcher();

// También exportamos como default para compatibilidad con diferentes estilos de import
export default AppDispatcher;