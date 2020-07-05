import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper

class Registration extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{fontSize:24}}>Registration Screen</Text>
                <TextInput
                    placeholder="Name"
                    value={this.state.displayName}
                    placeholderTextColor='white'
                    onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                    style = {{fontSize:18, color:'white',}}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#9db1e0',
    }
})

export default Registration;