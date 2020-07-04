import React from 'react';
import { StyleSheet, Text, View, Image, Platform, StatusBar, Button } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { createStackNavigator } from '@react-navigation/stack';

import Registration from './Registration.js';

const Stack = createStackNavigator(); 

export default function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen}/> 
          <Stack.Screen name="Registration" component={Registration}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  //Example options={{ title: "ShopCheck" }}
}

//TODO: rename and move HomeScreen to a different class (ex. Splash, Landing, etc)
function HomeScreen({navigation}){
  return(
    <SafeAreaView style={styles.container}>
      <Text>ShopCheck</Text>
      <Image style={styles.img} source={require('./assets/logo.png')}/>

      <Button title="Registration" onPress={()=>navigation.push("Registration")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9db1e0',
  },
  img : {
    width : '33%',
    height : '33%',
    resizeMode : 'contain'
  }
});
