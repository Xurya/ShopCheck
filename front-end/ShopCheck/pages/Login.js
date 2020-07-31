import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native'

import * as SecureStore from "expo-secure-store";

//Secure Storage for JWTs: If promise rejects on token storage then the app would be quite unusable due to security, so send an alert.
//--------------------------------------------------------------------------------------------------------------------------------------
///SecureStore.setItemAsync(key, value);
//SecureStore.getItemAsync(key);
//SecureStore.deleteItemAsync(key);
//--------------------------------------------------------------------------------------------------------------------------------------

export default function Login({navigation}){
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const myTextInput = React.createRef();

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
                ref={myTextInput}
                placeholder="Password" 
                onChangeText={text => {setPassword(text)}} 
                placeholderTextColor='white' 
                secureTextEntry={true}
                style={{borderBottomWidth:1, padding:0}}/>
        </View> 
        <TouchableOpacity 
            onPress={()=>{
                checkLogin(username, password,navigation);
                myTextInput.current.clear();
                setPassword('');
                }} 
            style={styles.button}>

            <Text style={styles.text}>
                Login
            </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("Landing")} style={styles.button}>
            <Text style={styles.text}>
                Back
            </Text>
        </TouchableOpacity>
    </SafeAreaView> 
}

function checkLogin(username, password,navigation){
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
        sendLogin(username, password,navigation);
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

async function sendLogin(username, password,navigation){
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
            body: JSON.stringify(accountDetails)
        });
        let payload = await response.json();
        console.log (payload);

        if(payload["status"]==null){
            sendAlertOK("Server Response Error");
            return;
        }
        
        if(payload['status']=='fail'){
            sendAlertOK("Invalid Password", "User credentials failed, please try again.");
            return;
        }

        if(payload["status"]=="success"){
            //sendAlertOK('Success!', payload["message"]);
            navigation.navigate('Home', {'token':payload['token'], 'refresh':payload['refresh']});
            
            SecureStore.setItemAsync("token", payload["token"]);
            SecureStore.setItemAsync("refresh", payload["refresh"]);
            return;
        }

        //Find the auth token and refresh, store them in SecureStore


        //Secure Store Testing
        // console.log("Recieved Token: " + payload["token"]);
        // console.log("Secure Stored Token: " + (await SecureStore.getItemAsync("token")));
    }
    catch (err){
        console.error(err);
    }
}

const styles = StyleSheet.create({
    text:{
        fontWeight:'bold', 
        color:'white',
        fontFamily:'NunitoSans_400Regular',
        fontSize:15
    },
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
