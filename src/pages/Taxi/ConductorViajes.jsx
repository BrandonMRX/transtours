import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import { Skeleton } from '@rneui/themed';

import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import Viajes from "../../components/Viajes";

const ConductorViajes = ({navigation}) => {

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

  const isFocused = useIsFocused();
  const usuario = useSelector(state => state.usuario)

  const [viajesLista, setViajesLista] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    
    try {

      if (usuario.tokenRegistro){

        setIsLoading(true);

        const resp = await axios.post(APP_URLAPI+'taxiconductorviajes',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        );
        ////console.log("taxiconductorviajes");
        ////console.log(resp.data);
        if (resp.data.code==0){
          setViajesLista(resp.data.data.items);
        }else if (resp.data.code==103 || resp.data.code==104){
          setIsLoading(false);
          navigation.navigate({name: 'Ingreso'})
          return false;          
        }else{
          setViajesLista([]);          
        }
        
        setIsLoading(false);
      }

    } catch (err) {        
        console.error(err);
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isFocused){return;}
    setIsLoading(true);
    if (usuario.tokenRegistro){
      fetchData();
    }
    
  }, [isFocused]);
    
  return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>      
      {
        isLoading ? 
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
        viajesLista.length ===0 ? 
        <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>                
            <View style={{justifyContent: "center", alignItems:"center"}}>
                                    
                <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                    <Text style={{fontSize: 18, textAlign: "center"}}>
                      No tienes viajes realizados
                    </Text>                    
                </View>
                <Image
                    source={require('../../../assets/img/solicitartaxi.jpg')}          
                    style={{resizeMode: 'contain', height: 200, width: 200}}
                />                      
            </View>               

        </View> 
        : 
        <Viajes valores={viajesLista} />               
      }        
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

export default ConductorViajes