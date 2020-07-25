import React, { useState, Component } from 'react';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { useNavigation } from '@react-navigation/native';

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            user: null
        }
    }
    // Retrieve User Data by Token
    componentDidMount(){

        // If temporary token is invalid, generate new one with refresh token.
        // If refresh token also invalid, notify user of invalid session --> navigate to login.
        if (!this.state.user){
            fetch("http://10.0.2.2:5000/account/home", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token:this.state.token, refresh:this.state.refresh})}).then((res,err)=>{
                    if (err) console.error(err);
                    else {
                        res.json().then((body,err)=>{
                            console.log(body);
                            if (body['newToken']){
                                this.setState((state,props)=>{return {token : body['newToken']}});
                            }
                            if (body['status'] == 'fail'){
                                console.log('Session Expired: Verification Failed');
                                this.props.navigation.navigate('Landing');
                            }
                            else{
                                this.setState((state,props)=>{return {user : body}});
                            }
                    })
                }
            });
        }
    }
    
    // Render separate Owner and Buyer homepage
    render(){
            if (!this.state.user){
                return(
                    <SafeAreaView style={styles.container}>
                        
                    </SafeAreaView>
                );
            }
            else if (this.state.user.accountType == 'Buyer'){
                return(
                    <SafeAreaView style={styles.container}>
                        <Text> Buyer Homepage </Text>
                        <Button title = 'Log out' onPress={()=> this.props.navigation.navigate('Login',{token:this.state.token,refresh:this.state.refresh})}></Button>
                    </SafeAreaView>
                );
            }
            else if (this.state.user.accountType == 'Owner'){
                return(
                    <SafeAreaView style={styles.container}>
                        <Text> Owner Homepage </Text>
                        <Button title = 'Log out' onPress={()=> this.props.navigation.navigate('Login',{token:this.state.token,refresh:this.state.refresh})}></Button>
                    </SafeAreaView>
                )
            }
    }
}

const styles = StyleSheet.create({ 
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    }
});

