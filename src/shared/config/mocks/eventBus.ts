jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter', () => {
  const listeners = new Map();

  class MockNativeEventEmitter {
    addListener(eventType: string, listener: (...args: any[]) => void) {
      if (!listeners.has(eventType)) {
        listeners.set(eventType, []);
      }
      listeners.get(eventType).push(listener);

      return {
        remove: jest.fn(() => {
          const eventListeners = listeners.get(eventType) || [];
          const index = eventListeners.indexOf(listener);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }),
      };
    }

    emit(eventType: string, ...args: any[]) {
      const eventListeners = listeners.get(eventType) || [];
      eventListeners.forEach((listener: (...args: any[]) => void) => listener(...args));
    }
  }

  return {
    __esModule: true,
    default: MockNativeEventEmitter,
  };
});
