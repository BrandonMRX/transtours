import React, { useState, useContext, Component, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { ScrollView } from "react-native-gesture-handler";


import { solicitarPermisosUbicacion } from '../../components/Ubicacion/Ubicacion';
//import { solicitarPermisosUbicacionSegundoPlano } from '../../components/Ubicacion/UbicacionSegundoPlano';
import Toast from 'react-native-toast-message';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import { Audio } from 'expo-av';
/* import BackgroundTimer from 'react-native-background-timer';
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { Skeleton } from '@rneui/themed';
import Viajes from "../../components/Viajes";
import Constants from "expo-constants";


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function registerForPushNotificationsAsync() {

  let token;
  if (Device.isDevice) {
    //////////console.log(333);
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    //////////console.log("existingStatus:"+existingStatus);
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    //////////console.log("finalStatus:"+finalStatus);
    if (finalStatus !== 'granted') {
      //////////console.log("sin permisos push:");
      //alert('Failed to get push token for push notification!');
      return;
    }
    //token = (await Notifications.getExpoPushTokenAsync());
    token = (await Notifications.getExpoPushTokenAsync()).data;
    
   // ////////console.log("token4:");
    //////////console.log(token);
   // ////////console.log("token4fin");
  } else {
    //////////console.log(222);
    //alert('Must use physical device for Push Notifications');
  }

    Notifications.setNotificationChannelAsync('default', {
      name: 'taxiconductor',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],        
      sound: 'taxi.wav',
      enableVibrate: false
    }); 

    /* await Notifications.scheduleNotificationAsync({
        content: {
            title: "testsound 📬",
            body: "testsound2",
            data: { data: "goes here" },
            sound: "taxi.wav",
        },
        trigger: { seconds: 2 },
    });
 */



  return token;
}

let intervalIdConductorGeo;

const PanelConductor = ({navigation}) => {

  
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

  /* useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {navigation.navigate('Panel')
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress',onBackPress);
        return () => {BackHandler.removeEventListener('hardwareBackPress',onBackPress);
      };
    }, []),
); */

    const usuario = useSelector(state => state.usuario)
  
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const [notificationInicial, setNotificationInicial] = useState(0);
    const [infoUsuario, setInfoUsuario] = useState(false);
    const [tipoServicioLista, setTipoServicioLista] = useState(false);

    const notificationListener = useRef();
    const responseListener = useRef();

    const [sound, setSound] = useState();
    const dispatch = useDispatch()    

    const solicitarGeo = async () => { 
      
      let fechaactual = getCurrentDate();

      //console.log("solicitarGeo");
      //console.log(fechaactual);
      
      let respuesta = await solicitarPermisosUbicacion(usuario);

      if (respuesta){
        //console.log("Si");
        setIsDisponible(true);
      } 
             
    }

    const StartIntervalConductorGeo=()=>{

     /*  BackgroundTimer.runBackgroundTimer(() => { 

        let fechaactual = getCurrentDate();
        ////console.log("fechaactual:");
        ////console.log(fechaactual);
        
      }, 5000); */
        
      
      intervalIdConductorGeo=setInterval(() => {
        solicitarGeo();        
      }, 60000);

      
    }

    /* BackgroundTimer.runBackgroundTimer(() => { 
      //code that will be called every 3 seconds 
      }, 
      3000); */

    const StopIntervalConductorGeo=()=>{
      clearInterval(intervalIdConductorGeo);
    }

    const isFocused = useIsFocused();


    const [iconEye, setIconEye] = useState('eye');
    const [balanceVisible, setBalanceVisible] = useState(true);

    const [resumenConductor, setResumenConductor] = useState(true);
    

    const [viajesLista, setViajesLista] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingResumen, setIsLoadingResumen] = useState(false);
    const [isLoadingIsDisponible, setIsLoadingIsDisponible] = useState(false);

    const [isDisponible, setIsDisponible] = useState(false);

    const mostrarBalance = async () => {

      if (balanceVisible){
          setBalanceVisible(false);
          setIconEye("eye-slash");
      }else{
          setBalanceVisible(true);
          setIconEye("eye");
      }
      
  }

  useEffect(() => {

      //console.log("entro useeffect panelconductor");


  }, [useIsFocused]);

    const NoDisponibleViajes = async () => {
      try {          

          setIsLoadingIsDisponible(true);
          
          const resp = await axios.post(APP_URLAPI+'usuariogeoestatus',
            {          
              token: usuario.tokenRegistro,
              compania: COMPANIA_ID,
              estatus: 0
            }
          );

          ////////console.log("usuariogeoestatus no:");
          ////////console.log(resp.data);
          
          if (resp.data.code==0){// No disponible de forma correctamente
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          }else if (resp.data.code==103 || resp.data.code==104){
            setIsLoadingIsDisponible(false);
            navigation.navigate({name: 'Ingreso'})
            return false;          
          }else{
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          }

      } catch (err) {        
          console.error(err);
          setIsLoadingIsDisponible(false);
      }
  };

  const AsyncAlert = async (texto) => new Promise((resolve) => {
    Alert.alert(
      'info',
      texto,
      [
        {
          text: 'ok',
          onPress: () => {
            resolve('YES');
          },
        },
      ],
      { cancelable: false },
    );
  });
  

  const ReenviarCodigoRegistro = async () => {
    try {
        
        const resp = await axios.post(APP_URLAPI+'reenviarcodigoregistro',
          {          
            token: usuario.tokenRegistro,
            compania: COMPANIA_ID
          }
        );
        
        if (resp.data.code==0){// Reenvio correcto
          navigation.navigate('ConfirmarRegistro');
        }else if (resp.data.code==103 || resp.data.code==104){
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          Toast.show({
              type: 'error',
              text1: 'No se ha podido reenviar el código al email, contacte a Soporte'
          });
        }

    } catch (err) {        
        console.error(err); 
        Toast.show({
          type: 'error',
          text1: 'No se ha podido reenviar el código al email, contacte a Soporte'
      });       
    }
  };

  const DisponibleViajeeeeeeeeeeeeeeeees = async () => {
    try {

        setIsLoadingIsDisponible(true);
        
        let respuesta = false;

        await AsyncAlert("en DisponibleViajes");

        console.log("en DisponibleViajes");          

        try {

          //respuesta = await solicitarPermisosUbicacion(usuario);
          let { status } = await  Location.requestForegroundPermissionsAsync();
          await AsyncAlert("status");
          await AsyncAlert(status);

          if (status !== 'granted') {
              await AsyncAlert("sin permisos");
              console.log("sin permisos");
              //setErrorMsg('Permission to access location was denied');
              //verificarPermisosUbicacion();
              return;
          }else{

            await AsyncAlert("here  solicitarPermisosUbicacion");
            console.log("here  solicitarPermisosUbicacion");

            /* const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

            if (backgroundStatus === 'granted') {
              ////console.log("con acceso a segundo plano:");
            }
              */
            //console.log("con location:");
            try {
              
              

              //console.log("con location1:");
              let location = await Location.getLastKnownPositionAsync();
              //let location = await Location.getCurrentPositionAsync({});
              //let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});

              await AsyncAlert("con location2:");
              //await AsyncAlert(location);

              console.log("con location2:"); 
              console.log(location); 

              let response = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              });
            
              let address ="";
            
              for (let item of response) {
                address = `${item.street}, ${item.name}, ${item.postalCode}, ${item.city}, ${item.country}`;
              }

              await AsyncAlert("here 0:");

              console.log("here 0");
              
            
              if (location.coords.latitude){

                console.log("here 1");
                await AsyncAlert("here 1:");
            
                try {
                  
                    const resp = await axios.post(APP_URLAPI+'usuariogeo',
                        {          
                            token: usuario?.tokenRegistro,
                            latitud: location.coords.latitude,
                            longitud: location.coords.longitude,
                            direccion: address,
                            compania: COMPANIA_ID
                        }
                    );
                    
                    if (resp.data.code==0){
                      await AsyncAlert("here 3:");
                      setIsDisponible(true);
                      respuesta = true;
                    }else{
                      await AsyncAlert("here 4:");
                      setIsLoading(false);
                    }
            
                } catch (err) {        
                  await AsyncAlert("here 5:");
                  await AsyncAlert(err.message);
                    //console.error("err");
                    //console.error(err);
                    setIsLoading(false);
                }                
              }else{
                await AsyncAlert("here 6:");                  
                setIsLoading(false);
              }
              
            }catch (err) {  
              await AsyncAlert("here 7:");                    
              await AsyncAlert(err.message);
              console.log("error 0");
              setIsDisponible(false);    
              console.error(err);
            }
          }
          
          

        }catch (err) {    
          await AsyncAlert("here 8:");                    
          await AsyncAlert(err.message);    
          console.error("err5");
          console.error(err);
          setIsDisponible(false);
          
          //setIsLoadingIsDisponible(false);
        }
        

        console.log("respuesta DisponibleViajes")
        console.log(respuesta)

        await AsyncAlert("here 9:");                    
        //await AsyncAlert(respuesta);  

        if (respuesta){

          await AsyncAlert("here 10:");                    
          
          //////console.log("here")
          // Luego de activar la geolocalizacion seteo como disponible

          const resp = await axios.post(APP_URLAPI+'usuariogeoestatus',
            {          
              token: usuario.tokenRegistro,
              compania: COMPANIA_ID,
              estatus: 1
            }
          );

          await AsyncAlert("here 10a:");    
          console.log("usuariogeoestatus:");
          console.log(resp.data); 

         /*  ////////console.log("usuariogeoestatus no:");
          ////////console.log(resp.data);
          
          if (resp.data.code==0){// No disponible de forma correctamente
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          }else{
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          } */

          if (resp.data.code==0){// disponible de forma correctamente
            await AsyncAlert("here 12:");    
            setIsLoadingIsDisponible(false);
            setIsDisponible(true);
            StartIntervalConductorGeo();
          }else if (resp.data.code==103 || resp.data.code==104){
            await AsyncAlert("here 13:");    
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            navigation.navigate({name: 'Ingreso'})
            return false;          
          }else{
            await AsyncAlert("here 14:");    
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          }
          

        }else{
          //console.log();
          /*
          Toast.show({
              type: 'error',
              text1: 'Verifique la geolocalización e intente de nuevo'
          });
          */
          setIsDisponible(false);
        }

        setIsLoadingIsDisponible(false);        

    } catch (err) {      
      await AsyncAlert("here 11:");    
      await AsyncAlert(err);                      
      console.error("err4");
        console.error(err);
        setIsLoadingIsDisponible(true);
        setIsDisponible(true);
    }
  };

  const DisponibleViajes = async () => {
    try {

        setIsLoadingIsDisponible(true);
        
        let respuesta = false;

        try {
          respuesta = await solicitarPermisosUbicacion(usuario);

        }catch (err) {        
          console.error("err5");
          console.error(err);
          //setIsLoadingIsDisponible(false);
        }
        

        console.log("respuesta panelconductor")
        console.log(respuesta)

        if (respuesta){
          //////console.log("here")
          // Luego de activar la geolocalizacion seteo como disponible

          const resp = await axios.post(APP_URLAPI+'usuariogeoestatus',
            {          
              token: usuario.tokenRegistro,
              compania: COMPANIA_ID,
              estatus: 1
            }
          );

          //console.log("usuariogeoestatus:");
          //console.log(resp.data);

         /*  ////////console.log("usuariogeoestatus no:");
          ////////console.log(resp.data);
          
          if (resp.data.code==0){// No disponible de forma correctamente
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          }else{
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          } */

          if (resp.data.code==0){// disponible de forma correctamente
            setIsLoadingIsDisponible(false);
            setIsDisponible(true);
            StartIntervalConductorGeo();
          }else{
            setIsLoadingIsDisponible(false);
            setIsDisponible(false);
            StopIntervalConductorGeo();
          }

        }else{
          //console.log();
          Toast.show({
              type: 'error',
              text1: 'Activa la geolocalización e intente de nuevo'
          });
          setIsDisponible(false);
        }

        setIsLoadingIsDisponible(false);        

    } catch (err) {        
      console.error("err4");
        console.error(err);
        setIsLoadingIsDisponible(true);
        setIsDisponible(false);
    }
  };

  const getCurrentDate=()=>{

    var fechacompleta = new Date();

    var fecha = fechacompleta.toLocaleDateString();
    var fechahora = fechacompleta.toLocaleTimeString();
    
    let mes = fecha.substring(0,2);
    let dia = fecha.substring(3,5);
    let ano = fecha.substring(6,8);

    let fechareturn = "20"+ano+"-"+mes+"-"+dia+" "+fechahora;

    return fechareturn;
  }

    const fetchData = async () => {

        setIsLoading(true);


        axios
        .post(APP_URLAPI + 'verificarversion',
            {                    
                compania: COMPANIA_ID, 
                version: Constants.expoConfig.version
            }
        )   
        .then(response => {

            console.log('verificarversion panelconductor');
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

      setIsLoadingResumen(true);

        

      try {
        
        const resp = await axios.post(APP_URLAPI+'usuarioinfo',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        );

        //console.log("usuario.tokenRegistro :");
        //console.log(usuario.tokenRegistro);
        //console.log("COMPANIA_ID:");
        //console.log(COMPANIA_ID);

        //console.log("usuarioinfo :");
        //console.log(resp.data);

        if (resp.data.code==0){
          if (resp.data.data.estatusconductorcod=="1"){
            setIsDisponible(true); 
          }else{
            setIsDisponible(false); 
          }
          
          setInfoUsuario(resp.data.data); 
        }else if (resp.data.code==103 || resp.data.code==104){
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          setInfoUsuario(false);          
        }

      } catch (err) {        
          console.error(err);
      }
    
      // Solicita Permisos de ubicación y guarda ubicacion en api
      //solicitarPermisosUbicacion(usuario);
  
      try { 
        
          const resp = await axios.post(APP_URLAPI+'taxiconductorviajes',
              {          
                  token: usuario.tokenRegistro,
                  limit: "10",
                  compania: COMPANIA_ID
              }
          ); 

          console.log("taxiconductorviajes:");          
          

          if (resp.data.code==0){
            console.log(resp.data.data.items);          
            setViajesLista(resp.data.data.items);
            setIsLoading(false);
          }else if (resp.data.code==103 || resp.data.code==104){
            setIsLoading(false);
            navigation.navigate({name: 'Ingreso'})
            return false;          
          }else{
            setIsLoading(false);
            setViajesLista([]);          
          }
  
      } catch (err) {        
        setIsLoading(false);
          console.error(err);
      }


      try {

        console.log("usuario.tokenRegistro");
        console.log(usuario.tokenRegistro);
        console.log("COMPANIA_ID");
        console.log(COMPANIA_ID);
        if (!usuario.tokenRegistro || usuario.tokenRegistro == ""){navigation.navigate({name: 'Ingreso'})}
        
        const resp = await axios.post(APP_URLAPI+'taxiconductorresumen',
          {          
              token: usuario.tokenRegistro,
              compania: COMPANIA_ID, 
              //fechadesde: '15/11/2022',
              //fechahasta: '',
          }
        );

        console.log("taxiconductorresumen");
        console.log(resp.data); 

        if (resp.data.code==0){
          setResumenConductor(resp.data.data);
          setIsLoadingResumen(false);
        }else if (resp.data.code==103 || resp.data.code==104){
          setIsLoadingResumen(false);
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{          
          setResumenConductor(false);
          setIsLoadingResumen(false);
        }

      } catch (err) {        
          console.error(err);
          setIsLoadingResumen(false);
      }

      setIsLoading(false);
      setIsLoadingResumen(false);
      
    };

    useEffect(() => {
      console.log(444); 
      if (!isFocused){return;}

        setIsLoading(true);
        setIsLoadingIsDisponible(false);
        fetchData();
    }, [isFocused]);

    useEffect(() => {

      console.log(333); 

      if (!isFocused){return;}

      registerForPushNotificationsAsync().then(token => {
         if (usuario.tokenRegistro!=""){
           setExpoPushToken(token)
              
           axios
           .post(APP_URLAPI + 'registertokenpush',
               {                    
                   token: usuario.tokenRegistro,
                   tokenpush: token,
                   compania: COMPANIA_ID
               }
           )   
           .then(response => {
              console.log("registertokenpush ");
              console.log(response.data);
               if (response.data.code==0){
                   ////////console.log("response.data2:"+response.data);
               }else if (response.data.code==103 || response.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
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
 
      //console.log("entro la notificacion en notificationListener2 PanelConductor");
/* 
      let valoresData = notification.request.content.data;
      //setNotification(notification);
      if (valoresData.tipo=="viajependienteporaceptar"){

        hacerSonido();
        let trans_id = valoresData.id;
  
        let item = {
          transid: trans_id
        }
  
      }else if (valoresData.tipo=="chatenviar"){
        let correomasivo_id = valoresData.id;
        let idenvia = valoresData.idenvia;
        let idrecibe = valoresData.idrecibe;     
  
        let item = {
          usuarioid: idenvia,
          elementoid: correomasivo_id
        }    
      } */
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
     //console.log("entro la notificacion en responseListener  PanelConductor");
     ////console.log(response);
     ////console.log(response.notification.request.content.data);
     ////console.log(response.notification.request.content.title);
     ////console.log(response.notification.request.content.body);

     let valoresData = response.notification.request.content.data;

     /* if (valoresData.tipo=="viajependienteporaceptar"){

      //hacerSonido();
      let trans_id = valoresData.id;

      let item = {
        transid: trans_id
      }

      navigation.navigate({
        name: 'ConductorConfirmarViaje',
        params: { 
          item: item
        },
        merge: true,
      }) 

    }else if (valoresData.tipo=="chatenviar"){
      let correomasivo_id = valoresData.id;
      let idenvia = valoresData.idenvia;
      let idrecibe = valoresData.idrecibe;     

      let item = {
        usuarioid: idenvia,
        elementoid: correomasivo_id
      }

      navigation.navigate({
        name: 'ChatDetalle',
        params: item,        
        merge: true,
      }) 

    } */

    /*
    "id" => $correomasivo_id,
		"idenvia" => $usuario_id,
		"idrecibe" => $usuariodestino,
		"tipo" => "chatenviar"
    */

     //////console.log(valoresData.tipo);
     //navigation.navigate('UsuarioReferidos');

      ////////console.log("response1:"+response);
    });
 
     return () => {
       Notifications.removeNotificationSubscription(notificationListener.current);
       Notifications.removeNotificationSubscription(responseListener.current);
     };
   }, [isFocused]);
  
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>   

        <View>
          {
            isLoadingResumen ?  
            <View style={{width: "90%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row", marginHorizontal: 20}}>
                <Skeleton
                    
                    animation="wave"
                    width={"100%"}
                    height={150} 
                    style={{flex: 1, borderRadius: 20}}
                />                                         
            </View>
            :
            <View style={{backgroundColor: '#C8F2ED',  borderColor: '#31BCAC',
            borderStyle: 'solid',
            borderWidth: 2,
            borderRadius: 10, marginLeft: 20,
            marginRight: 20, paddingLeft: 20, paddingBottom: 15, marginTop: 10, height: 120}}>
              <View style={{flex: 1, flexDirection: "row"}}>
                  <View style={{alignItems:"center", paddingTop: 10, paddingRight: 10}}>
                      <TouchableOpacity                            
                          disabled={true}                                    
                      >                               
                          <Icon size={50} name="money-bill" color="#31BCAC"  />                      
                      </TouchableOpacity>
                  </View>
                  <View style={{ alignItems:"center", paddingTop: 15}}>
                      <TouchableOpacity    
                        onPress={mostrarBalance}                                                  
                      >                           
                          <Text style={{color: "#29620D", textTransform: "uppercase", fontWeight: "bold", paddingLeft: 5, fontSize: 14}}>
                            Total Ganado Hoy
                          </Text>
                          <Text style={{color: "#29620D", textTransform: "uppercase", fontWeight: "bold", paddingLeft: 5, fontSize: 24}}   >

                              {
                                balanceVisible ? 
                                resumenConductor?.montoganado
                                :
                                '*****'
                              }
                              {'  '}

                              <Icon size={20}   name={iconEye}  onPress={mostrarBalance} color={"#055D5D"} style={{marginLeft: 10}}  />
                              
                          </Text>
                          <Text style={{color: "#29620D", fontWeight: "bold", paddingLeft: 5, fontSize: 18}}>

                              {resumenConductor?.cantidad} viajes
                          </Text>
                          
                      </TouchableOpacity>
                  </View>
                  
              </View>
              
          </View>
          }
         
            
        </View>     

       {/*  <View style={styles.container}>
            <Text>
                Background fetch status:{' '}
                <Text style={styles.boldText}>
                
                </Text>
            </Text>
        </View>
        <View style={styles.container}>
            <Text>
                Fecha:
                {status ? BackgroundFetch.BackgroundFetchStatus[status] : null}
            </Text>
        </View>
        <Button
            buttonStyle={styles.button}
            title={
            isRegistered
            ? 'Unregister BackgroundFetch task'
            : 'Register BackgroundFetch task'
        }
        onPress={toggle}
        /> */}
        
        <View style={styles.container}>  
           
            <View style={[styles.iconView, {backgroundColor: "#C7EEB3", borderColor: "#489123", paddingTop: 13}]}>
                <TouchableOpacity                            
                    onPress={() => navigation.navigate('ConductorViajesPendientes')}  
                    style={styles.iconBoton}
                >   
                    <Icon size={35} name="clock" color="#489123"  />
                    <Text 
                            style={styles.iconText}
                        >
                        Viajes por Aceptar
                    </Text>                     
                </TouchableOpacity>
            </View>
            <View style={[styles.iconView, {backgroundColor: "#C8F2ED", borderColor: "#31BCAC", paddingTop: 17}]}>
                <TouchableOpacity                            
                    onPress={() => navigation.navigate('ConductorViajes')}  
                    style={styles.iconBoton}
                >   
                    <Icon size={35} name="car" color={"#055D5D"}  />
                    <Text 
                            style={styles.iconText}
                        >
                            Mis Viajes
                        </Text>                     
                </TouchableOpacity>
            </View>
            <View style={[styles.iconView, {backgroundColor: "#FDD8BF", borderColor: "#D15E0E", paddingTop: 17}]}>
                <TouchableOpacity                            
                    onPress={() => navigation.navigate('SolicitarTaxi')}  
                    style={styles.iconBoton}
                >   
                    <Icon size={35} name="paper-plane" color={"#D15E0E"}  />
                    <Text 
                            style={styles.iconText}
                        >
                        Solicitar Viaje 
                    </Text>                     
                </TouchableOpacity>
            </View>
        </View>
        
        {
          infoUsuario.estatuscod == "3" ? 
          <View style={{width: "100%", marginTop: 20}}>
            {
              isDisponible ?
              <TouchableOpacity 
                  onPress={NoDisponibleViajes}
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderWidth: 1, borderColor: "#1E950D", borderRadius: 10, justifyContent: "center"}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#FFF",
                      }} 
                  >      
                    {
                      isLoadingIsDisponible ?                      
                      <>
                        <Text 
                            style={styles.buttonText}>{' '}
                            <ActivityIndicator size="large" color="black" style={{marginTop: 0, marginBottom: 0}} />
                        </Text>
                      </> :
                      <>
                      <Icon size={20} name="check" color={"#1E950D"}  />
                        <Text 
                            style={styles.buttonText}>{' '}
                            Estás en línea para viajes
                        </Text>
                      </>
                    }                                                     
                  </View>
              </TouchableOpacity>
              :
              <TouchableOpacity 
                  onPress={DisponibleViajes}
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderWidth: 1, borderColor: "#B43219", borderRadius: 10, justifyContent: "center"}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#FFF",
                      }} 
                  >       
                      {
                        isLoadingIsDisponible ?                      
                        <>
                          <Text 
                              style={styles.buttonTextNo}>{' '}
                              <ActivityIndicator size="large" color="black" style={{marginTop: 0, marginBottom: 0}} />
                          </Text>
                        </> :
                        <>
                          <Icon size={20} name="minus" color={"#B43219"}  />
                          <Text 
                              style={styles.buttonTextNo}>{' '}
                              No estás en línea para viajes
                          </Text>
                        </>
                      }
                                                  
                  </View>
              </TouchableOpacity>
            }              
          </View>
          : null
        }
        
          {
            infoUsuario.estatuscod == "4" ?
            <View style={{width: "100%", marginTop: 20}}>
              <TouchableOpacity 
                  onPress={() => navigation.navigate('UsuarioRequisitos')}  
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderWidth: 1, borderColor: "#F6831E", borderRadius: 10, justifyContent: "center"}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#FFF",
                          paddingHorizontal: 20
                      }} 
                  >      
                    {                    
                      <>     
                        <View style={{justifyContent: "center", alignItems: "center", paddingVertical: 15}}>
                          <View>
                            <Text>
                              <Icon size={50} name="exclamation-circle" color={"#D1670A"}  />  
                            </Text>
                          </View>
                          <View>
                            <Text 
                                style={{
                                  ...styles.buttonText,
                                  color: "#D1670A"                            
                                }} 
                                >{' '}
                                Tienes requisitos pendientes para poder activar tu cuenta. 
                            </Text>
                            <Text 
                                style={{
                                  ...styles.buttonText,
                                  color: "#D1670A"                            
                                }} 
                                >{' '}
                                Ingresa aquí para cargarlos 
                            </Text>
                          </View>
                        </View>               
                        
                      </>
                    }                                                     
                  </View>
              </TouchableOpacity>
            </View>
            :              
            usuario.estatusCodigo == "1" ? 
            <View style={{width: "100%", marginTop: 20}}>
              <TouchableOpacity 
                  onPress={ReenviarCodigoRegistro}  
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderWidth: 1, borderColor: "#F6831E", borderRadius: 10, justifyContent: "center"}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#FFF",
                          paddingHorizontal: 20
                      }} 
                  >      
                    {                    
                      <>     
                        <View style={{justifyContent: "center", alignItems: "center", paddingVertical: 15}}>
                          <View>
                            <Text>
                              <Icon size={50} name="envelope" color={"#D1670A"}  />  
                            </Text>
                          </View>
                          <View>
                            <Text 
                                style={{
                                  ...styles.buttonText,
                                  color: "#D1670A"                            
                                }} 
                                >{' '}
                                Por favor confirme el código enviado por email para poder activar tu cuenta
                            </Text>
                            <Text 
                                style={{
                                  ...styles.buttonText,
                                  color: "#D1670A"                            
                                }} 
                                >{' '}
                                Reenviar Código
                            </Text>
                          </View>
                        </View>               
                        
                      </>
                    }                                                     
                  </View>
              </TouchableOpacity>
            </View>
            : 
            usuario.estatusCodigo == "2" ? 
            <View style={{width: "100%", marginTop: 20}}>
              <TouchableOpacity
                disabled 
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderWidth: 1, borderColor: "#C9B310", borderRadius: 10, justifyContent: "center"}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#FFF",
                          paddingHorizontal: 20
                      }} 
                  >        
                    {                     
                      <>     
                        <View style={{justifyContent: "center", alignItems: "center", paddingVertical: 15}}>
                          <View>
                            <Text>
                              <Icon size={50} name="file" color={"#C9B310"}  />  
                            </Text>  
                          </View>
                          <View>
                            <Text 
                                style={{
                                  ...styles.buttonText,
                                  color: "#C9B310"                            
                                }} 
                                >{' '}
                                Estamos verificando tu cuenta y los requisitos, en breve será habilitado tu cuenta
                            </Text>                            
                          </View>
                        </View>               
                        
                      </>
                    }                                                     
                  </View>
              </TouchableOpacity>
            </View>
            : null                       
          }   

        
        {viajesLista.length ===0 ? 
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 20, width: "100%"}}>
                <View style={{backgroundColor: "#C8F2ED",  borderRadius: 5, padding: 20, width: "95%"}}>
                    <Text style={{color: "#055D5D", fontSize: 14, textAlign: "center"}}>No tienes viajes realizados</Text>
                </View>                
            </View>
            :             
            <View style={{width: "100%", marginTop: 0, marginBottom: 10}}>
                <Text style={{textAlign: "center", fontSize: 16}}>
                  Últimas actividades
                </Text>
            </View>
        }

        {
          isLoading ?  
          <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
            <Skeleton
                
                animation="wave"
                width="90%"
                height={100}
                style={{marginTop: 15}}
            /> 
            <Skeleton
                
                animation="wave"
                width="90%"
                height={100}
                style={{marginTop: 15}}
            /> 
            <Skeleton
                
                animation="wave"
                width="90%"
                height={100}
                style={{marginTop: 15}}
            />                                           
        </View> 
        :
        <Viajes valores={viajesLista} />
      }
                                 
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        marginHorizontal: 15,
        marginTop: 15,
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
    buttonText: {
        color: "#1E950D",
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

export default PanelConductor
