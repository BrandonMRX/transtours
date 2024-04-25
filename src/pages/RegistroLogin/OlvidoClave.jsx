import React, { useState, Component, useContext, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, ImageBackground, Pressable, BackHandler } from 'react-native'

import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
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
import Toast from 'react-native-toast-message';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";


const validationSchema = Yup.object().shape({
    email: Yup.string() 
    .required('Email es obligatorio')
    .label('Email'),    
});



const OlvidoClave = ({navigation, route}) => {

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Ingreso')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const formikRef = useRef();

    const [errorLogin, setErrorLogin] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [disabledBoton, setDisabledBoton] = useState(false);

    const borrarError = () => {
        setErrorLogin("");
    }
    
    const handleOnSubmitEnviar = (values, actions) => {
        
        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const email = valoresArray["email"];

        setIsLoading(true);
        setErrorLogin(false);
        setDisabledBoton(true);

        axios
        .post(APP_URLAPI + 'olvidoclavepassw',
            {                    
                email: email,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {

            ////console.log("Olvido de Clave");
            ////console.log(response.data);
            if (response.data.code==0){

                setDisabledBoton(false);     
                setIsLoading(false);            

                if (response.data.data.correcto == "1"){

                    Toast.show({
                        type: 'success',
                        text1: 'Clave de recuperación enviada por email'
                    });

                    navigation.navigate('IngresoTaxi')
                    setErrorLogin(false);                                                    
                }else{
                    setErrorLogin("Error no se pudo reiniciar la contraseña, \n por favor intente nuevamente\n");                                                    
                }

                
            }else{

                setErrorLogin("Email no existe, por favor verifique");
                setDisabledBoton(false);  
                setIsLoading(false);               
            }
        })                
        .catch(function (error) {                        
            setErrorLogin("Error en la conexión al servidor, \n por favor intente nuevamente\n");            
            setDisabledBoton(false);     
            setIsLoading(false);      
        })


    };

    
    

    return (
        
        <ImageBackground source={require('../../../assets/img/ingreso-back.jpg')} resizeMode="cover" style={styles.imageBack}> 
        <SafeAreaView style={{justifyContent: "center"}}>
            <View style={styles.container}> 
                <View style={{alignItems: "center"}}>         
                    <Image 
                        style={styles.img}
                        source={require('../../../assets/img/logologin.png')}
                    />
                </View>
                <Formik
                    initialValues={{email: ''}}
                    validationSchema={validationSchema}
                    onSubmit={handleOnSubmitEnviar}
                    innerRef={formikRef}
                >
                    {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                        <View>
                            <Text 
                                style={{marginTop: 10, fontSize: 20, fontWeight: "bold", color: COLORHEADER, textAlign: "center"}}
                            >
                                Recuperación de Contraseña 
                            </Text>

                            {
                            errorLogin ?
                                <View style={{justifyContent: "center", alignItems: "center", marginTop: 8, width: "100%", marginBottom: 0}}>
                                    <View style={{backgroundColor: "#EACDC9",  borderRadius: 5, padding: 20, width: "95%"}}>
                                        <Text style={{color: "#B24031", fontSize: 14, textAlign: "center"}}>{errorLogin}</Text>
                                    </View>                
                                </View>
                                : null
                            }


                            <View style={styles.inputContainer}>
                                <TextInput                            
                                    onChangeText={handleChange('email')}
                                    onKeyPress={borrarError}
                                    value={values.email}
                                    placeholder='Email'
                                    style={styles.inputField}
                                />
                            </View>
                            {
                                errors.email ? 
                                <Text style={{color: 'red'}}>{errors.email}</Text>: null
                            }
                                                       
                            <TouchableOpacity 
                                onPress={handleSubmit}
                                style={{textAlign: "center", marginTop: 15, margin: 12, borderRadius: 10, justifyContent: "center", marginLeft: 0}}>
                                <View
                                    style={{
                                        ...styles.button,
                                        backgroundColor: isLoading ? COLORHEADER : COLORHEADER,
                                    }}
                                >       
                                    <Icon size={20} name="user" color={"#FFFFFF"}  />                        
                                    <Text 
                                        style={styles.buttonText}>
                                        {
                                            isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Recuperar Clave"
                                        }
                                    </Text>                            
                                </View>
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                disabled={disabledBoton}
                                style={{textAlign: "center", marginTop: 6, justifyContent: "center"}}
                                onPress={() => navigation.navigate('IngresoTaxi')} title="Ingreso"
                            >
                                <Text 
                                style={{marginTop: 5, fontSize: 16, color: COLORBOTONPRINCIPAL, textAlign: "center"}}>
                                    Volver al inicio
                                </Text>                               
                            </TouchableOpacity> */}

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

export default OlvidoClave


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
 