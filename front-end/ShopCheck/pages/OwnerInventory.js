import React, { useState, Component } from 'react';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity, Button, Platform, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { useNavigation, NavigationRouteContext } from '@react-navigation/native';

export default class Inventory extends Component{
    
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            token: props.route.params.token,
            refresh: props.route.params.refresh,
            user: props.route.params.user,
            shop: null,
            adding: false,
            removing: false,
            item: ''
        }
    }
    componentDidMount(){
        fetch("http://157.245.243.174:5000/shops/getShop", 
            {
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

    async addItem(){
        if (this.state.adding) {
          if (this.state.item.length){
            let list = this.state.shop.inventory.concat(this.state.item);
            console.log(list);
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
                change:{field:'inventory', value: list}
              })});
            let val = await tmp.json();
            if (val.status == 'success'){
              console.log('Item successfully added');
              this.setState((state,props)=>{
                return{
                shop:{
                _id: this.state.shop._id,
                name: this.state.shop.name,
                inventory: list}
                }});
            } else {
                console.log('Failed to add');
            }
          }
        }
        this.setState((states,props)=>{
            return {
                adding:!this.state.adding,
                item: ''
            }
            });
      }

    async removeItem(index){
        if (this.state.removing) {
            
              let list = this.state.shop.inventory
              list.splice(index,1);
              console.log(list);
              
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
                  change:{field:'inventory', value: list}
                })});
              let val = await tmp.json();
              if (val.status == 'success'){
                console.log('Item successfully removed');
                this.setState((state,props)=>{
                  return{
                  shop:{
                  _id: this.state.shop._id,
                  name: this.state.shop.name,
                  inventory: list}
                  }});
              } else {
                  console.log('Failed to remove');
              }
          }
    }
    
    render(){
    if (this.state.adding){
        return(
            <SafeAreaView style={styles.container}>  
                <Text style={[styles.text,{fontSize:20,color:'white'}]}>What item would you like to add?</Text>
                <TextInput 
                    placeholder= {this.state.shop.name} 
                    onChangeText={text => {this.setState((state,props)=>{return {item:text}})}} 
                    placeholderTextColor='lightgrey' 
                    textAlign={'center'}
                    style={{borderBottomWidth:1, padding:0, width:200, fontSize:16, color:'white'}}/>
                
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity 
                      onPress={()=>{this.addItem()}} 
                      style={styles.button2}>
          
                      <Text style={[styles.text,{fontSize:15}]}>
                          Submit
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={()=>{this.setState((states,props)=>{return {adding:!this.state.adding}});}} 
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
                <View style={{alignItems:'center', alignContent:'center'}}>
                    <Text style={[styles.text, {color:'white',fontWeight:'bold',fontSize:30}]}>{this.state.shop.name}'s Inventory</Text>
                </View>
                <View style={{flex:1, alignItems:'center', backgroundColor:'#6f7d9e', width:'90%'}}>
                    <FlatList 
                            data={this.state.shop.inventory}
                            width = "100%"
                            renderItem={({item, index}) => 
                                <TouchableOpacity onPress={index=>{this.removeItem(index)}} style={[styles.item, {width:'97%', backgroundColor: this.state.removing ? 'white' : '#ccdbff'} ]}>
                                    <Text style={[styles.text,{color:'black'}]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            } 
                            keyExtractor={(item, index) => index.toString()}
                        />
                </View>

                <View style={{flex:0.15, flexDirection:'row'}}>
                        <TouchableOpacity 
                                  onPress={()=> {this.addItem()}}
                                  style = {styles.button}
                              >
                              <Text style = {styles.text}>Add Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                                  onPress={()=> {this.setState((state,props)=>{return {removing: !this.state.removing}})}}
                                  style = {styles.button}>
                              <Text style = {styles.text}>Remove Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                                  onPress={()=> {this.props.navigation.pop()}}
                                  style = {styles.button}>
                              <Text style = {styles.text}>Back</Text>
                        </TouchableOpacity>
                </View>
            </SafeAreaView>
        ); 
    }    
    else return(
            <SafeAreaView style={styles.container}>
                <View style={{flex:0.1, alignItems:'center'}}>
                </View>
                <View style={{flex:0.70, alignItems:'center'}}>

                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({ 
    text:{
        color:'#009CFF',
        fontFamily:'NunitoSans_400Regular',
        fontSize:15
      },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9db1e0',
    },
    button:{
        shadowColor: 'rgba(0,0,0, .1)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        height:35,
        width:110,
        backgroundColor:'#FFFFFF',
        alignItems:'center',
        justifyContent:'center',
        margin: 5,
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
      },
    item:{
        shadowColor: 'rgba(0,0,0, .1)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 5, // Android,
        height:35,
        width:110,
        backgroundColor:'#FFFFFF',
        alignItems:'center',
        justifyContent:'center',
        margin: 5
      },
});

