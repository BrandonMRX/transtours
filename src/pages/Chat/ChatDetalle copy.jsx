import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share, Dimensions, StatusBar} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import axios from 'axios';



const ChatDetalle = ({navigation}) => {

    const [disabledBotonContinuar, setDisabledBotonContinuar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const usuario = useSelector(state => state.usuario)
    const [chatLista, setChatLista] = useState([]);
    const isFocused = useIsFocused();

    const fetchData = async () => {
         
        if (usuario.tokenRegistro!=""){            
            try {
                const resp = await axios.post(APP_URLAPI+'chatdetalle',
                    {          
                        token: usuario.tokenRegistro,
                        compania: COMPANIA_ID
                    }
                );

                //////console.log("chatdetalle: ");
                //////console.log(resp.data);
                if (resp.data.code==0){
                    setChatLista(resp.data.data.items);
                }else{
                    setChatLista([]);          
                    setIsLoading(false);
                }
    
                setIsLoading(false);
            
             } catch (err) {        
                 console.error(err);
                 setChatLista([]);
                 setIsLoading(false);
             }
        }
         
    };

    useEffect(() => {
        if (!isFocused){return;}
        setIsLoading(true);
        fetchData();

    }, [isFocused]);
     
    
    const confirmarAsistencia = (item) => {
        try {
            
        
            // Agregar en Confirmados
            const searchedObjectsConfirmados = []
            arrayConfirmados.forEach((singleRegistroObject, index) => {
                searchedObjectsConfirmados.push(singleRegistroObject) 
            })  

            let today = new Date();
            var date = String(today.getDate()).padStart(2, '0');
            var month = String(today.getMonth() + 1).padStart(2, '0');
            var year = today.getFullYear(); 

            var hours = String(today.getHours()).padStart(2, '0');
            var min = String(today.getMinutes()).padStart(2, '0');
            var sec = String(today.getSeconds()).padStart(2, '0');
            let dateCompleta = date + "/" + month + "/" + year + " " + hours + ":" + min + ":" + sec;

            item.fechaconfirmada = dateCompleta;

            searchedObjectsConfirmados.push(item)
            setArrayConfirmados(searchedObjectsConfirmados) 

             // Quitar de Pendiente
             const searchedObjectsPendientes = []
             arrayPendientes.forEach((singleRegistroObject, index) => {

                if (item.id != singleRegistroObject.id)
                {
                    searchedObjectsPendientes.push(singleRegistroObject)
                }                 
            })  
                          
            setArrayPendientes(searchedObjectsPendientes) 

            Toast.show({
                type: 'success',
                text1: 'Confirmada la Asistencia Correctamente'
            });


        } catch (error) {
            //////console.log(error.message);
        }
    };

    const eliminarAsistencia = (item) => {
        try {

            // Agregar en Pendiente
            const searchedObjectsPendientes = []
            arrayPendientes.forEach((singleRegistroObject, index) => {
                searchedObjectsPendientes.push(singleRegistroObject)           
            })  
            searchedObjectsPendientes.push(item)
            setArrayPendientes(searchedObjectsPendientes) 


            // Quitar de Confirmados
            const searchedObjectsConfirmados = []
            arrayConfirmados.forEach((singleRegistroObject, index) => {

               if (item.id != singleRegistroObject.id)
               {
                searchedObjectsConfirmados.push(singleRegistroObject)
               }                 
            })  
                         
            setArrayConfirmados(searchedObjectsConfirmados) 

            Toast.show({
                type: 'success',
                text1: 'Eliminada la Asistencia Correctamente'
            });

        } catch (error) {
            //////console.log(error.message);
        }
    };

    const Detalle = () => (
        <>
            <View style={[styles.scene, { backgroundColor: '#FFFFFF' }]} >
                <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>
                    <View style={{backgroundColor: "#168E12",  borderRadius: 5, width: 300, padding: 20}}>
                        <Text style={{color: "#FFFFFF", fontSize: 14, textAlign: "center"}}>No existen asistencias pendientes</Text>
                    </View>                
                </View>
               
            </View>
        </>
        
    );

    const handleOnSubmitEnviar = (values, {resetForm}) => {
        setIsLoading(true);
        setDisabledBotonContinuar(true);
        setTimeout(() => {
            handleOnSubmitEnviar2(values, {resetForm});
        }, 100);
    }


    const handleOnSubmitEnviar2 = (values, {resetForm}) => {         
        
        ////console.log("values:" + values.mensaje);
        
        axios
        .post(APP_URLAPI + 'chatenviar',
            {            
                token: usuario.tokenRegistro,                        
                mensaje: values.mensaje,
                compania: COMPANIA_ID
            }
        )   
        .then(response => {
            resetForm({values: ''});
            //////console.log(response);
            if (response.data.code==0){

                ////////console.log("Registro Correcto");
                setIsLoading(false);     
                setDisabledBotonContinuar(false);

                fetchData();
            }else{
                setDisabledBotonContinuar(false);
                setIsLoading(false);    
                fetchData();            
            }
        }).catch(function (error) {
            resetForm({values: ''});
            setIsLoading(false);            
            setDisabledBotonContinuar(false);
            //////console.log("error");
            //////console.log(error);
        })
        
    };

    const Chat = () => (
        <>
            <View style={[styles.scene, { backgroundColor: '#FFFFFF', paddingTop: 10 }]} >
                <FlatList
                data={chatLista}
                renderItem={
                    ({item}) => 
                    <>
                    <View style={{paddingLeft: 10, marginTop: 15, textAlign: "right"}}>
                    <Image
                        source={{
                            uri: item.usuarioimg
                        }}                          
                        style={{resizeMode: 'contain', height: 40, width: 40, alignSelf: item.usuarioid == 1 ? "flex-start" : "flex-end" }}
                    />                                          
                    <View style={{flex: 1, flexDirection: "row", backgroundColor: item.usuarioid == 1 ? "#D0FCCF" : "#E7EDF9", borderColor: item.usuarioid == 1 ? "#AAE7A9" : "#D5DBE6" , borderWidth: 1, marginTop: 5, paddingVertical: 10, borderRadius: 15}}>
                        <View style={{paddingRight: 10, paddingLeft: 10, width: "100%"}}>
                            <Text style={{fontSize: 18, justifyContent: "center", textAlign: item.usuarioid == 1 ? "left" : "right", paddingTop: 0, fontWeight: "700", color: "#2B2B2B"}}>
                                {item.mensaje}
                            </Text>
                            <Text style={{fontSize: 14, justifyContent: "center", textAlign: item.usuarioid == 1 ? "left" : "right", paddingTop: 0}}>
                                {item.usuario} 
                            </Text>  
                            <Text style={{fontSize: 14, justifyContent: "center", textAlign: item.usuarioid == 1 ? "left" : "right", paddingTop: 0}}>
                                {item.fecha}
                            </Text>                            
                        </View>                                        
                    </View>
                    </View>
                    </>
                }
                /> 
                <View>
                <Formik
                        initialValues={{mensaje: ""}}
                        onSubmit={handleOnSubmitEnviar}
                    >
                    {({handleChange, handleBlur, handleSubmit, values, errors}) => (

                        <View>
                            <View style= {{marginRight: 20, paddingLeft: 10, marginTop: 3, flexDirection: "row", paddingVertical: 5}}>
                                <View style={{  width: "86%"}}>
                                    <TextInput
                                        onChangeText={handleChange('mensaje')}
                                        placeholder='Escriba el mensaje'
                                        value={values.mensaje}
                                        style={{borderWidth: 1, borderColor: "gray", borderRadius: 5, padding: 10,  textAlign: "left", marginTop: 10, width: "100%"}}
                                    />  
                                </View>
                                <View style={{   paddingTop: 15, paddingLeft:  10}}>
                                <TouchableOpacity 
                                    disabled={disabledBotonContinuar}
                                    onPress={handleSubmit}  
                                    style={{textAlign: "center", marginTop: 5,  borderRadius: 10, justifyContent: "center"}}>
                                    <Icon size={26} name="paper-plane" color={COLORBOTONPRINCIPAL}  /> 
                                </TouchableOpacity>
                                </View>
                            </View>
                                                   
                        </View>                          
                    )}
                    </Formik>
                </View>
            </View>
        </>
        
    );
    
    
    const initialLayout = { width: Dimensions.get('window').width };
    
    const renderScene = SceneMap({
        
        chat: Chat,
        detalle: Detalle,
    });


    const [index, setIndex] = useState(0);
    const [routes] = useState([
      
      { key: 'chat', title: 'Chat '  },
      { key: 'detalle', title: 'Detalle '  },
    ]);
  
    return (        
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                style={styles.container}
                indicatorStyle={styles.indicatorStyle}
                showPageIndicator={true}

                renderTabBar={props => 
                    <TabBar 
                        renderLabel={({route, color}) => (
                            <Text style={{ color: 'black', margin: 8, textTransform: "none" }}>
                                {route.title}
                            </Text>
                        )} {...props} style={{backgroundColor: '#E6E6E5'}}
                        indicatorStyle={{borderColor: "#E7A608", borderWidth: 2}}
                    />
                }
            />
            
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      color: "#000000"
    },
    scene: {
      flex: 1,
      color: "#000000"
    },
    indicatorStyle: {
        backgroundColor: "#000000",
        padding: 1.5,
        color: "#000000",
        borderColor: "#000000"
    },
  });

export default ChatDetalle