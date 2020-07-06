import React, { useState } from 'react';
import {Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import $ from 'jquery';

export default function Registration(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    return (
        <SafeAreaView>
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
            <TouchableOpacity onPress={(username, email, password)=>sendRegistration(username, email, password)} style={styles.button}>
                <Text style={{fontWeight:'bold', color:'white', fontFamily:'sans-serif-thin', fontSize:15}}>
                    Register
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

function sendRegistration(username, email, password){
    /*
    var req = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        console.log(xhr.responseText)
    })
    xhr.open('POST', '157.245.243.174:443', true); //Changeable port. 
    */

    //Switching to jquery for AJAX instead :)
    var ajxr = $.post('157.245.243.174:443',  {
        'username': username,
        'email': email,
        'password': password
    })

    ajxr.success(function(){
        //TODO: Grab response text and alert here.
        console.log("Response Recieved");
    });
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