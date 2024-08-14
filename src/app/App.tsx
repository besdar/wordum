import React from 'react';
import {Material3ThemeProvider} from './ui/Material3ThemeProvider';
import {Overview} from '../pages/overview/Overview';
import {AppNavigator} from './ui/AppNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PaperNavigationBar} from './ui/PaperNavigationBar';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {translate} from '../shared/lib/i18n';
import {PagesStackProps} from '../shared/model/navigator';

const Stack = createNativeStackNavigator<PagesStackProps>();
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <Material3ThemeProvider>
      <QueryClientProvider client={queryClient}>
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
                title: translate('collections'),
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="AddWordForm"
              getComponent={() =>
                require('../pages/add-word-form/AddWordForm').AddWordForm
              }
              options={{title: translate('add_new_word')}}
            />
            <Stack.Screen
              name="UpdateCollectionForm"
              getComponent={() =>
                require('../pages/update-collection-form/UpdateCollectionForm')
                  .UpdateCollectionForm
              }
              options={{title: translate('new_collection')}}
            />
            <Stack.Screen
              name="CollectionLearning"
              getComponent={() =>
                require('../pages/collection-learning/CollectionLearning')
                  .CollectionLearning
              }
              options={{
                title: translate('exercises'),
                headerBackVisible: false,
              }}
            />
            <Stack.Screen
              name="About"
              getComponent={() => require('../pages/about/About').About}
              options={{title: translate('about')}}
            />
            <Stack.Screen
              name="Settings"
              getComponent={() =>
                require('../pages/settings/Settings').Settings
              }
              options={{title: translate('settings')}}
            />
          </Stack.Navigator>
        </AppNavigator>
      </QueryClientProvider>
    </Material3ThemeProvider>
  );
}

export default App;
