import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { createStackNavigator } from '@react-navigation/stack';

import { 
  useFonts,
  NunitoSans_400Regular,
  NunitoSans_400Regular_Italic
} from '@expo-google-fonts/nunito-sans'


import Registration from './pages/Registration.js';
import Landing from './pages/Landing.js';
import Login from './pages/Login.js';
import Home from './pages/Home.js'
import OwnerManageShops from './pages/Owner-Manage-Shops.js';
import OwnerCheckOrders from './pages/Owner-Check-Orders.js';
import BuyerMakeOrders from './pages/Buyer-Make-Orders.js';
import BuyerCheckOrders from './pages/Buyer-Check-Orders.js';


import { AppLoading } from 'expo';

const Stack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({NunitoSans_400Regular,});

  if(!fontsLoaded){
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Landing" component={Landing} options={{headerShown:false}}/> 
          <Stack.Screen name="Registration" component={Registration} options={{headerShown:false}}/>
          <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
          <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
          <Stack.Screen name="OwnerManageShops" component={OwnerManageShops} options={{headerShown:false}}/>
          <Stack.Screen name="OwnerCheckOrders" component={OwnerCheckOrders} options={{headerShown:false}}/>
          <Stack.Screen name="BuyerMakeOrders" component={OwnerManageShops} options={{headerShown:false}}/>
          <Stack.Screen name="BuyerCheckOrders" component={OwnerCheckOrders} options={{headerShown:false}}/>

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  //Example options={{ title: "ShopCheck" }}
}