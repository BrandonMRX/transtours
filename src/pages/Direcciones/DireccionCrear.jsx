import React, { useState, useContext, Component, useEffect, useRef } from "react";
import { Button, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-paper';

import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";


import { ScrollView } from "react-native-gesture-handler";
import { Formik } from 'formik'
import * as Yup from 'yup';
import { floor } from "react-native-reanimated";
import uuid from 'react-native-uuid';
import axios from 'axios';
/* import HTMLView from 'react-native-htmlview';
 */
import { TextInputMask } from 'react-native-masked-text';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import SelectDropdown from 'react-native-select-dropdown'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

navigator.geolocation = require('react-native-geolocation-service');

const validationSchema = Yup.object().shape({
    titulo: Yup.string() 
     .required('Titulo es obligatorio')
     .label('titulo'),     
    observaciones: Yup.string() 
     .required('Descripción es obligatoria')
     .label('observaciones'),
 });


const DireccionCrear = ({navigation, route}) => {

    const isFocused = useIsFocused();
    const formikRef = useRef({});     
    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);    
    const [disabledBotonContinuar, setDisabledBotonContinuar] = useState(false);
    const [initialValues, setInitialValues] = useState({nombre: "", telf: "", observaciones: ""});
    const [isLoadingEliminar, setIsLoadingEliminar] = useState(false);


    const borrarFormulario = () => {                 
        formikRef.current.resetForm();
    };

    useEffect(() => {

        if (route.params?.direccionGuardada) {
          //console.log("route.params?.direccionGuardada");
          //console.log(route.params?.direccionGuardada);

          if (formikRef.current) {
            formikRef.current.setFieldValue(
              "nombre",
              route.params?.direccionGuardada?.usuariodireccion_contactonombre
            );
            formikRef.current.setFieldValue(
              "telf",
              route.params?.direccionGuardada?.usuariodireccion_contactotelf
            );
            formikRef.current.setFieldValue(
                "observaciones",
                route.params?.direccionGuardada?.usuariodireccion_observacion
              );
          }
        }else{
            borrarFormulario();
        }
    }, [route.params?.direccionGuardada]);

    useEffect(() => {
        (async () => {

            //console.log("En DireccionCrear 1");
            //console.log(route.params);
        })();
    }, [route.params?.direccionGuardada, isFocused]);

    const handleOnSubmitEnviar = (values, {resetForm}) => {
        setIsLoading(true);
        setDisabledBotonContinuar(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, {resetForm});
        }, 100);
    }

    const handleOnSubmitEnviar2 = async (values, {resetForm}) => { 
        
        try {

            if (route.params?.valores?.origen==""){
                Toast.show({
                    type: 'error',
                    text1: 'Seleccione una dirección del mapa',
                    text1NumberOfLines: 2
                });
                setIsLoading(false);
                setDisabledBotonContinuar(false);
                return false;
            }
            
            axios
            .post(APP_URLAPI + 'direccionesregistro',
                {         
                    token: usuario.tokenRegistro,  
                    compania: COMPANIA_ID,    
                    id: route.params?.direccionGuardada?.id,
                    dirmapa: route.params?.direccionGuardada?.usuariodireccion_dirmapa ? route.params?.direccionGuardada?.usuariodireccion_dirmapa : route.params?.item?.usuariodireccion_dirmapa,
                    dirlatitud: route.params?.direccionGuardada?.latitud ? route.params?.direccionGuardada?.latitud : route.params?.item?.latitud,
                    dirlongitud: route.params?.direccionGuardada?.longitud ? route.params?.direccionGuardada?.longitud : route.params?.item?.longitud,
                    contactonombre: values.nombre, 
                    contactotelf: values.telf, 
                    observacion: values.observaciones
                }
            )               
            .then(response => {
                resetForm({values: ''});                
                console.log("resultado direccionesregistro");
                console.log(response.data);
                if (response.data.code==0){

                    let id = response.data.data.id;
                    //////console.log("SoporteConfirmado Correcto");
                    setIsLoading(false);     
                    setDisabledBotonContinuar(false);

                    let valores = {
                        id: id
                    };

                    Toast.show({
                        type: 'success',
                        text1: 'Dirección creada correctamente',
                        text1NumberOfLines: 2
                    });                    

                    //borrarFormulario();

                    navigation.navigate('Direcciones');
                }else if (response.data.code==103 || response.data.code==104){

                    setDisabledBotonContinuar(false);
                    setIsLoading(false);
                    Toast.show({
                        type: 'error',
                        text1: 'Error registrando la dirección',
                        text1NumberOfLines: 2
                    });
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{

                    setDisabledBotonContinuar(false);
                    setIsLoading(false);   
                    Toast.show({
                        type: 'error',
                        text1: 'Error registrando la dirección',
                        text1NumberOfLines: 2
                    });             
                }
            }).catch(function (error) {
                resetForm({values: ''});
                setIsLoading(false);            
                setDisabledBotonContinuar(false);

                Toast.show({
                    type: 'error',
                    text1: 'Error registrando la dirección',
                    text1NumberOfLines: 2
                });
            })
        } catch (error) {
                
            setDisabledBotonContinuar(false);
            setIsLoading(false);   
            Toast.show({
                type: 'error',
                text1: 'Error registrando la dirección',
                text1NumberOfLines: 2
            });
        }
        
    };

    const eliminar = async () => { 

        setIsLoadingEliminar(true);
        setDisabledBotonContinuar(true);
          
        if (route.params?.direccionGuardada?.id==""){
            Toast.show({
                type: 'error',
                text1: 'No esta seleccionado ninguna dirección',
                text1NumberOfLines: 2
            });
            setIsLoadingEliminar(false);
            setDisabledBotonContinuar(false);
            return false;
        }
  
        try {
                    
            axios
            .post(APP_URLAPI + 'direccioneseliminar',
                {            
                    id: route.params?.direccionGuardada?.id,
                    token: usuario.tokenRegistro,
                    compania: COMPANIA_ID
                }
            )               
            .then(response => {
                //resetForm({values: ''});
                //console.log("direccioneseliminar:");
                //console.log(response.data);
                if (response.data.code==0){
  
                  Toast.show({
                    type: 'success',
                    text1: 'Eliminado correctamente',
                    text1NumberOfLines: 2
                  });
  
                  //////console.log("Deposito Correcto");
                  setIsLoadingEliminar(false);     
                  setDisabledBotonContinuar(false);
  
                  navigation.navigate('Direcciones')
                }
                else if (response.data.code==101){
  
                    Toast.show({
                      type: 'error',
                      text2: 'No se puede eliminar porque tiene productos activos ', 
                      text2NumberOfLines: 2
                    });
    
                    //////console.log("Deposito Correcto");
                    setIsLoadingEliminar(false);     
                    setDisabledBotonContinuar(false);
    
                    navigation.navigate('Direcciones')
                }
                else{
                    setDisabledBotonContinuar(false);
                    setIsLoadingEliminar(false);                
                }
            }).catch(function (error) {
                //resetForm({values: ''});
                setIsLoadingEliminar(false);            
                setDisabledBotonContinuar(false);
                //////console.log("error");
                //////console.log(error);
            })
        } catch (error) {
                
            setIsLoadingEliminar(false);
            setIsLoading(false);   
        }
        
      };
    
    return (
    <ImageBackground source={require('../../../assets/img/fondoscreensoloabajo.png')} resizeMode="cover"> 
    <SafeAreaView style={{ height: "100%"}}> 
        <View style={styles.container}>                   
            <View style={{paddingHorizontal: 10,  marginBottom:20, width: "100%" }}>
                <View style= {{ marginTop: 10,  flexDirection: 'row'}}>
                    <Formik
                        innerRef={formikRef}  
                        initialValues={initialValues}
                        //validationSchema={validationSchema}
                        onSubmit={handleOnSubmitEnviar}
                    >
                    {({handleChange, handleBlur, handleSubmit, values, errors}) => (
                
                        <View style={{width:"100%"}}>         
                            <Text style={{fontSize: 15, fontWeight: "600"}}>
                                Dirección en mapa:
                            </Text>
                            <Text style={{fontSize: 15}}>
                                {
                                    route.params?.direccionGuardada?.usuariodireccion_dirmapa ? 
                                    route.params?.direccionGuardada?.usuariodireccion_dirmapa : 
                                    route.params?.item?.usuariodireccion_dirmapa
                                }
                                
                            </Text>

                            <TextInput
                                onChangeText={handleChange('observaciones')}
                                placeholder='Piso, Dpto, puntos de referencia'
                                value={values.observaciones}
                                multiline={true}
                                numberOfLines={2}
                                style={styles.inputConLabel}    
                                label={"Referencias de la dirección"}      
                                mode="outlined"
                                outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                                textColor="#3A3A3A"  
                            />   

                            <TextInput
                                onChangeText={handleChange('nombre')}
                                placeholder='Ej: Jose Pérez'
                                value={values.nombre}
                                style={styles.inputConLabel}    
                                label={"Nombre de Contacto"}      
                                mode="outlined"
                                outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                                textColor="#3A3A3A"  
                            /> 

                            <TextInput
                                onChangeText={handleChange('telf')}
                                placeholder='Ej: 6098700480'
                                value={values.telf}
                                keyboardType={"number-pad"}
                                style={styles.inputConLabel}    
                                label={"Teléfono de Contacto"}      
                                mode="outlined"
                                outlineStyle={{borderColor: "#D3D3D0", color: "#FFFFFF"}}
                                textColor="#3A3A3A"  
                            />      
                               
                            
                            <View style={{justifyContent: "center", alignItems: "center", marginTop: 15}}>
                                <View style={{width: "100%"}}>
                                    <TouchableOpacity 
                                        disabled={disabledBotonContinuar}
                                        onPress={handleSubmit}  
                                        style={{textAlign: "center", borderRadius: 10, justifyContent: "center"}}>
                                        <View
                                            style={{
                                                ...styles.button,
                                                backgroundColor: "#0489B1",
                                            }} 
                                        >                                                                    
                                            <Text 
                                                style={styles.buttonText}>
                                                
                                                {'  '}
                                                {
                                                    isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Guardar"
                                                }
                                               
                                            </Text>                            
                                        </View>                                
                                    </TouchableOpacity>
                                </View>
                                {
                                    route.params?.direccionGuardada?.id  ?
                                    <View style={{width: "100%"}}>
                                        <TouchableOpacity 
                                            disabled={disabledBotonContinuar}
                                            onPress={eliminar}  
                                            style={{textAlign: "center", marginTop: 15, borderRadius: 10, justifyContent: "center"}}>
                                            <View
                                                style={{
                                                    ...styles.button,
                                                    backgroundColor: "#9A0E0E",
                                                }} 
                                            >       
                                                <Icon size={20} name="trash" color={"#FFFFFF"}  />                       
                                                <Text 
                                                    style={styles.buttonText}>
                                                    
                                                    {'  '}
                                                    {
                                                        isLoadingEliminar ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Eliminar"
                                                    }
                                                </Text>                            
                                            </View>                                
                                        </TouchableOpacity>
                                    </View>
                                    : null
                                }
                                
                            </View>
                        </View> 
                       
           

                    )}
                    </Formik>
                    
                </View>


                
            </View>                                
        </View>          
    </SafeAreaView>
    </ImageBackground>
    );
};



const styles = StyleSheet.create({
    inputConLabel : {
        borderColor: "#D3D3D0", 
        borderRadius: 5, 
        textAlign: "left", 
        paddingVertical: 0, 
        backgroundColor: "#FFFFFF", 
        color:"#D3D3D0", 
        width:"100%",
        marginTop: 10
    },
    dropdown1BtnStyle: {
        width: '98%',
        height: 45,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        justifyContent: "center",
    },    
    buttonText: {
        color: "#FFFFFF",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    iconText: {
        fontWeight: "normal", 
        paddingLeft: 5, 
        fontSize: 14, 
        textAlign: "center"
    },
    buttonTextNo: {
      color: "#B43219",
      fontWeight: "normal",
      fontSize: 15,
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
    buttonTextAnexar: {
        color: "#737272",
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

export default DireccionCrear
