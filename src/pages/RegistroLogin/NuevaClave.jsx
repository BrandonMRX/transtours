import React, { useState, Component, useContext, useEffect, useCallback} from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, ImageBackground, BackHandler, Pressable} from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import Icon from 'react-native-vector-icons/FontAwesome5';


import { Formik } from 'formik'
import { Link } from 'react-router-native';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';
import * as Yup from 'yup';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux'
import { actualizar } from '../../app/usuarioSlice'
import {urlserver} from '@env'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import { useTogglePasswordVisibility } from './useTogglePasswordVisibility';

const validationSchema = Yup.object().shape({       
     
     clave: Yup.string() 
     //.matches(/\w*[a-z]\w*/, 'Password must have a small letter')
     //.matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
     //.matches(/\d/, 'Password must have a number')
     //.min(8, ({min}) => `Clave debe ser menos por lo menos de 6 ${min} caracteres`)
     .required('Contraseña es requerida')
     .min(3, 'Debe tener mínimo 3 carácteres')
     .max(50, 'Debe tener máximo 50 carácteres')
     .label('Contraseña'),
 
     clave2: Yup.string() 
     //.matches(/\w*[a-z]\w*/, 'Password must have a small letter')
     //.matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
     //.matches(/\d/, 'Password must have a number')
     //.min(8, ({min}) => `Clave debe ser menos por lo menos de 6 ${min} caracteres`)
     .required('Contraseña es requerida')
     .min(3, 'Debe tener mínimo 3 carácteres')
     .max(50, 'Debe tener máximo 50 carácteres')
     .label('Contraseña'),
});


const NuevaClave = ({navigation, route}) => {

    /* useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Ingreso')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const initValuesForm = {
        clave: '',
        clave2: ''
    }

    const [valuesForm, setValuesForm] = useState(initValuesForm);

    const isFocused = useIsFocused();
    const usuario = useSelector(state => state.usuario)
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [disabledBoton, setDisabledBoton] = useState(false);
    const [errorLogin, setErrorLogin] = useState("");

    const borrarError = () => {
        setErrorLogin("");
    }

    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

    const { passwordVisibility2, rightIcon2, handlePasswordVisibility2 } =
    useTogglePasswordVisibility();

    const handleOnSubmit = (values, actions) => {

        setDisabledBoton(true);

        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const clave = valoresArray["clave"];

        axios
        .post(APP_URLAPI + 'resetpassw',
            {            
                clave: clave,
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {
            ////console.log(response.data);
            if (response.data.code==0){
                                
                setIsLoading(false);
                setDisabledBoton(false);
                navigation.navigate('Panel')
            }else{
                setIsLoading(false);
                setDisabledBoton(false);
                setErrorLogin("No se pudo asignar la nueva clave, por favor intente nuevamente");
            }
        }).catch(function (error) {
            setIsLoading(false);
            setDisabledBoton(false);
            setErrorLogin("No se pudo asignar la nueva clave, por favor intente nuevamente");
            ////console.log(error);
        })
    };     

    return (
        <ImageBackground source={require('../../../assets/img/ingreso-back.jpg')} resizeMode="cover" style={styles.imageBack}> 
        <SafeAreaView style={{justifyContent: "center", flex: 1}}>
        <View style={styles.container}> 

            <Formik
                initialValues={valuesForm}                    
                validationSchema={validationSchema}
                onSubmit={handleOnSubmit}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                    <View>
                        <View style={{justifyContent: "center", alignItems: "center"}}> 
                            <Image 
                                style={styles.img}
                                source={require('../../../assets/img/registro_clave.jpg')}
                            />
                        </View>
                        <Text 
                            style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center", marginBottom: 20}}
                        >
                            Cree su nueva contraseña
                        </Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                onChangeText={handleChange('clave')}
                                onKeyPress={borrarError}
                                value={values.clave}
                                placeholder='Contraseña'
                                style={styles.inputField}
                                secureTextEntry={passwordVisibility}
                            />
                            <Pressable onPress={handlePasswordVisibility}>
                                <Icon size={20} name={rightIcon} color={"#232323"}  />
                            </Pressable>
                        </View>
                        {
                            errors.clave ? 
                            <Text style={{color: 'red'}}>{errors.clave}</Text>: null
                        }
                     
                        <View style={styles.inputContainer}>
                            <TextInput
                                onChangeText={handleChange('clave2')}
                                onKeyPress={borrarError}
                                value={values.clave2}
                                placeholder='Repetir Contraseña'
                                style={styles.inputField}
                                secureTextEntry={passwordVisibility2}
                            />
                            <Pressable onPress={handlePasswordVisibility2}>
                                <Icon size={20} name={rightIcon2} color={"#232323"}  />
                            </Pressable>
                        </View>
                        {
                            errors.clave ? 
                            <Text style={{color: 'red'}}>{errors.clave2}</Text>: null
                        }

                      

                        <TouchableOpacity 
                            disabled={disabledBoton}
                            onPress={handleSubmit}
                            style={{textAlign: "center", marginTop: 10, margin: 12, borderRadius: 10}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: isLoading ? COLORBOTONPRINCIPAL : COLORBOTONPRINCIPAL,
                                }}
                            >                              
                                <Text 
                                    style={styles.buttonText}>
                                    {
                                        isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : "Guardar"}
                                </Text>                            
                            </View>
                        </TouchableOpacity>                                                
                        
                    </View>            
                )}
            </Formik>          
        
        </View>        
      </SafeAreaView>
      </ImageBackground>
    );
};



const styles = StyleSheet.create({
    container: {
      backgroundColor: '#FFF',
      color: '#FFFFFF',
      marginTop: 50,
      borderColor: '#D8DAD8',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRadius: 10,
      marginLeft: 20,
      marginRight: 20,
      paddingBottom: 30, 
      paddingHorizontal: 20
    },
    inputContainer: {
        backgroundColor: 'white',
        width: '95%',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#d7d7d7',
        marginTop: 15
    },
    fuente: {
        color: '#FFFFFF'
    },
    text: {
        fontSize: 30,
        marginTop: 0,
        marginBottom: 20,
        paddingHorizontal: 40,
        textAlign: "center"
    },
    img: {
        marginTop: 20,
        height: 150,
        width: 250,
        resizeMode: 'contain'
    },
    input: {
        height: 48,
        marginLeft: 12,
        marginRight: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: "#AFAFAF",
        borderRadius: 10
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
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 15,
        textAlign: "center",
        justifyContent: "center",
        paddingVertical: 2
    },
    imageBack: {
        flex: 1,
        justifyContent: "center"
    }, 
});

export default NuevaClave
