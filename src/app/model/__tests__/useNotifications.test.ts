import {renderHook} from '@testing-library/react-native';
import {useNotifications} from '../useNotifications';
import {
  initLearningReminder,
  resetLearningReminder,
} from '../../../shared/lib/notifications';
import {EVENT_TYPE, eventBus} from '../../../shared/model/EventBus';

jest.mock('../../../shared/lib/notifications', () => ({
  initLearningReminder: jest.fn(),
  resetLearningReminder: jest.fn(),
}));

describe('useNotifications', () => {
  it('initialized reminder and reset it on event', () => {
    renderHook(() => useNotifications());

    expect(initLearningReminder).toHaveBeenCalledTimes(1);

    eventBus.emit(EVENT_TYPE.TRAINING_FINISHED);

    expect(resetLearningReminder).toHaveBeenCalledTimes(1);
  });
});
