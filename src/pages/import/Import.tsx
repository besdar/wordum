import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {translate} from '../../shared/lib/i18n';
import {ImportTabs} from './model/navigation';
import {FileToCollectionImportForm} from './ui/FileToCollectionImportForm';
import {TextToCollectionImportForm} from './ui/TextToCollectionImportForm';

const Tab = createMaterialTopTabNavigator<ImportTabs, undefined>();

export const Import = () => (
  <Tab.Navigator id={undefined}>
    <Tab.Screen
      name="TextToCollectionImportForm"
      component={TextToCollectionImportForm}
      options={{
        title: translate('from_a_text'),
      }}
    />
    <Tab.Screen
      name="FileToCollectionImportForm"
      component={FileToCollectionImportForm}
      options={{
        title: translate('from_a_file'),
      }}
    />
  </Tab.Navigator>
);
