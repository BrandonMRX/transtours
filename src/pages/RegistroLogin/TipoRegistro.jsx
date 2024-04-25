import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, BackHandler } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'


import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

const TipoRegistro = ({navigation}) => {

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Ingreso')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const isFocused = useIsFocused();

    const usuario = useSelector(state => state.usuario)

    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isFocused){return;}
        //////console.log(usuario);
        setIsLoading(true);
        fetchData();
    }, [isFocused]);
    
    return ( 
      <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>
              
        <View>
            
            <View style={{width: "100%"}}>
                
                <TouchableOpacity 
                    onPress={() => {
                        navigation.navigate({
                          name: 'Registro',
                          params: { tipo: 'cliente'},
                          merge: true,
                        });
                    }}
                    style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                    <View style={{alignItems:"center", justifyContent: "center"}}>
                        <Image
                            source={require('../../../assets/img/registropasajero.jpg')}
                            style={{height: 230, width: 230, resizeMode: 'contain'}}
                        /> 
                    </View>
                    <View
                        style={{
                            ...styles.button,
                            backgroundColor: COLORBOTONPRINCIPAL,
                        }} 
                    >      
                        <Icon size={20} name="user" color={"#FFFFFF"}  />                        
                        <Text 
                            style={styles.buttonText}>
                            {' '} Registrarte como Pasajero
                        </Text>                            
                    </View>
                </TouchableOpacity>                
            </View>

            <View style={{width: "100%"}}>
                
                <TouchableOpacity 
                    onPress={() => {
                        navigation.navigate({
                          name: 'Registro',
                          params: { tipo: 'conductor'},
                          merge: true,
                        });
                    }}
                    style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                    <View style={{alignItems:"center", justifyContent: "center"}}>
                        <Image
                            source={require('../../../assets/img/registroconductor.jpg')}
                            style={{height: 230, width: 230, resizeMode: 'contain'}}
                        /> 
                    </View>
                    <View
                        style={{
                            ...styles.button,
                            backgroundColor: "#055D83",
                        }} 
                    >      
                        <Icon size={20} name="car" color={"#FFFFFF"}  />                        
                        <Text 
                            style={styles.buttonText}>
                            {' '} Registrarte como Conductor
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
        flexDirection:'row',
        flexWrap: "wrap",
        marginHorizontal: 15,
        marginTop: 5,
        justifyContent: "center"
    },
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
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
    iconView: {
        backgroundColor: "#FFFFFF",
        width: 100,
        height: 100,
        margin: 4,
        borderColor: "#EDEDED", 
        borderWidth: 1, 
        borderRadius: 15, 
        paddingHorizontal: 5,
        paddingVertical: 5,
        paddingTop: 20
    },    
    iconImg: {
        height: 70, width: 70
    },
    iconText: {
        fontWeight: "normal", 
        paddingLeft: 5, 
        fontSize: 14, 
        textAlign: "center"
    },
    iconBoton: {
        justifyContent: "center", 
        alignItems:"center", 
        textAlign:'center'
    },
    containerBilletera: {
      backgroundColor: '#358313',
      color: '#FFFFFF',
      borderColor: '#D8DAD8',
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 10,
      marginLeft: 20,
      marginRight: 20,
      height: 40, 
      marginTop: 30,
      flexDirection: "row",
      flex: 1,  
      width: 300,
      flexWrap: "wrap",
    },
    iconContainer: {
        color: '#FFFFFF',
        marginLeft: 20,
        marginRight: 20,
        height: 80, 
        marginTop: 30,
        flexDirection: "row",
        flex: 1,  
        alignItems: 'flex-start' 

    },
    fuente: {
        color: '#FFFFFF'
    },
    img: {
        marginTop: 20,
        height: 130,
        width: 220
    }
});

export default TipoRegistro
