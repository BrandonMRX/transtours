import React, { useRef, useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'

import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";

import axios from 'axios';
import PedirLogin from "../../components/PedirLogin";
import { useIsFocused, useFocusEffect} from "@react-navigation/native";

const TaxiTarifas = ({navigation, route}) => {

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

    const isFocused = useIsFocused();
    const [listaTaxi, setListaTaxi] = useState([]);
    const [formasPago, setFormasPago] = useState([]);
    const parametros = useSelector(state => state.parametros)

    useEffect(() => {
        if (route.params?.item) {
          
        }
    }, [route.params?.item]);

    useEffect(() => {
        (async () => {
            if (!isFocused){return;}
            
            const resp = await axios.post(APP_URLAPI+'taxitarifamostrar',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            });    
            
            //console.log("taxitarifamostrar");
            //console.log(resp.data);
                
            if (resp.data.code==0){//
                setListaTaxi(resp.data.data);
            }else if (resp.data.code==103 || resp.data.code==104){
                navigation.navigate({name: 'Ingreso'})
                return false;          
            }else{
                //////////console.log(resp.data);
            }

            try {
                
                const resp = await axios.post(APP_URLAPI+'formapago',
                {          
                    token: usuario.tokenRegistro,
                    tipo: "1",
                    compania: COMPANIA_ID
                }
                );
        
                if (resp.data.code==0){//
                    setFormasPago(resp.data.data);
                }else if (resp.data.code==103 || resp.data.code==104){
                    navigation.navigate({name: 'Ingreso'})
                    return false;          
                }else{
                    
                }
                
        
            } catch (err) {        
                console.error(err);
            }
        })();
    }, [isFocused]);

    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%", alignContent:"center"}}>        
    <ScrollView>

        {
            usuario.tokenRegistro ?
            <>
            <View style={{backgroundColor: "#FFFFFF"}}>

            {
                listaTaxi ?
                listaTaxi.map(item =>     
                <View key={item.tipotarifa}>                    
                    <View  style={{flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                        <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10}}>
                        <Image 
                            style={{height: 80, width: "100%", resizeMode: 'contain'}}
                            source={{
                                uri: item.imagen
                            }}                    
                        />
                        </View>
                        <View style={{width: "76%", paddingTop: 5}}>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"bold"}}>
                                {item.tipotarifa}
                            </Text>
                            <Text style={{fontSize: 14, justifyContent: "center", textAlignVertical: "center", fontWeight:"500"}}>
                                {item.distancia}
                            </Text>
                            {/* <Text style={{fontSize: 14, justifyContent: "center", textAlignVertical: "center",fontWeight:"500"}}>
                                Monto Inicial: {item.preciominimo}
                            </Text> */}
                        </View>
                    {/*  <View style={{width: "30%", justifyContent: "center" }}>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", fontWeight:"bold"}}>
                                {item.precio}
                            </Text>
                        </View> */}
                        
                    </View>
                </View>                              
                )
                : null         
            } 

                {/* <FlatList          
                data={listaTaxi}
                renderItem={
                    ({item}) => 
                    <TouchableWithoutFeedback>

                    <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                        <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10}}>
                        <Image 
                            style={{height: 80, width: "100%", resizeMode: 'contain'}}
                            source={{
                                uri: item.imagen
                            }}                    
                        />
                        </View>
                        <View style={{width: "76%", paddingTop: 5}}>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"bold"}}>
                                {item.tipotarifa}
                            </Text>
                            <Text style={{fontSize: 14, justifyContent: "center", textAlignVertical: "center", fontWeight:"500"}}>
                                {item.distancia}
                            </Text>
                            <Text style={{fontSize: 14, justifyContent: "center", textAlignVertical: "center",fontWeight:"500", display: "none"}}>
                                Monto Inicial: {item.preciominimo}
                            </Text>
                        </View>
                       <View style={{width: "30%", justifyContent: "center", display: "none" }}>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", fontWeight:"bold"}}>
                                {item.precio}
                            </Text>
                        </View> 
                        
                    </View>
                </TouchableWithoutFeedback>
                    
                }
                /> */}
            </View>
            <View style={{backgroundColor: "#FFFFFF", marginTop: 20}}>
                <Text style={{textAlign: "center", fontSize: 16, fontWeight: "500"}}>
                    <Icon size={20} name="money-bill" color={"#404040"}  />
                    {' '}Formas de pago para viajes
                </Text>
                {
                    formasPago ?
                    formasPago.map(item =>     
                    <View key={item.formapago}>                    
                        <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                            <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10}}>
                            <Image 
                                style={{height: 50, width: "100%", resizeMode: 'contain'}}
                                source={{
                                    uri: item.imagen
                                }}                    
                            />
                            </View>
                            <View style={{width: "50%", paddingTop: 10}}>
                                <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"bold"}}>
                                    {item.formapago}
                                </Text>                           
                            </View>                    
                        </View>
                    </View>                              
                    )
                    : null         
                }
                {/* <FlatList          
                data={formasPago}
                renderItem={
                    ({item}) => 
                    <TouchableWithoutFeedback>

                    <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                        <View style={{width: "20%", justifyContent: "center", paddingHorizontal: 10}}>
                        <Image 
                            style={{height: 50, width: "100%", resizeMode: 'contain'}}
                            source={{
                                uri: item.imagen
                            }}                    
                        />
                        </View>
                        <View style={{width: "50%", paddingTop: 10}}>
                            <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"bold"}}>
                                {item.formapago}
                            </Text>                           
                        </View>                    
                    </View>
                    </TouchableWithoutFeedback>
                    
                    
                }
                />   */}      
            </View>
            <View style={{backgroundColor: "#FFFFFF", marginTop: 20, marginBottom: 30}}>
                <Text style={{textAlign: "center", fontSize: 16, fontWeight: "500"}}>
                    <Icon size={20} name="cogs" color={"#404040"}  />
                    {' '}Configuraciones
                </Text>

                <View style={{flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                    <View style={{width: "40%", justifyContent: "center", paddingHorizontal: 10}}>
                        <Text style={{fontSize: 16, textAlign:"right",fontWeight:"bold"}}>
                            País:
                        </Text> 
                    </View>
                    <View style={{width: "50%", paddingTop: 0}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"400"}}>
                            {parametros.valor.paisNombre}
                        </Text>                           
                    </View>                    
                </View>
                <View style={{flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1}}>
                    <View style={{width: "40%", justifyContent: "center", paddingHorizontal: 10}}>
                        <Text style={{fontSize: 16, textAlign:"right",fontWeight:"bold"}}>
                            Moneda:
                        </Text> 
                    </View>
                    <View style={{width: "50%", paddingTop: 0}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"400"}}>
                            {parametros.valor.moneda}
                        </Text>                           
                    </View>                    
                </View>
                <View style={{flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 10, borderColor: "#D3D3D0", borderWidth: 1, display: "none"}}>
                    <View style={{width: "40%", justifyContent: "center", paddingHorizontal: 10}}>
                        <Text style={{fontSize: 16, textAlign:"right",fontWeight:"bold"}}>
                            Mapa Activado:
                        </Text> 
                    </View>
                    <View style={{width: "50%", paddingTop: 0}}>
                        <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center",fontWeight:"400"}}>
                            Si
                        </Text>                           
                    </View>                    
                </View>

            </View>
            </>
            :
            <View>
                <View style={{justifyContent: "center", alignItems:"center", marginTop: 30}}>
                    <Image
                        source={require('../../../assets/img/pedirlogin.png')}          
                        style={{resizeMode: 'contain', height: 200, width: 300}}
                    />  
                    <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                        <Text style={{fontSize: 16, textAlign: "center"}}>
                            Inicia sesión en tu cuenta para poder observar esta sección
                        </Text>
                    
                    </View>  

                </View>
                <View style={{width: "100%"}}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Ingreso')} 
                    style={{textAlign: "center", marginTop: 5, margin: 12,
                    borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
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
        }
    </ScrollView>
    </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
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
    buttonText: {
        color: "#fff",
        fontWeight: "normal",
        fontSize: 16,
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
        width: 100,
        height: 80,
        margin: 4,
        borderColor: "#EDEDED", 
        borderWidth: 1, 
        borderRadius: 15, 
        paddingHorizontal: 5,
        paddingVertical: 5,
        paddingTop: 10,
        marginLeft: 10
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
      backgroundColor: '#358313',
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
        height: 150, 
        width: 150,
        resizeMode: 'contain'
    },
});

export default TaxiTarifas