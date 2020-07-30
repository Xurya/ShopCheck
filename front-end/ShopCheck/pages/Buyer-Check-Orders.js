import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Button, StyleSheet, View, TouchableOpacity, Text} from 'react-native';

export default function Landing({navigation}){
    return(
        <SafeAreaView style={styles.container}>
            <Image style={styles.img} source={require('../assets/logov2.png')}/>
            <Text> My Orders </Text>
            <TouchableOpacity onPress={()=>navigation.navigate("Home")} style={styles.button}>
                <Text style={styles.text}>
                    Go Home
                </Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({ 
    text:{
      fontWeight:'bold', 
      color:'white',
      fontFamily:'NunitoSans_400Regular',
      fontSize:15
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#9db1e0',
    },
    img : {
      width : '45%',
      height : '45%',
      resizeMode : 'contain',
      margin: -68
    },
    button:{
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 5, // Android,
      height:45,
      width:110,
      backgroundColor:'#009CFF',
      alignItems:'center',
      justifyContent:'center',
      margin: 6,
      borderRadius:20,
    }
  });