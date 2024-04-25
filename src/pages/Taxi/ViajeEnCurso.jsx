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
import Mapa from "../../components/Mapa";
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import ListDetalleItem from "../../components/ListDetalleItem";

let intervalIdViajeEnCurso;

const ViajeEnCurso = ({navigation, route}) => {

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
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [viajeEnCurso, setViajeEnCurso] = useState([]);
    const usuario = useSelector(state => state.usuario)
    const parametros = useSelector(state => state.parametros)

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

    const StartInterval=()=>{
        intervalIdViajeEnCurso=setInterval(() => {

            let fecha = getCurrentDate();
            ////console.log("fecha5:"+ fecha);                
                
            buscarCambioEstatusViaje();           
        }, parametros.valor.miliSegundosTiempoRealMapa);
    }
    

    const StopInterval=()=>{
        clearInterval(intervalIdViajeEnCurso);
    }

    useEffect(() => {
        return () => {
            clearInterval(intervalIdViajeEnCurso);
        }
    }, [])

    useEffect(() => {
        if (route.params?.item) {
            ////////console.log("ViajeEnCurso:");
            ////////console.log(route.params.item);
        }      
    }, [route.params?.item]);

    const VerPerfil = async (idusuario) => {        
        navigation.navigate('PerfilConductor',{
            usuarioid: idusuario
        });      
    };

    const ObtenerViajeEnCurso = async () => {
        try {
            
            if (usuario.tokenRegistro){
                const resp = await axios.post(APP_URLAPI+'taxiviajeencurso',
                {          
                    token: usuario.tokenRegistro,
                    trans: route.params?.item.transid,
                    compania: COMPANIA_ID
                });        

                ////console.log("en ObtenerViajeEnCurso");
                ////console.log(resp.data);
            
                if (resp.data.code==0){//

                    if (resp.data.data.estatuscod=="4"){
                        clearInterval(intervalIdViajeEnCurso);
                        navigation.navigate('ViajeDetalle',{item: route.params?.item});
                    }else{
                        setViajeEnCurso(resp.data.data);
                        clearInterval(intervalIdViajeEnCurso);
                        StartInterval();
                    }

                }else if (resp.data.code==103 || resp.data.code==104){
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{
                    ////////console.log(resp.data);
                    navigation.navigate('ViajeDetalle',{item: route.params?.item});
                }
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            ObtenerViajeEnCurso();        
        })();
    }, [route.params?.item]);

    const CancelarViajePasajero = async () => {
        try {
            ////////console.log(viajeEnCurso.id);
            setIsLoading(true);
            
            const resp = await axios.post(APP_URLAPI+'taxicancelarviaje',
              {          
                token: usuario.tokenRegistro,
                trans: viajeEnCurso?.transid,
                compania: COMPANIA_ID
              }
            );

            console.log('taxicancelarviaje');
            console.log(resp.data);
            
            if (resp.data.code==0){// Cancelada correctamente         
                setIsLoading(false);
                navigation.navigate('Panel')
            }else if (resp.data.code==103 || resp.data.code==104){
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

    const buscarCambioEstatusViaje = async () => {

        try {

            if (navigation.isFocused()==false) {
                ////console.log("paro8:");
                StopInterval();
                return false;
            }

            ////console.log("estatus actual:");
            ////console.log(viajeEnCurso?.estatuscod);
            ////console.log(route.params?.item.transid);

            /* if (viajeEnCurso?.estatuscod=="2"){ // Esperando al conductor
                const resp = await axios.post(APP_URLAPI+'taxipasajeroviajecomenzado',
                    {          
                        token: usuario.tokenRegistro,
                        trans: route.params?.item.transid,
                        compania: COMPANIA_ID
                    }
                );

                ////console.log("taxipasajeroviajecomenzado:");
                ////console.log(resp.data);
             
                if (resp.data.code==0){// Respuesta correcta
                    if (resp.data.data.enviaje==1){// Comenzo el viaje
                        // Actualiza a la misma de viaje en curso pero coloca que esta en viaje
                        //StopInterval();
                        ObtenerViajeEnCurso();
                        //setSegundosIntervalo(20000000);
                        //navigation.navigate('ViajeEnCurso',{item: route.params?.item});
                        //navigation.navigate('ViajeEnCurso')
                    }else{
                        //setBuscandoConductor(true);
                    }                        
                }   
            }
            else if (viajeEnCurso?.estatuscod=="8"){ // Conductor llego donde el pasajero
                const resp = await axios.post(APP_URLAPI+'taxipasajeroviajecomenzado',
                    {          
                        token: usuario.tokenRegistro,
                        trans: route.params?.item.transid,
                        compania: COMPANIA_ID
                    }
                );

                ////console.log("taxipasajeroviajecomenzado:");
                ////console.log(resp.data);
             
                if (resp.data.code==0){// Respuesta correcta
                    if (resp.data.data.enviaje==1){// Comenzo el viaje
                        // Actualiza a la misma de viaje en curso pero coloca que esta en viaje
                        //StopInterval();
                        ObtenerViajeEnCurso();
                        //setSegundosIntervalo(20000000);
                        //navigation.navigate('ViajeEnCurso',{item: route.params?.item});
                        //navigation.navigate('ViajeEnCurso')
                    }else{
                        //setBuscandoConductor(true);
                    }                        
                }   
            }
            else if (viajeEnCurso?.estatuscod=="3"){ // En viaje
                const resp = await axios.post(APP_URLAPI+'taxipasajeroviajeporfinalizado',
                    {          
                        token: usuario.tokenRegistro,
                        trans: route.params?.item.transid,
                        compania: COMPANIA_ID
                    }
                );

                ////console.log("taxipasajeroviajeporfinalizado:");
                ////console.log(resp.data);
             
                if (resp.data.code==0){// Respuesta correcta
                    if (resp.data.data.finalizado==1){// Finalizo el viaje
                        // Para el sincronizador que busca y reenvia a viaje detalle
                        StopInterval();
                        //ObtenerViajeEnCurso();
                        //setSegundosIntervalo(20000000);
                        navigation.navigate('ViajeDetalle',{item: route.params?.item});
                        //navigation.navigate('ViajeEnCurso')
                    }else{
                        //setBuscandoConductor(true);
                    }                        
                }   
            } */

            ObtenerViajeEnCurso();

             
        
        
        } catch (err) {        
            console.error("error taxipasajeroviajeporfinalizado:");
            console.error(err);
            setIsLoading(false);
        }
    };

    const ChatUsuario = async () => {
        try {

            navigation.navigate('ChatDetalle',{
                usuarioid: viajeEnCurso?.usuarioidconductor,
                titulousuario: 'Conductor',
                elementoid: viajeEnCurso?.idnotif,
                item: route?.params.item
            });
        } catch (err) {        
            console.error(err);
        }
    };
    
    return (
    <View style={{backgroundColor: "#FFFFFF"}}>

        <View style={{height: "40%"}}> 
            <Mapa valores={viajeEnCurso} />
        </View>
        <ScrollView>  
            <View style={{backgroundColor: "#FFFFFF", marginBottom: 80}}>            
                <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 20, marginBottom:20}}>
                    {
                        viajeEnCurso?.estatuscod == "2" ? // Esperando al conductor
                        <>
                            <View style={{marginBottom: 5}}>
                                <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                                    Tu conductor está en camino a buscarte
                                </Text>                         
                            </View>  
                            {
                                viajeEnCurso?.duracion !="" && viajeEnCurso?.duracion !="0" && viajeEnCurso?.duracion !="0 minutos" ?
                                <View style={{marginBottom: 10}}>
                                    <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                                        Llegará en {viajeEnCurso?.duracion} 
                                    </Text>                         
                                </View> :
                                null
                            }
                        </> 
                        : null
                    }

                    {
                        viajeEnCurso?.estatuscod == "8" ? // Conductor llego donde el pasajero	
                        <>
                            <View style={{marginBottom: 5}}>
                                <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                                    El conductor ya llegó a buscarte, te está esperando.
                                </Text>                         
                            </View>                              
                        </> 
                        : null
                    }

                    {
                        viajeEnCurso?.estatuscod == "3" ? // En Viaje
                        <>
                            <View style={{marginBottom: 5}}>
                                <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 18, textAlign: "center"}}>
                                    Estás en viaje
                                </Text>                         
                            </View>                              
                        </> 
                        : null
                    }
                                      
                    <View style= {{marginRight: 20, paddingLeft: 10, flexDirection: "row", marginTop: 5}}>
                        <View style={{ flex: 1, width: "40%"}}>
                            <TouchableOpacity 
                                onPress={() => VerPerfil(viajeEnCurso?.usuarioidconductor)}   
                            >
                                <Image 
                                    style={{height: 100, width: "100%", resizeMode: 'contain'}}
                                    source={{
                                        uri: viajeEnCurso?.imagen
                                    }}                    
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1, width: "58%"}}>
                            <TouchableOpacity 
                                    onPress={() => VerPerfil(viajeEnCurso?.usuarioidconductor)}   
                                >
                                <Text style={{textAlign: "left", fontSize: 20, fontWeight: "bold"}}>
                                    {viajeEnCurso?.conductor}    
                                </Text>
                            </TouchableOpacity>

                            <Text style={{textAlign: "left", fontSize: 16}}>
                                {viajeEnCurso?.vehiculo}    
                            </Text>
                            <Text style={{textAlign: "left", fontSize: 16}}>
                                {viajeEnCurso?.patente}    
                            </Text>
                            <TouchableOpacity 
                                onPress={ChatUsuario}
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                                <View>    
                                    <Icon size={30} name="comments" color={COLORBOTONPRINCIPAL}  />                    
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ListDetalleItem titulo={"Origen"}  valor={viajeEnCurso?.origen}  />

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
                    
                    {
                        viajeEnCurso?.estatuscod != "3" ?
                        <View style={{marginBottom: 40, marginTop: 20}}>
                            <TouchableOpacity 
                                onPress={CancelarViajePasajero}
                                style={{textAlign: "center", borderRadius: 10, marginHorizontal: 10, justifyContent: "center"}}>
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
                        : null
                    }
                                                     
                </View> 
                <View style={{width: "100%", height: 180}}>                
                    
                </View> 
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

export default ViajeEnCurso 