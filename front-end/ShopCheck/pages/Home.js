import React, { useState, Component } from 'react';
import { Image, Alert, Text, StyleSheet, TextInput, View, TouchableOpacity, Button} from 'react-native';
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
                        <Text style={styles.titletext} > Buyer Homepage </Text>
                        <Image style={styles.img} source={require('../assets/logov2.png')}/>
                        <View style = {{flex: 1}}></View>


                        <View style = {{flex: 10}}> 
                            <TouchableOpacity
                                onPress={()=> this.props.navigation.navigate('ShopList',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                                style = {styles.button}
                            >
                            <Text style = {styles.buttontext}>Make an Order</Text>
                            </TouchableOpacity>
                                                                           
                            <TouchableOpacity
                                onPress={()=> this.props.navigation.navigate('OrderList',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                                style = {styles.button}
                            >
                            <Text style = {styles.buttontext}>View Orders</Text>
                            </TouchableOpacity>                         
                        </View>


                        <View style = {{flex: 1}}> 
                            <Button
                                onPress={()=> this.props.navigation.navigate('Landing',{token:this.state.token,refresh:this.state.refresh})}
                                title = "Log Out"    
                                color = "red"
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
                        <View style = {{flex: 1}}></View>
                        <Text style={styles.titletext} > Owner Homepage </Text>
                        <Image style={styles.img} source={require('../assets/logov2.png')}/>
                        <View style = {{flex: 1}}></View>


                        <View style = {{flex: 10}}> 
                            <TouchableOpacity 
                                onPress={()=> this.props.navigation.navigate('OwnerManageShops',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                                style = {styles.button}
                            >
                            <Text style = {styles.buttontext}>Manage Shops</Text>
                            </TouchableOpacity>
                                                                           
                            <TouchableOpacity 
                                onPress={()=> this.props.navigation.navigate('OwnerCheckOrders',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                                style = {styles.button}
                            >
                            <Text style = {styles.buttontext}>Check Incoming Orders</Text>
                            </TouchableOpacity>                         
                        </View>


                        <View style = {{flex: 1}}> 
                            <Button
                                onPress={()=> this.props.navigation.navigate('Landing',{token:this.state.token,refresh:this.state.refresh})}
                                title = "Log Out"    
                                color = "red"
                            >
                            </Button>
                        </View>

                    
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
    titletext:{
        fontWeight:'bold', 
        flex: 2,
        color:'#009CFF',
        fontFamily:'NunitoSans_900Black',
        fontWeight: 'bold',

        fontSize: 35
    },
    img : {
        flex: 3,
        width : '40%',
        height : '40%',
        resizeMode : 'contain',
        
    },
    button:{
        shadowColor: 'rgba(0,0,0, .1)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        height:70,
        width:250,
        backgroundColor:'#FFFFFF',
        alignItems:'center',
        justifyContent:'center',
        margin: 6,
        borderRadius:40,
    },
    buttontext:{
        color:'#009CFF',
        fontFamily:'NunitoSans_400Regular',
        fontSize: 20
    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    },
    
});

