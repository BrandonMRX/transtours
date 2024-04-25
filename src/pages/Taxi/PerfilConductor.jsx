import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

import { ScrollView } from "react-native-gesture-handler";
import { Formik } from 'formik'
import * as Yup from 'yup';
import { floor } from "react-native-reanimated";
import uuid from 'react-native-uuid';
import axios from 'axios';
/* import HTMLView from 'react-native-htmlview';
 */
import { TextInputMask } from 'react-native-masked-text';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

const PerfilConductor = ({navigation, route}) => {


    const isFocused = useIsFocused();
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [montoColocar, setMontoColocar] = useState("");
    const usuario = useSelector(state => state.usuario)
    const [isLoading, setIsLoading] = useState(false);
    const [IsLoadingUsuarioInfo, setIsLoadingUsuarioInfo] = useState(false);
    const [disabledBotonContinuar, setDisabledBotonContinuar] = useState(false);
    const [usuarioInfo, setUsuarioInfo] = useState();

    const sendWhatsAppMessage = async () => {

        let link = "https://api.whatsapp.com/send?phone="+usuarioInfo?.whatsapp;
        Linking.canOpenURL(link)
          .then(supported => {
            if (!supported) {
             Alert.alert(
               'Por favor instale la aplicación de WhatsApp'
             );
           } else {
             return Linking.openURL(link);
           }
         })
         .catch(err => console.error('An error occurred', err));
       
    };

    const buscarUsuario = async (usuarioid) => { // Buscar usuario

        try {
            const resp = await axios.post(APP_URLAPI+'usuarioinfoconductor',
                {          
                    token: usuario.tokenRegistro,
                    id: usuarioid,
                    compania: COMPANIA_ID
                }
            );

            ////console.log("usuarioinfoconductor");
            ////console.log(resp.data);

            if (resp.data.code==0){
                setUsuarioInfo(resp.data.data);
                setIsLoadingUsuarioInfo(false);
            }else if (resp.data.code==103 || resp.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                setUsuarioInfo();        
                setIsLoadingUsuarioInfo(false);
            }
        
        } catch (err) {        
            console.error(err);
            setIsLoadingUsuarioInfo(false);            
        }

        /* 
        try {
            setIsLoading(true);

            
            const resp = await axios.post(APP_URLAPI+'taxiconductorrechazarviaje',
              {          
                token: usuario.tokenRegistro,
                transnotif: viaje?.idnotif,
                compania: COMPANIA_ID
              }
            );

            //////////console.log(resp.data);
            //////////console.log(route.params?.item.idnotif);
            
            if (resp.data.code==0){
                setIsLoading(false);
                navigation.navigate('Panel');
            }else{
                setIsLoading(false);
            }

        } catch (err) {        
            console.error(err);
            setIsLoading(false);
        } */
    };

    const fetchData = async () => {   
        buscarUsuario(route.params?.usuarioid);
    };
  
    useEffect(() => {
        if (!isFocused){return;}
        //////console.log(123456);
        //setIsLoading(true);
        fetchData();
    }, [isFocused]);

    return (
    <SafeAreaView style={{backgroundColor: "#fff", height: "100%"}}>
    <ScrollView> 
        <View>                 
            <Image 
                    style={{height: 150, width: "100%", borderWidth: 1}}                    
                    source={require('../../../assets/img/bannerconductor.jpg')}
                  />   
        </View>                     

        <View style={styles.container}>               
            <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 20, marginBottom:20, alignItems: "center" }}>
                <View style={{marginBottom: 10, marginTop: -85}}>
                    <Image
                        source={{
                            uri: usuarioInfo?.imagen
                        }}  
                        style={styles.imgServicio}
                    /> 
                </View>  
                <View style={{marginBottom: 0, marginTop: 0}}>
                    <Text style={{color: "#343434", fontWeight: "normal", fontSize: 20, textAlign: "center", fontWeight: "bold"}}>
                        {usuarioInfo?.usuario}
                    </Text> 
                </View>  
                <View style={{flexDirection: "row", marginTop: 10, borderRadius: 15, marginHorizontal: 30}}>
                    <View style={{borderRadius: 15, width: "40%", alignItems: "center"}}>
                        <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 15, paddingVertical: 10, width: "100%", borderRadius: 10, borderColor: "#DE7817", borderWidth: 5}}>
                            <View>
                                <Text style={{fontSize: 18, fontWeight: "bold", color: "#DE7817", textAlign:"center"}}>
                                    {usuarioInfo?.totalviajes} <Icon size={20} name="paper-plane" color={"#DE7817"} style=   {{width: 30, marginRight: 10}} />
                                </Text>              
                            </View>
                            <View>
                                <Text style={{fontSize: 14, fontWeight: "bold", color: "#DE7817", textAlign:"center", lineHeight: 25}}>
                                    Viajes
                                </Text>              
                            </View>                            
                        </View>
                    </View>
                    
                    <View style={{borderRadius: 15, width: "40%", alignItems: "center", marginLeft: 10}}>
                        <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 15, paddingVertical: 10, width: "100%", borderRadius: 10, borderColor: "#DCD211", borderWidth: 5}}>
                            <View>
                                <Text style={{fontSize: 18, fontWeight: "bold", color: "#DCD211", textAlign:"center"}}>
                                    {usuarioInfo?.rating} <Icon size={20} name="star" color={"#DCD211"} style=   {{width: 30, marginRight: 10}} />
                                </Text>              
                            </View>
                            <View>
                                <Text style={{fontSize: 14, fontWeight: "bold", color: "#DCD211", textAlign:"center", lineHeight: 25}}>
                                    Rating
                                </Text>              
                            </View>                            
                        </View>
                    </View>

                </View>
                <View style={{flexDirection: "row", marginTop: 10, borderRadius: 15, marginHorizontal: 30}}>
                    
                    
                    <View style={{borderRadius: 15, width: "58%", alignItems: "center", marginLeft: 10}}>
                        <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 15, paddingVertical: 10, width: "100%", borderRadius: 10, borderColor: "#1C669C", borderWidth: 5}}>
                            <View>
                                <Text style={{fontSize: 18, fontWeight: "bold", color: "#1C669C", textAlign:"center"}}>
                                    {usuarioInfo?.registrado}
                                </Text>              
                            </View>
                            <View>
                                <Text style={{fontSize: 14, fontWeight: "bold", color: "#1C669C", textAlign:"center", lineHeight: 25}}>
                                    Registrado
                                </Text>              
                            </View>                            
                        </View>
                    </View>

                </View>
                {
                    usuarioInfo?.whatsapp ? 
                    <View style={{flexDirection: "row", marginTop: 10, borderRadius: 15, marginHorizontal: 30}}>
                        <View style={{borderRadius: 15, width: "95%", alignItems: "center"}}>
                            <TouchableOpacity  
                                onPress={sendWhatsAppMessage}   
                                >
                                <View style={{backgroundColor: "#FFFFFF", paddingHorizontal: 15, paddingVertical: 10, width: "100%", borderRadius: 10, borderColor: "#0EA89C", borderWidth: 5}}>
                                    <View>
                                        <Text style={{fontSize: 18, fontWeight: "bold", color: "#0EA89C", textAlign:"center"}}>
                                            <Icon size={18} name="whatsapp" color={"#0EA89C"} style=   {{width: 30, marginRight: 10}} /> {usuarioInfo?.whatsapp} 
                                        </Text>              
                                    </View>
                                    <View>
                                        <Text style={{fontSize: 14, fontWeight: "bold", color: "#0EA89C", textAlign:"center", lineHeight: 25}}>
                                            Contactar
                                        </Text>              
                                    </View>                            
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :null
                }
                
               
                
            </View>                                
        </View>
    </ScrollView>       
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },    
    buttonText: {
        color: "#FFFFFF",
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
    buttonShare: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 20,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },    
    buttonTextAnexar: {
        color: "#737272",
        fontWeight: "normal",
        fontSize: 15,
        paddingVertical: 5,
        textAlign: "center",
        justifyContent: "center"
    },
    iconView: {
        backgroundColor: "#FFFFFF",
        width: 100,
        height: 100,
        margin: 4,
        borderColor: "#EDEDED", 
        borderWidth: 1, 
        borderRadius: 15, 
        paddingHorizontal: 5,
        paddingVertical: 5,
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
        height: 120, 
        width: 120,
        resizeMode: 'contain'
    },
});

export default PerfilConductor

