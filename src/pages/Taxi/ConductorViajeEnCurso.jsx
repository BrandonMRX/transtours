import React, { useRef, useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { ScrollView } from "react-native-gesture-handler";

import MapView, { Marker } from 'react-native-maps';
//import * as TaskManager from 'expo-task-manager'; 
//import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import MapConductor from "../../components/MapConductor";

import { Skeleton } from '@rneui/themed';

import { useIsFocused, useFocusEffect} from "@react-navigation/native";

import { solicitarPermisosUbicacion } from '../../components/Ubicacion/Ubicacion';
import ListDetalleItem from "../../components/ListDetalleItem";

let intervalIdViajeEnCurso_Conductor;
let valorAfueraAvanzar= 0;
let varYaBuscado= 0;
let latitudconductor = 0;

const ConductorViajeEnCurso = ({navigation, route}) => {

    const usuario = useSelector(state => state.usuario)
    const parametros = useSelector(state => state.parametros)

    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [viajeEnCurso, setViajeEnCurso] = useState(false);
    //const [yaBuscado, setYaBuscado] = useState(0);
    const [actualAvanzar, setActualAvanzar] = useState(0);

    const solicitarGeo = async () => { 
        
        ////console.log("ConductorViajeEnCurso solicitarGeo: ");
        // Guardar Ubicación Actual
        let respuesta = await solicitarPermisosUbicacion(usuario);

        if (respuesta){
            ////console.log("si");
            consultarViajeEnCurso("tiempo");
        }
        

    }

    const getCurrentDate=()=>{

        var fechacompleta = new Date();
    
        var fecha = fechacompleta.toLocaleDateString();
        var fechahora = fechacompleta.toLocaleTimeString();
        
        let mes = fecha.substring(0,2);
        let dia = fecha.substring(3,5);
        let ano = fecha.substring(6,8);
    
        let fechareturn = "20"+ano+"-"+mes+"-"+dia+" "+fechahora;
    
        return fechareturn;
    }

    const StartIntervalConductor=()=>{

        if (parametros.valor.tiempoRealMapa=="1"){

            ////console.log("en StartIntervalConductor");
            intervalIdViajeEnCurso_Conductor=setInterval(() => {

                ////console.log("avanzarhere");

                let fecha = getCurrentDate();
                ////console.log("fecha4:"+ fecha);                
                solicitarGeo();

                /*
                ////console.log("actualAvanzar:"+actualAvanzar);
                if (actualAvanzar>0 && actualAvanzar<5){   
                    ////console.log("cada 10 segundos entra aqui intervalIdViajeEnCurso_Conductor entre 1 y 5");
                    
                    Avanzar();
                    valorAfueraAvanzar = valorAfueraAvanzar + 1;
                    ////console.log("valorAfueraAvanzar1:"+valorAfueraAvanzar);
                }
                else if (actualAvanzar==0){   
                    ////console.log("entra aqui inicial coloco 1");
                    //////console.log("aqui:"+actualAvanzar);
                    valorAfueraAvanzar = 1;
                    ////console.log("valorAfueraAvanzar2:"+valorAfueraAvanzar);
                    setActualAvanzar(1);
                }
                else{
                    ////console.log("para");
                    ////console.log("valorAfueraAvanzar3:"+valorAfueraAvanzar);
                    StopIntervalConductor();
                }
                */
                
            }, parametros.valor.miliSegundosTiempoRealMapa);
        } 
    }

    const StopIntervalConductor=()=>{
        clearInterval(intervalIdViajeEnCurso_Conductor);
    }

    useEffect(() => {
        return () => {
            clearInterval(intervalIdViajeEnCurso_Conductor);
        }
    }, [])

    const consultarViajeEnCurso = async (tipo) => { 
        if (usuario.tokenRegistro){

            if (navigation.isFocused()==false) {
                ////console.log("paro proque no esta focused");
                StopIntervalConductor();
                return false;
            }

            if (tipo!="tiempo"){
                setIsLoading(true);
            }            

            const resp = await axios.post(APP_URLAPI+'taxiviajeencurso',
            {          
                token: usuario.tokenRegistro,
                trans: route.params?.item.transid, 
                compania: COMPANIA_ID, 
            });     
            
            console.log('taxiviajeencurso2  en conductorviajeencurso3: ')
            console.log(resp.data)
 
            /*
            
            */
            // 
                    
            if (resp.data.code==0){

               /*  ////console.log("latitudconductor");
                ////console.log(latitudconductor);

                ////console.log("resp.data.data.latitudconductor");
                ////console.log(resp.data.data.latitudconductor);
 */
                /* if (latitudconductor!=resp.data.data.latitudconductor){
                    ////console.log("actualiza");
                    
                } */

                setViajeEnCurso(resp.data.data);
                //latitudconductor = resp.data.data.latitudconductor;
                
                if (resp.data.data.estatuscod=="2"){ // Esperando al conductor
                    if (varYaBuscado==0){ // Unica vez para que ejecute una unica vez el intervalo
                        //setViajeEnCurso(resp.data.data);
                        varYaBuscado = 1;
                        StartIntervalConductor();
                    }
                    ////console.log("aquien2");
                    
                    //Avanzar();
                }
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                //////////console.log(resp.data);
            }

            if (tipo!="tiempo"){
                setIsLoading(false);
            }
            
        }
    }

    // parametros.valor.tiempoRealMapa == "1"

    useEffect(() => {
        (async () => {            
            if (navigation.isFocused()==false) {
                ////console.log("paro proque no esta focused");
                StopIntervalConductor();
                return false;
            }else{
                consultarViajeEnCurso();
            }             
        })();
    }, [route.params?.item]);

    const FinalizarViaje = async () => {
        try {

            //////console.log('taxiconductorfinalizarviaje');
            //////console.log(route.params?.item);
            //return false;


            setIsLoading(true);
            
            const resp = await axios.post(APP_URLAPI+'taxiconductorfinalizarviaje',
              {          
                token: usuario.tokenRegistro,
                transnotif: viajeEnCurso?.idnotif,
                compania: COMPANIA_ID
              }
            );

            console.log('taxiconductorfinalizarviaje');
            console.log(resp.data);
            
            
            if (resp.data.code==0){// Finalizado correctamente   
                
                if (resp.data.data.finalizado==1){                         
                    //navigation.navigate('ConductorViajes')
                    navigation.navigate('ConductorViajeFinalizado',{item: route.params?.item});
                }else{
                    setIsLoading(false);                    
                }
                
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                setIsLoading(false);
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
    };


    
    const Avanzar = async () => {
        try {
        
            let colocar = actualAvanzar + 1
            setActualAvanzar(colocar);
            ////console.log("avanzar: "+colocar);
            //////console.log("viajeencursoactual");
            //////console.log(viajeEnCurso);

            let latitudconductor = 0;
            let longitudconductor = 0;
            
            /*
            latitudconductor = -34.66229475807609;
            longitudconductor = -58.36484379724813;

            setViajeEnCurso({
                ...viajeEnCurso, 
                latitudconductor: latitudconductor,
                longitudconductor: longitudconductor,                     
                avanzar: colocar 
            });
            */
            

            if (colocar==1){
                latitudconductor = -34.659124787008835;
                longitudconductor = -58.36868253214307;

                setViajeEnCurso({
                    ...viajeEnCurso, 
                    latitudconductor: latitudconductor,
                    longitudconductor: longitudconductor,                     
                    avanzar: colocar 
                });
            }
            else if (colocar==2){
                latitudconductor = -34.66021057815307;
                longitudconductor = -58.367195591362005;

                setViajeEnCurso({
                    ...viajeEnCurso, 
                    latitudconductor: latitudconductor,
                    longitudconductor: longitudconductor,                     
                    avanzar: colocar 
                });
            }
            else if (colocar==3){
                latitudconductor = -34.66229475807609;
                longitudconductor = -58.36484379724813;

                setViajeEnCurso({
                    ...viajeEnCurso, 
                    latitudconductor: latitudconductor,
                    longitudconductor: longitudconductor,                     
                    avanzar: colocar 
                });
            }

            

            //StopIntervalConductor();
            


        } catch (err) {        
            console.error(err);
        }
    };

    const Reiniciar = async () => {
        try {        
            setActualAvanzar(0);            
        } catch (err) {        
            console.error(err);
        }
    };

    const ChatUsuario = async () => {
        try {

            navigation.navigate('ChatDetalle',{
                usuarioid: viajeEnCurso?.usuarioidpasajero,
                titulousuario: 'Pasajero',
                elementoid: viajeEnCurso?.idnotif,
                item: route?.params.item
            });
        } catch (err) {        
            console.error(err);
        }
    };

    const ComenzarViaje = async () => {
        try {
            setIsLoading(true);
            
            const resp = await axios.post(APP_URLAPI+'taxiconductorcomienzaviaje',
              {          
                token: usuario.tokenRegistro,
                transnotif: viajeEnCurso?.idnotif,
                compania: COMPANIA_ID
              }
            );

            ////console.log("taxiconductorcomienzaviaje:");
            //////console.log(resp.data);
            
            if (resp.data.code==0){// Comienzo el viaje correctamente   
                
                if (resp.data.data.comienzo==1){ 
                    ConsultarViaje();                   
                    //navigation.navigate('ViajeDetalle')
                }else{
                    setIsLoading(false);                    
                }
                
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                setIsLoading(false);
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
    };

    const NotificarLlegadaOrigen = async () => {
        try {
            setIsLoading(true);
            
            const resp = await axios.post(APP_URLAPI+'taxiconductorllegaalorigen',
              {          
                token: usuario.tokenRegistro,
                transnotif: viajeEnCurso?.idnotif,
                compania: COMPANIA_ID
              }
            );

            ////console.log("taxiconductorllegaalorigen:");
            ////console.log(resp.data);
            
            if (resp.data.code==0){// Comienzo el viaje correctamente   
                
                if (resp.data.data.esperandoenorigen==1){ 
                    ConsultarViaje();                   
                    //navigation.navigate('ViajeDetalle')
                }else{
                    setIsLoading(false);                    
                }
                
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                setIsLoading(false);
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
    };
    
    const CancelarViaje = async () => {
        try {
            //////////console.log(viajeEnCurso.id);
            setIsLoading(true);
            
            const resp = await axios.post(APP_URLAPI+'taxiconductorcancelarviaje',
              {          
                token: usuario.tokenRegistro,
                transnotif: viajeEnCurso?.idnotif,
                compania: COMPANIA_ID
              }
            );

            console.log("taxiconductorcancelarviaje");
            console.log(resp.data); 
            
            if (resp.data.code==0){// Cancelada correctamente      
                      
                setIsLoading(false);
                navigation.navigate('ConductorViajes')
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                setIsLoading(false);
            }

        } catch (err) {     
            console.error("err");   
            console.error(err);
            setIsLoading(false);
        }
    };

    const ConsultarViaje = async () => {
        try {
            
            const resp = await axios.post(APP_URLAPI+'taxiviajeencurso',
            {          
                token: usuario.tokenRegistro,
                trans: route.params?.item.transid,
                compania: COMPANIA_ID
            });        
            
           
            console.log("taxiviajeencursoo");
            console.log(resp.data.data);
            if (resp.data.code==0){// 
                setViajeEnCurso(resp.data.data);
                setIsLoading(false);
  
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                //////////console.log(resp.data);
                setIsLoading(false);
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
    };

    
    const abrirMapaRuta = async (tipomapa) => {

        let latitud = viajeEnCurso.latituddestino;
        let longitud = viajeEnCurso.longituddestino;

        if (viajeEnCurso.estatuscod=="2" || viajeEnCurso.estatuscod=="8"){
            latitud = viajeEnCurso.latitudorigen;
            longitud = viajeEnCurso.longitudorigen;
        }

        let link ="google.navigation:q="+latitud+"+"+longitud+"";
        if (tipomapa=="googlemaps"){
            link ="google.navigation:q="+latitud+"+"+longitud+"";
        }else if (tipomapa=="waze"){
            link ='waze://?ll='+latitud+','+longitud+'&navigate=yes';
        }
        
        Linking.canOpenURL(link)
          .then(supported => {
            if (!supported) {
             Alert.alert(
               'Por favor instale la aplicación de '+tipomapa +' para poder navegar'
             );
           } else {
             return Linking.openURL(link);
           }
         })
         .catch(err => console.error('An error occurred', err));       
    };

    const VerPerfil = async (idusuario) => {        
        navigation.navigate('PerfilPasajero',{
            usuarioid: idusuario
        });      
    };

    const openPhone = async (phoneValue) => {
        
        let link = "tel:"+phoneValue;
        Linking.canOpenURL(link)
        .then(supported => {
            if (!supported) {
            Alert.alert(
            'Por favor instale alguna aplicacion de telefono'
            );
        } else {
            return Linking.openURL(link);
        }
        })
        .catch(err => console.error('An error occurred', err));
    
    };

    
    const sendWhatsAppMessage = async (whatsappValue) => {

        let whatsapp = whatsappValue;
        let link = "https://api.whatsapp.com/send?phone="+whatsapp;
        Linking.canOpenURL(link)
        .then(supported => {
            if (!supported) {
            Alert.alert(
            'Por favor instale la aplicación de WhatsApp'
            );
        } else {
            return Linking.openURL(link);
        }
        })
        .catch(err => console.error('An error occurred', err));
   
    };


    return (
    <View style={{backgroundColor: "#FFFFFF"}}>

        <View style={{height: "45%"}}> 
            <MapConductor valores={viajeEnCurso} />
        </View>
        {
            isLoading ? 
            <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
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
            <ScrollView style={{height:"55%"}}>  
                {/* <View style={{width: "100%"}}>
                    <TouchableOpacity 
                        onPress={Avanzar}
                        style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                        <View
                            style={{
                                ...styles.button,
                                backgroundColor: COLORBOTONPRINCIPAL,
                            }} 
                        >      
                            <Icon size={20} name="check" color={"#FFFFFF"}  />                        
                            <Text 
                                style={styles.buttonText}>
                                {' '} Avanzar
                            </Text>                            
                        </View>
                    </TouchableOpacity>  
                    <TouchableOpacity 
                        onPress={Reiniciar}
                        style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                        <View
                            style={{
                                ...styles.button,
                                backgroundColor: COLORBOTONPRINCIPAL,
                            }} 
                        >      
                            <Icon size={20} name="check" color={"#FFFFFF"}  />                        
                            <Text 
                                style={styles.buttonText}>
                                {' '} Reiniciar a 0
                            </Text>                            
                        </View>
                    </TouchableOpacity>                       
                </View> */}
                <View style={{backgroundColor: "#FFFFFF"}}>            
                    <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 10}}>
                    {
                        viajeEnCurso?.estatuscod == "2" ?
                        <View style={{marginBottom: 10}}>
                            <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                            Llegarás a buscar al { viajeEnCurso?.transenvio_id ? ' el envío ' : ' al pasajero' } en 
                            </Text>
                            <Text style={{color: "#343434", fontWeight: "bold", paddingLeft: 5, fontSize: 22, textAlign: "center"}}>
                                {viajeEnCurso?.duracion}
                            </Text>
                        </View> 
                        : 
                        viajeEnCurso?.estatuscod == "8" ?
                        <View style={{marginBottom: 10}}>
                            <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                                Ya estás esperando { viajeEnCurso?.transenvio_id ? ' el envío ' : ' al pasajero' }, en cuanto llegue comienza el viaje
                            </Text>                            
                        </View> 
                        :
                        <>
                        <View style={{marginBottom: 10}}>
                            <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                                El viaje está en curso. Llegarás al destino en {viajeEnCurso.duracionconductorcondestino}
                            </Text> 
                        </View> 
                        </>
                    }                                                
                        
                        <View style= {{marginRight: 20, paddingLeft: 10, flexDirection: "row", marginTop: 5}}>
                            <View style={{ flex: 1, width: "40%"}}>
                                <TouchableOpacity 
                                            onPress={() => VerPerfil(viajeEnCurso?.usuarioidpasajero)}   
                                    >
                                    <Image 
                                        style={{height: 100, width: "100%", resizeMode: 'contain'}}
                                        source={{
                                            uri: viajeEnCurso?.imagenpasajero
                                        }}                    
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, width: "58%"}}>
                                <TouchableOpacity 
                                        onPress={() => VerPerfil(viajeEnCurso.usuarioidpasajero)}   
                                >
                                    <Text style={{textAlign: "left", fontSize: 20, fontWeight: "bold"}}>
                                        {viajeEnCurso?.cliente}
                                    </Text>
                                </TouchableOpacity>

                                {
                                    viajeEnCurso?.clientewhatsapp ? 
                                    <TouchableOpacity 
                                        onPress={() => sendWhatsAppMessage(viajeEnCurso?.clientewhatsapp)}
                                    >
                                        <Text style={{textAlign: "left", fontSize: 16, marginTop: 5}}>
                                            <Icon size={18} name="whatsapp" color={COLORBOTONPRINCIPAL}  /> {viajeEnCurso?.clientewhatsapp}
                                        </Text>   
                                    </TouchableOpacity> 
                                    :
                                    null                            
                                }                                
                                <TouchableOpacity 
                                    onPress={ChatUsuario}
                                    style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                                    <View>    
                                        <Icon size={30} name="comments" color={COLORBOTONPRINCIPAL}  />                     
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{flexDirection: "row", marginTop: 10, borderRadius: 15, marginHorizontal: 30}}>
                            <View style={{borderRadius: 15, width: "50%", alignItems: "center"}}>
                                <TouchableOpacity  
                                    onPress={() => abrirMapaRuta('googlemaps')}   
                                >                                    
                                    <View>

                                        <Image 
                                            style={{height: 80, width: 80, resizeMode: 'contain'}}
                                            source={require('../../../assets/img/googlemaps.png')}
                                        />               
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{width: "50%", alignItems: "center"}}>
                                <TouchableOpacity  
                                    onPress={() => abrirMapaRuta('waze')}   
                                >
                                    <View>
                                        <Image 
                                            style={{height: 90, width: 130, resizeMode: 'contain'}}
                                            source={require('../../../assets/img/waze.jpg')}
                                        />               
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                        
{/*                         <ListDetalleItem titulo={'estatuscod'}  valor={viajeEnCurso?.estatuscod}  />
 */}
                        <ListDetalleItem titulo={'Origen'}  valor={viajeEnCurso?.origen}  />

                        <ListDetalleItem titulo={'Referencia'}  valor={viajeEnCurso?.origenobservacion} paddingLeft={15} fontWeight="normal" />

                        <ListDetalleItem titulo={'Contacto'}  valor={viajeEnCurso?.origencontacto} paddingLeft={15}  fontWeight="normal" />

                        <ListDetalleItem titulo={'Teléfono'}  valor={viajeEnCurso?.origentelf} paddingLeft={15}   fontWeight="normal"  phone={true}/>


                        <ListDetalleItem titulo={'Destino'}  valor={viajeEnCurso?.destino}  />

                        <ListDetalleItem titulo={'Referencia'}  valor={viajeEnCurso?.destinoobservacion} paddingLeft={15}  fontWeight="normal"/>

                        <ListDetalleItem titulo={'Contacto'}  valor={viajeEnCurso?.destinocontacto} paddingLeft={15} fontWeight="normal" />

                        <ListDetalleItem titulo={'Teléfono'}  valor={viajeEnCurso?.destinotelf} paddingLeft={15} fontWeight="normal" phone={true} />

                        <ListDetalleItem titulo={'Tipo de viaje'}  valor={viajeEnCurso?.tipotarifa}  />

                        <ListDetalleItem titulo={viajeEnCurso?.montoarticuloorig ? 'Que se debe comprar' : 'Que se envía'}  valor={viajeEnCurso?.observacionenvio}  /> 


                        {
                        COMPANIA_ID != "398" ? 
                        <>
                        <ListDetalleItem titulo={'Forma de pago'}  valor={viajeEnCurso?.formapago}  />

                        <ListDetalleItem titulo={"Precio de viaje total"}  valor={viajeEnCurso?.monto}  />

                        <ListDetalleItem titulo={'Monto del artículo a comprar'}  valor={viajeEnCurso?.montoarticulo}  />

                        {
                            viajeEnCurso?.monto != viajeEnCurso?.montoservicio ?
                            <ListDetalleItem titulo={"Monto del servicio"}  valor={viajeEnCurso?.montoservicio}   />
                            : null
                        }
                                            
                        <ListDetalleItem titulo={"Ganancia del conductor"}  valor={viajeEnCurso?.montoproveedor}  paddingLeft={20} fontWeight={"normal"} />

                        <ListDetalleItem titulo={"Ganancia del solicitante"}  valor={viajeEnCurso?.montoproveedorppal} paddingLeft={20} fontWeight={"normal"} />

                        <ListDetalleItem titulo={"Comisión de la plataforma"}  valor={viajeEnCurso?.montoplataforma} paddingLeft={20} fontWeight={"normal"} />
                        </>
                        : null
                        }
                        

                        
                                            
                    </View>  
                </View>
                
                <View style={{backgroundColor: "#FFFFFF"}}>             
                    {
                    viajeEnCurso?.estatuscod == "2" ? //Esperando al conductor"
                    <View style={{width: "100%"}}> 
                        <TouchableOpacity 
                            onPress={NotificarLlegadaOrigen}
                            style={{textAlign: "center", marginTop: 5, margin: 12,
                            borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: COLORBOTONPRINCIPAL,
                                }} 
                            >   
                                <Icon size={20} name="paper-plane" color={"#FFFFFF"}  />
                                <Text 
                                    style={styles.buttonText}>
                                    {' '} Notificar Llegada
                                </Text>                            
                            </View>
                        </TouchableOpacity>
                    </View> 
                    :
                    viajeEnCurso?.estatuscod == "8" ? //Conductor llego donde el pasajero
                    <View style={{width: "100%"}}>
                        <TouchableOpacity 
                            onPress={ComenzarViaje}
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
                                    {' '} Comenzar Viaje
                                </Text>                            
                            </View>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{width: "100%"}}>
                        <TouchableOpacity 
                            onPress={FinalizarViaje}
                            style={{textAlign: "center", marginTop: 5, margin: 12,
                            borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: COLORBOTONPRINCIPAL,
                                }} 
                            >    
                                <Icon size={20} name="flag-checkered" color={"#FFFFFF"}  />
                                <Text 
                                    style={styles.buttonText}>
                                    {' '} Finalizar Viaje
                                </Text>                            
                            </View>
                        </TouchableOpacity>
                    </View> 
                    } 
                    
                    <View style={{width: "100%"}}>
                        <TouchableOpacity 
                            onPress={CancelarViaje}
                            style={{textAlign: "center", marginTop: 5, margin: 12,
                            borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: "#A70B0B",
                                }} 
                            >          
                                <Icon size={20} name="ban" color={"#FFFFFF"}  />
                                <Text 
                                    style={styles.buttonText}>
                                    {' '} Cancelar viaje
                                </Text>                            
                            </View>
                        </TouchableOpacity>
                    </View>


                </View>
            </ScrollView>
        }
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

export default ConductorViajeEnCurso 