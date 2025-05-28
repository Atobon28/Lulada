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

    getState(): State {
        return this._myState;
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

    subscribe(listener: Listener): void {
        this._listeners.push(listener);
    }

    unsubscribe(listener: Listener): void {
        this._listeners = this._listeners.filter((l: Listener) => l !== listener);
    }
}

export const store = new Store();