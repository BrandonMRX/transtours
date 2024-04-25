import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { Skeleton } from '@rneui/themed';

import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import Viajes from "../../components/Viajes";

const ConductorViajesPendientes = ({navigation}) => {

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

  const isFocused = useIsFocused();
  const usuario = useSelector(state => state.usuario)

  const [viajesLista, setViajesLista] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    
    try {
      
        const resp = await axios.post(APP_URLAPI+'taxiconductorviajespendientes',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        );
        ////console.log("usuario.tokenRegistro");
        ////console.log(usuario.tokenRegistro);
        console.log("taxiconductorviajespendientes");
        //console.log(resp.data.data.items);

        if (resp.data.code==0){
          setViajesLista(resp.data.data.items);
        }else if (resp.data.code==103 || resp.data.code==104){
          setIsLoading(false);
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          setViajesLista([]);
          
          setIsLoading(false);
        }
      setIsLoading(false);

    } catch (err) {        
        console.error(err);
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFocused){return;}
    setIsLoading(true);
    fetchData();
  }, [isFocused]);
    
  return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>
      
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
        (
        <>        

        {viajesLista.length ===0 ? 
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>                
                <View style={{justifyContent: "center", alignItems:"center"}}>
                                       
                    <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                        <Text style={{fontSize: 18, textAlign: "center"}}>
                          No tienes viajes pendientes por aceptar
                        </Text>                    
                    </View>
                    <Image
                        source={require('../../../assets/img/esperandoconductor.jpg')}          
                        style={{resizeMode: 'contain', height: 200, width: 200}}
                    /> 
                     
                    
                </View>
                

            </View>
            : null 
        }  

        <Viajes valores={viajesLista} />   
        
        </>
        )}        
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 24
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
});

export default ConductorViajesPendientes