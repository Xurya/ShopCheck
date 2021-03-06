import React, { useState } from 'react';
import { Image, Alert, Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { useNavigation } from '@react-navigation/native';

export default function Registration({navigation}){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [type, setType] = useState('');
    const [owner,setOwner] = useState('#af5cf7');
    const [buyer,setBuyer] = useState('#af5cf7')

    const options = {
        fontSize:15,
        height:25,
        width:75,
        alignItems:'center',
        justifyContent:'center',
        margin: 6,
        borderRadius:20
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex:1}}></View>
            <Text style={styles.titletext}>
                Registration Page
            </Text>
            <View style={{flex:1}}></View>

            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={{margin:7, fontSize: 20}}>
                    Username:
                </Text>
                <TextInput 
                    placeholder="Username" 
                    onChangeText={text => setUsername(text)} 
                    placeholderTextColor='white'
                    style={{borderBottomWidth:1, padding:0, fontSize: 20}}/>
            </View>
            
            <View style={{flexDirection:'row', alignItems:'center', fontSize: 20}}>
                <Text style={{margin:7, fontSize: 20}}>
                    Email:
                </Text>
                <TextInput 
                    placeholder="Email" 
                    onChangeText={text => setEmail(text)} 
                    placeholderTextColor='white'
                    style={{borderBottomWidth:1, padding:0, fontSize: 20}}/>
            </View> 

            <View style={{flexDirection:'row', alignItems:'center', fontSize: 20}}>
                <Text style={{margin:7, fontSize: 20}}>
                    Password:
                </Text>
                <TextInput 
                    placeholder="Password" 
                    onChangeText={text => {setPassword(text)}} 
                    placeholderTextColor='white' 
                    secureTextEntry={true}
                    style={{borderBottomWidth:1, padding:0,  fontSize: 20}}/>
            </View> 
            
            <View style={{flexDirection:'row', alignItems:'center'}}>   
                <TouchableOpacity 
                    onPress={()=>{setType('Owner'); setOwner('#7c41b0'); setBuyer('#af5cf7');}} 
                    style={[options,{backgroundColor:owner}]}>

                    <Text style={styles.text}>
                        Owner
                    </Text>

                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={()=>{setType('Buyer'); setOwner('#af5cf7'); setBuyer('#7c41b0');}} 
                    style={[options,{backgroundColor:buyer}]}>

                    <Text style={styles.text}>
                        Buyer
                    </Text>

                </TouchableOpacity>
            </View> 
            <View style={{flex:5}}></View>
            <Image style={styles.img} source={require('../assets/logov2.png')}/>

            <View style={{flexDirection:'row', alignItems:'center', flex: 3}}>
                <TouchableOpacity onPress={()=>checkRegistration(username, email, password,type,navigation)} style={styles.button}>
                    <Text style={{fontWeight:'bold', color:'white', fontFamily:'NunitoSans_400Regular', fontSize:15}}>
                        Register
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigation.navigate("Landing")} style={styles.button}>
                    <Text style={{fontWeight:'bold', color:'white', fontFamily:'NunitoSans_400Regular', fontSize:15}}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={{flex:2}}></View>

        </SafeAreaView>
    );
}

function checkRegistration(username, email, password,type,navigation){
    if (username == '' || email == '' || password == '') {
        sendAlertOK("Invalid Form", "Please fill out all required fields");
    } else if (username.length<6) {
        sendAlertOK("Invalid Username", "Username cannot have less than 6 characters");
    } else if (!email.includes('@')) {
        sendAlertOK("Invalid Email", "Email must contain an @");
    } else if (password.length<6) {
        sendAlertOK("Invalid Password", "Password cannot have less than 6 characters");
    } else if (password.includes('<') || password.includes('>')) {
        //This is for security due to use of markdown.
        sendAlertOK("Invalid Password", "Password cannot contain tags (less than or greater than signs)");
    } else if (!type){
        sendAlertOK("Missing Option", "You must pick an option for the account type")
    } 
    else {
        //If all tests pass, send to server.
        sendRegistration(username, email, password,type,navigation);
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

async function sendRegistration(username, email, password,type,navigation){
    let accountDetails = {username,email,password,type}

    //TODO:Configure w/ backend
    //replace with 157.245.243.174 on deploy to droplet
    //replace with LAN IP of hosting computer if using expo app on device
    //replace with 10.0.2.2 if using AVD
    try{ 
        let response = await fetch("http://157.245.243.174:5000/account/register", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(accountDetails)
        }) 
        let payload = await response.json();
        console.log(payload);

        if(payload["status"]==null){
            sendAlertOK("fail", "Server Response Error");
            return;
        }

        if(payload["status"]=="success"){
            sendAlertOK("Success!", payload["message"]); //sendAlertLogin("Success!", payload["message"]) //Redirect
            navigation.navigate("Login")
            return;
        }
    }
    catch (err){
        console.error(err);
    }
}

const styles = StyleSheet.create({ 
    titletext:{
        fontWeight:'bold', 
        flex: 2,
        color:'#009CFF',
        fontFamily:'NunitoSans_900Black',
        fontWeight: 'bold',

        fontSize: 35
    },
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
      width:100,
      backgroundColor:'#009CFF',
      alignItems:'center',
      justifyContent:'center',
      margin: 6,
      borderRadius:20,
    },
    img:{
        width : '45%',
        height : '45%',
        resizeMode : 'contain',
        margin: -68
    }
})