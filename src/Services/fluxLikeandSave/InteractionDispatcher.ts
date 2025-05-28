export interface InteractionAction {
    type: string;
    payload?: any;
}

export class InteractionDispatcher {
    private _listeners: Array<(action: InteractionAction) => void> = [];

    register(callback: (action: InteractionAction) => void): void {
        this._listeners.push(callback);
    }

    dispatch(action: InteractionAction): void {
        for (const listener of this._listeners) {
            listener(action);
        }
    }
}

export const interactionDispatcher = new InteractionDispatcher();