import {useEffect} from 'react';
import {
  initLearningReminder,
  resetLearningReminder,
} from '../../shared/lib/notifications';
import {EVENT_TYPE, eventBus} from '../../shared/model/EventBus';

export const useNotifications = () => {
  useEffect(() => {
    initLearningReminder();

    const eventEmitter = eventBus.addListener(
      EVENT_TYPE.TRAINING_FINISHED,
      resetLearningReminder,
    );

    return () => eventEmitter.remove();
  }, []);
};
