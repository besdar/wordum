import {EmitterSubscription, NativeEventEmitter} from 'react-native';

export enum EVENT_TYPE {
  TRAINING_FINISHED = 'TRAINING_FINISHED',
}

class EventBus extends NativeEventEmitter {
  emit(eventType: EVENT_TYPE, ...params: any[]): void {
    super.emit(eventType, ...params);
  }

  addListener(
    eventType: EVENT_TYPE,
    listener: (event: any) => void,
    context?: Object,
  ): EmitterSubscription {
    return super.addListener(eventType, listener, context);
  }
}

export const eventBus = new EventBus();
