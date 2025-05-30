import React from 'react';
import {Material3ThemeProvider} from './ui/Material3ThemeProvider';
import {Overview} from '../pages/overview/Overview';
import {AppNavigator} from './ui/AppNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PaperNavigationBar} from './ui/PaperNavigationBar';
import {PagesStackProps} from '../shared/model/navigator';
import {useTranslation} from 'react-i18next';
import {useNotifications} from './model/useNotifications';
import {createNotificationsBackgroundListener} from '../shared/lib/notifications';
import '../shared/lib/i18n';

createNotificationsBackgroundListener();

const Stack = createNativeStackNavigator<PagesStackProps>();

function App(): React.JSX.Element {
  const {t} = useTranslation();

  useNotifications();

  return (
    <Material3ThemeProvider>
      <AppNavigator>
        <Stack.Navigator
          initialRouteName="Overview"
          // TODO: prevent android hardware button back
          // screenListeners={{
          //   beforeRemove: e => e.preventDefault(),
          // }}
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
            getComponent={() =>
              require('../pages/add-word-form/AddWordForm').AddWordForm
            }
            options={{title: t('add_new_word')}}
          />
          <Stack.Screen
            name="UpdateCollectionFormContainer"
            getComponent={() =>
              require('../pages/update-collection-form/UpdateCollectionFormContainer')
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
              require('../pages/collection-learning/CollectionLearning')
                .CollectionLearning
            }
            options={{
              title: t('exercises'),
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
          <Stack.Screen
            name="Settings"
            getComponent={() => require('../pages/settings/Settings').Settings}
            options={{title: t('settings')}}
          />
          <Stack.Screen
            name="Import"
            getComponent={() => require('../pages/import/Import').Import}
            options={{title: t('collection_import')}}
          />
        </Stack.Navigator>
      </AppNavigator>
    </Material3ThemeProvider>
  );
}

export default App;
