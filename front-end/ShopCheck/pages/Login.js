import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native'

//import * as SecureStore from "expo-secure-store";

//Secure Storage for JWTs:
//---------------------------------------------------------------------------------------------------------------------------
/**
 * Saves the value to the ios keychain or Android keystore
 * @param {string} key => the key you want to save the value for
 * @param {any} value => the value you want to encrypt
 * @return => A promise that will reject if value cannot be stored on the device.
 */
///SecureStore.setItemAsync(key, value);

/**
 * Fetches the value from the keychain/keystore for the specified key
 * @param {string} key => the key you set for the value
 * @returns {any} => A promise that resolves to the previously stored value, or null if there is no entry for the given key.
 * The promise will reject if an error occurred while retrieving the value.
 */
//SecureStore.getItemAsync(key);

/**
 * Saves the value to the ios keychain or Android keystore
 * @param {string} key => the key you want to save the value for
 * @param {any} value => the value you want to encrypt
 * @return => A promise that will reject if value cannot be stored on the device.
 */
//SecureStore.deleteItemAsync(key);
//---------------------------------------------------------------------------------------------------------------------------

export default function Login(){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    return <SafeAreaView style={styles.container}>
        <Text style={{fontSize:24}}>
            Login Page
        </Text>

        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{margin:7}}>
                Username:
            </Text>
            <TextInput 
                placeholder="Username" 
                onChangeText={text => setUsername(text)} 
                placeholderTextColor='white'
                style={{borderBottomWidth:1, padding:0}}/>
        </View>
        
        <View style={{flexDirection:'row', alignItems:'center'}}>
            <Text style={{margin:7}}>
                Password:
            </Text>
            <TextInput 
                placeholder="Password" 
                onChangeText={text => {setPassword(text)}} 
                placeholderTextColor='white' 
                secureTextEntry={true}
                style={{borderBottomWidth:1, padding:0}}/>
        </View> 
        <TouchableOpacity onPress={()=>checkLogin(username, password)} style={styles.button}>
            <Text style={{fontWeight:'bold', color:'white', fontFamily:'sans-serif-thin', fontSize:15}}>
                Login
            </Text>
        </TouchableOpacity>
    </SafeAreaView> 
}

function checkLogin(username, password){
    if (username == '' || password == '') { 
        sendAlertOK("Invalid Form", "Please fill out all required fields");
    } else if (username.length<6) {
        sendAlertOK("Invalid Username", "Username cannot have less than 6 characters");
    } else if (password.length<6) {
        sendAlertOK("Invalid Password", "Password cannot have less than 6 characters");
    } else if (password.includes('<') || password.includes('>')) {
        //This is for security due to use of markdown.
        sendAlertOK("Invalid Password", "Password cannot contain tags (less than or greater than signs)");
    } else {
        //If all tests pass, send to server.
        sendLogin(username, password);

        //TODO: Handle Response. ex. Success or Failure.

    }
}

function sendAlertOK(title, msg){
    Alert.alert(
        title,
        msg,
        [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
    );
}

async function sendLogin(username, password){
    let accountDetails = {username,password};

    //TODO:Configure w/ backend
    //replace with 157.245.243.174 on deploy to droplet
    //replace with LAN IP of hosting computer if using expo app on device
    //replace with 10.0.2.2 if using AVD
   try {
       let response = await fetch("http://192.168.0.126:5000/account/login", {
           method: 'POST',
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
        body: JSON.stringify(accountDetails)});
        let resObj = await response.json();
        console.log (resObj);
    }
    catch (err){
        console.error(err);
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9db1e0',
    },
    button:{
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 5, // Android,
      height:40,
      width:80,
      backgroundColor:'#009CFF',
      alignItems:'center',
      justifyContent:'center',
      margin: 6,
      borderRadius:20,
    }
})
