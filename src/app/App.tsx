import React from 'react';
import {Material3ThemeProvider} from './ui/Material3ThemeProvider';
import {Overview} from '../pages/overview/Overview';
import {AppNavigator} from './ui/AppNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {PagesStackProps} from '../shared/model/types';
import {PaperNavigationBar} from './ui/PaperNavigationBar';
import {AddWordForm} from '../pages/add-word-form/AddWordForm';
import {AddCollectionForm} from '../pages/add-collection-form/AddCollectionForm';
import {CollectionLearning} from '../pages/collection-learning/CollectionLearning';

const Stack = createNativeStackNavigator<PagesStackProps>();

function App(): React.JSX.Element {
  return (
    <Material3ThemeProvider>
      <AppNavigator>
        <Stack.Navigator
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
            options={{title: 'Collections', headerBackVisible: false}}
          />
          <Stack.Screen
            name="AddWordForm"
            component={AddWordForm}
            options={{title: 'Add new word'}}
          />
          <Stack.Screen
            name="AddCollectionForm"
            component={AddCollectionForm}
            options={{title: 'New collection'}}
          />
          <Stack.Screen
            name="CollectionLearning"
            component={CollectionLearning}
            options={{title: 'Train your words', headerBackVisible: false}}
          />
        </Stack.Navigator>
      </AppNavigator>
    </Material3ThemeProvider>
  );
}

export default App;
