import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
//import { inicial } from '../../app/notaSlice';

//import NotasList from './NotasList'
import { ScrollView } from "react-native-gesture-handler";
import { APP_URLAPI, COMPANIA_ID, COLORBOTONPRINCIPAL, REFERIDOS, TIPOAPP } from '@env'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import axios from 'axios';

const Direcciones = ({navigation, route}) => {

  const usuario = useSelector(state => state.usuario)  
  const isFocused = useIsFocused();
  const [lista, setLista] = useState([]);  
  const [isLoading, setIsLoading] = useState(false);
  const [disabledBoton, setDisabledBoton] = useState(false);

  useEffect(() => {
    if (!isFocused){return;}      
    if (!usuario.tokenRegistro){navigation.navigate({name: 'SolicitarIngresar'})}

    buscar(); 
  }, [isFocused]);

  const buscar = async () => {

    setIsLoading(true);
    setDisabledBoton(true);

    //console.log("en buscar:");
    //console.log(route?.params);

    

    try {    
        
      const resp = await axios.post(APP_URLAPI+'direcciones',
      {          
          token: usuario.tokenRegistro,
          compania: COMPANIA_ID
      });


      console.log("en direcciones:");
      console.log(resp.data);
      ////console.log(resp.data);

      if (resp.data.code==0){
        setLista(resp.data.data);  
        setIsLoading(false);    
        setDisabledBoton(false);  
      }
      else if (resp.data.code==103 || resp.data.code==104){

        setDisabledBoton(false);
        setIsLoading(false);
        navigation.navigate({name: 'SolicitarIngresar'})
        return false;          
      }
      else{          
        setLista([]); 
        setIsLoading(false);      
        setDisabledBoton(false);  
      }
    
    } catch (err) {        
        console.error("error direcciones:");
        console.error(err);
        setIsLoading(false);      
        
    }
  };

  
  return (
  <ImageBackground source={require('../../../assets/img/fondoscreenwhite.png')} resizeMode="cover"> 
  <SafeAreaView style={{height: "100%"}}>
      {
        isLoading ? (
          <View style={{alignContent: "center", justifyContent: "center", alignSelf: "center", marginBottom: 100}}>      
              <ActivityIndicator size="large" color="black" style={{marginTop: 0, marginBottom: 0}} />                      
          </View>            
        ) 
        :
        lista.length ==0 ? 
          <View style={{justifyContent: "center", alignItems: "center", marginVertical: 0, marginHorizontal: 20 }}>
            <View style={{backgroundColor: "#C8F2ED",  borderColor: "#168E12", borderRadius: 5, width: "100%", padding: 20, margin: 20}}>
                <Text style={{color: "#095D53", fontSize: 14, textAlign: "center"}}>No existen direcciones agregados</Text>
            </View>                
          </View>
        :
        <>        
        <FlatList
        style={{marginTop: 0}}
        data={lista}
        renderItem={
          ({item}) => 
          <TouchableOpacity  
            onPress={() => {
              navigation.navigate({
                name: 
                  route?.params?.origin == "viajebuscar" ? 'ViajeBuscar' :
                  route?.params?.origin == "reportarrecogida" ? 'Reportar' :
                  route?.params?.origin == "reportarincidencia" ? 'Reportar' :
                  'DireccionCrear',


                params: {item: route?.params?.item,  direccionGuardada: item, tipo: route?.params?.tipo },
                merge: true,
              });
            }}
          >
            <View style={{flex: 1, flexDirection: "row", backgroundColor: "#fff", borderRadius: 15, borderColor: "#ECEDEE", borderWidth: 1, marginTop: 13, borderRadius: 15, marginHorizontal: 20, paddingBottom: 10}}>
              <View style={{width: "85%", paddingRight: 10, paddingLeft: 10}}>
                <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", paddingTop: 0, fontWeight: "700", marginTop: 7}}>
                  {item.usuariodireccion_dirmapa} 
                </Text> 
                { 
                  item.usuariodireccion_contactonombre ?
                  <Text style={{fontSize: 15, justifyContent: "center", textAlignVertical: "center", paddingTop: 0}}>
                    {item.usuariodireccion_contactonombre}
                  </Text> 
                  : null
                }

                { 
                  item.usuariodireccion_contactotelf ?
                  <Text style={{fontSize: 15, justifyContent: "center", textAlignVertical: "center", paddingTop: 0}}>
                    {item.usuariodireccion_contactotelf}
                  </Text> 
                  : null
                }
                     
              </View>                
              <View style={{width: "15%", justifyContent: "center" }}>
                <Icon size={24} name="angle-right" color={COLORBOTONPRINCIPAL} style={{width: 22}} />
              </View>                
            </View>           
          </TouchableOpacity>
        }        
        /> 
      </>
      }   

      {
        //route?.params?.origin == "viajebuscar" ? null
        //:
        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 10}}>
          <View style={{width: "100%"}}>
              <TouchableOpacity 
                  onPress={() => navigation.navigate('DireccionMapa', {url: 'DireccionCrear'})}
                  style={{textAlign: "center", marginTop: 5, margin: 12,
                  borderRadius: 10, justifyContent: "center"}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: COLORBOTONPRINCIPAL,
                      }} 
                  >                              
                      <Text 
                          style={styles.buttonText}>                        
                          Agregar Dirección
                      </Text>                            
                  </View>
              </TouchableOpacity>
          </View> 
        </View>   
      
      } 
      
       
  </SafeAreaView>
  </ImageBackground>
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
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      borderColor: "#E0E1E1",
      alignSelf: "stretch"
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
        color: "#FFFFFF",
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

export default Direcciones


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
 