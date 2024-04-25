import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler, ImageBackground } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, COLORBOTONPRINCIPAL, REFERIDOS, TIPOAPP } from '@env'

import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Badge } from '@rneui/themed';

import { useSelector, useDispatch } from 'react-redux'
import { actualizar } from '../../app/usuarioSlice';

import { useIsFocused, useFocusEffect} from "@react-navigation/native";

const MenuCuenta = ({navigation}) => {
    

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

  const isFocused = useIsFocused();
  const usuario = useSelector(state => state.usuario)
  const parametros = useSelector(state => state.parametros)
  const [disabledBoton, setDisabledBoton] = useState(false);

  const [requisitos, setRequisitos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()


  const fetchData = async () => {
    
    try {
    } catch (err) {                
    }
  };
  /*
  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);
  */

  useEffect(() => {
    if (!isFocused){return;}
    //setIsLoading(true);
    fetchData();
    ////////console.log(88);
  }, [isFocused]);

    const cerrarSesion = async () => {
        try {

            let valores = {
                idUsuario: "",
                nombreUsuario: "",
                apellidoUsuario: "",
                whatsappUsuario: "",
                emailUsuario: "",
                perfilUsuario: "",
                fechaRegistro: "",
                tokenRegistro: "",
                codigoVerificar: "",
                qrUsuario: "",
                codigoReferido: "",
                estatusCodigo: "",
                estatusNombre: ""
            }

            AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));
            AsyncStorage.clear();
            setIsLoading(true);
            setDisabledBoton(true);

            dispatch(actualizar(valores)) 
            setDisabledBoton(false);
            setIsLoading(false);
            //navigation.navigate('Ingreso');
            navigation.navigate('Ingreso',{salir: 1});


        } catch (err) {        
            console.error(err);
            setIsLoading(false);
            setDisabledBoton(false);
        }
    };

   
    const Item = ({ title }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
    
    return (
    <ImageBackground source={require('../../../assets/img/fondoscreen.png')} resizeMode="cover"> 
    <SafeAreaView style={{height: "100%"}}> 
    <ScrollView>
    <View style={styles.container}>  
        <View style={{width: "100%"}}>
            <Text style={{color: "#343434", fontWeight: "normal", fontSize: 16, textAlign: "left", fontWeight: "600"}}>
                Viajes
            </Text> 
        </View> 
        <View style={{width: "100%"}}>
            <TouchableOpacity  
                onPress={() => {
                    navigation.navigate({
                        name: 'Viajes'
                    });
                }}
                >
                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F4F4", marginTop: 10, paddingVertical: 10, borderRadius: 10}}>
                    <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10, alignItems: "center"}}>
                        <Icon size={25} name="car" color="#A5281A"  />
                    </View>
                    <View style={{width: "68%", paddingTop: 3}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                            Mis Viajes
                        </Text>                  
                    </View>
                    <View style={{width: "15%", justifyContent: "center" }}>                  
                        <Icon size={20} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                    </View>                
                </View>
            </TouchableOpacity>    
            <TouchableOpacity  
                onPress={() => {
                    navigation.navigate({
                        name: 'TaxiTarifas'
                    });
                }}
            >
                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F4F4", marginTop: 10, paddingVertical: 10, borderRadius: 10}}>
                    <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10, alignItems: "center"}}>
                        <Icon size={35} name="cogs" color="#18324F"  />
                    </View>
                    <View style={{width: "68%", paddingTop: 5}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                        Tarifas
                        </Text>                  
                    </View>
                    <View style={{width: "15%", justifyContent: "center" }}>                  
                        <Icon size={20} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                    </View>                
                </View>
            </TouchableOpacity>              
        </View>
        <View style={{marginBottom: 0, marginTop: 20, width: "100%", borderTopColor: "#D6D6D6", borderTopWidth: 1, paddingTop: 10}}>
            <Text style={{color: "#343434", fontWeight: "normal", fontSize: 16, textAlign: "left", fontWeight: "600"}}>
                Mi Cuenta
            </Text> 
        </View> 
        <View style={{width: "100%"}}>            

            <TouchableOpacity  
                onPress={() => {
                    navigation.navigate({
                        name: 'Direcciones'
                    });
                }}
            >
                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F4F4", marginTop: 10, paddingVertical: 10, borderRadius: 10}}>
                    <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10, alignItems: "center"}}>
                        <Icon size={25} name="map-marker" color="#188585"  />
                    </View>
                    <View style={{width: "68%", paddingTop: 5}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                            Direcciones
                        </Text>                  
                    </View>
                    <View style={{width: "15%", justifyContent: "center" }}>                  
                        <Icon size={20} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                    </View>                
                </View>
            </TouchableOpacity>

            <TouchableOpacity  
                onPress={() => {
                navigation.navigate({
                    name: 'MiCuenta'
                });
                }}
            >
                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F4F4", marginTop: 10, paddingVertical: 10, borderRadius: 10}}>
                    <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10, alignItems: "center"}}>
                        <Icon size={25} name="user" color="#249C14"  />
                    </View>
                    <View style={{width: "68%", paddingTop: 5}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                            Datos personales
                        </Text>                  
                    </View>
                    <View style={{width: "15%", justifyContent: "center" }}>                  
                        <Icon size={20} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                    </View>                
                </View>
            </TouchableOpacity>
   
            <TouchableOpacity  
                    onPress={() => {
                    navigation.navigate({
                        name: 'ChatLista'
                    });
                    }}
                >
                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F4F4", marginTop: 10, paddingVertical: 10, borderRadius: 10}}>
                    <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10, alignItems: "center"}}>
                        <Icon size={35} name="comments" color="#47B02D"  />
                    </View>
                    <View style={{width: "68%", paddingTop: 5}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                            Mensajes
                        </Text>                  
                    </View>
                    <View style={{width: "15%", justifyContent: "center" }}>                  
                        <Icon size={20} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                    </View>                
                </View>
            </TouchableOpacity>
               
        

        </View>

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
    </View>
    </ScrollView>

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

export default MenuCuenta