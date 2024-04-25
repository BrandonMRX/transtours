import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import Constants from "expo-constants";


import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import { FloatingAction } from "react-native-floating-action";

import { ScrollView } from "react-native-gesture-handler";
import { actualizar } from '../../app/usuarioSlice';

const ChatLista = ({navigation, route}) => {

    const dispatch = useDispatch();
    const usuario = useSelector(state => state.usuario)
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [lista, setLista] = useState([]);

    const [searchedArray, setSearchedArray] = useState(lista);
    const [searchString, setSearchString] = useState("");
    const [totalResultados, setTotalResultados] = useState(null);
    const [sinresultados, setSinresultados] = useState(null); 
    
    
    
    useEffect(() => {
        if (!isFocused){return;}      

        //console.log("route.params?.item");
        //console.log(route.params?.item);
        
        //console.log("useEffect Panel");
        //console.log("isFocused Panel");
        //console.log(isFocused);
        
        // Consulta de chat
        consultar();
        
    }, [isFocused]);

  
    const consultar = async (buscar) => { 

        setIsLoading(true)    
        setSinresultados(false);
        
        axios
         .post(APP_URLAPI + 'chatlista',
             {                    
                 token: usuario.tokenRegistro,
                 compania: COMPANIA_ID
             }
         )   
         .then(response => {

            //console.log("chatlista:");
            //console.log(response.data);
            
       /*    //console.log("APP_URLAPI ");
             //console.log(APP_URLAPI);
             //console.log("COMPANIA_ID");
             //console.log(COMPANIA_ID);
            //console.log("usuario.tokenRegistro");
             //console.log(usuario.tokenRegistro);
             //console.log("viviendas hotelhabitaciones:");
             //console.log(response.data); */
             ////console.log(response.data.data.length);
            if (response.data.code==0){
                setLista(response.data.data)  
                setSearchedArray(response.data.data);
                setIsLoading(false)   
                
                
                  
                 //setHabitaciones([])
            }else if (response.data.code==103 || response.data.code==104){
                setLista([])
                setSearchedArray([])
                setIsLoading(false)                
                navigation.navigate({name: 'Ingreso'})
                return false;
            }else{   
                setLista([])
                setSearchedArray([])
                setIsLoading(false)

                setSinresultados(<>
                    <View style={{justifyContent: "center", alignItems:"center", marginTop: 10, backgroundColor: "#FFFFFF", padding: 15}}>
                        <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                            <Text style={{fontSize: 16, textAlign: "center"}}>
                                No tienes mensajes
                            </Text>
                        
                        </View>
                        <Image
                            source={require('../../../assets/img/sinresultados.jpg')}          
                            style={{resizeMode: 'contain', height: 200, width: 300}}
                        />                             
                    </View>                
                </>);
                
                setTotalResultados(false);
               
            }
     
         }).catch(function (error) {
            setLista([])
            setIsLoading(false)
         })        
    };

    return (
    <SafeAreaView>       

        {
            isLoading ? (
            <View style={{alignContent: "center", justifyContent: "center", alignSelf: "center", marginBottom: 100}}>      
                <ActivityIndicator size="large" color="black" style={{marginTop: 0, marginBottom: 0}} />                      
            </View>            
            )   
            : 
            searchedArray.length ==0 ? 
            <View style={{justifyContent: "center", alignItems: "center", marginVertical: 0, marginHorizontal: 20 }}>
                <View style={{backgroundColor: "#C8F2ED",  borderColor: "#168E12", borderRadius: 5, width: "100%", padding: 20, margin: 20}}>
                    <Text style={{color: "#095D53", fontSize: 14, textAlign: "center"}}>No se encontraron mensajes</Text>
                </View>                
            </View>
            :
            <FlatList
            data={searchedArray}
            renderItem={
                ({item}) => 
                <TouchableOpacity  
                    onPress={() => {

                        navigation.navigate('ChatDetalle',{
                            usuarioid: item.usuariodestino_id,
                            titulousuario: '',
                            elementoid: item.elemento_id,
                            item: item
                        });                        
                    }}
                >
                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#fff", marginTop: 10, paddingVertical: 5, borderRadius: 15, marginHorizontal: 20}}>
                    <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10, paddingVertical:5}}>
                    <Image 
                        style={{height: 80, resizeMode: 'contain'}}
                        source={{
                            uri: item?.usuariodestino_img
                        }}  
                    />
                    </View>
                    <View style={{width: "70%", paddingRight: 10}}>
                        <Text style={{fontSize: 18, justifyContent: "center", textAlign: "left", paddingTop: 0, fontWeight: "700", maxHeight: 50, overflow: "hidden"}}>
                            {item.usuariodestino} 
                        </Text>
                        <Text style={{fontSize: 14, justifyContent: "center", textAlign: "left", paddingTop: 0}}>
                            {item.chat_ultfecha}
                        </Text>
                        <Text style={{fontSize: 14, justifyContent: "center", textAlign: "left", paddingTop: 0, marginTop: 5, maxHeight: 40, overflow: "hidden"}}>
                            {item.chat_ultmsje}
                        </Text>                        
                    </View>                
                    <View style={{width: "8%", justifyContent: "center" }}>
                        <Icon size={24} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                    </View>                
                </View>
                </TouchableOpacity>              
            }
            />  
        }
        
           
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        marginHorizontal: 15,
        marginTop: 15,
        justifyContent: "center"
    },   
    input: {
        height: 40,
        width: 280,
        margin: 12,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        borderColor: "gray"
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
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 20,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    buttonTextSimular: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 14,
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
      backgroundColor: '#0D7374',
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
    },
    imgServicio: {
        height: 230, 
        width: 300,
        resizeMode: 'contain'
    },
});

export default ChatLista
