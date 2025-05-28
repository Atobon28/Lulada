import { interactionDispatcher } from './InteractionDispatcher';

export const InteractionActions = {
    toggleLike: (publicationId: string, username: string) => {
        interactionDispatcher.dispatch({
            type: 'TOGGLE_LIKE',
            payload: { publicationId, username }
        });
    },

    toggleBookmark: (publicationId: string, username: string) => {
        interactionDispatcher.dispatch({
            type: 'TOGGLE_BOOKMARK',
            payload: { publicationId, username }
        });
    },

    loadInteractions: () => {
        interactionDispatcher.dispatch({
            type: 'LOAD_INTERACTIONS'
        });
    },

    clearAllInteractions: () => {
        interactionDispatcher.dispatch({
            type: 'CLEAR_INTERACTIONS'
        });
    }
};