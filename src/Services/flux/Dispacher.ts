// Define proper types for actions
interface Action {
    type: string;
    payload?: unknown;
  }
  
  type CallbackFunction = (action: Action) => void;
  
  class Dispatcher {
    private callbacks: CallbackFunction[] = [];
  
    register(callback: CallbackFunction): number {
      this.callbacks.push(callback);
      return this.callbacks.length - 1;
    }
  
    dispatch(action: Action): void {
      this.callbacks.forEach(callback => {
        callback(action);
      });
    }
  }
  
  export default new Dispatcher();