import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Button, StyleSheet, View, TouchableOpacity, Text, TextInput} from 'react-native';

export default class Home extends React.Component{
    
  constructor(props){
      super(props);
      console.log(props);
      this.state = {
          token: props.route.params.token,
          refresh: props.route.params.refresh,
          user: null,
          shop: null,
          name_change : false,
          diff_name: ''
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
  
  async toggleStatus(){
    let tmp = await fetch("http://157.245.243.174:5000/shops/updateShop", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {shop_id:this.state.shop._id,
          token:this.state.token, 
          refresh:this.state.refresh, 
          change:{field:'status', value: !this.state.shop.status}
        })});
    let val = await tmp.json();

    if (val.status == 'success'){
      this.setState((state,props)=>{
        return{
        shop:{
        _id: this.state.shop._id,
        name: this.state.shop.name,
        status:!this.state.shop.status}
        }});
    }
    else{
      console.log('failed');
    }
  }

  async changeName(){
    if (this.state.name_change) {
      if (this.state.diff_name.length){
        let tmp = await fetch("http://157.245.243.174:5000/shops/updateShop", {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {shop_id:this.state.shop._id,
            token:this.state.token, 
            refresh:this.state.refresh, 
            change:{field:'name', value: this.state.diff_name}
          })});
        let val = await tmp.json();
        if (val.status == 'success'){
          this.setState((state,props)=>{
            return{
            shop:{
            _id: this.state.shop._id,
            name: this.state.diff_name,
            status: this.state.shop.status}
            }});
        }
      }
    }

    this.setState((states,props)=>{return {name_change:!this.state.name_change}});
  }

  // Render separate Owner and Buyer homepage
  render(){
    if (this.state.name_change){
      return(
        <SafeAreaView style={styles.container}>  
            <Text style={[styles.text,{fontSize:20,color:'white'}]}>Specify a different name for your shop.</Text>
            <TextInput 
                placeholder= {this.state.shop.name} 
                onChangeText={text => {this.setState((state,props)=>{return {diff_name:text}})}} 
                placeholderTextColor='lightgrey' 
                textAlign={'center'}
                style={{borderBottomWidth:1, padding:0, width:200, fontSize:16, color:'white'}}/>
            
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity 
                  onPress={()=>{this.changeName()}} 
                  style={styles.button2}>
      
                  <Text style={[styles.text,{fontSize:15}]}>
                      Submit
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={()=>{this.setState((states,props)=>{return {name_change:!this.state.name_change}});}} 
                style={styles.button2}>
    
                <Text style={[styles.text,{fontSize:15}]}>
                    Back
                </Text>
            </TouchableOpacity>
            </View>
                 
        </SafeAreaView>
      );
    }

    if (this.state.shop){
      return(
          <SafeAreaView style={styles.container}>
                  <View style={{flex:0.25, alignItems:'center'}}>
                    <Text style={[styles.text, {color:'white',fontWeight:'bold',fontSize:30}]}>Shop Control Panel</Text>
                    <Text style={[styles.text, {color:'white'}]}>Shop: {this.state.shop.name}</Text>
                    <Text style={[styles.text, {color:'white'}]}>Status: <Text style={{color: this.state.shop.status ? 'green' : 'red'}}>{this.state.shop.status ? 'Open' : 'Closed'}</Text></Text>
                  </View>
                  <View style={{flex:0.125}}>
                        <TouchableOpacity 
                                  onPress={()=> {this.toggleStatus();}}
                                  style = {styles.button}
                              >
                              <Text style = {styles.text}>Toggle Status</Text>
                        </TouchableOpacity>
                  </View>
                  <View style={{flex:0.125}}>
                        <TouchableOpacity 
                                  onPress={()=> this.props.navigation.navigate('OwnerInventory',{token:this.state.token,refresh:this.state.refresh, user: this.state.user})}
                                  style = {styles.button}
                              >
                              <Text style = {styles.text}>Inventory</Text>
                        </TouchableOpacity>
                  </View>
                  <View style={{flex:0.125}}>
                        <TouchableOpacity 
                                  onPress={()=> this.changeName()}
                                  style = {styles.button}
                              >
                              <Text style = {styles.text}>Change Name</Text>
                        </TouchableOpacity>
                  </View>
                  <View style={{flex:0.125}}>
                      <TouchableOpacity onPress={()=>{this.props.navigation.navigate("Home"), {token:this.state.token, refresh:this.state.refresh}}} style={styles.button}>
                          <Text style={styles.text}>
                              Back
                          </Text>
                      </TouchableOpacity>
                  </View>
          </SafeAreaView>
      )
    }
    else{
      return(
        <SafeAreaView style={styles.container}></SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({ 
    text:{
      color:'#009CFF',
      fontFamily:'NunitoSans_400Regular',
      fontSize:20
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#9db1e0',
    },
    img : {
      width : '45%',
      height : '45%',
      resizeMode : 'contain',
      margin: -68
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
    button2:{
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 1, width: 1 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
      elevation: 5, // Android,
      height:35,
      width:70,
      backgroundColor:'white',
      alignItems:'center',
      justifyContent:'center',
      margin: 8,
      borderRadius:20,
    }
  });