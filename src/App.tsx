/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BMSScreen from './screens/BMSScreen';
import BMSConnectScreen from './screens/BMSConnectScreen';
import BMSSettingsScreen from './screens/BMSSettingsScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{headerTitle: 'BMS Connect'}}
          name="BMSConnect"
          component={BMSConnectScreen}
        />
        <Stack.Screen
          options={{headerTitle: 'BMS'}}
          name="BMS"
          component={BMSScreen}
        />
        <Stack.Screen
          options={{headerTitle: 'BMS Settings'}}
          name="BMSSettings"
          component={BMSSettingsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
