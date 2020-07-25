import React, { useState } from 'react';
import { Alert, Text, StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; //This is to support react-navigation wrapper
import { useNavigation } from '@react-navigation/native';

export default function Home({route, navigation}){
    const {token} = route.params;
    const {refresh} = route.params;
    // If temporary token is invalid, generate new one with refresh token.
    // If refresh token also invalid, notify user of invalid session --> navigate to login.

    // Retrieve User Data by Token
    // Render separate Owner and Buyer homepage

    return(

        <SafeAreaView style={styles.container}>
            
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({ 
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey',
    }
});