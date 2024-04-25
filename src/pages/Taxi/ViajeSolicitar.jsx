import React, { createRef, useRef, useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { ScrollView } from "react-native-gesture-handler";

import MapView, { Marker } from 'react-native-maps';
//import * as TaskManager from 'expo-task-manager'; 
//import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';

import Mapa from "../../components/Mapa";
import Toast from 'react-native-toast-message';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import ListDetalleItem from "../../components/ListDetalleItem";


const ViajeSolicitar = ({navigation, route}) => {

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Panel')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    );
 */

    const [urlConfirmar, setUrlConfirmar] = useState("SolicitarIngresar");
    
    const isFocused = useIsFocused();
    const [listaTaxi, setListaTaxi] = useState([]);

    const [isLoadingFormaPago, setIsLoadingFormaPago] = useState(true);
    const [formasPago, setFormasPago] = useState([]);
    const parametros = useSelector(state => state.parametros)
    const usuario = useSelector(state => state.usuario)

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [tarifaUsuario, setTarifaUsuario] = useState(null);
    const [envioTexto, setEnvioTexto] = useState("");
    const [montoArticuloEnvio, setMontoArticuloEnvio] = useState("");
    
    const [infoPedido, setInfoPedido] = useState(false);

    const GOOGLE_MAPS_APIKEY = 'AIzaSyCcrtNyclS_0eHH6YQrD6E-x4mH5TCnNyo';

    //const mapEl = useRef(null);

    const mapView = useRef();


    async function fitMapDirecciones(result) {

        ////////console.log("fitMapDirecciones");
        //////////console.log(result.coordinates[0]);
        /*
        this.mapView.animateToRegion({
            latitude: 40.730610,
            longitude: -73.935242,
            latitudeDelta: 0.026,
            longitudeDelta: 0.027,
          }, 2000)
*/
        /*

        
*/

        let coordenadas = [
            {
                latitude: -34.60507995881085,
                longitude: -58.37930905921315                                            
            },
            {               
                latitude: -34.58576434203723, 
                longitude: -58.417297916622644
            }
        ];

        ////////console.log("coordenadas");
        ////////console.log(coordenadas);

        //////////console.log(result.coordinates);

        mapRef.current.fitToCoordinates(result.coordinates, {
            edgePadding: {
                top: 50,
                right: 0,
                bottom: 0,
                left: 0,
            },
        }); 

    
      //let distancia = result.distance.toFixed(0);
      //let duration = result.duration.toFixed(0);

      //setMapDistancia(distancia);
      //setMapDuracion(duration);

      //////////console.log("fit");
      //////////console.log(`Distance: ${distancia} km`)
      //////////console.log(`Duration: ${duration} min.`)
    }

    useEffect(() => {
        (async () => {

        if (!isFocused){return;}

            //console.log("taxiparametros");
        //console.log(taxi);

        //console.log(66);
        //console.log(formasPago);
        //console.log("isLoadingFormaPago");
        //console.log(isLoadingFormaPago);
        //console.log("route.params?.valores");
        //console.log(route.params?.valores);

        setIsLoadingFormaPago(false);
        
        if (route.params?.tarifaUsuario!="") {
            setTarifaUsuario(route.params?.tarifaUsuario);
        }

        if (route.params?.envioTexto!="") {
            setEnvioTexto(route.params?.envioTexto);
        }

        if (route.params?.montoArticuloEnvio!="") {
            setMontoArticuloEnvio(route.params?.montoArticuloEnvio);
        }

        

        if (route.params?.infoPedido!="") {
            setInfoPedido(route.params?.infoPedido);
        }

        console.log("route.params?.infoPedido");
        console.log(route.params?.infoPedido);

        
        
        
        if (route.params?.valores && usuario.tokenRegistro!="") {

            setUrlConfirmar("ViajeSolicitarConfirmar");

            /* if (route.params?.valores.tiposervicio=="1" || route.params?.valores.tiposervicio=="2"){
                //////console.log("aqui12");
                setUrlConfirmar("ViajeSolicitarConfirmar");
            }else{
                //////console.log("aqui3");
                setUrlConfirmar("ViajeSolicitarObservaciones");
            }
            //////console.log("route.params?.valores1111:");
            //////console.log(route.params?.valores);
             */

            if (route.params?.formaPago !=""){

                try {
                        
                        
                    const resp = await axios.post(APP_URLAPI+'formapago',
                        {          
                            token: usuario.tokenRegistro,
                            tipo: "1", // para cliente pagar,
                            unico: "1", // para que muestre uno solo,
                            id: route.params?.formaPago,
                            compania: COMPANIA_ID
                        }
                    );

                    //console.log("formasPago?.id:");
                    //console.log(formasPago?.id);

                    //console.log("formas de pago:");
                    //console.log(resp.data.data);
            
                    if (resp.data.code==0){//
                        setFormasPago(resp.data.data);
                        setIsLoadingFormaPago(false);
                    }else if (resp.data.code==103 || resp.data.code==104){
                        navigation.navigate({name: 'Ingreso'})
                        return false;          
                    }else{
                        setIsLoadingFormaPago(false);
                    }
                    
                    setIsLoadingFormaPago(false);
                    //setIsLoading(false);
            
                } catch (err) {        
                    console.error(err);
                    setIsLoadingFormaPago(false);
                    //setIsLoading(false);
                }
                
            }else{
                setUrlConfirmar("SolicitarIngresar");
            }

        }

        ////console.log("route.params");
        ////console.log(route.params);
        })();
    }, [route.params?.valores, isFocused]);

    useEffect(() => {
        (async () => {

            if (!isFocused){return;}

            console.log(77);
            console.log("route.params?.valores");
            console.log(route.params?.valores);

            if (route.params?.valores?.origen){ 
 
                console.log(78);

                setIsLoadingFormaPago(true);

                try {  

                    
                    const resp = await axios.post(APP_URLAPI+'taxitarifa',
                    {          
                        token: usuario.tokenRegistro,
                        origenlatitud: route.params?.valores?.latitudorigen,
                        origenlongitud: route.params?.valores?.longitudorigen,
                        origendireccion: route.params?.valores?.origen,
                        destinolatitud: route.params?.valores?.latituddestino,
                        destinolongitud: route.params?.valores?.longituddestino,
                        destinodireccion: route.params?.valores?.destino,
                        origenobservacion: route.params?.observaciones?.observacionesOrigen,
                        destinoobservacion: route.params?.observaciones?.observacionesDestino,
                        
                        contactoNombreOrigen: route.params?.observaciones?.contactoNombreOrigen,
                        contactoTelfOrigen: route.params?.observaciones?.contactoTelfOrigen,
                        contactoNombreDestino: route.params?.observaciones?.contactoNombreDestino,
                        contactoTelfDestino: route.params?.observaciones?.contactoTelfDestino,

                        tiposervicio: route.params?.valores?.tiposervicio,
                        tarifaUsuario: route.params?.tarifaUsuario,
                        envioTexto: route.params?.envioTexto,
                        montoArticuloEnvio: route.params?.montoArticuloEnvio, 
                        tipozona: route.params?.valores?.tipozona,
                        trans_id: route.params?.infoPedido?.trans_id,                        
                        compania: COMPANIA_ID 
                    });       

                    console.log("route.params?montoArticuloEnvio:");
                    console.log(route.params?.montoArticuloEnvio);

                    //console.log("usuario.tokenRegistro:");
                    //console.log(usuario.tokenRegistro);
                    
                    //console.log("tipozona:");
                    //console.log(route.params?.valores?.tipozona);
                    
                    console.log("taxitarifaa :");
                    console.log(resp.data);

                    //console.log("COMPANIA_ID:");
                    //console.log(COMPANIA_ID);

                    if (resp.data.code==0){//
                        console.log("here23:");
                        setListaTaxi(resp.data.data);
                        
                    }else if (resp.data.code==103 || resp.data.code==104){
                        navigation.navigate({name: 'Ingreso'})
                        return false;          
                    }else{
                        console.log(resp.data);
                    }
                } catch (err) {        
                    ////////console.log("error:");
                    console.error(err);
                    //setIsLoading(false);
                }
                

                //console.log("formapago params:");
                //console.log(route.params?.formaPago);

                try {
                    
                    
                    const resp = await axios.post(APP_URLAPI+'formapago',
                        {          
                            token: usuario.tokenRegistro,
                            tipo: "1", // para cliente pagar,
                            unico: "1", // para que muestre uno solo,
                            id: route.params?.formaPago,
                            compania: COMPANIA_ID
                        }
                    );

                    ////console.log("formas de pago:");
                    ////console.log(resp.data.data);
            
                    if (resp.data.code==0){//
                        setFormasPago(resp.data.data);
                        ////////console.log(resp.data.data);
                        setIsLoadingFormaPago(false);
                    }else if (resp.data.code==103 || resp.data.code==104){
                        navigation.navigate({name: 'Ingreso'})
                        return false;          
                    }else{
                        //////////console.log(resp.data);
                    }
                     
                    setIsLoadingFormaPago(false);    
                    //setIsLoading(false); 
            
                } catch (err) {        
                    console.error(err);
                    setIsLoadingFormaPago(false);
                    //setIsLoading(false);
                }
            }
            
            
            
            /*
            let { status } = await  Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                //setErrorMsg('Permission to access location was denied');
                verificarPermisosUbicacion();
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            let response = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });

            let address ="";
        
            for (let item of response) {
              address = `${item.street}, ${item.name}, ${item.postalCode}, ${item.city}, ${item.country}`;
        
              //////////console.log(address);
            }
            
            
            //////////console.log(location);

            */
            
            //var direccionLatitud1 = taxi.valores[0]?.direccionOrigen?.latitud
            //var direccionLongitude1 = taxi.valores[0]?.direccionOrigen?.longitud       
            /*
            var direccionLatitud1 = -34.596913161150106
            var direccionLongitude1 = -58.38132409400794      
            */
            //setLatitude(direccionLatitud1);
            //setLongitude(direccionLongitude1);
                
         /*    setMarkerDestino(
              <>
                <Marker 
                  coordinate={{latitude: direccionLatitud1, longitude: direccionLongitude1 }} 
                  title='Direccion 1' 
                  icon={require('../../assets/img/mapuser.png')} >
                </Marker>
                <Marker 
                  coordinate={{latitude: direccionLatitud2, longitude: direccionLongitude2 }} 
                  title='Direccion 2' 
                  icon={require('../../assets/img/mapuser.png')} >
                </Marker>
            
            </>
            );
             */
            let mapRegion = {
                latitude: route.params?.valores?.latitudorigen,
                longitude: route.params?.valores?.longitudorigen,
                latitudeDelta: .01,
                longitudeDelta: .01}
        
            setMapRegion(mapRegion) 
            
            //verificarPermisosUbicacion(address) 
        
        })();
    }, [route.params?.valores]);

    
    const [mapRegion, setMapRegion] = useState({
        latitude: -34.60313205933178,
        longitude: -58.381858886557384,
        latitudeDelta: .01,
        longitudeDelta: .01,
      });
    
      

      /*
      const direccionLatitud1 = -34.605161487730946
      const direccionLongitude1 = -58.37853459662709       
      
      const direccionLatitud2 = -34.5733577
      const direccionLongitude2 = -58.456035
      */
     
      //const [latitude, setLatitude] = useState(-34.603190670898094);
      //const [longitude, setLongitude] = useState(-58.38077534676842);
      //const [latitudeDelta, setLatitudeDelta] = useState(.01);
      //const [longitudeDelta, setLongitudeDelta] = useState(.01);
      /*
      const [markerOrigen, setMarkerOrigen] = useState(null);
      const [markerDestino, setMarkerDestino] = useState(null);
      const [mapDirections, setMapDirections] = useState(null);
      const [mapDistancia, setMapDistancia] = useState(null);
      const [mapDuracion, setMapDuracion] = useState(null);
        
      const [markerDirecciones, setMarkerDirecciones] = useState(null);
      */

      const solicitarViaje = async (item) => {

        console.log("en solicitarViaje");
        //console.log(usuario.tokenRegistro);

        if (usuario.tokenRegistro=="" || !usuario.tokenRegistro){
            setUrlConfirmar("SolicitarIngresar");
                navigation.navigate({
                name: "SolicitarIngresar",               
                merge: true,
            });
            return false;
        }

        ////////console.log(item);
        ////////console.log("formasPago");
        ////////console.log(formasPago);

        let montoDisponible = 0;
        let montoDisponibleMostrar = "";

        let formaPagoNombre = "";
        formasPago.forEach((el)=>{
            formaPagoNombre = el.formapago
            ////////console.log(el);
        })

        ////////console.log(formaPagoNombre);

        if (formaPagoNombre=="Saldo Disponible" && !infoPedido?.trans_id){

            if (usuario.tokenRegistro){
                const resp = await axios.post(APP_URLAPI+'balance',
                    {          
                        token: usuario.tokenRegistro,
                        compania: COMPANIA_ID
                    }
                );

                if (resp.data.code==0){//
                    montoDisponible = resp.data.data.saldo_disponibleoriginal;
                    //montoDisponible = 1;

                    montoDisponibleMostrar = resp.data.data.saldo_disponible;
                }else if (resp.data.code==103 || resp.data.code==104){
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{
                    ////////console.log(1);
                    ////////console.log(resp.data);
                }     
                
                
                if (montoDisponible<tarifaUsuario && tarifaUsuario>0){
                    Toast.show({
                        type: 'error',
                        text1: 'No tienes saldo suficiente'
                    });
                    return false;
                }
                else if (montoDisponible<item.preciooriginal){
                    Toast.show({
                        type: 'error',
                        text1: 'No tienes saldo suficiente'
                    });
                    return false;
                }
            }
        }

        navigation.navigate({
            name: urlConfirmar,
            params: { 
                item: item,
                formapago: formasPago,
                tiposervicio: route?.params?.tiposervicio,
                observaciones: route?.params?.observaciones,
                tarifaUsuario: route?.params?.tarifaUsuario,
                envioTexto: route?.params?.envioTexto,
                montoArticuloEnvio: route?.params?.montoArticuloEnvio,                
                infoPedido: route?.params?.infoPedido,                
            },
            merge: true,
        });
        
        
        
        
        
    }

    const [modal, setModal] = useState(false);

    const handleOpen = async () => {
        //////console.log("en handleOpen");
        setModal(true);
    }

    const handleClose = async () => {
        //////console.log("en handleClose");
        setModal(false);
    }

    const handleBalance = async () => {
        //////console.log("en handleBalance");
        setModal(false);
        navigation.navigate({name: 'Balance'});
        
    }

    

    const alertaModal = async () => {
        //////console.log("en alertaModal");
    }

    return (
    <View style={{backgroundColor: "#FFFFFF", height: "100%", marginBottom: 50}}>
    <ScrollView>
            <View style={{height: 220}}> 
                <Mapa valores={route.params?.valores} />              
            </View>
            {
                !route.params?.montoArticuloEnvio || route.params?.montoArticuloEnvio==0 ? null :
                <View style={{justifyContent: "center", alignItems: "center", marginVertical: 0, marginHorizontal: 20 }}>
                    <View style={{backgroundColor: "#C8F2ED",  borderColor: "#168E12", borderRadius: 5, width: "100%", padding: 20, margin: 10}}>
                        <Text style={{color: "#095D53", fontSize: 14, textAlign: "center"}}>En la tarifa está incluido el precio del artículo a comprar</Text>
                    </View>                
                </View>
            }
            <View style={{backgroundColor: "#FFFFFF"}}> 
            {
                listaTaxi ?
                listaTaxi.map(item =>   
                <TouchableOpacity  
                    key={item.transcalc}   
                    onPress={() => {
                        solicitarViaje(item);                        
                    }}                 
                    >
                    <View style={{flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 5, paddingVertical: 4, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                        <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10}}>
                            <Image 
                                style={{height: 80, width: "100%", resizeMode: 'contain'}}
                                source={{
                                    uri: item.imagen
                                }}                    
                            />
                        </View>
                        <View style={{width: "50%", paddingTop: 10}}>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"bold"}}>
                                {item.tipotarifa} 
                            </Text>
                            <Text style={{fontSize: 14, justifyContent: "center", textAlignVertical: "center", paddingTop: 5,fontWeight:"500"}}>
                                {parseInt(parametros?.valor?.distancia)} kms
                            </Text>
                        </View>
                        {
                            COMPANIA_ID == "398888" ? null
                            :
                            <View style={{width: "30%", justifyContent: "center", paddingLeft: 10}}>
                                <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", fontWeight:"bold"}}>
                                    {
                                        infoPedido?.trans_montoenvio ? infoPedido?.trans_montoenvio : 
                                        item.precio
                                    }                                
                                </Text>
                            </View> 
                        }
                                                   
                    </View>  
                </TouchableOpacity>                               
                )
                : 
                isLoadingFormaPago == false && listaTaxi?.length==0 ?
                <>
                <View style={{justifyContent: "center", alignItems: "center", marginVertical: 0, marginHorizontal: 20 }}>
                    <View style={{backgroundColor: "#C8F2ED",  borderColor: "#168E12", borderRadius: 5, width: "100%", padding: 20, margin: 20}}>
                        <Text style={{color: "#095D53", fontSize: 14, textAlign: "center"}}>No existen tarifas cargadas para este servicio</Text>
                    </View>                
                </View>
                </> : null
            }                    
            </View>


            
            <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 10, marginTop: 13}}>  

                <ListDetalleItem titulo={"Origen"}  valor={route.params?.valores?.origen}  />

                <ListDetalleItem titulo={"Referencia"}  valor={route.params?.observaciones?.observacionesOrigen}  />

                <ListDetalleItem titulo={"Destino"}  valor={route.params?.valores?.destino}  />

                <ListDetalleItem titulo={"Referencia"}  valor={route.params?.observaciones?.observacionesDestino}  />                               
                            

            </View>
    </ScrollView>
    </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
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
        height: 80,
        margin: 4,
        borderColor: "#EDEDED", 
        borderWidth: 1, 
        borderRadius: 15, 
        paddingHorizontal: 5,
        paddingVertical: 5,
        paddingTop: 10,
        marginLeft: 10
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
    },
    imgServicio: {
        height: 150, 
        width: 150,
        resizeMode: 'contain'
    },
});

export default ViajeSolicitar
