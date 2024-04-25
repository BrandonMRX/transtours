import React, { useState, useContext, Component, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { ScrollView } from "react-native-gesture-handler";

import PedirLogin from "../../components/PedirLogin";
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

const TieneViajeEnCurso = ({navigation}) => {

    /* useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Panel')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%", paddingTop: 40, alignContent:"center"}}>    
        <View>
            <View style={{justifyContent: "center", alignItems:"center", marginTop: 30}}>
                <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                    <Text style={{fontSize: 16, textAlign: "center"}}>
                        Posee un viaje un curso, para solicitar otro finalice el viaje o cancele el mismo.
                    </Text>
                
                </View>  

            </View>
            <View style={{width: "100%"}}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('Viajes')} 
                style={{textAlign: "center", marginTop: 5, margin: 12,
                borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                <View
                    style={{
                        ...styles.button,
                        backgroundColor: COLORBOTONPRINCIPAL,
                    }} 
                >   
                    <Icon size={20} name="car" color={"#FFFFFF"}  /> 
                    <Text 
                        style={styles.buttonText}>
                        {' '} Ver Viaje en Curso
                    </Text>                            
                </View>
            </TouchableOpacity>
            </View>
        </View>         
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: 16
    },
    header: {
      fontSize: 32,
      backgroundColor: "#fff"
    },
    title: {
      fontSize: 24
    },
    button: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#666",
      borderRadius: 10,
      paddingVertical: 5,
      textAlign: "center",
      justifyContent: "center"
    },
    buttonShare: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 20,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 16,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
  });

  
export default TieneViajeEnCurso