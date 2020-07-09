import React, { useState } from 'react';
import {Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper

export default function Registration(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{fontSize:24}}>
                Registration Page
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
                    Email:
                </Text>
                <TextInput 
                    placeholder="Email" 
                    onChangeText={text => setEmail(text)} 
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
            <TouchableOpacity onPress={()=>sendRegistration(username, email, password)} style={styles.button}>
                <Text style={{fontWeight:'bold', color:'white', fontFamily:'sans-serif-thin', fontSize:15}}>
                    Register
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

async function sendRegistration(username, email, password){
    let accountDetails = {username,email,password}

    //TODO:Configure w/ backend
    //replace with 157.245.243.174 on deploy to droplet
    //replace with LAN IP of hosting computer if using expo app on device
    //replace with 10.0.2.2 if using AVD
    try{ 
        let response = await fetch("http://10.0.2.2:5000/account/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountDetails)
        })
        let resObj = await response.json();
        console.log(resObj);
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