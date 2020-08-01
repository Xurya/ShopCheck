import React, {Component } from 'react';
import { Text, Button, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper

export default class OrderList extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            user: props.route.params.user,
            orders: null
        }

        this.cancellablePromise = makeCancelable(
            fetch("http://157.245.243.174:5000/order/get", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token:this.state.token, refresh:this.state.refresh, username: this.state.user.username})
            }));
    }
    // Retrieve Shop Data
    componentDidMount(){
        // If temporary token is invalid, generate new one with refresh token.
        // If refresh token also invalid, notify user of invalid session --> navigate to login.
        if (!this.state.orders){
            this.cancellablePromise.promise
            .then((res,err)=>{
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
                            this.setState((state,props)=>{return {orders: body["orders"]}});
                        }
                    })
                }
            })
        }
    }

    componentWillUnmount(){
        this.cancellablePromise.cancel();
    }

    render(){
        if(this.state.orders){
            return (
                <SafeAreaView style={styles.container}>
                        <Text style={styles.titletext}>
                            {this.state.user.username}'s Orders
                        </Text>
        
                        <FlatList 
                            data={this.state.orders}
                            width = "100%"
                            renderItem={({item, index}) =>
                                <View style = {styles.ordercontainer}>
                                    <Text style={styles.text}>
                                        Order Number: {item._id}{"\n"}
                                        Order Complete: {""+item.status}{"\n"}
                                        Order Items:
                                    </Text>
                                    <FlatList 
                                        data={item.items}
                                        width = "100%"
                                        renderItem={({item, index}) => 
                                            <Text style={styles.text}>        Item {index}: {item}</Text>
                                        } 
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>

                                
                            } 
                            keyExtractor={(item, index) => index.toString()}
                        />
                        

                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home")} style={styles.button}>
                            <Text style={styles.text}>
                                Back
                            </Text>
                        </TouchableOpacity>
                </SafeAreaView>
            );
        } else {
            return(
                <SafeAreaView style={styles.container}>
                    
                </SafeAreaView>
            );
        } 
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
    titletext:{
        fontWeight:'bold', 
        //flex: 1,
        color:'#009CFF',
        fontFamily:'NunitoSans_900Black',
        fontWeight: 'bold',

        fontSize: 35
    }, 
    text:{
        margin: 10,
        fontFamily:'NunitoSans_400Regular',
        fontSize:15
    },
    ordercontainer:{
        margin: 15,
        shadowColor: 'rgba(0,0,0, .1)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        borderRadius:15,
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
    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    }
})
