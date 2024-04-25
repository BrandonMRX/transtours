import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { ScrollView } from "react-native-gesture-handler";
import { Formik } from 'formik'
import * as Yup from 'yup';
import { floor } from "react-native-reanimated";
import uuid from 'react-native-uuid';
import axios from 'axios';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import MapConductor from "../../components/MapConductor";
import { Skeleton } from '@rneui/themed';
import ListDetalleItem from "../../components/ListDetalleItem";
 

const ConductorConfirmarViaje = ({navigation, route}) => {

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('ConductorViajesPendientes')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const isFocused = useIsFocused();
    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);
    const [totalConductoresNotificados, setConductoresNotificados] = useState(false);
    const [notifConductores, setNotifConductores] = useState([]);
    const parametros = useSelector(state => state.parametros)
    const [viaje, setViaje] = useState([]);
    const [balance, setBalance] = useState({});
    

    useEffect(() => {
        (async () => {

            ////console.log("route.params?.item");
            ////console.log(route.params?.item);

            if (usuario.tokenRegistro){ 

                setIsLoading(true);

                const resp = await axios.post(APP_URLAPI+'taxiviajedetalle',
                {          
                    token: usuario.tokenRegistro,
                    id: route.params?.item.transid,
                    compania: COMPANIA_ID
                });      

                console.log("usuario.tokenRegistro:");
                console.log(usuario.tokenRegistro);

                console.log("route.params?.item.transid:");
                console.log(route.params?.item.transid);

                console.log("COMPANIA_ID"); 
                console.log(COMPANIA_ID);


                ////console.log("route.params");
                ////console.log(route?.params);

                ////console.log("route.params?.item.transid");
                ////console.log(route.params?.item.transid); 
                
                console.log("taxiviajedetalle en conductorconfirmarviaje");
                console.log(resp.data); 


                if (resp.data.code==0){//     
                    
                    if (resp.data.data.estatuscod==6){// Por confirmar conductor	                  
                        setViaje(resp.data.data);
                    }else{
                        setViaje([]);
                        //navigation.navigate('ConductorViajeYaAsignado'); 
                    } 
                }else if (resp.data.code==103 || resp.data.code==104){
                    setViaje([]);
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{
                    setViaje([]);
                }

                //////console.log(656);
                const resp2 = await axios.post(APP_URLAPI+'balance',
                    {          
                        token: usuario.tokenRegistro,
                        compania: COMPANIA_ID
                    }
                );
    
                ////console.log("balance:");
                ////console.log(usuario.tokenRegistro);
    
                console.log("balancee:");
                
                if (resp2.data.code==0){//
                    setBalance(resp2.data.data);
                    console.log(resp2.data.data);
                    //console.log("here");
                }else{
                    

                }            
            
                setIsLoading(false);

            }
        })();
    }, [route.params?.item, isFocused]);

    
    const AceptarViaje = async () => { // Aceptacion de conductor
        try {
            setIsLoading(true);

            const resp = await axios.post(APP_URLAPI+'taxiconductorconfirmarviaje',
              {          
                token: usuario.tokenRegistro,
                transnotif: viaje?.idnotif,
                compania: COMPANIA_ID
              }
            );

            let item = {
                transid: viaje?.transid
            };
            console.log("viaje?.idnotif :");
            console.log(viaje?.idnotif);
            
            console.log("resp.data taxiconductorconfirmarviaje:");
            console.log(resp.data);

           /*  ////console.log("viaje?.idnotif:");
            ////console.log(viaje?.idnotif);

            ////console.log("item:");
            ////console.log(viaje?.transid); */
            
            if (resp.data.code==0){
                setIsLoading(false);
                navigation.navigate('ConductorViajeEnCurso',{item: item});
            }else if (resp.data.code==103 || resp.data.code==104){
                setIsLoading(false);
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{

                setIsLoading(false);

                if (resp.data.code==101){ // Ya tomado
                    navigation.navigate('ConductorViajeYaAsignado'); 
                }else{
                    navigation.navigate('ConductorViajeYaAsignado'); 
                }
                
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        }
    };

    const RechazarViaje = async () => { // Rechazo de conductor
        try {
            setIsLoading(true);

            
            const resp = await axios.post(APP_URLAPI+'taxiconductorrechazarviaje',
              {          
                token: usuario.tokenRegistro,
                transnotif: viaje?.idnotif,
                compania: COMPANIA_ID
              }
            );

            //////////console.log(resp.data);
            //////////console.log(route.params?.item.idnotif);
            
            if (resp.data.code==0){
                setIsLoading(false);
                navigation.navigate('Panel');
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

   
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>
                          
        <View style={{height: "30%"}}> 
            <MapConductor valores={viaje} />
        </View>
        <ScrollView>
            <View style={styles.container}>   
                
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
                
                <View style={{backgroundColor: "#FFFFFF", paddingBottom: 20, marginBottom:20, paddingHorizontal: 20, width: "100%"}}>

                    <ListDetalleItem titulo={"Origen"}  valor={viaje?.origen}  />

                    <ListDetalleItem titulo={"Referencia"}  valor={viaje?.origenobservacion} paddingLeft={15} fontWeight="normal"  />
                    
                    <ListDetalleItem titulo={"Destino"}  valor={viaje?.destino}  />

                    <ListDetalleItem titulo={"Referencia"}  valor={viaje?.destinoobservacion} paddingLeft={15} fontWeight="normal"  />
 
                    <ListDetalleItem titulo={"Distancia con el pasajero"}  valor={viaje?.distanciaconductoractualconorigen}  />
                    
                    <ListDetalleItem titulo={"Tipo de viaje"}  valor={viaje?.tipotarifa}  />
                    
                    <ListDetalleItem titulo={viaje?.montoarticulo ? 'Que se debe comprar' : 'Que se envía'}  valor={viaje?.observacionenvio}  />

                    {
                        COMPANIA_ID != "398" ? 
                        <>
                        <ListDetalleItem titulo={"Forma de pago"}  valor={viaje?.formapago}  />

                        <ListDetalleItem titulo={"Precio de viaje total"}  valor={viaje?.monto}  />

                        <ListDetalleItem titulo={"Monto del artículo a comprar"}  valor={viaje?.montoarticulo}  />

                        {
                            viaje?.monto != viaje?.montoservicio ?
                            <ListDetalleItem titulo={"Monto del servicio"}  valor={viaje?.montoservicio}   />
                            : null
                        }
                                            
                        <ListDetalleItem titulo={"Ganancia del conductor"}  valor={viaje?.montoproveedor}  paddingLeft={20} fontWeight={"normal"} />

                        <ListDetalleItem titulo={"Ganancia del solicitante"}  valor={viaje?.montoproveedorppal} paddingLeft={20} fontWeight={"normal"} />

                        <ListDetalleItem titulo={"Comisión de la plataforma"}  valor={viaje?.montoplataforma} paddingLeft={20} fontWeight={"normal"} /> 
                        </>
                        : null
                    }
                                      
                            
                    <View style={{justifyContent: "center", alignItems:"center"}}>
                        <ActivityIndicator size="large" color="blue" style={{marginTop: 0, marginBottom: 0}} />
                        <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                            <Text style={{fontSize: 18, textAlign: "center"}}>
                                El pasajero está esperando que se acepte el viaje
                            </Text>
                        
                        </View>
                                           
                    </View>
                    {
                        COMPANIA_ID == "388" && parseFloat(balance?.saldo_disponibleoriginal) >= 3 ?
                        <>                        
                        <View style={{width: "100%"}}>
                            <TouchableOpacity 
                                onPress={AceptarViaje}
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
                                        {' '} Aceptar viaje
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={RechazarViaje}
                                style={{textAlign: "center", marginTop: 5, margin: 12,
                                borderRadius: 10, justifyContent: "center"}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#A70B0B",
                                    }} 
                                >      
                                    <Icon size={20} name="ban" color={"#FFFFFF"}  />                          
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} Rechazar viaje
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                        </View>
                        </>
                        : 
                        COMPANIA_ID == "388" ?
                        <View style={{justifyContent: "center", alignItems: "center", marginVertical: 0}}>
                            <View style={{backgroundColor: "#C8F2ED",  borderColor: "#168E12", borderRadius: 5, width: "100%", padding: 20, margin: 20}}>
                                <Text style={{color: "#095D53", fontSize: 14, textAlign: "center"}}>
                                    No tiene saldo disponible para aceptar el viaje. Debe tener 3$ en su saldo disponiblee. {balance?.saldo_disponibleoriginal} {balance?.saldo_disponible}
                                </Text>
                                <TouchableOpacity 
                                    onPress={() => 
                                        navigation.navigate({
                                            name: 'Depositar',                                            
                                            merge: true,
                                        })                          
                                    }
                                    style={{textAlign: "center", marginTop: 10, borderRadius: 10, justifyContent: "center"}}>
                                    <View
                                        style={{
                                            ...styles.button,
                                            backgroundColor: "#3CA295",
                                        }} 
                                    >       
                                        <Icon size={20} name="plus-circle" color={"#FFFFFF"}  />                       
                                        <Text 
                                            style={styles.buttonText}>
                                            
                                            {'  '}
                                            {
                                                isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Cargar saldo"
                                            }
                                            
                                        </Text>                            
                                    </View>                                
                                </TouchableOpacity>
                            </View>                                         
                        </View> 
                        : null 
                    }

                    {
                        COMPANIA_ID != "388" ?
                        <>                        
                        <View style={{width: "100%"}}>
                            <TouchableOpacity 
                                onPress={AceptarViaje}
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
                                        {' '} Aceptar viaje
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={RechazarViaje}
                                style={{textAlign: "center", marginTop: 5, margin: 12,
                                borderRadius: 10, justifyContent: "center"}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#A70B0B",
                                    }} 
                                >      
                                    <Icon size={20} name="ban" color={"#FFFFFF"}  />                          
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} Rechazar viaje
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                        </View>
                        </>
                        : 
                        null
                    }
                </View> 
                
            }
                                            
            </View>
        </ScrollView>       

    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        
        backgroundColor: "#FFFFFF",
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

export default ConductorConfirmarViaje

