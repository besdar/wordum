import React from 'react';
import {FileToCollectionImportForm} from './ui/FileToCollectionImportForm';
import {TextToCollectionImportForm} from './ui/TextToCollectionImportForm';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {translate} from '../../shared/lib/i18n';
import {ImportTabs} from './model/navigation';

const Tab = createMaterialTopTabNavigator<ImportTabs>();

export const Import = () => (
  <Tab.Navigator>
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
