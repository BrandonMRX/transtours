import React, { useState, Component, useContext, useEffect, useRef } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, ImageBackground  } from 'react-native'

import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

import { Formik } from 'formik'
import { Link } from 'react-router-native';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';
import * as Yup from 'yup';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux';
import { actualizar } from '../../app/usuarioSlice';

import {urlserver} from '@env';

import * as Device from 'expo-device';
import registerforPushNotificationsAsync from '../../components/registerForPushNotificationsAsync';
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
    .required('Email es obligatorio')
    .label('Email'),
    
    clave: Yup.string() 
    //.matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    //.matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    //.matches(/\d/, 'Password must have a number')
    //.min(8, ({min}) => `Clave debe ser menos por lo menos de 6 ${min} caracteres`)
    .required('Contraseña es requerida')
    .label('Password'),
});



const IngresoTaxiDemo = ({navigation, route}) => {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const isFocused = useIsFocused();

    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingInvitado, setIsLoadingInvitado] = useState(false);
    const [isLoadingPasajero, setIsLoadingPasajero] = useState(false);
    const [isLoadingConductor, setIsLoadingConductor] = useState(false);
    const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
    const [isLoadingAgencia, setIsLoadingAgencia] = useState(false);
    
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
    }, []);
    
    const handleOnSubmitEnviar2 = (values, actions) => {
        
        //let usuariovalor = "";
        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const email = valoresArray["email"];
        const clave = valoresArray["clave"];

        iniciarSesion(email, clave);        
    };

    const iniciarSesion = async (email, clave) => {

        setDisabledBoton(true);

        //console.log("en iniciarSesion");
    
        axios
        .post(APP_URLAPI + 'login',
            {                    
                email: email,
                clave: clave,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {

            console.log("login");
            console.log(response.data);

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
                
                //AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));

                ////console.log(valores);
                ////console.log(JSON.stringify(valores));

                dispatch(actualizar(valores))             
                setIsLoading(false);
                setIsLoadingPasajero(false);
                setIsLoadingConductor(false);
                setIsLoadingAgencia(false);
                setIsLoadingAdmin(false);

                setDisabledBoton(false); 
                setErrorLogin(false);
                if (response.data.data.verificado == "0"){
                    ////////console.log("Inicio Correcto, falta verificacion");
                    navigation.navigate('ConfirmarRegistro')
                }else{
                    ////////console.log("Inicio Correcto");
                    navigation.navigate('Panel')
                }
                
            }else{
                setIsLoading(false);
                setIsLoadingPasajero(false);
                setIsLoadingConductor(false);
                setIsLoadingAgencia(false);
                setIsLoadingAdmin(false);
                setErrorLogin("Email / Clave inválidos, por favor verifique");
                //errorLogin = "Email / Clave inválidos, por favor verifique";     
                setDisabledBoton(false);  
                ////console.log("aaa");         
            }
        })                
        .catch(function (error) {
            setIsLoading(false);
            setIsLoadingPasajero(false);
            setIsLoadingConductor(false);
            setIsLoadingAgencia(false);
            setIsLoadingAdmin(false);
            setErrorLogin("Error en la conexión al servidor, \n por favor intente nuevamente\n"); 
            console.log("error33");
            console.log(error);
            setDisabledBoton(false);           
        })
    }

    const ingresarPasajero = async () => {
        
        setIsLoadingPasajero(true);
        let email = "pasajero";
        let clave = "123";
        iniciarSesion(email, clave);  
    };

    const ingresarAgencia = async () => {
        
        setIsLoadingAgencia(true);
        let email = "agencia";
        let clave = "123";
        iniciarSesion(email, clave);  
    };

    const ingresarConductor = async () => {
        setIsLoadingConductor(true);
        let email = "conductor";
        let clave = "123";
        iniciarSesion(email, clave);  
    };

    const ingresarAdmin = async () => {
        setIsLoadingAdmin(true);
        let email = "admincompania";
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

    const [errorLogin, setErrorLogin] = useState("");

    return (
        
        <ImageBackground source={require('../../../assets/img/ingreso-back.jpg')} resizeMode="cover" style={styles.imageBack}> 
        <SafeAreaView style={{justifyContent: "center", flex: 1}}>
            <View style={styles.container}> 
               
                <Formik
                    initialValues={{email: '', clave: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmitEnviar}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                        <View>
                            <Text 
                                style={{marginTop: 20, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center", marginBottom: 20}}
                            >
                                Usuarios de demo
                            </Text>
        
                            <TouchableOpacity 
                                disabled={disabledBoton}
                                onPress={ingresarPasajero}
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>
                                <View style={{alignItems:"center", justifyContent: "center"}}>
                                    <Image
                                        source={require('../../../assets/img/pasajero.png')}
                                        style={{height: 70, width: 70, resizeMode: 'contain'}}
                                    /> 
                                </View>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#0B52AE",
                                        marginTop: 5
                                    }} 
                                >   
                                    <Icon size={20} name="user" color={"#FFFFFF"}  /> 
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} 
                                        {
                                            isLoadingPasajero ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Demo como Pasajero"
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                              
                            <TouchableOpacity 
                                disabled={disabledBoton}
                                onPress={ingresarAgencia}
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center", display: "none"}}>
                                <View style={{alignItems:"center", justifyContent: "center"}}>
                                    <Image
                                        source={require('../../../assets/img/registropasajero.jpg')}
                                        style={{height: 70, width: 70, resizeMode: 'contain'}}
                                    /> 
                                </View>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#286A04",
                                    }} 
                                >   
                                    <Icon size={20} name="user" color={"#FFFFFF"}  /> 
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} 
                                        {
                                            isLoadingAgencia? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Demo como Agencia"
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                                

                            <TouchableOpacity 
                                disabled={disabledBoton}
                                onPress={ingresarConductor}
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center"}}>

                                <View style={{alignItems:"center", justifyContent: "center"}}>
                                    <Image
                                        source={require('../../../assets/img/registroconductor.jpg')}
                                        style={{height: 70, width: 70, resizeMode: 'contain'}}
                                    /> 
                                </View>

                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#04626A",
                                    }} 
                                >   
                                
                                    <Icon size={20} name="car" color={"#FFFFFF"}  /> 
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} 
                                        {
                                            isLoadingConductor ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Demo como Conductor"
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                disabled={disabledBoton}
                                onPress={ingresarAdmin}
                                style={{textAlign: "center", marginTop: 5, margin: 12, borderRadius: 10, justifyContent: "center", display: "none"}}>

                                <View style={{alignItems:"center", justifyContent: "center"}}>
                                    <Image
                                        source={require('../../../assets/img/adminuser.png')}
                                        style={{height: 70, width: 70, resizeMode: 'contain'}}
                                    /> 
                                </View>

                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: "#D54F07",
                                    }} 
                                >   
                                
                                    <Icon size={20} name="user" color={"#FFFFFF"}  /> 
                                    <Text 
                                        style={styles.buttonText}>
                                        {' '} 
                                        {
                                            isLoadingAdmin ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Demo como Admin"
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                disabled={disabledBoton}
                                style={{textAlign: "center", marginTop: 6, justifyContent: "center"}}
                                onPress={() => navigation.navigate('Ingreso')} title="Volver"
                            >                               
                                <Text 
                                    style={{marginTop: 10, fontSize: 16, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center"}}
                                >
                                    Volver
                                </Text>
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

export default IngresoTaxiDemo


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
 