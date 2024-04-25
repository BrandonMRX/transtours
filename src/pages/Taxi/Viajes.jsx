import React, { useState, useContext, Component, useEffect, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import PedirLogin from "../../components/PedirLogin";
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import { Skeleton } from '@rneui/themed';

const Viajes = ({navigation}) => {

/*   useFocusEffect(
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
      
        const resp = await axios.post(APP_URLAPI+'taxiviajes',
            {          
                token: usuario.tokenRegistro,
                compania: COMPANIA_ID
            }
        );
        if (resp.data.code==0){
          setViajesLista(resp.data.data.items);
        }else if (resp.data.code==103 || resp.data.code==104){
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
            viajesLista?.length == 0 && usuario.tokenRegistro  ? 
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 20}}>                
                <View style={{justifyContent: "center", alignItems:"center"}}>
                                       
                    <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
                        <Text style={{fontSize: 18, textAlign: "center"}}>
                          No tienes viajes realizados
                        </Text>                    
                    </View>
                    <Image
                        source={require('../../../assets/img/esperandoconductor.jpg')}          
                        style={{resizeMode: 'contain', height: 200, width: 200}}
                    /> 
                     
                    
                </View>
                <View style={{width: "100%"}}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Panel')} 
                        style={{textAlign: "center", marginTop: 5, margin: 12,
                        borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
                        <View
                            style={{
                                ...styles.button,
                                backgroundColor: COLORBOTONPRINCIPAL,
                            }} 
                        >                              
                            <Text 
                                style={styles.buttonText}>
                                Solicitar Viaje
                            </Text>                            
                        </View>
                    </TouchableOpacity>
                </View>
                  

            </View>
          :
          <FlatList          
            data={viajesLista}
            renderItem={
              ({item}) => 
              <TouchableOpacity  
              onPress={() => {
                if (item.estatuscod == "6") {
                  navigation.navigate({
                    name: 'ViajeSolicitarConfirmar',
                    params: { item: item},
                    merge: true,
                  });
                } else if (item.estatuscod == "2"  || item.estatuscod == "3") {
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

                <View style={{flex: 1, flexDirection: "row", backgroundColor: "#F5F5F5", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 20}}>
                  <View style={{width: "20%",  paddingHorizontal: 10, paddingTop: 15}}>
                    <Image 
                      style={{height: 60, width: 60, resizeMode: 'contain'}}
                      source={{
                        uri: item.imagen
                      }}                    
                    />
                  </View>
                  <View style={{width: "70%", paddingLeft:10}}>
                    <Text style={{fontSize: 18, fontWeight: "500", color: COLORHEADER}}>
                      {item.destino} 
                    </Text>
                    {
                        COMPANIA_ID !="398888" ? 
                        <>
                          <Text style={{fontSize: 18, fontWeight:"600"}}>
                            {item.monto}
                          </Text>
                          <Text style={{fontSize: 18}}>
                            {item.formapago}
                          </Text>
                        </>
                        : null
                    }
                    
                    <Text style={{fontSize: 18}}>
                    {item.tipotarifa} 
                    </Text>
                    <Text style={{fontSize: 18, justifyContent: "center", textAlignVertical: "center"}}>
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
            }
          />
        }

        {
          usuario.tokenRegistro !="" ? null : <PedirLogin />
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

export default Viajes