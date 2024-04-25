import React, { useState, Component, useContext, useEffect, useCallback} from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, ImageBackground, BackHandler, Pressable  } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER, REFERIDOS } from '@env'
import { ScrollView } from "react-native-gesture-handler";

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
import {CountryPicker} from "react-native-country-codes-picker";
import { useTogglePasswordVisibility } from './useTogglePasswordVisibility';
import { useTogglePasswordVisibility2 } from './useTogglePasswordVisibility2';

const validationSchemaPaso1 = Yup.object().shape({
   
   nombre: Yup.string()   
   .required('Nombre es obligatorio')
   .min(3, 'Debe tener mínimo 3 carácteres')
   .max(50, 'Debe tener máximo 50 carácteres')
   .label('Nombre'),

   apellido: Yup.string()   
   .required('Apellido es obligatorio')
   .min(3, 'Debe tener mínimo 3 carácteres')
   .max(50, 'Debe tener máximo 50 carácteres')
   .label('Apellido'),

   /* email: Yup.string()
    .email('Ingrese un email válido')
    .required('Email es obligatorio')
    .label('Email'), */

    whatsapp: Yup.string()    
    .required('Whatsapp es obligatorio')
    .min(8, 'Debe tener mínimo 8 carácteres')
    .max(50, 'Debe tener máximo 50 carácteres')
    .label('Whatsapp'),
       
});

const validationSchemaPaso2 = Yup.object().shape({       
     
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

 const validationSchemaPasoFinal = Yup.object().shape({
   
    referido: Yup.string()   
    .min(3, 'Debe tener mínimo 3 carácteres')
    .max(50, 'Debe tener máximo 50 carácteres')
    .label('Referido')
 });

const Registro = ({navigation, route}) => {

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

    // Select Pais
    const [show, setShow] = useState(false);
    
    
    let codigoWhatsAppInicial = "+54";
    let valores = []; 
    if (COMPANIA_ID==380){        
        valores = [
            'BO'
        ]    
        codigoWhatsAppInicial = "+591";    
    }else if (COMPANIA_ID==381){        
        valores = [
            'PE'
        ]    
        codigoWhatsAppInicial = "+51";    
    }else if (COMPANIA_ID==388){        
        valores = [
            'MX'
        ]    
        codigoWhatsAppInicial = "+52";    
    }
    
    const [countryCode, setCountryCode] = useState(codigoWhatsAppInicial);
    const [paisesWhatsApp, setPaisesWhatsApp] = useState(valores);

    let initValuesFormPaso1 = {
        nombre: '',  
        apellido: '', 
        email: '',  
        whatsapp: ''
    }

    let initValuesFormPaso2 = {
        clave: '',
        clave2: ''
    }
    

    const [valuesFormPaso1, setValuesFormPaso1] = useState(initValuesFormPaso1);
    const [valuesFormPaso2, setValuesFormPaso2] = useState(initValuesFormPaso2);
    const parametros = useSelector(state => state.parametros)
    const isFocused = useIsFocused();

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [disabledBoton, setDisabledBoton] = useState(false);
    const [pasoRegistro, setPasoRegistro] = useState(1);

    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

    const { passwordVisibility2, rightIcon2, handlePasswordVisibility2 } =
    useTogglePasswordVisibility2();

    const [errorLogin, setErrorLogin] = useState("");

    const borrarError = () => {
        setErrorLogin("");
    }

    const siguientePaso = () => {

        if (pasoRegistro==1){
            setPasoRegistro(2);
        }else if (pasoRegistro==2){
            setPasoRegistro(3);
        }
        
    }

    const volverPaso = () => {

        if (pasoRegistro==2){
            setPasoRegistro(1);
        }else if (pasoRegistro==3){
            setPasoRegistro(2);
        }
    }
    

    const handleOnSubmitEnviarPaso1 = (values, actions) => {

        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const nombre = valoresArray["nombre"];
        const apellido = valoresArray["apellido"];
        const email = valoresArray["email"];
        let whatsapp = valoresArray["whatsapp"];  
        let whatsappRegistrar = countryCode+whatsapp;
        
        const valoresForm = {
            nombre: nombre,  
            apellido: apellido, 
            email: email,  
            whatsapp: whatsapp,
            whatsappRegistrar: whatsappRegistrar
        }

        setValuesFormPaso1(valoresForm);

        siguientePaso();
                
    };

    const handleOnSubmitEnviarPaso2 = (values, actions) => {

        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const clave = valoresArray["clave"];

        const valoresForm = {
            clave: clave,
            clave2: clave
        }     

        setValuesFormPaso2(valoresForm);

        if (REFERIDOS == true ){
            siguientePaso();
        }else{
            handleOnSubmitEnviarFinal(null, null, valoresForm);
        }
        
        
    };

    const handleOnSubmitEnviarFinal = (values, actions, valoresFormClave) => {

        setIsLoading(true);
        setDisabledBoton(true);

        const nombre = valuesFormPaso1.nombre;
        const apellido = valuesFormPaso1.apellido;
        const email = valuesFormPaso1.email;
        const whatsapp = valuesFormPaso1.whatsapp;
        const whatsappRegistrar = valuesFormPaso1.whatsappRegistrar;                 

        let referido = "";
        let clave = "";

        if (values){
            const valores = JSON.stringify(values, null, 2);
            const valoresArray = JSON.parse(valores);

            referido = valoresArray["referido"];

            clave = valuesFormPaso2.clave;
        }else{
            clave = valoresFormClave.clave;
        }

        axios
        .post(APP_URLAPI + 'registro',
            {            
                nombre: nombre,        
                apellido: apellido,        
                email: email,
                clave: clave,
                whatsapp: whatsappRegistrar,
                referido: referido,
                tipo: route.params?.tipo,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {

            ////console.log(response.data);
            if (response.data.code==0){

                
                

                if (COMPANIA_ID == 380 && route.params?.tipo == "cliente"){
                    let valores = {
                        idUsuario: response.data.data.idusuario,
                        nombreUsuario: response.data.data.nombre,
                        emailUsuario: response.data.data.email,
                        whatsappUsuario: response.data.data.whatsapp,
                        fechaRegistro: response.data.data.fecharegistro,
                        tokenRegistro: response.data.token,
                        //codigoVerificar: response.data.codigoverificar,
                        perfilUsuario: response.data.data.perfil
                    }
                    
                    AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));
    
                    dispatch(actualizar(valores))         
                    
                    setIsLoading(false);
                    setDisabledBoton(false);
    
                    //////console.log("Registro Correcto");

                    navigation.navigate('Panel')
                }else{

                    let valores = {
                        //idUsuario: response.data.data.idusuario,
                        //nombreUsuario: response.data.data.nombre,
                        //emailUsuario: response.data.data.email,
                        //whatsappUsuario: response.data.data.whatsapp,
                        //fechaRegistro: response.data.data.fecharegistro,
                        tokenRegistro: response.data.token,
                        codigoVerificar: response.data.codigoverificar//,
                        //codigoVerificarWA: response.data.codigoverificarwa,
                        //perfilUsuario: response.data.data.perfil
                    }
                    
                    AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));
    
                    dispatch(actualizar(valores))         
                    
                    setIsLoading(false);
                    setDisabledBoton(false);
    
                    //////console.log("Registro Correcto");

                    navigation.navigate('ConfirmarRegistro')
                }

                
                
            }else{
                
                setPasoRegistro(1);
                setIsLoading(false);
                setDisabledBoton(false);
                setErrorLogin("Email / WhatsApp ya se encuentra registrado, por favor verifique");
            }
        }).catch(function (error) {
            setIsLoading(false);
            setDisabledBoton(false);
            setErrorLogin("Error en el registro, por favor verifique los datos");
            //console.log(error);
        })
    };    

    useEffect(() => {
        if (!isFocused){return;}
        setPasoRegistro(1);
    }, [isFocused]);

    return (
        <ImageBackground source={require('../../../assets/img/ingreso-back.jpg')} resizeMode="cover" style={styles.imageBack}> 
        <SafeAreaView style={{justifyContent: "center", flex: 1}}>
            <ScrollView>
        <View style={styles.container}> 
            
            {
                pasoRegistro == 1 ?
                <Formik
                    enableReinitialize={false}
                    initialValues={valuesFormPaso1}
                    validationSchema={validationSchemaPaso1}
                    onSubmit={handleOnSubmitEnviarPaso1}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                        <View>
                            <View style={{justifyContent: "center", alignItems: "center"}}> 
                                {                                   
                                    route.params?.tipo == "cliente" ?
                                    <Image 
                                        style={styles.img}
                                        source={require('../../../assets/img/registropasajero.jpg')}
                                    />
                                    :
                                    route.params?.tipo == "conductor" ? 
                                    <Image 
                                        style={styles.img}
                                        source={require('../../../assets/img/registroconductor.jpg')}
                                    />
                                    : 
                                    <Image 
                                        style={styles.img}
                                        source={require('../../../assets/img/logologin.png')}
                                    />
                                }        
                                
                            </View>
                            <Text 
                                style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center", marginBottom: 20}}
                            >
                                {                                   
                                    route.params?.tipo == "cliente" ?
                                    'Registrese como Pasajero'
                                    :
                                    route.params?.tipo == "conductor" ? 
                                    'Registrese como Conductor'
                                    : 'Registrese'
                                }
                                
                            </Text>

                            {
                            errorLogin ?
                                <View style={{justifyContent: "center", alignItems: "center", marginTop: 0, width: "100%", marginBottom: 10}}>
                                    <View style={{backgroundColor: "#EACDC9",  borderRadius: 5, padding: 20, width: "95%"}}>
                                        <Text style={{color: "#B24031", fontSize: 14, textAlign: "center"}}>{errorLogin}</Text>
                                    </View>                
                                </View>
                                : null
                            }

                            <View style={styles.inputContainer}>
                                <TextInput
                                    onChangeText={handleChange('nombre')}
                                    onKeyPress={borrarError}
                                    value={values.nombre}
                                    placeholder='Nombre'
                                    style={styles.inputField}                                    
                                />
                            </View>
                            
                            <Text style={{color: 'red'}}>{errors.nombre}</Text>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    onChangeText={handleChange('apellido')}
                                    onKeyPress={borrarError}
                                    value={values.apellido}
                                    placeholder='Apellido'
                                    style={styles.inputField}                                    
                                />
                            </View>

                            <Text style={{color: 'red'}}>{errors.apellido}</Text>
                            
                            
                            {
                                COMPANIA_ID == 380 && route.params?.tipo == "cliente" ? null
                                :
                                <>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            onChangeText={handleChange('email')}
                                            onKeyPress={borrarError}
                                            value={values.email}
                                            placeholder='Email'
                                            style={styles.inputField}
                                        />
                                    </View>
                                    <Text style={{color: 'red'}}>{errors.email}</Text>
                                </>
                            }

                            <View style={styles.inputContainer}>                              
                                <TextInput                            
                                    onChangeText={handleChange('whatsapp')}
                                    onKeyPress={borrarError}
                                    value={values.whatsapp}
                                    placeholder='Whatsapp'
                                    style={styles.inputField}
                                    keyboardType={"number-pad"}
                                />
                            </View>
                         
                            <Text style={{color: 'red'}}>{errors.whatsapp}</Text>                               
                            
                            <TouchableOpacity 
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
                                            isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : "Siguiente"}
                                    </Text>                            
                                </View>
                            </TouchableOpacity>                           
                            
                            <TouchableOpacity
                                disabled={disabledBoton}
                                style={{textAlign: "center", marginTop: 5}}
                                onPress={() => navigation.navigate('Ingreso')} title="Ingresar"
                            >
                                <Text 
                                style={{marginTop: 0, fontSize: 16, color: COLORBOTONPRINCIPAL, justifyContent: "center", textAlign: "center"}}>
                                    ¿Ya tienes una cuenta?
                                </Text>                            
                            </TouchableOpacity>                                                        
                        </View>            
                    )}
                </Formik>
                : null
            }
            
            {
                pasoRegistro == 2 ?
                <Formik
                    initialValues={valuesFormPaso2}                    
                    validationSchema={validationSchemaPaso2}
                    onSubmit={handleOnSubmitEnviarPaso2}
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
                                Cree su contraseña
                            </Text>

                            {
                            errorLogin ?
                                <View style={{justifyContent: "center", alignItems: "center", marginTop: 0, width: "100%", marginBottom: 10}}>
                                    <View style={{backgroundColor: "#EACDC9",  borderRadius: 5, padding: 20, width: "95%"}}>
                                        <Text style={{color: "#B24031", fontSize: 14, textAlign: "center"}}>{errorLogin}</Text>
                                    </View>                
                                </View>
                                : null
                            }

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
                            
                            <Text style={{color: 'red'}}>{errors.clave}</Text>

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

                          
                            <Text style={{color: 'red'}}>{errors.clave2}</Text>

                            <TouchableOpacity 
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
                                            isLoading ? 
                                            <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> 
                                            : 
                                            REFERIDOS == true
                                            ?
                                            "Siguiente"
                                            :
                                            "Crear Cuenta"
                                            
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                onPress={volverPaso}
                                style={{textAlign: "center", marginTop: 0, margin: 12, borderRadius: 10}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: isLoading ? COLORBOTONPRINCIPAL : COLORBOTONPRINCIPAL,
                                    }}
                                >                              
                                    <Text 
                                        style={styles.buttonText}>
                                        Atrás
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                            
                            
                        </View>            
                    )}
                </Formik>
                : null
            }
        </View>        
      </ScrollView>
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
    fuente: {
        color: '#FFFFFF'
    },
    inputField: {
        padding: 10,
        width: '90%'
    },
    inputContainer: {
        backgroundColor: 'white',
        width: '95%',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#d7d7d7',
        marginTop: 3
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

export default Registro


//const count = useSelector(state => state.counter.value)
/*
export default class Ingreso extends Component {

    _renderCounter = () => {
        const [exerciseCount, setExerciseCount] = useContext(ExerciseContext);
        
        //////console.log(66);
        //return <div>{ count }</div>
    }

    constructor(props) {
        super(props);
        this.state = {
          count: 0
        };
      }
  
    static contextType = ExerciseContext;

    
    
    isLoading = false;
    //const [emailUsuario, setEmailUsuario] = useState(false);


     animating = () => this.verificarConexion()

    //const [isLoading, setIsLoading] = useState(false);

    handleOnSubmitEnviar = (values, actions) => {
        //setIsLoading(true);

        setTimeout(() => {
            this.handleOnSubmitEnviar2(values, actions);
        }, 100);
    }

    Prueba = () => {

        const count = useSelector(state => state.counter.value)
        //const [user, setUser] = useState("Jesse Hall");
        //////console.log(1212);
    
    }


    handleOnSubmitEnviar2 = (values, actions) => {

        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const email = valoresArray["email"];
        const clave = valoresArray["clave"];

        axios
        .post('http://localhost/gestiongo/backws/login',
            {                    
                email: email,
                clave: clave
            }
        )   
        .then(response => {
            if (response.data.code==0){

                //////console.log(response.data);
                
                let usuario = {
                    id: 12345,
                    nombre: 'Josee',
                    email: email
                }
                
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(usuario));

                //setState({usuarioNombre: email})
                //const MyInlineHook = this._renderCounter();
                this.Prueba(email)

                ////////console.log(this.state.usuarioNombre)



                //this.context.actualizarNombre(email)

                //setEmailUsuario(email);

                //////console.log("Inicio Correcto.");

                this.props.navigation.navigate('Panel')
            }else{
                alert("Error iniciando");
            }
        }).catch(function (error) {
            //////console.log(error);
        })
    };

    
  
    render(){
    return (
        <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}> 
            <View style={{justifyContent: "center", alignItems: "center"}}>         
                <Image 
                    style={styles.img}
                    source={require('../../../assets/img/logo.png')}
                />
            </View>
            <Formik
                initialValues={{email: 'prueba@gmail.com', clave: '123'}}
                validationSchema={validationSchema}
                onSubmit={this.handleOnSubmitEnviar}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                    <View>
                        <TextInput
                            onChangeText={handleChange('email')}
                            value={values.email}
                            placeholder='Email'
                            style={styles.input}
                        />
                        <Text style={{color: 'red'}}>{errors.email}</Text>

                        <TextInput
                            onChangeText={handleChange('clave')}
                            value={values.clave}
                            placeholder='Contraseña'
                            style={styles.input}
                            secureTextEntry={true} 
                        />
                        <Text style={{color: 'red'}}>{errors.clave}</Text>

                        <TouchableOpacity
                        style={{textAlign: "right", paddingRight: 15}}
                        onPress={() => dispatch(increment())}

                        >
                            <Text title="Olvidé mi contraseña">
                                Olvidé mi contraseña
                            </Text>
                        </TouchableOpacity>

                      
                        <TouchableOpacity 
                            onPress={handleSubmit}
                            style={{textAlign: "center", marginTop: 15}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: this.isLoading ? COLORBOTONPRINCIPAL : COLORBOTONPRINCIPAL,
                                }}
                            >
                            
                                <Text 
                                    style={styles.buttonText}>
                                    {
                                        this.isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : "INGRESAR"
                                    }
                                    {this.usuarioNombre2}
                                    
                                </Text>                            
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity
                            style={{textAlign: "center", marginTop: 15}}
                            onPress={() => navigation.navigate('Registro')} title="REGISTRATE"
                        >
                            <Text>
                                ¿No tienes una cuenta?
                            </Text>
                            <Text 
                                style={{marginTop: 5, fontWeight: "bold", color: COLORBOTONPRINCIPAL}}
                            >
                                REGISTRATE
                            </Text>
                        </TouchableOpacity>
                    </View>            
                )}
            </Formik>
        </View>        
      </SafeAreaView>
      );
     }
};
  */
 


/*
const Inicio = () => { 
    return (
        <BarraNavegacion>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>
                    En Inicio2
                </Text>
            </View>
        </BarraNavegacion>
      );
}
*/
 