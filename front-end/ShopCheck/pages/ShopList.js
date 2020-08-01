import React, {Component } from 'react';
import { Text, Button, View, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper

export default class ShopList extends Component{
    constructor(props){
        super(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            shops: null,
            user: props.route.params.user
        }

        this.cancellablePromise = makeCancelable(
            fetch("http://157.245.243.174:5000/shops/getAllShops", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({token:this.state.token, refresh:this.state.refresh})
            }));
    }
    // Retrieve Shop Data
    componentDidMount(){
        // If temporary token is invalid, generate new one with refresh token.
        // If refresh token also invalid, notify user of invalid session --> navigate to login.
        if (!this.state.shops){
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
                            this.setState((state,props)=>{return {shops: body["shops"]}});
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
        if(this.state.shops){
            return (
                <SafeAreaView style={styles.container}>
                        <Text style={styles.titletext}>
                            Shop List
                        </Text>

                        <FlatList 
                            data={this.state.shops}
                            width = "100%"
                            renderItem={({item, index}) => 
                                <View style={styles.ordercontainer}>
                                    <TouchableOpacity 
                                        onPress={()=>this.props.navigation.navigate("OrderForm", {token:this.state.token, refresh:this.state.refresh, user: this.state.user, shop: item.name})} 
                                        style={styles.text}>
                                        <Text style={styles.text}>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                    <FlatList 
                                        style={{alignItems:'center', marginTop: 10}}
                                        data={item.inventory}
                                        width = "100%"
                                        renderItem={({item, index}) => 
                                            <Text>{item}</Text>
                                        } 
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            } 
                            keyExtractor={(item, index) => index.toString()}
                        />

                        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home", {token:this.state.token,refresh:this.state.refresh, user: this.state.user})} style={styles.button}>
                            <Text style={styles.text}>
                                Go Home
                            </Text>
                        </TouchableOpacity>
                </SafeAreaView>
            );
        } else {
            return(
                <SafeAreaView style={styles.container}>
                    <Text style={styles.text}>
                        Loading...
                    </Text>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home", {token:this.state.token,refresh:this.state.refresh, user: this.state.user})} style={styles.button}>
                        <Text style={styles.text}>
                            Back
                        </Text>
                    </TouchableOpacity>
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
        fontWeight:'bold', 
        color:'#009CFF',
        fontFamily:'NunitoSans_900Black',
        fontSize:17,
        alignItems: 'center',

    },
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    },
    ordercontainer:{
        padding: 15,
        shadowColor: 'rgba(0,0,0, .1)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        borderRadius:15,
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 30, 
        marginTop:30
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
      fontFamily:'NunitoSans_900Black',

    }
})
