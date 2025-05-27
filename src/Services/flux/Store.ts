import Dispatcher from './Dispacher';

// Define proper state type instead of empty object
interface StoreState {
  [key: string]: unknown;
}

type ListenerFunction = () => void;

interface Action {
  type: string;
  payload?: unknown;
}

class Store {
  private state: StoreState = {};
  private listeners: ListenerFunction[] = [];

  constructor() {
    Dispatcher.register(this.handleAction.bind(this));
  }

  getState(): StoreState {
    return { ...this.state };
  }

  setState(newState: Partial<StoreState>): void {
    this.state = { ...this.state, ...newState };
    this.emitChange();
  }

  addChangeListener(listener: ListenerFunction): void {
    this.listeners.push(listener);
  }

  removeChangeListener(listenerToRemove: ListenerFunction): void {
    this.listeners = this.listeners.filter(listener => listener !== listenerToRemove);
  }

  private emitChange(): void {
    this.listeners.forEach(listener => {
      listener();
    });
  }

  private handleAction(action: Action): void {
    // Handle different action types here
    switch (action.type) {
      case 'UPDATE_STATE':
        if (action.payload && typeof action.payload === 'object') {
          this.setState(action.payload as Partial<StoreState>);
        }
        break;
      default:
        // Handle unknown actions or do nothing
        break;
    }
  }
}

export default new Store();