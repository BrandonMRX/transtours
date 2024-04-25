import React, { useState, useContext, Component, useEffect, useRef, useCallback } from "react";
import { Button, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, PermissionsAndroid, BackHandler  } from 'react-native'
import { TextInput } from 'react-native-paper';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'

import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { ScrollView } from "react-native-gesture-handler";
import Toast from 'react-native-toast-message';

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

const ViajeBuscar = ({navigation, route}) => {

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

            //console.log("Location:");
            //console.log(location.coords.latitude);
            //console.log(location.coords.longitude)
            
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

            //console.log("direccionOrigenGuardada?.id:");
            //console.log(direccionOrigenGuardada?.id);
    
            if (location.coords.latitude && (direccionOrigenGuardada?.id=="" || !direccionOrigenGuardada)){

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

    const [infoPedido, setInfoPedido] = useState(false);
    const [DatosObligatoriosOrigen, setDatosObligatoriosOrigen] = useState(false);
    const [DatosObligatoriosDestino, setDatosObligatoriosDestino] = useState(false);

    const [direccionActual, setDireccionActual] = useState();
    let valorTipoBusqueda = "Ciudad";
    if (COMPANIA_ID==380){
        valorTipoBusqueda = "Municipio";  
    }
    const [tipoBusqueda, setTipoBusqueda] = useState(valorTipoBusqueda);
    
    const [tarifaUsuario, setTarifaUsuario] = useState("");
    const [envioTexto, setEnvioTexto] = useState("");
    const [montoArticuloEnvio, setMontoArticuloEnvio] = useState("");

    const [locationActual, setLocationActual] = useState(false);
    const [infoViajeTipoSolicitar, setInfoViajeTipoSolicitar] = useState(valoresIni);

    const usuario = useSelector(state => state.usuario)
    const parametros = useSelector(state => state.parametros)

    const dispatch = useDispatch()

    const seleccionarMunicipio = async () => {    
        setTipoBusqueda("Municipio");        
    };

    const seleccionarCiudad = async () => {    
        setTipoBusqueda("Ciudad");        
    };

    /* let valoresOrigen = {
        id: uuid.v4(),
        direccion: "Suipacha 299, C1008 AAE, Buenos Aires",
        place_id: "origen",
        latitud: -34.60507995881085,
        longitud: -58.37930905921315                                            
    };

    let valoresDestino = {
        id: uuid.v4(),
        direccion: "Raúl Scalabrini Ortiz 2410, C1425 CABA",
        place_id: "destino",
        latitud: -34.58576434203723, 
        longitud: -58.417297916622644
    }; */

    const workPlace = {
        description: 'Work',
        geometry: { location: { lat: -34.58576434203723, lng: -58.417297916622644 } },
    };
      

    const [direccionOrigenGuardada, setDireccionOrigenGuardada] = useState();
    const [direccionDestinoGuardada, setDireccionDestinoGuardada] = useState();
    
    const [direccionOrigen, setDireccionOrigen] = useState();
    const [direccionDestino, setDireccionDestino] = useState();
    //const [paisTaxi, setPaisTaxi] = useState("AR");
    //const [googleMapActivado, setGoogleMapActivado] = useState(false);
    /*
    
    useEffect(() => {
        BuscarAhora();
    }, [direccionOrigen, direccionDestino]);

    */    

    useEffect(() => {
        (async () => {
            if (!isFocused){return;}

            //console.log("parametros.valor");
            //console.log(parametros.valor);

            //console.log("parametros.valor.personalizarprecio?");
            //console.log(parametros.valor);

            console.log("route.params?.direccionGuardada?.id ");
            console.log(route.params?.direccionGuardada?.id);

            if (route.params?.direccionGuardada?.id){
                console.log("here22");
                console.log(route.params);
                console.log(route.params?.tipo);
                if (route.params?.tipo=="direccionorigen"){
                    console.log("here2a");
                    setDireccionActual(false);
                    setDireccionOrigenGuardada(route.params?.direccionGuardada);

                    let valoresDireccionOrigen = {
                        id: uuid.v4(),
                        direccion: route.params?.direccionGuardada?.usuariodireccion_dirmapa,
                        place_id: 0,
                        latitud: route.params?.direccionGuardada?.latitud,
                        longitud: route.params?.direccionGuardada?.longitud,
                        direccionGuardada: route.params?.direccionGuardada
                    };
                    setDireccionOrigen(valoresDireccionOrigen);
                    setDatosObligatoriosOrigen(false);
                }             
                if (route.params?.tipo=="direcciondestino"){
                    setDireccionDestinoGuardada(route.params?.direccionGuardada);

                    let valoresDireccionDestino = {
                        id: uuid.v4(),
                        direccion: route.params?.direccionGuardada?.usuariodireccion_dirmapa,
                        place_id: 0,
                        latitud: route.params?.direccionGuardada?.latitud,
                        longitud: route.params?.direccionGuardada?.longitud,
                        direccionGuardada: route.params?.direccionGuardada                                         
                    };
                    setDireccionDestino(valoresDireccionDestino);
                    setDatosObligatoriosDestino(false);
                }             
            }else{
                
                setDireccionOrigen(false);
                setDireccionOrigenGuardada(false);
                setDatosObligatoriosOrigen(false);
                setDireccionDestino(false);
                setDatosObligatoriosDestino(false);
            }

            
            //console.log("here9");
            if (!route.params?.direccionGuardada){
                console.log("here10");
                await solicitarPermisosUbicacion();
            }
            

            if (usuario.tokenRegistro){

                setIsLoading(true);

                // Verifico si tiene viajes ya en curso
                const resp = await axios.post(APP_URLAPI+'taxiviajesencurso',
                {          
                    token: usuario.tokenRegistro,
                    compania: COMPANIA_ID
                });        
                            
                if (resp.data.code==0){//
                    ////console.log(usuario.tokenRegistro);
                    ////console.log(COMPANIA_ID);
                    ////console.log("taxiviajesencurso");
                    ////console.log(resp.data.data);
                    let items = resp.data.data.items.length;
                    if (items>0){
                        let item = resp.data.data.items[0];
                        /*
                        if (item.estatuscod == "6") {
                            //////console.log("here6");
                            navigation.navigate({
                                name: 'TieneViajeEnCurso',
                                params: { item: item},
                                merge: true,
                            });
                        } else if (item.estatuscod == "2") {
                            //////console.log("here2");
                            navigation.navigate({
                                name: 'TieneViajeEnCurso',
                                params: { item: item},
                                merge: true,
                            });
                        } 
                        */
                    }
                    //setViajeEnCurso(resp.data.data);
                }else if (resp.data.code==103 || resp.data.code==104){
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{
                    //////console.log(resp.data);
                }

                //////console.log("taxiviajesencurso:");
                //////console.log(resp.data);

                //////////console.log("itemtipoServicio:")
                //////////console.log(route?.params?.item)

                //solicitarPermisosUbicacion();
            }
            //////////console.log(direccionOrigen.direccion);
            
            //////////console.log("direccionOrigen:");
            //////////console.log(direccionOrigen.direccion);
            
            ref.current?.setAddressText(direccionOrigen.direccion);
            //////////console.log(33);

            // Consultar la información del pedido a enviar
            setInfoPedido(route?.params?.info?.id);
            console.log("route?.params?.info");
            console.log(route?.params?.info?.id);

            // infoPedido

            //console.log("route?.params?.info?.id?.infoenvio?.origen?.usuariodireccion_dirmapa");
            //console.log(route?.params?.info?.id?.infoenvio?.origen?.usuariodireccion_dirmapa);

            if (route?.params?.info?.id?.infoenvio?.origen?.usuariodireccion_dirmapa){

                console.log("here4");
                setDireccionActual(false);

                let valoresOrigen2 = {
                    id: uuid.v4(),
                    direccion: route?.params?.info?.id?.infoenvio?.origen?.usuariodireccion_dirmapa,
                    latitud: route?.params?.info?.id?.infoenvio?.origen?.latitud,
                    longitud: route?.params?.info?.id?.infoenvio?.origen?.longitud,
                    desdebuscador: 0
                };
                setDireccionOrigen(valoresOrigen2);


                let valoresDestino2 = {
                    id: uuid.v4(),
                    direccion: route?.params?.info?.id?.infoenvio?.destino?.usuariodireccion_dirmapa,
                    latitud: route?.params?.info?.id?.infoenvio?.destino?.latitud,
                    longitud: route?.params?.info?.id?.infoenvio?.destino?.longitud,
                    desdebuscador: 0
                };
                setDireccionDestino(valoresDestino2);

                console.log("route?.params?.info?.idd  ");
                console.log(route?.params?.info?.id?.trans_montoenvio); 

                setTarifaUsuario(route?.params?.info?.id?.trans_montoenvio_sinmoneda); 
            }
           
        
            setIsLoading(false);
        })();
    }, [isFocused]);

    // isFocused  route?.params?.item 

    const BuscarAhora = async () => {

        try {

            
            console.log("direccionOrigen");
            console.log(direccionOrigen);

            /*

            console.log("direccionDestino");
            console.log(direccionDestino);

            console.log("direccionOrigenGuardada");
            console.log(direccionOrigenGuardada);

            console.log("direccionDestinoGuardada");
            console.log(direccionDestinoGuardada);
            */
            

            //return false;

            if (COMPANIA_ID==380){

                if (tipoBusqueda=="Municipio"){ // Es opcional el Destino

                }else{
                    if (!direccionDestino){ 
                        Toast.show({
                            type: 'error',
                            text1: 'Por favor seleccione el destino'
                        });
                        return false;                        
                    }else{
                        Toast.show({
                            type: 'error',
                            text1: 'Por favor seleccione el destino'
                        });
                        return false;
                    }
                }

            }else{
                if (!direccionOrigen){
                    Toast.show({
                        type: 'error',
                        text1: 'Por favor seleccione el origen'
                    });
                    return false;
                }

                if (!direccionDestino){
                    Toast.show({
                        type: 'error',
                        text1: 'Por favor seleccione el destino'
                    });
                    return false;
                }
            }

            if (!direccionOrigen){
                Toast.show({
                    type: 'error',
                    text1: 'Por favor seleccione el origen'
                });
                return false;
            }else{
                setDatosObligatoriosOrigen(false);
            }


            if (COMPANIA_ID==388 && !tarifaUsuario){
                Toast.show({
                    type: 'error',
                    text1: 'Por favor introduzca la tarifa'
                });
                return false;                
            }

            // Se verifica que el destino sea obligatorio
            /*
            if (COMPANIA_ID!=380){
                if (!direccionDestino){
                    setDatosObligatoriosDestino(true);
                }else{
                    setDatosObligatoriosDestino(false);
                }
            }
            */
          

            setIsLoadingBuscar(true);
         
            // if (direccionOrigen && direccionDestino){
            if (direccionOrigen){

                let direcciondestino = direccionOrigen.direccion;
                let latituddestino = direccionOrigen.latitud;
                let longituddestino = direccionOrigen.longitud;

                if (direccionDestino){
                    direcciondestino = direccionDestino.direccion;
                    latituddestino = direccionDestino.latitud;
                    longituddestino = direccionDestino.longitud;  
                }

                let today = new Date();
                var date = String(today.getDate()).padStart(2, '0');
                var month = String(today.getMonth() + 1).padStart(2, '0');
                var year = today.getFullYear(); 
    
                var hours = String(today.getHours()).padStart(2, '0');
                var min = String(today.getMinutes()).padStart(2, '0');
                var sec = String(today.getSeconds()).padStart(2, '0');
                let dateCompleta = date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec;


    
                let valores = {
                    origen: direccionOrigen.direccion,
                    latitudorigen: parseFloat(direccionOrigen.latitud),
                    longitudorigen: parseFloat(direccionOrigen.longitud),
                    direccionorigen: direccionOrigen,
                    destino: direcciondestino,
                    latituddestino: parseFloat(latituddestino),
                    longituddestino: parseFloat(longituddestino),
                    direcciondestino: direccionDestino,
                    fecha: dateCompleta,
                    tiposervicio: route?.params?.item.codigo,
                    tipozona: tipoBusqueda
                };


/*
                //console.log("antes:");
                //console.log(valores);

                setIsLoadingBuscar(false);
            setIsLoading(false);
                return true;
*/
                let urlenviar = "";
    
                if (route?.params?.item.codigo=="1" || route?.params?.item.codigo=="2"){     
                    urlenviar = "ViajeSolicitarObservaciones";               
                    //urlenviar = "ViajeSolicitar";
                }else{
                    urlenviar = "ViajeSolicitarObservaciones";
                    //urlenviar = "ViajeSolicitar";
                }

                if (COMPANIA_ID==380){
                    if (direccionDestino){
                        //urlenviar = "ViajeSolicitarObservaciones";
                        urlenviar = "ViajeSolicitar";
                    }else{
                        urlenviar = "ViajeSolicitar";
                    }
                    
                }

                setIsLoadingBuscar(false);

                console.log("origen3:");
                console.log(valores?.origen);

                console.log("direccionOrigen:");
                console.log(direccionOrigen);

                if (!direccionOrigen){
                    Toast.show({
                        type: 'error',
                        text1: 'Por favor seleccione el origen'
                    });
                    return false;
                }

                if (!direccionDestino){
                    Toast.show({
                        type: 'error',
                        text1: 'Por favor seleccione el destino'
                    });
                    return false;
                }

                
                
                navigation.navigate(urlenviar, 
                {
                    item: uuid.v4(),
                    valores: valores,
                    tiposervicio: route?.params?.item,
                    tarifaUsuario: tarifaUsuario,
                    envioTexto: envioTexto,    
                    montoArticuloEnvio: montoArticuloEnvio,                        
                    infoPedido: infoPedido
                })
                
                
                
            }

            setIsLoadingBuscar(false);
          
        } catch (err) {        
            console.error(err);
            setIsLoadingBuscar(false);
            setIsLoading(false);
        }
    };

    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>  
    <>
    <View style={styles.container}>  

    
        <View style={{backgroundColor: "#FFFFFF", paddingVertical: 20, paddingTop: 10, marginBottom:20, width: "100%"}}>
            {
                infoPedido?.infoenvio?.origen?.usuariodireccion_dirmapa ? 
                <View style={{justifyContent: "center", alignItems: "center", marginVertical: 0, marginHorizontal: 20 }}>
                    <View style={{backgroundColor: "#C8F2ED",  borderColor: "#168E12", borderRadius: 5, width: "100%", padding: 20, margin: 20, marginTop: 10}}>
                        <Text style={{color: "#095D53", fontSize: 14, textAlign: "center"}}>Datos rellenados automaticamente del pedido</Text>
                    </View>                
                </View>
                : null
            }
            
            {
            isLoading ?
                <>
                    <ActivityIndicator size="large" color="black" style={{marginTop: 0, marginBottom: 0}} />                    
                </>
            :null
            }
            {
                parametros.valor.buscadorGoogle != "1" && isLoading==false ? 
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Contacto')}  
                    style={{textAlign: "center", marginTop: 5, margin: 12,
                    borderRadius: 10, justifyContent: "center"}}>
                    <Text style={{fontSize: 15, textAlign: "center"}}>
                        Actualmente por pruebas se posee colocado dirección de origen y destino fijas. Si desea hacer una prueba con direcciones colocadas por favor contáctanos. Ver datos de contacto.
                    </Text>
                </TouchableOpacity>
                
                :
                isLoading==true ? null  
                :
                <>

                {
                    COMPANIA_ID==380 ? 
                    <>
                    <View style={{flexDirection: "row", paddingLeft: 5, paddingBottom: 5}}>  
                        <Text style={{fontSize: 14}}>
                            ¿En donde te encuentras?
                        </Text>
                    </View>
                    <View style={{flexDirection: "row", paddingLeft: 5, paddingBottom: 5}}> 
                        <View style={{paddingLeft: 5, paddingBottom: 5, width: "45%"}}>                          
                            <TouchableOpacity 
                                onPress={seleccionarMunicipio}
                                style={{textAlign: "center", marginTop: 5, margin: 12,
                                borderWidth: 1, borderColor: "#000000", borderRadius: 10, justifyContent: "center"}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: tipoBusqueda=="Municipio" ? "#000000" : "#FFFFFF" ,
                                    }} 
                                >                                                                     
                                    <Text 
                                        style={tipoBusqueda=="Municipio" ? styles.buttonTextSeleccionado : styles.buttonTextSinSeleccionar}>{' '}
                                        Municipio
                                    </Text>                                            
                                </View>
                            </TouchableOpacity>
                        </View> 
                        <View style={{paddingLeft: 5, paddingBottom: 5, width: "45%"}}>                          
                            <TouchableOpacity 
                                onPress={seleccionarCiudad}
                                style={{textAlign: "center", marginTop: 5, margin: 12,
                                borderWidth: 1, borderColor: "#000000", borderRadius: 10, justifyContent: "center"}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: tipoBusqueda=="Municipio" ? "#FFFFFF" : "#000000" ,
                                    }} 
                                >                                                                     
                                    <Text 
                                        style={tipoBusqueda=="Municipio" ? styles.buttonTextSinSeleccionar : styles.buttonTextSeleccionado}>{' '}
                                        Ciudad
                                    </Text>                                            
                                </View>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                    </>
                    : null
                }
                <View style={{marginTop: 0, paddingTop: 0, paddingHorizontal: 20}}>                    
                    <View style={{textAlign: "left",  paddingBottom: 10, marginTop: 0}}>
                        <Text style={{fontSize: 16, textAlign: "left", fontWeight: "700"}}>
                            Origen: 
                            {/* {
                                direccionActual?.direccion ? 
                                ' (Dirección actual)'
                                : null
                            } */}
                             <TouchableOpacity  
                                onPress={() => {
                                    navigation.navigate({
                                        name: 'Direcciones',
                                        params: { 
                                            origin: "viajebuscar",
                                            tipo: "direccionorigen",
                                            item: route?.params?.item
                                        },
                                        merge: true,
                                    });
                                }} 
                                style={{textAlign: "center", justifyContent:"center", alignContent: "center"}}
                            >
                                <Icon size={25} name="book" color={COLORBOTONPRINCIPAL} style={{width: 30,textAlign: "center"}} />
                            </TouchableOpacity>
                        </Text>                    
                    </View>                     
                </View>
                <View style={{flexDirection: "row", marginHorizontal: 20}}>                    
                    
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
                            direccionOrigenGuardada?.usuariodireccion_dirmapa ? direccionOrigenGuardada?.usuariodireccion_dirmapa:
                            direccionActual?.direccion ? direccionActual?.direccion :
                            infoPedido?.infoenvio?.origen?.usuariodireccion_dirmapa ? infoPedido?.infoenvio?.origen?.usuariodireccion_dirmapa :
                            route?.params?.item?.placeholderorigen
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

               
                {
                    route.params?.item?.codigo == "5" ?
                    <View style={{marginTop: 0, paddingTop: 20, paddingHorizontal: 20, paddingLeft: 16}}>                    
                    <TextInput
                        label="¿Cuéntanos que envías o recibes?"
                        onChangeText={setEnvioTexto}
                        value={envioTexto}
                        placeholder={"Ej: ropa, calzados"}
                        style={styles.inputConLabel}
                        mode="outlined"
                        outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                        textColor="#3A3A3A"                        
                    />
                    </View>
                    : null
                }

                {
                    COMPANIA_ID == 388 && route.params?.item?.codigo == "5" ? 
                    <View style={{marginTop: 0, paddingTop: 20, paddingHorizontal: 20, paddingLeft: 16}}>                                           
                        <TextInput
                            label={"Monto a pagar por el artículo "}
                            editable={!route?.params?.info?.id?.trans_montoenvio_sinmoneda? true : false} 
                            selectTextOnFocus={!route?.params?.info?.id?.trans_montoenvio_sinmoneda? true : false} 
                            keyboardType = 'numeric'
                            onChangeText={setMontoArticuloEnvio}
                            value={montoArticuloEnvio}
                            placeholder={"Introduzca el monto"}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"
                        />
                    </View>
                    : null
                }
                
                <View style={{marginTop: 20, paddingTop: 0, paddingHorizontal: 20}}>                    
                    <View style={{textAlign: "left",  paddingBottom: 10, marginTop: 0}}>
                        <Text style={{fontSize: 16, textAlign: "left", fontWeight: "700"}}>
                            Destino: 
                             <TouchableOpacity  
                                onPress={() => {
                                    navigation.navigate({
                                        name: 'Direcciones',
                                        params: { 
                                            origin: "viajebuscar",
                                            tipo: "direcciondestino",
                                            item: route?.params?.item
                                        },
                                        merge: true,
                                    });
                                }} 
                                style={{textAlign: "center", justifyContent:"center", alignContent: "center"}}
                            >
                                <Icon size={25} name="book" color={"#1C8F0A"} style={{width: 30,textAlign: "center"}} />
                            </TouchableOpacity>
                        </Text>                    
                    </View>                     
                </View>
                <View style={{flexDirection: "row", marginHorizontal: 20}}>                    
                    
                    <GooglePlacesAutocomplete
                        minLength={4}
                        
                        placeholder={
                            direccionDestinoGuardada?.usuariodireccion_dirmapa ? direccionDestinoGuardada?.usuariodireccion_dirmapa :
                            infoPedido?.infoenvio?.destino?.usuariodireccion_dirmapa ? infoPedido?.infoenvio?.destino?.usuariodireccion_dirmapa :                            
                            route?.params?.item?.placeholderdestino                            
                        }
                        onPress={(data, details = null) => {
                            // 'details' is provided when fetchDetails = true
                            //////////console.log(data, details);
                            //////////console.log(details.geometry);
                            let valoresDestino = {
                                id: uuid.v4(),
                                direccion: data.description,
                                place_id: data.place_id,
                                latitud: details.geometry.location.lat,
                                longitud: details.geometry.location.lng,                                            
                            };
                            setDireccionDestino(valoresDestino)
                            setDatosObligatoriosDestino(false);
                            //////////console.log(direccionDestino);
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
                            color: '#5d5d5d',
                            fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                            color: '#1faadb',
                            },
                        }}
                    />
                    {/* {
                        DatosObligatoriosDestino ?
                        <View>
                            <Text style={{color: "#B00F0F"}}>
                                Destino es obligatorio
                            </Text>
                        </View>
                        : null
                    } */}
                
                    
                </View> 
                                
            </>
            }

            {
                isLoading==true ? null :
                <>
                {
                    parametros.valor.personalizarprecio =="1" ? 
                    <>
                    <View style={{marginTop: 0, paddingTop: 20, paddingHorizontal: 20, paddingLeft: 16}}>                    
                        <TextInput
                            label={
                                !route?.params?.info?.id?.trans_montoenvio_sinmoneda ? 
                                'Tarifa que deseas pagar'
                                : 
                                'Tarifa pagada en el envío'
                            }
                            editable={!route?.params?.info?.id?.trans_montoenvio_sinmoneda? true : false} 
                            selectTextOnFocus={!route?.params?.info?.id?.trans_montoenvio_sinmoneda? true : false} 
                            keyboardType = 'numeric'
                            onChangeText={setTarifaUsuario}
                            value={tarifaUsuario}
                            placeholder={"Introduzca la tarifa"}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"
                        />
                    </View>                    
                    </>
                    : null
                }
                


                <View style={{justifyContent: "center", alignItems:"center", marginTop: 0, paddingTop: 30}}>                    
                    <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10, marginTop: 0}}>
                        <Text style={{fontSize: 16, textAlign: "center"}}>
                            {route?.params?.item?.descripcion}
                        </Text>                    
                    </View>  
                </View>
                <View style={{width: "100%"}}>
                    <TouchableOpacity 
                        onPress={BuscarAhora}
                        style={{textAlign: "center", marginTop: 5, margin: 12,
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
                                isLoadingBuscar ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Solicitar ahora"
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
                        style={{resizeMode: 'contain', height: 100, width: 150}}
                    />                      
                </View>   
                </>
            }            
            
        </View>
    </View>
    </>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    inputConLabel : {
        borderColor: "#D3D3D0", borderRadius: 5, textAlign: "left", paddingVertical: 0, backgroundColor: "#FFFFFF", color:"#D3D3D0"
    },
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
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

export default ViajeBuscar 