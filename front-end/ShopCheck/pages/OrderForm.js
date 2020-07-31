import React, {Component } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper

export default class OrderForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            shop: props.route.params.shop,
            user: props.route.params.user
        }
    }
    
    render(){
        return(
            <SafeAreaView style={styles.container}>
                
            </SafeAreaView>
        ); 
    }
}

export function makeCancelable(promise) {
    let isCanceled = false;
    const wrappedPromise =
      new Promise((resolve, reject) => {
        promise
          .then(
            val => (isCanceled
              ? reject(new Error({ isCanceled })) 
              : resolve(val))
          )
          .catch(
            error => (isCanceled
              ? reject(new Error({ isCanceled }))
              : reject(error))
          );
      });
    return {
      promise: wrappedPromise,
      cancel() {
        isCanceled = true;
      },
    };
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
