// src/Services/flux/Store.ts - ARCHIVO CORREGIDO

import { AppDispatcher, Action } from './Dispacher';

export type State = object;

type Listener = (state: State) => void;

class Store {
    private _myState: State = {}

    private _listeners: Listener[] = [];

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
    }

    getState(): State {  // ✅ Agregado tipo de retorno específico
        return this._myState;  // ✅ Retorna el estado real en lugar de {}
    }

    _handleActions(action: Action): void {
        switch (action.type) {
            case "UNO":
                break;
        }
    }

    private _emitChange(): void {
        for (const listener of this._listeners) {
            listener(this._myState);
        }
    }

    unsubscribe(listener: Listener): void {
        // ✅ Tipo explícito para evitar 'any'
        this._listeners = this._listeners.filter((l: Listener) => l !== listener);
    }
}

export const store = new Store();