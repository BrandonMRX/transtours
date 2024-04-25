import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";
import ListDetalleItem from "../../components/ListDetalleItem";


const ConductorViajeFinalizado = ({navigation, route}) => {

    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);
    const [viaje, setViaje] = useState([]);

    
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
                //////console.log("route.params?.item:");
                //////console.log(route.params?.item);


                console.log("taxiviajedetalle:");  
                console.log(resp.data);

                if (resp.data.code==0){//
                    setViaje(resp.data.data);
                }else if (resp.data.code==103 || resp.data.code==104){
                    setIsLoading(false);
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{
                    setViaje([]);
                }

                setIsLoading(false);
            }
        })();
    }, [route.params?.item]);

   
    return (
    <SafeAreaView style={{backgroundColor: "#fff", height: "100%"}}>
    <ScrollView>                         
        <View style={{backgroundColor: "#fff", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 20, paddingLeft: 10, justifyContent: "center", alignItems: "center", textAlign: "center"}}> 
            <View style={{paddingTop: 3, marginBottom: 10, width: 100, textAlign: "center"}}>
                <Icon size={80} name="check-circle" color={"#5EB412"} style={{width: 80}} />
            </View>   

            {
                COMPANIA_ID == "398" ?          
                <>
                <View style={{textAlign: "center", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 22, justifyContent: "center", textAlignVertical: "center", textAlign: "center", paddingTop: 0, fontWeight: "500"}}>
                       Viaje finalizado                      
                    </Text>                                              
                </View> 
                </>
                : 
                <>
                <View style={{textAlign: "center", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 22, justifyContent: "center", textAlignVertical: "center", textAlign: "center", paddingTop: 0, fontWeight: "500"}}>
                        {
                            viaje?.formapagocod == "999" ?
                            'Monto cobrado' :
                            'Monto a cobrar'
                        }                        
                    </Text>                                              
                </View> 
                <View style={{textAlign: "center", justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontSize: 22, justifyContent: "center", textAlignVertical: "center", textAlign: "center", paddingTop: 0, fontWeight: "500"}}>
                        {viaje?.monto}
                    </Text>                                                 
                </View>
                </>
            }
                              
        </View>
        <View style={{backgroundColor: "#FFFFFF", paddingVertical: 10, marginBottom:20, paddingHorizontal: 20}}>

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

            

                                
        </View>  
        <View style={{marginTop: 0, justifyContent: "center", alignItems: "center"}}>            
            <View style={{width: "90%"}}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Panel')}
                    style={{textAlign: "center", marginTop: 5, margin: 12,
                    borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                    <View
                        style={{
                            ...styles.button,
                            backgroundColor: "#5F5C5A",
                        }} 
                    >    
                        <Icon size={20} name="check" color={"#FFFFFF"}  />
                        <Text 
                            style={[styles.buttonText, {color: "#FFFFFF"}]}>
                            {' '} Finalizar
                        </Text>                            
                    </View>
                </TouchableOpacity>
            </View>           
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
        paddingHorizontal: 25
    },
    button: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#666",
        borderRadius: 10,
        paddingVertical: 3,
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

export default ConductorViajeFinalizado