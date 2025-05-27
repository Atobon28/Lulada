import { AppDispatcher } from './Dispacher';

export const Actions = {
    do: () => {
        AppDispatcher.dispatch({ type: 'ACTION_TYPE', payload: undefined });
    },
};