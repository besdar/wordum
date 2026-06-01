import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, Platform} from 'react-native';
import {Overview} from '../pages/overview';
import {createNotificationsBackgroundListener} from '../shared/lib/notifications';
import {PagesStackProps} from '../shared/model/navigator';
import {useNotifications} from './model/useNotifications';
import {AppNavigator} from './ui/AppNavigator';
import {Material3ThemeProvider} from './ui/Material3ThemeProvider';
import {PaperNavigationBar} from './ui/PaperNavigationBar';
import '../shared/lib/i18n';

createNotificationsBackgroundListener();

const Stack = createNativeStackNavigator<PagesStackProps, undefined>();

function App(): React.JSX.Element {
  const {t} = useTranslation();

  useNotifications();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );

    return () => subscription.remove();
  }, []);

  return (
    <Material3ThemeProvider>
      <AppNavigator>
        <Stack.Navigator
          id={undefined}
          initialRouteName="Overview"
          screenOptions={{
            orientation: 'portrait',
            header: PaperNavigationBar,
            contentStyle: {
              padding: 10,
            },
          }}>
          <Stack.Screen
            name="Overview"
            component={Overview}
            options={{
              title: t('collections'),
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="AddWordForm"
            getComponent={() => require('../pages/add-word-form').AddWordForm}
            options={{title: t('add_new_word')}}
          />
          <Stack.Screen
            name="UpdateCollectionFormContainer"
            getComponent={() =>
              require('../pages/update-collection-form')
                .UpdateCollectionFormContainer
            }
            options={({route}) => ({
              title: route.params.collection
                ? t('edit_collection')
                : t('new_collection'),
            })}
          />
          <Stack.Screen
            name="CollectionLearning"
            getComponent={() =>
              require('../pages/collection-learning').CollectionLearning
            }
            options={{
              title: t('exercises'),
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="Settings"
            getComponent={() => require('../pages/settings').Settings}
            options={{title: t('settings')}}
          />
          <Stack.Screen
            name="Import"
            getComponent={() => require('../pages/import').Import}
            options={{title: t('collection_import')}}
          />
        </Stack.Navigator>
      </AppNavigator>
    </Material3ThemeProvider>
  );
}

export default App;
