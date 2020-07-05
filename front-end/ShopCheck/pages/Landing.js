import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Button, StyleSheet } from 'react-native';

export default function Landing({navigation}){
    return(
        <SafeAreaView style={styles.container}>
            <Image style={styles.img} source={require('../assets/logo.png')}/>
            <Button title="Registration" onPress={()=>navigation.navigate("Registration")} />
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