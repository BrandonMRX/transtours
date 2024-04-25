import React, { useState, useContext, Component, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, PermissionsAndroid, BackHandler, ImageBackground  } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'

import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import Toast from 'react-native-toast-message';
import { ScrollView } from "react-native-gesture-handler";

import { Formik } from 'formik'
import * as Yup from 'yup';
import { floor } from "react-native-reanimated";
import uuid from 'react-native-uuid';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import * as Location from 'expo-location';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

navigator.geolocation = require('react-native-geolocation-service');

//import Geolocation from '@react-native-community/geolocation';

//navigator.geolocation = require('@react-native-community/geolocation');
//import Geolocation from 'react-native-geolocation-service';

const requestLocationPermission = async () => {
    try {
        ////////console.log("en requestLocationPermission");
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Geolocation Permission',
          message: 'Can we access your location?',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      //////////console.log('granted', granted);
      if (granted === 'granted') {
        //////////console.log('You can use Geolocation');
        return true;
      } else {
        //////////console.log('You cannot use Geolocation');
        return false;
      }
    } catch (err) {
        //////////console.log("error2");
        //////////console.log(err);
      return false;
    }
  };

const DireccionMapa = ({navigation, route}) => {

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

    async function solicitarPermisosUbicacion() {
        /*
        let { status } = await  Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            ////////console.log("Sin permisos");
            //setPermisoActual("Permisos de ubicación actual RECHAZADO. (Ubicación por defecto: Buenos Aires, Argentina.)")
            return;
        }else{
          //////////console.log("Con permisos");
        }
        */
        try {

            let { status } = await  Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                //////////console.log("sin permisos");
                //setErrorMsg('Permission to access location was denied');
                //verificarPermisosUbicacion();
                return;
            }else{
            //////////console.log("con permisos");
            }
    
            let location = await Location.getCurrentPositionAsync({});
    
            let response = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            ////console.log("Location:");
            ////console.log(location.coords.latitude);
            ////console.log(location.coords.longitude)
            
            /* 
            ////////console.log("Location:");
            ////////console.log(location.coords.latitude);
            ////////console.log(location.coords.longitude);
    
            ////////console.log("ubicacion:");
            ////////console.log(response); */
    
            let address ="";
        
            for (let item of response) {
                address = `${item.street}, ${item.name}, ${item.postalCode}, ${item.city}, ${item.country}`;
            }

            ////console.log("address:");
            ////console.log(address);
    
            if (location.coords.latitude){

                address = address.replace("null, ", "");

                let valoresActual = {
                    id: uuid.v4(),
                    direccion: address,
                    place_id: "origen",
                    latitud: location.coords.latitude,
                    longitud: location.coords.longitude
                };

                


                setDireccionActual(valoresActual);
                setDireccionOrigen(valoresActual);
                setDatosObligatoriosOrigen(false);
    
            /* try {
                
                const resp = await axios.post(APP_URLAPI+'usuariogeo',
                    {          
                        token: usuario.tokenRegistro,
                        latitud: location.coords.latitude,
                        longitud: location.coords.longitude,
                        direccion: address,
                        compania: COMPANIA_ID
                    }
                );
                //////////console.log(usuario.tokenRegistro);
                //////////console.log(resp.data);
                if (resp.data.code==0){
                    
                }else{
    
                }
        
            } catch (err) {        
                console.error(err);
                setIsLoading(false);
            } */
            }
        }catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
  
  
    }

    /* 

    const [location, setLocation] = useState(false);
    // function to check permissions and get Location
    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
        ////////console.log('res is:', res);
        if (res) {
            Geolocation.getCurrentPosition(
            position => {
                ////////console.log(position);
                setLocation(position);
            },
            error => {
                // See error code charts below.
                ////////console.log(error.code, error.message);
                setLocation(false);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
            ); 
        }
        });
        ////////console.log(location);
    }; */

    const ref = useRef();

    let valoresIni = {};

    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBuscar, setIsLoadingBuscar] = useState(false);

    const [DatosObligatoriosOrigen, setDatosObligatoriosOrigen] = useState(false);

    const [direccionActual, setDireccionActual] = useState();


    const [locationActual, setLocationActual] = useState(false);
    const [infoViajeTipoSolicitar, setInfoViajeTipoSolicitar] = useState(valoresIni);

    const usuario = useSelector(state => state.usuario)
    const parametros = useSelector(state => state.parametros)

    const dispatch = useDispatch()

    const [direccionOrigen, setDireccionOrigen] = useState();
    const [direccionDestino, setDireccionDestino] = useState();

    
   
    const BuscarAhora = async () => {

        try {

            if (!direccionOrigen){
                Toast.show({
                    type: 'error',
                    text1: 'Seleccione una dirección del mapa',
                    text1NumberOfLines: 2
                });
                //setIsLoading(false);                
                return false;
            }        

            setIsLoadingBuscar(true);
         
            // if (direccionOrigen && direccionDestino){
            if (direccionOrigen){

                let direcciondestino = direccionOrigen.direccion;
                let latituddestino = direccionOrigen.latitud;
                let longituddestino = direccionOrigen.longitud;

                let today = new Date();
                var date = String(today.getDate()).padStart(2, '0');
                var month = String(today.getMonth() + 1).padStart(2, '0');
                var year = today.getFullYear(); 
    
                var hours = String(today.getHours()).padStart(2, '0');
                var min = String(today.getMinutes()).padStart(2, '0');
                var sec = String(today.getSeconds()).padStart(2, '0');
                let dateCompleta = date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec;
    
                let valores = {
                    id: "",
                    usuariodireccion_dirmapa: direccionOrigen.direccion,
                    latitud: direccionOrigen.latitud,
                    longitud: direccionOrigen.longitud
                };

                //console.log("valores mapa:");
                //console.log(valores);

                setIsLoadingBuscar(false);

                let urlenviar = route?.params?.url;
                
                navigation.navigate(urlenviar, 
                {
                    item: valores
                })
                
            }

            setIsLoadingBuscar(false);
          
        } catch (err) {        
            console.error(err);
            setIsLoadingBuscar(false);
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        //console.log("APP_URLAPI:");
            //console.log(APP_URLAPI); 

        //console.log("usuario.tokenRegistro:");
            //console.log(usuario.tokenRegistro); 
            //console.log("COMPANIA_ID:");
            //console.log(COMPANIA_ID); 

        

        //setIsLoadingServicios(false);
    
    };

    useEffect(() => {      
        if (!isFocused){return;}
        fetchData();
    }, [isFocused]);

    return (
    <ImageBackground source={require('../../../assets/img/fondoscreensoloabajo.png')} resizeMode="cover"> 
    <SafeAreaView style={{height: "100%"}}>   
    <>
    <View style={styles.container}>   
        <View style={{paddingHorizontal: 20, paddingVertical: 20, marginBottom:20, width: "100%"}}>
            {
            isLoading ?
                <>
                    <ActivityIndicator size="large" color="black" style={{marginTop: 0, marginBottom: 0}} />                    
                </>
            :null
            }
                
            {               
                isLoading==true ? null  
                :
                <>

                <View style={{flexDirection: "row", paddingLeft: 5, paddingBottom: 5, display:"none"}}>  
                    <Text style={{fontSize: 14}}>
                        Origen: 
                        {
                            direccionActual?.direccion ? 
                            ' (Dirección actual)'
                            : null
                        }
                        
                    </Text>
                </View>
                <View style={{flexDirection: "row"}}>                    
                    
                    <GooglePlacesAutocomplete

                        //placeholder="123"
                        //currentLocation={true}
                        currentLocationLabel='Current location'

                        //ref={ref}
                        //currentLocation={true}
                        //currentLocationLabel="Your location!" // add a simple label
                        minLength={4}                            
                        
                        //getDefaultValue={() => 'abc'}
                        /* placeholder={
                            direccionActual?.direccion
                        } */
                        placeholder={
                            direccionActual?.direccion ?
                            direccionActual?.direccion :
                            'Buscar dirección'
                        }
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            //////////console.log(data, details);
                            //////////console.log(details.geometry);
                            let valoresOrigen = {
                                id: uuid.v4(),
                                direccion: data.description,
                                place_id: data.place_id,
                                latitud: details.geometry.location.lat,
                                longitud: details.geometry.location.lng,
                                desdebuscador: 1                                            
                            };
                            setDireccionOrigen(valoresOrigen)
                            setDireccionActual(false)
                            setDatosObligatoriosOrigen(false);
                            //////////console.log(direccionOrigen);
                        }}
                        fetchDetails={true}
                        query={{
                            key: 'AIzaSyCcrtNyclS_0eHH6YQrD6E-x4mH5TCnNyo',
                            language: 'es',
                            components: 'country:'+parametros.valor.pais,
                        }}
                        styles={{
                            textInputContainer: {
                                borderColor: "#D3D3D0",
                                borderWidth: 1,
                                borderRadius: 5
                            },
                            textInput: {
                                height: 38,
                                color: '#000000',
                                fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                                color: '#000000',
                                fontWeight: "bold"
                            },
                        }}
                    />
                    
                    
                </View>               
            </>
            }

            {
                isLoading==true ? null :
                <>                
                <View style={{width: "100%"}}>
                    <TouchableOpacity 
                        onPress={BuscarAhora}
                        style={{textAlign: "center", marginTop: 15, 
                        borderRadius: 10, justifyContent: "center"}}>
                        <View
                            style={{
                                ...styles.button,
                                backgroundColor: COLORBOTONPRINCIPAL,
                            }} 
                        >       
                            <Icon size={20} name="search" color={"#FFFFFF"}  />
                            <Text
                            style={styles.buttonText}>
                            {' '}
                            
                            {
                                isLoadingBuscar ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Siguiente"
                            }                            
                             
                            </Text>                            
                        </View>
                    </TouchableOpacity>
                </View>  
                <View style={{justifyContent: "center", alignItems:"center", marginTop: 0, paddingTop: 10}}>
                    <Image
                        source={{
                            uri: route?.params?.item?.imagen
                        }}                          
                        style={{resizeMode: 'contain', height: 200, width: 250}}
                    />                      
                </View>   
                </>
            }            
            
        </View>
    </View>
    </>
    </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        justifyContent: "center",
        height: "100%"
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
    buttonTextSimular: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 10,
        paddingVertical: 3,
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
    },
    imgServicio: {
        height: 200, 
        width: 200,
        resizeMode: 'contain'
    },
    input: {
        height: 48,
        marginLeft: 12,
        marginRight: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: "#AFAFAF",
        borderRadius: 10,
        marginTop: 0
    },
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    buttonTextSinSeleccionar: {
        color: "#000000",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    buttonTextSeleccionado: {
        color: "#FFFFFF",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    reduce:{
        width:34,
        height:34,
        justifyContent:'center',
        borderRightWidth:1, // Margen derecho
        borderRightColor:'gray', // color
    },
    btn1:{
        fontSize:18,
        textAlign:'center',
        backgroundColor:'transparent', // color transparente
    },
    input1:{
        flex:1,
        backgroundColor:'transparent', // transparente
        textAlign:'center',
        padding:0,
        fontSize:14,
        
    },
    operatingBox: {
        margin:5,
        width: 140,
        height:35,
        borderColor:'gray', // color del borde
        borderWidth:1,
        borderRadius: 5, // Radio de esquina redonda

        flexDirection:'row', // Diseño del husillo
        alignItems: 'center', // Alineación del eje lateral
        overflow: 'hidden', // Ocultar más allá del alcance del control
        justifyContent: 'center',
        
    },
    plus:{
        width:34,
        height:34,
        justifyContent:'center',
        borderLeftWidth:1, // Margen derecho
        borderLeftColor:'gray', // color
    },
});

export default DireccionMapa