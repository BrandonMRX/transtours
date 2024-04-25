import React, { useState, useContext, Component, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, LogBox, ImageBackground, ActivityIndicator, BackHandler, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';

import { actualizar } from '../../app/usuarioSlice';
import { APP_URLAPI, COMPANIA_ID, COLORBOTONPRINCIPAL, DEMO, REFERIDOS } from '@env'
//import * as Location from 'expo-location';

import { ScrollView } from "react-native-gesture-handler";

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { solicitarPermisosUbicacion } from '../../components/Ubicacion/Ubicacion';
//import { BarCodeScanner } from 'expo-barcode-scanner';
import { Skeleton } from '@rneui/themed';


import Constants from "expo-constants";
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { width } from "deprecated-react-native-prop-types/DeprecatedImagePropType";
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

//import { registerForPushNotificationsAsync } from '../../components/Notificacion/Notificacion';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    }),
});
  
  async function registerForPushNotificationsAsync() {
  
    let token;
    if (Device.isDevice) { 
      //////console.log(333);
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
  
      //console.log("existingStatus:"+existingStatus);
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
  
      //console.log("finalStatus:"+finalStatus);
      if (finalStatus !== 'granted') {
       //console.log("sin permisos push:");
        //alert('Failed to get push token for push notification!');
        return;
      }
      //token = (await Notifications.getExpoPushTokenAsync());
      token = (await Notifications.getExpoPushTokenAsync()).data;
      
     //console.log("token4:");
     //console.log(token);
     // ////////console.log("token4fin");
    } else {
      ////console.log(222);
      //alert('Must use physical device for Push Notifications');
    }
  
      ////console.log(111);
      
      await Notifications.setNotificationChannelAsync('default', {
        name: 'taxipasajero',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],        
        enableVibrate: false
      });

      /* await Notifications.scheduleNotificationAsync({
        content: {
          title: "test6",
          sound: 'taxi.wav', // Provide ONLY the base filename
        },
        trigger: {
          seconds: 2,
          channelId: 'default',
        },
      }); */
      
    
  
    return token;
}


let usuarioGlobal= {};

const PanelTaxi = ({navigation, route}) => {


    

   /*  useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {navigation.navigate('Panel')
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    ); */

    const [sound, setSound] = useState();

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [conectado, setConectado] = useState('');

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [notificationInicial, setNotificationInicial] = useState(0);

    const notificationListener = useRef();
    const responseListener = useRef();

    

    const isFocused = useIsFocused();
    const usuario = useSelector(state => state.usuario)
    const parametros = useSelector(state => state.parametros)

    const [tipoServicioLista, setTipoServicioLista] = useState(false);

    const [viajesLista, setViajesLista] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingViajes, setIsLoadingViajes] = useState(true);
    const [isLoadingServicios, setIsLoadingServicios] = useState(false);
    const [totalViajesGratis, setTotalViajesGratis] = useState(0);


    const [modal, setModal] = useState(false);

    const handleOpen = async () => {
        //////console.log("en handleOpen");
        setModal(true);
    }

    const handleClose = async () => {
        //////console.log("en handleClose");
        setModal(false);
    }

    const alertaModal = async () => {
        //////console.log("en alertaModal");
    }
    

    const fetchData = async () => {
        //console.log("APP_URLAPI:");
            //console.log(APP_URLAPI); 

        //console.log("usuario.tokenRegistro:");
            //console.log(usuario.tokenRegistro); 
            //console.log("COMPANIA_ID:");
            //console.log(COMPANIA_ID); 


        //setIsLoadingServicios(true);

        const valoresUser = await AsyncStorage.getItem('usuarioconectado');
        //////console.log("valoresUser:");
        //////console.log(valoresUser);

        try {
            let valor = await solicitarPermisosUbicacion(usuario);
        } catch (err) {        
            console.error("error:");
            console.error(err);
        }
        // Solicita Permisos de ubicación y guarda ubicacion en api
    

        

        //setIsLoadingServicios(false);
    
    };

    const fetchDataViajes = async () => {
        ////console.log("fetchDataViajes");
        setIsLoading(true);

        if (usuario.tokenRegistro!="" || usuarioGlobal.tokenRegistro!=""){   
            
            /*
            try {
                const resp = await axios.post(APP_URLAPI+'tokenactivo',
                {          
                    token: usuario.tokenRegistro ? usuario.tokenRegistro : usuarioGlobal.tokenRegistro,
                    compania: COMPANIA_ID
                });
          
                if (resp.data.code==0){
                    return false;
                }else if (resp.data.code==103 || resp.data.code==104){
                    console.log("here 77");
                    setIsLoading(false);
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }
            
            } catch (err) {      
                //console.error(err);
                //console.log("here7");
                navigation.navigate({name: 'Ingreso'})
                return false;     
            }
            */
            
            ////console.log("fetchDataViajes tokenRegistro");
            ////console.log("usuario.tokenRegistro:"+usuario.tokenRegistro);
            ////console.log("usuarioGlobal.tokenRegistro:"+usuarioGlobal.tokenRegistro);



            try {
                const resp = await axios.post(APP_URLAPI+'taxiviajes',
                {          
                    token: usuario.tokenRegistro ? usuario.tokenRegistro : usuarioGlobal.tokenRegistro,
                    limit: "1",
                    compania: COMPANIA_ID
                }
            );

            //console.log("usuario.tokenRegistro");
            //console.log(usuario.tokenRegistro);

            //console.log("usuarioGlobal.tokenRegistro");
            //console.log(usuarioGlobal.tokenRegistro);

            console.log('taxiviajes:');
            console.log(resp.data?.data?.items);
            if (resp.data.code==0){
                setViajesLista(resp.data.data.items);
            }else if (resp.data.code==103 || resp.data.code==104){
                console.log("here7");
                setIsLoading(false);
                setViajesLista([]);          
                //navigation.navigate({name: 'Ingreso'})
                //return false;          
            }else{
                setViajesLista([]);          
                setIsLoading(false);
            }
            
            setIsLoadingViajes(false);
            setIsLoading(false);
        
            } catch (err) {      
                setIsLoadingViajes(false);  
                console.error(err);
                setIsLoading(false);
            }
        }

        setIsLoading(false);
    
    };

    const fetchViajeGratis = async () => {


        if (usuario.tokenRegistro!=""){            
            try {
            const resp = await axios.post(APP_URLAPI+'taxiviajesgratis',
                {          
                    token: usuario.tokenRegistro ? usuario.tokenRegistro : usuarioGlobal.tokenRegistro,                    
                    compania: COMPANIA_ID
                }
            );

            ////console.log("resp.data taxiviajesgratis");
            ////console.log(resp.data);
            if (resp.data.code==0){
                setTotalViajesGratis(resp.data.data.totalviajesgratis);                
            }else if (resp.data.code==103 || resp.data.code==104){
                console.log("here8");
                //navigation.navigate({name: 'Ingreso'})
                //return false;          
            }else{
                setTotalViajesGratis(0);
            }
            
            //setIsLoadingViajes(false);
            //setIsLoading(false);
        
            } catch (err) {      
                //setIsLoadingViajes(false);  
                console.error(err);
                //setIsLoading(false);
                setTotalViajesGratis(0);
            }
        }
    
    };

    
    async function sendPushNotification() {

        //////console.log("notificationInicial");
        //////console.log(notificationInicial);

        if (notificationInicial<=2){

            ////////console.log("entra");

            setNotificationInicial(notification+1);

            //////////console.log("sendPushNotification");
            const message = {
                to: expoPushToken,
                sound: 'default',
                title: 'Bienvenido a la App de SistemasGo',
                body: 'Asi vas a poder recibir todas las notificaciones de la App',
            };
        
            await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
            });

            ////////console.log("termino");
            
        }
    }

    useEffect(() => {
        setIsLoadingScreen(true);

        //////console.log("entro useeffect ingreso");


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

        getUsuarioConectado();

    }, [useIsFocused]);

    
  
    const useEffectAsync = async () => {

        await getUsuarioConectado();

        //if (!tipoServicioLista){

            setIsLoading(true);            
            fetchData();

           /*  const getBarCodeScannerPermissions = async () => {
                const { status } = await BarCodeScanner.requestPermissionsAsync();
                setHasPermission(status === 'granted');
                ////////console.log("status");
                ////////console.log(status);
            };
        
            getBarCodeScannerPermissions(); */
        //}

        setIsLoadingViajes(true);
        
        fetchDataViajes();

        const valoresUser = await AsyncStorage.getItem('usuarioconectado');
        let valores = JSON.parse(valoresUser);

        //////console.log("valoresUser2:");
        //////console.log(valores?.idUsuario);
        if (valores?.idUsuario){
            setConectado(".");
        }

        //fetchViajeGratis();

        setIsLoadingViajes(false);  

        

        //////console.log(userObj);
        //////console.log("valoresUser2:");
        //////console.log(valoresUser);
        //////console.log("valoresUser3:");
        //////console.log(valoresUser?.idUsuario);

    }

    useEffect(() => {      
        if (!isFocused){return;}

        console.log("parametrosss2"); 
        console.log(parametros);
        ////console.log("useEffect paneltaxi");  
        useEffectAsync();
    }, [isFocused]);

    useEffect(() => {

        if (!isFocused){return;}
        registerForPushNotificationsAsync().then(token => {
           if (usuario.tokenRegistro!=""){
             setExpoPushToken(token)
     
             
             axios
             .post(APP_URLAPI + 'registertokenpush',
                 {                    
                     token: usuario.tokenRegistro ? usuario.tokenRegistro : usuarioGlobal.tokenRegistro,
                     tokenpush: token,
                     compania: COMPANIA_ID
                 }
             )   
             .then(response => {
                 ////////console.log("response.data:"+response.data);
                 if (response.data.code==0){
                     ////////console.log("response.data2:"+response.data);
                 }else if (response.data.code==103 || response.data.code==104){
                    //console.log("here5");
                    //navigation.navigate({name: 'Ingreso'})
                    //return false;          
                }else{               
                 }
                 //sendPushNotification();
             }).catch(function (error) {
                 ////////console.log(error);
             })
 
           }
   
   
         }
       ); 
   
       // This listener is fired whenever a notification is received while the app is foregrounded
       notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
         ////console.log("entro la notificacion en notificationListener4");
         setNotification(notification);
         //hacerSonido();
       });
   
       // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
       responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        ////console.log("entro la notificacion en responseListener6");
        //hacerSonido();
        ////console.log(response);
        ////console.log(response.notification.request.content.data);
        ////console.log(response.notification.request.content.title);
        ////console.log(response.notification.request.content.body);
        //navigation.navigate('UsuarioReferidos');

         ////////console.log("response1:"+response);
       });
   
       return () => {
         Notifications.removeNotificationSubscription(notificationListener.current);
         Notifications.removeNotificationSubscription(responseListener.current);
       };
     }, [isFocused]);

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);

       

    }, [])

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };
    
    /* if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    } */

    useEffect(() => {

        
        if (!isFocused){return;}

        //console.log("route?.params?");
        //console.log(route?.params?.item);
        //console.log(route?.params?.item?.id?.trans_id);
        
        axios
        .post(APP_URLAPI + 'verificarversion',
            {                    
                compania: COMPANIA_ID, 
                version: Constants.expoConfig.version
            }
        )   
        .then(response => {

            console.log('verificarversion paneltaxi');
            console.log(response.data);
            
            if (response.data.code==0){
                if (response.data.data.ultimaversion!="1"){
                    //////console.log("redirect:");
                    navigation.navigate('ActualizarApp');
                }
            }else{   
                navigation.navigate('ActualizarApp');
            }

        }).catch(function (error) {
            //////console.log(error);
            //navigation.navigate('ActualizarApp');
        })
      
    }, [isFocused]);

    
    const dispatch = useDispatch()

    const [usuarioConectado, setUsuarioConectado] = useState();
    const [isLoadingScreen, setIsLoadingScreen] = useState(true);
    
    const getUsuarioConectado = async () => {
        let valores = await AsyncStorage.getItem("usuarioconectado");

        ////console.log("getUsuarioConectado PanelTaxi");
        ////console.log(valores);

        if (valores){
            valores = JSON.parse(valores);
            ////console.log("usuarioconectado existe");
            ////console.log(valores.email);

            setUsuarioConectado(valores);
            dispatch(actualizar(valores));
            usuarioGlobal = valores;
            /*
            if (valores.perfilUsuario =="10"){
                navigation.navigate('Panel');
            }
            */
            //
            //setEmailConectado(valores.email);
        }else{
            ////console.log("usuarioconectado no existe");
            setUsuarioConectado("");
            dispatch(actualizar(false)) 
            //////console.log("aqui2");
            setIsLoadingScreen(false);
        }

        //return 
    }

    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            //navigation.navigate('Ingreso')
            cerrarApp();
            return true;
          };
    
          BackHandler.addEventListener('hardwareBackPress',onBackPress);
            return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
          };
        }, []),
    );

    const cerrarApp = () => {
        //navigation.goBack();      
        Alert.alert("Salir de la Aplicación", "¿Estás por salir de la Aplicación?", [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          { text: "Confirmar", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
    };
  
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%", alignContent:"center"}}>        
    <ScrollView>

        <View style={[styles.container2, {alignContent:"center", textAlign:"center"}]}>             
            {
                parametros?.valor ?
                parametros.valor.tipoServicio.map(item =>                 
                    <View key={item.texto} style={[styles.iconView, {backgroundColor: item.color1, borderColor: item.color2, paddingTop: item.paddingTop}]}>
                        <TouchableOpacity                             
                            onPress={() => 
                                navigation.navigate('ViajeBuscar', {item: item, info: route?.params?.item, tipo: route?.params?.tipo})
                            }
                            style={styles.iconBoton}
                        >   
                            <Icon size={35} name={item.icono} color={item.color2}  />
                            <View style={{marginTop: 5}}>
                                <Text 
                                    style={styles.iconText}
                                >
                                    {
                                        item?.codigo == "1" && route?.params?.item?.id?.trans_id ? 'Auto' :
                                        item?.codigo == "2" && route?.params?.item?.id?.trans_id ? 'Moto' :
                                        item.texto
                                    }                                     
                                </Text>   
                            </View>  
                        </TouchableOpacity>
                    </View>                    
                )
                : null         
            }    
            

            {
            isLoadingServicios ? 
            <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row", height: 200}}>
                <Skeleton
                    
                    animation="wave"
                    width={80}
                    height={60}
                    style={{marginLeft: 10, flex: 1}}
                />
                <Skeleton
                    
                    animation="wave"
                    width={80}
                    height={60}
                    style={{marginLeft: 10, flex: 1}}
                />
                <Skeleton
                    
                    animation="wave"
                    width={80}
                    height={60}
                    style={{marginLeft: 10, flex: 1}}
                />                
            </View>  
            :
            null
            }  

        {
            totalViajesGratis > 0 ? 
            <View style={{width: "100%", marginTop: 10, marginBottom: 10}}>            
              <TouchableWithoutFeedback
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderWidth: 1, borderColor: "#C1160D", borderRadius: 10}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#C1160D",
                      }} 
                  >      
                    
                    <Text 
                        style={styles.buttonTextViajeGratis}>
                        <Icon size={20} name="gift" color={"#FFFFFF"}  />{'  '}
                        {`Tienes `+totalViajesGratis+ ` Viaje Gratis!
Se tomará en cuenta en su siguiente viaje`}                        
                    </Text>            
                                                                        
                  </View>
              </TouchableWithoutFeedback>                       
            </View>
            : null
        }


             {/*  <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
                {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}              
        </View> 
        
        {
            isLoading ?  
            <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
                <Skeleton                    
                    animation="wave"
                    width="90%"
                    height={100}
                    style={{marginTop: 15}}
                />                                                        
            </View> 
        :
            viajesLista?.length == 0 ?  null
            :
            <>
                <View style={{width: "100%", marginTop: 10, marginBottom: 10}}>
                    <Text style={{textAlign: "center", fontSize: 16}}>
                        Mi Último Viaje 
                    </Text>
                </View>
            {
            viajesLista.map(item => 
                
                <TouchableOpacity  
                    key={item.fecha}
                    onPress={() => {
                    if (item.estatuscod == "6") {
                        navigation.navigate({
                        name: 'ViajeSolicitarConfirmar',
                        params: { item: item},
                        merge: true,
                        });
                    } else if (item.estatuscod == "2" || item.estatuscod == "3") {
                        navigation.navigate({
                        name: 'ViajeEnCurso',
                        params: { item: item},
                        merge: true,
                        });
                    } else {
                        navigation.navigate({
                        name: 'ViajeDetalle',
                        params: { item: item},
                        merge: true,
                        });
                    }

                }}
                >
                    <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5", marginBottom: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 20, alignItems: "center", justifyContent: "center"}}>
                        <View style={{width: "20%",  paddingHorizontal: 10, paddingTop: 15}}>
                            <Image 
                                style={{height: 60, width: 60, resizeMode: 'contain'}}
                                source={{
                                uri: item.imagen
                                }}                    
                            />
                        </View>
                        <View style={{width: "70%", paddingLeft:10}}>
                            <Text style={{fontSize: 16, fontWeight: "500"}}>
                                {item.destino}
                            </Text>
                            {
                                COMPANIA_ID !="398888" ? 
                                <Text style={{fontSize: 16}}>
                                {item.formapago} {item.monto}
                                </Text>
                                : null
                            }
                            <Text style={{fontSize: 16}}>
                            {item.tipotarifa} 
                            </Text>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                                {item.fecha}
                            </Text>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", marginTop: 4}}>
                                <View style={{fontSize: 14, color: "#FFFFFF", borderRadius: 10, textAlign: "center", marginBottom: 10, paddingRight: 10, paddingLeft: 10, paddingVertical: 5, 
                                    backgroundColor: item?.estatuscolor ? item?.estatuscolor : "#878988"
                                    }}>
                                        <Text style={{fontSize: 14, color: "#FFFFFF", textAlign: "center"}}>
                                            {item.estatus}
                                        </Text>
                                </View> 
                            </Text>
                        </View>
                        <View style={{width: "10%", justifyContent: "center" }}>
                            <Icon size={24} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                        </View>                
                    </View>
                </TouchableOpacity>   
                
            )}
            </>
        }       

        <View style={[styles.container, {alignContent:"center", textAlign:"center", marginTop: 10}]}> 
            
            {
            isLoadingServicios ? 
            <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row"}}>
                <Skeleton
                    
                    animation="wave"
                    width={170}
                    height={150}
                    style={{marginLeft: 10, flex: 1}}
                />
                <Skeleton
                    
                    animation="wave"
                    width={170}
                    height={150}
                    style={{marginLeft: 10, flex: 1}}
                />                             
            </View>
            : 
            <>
            <FlatList
                style={{marginTop: 0, borderTopWidth: 0, borderTopColor: "#D1D0CF", borderBottomColor: "#D1D0CF", borderBottomWidth: 0, marginBottom: 10}}
                data={tipoServicioLista}
                horizontal={true}    
                renderItem={
                ({item}) => 
                <TouchableOpacity  
                    key={item.textobanner}
                    onPress={() => 
                        navigation.navigate('ViajeBuscar', {item: item})
                    }
                    style={{marginRight: 0}}
                >
                    {
                        COMPANIA_ID =="381" ? 
                        <Image 
                            style={{height: 240, width: 340, resizeMode: 'contain'}}
                            source={{
                                uri: item.imagenbanner
                            }}                    
                        />
                        :
                        <ImageBackground 
                            source={{
                                uri: item.imagenbanner
                            }} 
                        resizeMode="cover" style={{ marginHorizontal: 10, width: tipoServicioLista.length == 1 ? "100%" : 220, paddingRight: 20, borderRadius: 20}} >
                        <View style={{ height: 160, width: "100%", flexDirection: "row", marginTop: 10, paddingVertical: 10, borderRadius: 15, paddingLeft: 10}}>
                            
                            <View style={{width: 200, paddingRight: 10}}>
                                <Text style={{fontSize: 20, justifyContent: "center", textAlignVertical: "center", paddingTop: 0 ,fontWeight: "500", color: "#FFF"}}>
                                    {item?.textobanner} 
                                </Text>
                                <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", paddingTop: 0 ,fontWeight: "500", color: "#FFF"}}>
                                    {item?.textobannerdos} 
                                </Text>
                                <Icon size={30} name="angle-right" color="white"  />
                            </View>   
                            <View style={{ justifyContent: "center", paddingHorizontal: 10}}>
                                <Icon size={80} name={item?.icono} color="white"  />
                            </View>             
                            
                            </View>
                        </ImageBackground>
                        
                    }
                    
                </TouchableOpacity>    
                    
                }
            />            
            </>
            }
               
            
        </View> 
        
        


        

        {
            !usuario.tokenRegistro ?
            <View>
                <View style={{justifyContent: "center", alignItems:"center", marginTop: 30}}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Ingreso')} >
                    <Image
                        source={require('../../../assets/img/pedirlogin.png')}          
                        style={{resizeMode: 'contain', height: 140, width: 200}}
                    />  
                    </TouchableOpacity>
                    <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                        <Text style={{fontSize: 16, textAlign: "center"}}>
                            Inicia sesión en tu cuenta
                        </Text>
                    
                    </View>  

                </View>
                <View style={{width: "100%"}}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Ingreso')} 
                        style={{textAlign: "center", marginTop: 5, margin: 12,
                        borderWidth: 1, borderColor: COLORBOTONPRINCIPAL, borderRadius: 10, justifyContent: "center"}}>
                        <View
                            style={{
                                ...styles.button,
                                backgroundColor: COLORBOTONPRINCIPAL,
                            }} 
                        >   
                            <Icon size={20} name="user" color={"#FFFFFF"}  /> 
                            <Text 
                                style={styles.buttonText}>
                                {' '} Iniciar sesión
                            </Text>                            
                        </View>
                    </TouchableOpacity>
                 </View>
            </View>
            :null
        }

       

    </ScrollView>
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container2: {
        flexDirection:'row',
        flexWrap: "wrap",
        marginHorizontal: 15,
        marginTop: 15,
        justifyContent: "center"
    },
    container: {
        marginHorizontal: 15,
        marginTop: 15,
        justifyContent: "center",
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
    buttonTextViajeGratis: {
        color: "#FFFFFF",
        fontWeight: "normal",
        fontSize: 16,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center",
        lineHeight: 23
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
    iconView: {
        backgroundColor: "#FFFFFF",
        width: "30%",
        height: 100,
        margin: 4,
        borderColor: "#EDEDED", 
        borderWidth: 1, 
        borderRadius: 15, 
        paddingHorizontal: 5,
        paddingVertical: 5,
        paddingTop: 20
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
        height: 230, 
        width: 300,
        resizeMode: 'contain'
    },
});

export default PanelTaxi
