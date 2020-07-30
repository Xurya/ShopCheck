import React, { useState, Component } from 'react';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity, Button} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { useNavigation, NavigationRouteContext } from '@react-navigation/native';

export default class Home extends Component{
    
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            user: props.route.params.user
        }
    }
    // Retrieve User Data by Token
    componentDidMount(){
    }
    
    // Render separate Owner and Buyer homepage
    render(){
        return(
            <SafeAreaView style={styles.container}>  
            <Text>Provide a name of your shop:</Text>     
            </SafeAreaView>
        );
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

