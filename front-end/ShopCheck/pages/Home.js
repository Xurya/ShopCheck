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
            user: null,
            shop: null
        }
    }
    // Retrieve User Data by Token
    componentDidMount(){
        // If temporary token is invalid, generate new one with refresh token.
        // If refresh token also invalid, notify user of invalid session --> navigate to login.
        if (!this.state.user){
            fetch("http://157.245.243.174:5000/account/home", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token:this.state.token, refresh:this.state.refresh})
            }).then((res,err)=>{
                if (err) console.error(err);
                else {
                    res.json().then((body,err)=>{
                        if (err) console.error(err);
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
                            if (body.accountType == 'Owner') {
                                //Check for shop and insert into state.
                                fetch("http://157.245.243.174:5000/shops/getShop", {
                                    method: 'POST',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({token:this.state.token, refresh:this.state.refresh})
                                }).then((res,err)=>{
                                    if (err) console.error(err);
                                    else{
                                        res.json().then((body,err)=>{
                                            if (err) console.error(err);
                                            else if (body['status'] == 'fail') console.log('Error Retrieving Shop');
                                            else {
                                                if (body.shops.length == 0) this.setState((state,props)=>{return {shop: 'None'}});
                                                else this.setState((state,props)=>{return {shop: body.shops[0]}});
                                                console.log(this.state.shop);
                                            }
                                        })
                                    }
                                })
                            }
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
                        <View style = {{flex: 1}}></View>
                        <Text style={styles.text} > Buyer Homepage </Text>

                        <View style = {{flex: 10}}> 
                            <Button
                                title = "Shop List"
                                variant="primary"
                                size = "lg"
                                onPress={()=> this.props.navigation.navigate('ShopList',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                            >
                            </Button>
                                                                           
                            <Button
                                variant = "outline-primary" 
                                onPress={()=> this.props.navigation.navigate('OrderList',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                                title = "Orders"
                            >
                            </Button>                         
                        </View>

                        <View style = {{flex: 1}}> 
                            <Button
                                variant = "outline-primary" 
                                onPress={()=> this.props.navigation.navigate('Login',{token:this.state.token,refresh:this.state.refresh})}
                                title = "Log Out"    
                            >
                            </Button>
                        </View>

                        
                    </SafeAreaView>
                );
            }
            else if (this.state.user.accountType == 'Owner'){
                if (this.state.shop == 'None'){
                    this.props.navigation.pop();
                    this.props.navigation.navigate('CreateShop',{token:this.state.token, refresh:this.state.refresh, user: this.state.user});
                }
                else if (this.state.shop){
                    return(
                        <SafeAreaView style={styles.container}>
                            <Text> Owner Homepage </Text>
                            <Button title = 'Manage Shops' onPress={()=> this.props.navigation.navigate('OwnerManageShops')} variant = "outline-primary"></Button>
                            <Button title = 'Check Orders' onPress={()=> this.props.navigation.navigate('OwnerCheckOrders')}></Button>
                            <Button title = 'Log out' onPress={()=> this.props.navigation.navigate('Login',{token:this.state.token,refresh:this.state.refresh})}></Button>
                        </SafeAreaView>
                    )
                }
                else{
                    return(
                        <SafeAreaView style={styles.container}>
                        </SafeAreaView>
                    )
                }
            }
        return(
            <SafeAreaView style={styles.container}>       
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({ 
    text:{
        fontWeight:'bold', 
        flex: 6,
        color:'black',
        fontFamily:'NunitoSans_400Regular',
        fontWeight: 'bold',
        
        fontSize: 30
    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    },
    
});

