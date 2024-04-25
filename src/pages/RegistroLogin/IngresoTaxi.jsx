import React, { useState, Component, useContext, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, ImageBackground, Pressable, BackHandler } from 'react-native'
import { ScrollView } from "react-native-gesture-handler";

import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL } from '@env'
import Icon from 'react-native-vector-icons/FontAwesome5';

import { Formik } from 'formik'
import { Link } from 'react-router-native';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';
import * as Yup from 'yup';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux';
import { actualizar } from '../../app/usuarioSlice';

import { useTogglePasswordVisibility } from './useTogglePasswordVisibility';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";


import * as Device from 'expo-device';
import registerforPushNotificationsAsync from '../../components/registerForPushNotificationsAsync';

import {CountryPicker} from "react-native-country-codes-picker";


import * as Location from 'expo-location';



/* 
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  }); */

const validationSchema = Yup.object().shape({
   // name: Yup.string().required('Name is required').label('Name'),
    email: Yup.string()
/*     .email('Ingrese un email válido')
 */    
    //.required('Email / WhatsApp es obligatorio')
    .label('Email'),


    
    clave: Yup.string() 
    //.matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    //.matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    //.matches(/\d/, 'Password must have a number')
    //.min(8, ({min}) => `Clave debe ser menos por lo menos de 6 ${min} caracteres`)
    .required('Contraseña es obligatoria')
    .label('Password'),
});

const IngresoTaxi = ({navigation, route}) => {

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

    const parametros = useSelector(state => state.parametros)

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const isFocused = useIsFocused();
    const formikRef = useRef();
    const [tipoLogin, setTipoLogin] = useState('email');
    const [usuarioConectado, setUsuarioConectado] = useState();

    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

    const dispatch = useDispatch()
    const [isLoadingScreen, setIsLoadingScreen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingInvitado, setIsLoadingInvitado] = useState(false);
    const [isLoadingPasajero, setIsLoadingPasajero] = useState(false);
    const [isLoadingConductor, setIsLoadingConductor] = useState(false);
    const [disabledBoton, setDisabledBoton] = useState(false);

    const handleOnSubmitEnviar = (values, actions) => {
        setIsLoading(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, actions);
        }, 100);
    }

  /*   useEffect(() => {
    if (!isFocused){return;}
        //////console.log("entro:");
        if (intervalId){
            clearInterval(intervalId);
            //////console.log("borro");
        }
    }, [isFocused]); */

    const borrarError = () => {
        setErrorLogin("");
    }

    const cerrarSesionDemo = async () => {
        
        AsyncStorage.clear();
        getUsuarioConectado(); 
    };

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
    }else if (COMPANIA_ID==382){        
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
   
    useEffect(() => {
        /*
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
    
            
            axios
            .post(APP_URLAPI + 'registertokenpush',
                {                    
                    token: "62c1e33b05f82",
                    tokenpush: token,
                compania: COMPANIA_ID
                }
            )   
            .then(response => {
                ////////console.log(response);
                if (response.data.code==0){
    
                    ////////console.log(response.data);
                    
                    
                }else{
                    //setIsLoading(false);
                    //setErrorLogin("Email / Clave inválidos, por favor verifique");
                    //errorLogin = "Email / Clave inválidos, por favor verifique";                
                }
            }).catch(function (error) {
                //setIsLoading(false);
                //setErrorLogin("Error en la conexión al servidor, \n por favor intente nuevamente\n");
                ////////console.log(error);
            })
    
    
          }
        );
        */
    /* 
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          ////////console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        }; */

        /* if (COMPANIA_ID==373){
            setCountryCode("+591");
            let valores = [
                'BO'
            ]
            setPaisesWhatsApp(valores)
        } */

    }, [useIsFocused]);
    
    const handleOnSubmitEnviar2 = (values, actions) => {
        
        //let usuariovalor = "";
        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const email = valoresArray["email"];
        const whatsapp = valoresArray["whatsapp"];
        const clave = valoresArray["clave"];

        iniciarSesion(email, clave, whatsapp);        
    };

    const iniciarSesion = async (email, clave, whatsapp) => {

        setErrorLogin(false);
        setDisabledBoton(true);

        whatsapp = countryCode+whatsapp;
    
        axios
        .post(APP_URLAPI + 'login',
            {                    
                email: email,
                whatsapp: whatsapp,
                tipologin: tipoLogin,
                clave: clave,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {

            //console.log("Inicio");
            //console.log(response.data);
            if (response.data.code==0){

                let valores = {
                    idUsuario: response.data.data.idusuario,
                    nombreUsuario: response.data.data.nombre,
                    apellidoUsuario: response.data.data.apellido,
                    whatsappUsuario: response.data.data.whatsapp,
                    emailUsuario: response.data.data.email,
                    perfilUsuario: response.data.data.perfil,
                    fechaRegistro: response.data.data.fecharegistro,
                    tokenRegistro: response.data.token,
                    codigoVerificar: response.data.codigoverificar,
                    qrUsuario: response.data.data.usuarioqr,
                    codigoReferido: response.data.data.referidocodigo,
                    estatusCodigo: response.data.data.estatuscod,
                    estatusNombre: response.data.data.estatusnombre
                }

                

                ////////console.log("Inicio Correcto");
                ////////console.log(response.data);

                //usuariovalor = response.data.codigoverificar
                
                
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));

                dispatch(actualizar(valores))             
                setIsLoading(false);
                setIsLoadingPasajero(false);
                setIsLoadingConductor(false);
                setDisabledBoton(false); 
                setErrorLogin(false);
                //formikRef.current?.resetForm()
                if (response?.data?.data?.reset == "1"){ // Reiniciar clave      
                    ////console.log("NuevaClave");              
                    navigation.navigate('NuevaClave')
                } 
                else if (response.data.data.verificado == "0"){
                    ////console.log("Inicio Correcto, falta verificacion");
                    navigation.navigate('ConfirmarRegistro')
                }else{   
                    ////console.log("Inicio Correcto");
                    navigation.navigate('Panel')
                }
                
            }else{
                //resetForm({values: ""})
                //formikRef.current?.resetForm()
                setIsLoading(false);
                setIsLoadingPasajero(false);
                setIsLoadingConductor(false);

                if (tipoLogin=="whatsapp"){
                    setErrorLogin("WhatsApp / Clave inválidos, por favor verifique");
                }else{
                    setErrorLogin("Email / Clave inválidos, por favor verifique");
                }
                
                //errorLogin = "Email / Clave inválidos, por favor verifique";     
                setDisabledBoton(false);           
            }
        })                
        .catch(function (error) {
            //formikRef.current?.resetForm()
            setIsLoading(false);
            setIsLoadingPasajero(false);
            setIsLoadingConductor(false);
            setErrorLogin("Error en la conexión al servidor, \n por favor intente nuevamente\n");
            //////console.log(error);
            setDisabledBoton(false);           
        })


    }

    const ingresarPasajero = async () => {
        setIsLoadingPasajero(true);
        let email = "pasajero"; 
        let clave = "123";
        iniciarSesion(email, clave);  
    };

    const ingresarConductor = async () => {
        setIsLoadingConductor(true);
        let email = "conductor";
        let clave = "123";
        iniciarSesion(email, clave);  
    };

    const ingresarInvitado = async () => {
        
        let valores = {
            idUsuario: "",
            nombreUsuario: "",
            emailUsuario: "",
            perfilUsuario: "",
            fechaRegistro: "",
            tokenRegistro: "",
            codigoVerificar: ""
        }
        
        dispatch(actualizar(valores)) 
        navigation.navigate('Panel')
    };

    const cambiarTipoLogin = async () => {
        
        if (tipoLogin=="whatsapp"){
            setTipoLogin("email")
        }else{
            setTipoLogin("whatsapp")
        }
    };

    useEffect(() => {

        console.log("parametrosss"); 
        console.log(parametros);
        //setIsLoadingScreen(true);

        ////console.log("entro useeffect ingreso");

        if (route.params?.salir){
            setUsuarioConectado("");
            dispatch(actualizar(false))    
                  
        }

        setIsLoadingScreen(false);   

        /*
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
    
            
            axios
            .post(APP_URLAPI + 'registertokenpush',
                {                    
                    token: "62c1e33b05f82",
                    tokenpush: token,
                compania: COMPANIA_ID
                }
            )   
            .then(response => {
                ////////console.log(response);
                if (response.data.code==0){
    
                    ////////console.log(response.data);
                    
                    
                }else{
                    //setIsLoading(false);
                    //setErrorLogin("Email / Clave inválidos, por favor verifique");
                    //errorLogin = "Email / Clave inválidos, por favor verifique";                
                }
            }).catch(function (error) {
                //setIsLoading(false);
                //setErrorLogin("Error en la conexión al servidor, \n por favor intente nuevamente\n");
                ////////console.log(error);
            })
    
    
          }
        );
        */
    /* 
        // This listener is fired whenever a notification is received while the app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
          setNotification(notification);
        });
    
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
          ////////console.log(response);
        });
    
        return () => {
          Notifications.removeNotificationSubscription(notificationListener.current);
          Notifications.removeNotificationSubscription(responseListener.current);
        }; */

        /* if (COMPANIA_ID==373){
            setCountryCode("+591");
            let valores = [
                'BO'
            ]
            setPaisesWhatsApp(valores)
        } */
       

    }, [useIsFocused, route.params?.salir]);    

    const [errorLogin, setErrorLogin] = useState("");

    return (
        <>
        {
        isLoadingScreen ? null
        :        
        <ImageBackground source={require('../../../assets/img/ingreso-back.jpg')} resizeMode="cover" style={styles.imageBack}> 
        <SafeAreaView>
        <ScrollView>
            <View style={styles.container}> 
                <View style={{justifyContent: "center", alignItems: "center"}}>         
                    <Image 
                        style={styles.img}
                        source={require('../../../assets/img/logologin.png')}
                    />
                </View>
                <Formik
                    initialValues={{email: '', clave: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmitEnviar}
                    innerRef={formikRef}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                        <View>
                            <Text 
                                style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center"}}
                            >
                                Inicie Sesión
                            </Text>
                            <TouchableOpacity
                                onPress={cambiarTipoLogin}
                                style={{textAlign: "center", marginTop: 6, justifyContent: "center"}}                                
                            >
                                <Text 
                                style={{marginTop: 5, fontSize: 14, color: COLORBOTONPRINCIPAL, textAlign: "center"}}>
                                    {
                                        tipoLogin=="whatsapp" ?
                                        '(Cambiar ingreso con Email)'
                                        : '(Cambiar ingreso con WhatsApp)'
                                    }
                                    
                                </Text>                                
                            </TouchableOpacity>


                            {
                            errorLogin ?
                                <View style={{justifyContent: "center", alignItems: "center", marginTop: 8, width: "100%", marginBottom: 0}}>
                                    <View style={{backgroundColor: "#EACDC9",  borderRadius: 5, padding: 20, width: "95%"}}>
                                        <Text style={{color: "#B24031", fontSize: 14, textAlign: "center"}}>{errorLogin}</Text>
                                    </View>                
                                </View>
                                : null
                            }


                            {
                                tipoLogin=="whatsapp" ? 
                                <View style={styles.inputContainer}>
                                    <TextInput                            
                                        onChangeText={handleChange('whatsapp')}
                                        onKeyPress={borrarError}
                                        value={values.whatsapp}
                                        placeholder='WhatsApp'
                                        style={styles.inputField}
                                        keyboardType={"number-pad"}
                                    />
                                </View> 
                                : null 
                            }                           
                            {
                                errors.whatsapp ? 
                                <Text style={{color: 'red'}}>{errors.whatsapp}</Text>: null
                            }

                            {
                                tipoLogin=="email" ? 

                                <View style={styles.inputContainer}>

                                    <TextInput                            
                                        onChangeText={handleChange('email')}
                                        onKeyPress={borrarError}
                                        value={values.email}
                                        placeholder='Email'
                                        style={styles.inputField}
                                    />                            
                                </View> : null
                            }
                            {
                                errors.email ? 
                                <Text style={{color: 'red'}}>{errors.email}</Text>: null
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
                            {
                                errors.clave ? 
                                <Text style={{color: 'red'}}>{errors.clave}</Text>: null
                            }
                            {
                                parametros?.valor?.habilitarregistro == "1" ?
                                <View style={styles.textContainer}>
                                    <TouchableOpacity                                    
                                        style={{textAlign: "right", justifyContent:"flex-end", flex: 1}}
                                        onPress={() => navigation.navigate('OlvidoClave')} title="Olvido de Clave"
                                    >
                                        <Text 
                                        style={{marginTop: 5, fontSize: 14, color: COLORBOTONPRINCIPAL, textAlign: "right"}}>
                                            ¿Olvidó su contraseña?
                                        </Text>                                
                                    </TouchableOpacity>  
                                </View>  
                                :
                                null
                            }                       
                            
                            <TouchableOpacity 
                                onPress={handleSubmit}
                                style={{textAlign: "center", marginTop: 15, margin: 12, borderRadius: 10, justifyContent: "center", marginLeft: 0}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: isLoading ? COLORBOTONPRINCIPAL : COLORBOTONPRINCIPAL,
                                    }}
                                >       
                                    <Icon size={20} name="user" color={"#FFFFFF"}  />                        
                                    <Text 
                                        style={styles.buttonText}>
                                        {
                                            isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Ingresar"
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                disabled={disabledBoton}
                               onPress={ingresarInvitado}
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center", marginLeft: 0}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#3F3E3E",
                                    }} 
                                >   
                                    <Icon size={20} name="eye" color={"#FFFFFF"}  /> 
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} 
                                        {
                                            isLoadingInvitado ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Ingresar como invitado"
                                        }

                                    </Text>                            
                                </View>
                            </TouchableOpacity>                            
                            {
                                parametros?.valor?.habilitardemo == "1" ?
                                <TouchableOpacity 
                                    onPress={() => navigation.navigate('IngresoTaxiDemo')}
                                    style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center", marginLeft: 0 }}>
                                    <View
                                        style={{
                                            ...styles.button,
                                            backgroundColor: "#286A04",
                                        }} 
                                    >   
                                        <Icon size={20} name="car" color={"#FFFFFF"}  /> 
                                        <Text 
                                            style={styles.buttonText}>
                                            {' '} 
                                            {
                                                isLoadingConductor ? 
                                                <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : 
                                                COMPANIA_ID=="398" ?
                                                " Usuarios Demo"
                                                :
                                                " Usuarios Demo"
                                            }
                                        </Text>                            
                                    </View>
                                </TouchableOpacity> 
                                : null
                            }
                            
                            {
                                parametros?.valor?.habilitarregistro == "1" ?
                                <TouchableOpacity
                                    disabled={disabledBoton}
                                    style={{textAlign: "center", marginTop: 6, justifyContent: "center"}}
                                    onPress={() => navigation.navigate('TipoRegistro')} title="Registrate"
                                >
                                    <Text 
                                    style={{marginTop: 5, fontSize: 16, color: COLORBOTONPRINCIPAL, textAlign: "center"}}>
                                        ¿No tienes una cuenta?
                                    </Text>
                                    <Text 
                                        style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center"}}
                                    >
                                        <Icon size={20} name="user-plus" color={COLORBOTONPRINCIPAL}  /> 
                                        {' '}
                                        Registrate
                                    </Text>
                                </TouchableOpacity>
                                : null
                            }

                        </View>            
                    )}
                </Formik>
            </View>        
        </ScrollView>
        </SafeAreaView>
        </ImageBackground>
        }
      </>
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
    textContainer: {        
        width: '95%',
        borderRadius: 5,
        flexDirection: 'row',
        marginTop: 7
    },
    inputField: {
        padding: 10,
        width: '90%'
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
        height: 100,
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
        borderRadius: 10,
        marginTop: 0
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
    imageBack: {
        flex: 1,
        justifyContent: "center"
    }, 
});

export default IngresoTaxi


//const count = useSelector(state => state.counter.value)
/*
export default class Ingreso extends Component {

    _renderCounter = () => {
        const [exerciseCount, setExerciseCount] = useContext(ExerciseContext);
        
        ////////console.log(66);
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
        ////////console.log(1212);
    
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

                ////////console.log(response.data);
                
                let usuario = {
                    id: 12345,
                    nombre: 'Josee',
                    email: email
                }
                
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(usuario));

                //setState({usuarioNombre: email})
                //const MyInlineHook = this._renderCounter();
                this.Prueba(email)

                //////////console.log(this.state.usuarioNombre)



                //this.context.actualizarNombre(email)

                //setEmailUsuario(email);

                ////////console.log("Inicio Correcto.");

                this.props.navigation.navigate('Panel')
            }else{
                alert("Error iniciando");
            }
        }).catch(function (error) {
            ////////console.log(error);
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
 