import {useEffect} from 'react';
import {EVENT_TYPE, eventBus} from '../../shared/model/EventBus';
import {
  initLearningReminder,
  resetLearningReminder,
} from '../../shared/lib/notifications';

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
