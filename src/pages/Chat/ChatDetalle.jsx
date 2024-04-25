import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import { Formik } from 'formik'

import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import {onBackPress} from '../backPressHandler';
import { Skeleton } from '@rneui/themed';
import Toast from 'react-native-toast-message';


const ChatDetalle = ({navigation, route}) => {

    const handleBackPress = async () => { 

        let urlBack = "";
        if (route?.params?.titulousuario=="Pasajero"){
            urlBack = "ConductorViajeEnCurso";
        }
        
        if (route?.params?.titulousuario=="Conductor"){
            urlBack = "ViajeEnCurso";
        }

        if (urlBack==""){
            navigation.goBack();
        }else{
            navigation.navigate({
                name: urlBack,
                params: {
                    item: route?.params?.item
                }
            }) 
        }
        
        return true;
    }

    // route.params?
    
    
    
    const [disabledBotonContinuar, setDisabledBotonContinuar] = useState(false);
    const usuario = useSelector(state => state.usuario)
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEnviar, setIsLoadingEnviar] = useState(false);
    const [isLoadingUsuarioInfo, setIsLoadingUsuarioInfo] = useState(true);
    const [isLoadingChat, setIsLoadingChat] = useState(true);
    const [chatLista, setChatLista] = useState([]);
    const [chatInfo, setChatInfo] = useState();
    const [usuarioDestinoInfo, setUsuarioDestinoInfo] = useState();

    const fetchData = async (tipo) => {

        //console.log("fetchData ");    
    
        if (usuario.tokenRegistro!=""){

            //console.log(route.params);

            //console.log("fetchData tipo ");    

            if (tipo!="chat"){
                setIsLoadingUsuarioInfo(true);
                setIsLoadingChat(true);
            }
            
            

            //////console.log("usuario");
            //////console.log(usuario)

            // Consulto al usuario destino
            try {
                const resp = await axios.post(APP_URLAPI+'usuarioinfo',
                    {          
                        token: usuario.tokenRegistro,
                        id: route.params?.usuarioid,
                        compania: COMPANIA_ID
                    }
                );

                //////console.log("usuarioinfoo: ");
                //////console.log(resp.data);

                if (resp.data.code==0){
                    setUsuarioDestinoInfo(resp.data.data);
                    setIsLoadingUsuarioInfo(false);
                }else{
                    setUsuarioDestinoInfo([]);        
                    setIsLoadingUsuarioInfo(false);
                }
            
            } catch (err) {        
                console.error(err);
                setIsLoadingUsuarioInfo(false);
                setIsLoading(false);
            }


            try {
                const resp = await axios.post(APP_URLAPI+'chatdetalle',
                    {          
                        token: usuario.tokenRegistro,
                        usuariodestino: usuarioDestinoInfo?.id,
                        id: route.params?.elementoid,
                        compania: COMPANIA_ID
                    }
                );

                ////console.log("route.params?.elementoid: ");
                ////console.log(route.params?.elementoid);

                //console.log("chatdetalle: ");
                //console.log(resp.data);
                if (resp.data.code==0){
                    setChatLista(resp.data.data.items);
                    setChatInfo(resp.data.data.info);
                    setIsLoadingChat(false);
                }else{
                    setChatLista([]);          
                    setChatInfo(false);
                    setIsLoadingChat(false);
                }

            
            } catch (err) {        
                console.error(err);
                setChatLista([]);
                setChatInfo(false);
                setIsLoadingChat(false);
            }
        }
    };

    const handleOnSubmitEnviar = (values, {resetForm}) => {
        setIsLoading(true);
        setIsLoadingEnviar(true);        
        setDisabledBotonContinuar(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, {resetForm});
        }, 100);
    }

    // isLoadingChat


    const handleOnSubmitEnviar2 = (values, {resetForm}) => {  
        
        if(values.mensaje==""){
            Toast.show({
                type: 'error',
                text1: 'El mensaje no puede estar vacío',
                text1NumberOfLines: 2
            });


            setIsLoading(false);
            setIsLoadingEnviar(false);        
            setDisabledBotonContinuar(false);

            return false;
        }
        
        
        axios
        .post(APP_URLAPI + 'chatenviar',
            {            
                token: usuario.tokenRegistro,                        
                mensaje: values.mensaje,
                usuariodestino: route.params?.usuarioid,
                elementoid: route.params?.elementoid,
                id: route.params?.item?.id ? route.params?.item?.id : chatInfo?.chat_id,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {
            resetForm({values: ''});
            //console.log("chatenviar:");
            ////console.log(response);
            if (response.data.code==0){

                ////////console.log("Registro Correcto");
                setIsLoading(false);     
                setDisabledBotonContinuar(false);

                fetchData("chat");
            }else if (response.data.code==103 || response.data.code==104){               
                navigation.navigate({name: 'Ingreso'})
                return false;
                    
            }
            else{
                setDisabledBotonContinuar(false);
                setIsLoading(false);    
                fetchData();            
            }

            setIsLoadingEnviar(false);        
        }).catch(function (error) {
            resetForm({values: ''});
            setIsLoading(false);            
            setIsLoadingEnviar(false);        
            setDisabledBotonContinuar(false);
            //console.log("error");
            //console.log(error);
        })
        
    };

    useEffect(() => {
        (async () => {

            //////console.log("route.params?:");
            //////console.log(route?.params);

            fetchData();
            /* 

            if (usuario.tokenRegistro){
                const resp = await axios.post(APP_URLAPI+'taxiviajedetalle',
                {          
                    token: usuario.tokenRegistro,
                    id: route.params?.item.transid,
                    compania: COMPANIA_ID
                });        

                if (resp.data.code==0){//
                    setViaje(resp.data.data);
                }else{
                    setViaje([]);
                }
            } */
        })();
    }, [route?.params]);

    useEffect(() => {
        if (!isFocused){return;}

        setIsLoading(true);
        fetchData();
    }, [isFocused]);
  
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>        

        <View style={{borderBottomColor: "#E8E8E8", borderBottomWidth: 1, paddingBottom: 5}}>
            
            {
            isLoadingUsuarioInfo ? 
                <View style={{width: "80%", marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                    <Skeleton
                        
                        animation="wave"
                        width="90%"
                        height={70}
                        style={{marginTop: 15}}
                    />                                                           
                </View>
                :
                <View style={{backgroundColor: '#175176',  paddingLeft: 20, paddingBottom: 20, marginTop: 10}}>
                <View style={{flexDirection: "row"}}>
                    <View style={{alignItems:"center", paddingTop: 10, width: "16%" }}>
                        <TouchableOpacity                            
                            disabled={true}                                    
                        >                               
                            <Image
                                source={{
                                    uri: usuarioDestinoInfo?.imagen
                                }} 
                                style={{height: 40, width: 40}}
                            />                        
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingTop: 15, width: "66%", paddingLeft: 10}}>
                        <TouchableOpacity   
                            disabled={true}                   
                        >          
                            {
                                route?.params?.titulousuario =="" ? null 
                                :
                                <Text style={{color: "#FFFFFF", textTransform: "uppercase", fontWeight: "normal", paddingLeft: 5, fontSize: 14}}>
                                    {route?.params?.titulousuario}
                                </Text>
                            }                                         
                            <Text style={{color: "#FFFFFF", textTransform: "uppercase", fontWeight: "bold", paddingLeft: 5, fontSize: 16}}>
                               {usuarioDestinoInfo?.usuario} 
                            </Text>                            
                        </TouchableOpacity>
                    </View>
                    <View style={{paddingTop: 15, width: "17%", paddingLeft: 10}}>
                        <TouchableOpacity                            
                            onPress={handleBackPress}   
                        >                           
                            <Text style={{color: "#FFFFFF", textTransform: "uppercase", fontWeight: "normal", paddingLeft: 5, fontSize: 14, paddingTop: 3}}>
                                <Icon size={20} name="chevron-circle-left" color={"#FFFFFF"}  /> 
                            </Text>                           
                        </TouchableOpacity>
                    </View>
                    
                </View>
                </View>
            }
                
            
            
        </View>
        
        {
            usuario.tokenRegistro && isLoadingChat ? 
            <View style={{width: "80%", marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                <Skeleton
                    
                    animation="wave"
                    width="90%"
                    height={70}
                    style={{marginTop: 15}}
                /> 
                <Skeleton
                    
                    animation="wave"
                    width="90%"
                    height={70}
                    style={{marginTop: 15}}
                /> 
                <Skeleton
                    
                    animation="wave"
                    width="90%"
                    height={70}
                    style={{marginTop: 15}}
                />                                           
            </View>
            :
            <FlatList
                data={chatLista}
                renderItem={
                    ({item}) => 
                    <>
                    <View style={{paddingLeft: 10, marginTop: 15, textAlign: "right"}}>
                    <Image
                        source={{
                            uri: item.usuarioimg
                        }}                          
                        style={{resizeMode: 'contain', height: 40, width: 40, alignSelf: item.usuarioid == usuario.idUsuario ? "flex-end" : "flex-start" }}
                    />                                          
                    <View style={{flex: 1, flexDirection: "row", backgroundColor: item.usuarioid == usuario.idUsuario ? "#D0FCCF" : "#E7EDF9 ", borderColor: item.usuarioid == usuario.idUsuario ? "#AAE7A9" : "#D5DBE6" , borderWidth: 1, marginTop: 5, paddingVertical: 10, borderRadius: 15}}>
                        <View style={{paddingRight: 10, paddingLeft: 10, width: "100%"}}>
                            <Text style={{fontSize: 18, justifyContent: "center", textAlign: item.usuarioid == usuario.idUsuario ? "right" : "left", paddingTop: 0, fontWeight: "700", color: "#5A5A5A"}}>
                                {item.mensaje}
                            </Text>
                            <Text style={{fontSize: 14, justifyContent: "center", textAlign: item.usuarioid == usuario.idUsuario ? "right" : "left", paddingTop: 0}}>
                                {item.usuario} 
                            </Text>  
                            <Text style={{fontSize: 14, justifyContent: "center", textAlign: item.usuarioid == usuario.idUsuario ? "right" : "left", paddingTop: 0}}>
                                {item.fecha} 
                            </Text>                            
                        </View>                                        
                    </View>
                    </View>
                    </>
                }
            /> 
        }
        <View>
        <Formik
                initialValues={{mensaje: ""}}
                onSubmit={handleOnSubmitEnviar}
            >
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                <View>
                    <View style= {{marginRight: 20, paddingLeft: 10, marginTop: 3, flexDirection: "row", paddingVertical: 5}}>
                        <View style={{  width: "86%"}}>
                            <TextInput
                                onChangeText={handleChange('mensaje')}
                                placeholder='Escriba el mensaje'
                                value={values.mensaje}
                                style={{borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10,  textAlign: "left", marginTop: 10, width: "100%"}}
                            />  
                        </View>
                        <View style={{   paddingTop: 15, paddingLeft:  10}}>
                        <TouchableOpacity 
                            disabled={disabledBotonContinuar}
                            onPress={handleSubmit}  
                            style={{textAlign: "center", marginTop: 5,  borderRadius: 10, justifyContent: "center"}}>
                            {
                                isLoadingEnviar ? <ActivityIndicator size="small" color={COLORBOTONPRINCIPAL} style={{marginTop: 0, marginBottom: 0}} /> : <Icon size={26} name="paper-plane" color={COLORBOTONPRINCIPAL}  /> 
                            }
                            
                            
                        </TouchableOpacity>
                        </View>
                    </View>
                                            
                </View>                          
            )}
            </Formik>
        </View>
        
                                 
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
        color: "#1E950D",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    iconText: {
        fontWeight: "normal", 
        paddingLeft: 5, 
        fontSize: 14, 
        textAlign: "center"
    },
    buttonTextNo: {
      color: "#B43219",
      fontWeight: "normal",
      fontSize: 15,
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
        width: "30%",
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

export default ChatDetalle
