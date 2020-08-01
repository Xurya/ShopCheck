import React, {Component } from 'react';
import { Alert, Text, TextInput, View, StyleSheet, FlatList, TouchableOpacity, ListView} from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import update from 'react-addons-update';

export default class OrderForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      token: props.route.params.token,
      refresh: props.route.params.refresh,
      shopname: props.route.params.shop,
      shop: null,
      arr: null,
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
    this.cancellablePromise2 = null;
  }
  
  // Retrieve Shop Data
  componentDidMount(){
    // If temporary token is invalid, generate new one with refresh token.
    // If refresh token also invalid, notify user of invalid session --> navigate to login.
    if (!this.state.shop){
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
                        body["shops"].forEach(element => {
                          if(element.name == this.state.shopname){
                            this.setState((state,props)=>{return {shop: element}});
                            this.setState((state,props)=>{return {arr: new Array(element.inventory).fill(0)}});
                          }
                        });
                    }
                })
            }
        })
    }
  }

  componentWillUnmount(){
    this.cancellablePromise.cancel();
    if(this.cancellablePromise2!=null){
      this.cancellablePromise2.cancel();
    }
  }

  makeOrder(){
    this.cancellablePromise2 = makeCancelable(
      fetch("http://157.245.243.174:5000/order/add", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({token:this.state.token, refresh:this.state.refresh, shopID:this.state.shopname, username:this.state.user.username, status:false, items: this.state.arr})
      }));
    this.cancellablePromise2.promise.then((res,err)=>{
      if (err) console.error(err);
      else {
          res.json().then((body,err)=>{
              console.log(body);
              this.sendAlertOK(body.status, body.mesasge);
              this.props.navigation.navigate("Home", {token:this.state.token,refresh:this.state.refresh, user: this.state.user});
          })
      }
    })
  }
  
  sendAlertOK(title, msg){
      Alert.alert(
          title,
          msg,
          [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
          ],
          { cancelable: false }
      );
  }

  render(){
    if(this.state.arr && this.state.shop){
      return(
        <SafeAreaView style={styles.container}>
          <Text style={{fontSize:24, marginVertical:20}}>{this.state.shopname}</Text>
          <FlatList
            data={this.state.shop.inventory}
            width = "100%"
            renderItem={({item, index}) => 
              <View style={{marginHorizontal:20, marginVertical:10, flexDirection:'row', alignItems:'center'}}>
                <Text style={{flex:1}}>
                   {item}
                </Text>
                <TextInput style={{marginLeft:"auto"}}
                  placeholder="0" 
                  onChangeText={ text =>
                    this.setState(
                      update(this.state, {
                          arr: {
                            [index]: {
                              $set: parseInt(text)
                            }
                          }
                        }
                      )
                    )
                  }
                  placeholderTextColor='white' 
                  style={{borderBottomWidth:1, padding:0}}/>
              </View> 
            }
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity 
            onPress={()=>{
                this.makeOrder();
                }} 
            style={styles.button}>

            <Text style={styles.text}>
                Checkout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home", {token:this.state.token,refresh:this.state.refresh, user: this.state.user})} style={styles.button}>
                <Text style={{fontWeight:'bold', color:'white', fontFamily:'NunitoSans_400Regular', fontSize:15}}>
                    Back
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView>
          <Text>Loading...</Text>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home", {token:this.state.token,refresh:this.state.refresh, user: this.state.user})} style={styles.button}>
                <Text style={{fontWeight:'bold', color:'white', fontFamily:'NunitoSans_400Regular', fontSize:15}}>
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
