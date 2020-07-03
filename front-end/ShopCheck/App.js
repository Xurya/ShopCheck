import React from 'react';
import { StyleSheet, Text, View, Image, Platform, SafeAreaView, StatusBar } from 'react-native';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
        <Image style={styles.img} source={require('./assets/logo.png')}/>
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
