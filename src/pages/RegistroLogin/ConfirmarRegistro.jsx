import React, { useState, Component, useContext, useEffect, useCallback} from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, Animated, BackHandler  } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, COLORBOTONPRINCIPAL, DEMO } from '@env'
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

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
  } from 'react-native-confirmation-code-field';

import styles, {
    ACTIVE_CELL_BG_COLOR,
    CELL_BORDER_RADIUS,
    CELL_SIZE,
    DEFAULT_CELL_BG_COLOR,
    NOT_EMPTY_CELL_BG_COLOR,
  } from '../styles';
  
  const {Value, Text: AnimatedText} = Animated;
  
  const CELL_COUNT = 4;
  const source = {
    uri: 'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
  };


const validationSchema = Yup.object().shape({

});

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const ConfirmarRegistro = ({navigation, route}) => {

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
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const [disabledBoton, setDisabledBoton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const renderCell = ({index, symbol, isFocused}) => {
        const hasValue = Boolean(symbol);
        const animatedCellStyle = {
        backgroundColor: hasValue
            ? animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
            })
            : animationsColor[index].interpolate({
                inputRange: [0, 1],
                outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
            }),
        borderRadius: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
        }),
        transform: [
            {
            scale: animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 1],
            }),
            },
        ],
        };

        // Run animation on next event loop tik
        // Because we need first return new style prop and then animate this value
        setTimeout(() => {
        animateCell({hasValue, index, isFocused});
        }, 0);

        return (
        <AnimatedText
            key={index}
            style={[styles.cell, animatedCellStyle]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor /> : null)}
        </AnimatedText>
        );
    };

    const borrarError = () => {
        setErrorLogin("");
    }

    const usuario = useSelector(state => state.usuario)

    const dispatch = useDispatch()

    const handleOnSubmitEnviar = (values, actions) => {
        //////////console.log(90);
        setIsLoading(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, actions);
        }, 100);
    }


    const handleOnSubmitEnviar2 = (values, actions) => {

        const valores = JSON.stringify(values, null, 2);
        const valoresArray = JSON.parse(valores);

        const codigo = value;
        const token = valoresArray["token"];
        //const token = "62c0e7753f9fa";

        setDisabledBoton(true);
        //////////console.log("value:"+value);

        
        axios
        .post(APP_URLAPI + 'verificarregistro',
            {            
                codigo: codigo,        
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {
            console.log("confirmar registro");
            console.log(response.data);
            //////console.log("confirmar registro");
            //////console.log(response.data);
            /* ////console.log("confirmar registro");
            ////console.log(response.data);
            ////console.log("usuario.codigoVerificar");
            ////console.log(usuario.codigoVerificar);
            ////console.log("codigo");
            ////console.log(codigo);
            ////console.log("response.data.code");
            ////console.log(response.data.code); */
            if (usuario.codigoVerificar==""){
                navigation.navigate('Ingreso')
            }

            

            if (response.data.code==0){

                //////console.log("AAA");

                let valores = {
                    idUsuario: response.data.data.idusuario,
                    nombreUsuario: response.data.data.nombre,
                    apellidoUsuario: response.data.data.apellido,
                    whatsappUsuario: response.data.data.whatsapp,
                    ciudadUsuario: response.data.data.ciudad,
                    emailUsuario: response.data.data.email,
                    fechaRegistro: response.data.data.fecharegistro,
                    tokenRegistro: response.data.token,                    
                    qrUsuario: response.data.data.usuarioqr,
                    codigoVerificar: response.data.codigoverificar,
                    perfilUsuario: response.data.data.perfil,                    
                    codigoReferido: response.data.data.referidocodigo,
                    estatusCodigo: response.data.data.estatuscod,
                    estatusNombre: response.data.data.estatusnombre,
                    tipoUsuario: response.data.data.tipousuario
                }
                //////console.log("B");

                //usuariovalor = response.data.codigoverificar
                //////console.log("C");
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));
                //////console.log("D");
                dispatch(actualizar(valores))  
                //////console.log("E");
                /*
                ////////console.log(response.data);
                
                let valores = {
                    idUsuario: response.data.idusuario,
                    nombreUsuario: response.data.nombre,
                    emailUsuario: response.data.email,
                    tokenRegistro: response.data.token
                }
                
                AsyncStorage.setItem('usuarioconectado',JSON.stringify(valores));

                dispatch(actualizar(valores))             
                */
                //////console.log("Verificacion Correcto");
                setIsLoading(false);
                setDisabledBoton(false);
                setErrorLogin("");
                navigation.navigate('Panel')
            }else{
                setIsLoading(false);
                setDisabledBoton(false);
                setErrorLogin("Error codigo invalido, por favor verifique los datos");
            }
        }).catch(function (error) {
            setIsLoading(false);
            ////////console.log(error);
            setDisabledBoton(false);
            console.log("error confirmar registro");
            console.log(error);
        })
    };

    const [errorLogin, setErrorLogin] = useState("");

    const parametros = useSelector(state => state.parametros)

    return (
      <SafeAreaView style={styles.root}>
        <Text style={styles.title}>Complete el código</Text>
        <Image style={styles.icon} source={source} />
        <Text style={styles.subTitle}>                
            Por favor ingrese el código de verificación {'\n'}que le fue enviado vía email. {'\n'}(Puede revisar también en el correo no deseado)
            {
                parametros?.valor?.habilitardemo == "1" && usuario.codigoVerificar ?
                <>
                <Text style={{display: "none"}}>
                    .{'\n'} Codigo de verificación enviado: {usuario.codigoVerificar}
                </Text>
                </>
                : null
            }
        </Text>            
            
        <View style={styles.container}> 
            
            {
                errorLogin ? 
                <Text style={{color: 'red', textAlign:"center"}}>
                    {errorLogin}
                </Text>
                :
                null
            }
            
            <Formik
                initialValues={{codigo: ''}}
                validationSchema={validationSchema}
                onSubmit={handleOnSubmitEnviar}
            >
                {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                    <View style={{alignItems: "center"}}>
                        
                        <View>
                            <CodeField
                                ref={ref}
                                {...props}
                                value={value}
                                onChangeText={setValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={renderCell}
                                onPress={handleSubmit}
                                onKeyPress={borrarError}
                            />
                        </View>
                        <View>
                            <TouchableOpacity 
                                disabled={disabledBoton}
                                onPress={handleSubmit}
                                style={{textAlign: "center", marginTop: 15, margin: 12}}>
                                <View style={styles.nextButton}>
                                    
                                    {
                                        isLoading ?
                                        <>
                                            <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} />
                                        </>
                                        :<Text style={styles.nextButtonText}>Verificar</Text>
                                    }
                                    
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={{textAlign: "center", justifyContent: "center"}}
                            onPress={() => navigation.navigate('Ingreso')} title="Ingresar"
                        >                           
                            <Text 
                                style={{marginTop: 10, fontSize: 16, fontWeight: "bold", color: COLORBOTONPRINCIPAL, textAlign: "center"}}
                            >
                                <Icon size={20} name="user" color={COLORBOTONPRINCIPAL}  /> 
                                {' '}
                                Volver
                            </Text>
                        </TouchableOpacity>

                    </View> 
                    
                    
                               
                )}
            </Formik>
            
        </View>        
      </SafeAreaView>
    );
};


/*
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
        height: 170,
        width: 170,
        textAlign: "center",
        resizeMode: 'contain'
    },
    input: {
        height: 40,
        margin: 12,
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
        paddingVertical: 20,
        fontSize: 50, 
        paddingTop: 20
    },
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 24,
        textAlign: "center",
        paddingVertical: 8
    },
});
*/

export default ConfirmarRegistro


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
                    source={require('../../assets/img/logo.png')}
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
 