import React, { useState, useContext, Component, useEffect, useCallback, useRef } from "react";
import { Button, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, BackHandler } from 'react-native'
import { TextInput } from 'react-native-paper';

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

const validationSchema = Yup.object().shape({
    //observacionesOrigen: Yup.string()
    //.required('Dato obligatorio'),
});

const ViajeSolicitarObservaciones = ({navigation, route}) => {

    const isFocused = useIsFocused();
    const formikRef = useRef();
    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);
    const parametros = useSelector(state => state.parametros)
    const [infoPedido, setInfoPedido] = useState(false);
    const [initialValues, setInitialValues] = useState({observacionesOrigen: "",observacionesDestino: "", contactoNombreOrigen: "", contactoNombreDestino: "", contactoTelfOrigen:"", contactoTelfDestino: ""});

    useEffect(() => {

        if (!isFocused){return;}

        console.log("route.params");    
        console.log(route.params);     

        if (route.params?.infoPedido){
            setInfoPedido(route.params?.infoPedido);
            console.log("route.params?.infoPedido :");    
            console.log(route.params?.infoPedido);     

            if (formikRef.current) {

                console.log("route.params?.infoPedido?.infoenvio?.origen?.usuariodireccion_observacion :");    
                console.log(route.params?.infoPedido?.infoenvio?.origen?.usuariodireccion_observacion);     
                


                formikRef.current.setFieldValue(
                  "observacionesOrigen",
                  route.params?.infoPedido?.infoenvio?.origen?.usuariodireccion_observacion
                ); 
                
                formikRef.current.setFieldValue(
                    "contactoNombreOrigen",
                    route.params?.infoPedido?.infoenvio?.origen?.usuariodireccion_contactonombre
                ); 

                formikRef.current.setFieldValue(
                    "contactoTelfOrigen",
                    route.params?.infoPedido?.infoenvio?.origen?.usuariodireccion_contactotelf
                ); 


                formikRef.current.setFieldValue(
                    "observacionesDestino",
                    route.params?.infoPedido?.infoenvio?.destino?.usuariodireccion_observacion
                ); 
                  
                formikRef.current.setFieldValue(
                      "contactoNombreDestino",
                      route.params?.infoPedido?.infoenvio?.destino?.usuariodireccion_contactonombre
                ); 
  
                formikRef.current.setFieldValue(
                      "contactoTelfDestino",
                      route.params?.infoPedido?.infoenvio?.destino?.usuariodireccion_contactotelf
                ); 
            }

        }
        
        if (route.params?.valores?.direccionorigen?.direccionGuardada){

            console.log("route.params?.valores?.direccionorigen?.direccionGuardada");
            console.log(route.params?.valores?.direccionorigen?.direccionGuardada);
            
            formikRef.current.setFieldValue(
                "observacionesOrigen",
                route.params?.valores?.direccionorigen?.direccionGuardada?.usuariodireccion_observacion
              ); 
              
              formikRef.current.setFieldValue(
                  "contactoNombreOrigen",
                  route.params?.valores?.direccionorigen?.direccionGuardada?.usuariodireccion_contactonombre
              ); 

              formikRef.current.setFieldValue(
                  "contactoTelfOrigen",
                  route.params?.valores?.direccionorigen?.direccionGuardada?.usuariodireccion_contactotelf
              ); 

        }
        
        if (route.params?.valores?.direcciondestino?.direccionGuardada){

            console.log("route.params?.valores?.direccionorigen?.direccionGuardada");
            console.log(route.params?.valores?.direccionorigen?.direccionGuardada);
                    

              formikRef.current.setFieldValue(
                  "observacionesDestino",
                  route.params?.valores?.direcciondestino?.direccionGuardada?.usuariodireccion_observacion
              ); 
                
              formikRef.current.setFieldValue(
                    "contactoNombreDestino",
                    route.params?.valores?.direcciondestino?.direccionGuardada?.usuariodireccion_contactonombre
              ); 

              formikRef.current.setFieldValue(
                    "contactoTelfDestino",
                    route.params?.valores?.direcciondestino?.direccionGuardada?.usuariodireccion_contactotelf
              ); 

        }
        

    }, [route.params]);

    const handleOnSubmitEnviar = (values, {resetForm}) => {
        setIsLoading(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, {resetForm});
        }, 500);
    }

    const handleOnSubmitEnviar2 = (values, {resetForm}) => {       
        setIsLoading(false);  

        console.log("ir para ViajeSolicitar");
        
        navigation.navigate({
            name: "ViajeSolicitar", 
            params: { 
                item: route?.params?.item,
                valores: route?.params?.valores,
                tiposervicio: route?.params?.tiposervicio,
                tarifaUsuario: route?.params?.tarifaUsuario,
                envioTexto: route?.params?.envioTexto,
                montoArticuloEnvio: route?.params?.montoArticuloEnvio,                
                observaciones: values,
                infoPedido: infoPedido
            },
            merge: true,
        });
        
    };
   
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>
    <ScrollView>                      

        <View style={styles.container}>   
            
            <View style= {{ justifyContent:'center', marginTop: 10,  flexDirection: 'row', width:"100%"}}>
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    //validationSchema={validationSchema}
                    onSubmit={handleOnSubmitEnviar}
                    
                >
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                    <View style={{width: "90%"}}>
                        <View style={{marginBottom: 10}}>
                            <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 16, textAlign: "left"}}>
                                Origen:
                            </Text> 
                            <Text style={{color: "#343434", fontWeight: "normal", paddingLeft: 5, fontSize: 16, textAlign: "left"}}>
                                {route.params?.valores.origen}
                            </Text> 
                        </View>                         
                        <TextInput
                            onChangeText={handleChange('observacionesOrigen')}
                            placeholder={route.params?.tiposervicio.observacionorigen}
                            multiline={true}
                            numberOfLines={3}
                            value={values.observacionesOrigen}
                            label={route.params?.tiposervicio.observacionorigen}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"        
                        />                      
                        <TextInput
                            onChangeText={handleChange('contactoNombreOrigen')}
                            placeholder={"Persona de Contacto"}
                            value={values.contactoNombreOrigen}
                            label={"Persona de Contacto"}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"        
                        />                       
                        <TextInput
                            onChangeText={handleChange('contactoTelfOrigen')}
                            placeholder={"Teléfono de Contacto"}
                            value={values.contactoTelfOrigen}
                            label={"Teléfono de Contacto"}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"  
                        />
                        

                        <View style={{marginBottom: 10, marginTop: 15}}>
                            <Text style={{color: "#343434", fontWeight: "600", paddingLeft: 5, fontSize: 16, textAlign: "left"}}>
                                Destino:
                            </Text> 
                            {
                                route.params?.valores.origen != route.params?.valores.destino ? 
                                <Text style={{color: "#343434", fontWeight: "normal", paddingLeft: 5, fontSize: 16, textAlign: "left"}}>
                                    {route.params?.valores.destino}
                                </Text> 
                                : 
                                <Text style={{color: "#343434", fontWeight: "normal", paddingLeft: 5, fontSize: 16, textAlign: "left"}}>
                                    (No indicado)
                                </Text>
                            }
                            
                        </View>                          
                        <TextInput
                            onChangeText={handleChange('observacionesDestino')}
                            placeholder={route.params?.tiposervicio.observaciondestino}
                            multiline={true}
                            numberOfLines={3}
                            value={values.observacionesDestino}
                            label={route.params?.tiposervicio.observaciondestino}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"  
                        />
                        <TextInput
                            onChangeText={handleChange('contactoNombreDestino')}
                            placeholder={"Persona de Contacto"}
                            value={values.contactoNombreDestino}
                            label={"Persona de Contacto"}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A"  
                        />                       
                        <TextInput
                            onChangeText={handleChange('contactoTelfDestino')}
                            placeholder={"Teléfono de Contacto"}
                            value={values.contactoTelfDestino}
                            label={"Teléfono de Contacto"}
                            style={styles.inputConLabel}
                            mode="outlined"
                            outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                            textColor="#3A3A3A" 
                        />
                        
                        <View style={{justifyContent: "center", alignItems: "center", marginTop: 15}}>
                            <View style={{width: "100%"}}>
                            <TouchableOpacity 
                                onPress={handleSubmit}   
                                style={{textAlign: "center", marginTop: 5, borderRadius: 10, justifyContent: "center"}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: COLORBOTONPRINCIPAL,
                                    }} 
                                >                                           
                                    <Text 
                                        style={styles.buttonText}>
                                        
                                        {'  '}
                                        {
                                            isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Continuar"
                                        }
                                        
                                    </Text>                            
                                </View>                                
                            </TouchableOpacity>
                            </View>                            
                        </View>
                    </View>                          
                )}
                </Formik>
            </View>                                           
        </View>
    </ScrollView>       
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    inputConLabel : {
        borderColor: "#D3D3D0", borderRadius: 5, textAlign: "left", paddingVertical: 0, backgroundColor: "#FFFFFF", color:"#D3D3D0", marginBottom: 10
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

export default ViajeSolicitarObservaciones

