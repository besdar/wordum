import notifee, {
  AndroidCategory,
  AndroidVisibility,
  EventType,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid} from 'react-native';
import {StorageKeys} from '../model/storage';
import {translate} from './i18n';
import {askForPermission} from './permissions';
import {isThereAnyWordsToLearn} from '../model/collection';

const createLearningReminder = async () => {
  const isThereWordsToLearn = await isThereAnyWordsToLearn();
  if (!isThereWordsToLearn) {
    return;
  }

  const daysSkipped =
    (await AsyncStorage.getItem(StorageKeys.DAYS_WITHOUT_LEARNING)) || '0';

  // await notifee.requestPermission();
  await askForPermission(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  const channelId = await notifee.createChannel({
    id: 'learning',
    name: 'Learning reminders',
  });

  const isBlocked = await notifee.isChannelBlocked(channelId);
  if (isBlocked) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: Date.now() + 24 * 60 * 60 * 1000,
  };

  return notifee.createTriggerNotification(
    {
      title: translate('time_to_learn'),
      body: translate(
        `motivations.${daysSkipped}.${Math.floor(Math.random() * 5)}`,
      ),
      android: {
        channelId,
        category: AndroidCategory.REMINDER,
        visibility: AndroidVisibility.PUBLIC,
      },
    },
    trigger,
  );
};

export const initLearningReminder = async () => {
  const settedNotifications = await notifee.getTriggerNotificationIds();
  const isNotificationSet = Boolean(settedNotifications.length);

  if (isNotificationSet) {
    return;
  }

  return createLearningReminder();
};

export const setNextLearningReminder = async () => {
  const daysSkipped = Number(
    (await AsyncStorage.getItem(StorageKeys.DAYS_WITHOUT_LEARNING)) || '0',
  );

  if (daysSkipped === 10) {
    return;
  }

  await AsyncStorage.setItem(
    StorageKeys.DAYS_WITHOUT_LEARNING,
    String(daysSkipped + 1),
  );

  return createLearningReminder();
};

export const resetLearningReminder = async () => {
  await AsyncStorage.setItem(StorageKeys.DAYS_WITHOUT_LEARNING, '0');

  await notifee.cancelAllNotifications();

  return createLearningReminder();
};

export const createNotificationsBackgroundListener = () =>
  notifee.onBackgroundEvent(async ({type}) => {
    if (type === EventType.DISMISSED) {
      await notifee.cancelAllNotifications();
      await setNextLearningReminder();
    } else if (type === EventType.PRESS) {
      await notifee.cancelAllNotifications();
    }
  });
