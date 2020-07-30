import React, { useState } from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper

export default class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: props.route.params.token,
            data: null,
            user: props.route.params.user
        }
    }
    // Retrieve User Data by Token
    componentDidMount(){

        // If temporary token is invalid, generate new one with refresh token.
        // If refresh token also invalid, notify user of invalid session --> navigate to login.
        if (!this.state.data){
            fetch("http://10.0.2.2:5000/", {
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
        return (
            <SafeAreaView style={styles.container}>
                    <Text style={{fontSize:24}}>
                        Shop List
                    </Text>
    
                    <FlatList>
                        
                    </FlatList>
            </SafeAreaView>
        );
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
