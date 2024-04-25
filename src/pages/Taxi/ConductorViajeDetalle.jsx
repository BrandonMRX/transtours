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
import { Skeleton } from '@rneui/themed';

import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import ListDetalleItem from "../../components/ListDetalleItem";


const ConductorViajeDetalle = ({navigation, route}) => {

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('ConductorViajes')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);
    const [viaje, setViaje] = useState([]);
    const isFocused = useIsFocused();

    

    useEffect(() => {
        (async () => {

            if (usuario.tokenRegistro){

                setIsLoading(true);

                const resp = await axios.post(APP_URLAPI+'taxiviajedetalle',
                {          
                    token: usuario.tokenRegistro,
                    id: route.params?.item.transid,
                    compania: COMPANIA_ID
                });        
  
                //console.log("usuario.tokenRegistro:");
                //console.log(usuario.tokenRegistro);

                //console.log("route.params?.item.transid:");
                //console.log(route.params?.item.transid);

                //console.log("COMPANIA_ID");
                //console.log(COMPANIA_ID);


                console.log("taxiviajedetalle:");
                console.log(resp.data);

                if (resp.data.code==0){//
                    setViaje(resp.data.data);
                }else if (resp.data.code==103 || resp.data.code==104){
                    setIsLoading(false);
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }
                else{
                    setViaje([]);
                }

                setIsLoading(false);
            }
        })();
    }, [route.params?.item, isFocused]);

   
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>
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
                <>
                    <View style={{backgroundColor: "#FFFFFF", marginBottom:20, width: "100%"}}>                        

                        <ListDetalleItem titulo={'Cliente'}  valor={viaje?.cliente}  />

                        <ListDetalleItem titulo={'Conductor'}  valor={viaje?.conductor}  />

                        <ListDetalleItem titulo={'Origen'}  valor={viaje?.origen}  />

                        <ListDetalleItem titulo={'Referencia'}  valor={viaje?.origenobservacion} paddingLeft={15} fontWeight="normal" />

                        <ListDetalleItem titulo={'Contacto'}  valor={viaje?.origencontacto} paddingLeft={15}  fontWeight="normal" />

                        <ListDetalleItem titulo={'Teléfono'}  valor={viaje?.origentelf} paddingLeft={15}   fontWeight="normal"  phone={true}/>


                        <ListDetalleItem titulo={'Destino'}  valor={viaje?.destino}  />

                        <ListDetalleItem titulo={'Referencia'}  valor={viaje?.destinoobservacion} paddingLeft={15}  fontWeight="normal"/>

                        <ListDetalleItem titulo={'Contacto'}  valor={viaje?.destinocontacto} paddingLeft={15} fontWeight="normal" />

                        <ListDetalleItem titulo={'Teléfono'}  valor={viaje?.destinotelf} paddingLeft={15} fontWeight="normal" phone={true} />

                        <ListDetalleItem titulo={'Tipo de viaje'}  valor={viaje?.tipotarifa}  />

                        <ListDetalleItem titulo={viaje?.montoarticuloorig ? 'Que se debe comprar' : 'Que se envía'}  valor={viaje?.observacionenvio}  /> 

                        {
                        COMPANIA_ID != "398" ?  
                        <>
                        <ListDetalleItem titulo={'Forma de pago'}  valor={viaje?.formapago}  />

                        <ListDetalleItem titulo={"Precio de viaje total"}  valor={viaje?.monto}  />

                        <ListDetalleItem titulo={'Monto del artículo a comprar'}  valor={viaje?.montoarticulo}  />

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

                        <ListDetalleItem titulo={"Estatus de Viaje"}  valor={viaje?.estatus_porconductor}  />
                    
                        
                                                                             
                    </View>                     
                </>
                 
            
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
        marginHorizontal: 15
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

export default ConductorViajeDetalle

