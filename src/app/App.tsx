import React from 'react';
import {Material3ThemeProvider} from './ui/Material3ThemeProvider';
import {Overview} from '../pages/overview/Overview';
import {AppNavigator} from './ui/AppNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PagesStackProps} from '../shared/model/types';
import {PaperNavigationBar} from './ui/PaperNavigationBar';
import {AddWordForm} from '../pages/add-word-form/AddWordForm';
import {CollectionLearning} from '../pages/collection-learning/CollectionLearning';
import {useTranslation} from 'react-i18next';
import {About} from '../pages/about/About';
import {UpdateCollectionForm} from '../pages/update-collection-form/UpdateCollectionForm';
import '../shared/lib/i18n';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const Stack = createNativeStackNavigator<PagesStackProps>();
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <Material3ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppNavigator>
          <Stack.Navigator
            initialRouteName="Overview"
            // TODO: prevent hardware button back
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
              options={{title: t('collections'), headerBackVisible: false}}
            />
            <Stack.Screen
              name="AddWordForm"
              component={AddWordForm}
              options={{title: t('add_new_word')}}
            />
            <Stack.Screen
              name="UpdateCollectionForm"
              component={UpdateCollectionForm}
              options={{title: t('new_collection')}}
            />
            <Stack.Screen
              name="CollectionLearning"
              component={CollectionLearning}
              options={{title: t('exercises'), headerBackVisible: false}}
            />
            <Stack.Screen
              name="About"
              component={About}
              options={{title: t('about')}}
            />
          </Stack.Navigator>
        </AppNavigator>
      </QueryClientProvider>
    </Material3ThemeProvider>
  );
}

export default App;
