import React, { useState, Component, useContext, useCallback} from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList  } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'


import { Formik } from 'formik'
import { Link } from 'react-router-native';
import { isSearchBarAvailableForCurrentPlatform } from 'react-native-screens';
import * as Yup from 'yup';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSelector, useDispatch } from 'react-redux'
import { actualizar } from '../../app/usuarioSlice'

import {urlserver} from '@env'


const validationSchema = Yup.object().shape({
   // name: Yup.string().required('Name is required').label('Name'),
    email: Yup.string()
    .email('Ingrese un email válido')
    .required('Email es obligatorio')
    .label('Email'),
    
    clave: Yup.string() 
    //.matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    //.matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    //.matches(/\d/, 'Password must have a number')
    //.min(8, ({min}) => `Clave debe ser menos por lo menos de 6 ${min} caracteres`)
    .required('Contraseña es requerida')
    .label('Contraseña'),

    /*
    clave2: Yup.string()
    .string()
    .required()
    .oneOf([Yup.ref("clave"), null], "Las contraseñas no coinciden")
    */
});

const Registro = ({navigation}) => {

    /* useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Ingreso')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    );
 */
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false);

    const borrarError = () => {
        setErrorLogin("");
    }

    const handleOnSubmitEnviar = (values, actions) => {
        setIsLoading(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, actions);
        }, 100);
    }


    const handleOnSubmitEnviar2 = (values, actions) => {

        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const email = valoresArray["email"];
        const clave = valoresArray["clave"];
        const nombre = valoresArray["nombre"];

        //this.urlserver + 'http://localhost/gestiongo/backws/login',
        //# localhost
        //urlserver=http://localhost/gestiongo/

        //# server
        //# urlserver=https://www.sistemasgo.com/portfolio/agropecuaria/
        
        
        axios
        .post(APP_URLAPI + 'registro',
            {            
                nombre: nombre,        
                email: email,
                clave: clave,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {
            ////////console.log(response);
            if (response.data.code==0){

                //////////console.log(response.data);
                
                let valores = {
                    idUsuario: response.data.data.idusuario,
                    nombreUsuario: response.data.data.nombre,
                    emailUsuario: response.data.data.email,
                    fechaRegistro: response.data.data.fecharegistro,
                    tokenRegistro: response.data.token,
                    codigoVerificar: response.data.codigoverificar
                }
                
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));

                dispatch(actualizar(valores))         
                
                setIsLoading(false);

                ////////console.log("Registro Correcto");

                navigation.navigate('ConfirmarRegistro')
            }else{
                setIsLoading(false);
                setErrorLogin("Email ya se encuentra registrado, por favor verifique");
            }
        }).catch(function (error) {
            setIsLoading(false);
            setErrorLogin("Error en el registro, por favor verifique los datos");
            ////////console.log(error);
        })
    };

    const [errorLogin, setErrorLogin] = useState("");

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <View style={styles.container}> 
            <View style={{justifyContent: "center", alignItems: "center"}}>         
                <Image 
                    style={styles.img}
                    source={require('../../../assets/img/logologin.png')}
                />
            </View>
            <Formik
                initialValues={{email: 'prueba@gmail.com', clave: '123', clave2: '123', nombre: 'Jose'}}
                validationSchema={validationSchema}
                onSubmit={handleOnSubmitEnviar}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                    <View>
                        <Text 
                            style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center", marginBottom: 20}}
                        >
                            Registre su cuenta
                        </Text>

                        <Text style={{color: 'red', textAlign:"center"}}>
                            {errorLogin}
                        </Text>

                        <TextInput
                            onChangeText={handleChange('nombre')}
                            onKeyPress={borrarError}
                            value={values.nombre}
                            placeholder='Nombre'
                            style={styles.input}
                            
                        />
                        <Text style={{color: 'red'}}>{errors.nombre}</Text>
                        
                        <TextInput
                            onChangeText={handleChange('email')}
                            onKeyPress={borrarError}
                            value={values.email}
                            placeholder='Email'
                            style={styles.input}
                        />
                        <Text style={{color: 'red'}}>{errors.email}</Text>

                        <TextInput
                            onChangeText={handleChange('clave')}
                            onKeyPress={borrarError}
                            value={values.clave}
                            placeholder='Contraseña'
                            style={styles.input}
                            secureTextEntry={true} 
                        />
                        <Text style={{color: 'red'}}>{errors.clave}</Text>

                        <TextInput
                            onChangeText={handleChange('clave2')}
                            onKeyPress={borrarError}
                            value={values.clave2}
                            placeholder='Repetir Contraseña'
                            style={styles.input}
                            secureTextEntry={true} 
                        />
                        <Text style={{color: 'red'}}>{errors.clave2}</Text>

                        
                      
                        <TouchableOpacity 
                            onPress={handleSubmit}
                            style={{textAlign: "center", marginTop: 0, margin: 12, borderRadius: 10}}>
                            <View
                                style={{
                                    ...styles.button,
                                    backgroundColor: isLoading ? COLORBOTONPRINCIPAL : COLORBOTONPRINCIPAL,
                                }}
                            >                              
                                <Text 
                                    style={styles.buttonText}>
                                    {
                                        isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : "Crear cuenta"}
                                </Text>                            
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{textAlign: "center", marginTop: 5}}
                            onPress={() => navigation.navigate('Ingreso')} title="Ingresar"
                        >
                            <Text 
                            style={{marginTop: 0, fontSize: 18, color: COLORBOTONPRINCIPAL, justifyContent: "center", textAlign: "center"}}>
                                ¿Ya tienes una cuenta?
                            </Text>
                            <Text 
                                style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORBOTONPRINCIPAL, justifyContent: "center", textAlign: "center"}}
                            >
                                Ingresar
                            </Text>
                        </TouchableOpacity>
                        
                        
                    </View>            
                )}
            </Formik>
        </View>        
      </SafeAreaView>
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
        height: 220,
        width: 300,
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
});

export default Registro


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
 