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

const PanelAdminInicio = ({navigation}) => {
  
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

    const usuario = useSelector(state => state.usuario)
  
    const [expoPushToken, setExpoPushToken] = useState('');
    const [tipoServicioLista, setTipoServicioLista] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    const dispatch = useDispatch()

    const isFocused = useIsFocused();
    const [viajesLista, setViajesLista] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [reporteConductor, setReporteConductor] = useState({});
    const [reporteViaje, setReporteViaje] = useState({});
    const [reporteGasto, setReporteGasto] = useState({});

    const [isLoadingViaje, setIsLoadingViaje] = useState(false);
    const [isLoadingReporteConductor, setIsLoadingReporteConductor] = useState(false);
    const [isLoadingReporteViaje, setIsLoadingReporteViaje] = useState(false);
    const [isLoadingReporteGasto, setIsLoadingReporteGasto] = useState(false);
    

    const fetchData = async () => {

      setIsLoadingReporteConductor(true);
      setIsLoadingReporteViaje(true);
      setIsLoadingViaje(true);
      setIsLoadingReporteGasto(true);

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

      
      try { 
          const resp = await axios.post(APP_URLAPI+'taxiviajes',
              {          
                  token: usuario.tokenRegistro,
                  compania: COMPANIA_ID
              }
          ); 

          console.log("taxiviajes:");           

          if (resp.data.code==0){
            console.log(resp.data.data.items);          
            setViajesLista(resp.data.data.items);
            setIsLoadingViaje(false);
          }else if (resp.data.code==103 || resp.data.code==104){
            setIsLoadingViaje(false);
            navigation.navigate({name: 'Ingreso'})
            return false;          
          }else{
            setIsLoadingViaje(false);
            setViajesLista([]);          
          }
  
      } catch (err) {        
        setIsLoadingViaje(false);
        setViajesLista([]);          
        console.error(err);
      }


      try { 
        const resp = await axios.post(APP_URLAPI+'taxireporteconductores',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        ); 

        console.log("taxireporteconductoresdisponibles:");           

        if (resp.data.code==0){
          console.log(resp.data.data);          
          setReporteConductor(resp.data.data);
          setIsLoadingReporteConductor(false);
        }else if (resp.data.code==103 || resp.data.code==104){
          setReporteConductor({});
          setIsLoadingReporteConductor(false);
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          setReporteConductor({});
          setIsLoadingReporteConductor(false);          
        }

      } catch (err) {   
        setReporteConductor({});
        setIsLoadingReporteConductor(false);     
        console.error(err);
      }


      try { 
        const resp = await axios.post(APP_URLAPI+'taxireporteviajes',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        ); 

        console.log("taxireporteviajes:");           

        if (resp.data.code==0){
          console.log(resp.data.data);          
          setReporteViaje(resp.data.data);
          setIsLoadingReporteViaje(false);
        }else if (resp.data.code==103 || resp.data.code==104){
          setReporteViaje({});
          setIsLoadingReporteViaje(false);
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          setReporteViaje({});
          setIsLoadingReporteViaje(false);          
        }

      } catch (err) {   
        setReporteViaje({});
        setIsLoadingReporteConductor(false);     
        console.error(err);
      }


      try { 
        const resp = await axios.post(APP_URLAPI+'gastoreporte',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        ); 

        console.log("gastoreporte:");           
        console.log(resp.data);   

        if (resp.data.code==0){
          console.log(resp.data.data);          
          setReporteGasto(resp.data.data);
          setIsLoadingReporteGasto(false); 
        }else if (resp.data.code==103 || resp.data.code==104){
          setReporteGasto({});
          setIsLoadingReporteGasto(false);   
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          setReporteGasto({});
          setIsLoadingReporteGasto(false);          
        }

      } catch (err) {   
        setReporteGasto({});
        setIsLoadingReporteGasto(false);     
        console.error(err);
      }

      setIsLoading(false);
      
    };

    useEffect(() => {
      if (!isFocused){return;}

        setIsLoading(true);
        fetchData();
    }, [isFocused]);


    useEffect(() => {

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

      });

      // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      let valoresData = response.notification.request.content.data;
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
   }, [isFocused]);
  
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>   
      <ScrollView>
        {
          isLoadingReporteConductor ? 
          <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row"}}> 
              <Skeleton                          
                  animation="wave"
                  width={"44%"}
                  height={90} 
                  style={{marginLeft: 10, flex: 1, borderRadius: 20}}
              />
              <Skeleton                          
                  animation="wave"
                  width={"44%"}
                  height={90} 
                  style={{marginLeft: 10, flex: 1, borderRadius: 20}}
              />                  
          </View>
          : 
          <>
          <View style={[styles.container, {alignContent:"center", textAlign:"center", marginTop: 10}]}>             
            <View style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', width: "100%", borderRadius: 10,  borderWidth: 1, paddingTop: 10, shadowColor: '#ECECEC', borderColor: "#ECECEC", shadowOffset: {width: -2, height: 4}, shadowOpacity: 0.2,shadowRadius: 3, marginBottom: 10}}>
              <View style={{paddingBottom: 0}}>
                  <View style={{padding: 10,  paddingBottom: 0, paddingTop: 0}}>
                      <Text style={{fontSize: 16, paddingTop: 0 ,fontWeight: "400", color: "#000000", textAlign: "left"}}>
                          <Icon size={16} name="users" color={"#20860B"} /> Conductores
                      </Text>
                  </View>
              </View>
              <View style={[styles.container, {marginLeft: 5, marginRight: 5, marginTop: 5}]}>
                <View style={[styles.iconView2, {backgroundColor: "#19640A", borderColor: "#19640A", paddingTop: 10}]}>
                    <TouchableOpacity                            
                      disabled={true}
                      onPress={() => navigation.navigate({
                        name: 'Reportes',                        
                        merge: true,
                      })}                       
                      style={styles.iconBoton2}
                    >   
                        <Text 
                            style={{fontSize: 30, color:"#FFFFFF"}}
                        >
                            {
                              reporteConductor?.disponibles
                            }{' '}
                            <Icon size={20} name="users" color={"#FFFFFF"}  />
                        </Text>
                        <Text 
                            style={styles.iconText2}
                          >
                            Disponibles
                        </Text>                     
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconView2, {backgroundColor: "#20860B", borderColor: "#20860B", paddingTop: 10}]}>
                    <TouchableOpacity                            
                      disabled={true}
                      onPress={() => navigation.navigate({
                        name: 'Reportes',                        
                        merge: true,
                      })}                       
                      style={styles.iconBoton2}
                    >   
                        <Text 
                            style={{fontSize: 30, color:"#FFFFFF"}}
                        >
                            {
                              reporteConductor?.registrados
                            }{' '}
                            <Icon size={20} name="users" color={"#FFFFFF"}  />
                        </Text>
                        <Text 
                            style={styles.iconText2}
                          >
                            Registrados
                        </Text>                     
                    </TouchableOpacity>
                </View>                                      
              </View> 
            </View>
          </View>          
          </>          
        }

        {
          isLoadingReporteViaje ? 
          <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row"}}> 
              <Skeleton                          
                  animation="wave"
                  width={"44%"}
                  height={90} 
                  style={{marginLeft: 10, flex: 1, borderRadius: 20}}
              />
              <Skeleton                          
                  animation="wave"
                  width={"44%"}
                  height={90} 
                  style={{marginLeft: 10, flex: 1, borderRadius: 20}}
              />                  
          </View>
          : 
          <>
          <View style={[styles.container, {alignContent:"center", textAlign:"center", marginTop: 5}]}>             
            <View style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', width: "100%", borderRadius: 10,  borderWidth: 1, paddingTop: 10, shadowColor: '#ECECEC', borderColor: "#ECECEC", shadowOffset: {width: -2, height: 4}, shadowOpacity: 0.2,shadowRadius: 3, marginBottom: 10}}>
              <View style={{paddingBottom: 0}}>
                  <View style={{padding: 10,  paddingBottom: 0, paddingTop: 0}}>
                      <Text style={{fontSize: 16, paddingTop: 0 ,fontWeight: "400", color: "#000000", textAlign: "left"}}>
                          <Icon size={16} name="car" color={"#10507E"} /> Viajes
                      </Text>
                  </View>
              </View>
              <View style={[styles.container, {marginLeft: 5, marginRight: 5, marginTop: 10}]}>
                <View style={[styles.iconView2, {backgroundColor: "#0B3655", borderColor: "#0B3655", paddingTop: 10}]}>
                    <TouchableOpacity                            
                      onPress={() => navigation.navigate({
                        name: 'Viajes',                        
                        merge: true,
                      })}                       
                      style={styles.iconBoton2}
                    >   
                        <Text 
                            style={{fontSize: 30, color:"#FFFFFF"}}
                        >
                            {
                              reporteViaje?.totalviajes
                            }{' '}
                            <Icon size={20} name="car" color={"#FFFFFF"}  />
                        </Text>
                        <Text 
                            style={styles.iconText2}
                          >
                            Realizados
                        </Text>                     
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconView2, {backgroundColor: "#10507E", borderColor: "#10507E", paddingTop: 10}]}>
                    <TouchableOpacity                            
                      onPress={() => navigation.navigate({
                        name: 'Viajes',                        
                        merge: true,
                      })}                       
                      style={styles.iconBoton2}
                    >   
                        <Text 
                            style={{fontSize: 30, color:"#FFFFFF"}}
                        >
                            {
                              reporteViaje?.encurso
                            }{' '}
                            <Icon size={20} name="car" color={"#FFFFFF"}  />
                        </Text>
                        <Text 
                            style={styles.iconText2}
                          >
                            En curso
                        </Text>                     
                    </TouchableOpacity>
                </View>                                      
              </View> 
            </View>
          </View>          
          </>          
        }

        {
          isLoadingReporteGasto ? 
          <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row"}}> 
              <Skeleton                          
                  animation="wave"
                  width={"44%"}
                  height={90} 
                  style={{marginLeft: 10, flex: 1, borderRadius: 20}}
              />
              <Skeleton                          
                  animation="wave"
                  width={"44%"}
                  height={90} 
                  style={{marginLeft: 10, flex: 1, borderRadius: 20}}
              />                  
          </View>
          : 
          <>
          <View style={[styles.container, {alignContent:"center", textAlign:"center", marginTop: 5}]}>             
            <View style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', width: "100%", borderRadius: 10,  borderWidth: 1, paddingTop: 10, shadowColor: '#ECECEC', borderColor: "#ECECEC", shadowOffset: {width: -2, height: 4}, shadowOpacity: 0.2,shadowRadius: 3, marginBottom: 10}}>
              <View style={{paddingBottom: 0}}>
                  <View style={{padding: 10,  paddingBottom: 0, paddingTop: 0}}>
                      <Text style={{fontSize: 16, paddingTop: 0 ,fontWeight: "400", color: "#000000", textAlign: "left"}}>
                          <Icon size={16} name="file" color={"#BD6515"} /> Gastos
                      </Text>
                  </View>
              </View>
              <View style={[styles.container, {marginLeft: 5, marginRight: 5, marginTop: 10}]}>
                <View style={[styles.iconView2, {backgroundColor: "#A05713", borderColor: "#A05713", paddingTop: 10}]}>
                    <TouchableOpacity                            
                      onPress={() => navigation.navigate({
                        name: 'ReporteGastos',                        
                        merge: true,
                      })}                       
                      style={styles.iconBoton2}
                    >   
                        <Text 
                            style={{fontSize: 30, color:"#FFFFFF"}}
                        >
                            {
                              reporteGasto?.pendientes
                            }{' '}
                            <Icon size={20} name="file" color={"#FFFFFF"}  />
                        </Text>
                        <Text 
                            style={styles.iconText2}
                          >
                            Pendientes
                        </Text>                     
                    </TouchableOpacity>
                </View>
                <View style={[styles.iconView2, {backgroundColor: "#BD6515", borderColor: "#BD6515", paddingTop: 10}]}>
                    <TouchableOpacity                            
                      onPress={() => navigation.navigate({
                        name: 'ReporteGastos',                        
                        merge: true,
                      })}                       
                      style={styles.iconBoton2}
                    >   
                        <Text 
                            style={{fontSize: 30, color:"#FFFFFF"}}
                        >
                            {
                              reporteGasto?.registrados 
                            }{' '}
                            <Icon size={20} name="file" color={"#FFFFFF"}  />
                        </Text>
                        <Text 
                            style={styles.iconText2}
                          >
                            Registrados
                        </Text>                     
                    </TouchableOpacity>
                </View>                                      
              </View> 
            </View>
          </View>          
          </>          
        }

        { 
          isLoadingViaje ? 
          <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", alignItems: "center", alignSelf: "center"}}>
            <Skeleton
                animation="wave"
                width="90%"
                height={70}
                style={{marginTop: 15}}
            /> 
            <Skeleton
                animation="wave"
                width="90%"
                height={70}
                style={{marginTop: 15}}
            /> 
            <Skeleton
                animation="wave"
                width="90%"
                height={70}
                style={{marginTop: 15}}
            />                                           
        </View>          
        :
        <>
          <View style={{width: "100%", marginTop: 5, marginBottom: 10}}>
            <Text style={{textAlign: "center", fontSize: 16}}>
              Últimos viajes 
            </Text>
          </View>
          {
            viajesLista.length ===0 ? 
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 20, width: "100%"}}>
                <View style={{backgroundColor: "#C8F2ED",  borderRadius: 5, padding: 20, width: "95%"}}>
                    <Text style={{color: "#055D5D", fontSize: 14, textAlign: "center"}}>No existen viajes realizados</Text>
                </View>                
            </View>
            : 
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
                          <Text style={{fontSize: 18, fontWeight: "500"}}>
                              {item.destino}
                          </Text>
                          {
                              COMPANIA_ID !="398888" ? 
                              <Text style={{fontSize: 18}}>
                              {item.formapago} {item.monto}
                              </Text>
                              : null
                          }
                          <Text style={{fontSize: 18}}>
                          {item.tipotarifa} 
                          </Text>
                          <Text style={{fontSize: 18, justifyContent: "center", textAlignVertical: "center"}}>
                              {item.fecha}
                          </Text>
                          <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                              {item.estatus} 
                          </Text>
                      </View>
                      <View style={{width: "10%", justifyContent: "center" }}>
                          <Icon size={24} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
                      </View>                
                  </View>
              </TouchableOpacity>   
              
            )
          }

        </>          
      }

      </ScrollView>           
    </SafeAreaView>
    );
}; 



const styles = StyleSheet.create({
  iconView2: {
    backgroundColor: "#FFFFFF",
    width: "47%",
    height: 90,
    margin: 4,
    borderColor: "#EDEDED", 
    borderWidth: 1, 
    borderRadius: 15, 
    paddingHorizontal: 5,
    paddingVertical: 5,
    paddingTop: 10,
    paddingLeft: 10
  },   
  iconText2: {
    fontWeight: "normal",       
    fontSize: 14, 
    textAlign: "left",
    color: "#FFFFFF"
}, 
iconBoton2: {
  justifyContent: "center", 
  textAlign:'left'
},
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

export default PanelAdminInicio
