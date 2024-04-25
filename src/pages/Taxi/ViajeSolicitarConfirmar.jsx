import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, BackHandler, Modal, Pressable } from 'react-native'
import { TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL } from '@env'

import { ScrollView } from "react-native-gesture-handler";
import { Formik } from 'formik'
import * as Yup from 'yup';
import { floor } from "react-native-reanimated";
import uuid from 'react-native-uuid';
import axios from 'axios';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

import { Skeleton } from '@rneui/themed';
import ListDetalleItem from "../../components/ListDetalleItem";


let intervalId;

const ViajeSolicitarConfirmar = ({navigation, route}) => {

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Panel')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const [modalVisible, setModalVisible] = useState(false);

    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCancelar, setIsLoadingCancelar] = useState(false);
    const [isLoadingGuardarTarifa, setIsLoadingGuardarTarifa] = useState(false);
    const [segundosIntervalo, setSegundosIntervalo] = useState(20000);
    const [totalConductoresNotificados, setConductoresNotificados] = useState(false);
    const [notifConductores, setNotifConductores] = useState([]);
    const parametros = useSelector(state => state.parametros)
    const [viajeEnCurso, setViajeEnCurso] = useState([]);
    const [tarifaUsuario, setTarifaUsuario] = useState(null);

    const StartInterval=()=>{
        intervalId=setInterval(() => {
            buscarConductor();           
        }, 10000);
    }

    const StopInterval=()=>{
        clearInterval(intervalId);
    }

    useEffect(() => {
        return () => {
            clearInterval(intervalId);
        }
    }, [])

    useEffect(() => {

        console.log("ViajeSolicitarConfirmar");
        console.log(route?.params);

        setIsLoading(false);

        if (route.params?.tarifaUsuario!="") {
            setTarifaUsuario(route.params?.tarifaUsuario);
        }
        
        if (usuario.tokenRegistro && route.params?.item.transid){
            ConfirmarViaje(route.params?.item);
        }

    }, [route.params?.item]);
    // 

    const buscarConductor = async () => {

        try {

            if (navigation.isFocused()==false) {
                StopInterval();
                return false;
            }

            const resp = await axios.post(APP_URLAPI+'taxipasajeroviajeporaceptar',
                {          
                    token: usuario.tokenRegistro,
                    trans: route.params?.item.transid,
                    compania: COMPANIA_ID
                }
            );

            ////console.log("taxipasajeroviajeporaceptar");
            ////console.log(resp.data);
             
            if (resp.data.code==0){// Respuesta correcta
                if (resp.data.data.aceptado==1){// Aceptado por el Conductor
                    // Reenvia a otra pantalla de viaje en curso
                    StopInterval();
                    //setSegundosIntervalo(20000000);
                    navigation.navigate('ViajeEnCurso',{item: route.params?.item});
                    //navigation.navigate('ViajeEnCurso')
                }else{
                    //setBuscandoConductor(true);
                }                        
            } else if (resp.data.code==103 || resp.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }   
        
        
        } catch (err) {        
            console.error("error viajesolicitarconfirmar:");
            console.error(err);
            setIsLoading(false);
        }
    };

    const ConfirmarViaje = async (valores) => {
        try {
            let formaPagoId = 0;
            route.params?.formapago?.forEach((el)=>{
                formaPagoId = el.id
            })

            let observacionesorigen = "";
            let observacionesdestino = "";

            if (route.params?.item?.observaciones?.observacionesOrigen!=""){
                observacionesorigen = route.params?.item?.observaciones?.observacionesOrigen
            }

            if (route.params?.item?.observaciones?.observacionesDestino!=""){
                observacionesdestino = route.params?.item?.observaciones?.observacionesDestino
            }
            
            setIsLoading(true);

            ////console.log("taxitarifaconfirmarantes");

            const urlserver = APP_URLAPI

            //console.log("taxitarifaconfirmar empieza");
            //console.log("usuario.tokenRegistro:"+usuario.tokenRegistro);
            //console.log("route.params?.item.transid:"+route.params?.item.transid);
            //console.log("route.params?.item.transcalc:"+route.params?.item.transcalc);
            //console.log("observacionesorigen:"+observacionesorigen);
            //console.log("observacionesdestino:"+observacionesdestino);
            //console.log("formaPagoId:"+formaPagoId);
            //console.log("COMPANIA_ID:"+COMPANIA_ID);

            //return false;

            const resp3 = await axios.post(urlserver+'taxitarifaconfirmar',
              {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID,
                trans: route.params?.item.transid,
                tarifa: route.params?.item.transcalc, 
                origenobservacion: observacionesorigen,
                destinoobservacion: observacionesdestino,               
                formapago: formaPagoId,
                tarifaUsuario: route.params?.tarifaUsuario,
                trans_idpedido: route.params?.infoPedido?.trans_id,
                distancia: parametros?.valor?.distancia
              }
            );

            console.log("route.params?.item.transcalc ");
            console.log(route.params?.item.transcalc);

            console.log("taxitarifaconfirmarr ");
            console.log(resp3.data);

            //console.log("route.params");
            //console.log(route.params);
            
            if (resp3.data.code==0){// Solicitada correctamente
                setConductoresNotificados(resp3.data.data.totalnotificados);
                setNotifConductores(resp3.data.data.conductores);
                setIsLoading(false);

                console.log("setConductoresNotificados");
                console.log(resp3.data.data.totalnotificados);
                /*
                if (resp3.data.data.totalnotificados==0){ // No Hay Conductores Disponibles

                }
                */

                ////////console.log("aqui true");

                StartInterval();
                 ////////console.log(usuario);

                //setBuscandoConductor(true);
            }else if (resp3.data.code==103 || resp3.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                //////console.log("aqui false");
                setIsLoading(false);
                //navigation.navigate('Panel');
                //setBuscandoConductor(false);
            }

            ////////console.log("resp3.data");
            ////////console.log(resp3.data); 


            //return false;

            const resp = await axios.post(urlserver+'taxiviajeporconfirmar',
            {          
                token: usuario.tokenRegistro,
                trans: route.params?.item.transid,                
                compania: COMPANIA_ID
            });       
            
            console.log("taxiviajeporconfirmar "); 
            console.log(resp.data);
 
            if (resp.data.code==0){//
                setViajeEnCurso(resp.data.data);

            }else if (resp.data.code==103 || resp.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                //////////console.log(resp.data);
            }



        } catch (err) {        
            console.error("taxitarifaconfirmar error:");
            console.error(err);
            setIsLoading(false);
        }
    };  

    const CancelarViajePasajero = async () => {
        try {
            //////////console.log(viajeEnCurso.id);
            setIsLoadingCancelar(true);
            
            const resp = await axios.post(APP_URLAPI+'taxicancelarviaje',
              {          
                token: usuario.tokenRegistro,
                trans: viajeEnCurso?.transid,
                compania: COMPANIA_ID
              }
            );

            console.log("viajeEnCurso?.transid");
            console.log(viajeEnCurso?.transid);

            console.log("taxicancelarviaje");
            console.log(resp.data);

            StopInterval();
            
            if (resp.data.code==0){// Cancelada correctamente         
                setIsLoadingCancelar(false);
                navigation.navigate('Panel')
            }else if (resp.data.code==103 || resp.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                setIsLoadingCancelar(false);
            }

            

        } catch (err) {        
            console.error(err);
            setIsLoadingCancelar(false);
        }
    };

    const ajustarTarifa = async () => {

        try {      
            
            setModalVisible(true);
            setIsLoadingGuardarTarifa(true);

            console.log("taxiajustartarifa");
            console.log(tarifaUsuario);

            console.log("viajeEnCurso?.transtaxicalculo_id");
            console.log(viajeEnCurso?.transtaxicalculo_id);
            
            
            const resp = await axios.post(APP_URLAPI+'taxiajustartarifa',
              {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID,
                trans: viajeEnCurso?.transtaxicalculo_id,
                tarifaUsuario: tarifaUsuario                
              }
            );

         
            if (resp.data.code==0){// correctamente   
                
                console.log("resp.data.data taxiajustartarifa");
                console.log(resp.data.data);

                Toast.show({
                    type: 'success',
                    text1: 'Ajustada la tarifa correctamente'
                });         
                
                ConfirmarViaje();

                setModalVisible(false);
                setIsLoadingGuardarTarifa(false);
            }else if (resp.data.code==103 || resp.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{

                console.log(resp.data);

                Toast.show({
                    type: 'error',
                    text1: 'Error no se pudo ajustar la tarifa'
                });

                setModalVisible(false);
                setIsLoadingGuardarTarifa(false);
            }

/*
            console.log("taxiajustartarifa");
            console.log(resp.data);
            
            if (resp.data.code==0){// correctamente         
                setModalVisible(false);
                setIsLoadingGuardarTarifa(false);
            }else{
                setModalVisible(false);
                setIsLoadingGuardarTarifa(false);
            }
*/
            setModalVisible(false);    
            setIsLoadingGuardarTarifa(false);  

        } catch (err) {   

            console.log(err);

            Toast.show({
                type: 'error',
                text1: 'Error no se pudo ajustar la tarifa'
            });

            setModalVisible(false);   
            setIsLoadingGuardarTarifa(false);                     
        }
    };

    const abrirAjustarTarifa = async () => {
        setModalVisible(true);
    };
    

    
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>
    <ScrollView>                      

        <View style={styles.container}> 
            {
                !viajeEnCurso?.origen ?   
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
                <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 10, marginBottom:20, width: "100%"}}>

                    <ListDetalleItem titulo={"Origen"}  valor={viajeEnCurso?.origen}  />

                    <ListDetalleItem titulo={'Referencia'}  valor={viajeEnCurso?.origenobservacion} paddingLeft={15} fontWeight="normal" />

                    <ListDetalleItem titulo={'Contacto'}  valor={viajeEnCurso?.origencontacto} paddingLeft={15}  fontWeight="normal" />

                    <ListDetalleItem titulo={'Teléfono'}  valor={viajeEnCurso?.origentelf} paddingLeft={15}   fontWeight="normal"  phone={true}/>


                    <ListDetalleItem titulo={"Destino"}  valor={viajeEnCurso?.destino}  />

                    <ListDetalleItem titulo={'Referencia'}  valor={viajeEnCurso?.destinoobservacion} paddingLeft={15}  fontWeight="normal"/>

                    <ListDetalleItem titulo={'Contacto'}  valor={viajeEnCurso?.destinocontacto} paddingLeft={15} fontWeight="normal" />

                    <ListDetalleItem titulo={'Teléfono'}  valor={viajeEnCurso?.destinotelf} paddingLeft={15} fontWeight="normal" phone={true} />

                    <ListDetalleItem titulo={viajeEnCurso?.montoarticulo ? 'Que se debe comprar' : 'Que se envía'}  valor={viajeEnCurso?.observacionenvio}  /> 

                    

                    {
                        COMPANIA_ID == "398888" ? null :
                        <>  
                        <ListDetalleItem titulo={"Forma de pago"}  valor={viajeEnCurso?.formapago}  />

                        <ListDetalleItem titulo={"Precio de viaje total"}  valor={viajeEnCurso?.monto}  />

                        <ListDetalleItem titulo={"Monto del artículo a comprar"}  valor={viajeEnCurso?.montoarticulo}  />

                        {
                            viajeEnCurso?.monto != viajeEnCurso?.montoservicio ?
                            <ListDetalleItem titulo={"Monto del servicio"}  valor={viajeEnCurso?.montoservicio}   />
                            : null
                        }


                    {/*   
                        <ListDetalleItem titulo={"Ganancia del conductor"}  valor={viajeEnCurso?.montoproveedor}  paddingLeft={20} fontWeight={"normal"} />

                        <ListDetalleItem titulo={"Ganancia del solicitante"}  valor={viajeEnCurso?.montoproveedorppal} paddingLeft={20} fontWeight={"normal"} />

                        <ListDetalleItem titulo={"Comisión de la plataforma"}  valor={viajeEnCurso?.montoplataforma} paddingLeft={20} fontWeight={"normal"} /> 
                    */}
                        
                        </>
                    }

                    
               
                    {isLoading ? (
                        <>
                            <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} />
                            <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 16, textAlign: "left"}}>
                                Notificando a conductores  
                            </Text>
                        </>
                        ) : (
                        <>

                        {
                            totalConductoresNotificados > 0 ?
                            <ListDetalleItem titulo={"Conductores notificados"}  valor={totalConductoresNotificados}  />
                            :                        
                            <View style={{justifyContent: "center", alignItems: "center", marginTop: 20, width: "100%", marginBottom: 20, display: "none"}}>
                                <View style={{backgroundColor: "#C8F2ED",  borderRadius: 5, padding: 20, width: "95%"}}>
                                    <Text style={{color: "#055D5D", fontSize: 14, textAlign: "center"}}>En este momento no hay conductores disponibles</Text>
                                </View>                
                            </View>                        
                        }                    
                        </>
                    )}      

                    {   
                        totalConductoresNotificados >= 0 ?                                     
                        <View style={{justifyContent: "center", alignItems:"center"}}>
                            
                            <ActivityIndicator size="large" color="blue" style={{marginTop: 0, marginBottom: 0}} />
                            <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                                <Text style={{fontSize: 18, textAlign: "center"}}>
                                    Esperando que el conductor acepte el viaje 
                                </Text>                    
                            </View>
                            <Image
                            
                                source={require('../../../assets/img/esperandoconductor.jpg')}          
                                style={{resizeMode: 'contain', height: 150, width: 200}}
                            />                      
                        </View>
                        : null
                    }
                    <View style={{width: "100%"}}>
                        {
                            parametros?.valor?.habilitardemo == "1" ? 
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Ingreso')}  
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: COLORBOTONPRINCIPAL,
                                    }} 
                                >       
                                    <Icon size={20} name="car" color={"#FFFFFF"}  />                       
                                    <Text 
                                        style={styles.buttonText}>
                                        
                                        
                                        {'  '}Ingresar como Conductor
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                            : null
                        }

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                                setModalVisible(!modalVisible);
                            }}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                <TextInput
                                    label={'Nueva tarifa'}                                    
                                    keyboardType = 'numeric'
                                    onChangeText={setTarifaUsuario}
                                    value={tarifaUsuario}
                                    placeholder={"Nueva tarifa"}
                                    style={styles.inputConLabel}
                                    mode="outlined"
                                    outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                                    textColor="#3A3A3A"
                                />
                                 <TouchableOpacity 
                                    disabled={isLoadingGuardarTarifa}                            
                                    onPress={ajustarTarifa}                                   
                                    style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center", width: "90%"}}>
                                    <View
                                        style={{
                                            ...styles.button,
                                            backgroundColor: COLORBOTONPRINCIPAL,
                                        }} 
                                    >       
                                        <Text 
                                            style={styles.buttonText}>
                                            {
                                                isLoadingGuardarTarifa ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Guardar"
                                            }                                          
                                        </Text>                            
                                    </View>
                                </TouchableOpacity>
                                </View>
                               
                            </View>
                        </Modal>                       
                                            

                        <TouchableOpacity 
                            disabled={isLoadingCancelar}
                            onPress={CancelarViajePasajero}
                            style={{textAlign: "center", marginTop: 5, margin: 12,
                            borderRadius: 10, justifyContent: "center"}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: "#A70B0B",
                                }} 
                            >      
                                <Icon size={20} name="ban" color={"#FFFFFF"}  />                           

                                <Text style={styles.buttonText}>
                                    {
                                        isLoadingCancelar ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Cancelar viaje"
                                    }  
                                </Text>  
                                                        
                            </View>
                        </TouchableOpacity>

                        {   
                        totalConductoresNotificados > 0 ? 
                        
                            null
                            : 
                            <View style={{width: "100%", display: "none"}}>
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('Panel')} 
                                    style={{textAlign: "center", marginTop: 5, margin: 12,
                                    borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                                    <View
                                        style={{
                                            ...styles.button,
                                            backgroundColor: COLORBOTONPRINCIPAL,
                                        }} 
                                    >   
                                        <Icon size={20} name="home" color={"#FFFFFF"}  /> 
                                        <Text 
                                            style={styles.buttonText}>
                                            {' '} Ir al Panel Principal
                                        </Text>                            
                                    </View>
                                </TouchableOpacity>
                            </View> 
                        }
                    </View>
                </View>
            }  

             
            
                                            
        </View>
    </ScrollView>       
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    inputConLabel : {
        borderColor: "#D3D3D0", borderRadius: 5, textAlign: "left", paddingVertical: 0, backgroundColor: "#FFFFFF", color:"#D3D3D0", 
        width: "90%"
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        width: "100%"
    },
    modalView: {
        margin: 20,
        width: "70%",
        backgroundColor: "#F1F0F0",
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
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
        fontSize: 15,
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
    },
    imgServicio: {
        height: 120, 
        width: 120,
        resizeMode: 'contain'
    },
});

export default ViajeSolicitarConfirmar

