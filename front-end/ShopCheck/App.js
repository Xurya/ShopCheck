import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { createStackNavigator } from '@react-navigation/stack';

import Registration from './pages/Registration.js';
import Landing from './pages/Landing.js';

const Stack = createStackNavigator(); 

export default function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Splash" component={Landing} options={{headerShown:false}}/> 
          <Stack.Screen name="Registration" component={Registration} options={{headerShown:false}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  //Example options={{ title: "ShopCheck" }}
}