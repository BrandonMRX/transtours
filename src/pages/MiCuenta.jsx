import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, ActivityIndicator, BackHandler, ImageBackground } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import Icon from 'react-native-vector-icons/FontAwesome5';


//import { Header } from "@rneui/themed";
//import { Button } from "@rneui/themed";
//import { ButtonGroup, withTheme } from '@rneui/themed';
//import { Avatar } from "@rneui/themed";


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux'
import { actualizar } from '../app/usuarioSlice';

import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import ListDetalleItem from "../components/ListDetalleItem";


const MiCuenta = ({navigation}) => {

    const isFocused = useIsFocused();

    const cerrarSesion = async () => {
        try {
            setIsLoading(true);
            setDisabledBoton(true);

            let valores = {
                idUsuario: "",
                nombreUsuario: "",
                ciudadUsuario: "",
                emailUsuario: "",
                perfilUsuario: "",
                fechaRegistro: "",
                tokenRegistro: "",
                codigoVerificar: ""
            }
            
            await AsyncStorage.removeItem('usuarioconectado');
            dispatch(actualizar(valores)) 
            setDisabledBoton(false);
            setIsLoading(false);
            navigation.navigate('Ingreso');


        } catch (err) {        
            console.error(err);
            setIsLoading(false);
            setDisabledBoton(false);
        }
    };

    const usuario = useSelector(state => state.usuario)
    const [disabledBoton, setDisabledBoton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()

    useEffect(() => {
        if (!isFocused){return;}
        //console.log("usuario:");
        //console.log(usuario);
    }, [isFocused]);
         
    return (
      <ImageBackground source={require('../../assets/img/fondoscreen.png')} resizeMode="cover"> 
      <SafeAreaView style={{height: "100%"}}>
      <View style={styles.container}>  
        {
        usuario.tokenRegistro ?
        <>
            <ListDetalleItem titulo={"Nombre"}  valor={usuario.nombreUsuario}  />

            <ListDetalleItem titulo={"Apellido"}  valor={usuario.apellidoUsuario}  />

            <ListDetalleItem titulo={"Email"}  valor={usuario.emailUsuario}  />

            <ListDetalleItem titulo={"WhatsApp"}  valor={usuario.whatsappUsuario}  />

            <ListDetalleItem titulo={"Teléfono"}  valor={usuario.telfUsuario}  />

            <ListDetalleItem titulo={"Ciudad"}  valor={usuario.ciudadUsuario}  />

            <ListDetalleItem titulo={"Registrado"}  valor={usuario.fechaRegistro}  />

            <View style={{width: "100%", marginTop: 20}}>
                <TouchableOpacity   
                    disabled={disabledBoton}                  
                    onPress={cerrarSesion}
                    style={{textAlign: "center", marginTop: 5, margin: 12,
                    borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                    <View
                        style={{
                            ...styles.button,
                            backgroundColor: "#9D0303",
                        }} 
                    >        
                        <Icon size={20} name="sign-out-alt" color={"#FFFFFF"}  />
                        <Text 
                            style={styles.buttonText}>
                            {' '}

                            {
                                isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Cerrar Sesión"
                            }
                            
                        </Text>                            
                    </View>
                </TouchableOpacity>
            </View>
        
        </>
        :
        <View>
            <View style={{justifyContent: "center", alignItems:"center", marginTop: 30}}>
                <Image
                    source={require('../../assets/img/pedirlogin.png')}          
                    style={{resizeMode: 'contain', height: 200, width: 300}}
                />  
                <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                    <Text style={{fontSize: 16, textAlign: "center"}}>
                        Inicia sesión en tu cuenta para poder observar esta sección
                    </Text>
                
                </View>  

            </View>
            <View style={{width: "100%"}}>
            <TouchableOpacity 
                onPress={() => navigation.navigate('Ingreso')} 
                style={{textAlign: "center", marginTop: 5, margin: 12,
                borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                <View
                    style={{
                        ...styles.button,
                        backgroundColor: COLORBOTONPRINCIPAL,
                    }} 
                >   
                    <Icon size={20} name="user" color={"#FFFFFF"}  /> 
                    <Text 
                        style={styles.buttonText}>
                        {' '} Iniciar sesión
                    </Text>                            
                </View>
            </TouchableOpacity>
            </View>
        </View> 
    }

        </View>
    </SafeAreaView>
    </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        flexWrap: "wrap",
        marginHorizontal: 15,
        marginTop: 15
    },
    button: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
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
    }
});

export default MiCuenta


/*
const Inicio = () => { 
    return (
        <BarraNavegacion>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                    En Inicio2
                </Text>
            </View>
        </BarraNavegacion>
      );
}
*/
 