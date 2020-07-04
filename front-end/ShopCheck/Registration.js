import React from 'react';
import { Text, TextInput } from 'react-native';
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
            <SafeAreaView>
                <Text>Registration Screen</Text>
                <TextInput
                    placeholder="Name"
                    value={this.state.displayName}
                    onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                />
            </SafeAreaView>
        );
    }
}

export default Registration;