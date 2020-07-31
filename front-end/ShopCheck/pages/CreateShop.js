import React, { useState, Component } from 'react';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity, Button, Platform} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { useNavigation, NavigationRouteContext } from '@react-navigation/native';

export default class Home extends Component{
    
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            user: props.route.params.user,
            shopName: ''
        }
    }

    async createShop(){
        if (!this.state.shopName || !this.state.shopName.length) {console.log('Must enter at least a single character for shop name.')}
        else {
            let ret = await fetch('http://157.245.243.174:5000/shops/addShop',{
                method: 'POST',
                headers: {
                    'Accept' : 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    token: this.state.token,
                    refresh: this.state.refresh,
                    name: this.state.shopName
                })
            })
            let parsed = await ret.json()

            if (parsed.status == 'success') {
                console.log('Shop created successfully');
                this.props.navigation.pop();
                this.props.navigation.navigate('Home', {token: this.state.token, refresh: this.state.refresh});
            }
            else {
                console.log(parsed.message);
            }
        }
    }

    componentDidMount(){
    }
    
    render(){
        return(
            <SafeAreaView style={styles.container}>  
                <Text style={[styles.text,{fontSize:20}]}>Provide the name of your shop.</Text>
                <TextInput 
                    placeholder="Shop Name" 
                    onChangeText={text => {this.setState((state,props)=>{return {shopName:text}})}} 
                    placeholderTextColor='black' 
                    textAlign={'center'}
                    style={{borderBottomWidth:1, padding:0, width:200, fontSize:15}}/>
                
                <TouchableOpacity 
                    onPress={()=>{this.createShop()}} 
                    style={styles.button}>
        
                    <Text style={styles.text}>
                        Submit
                    </Text>
                </TouchableOpacity>     
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
    },
    text:{
        fontWeight:'bold', 
        color:'black',
        fontFamily: Platform.OS === 'ios' ? 'Futura' : 'sans-serif-thin'
    },
    button:{
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        height:35,
        width:70,
        backgroundColor:'#af5cf7',
        alignItems:'center',
        justifyContent:'center',
        margin: 8,
        borderRadius:20,
      }
});

