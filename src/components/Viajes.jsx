import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER, TIPOAPP } from '@env'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Skeleton } from '@rneui/themed';

import { useIsFocused, useFocusEffect, useNavigation} from "@react-navigation/native";


const Viajes = (props) => {

    const navigation = useNavigation(); 
    const [isLoading, setIsLoading] = useState(true);
    const [lista, setLista] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        setIsLoading(true);
        if (!isFocused){return;}
        if (props?.valores){
            setIsLoading(false);
        }  
        
        //console.log("props");
        //console.log(props);
    }, [props]);

    useEffect(() => {
        (async () => {
            if (!isFocused){return;}
              
        })();
    }, [isFocused]);
    
    return (
        <>
        {
        isLoading ?  
        <View style={{width: "100%", marginTop: 10, marginBottom: 10, justifyContent: "center", flexDirection: "row"}}>
            <Skeleton
                
                animation="wave"
                width={170}
                height={150} 
                style={{marginLeft: 10, flex: 1, borderRadius: 20}}
            />
            <Skeleton
                
                animation="wave"
                width={170}
                height={150}
                style={{marginLeft: 10, flex: 1, borderRadius: 20}}
            />                           
        </View>
        :
        <FlatList          
          data={props?.valores}
          style={{marginTop: 10}}
          renderItem={
            ({item}) => 
            <TouchableOpacity  
            onPress={() => {
              if (item.estatuscod_porconductor == "1") { // Notificado
                navigation.navigate({
                  name: 'ConductorConfirmarViaje',
                  params: { item: item},
                  merge: true,
                });
              } else if (item.estatuscod_porconductor == "2" || item.estatuscod_porconductor == "5"  || item.estatuscod_porconductor == "8") { // Aceptado, En Curso, Conductor llego donde el pasajero	
                navigation.navigate({
                  name: 'ConductorViajeEnCurso',
                  params: { item: item},
                  merge: true,
                });
              } else if (item.estatuscod_porconductor == "3" || item.estatuscod_porconductor == "4" ) { // Cancelado, Aceptado y Cancelado	
                navigation.navigate({
                  name: 'ConductorViajeDetalle',
                  params: { item: item},
                  merge: true,
                });
              } else if (item.estatuscod_porconductor == "6" || item.estatuscod_porconductor == "7") { // Completado	, Rechazado
                navigation.navigate({
                  name: 'ConductorViajeDetalle',
                  params: { item: item},
                  merge: true,
                });
              } else if (item.estatuscod_porconductor == "7") { // Rechazado
                navigation.navigate({
                  name: 'ConductorViajeDetalle',
                  params: { item: item},
                  merge: true,
                });
              }
            }}
            >

              <View style={{flex: 1, flexDirection: "row", 
              backgroundColor: "#F5F5F5", marginBottom: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 20}}>
                <View style={{width: "20%",  paddingHorizontal: 10, paddingTop: 15}}>
                  <Image 
                    style={{height: 60, width: 60, resizeMode: 'contain'}}
                    source={{
                      uri: item.imagen
                    }}                    
                  />
                </View>
                <View style={{width: "70%", paddingLeft:10}}>

                  {
                    COMPANIA_ID == "388" ? 
                    <>
                      <Text style={{fontSize: 18, fontWeight: "500", color: COLORHEADER}}>
                        {item.origen}
                      </Text>
                      <Text style={{fontSize: 16, fontWeight: "500", color: "#5C5C5C"}}>
                        {item.destino}  ({item.distancia})
                      </Text>
                      <Text style={{fontSize: 18, fontWeight: "600"}}>
                      {item.montoarticulo} / {item.montoproveedor} 
                      </Text>  
                      {
                        item.observacionenvio ?
                        <Text style={{fontSize: 18, fontWeight: "600"}}>
                          {item.observacionenvio}
                        </Text>
                        : null
                      }                     
                    </>
                    : 
                    <>
                      <Text style={{fontSize: 18, fontWeight: "500", color: COLORHEADER}}>
                        {item.destino}
                      </Text>
                      {
                        COMPANIA_ID != "398" ? 
                        <>
                        <Text style={{fontSize: 18, fontWeight: "600"}}>
                        {item.montoproveedor} 
                        </Text>
                        <Text style={{fontSize: 18, fontWeight: "600"}}>
                        {item.formapago}
                        </Text>
                        </> 
                        : null
                      }
                      
                    </>
                  }                 
                  <Text style={{fontSize: 18}}>
                    {item.tipotarifa} 
                  </Text>
                  <Text style={{fontSize: 18, justifyContent: "center", textAlignVertical: "center"}}>
                    {item.fecha}
                  </Text>
                  <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center"}}>
                      <View style={{fontSize: 14, color: "#FFFFFF", borderRadius: 10, textAlign: "center", marginBottom: 10, paddingRight: 10, paddingLeft: 10, paddingVertical: 5, 
                          backgroundColor: item?.estatuscolor_porconductor ? item?.estatuscolor_porconductor : "#878988"
                          }}>
                          <Text style={{fontSize: 14, color: "#FFFFFF", textAlign: "center"}}>
                              {item.estatus_porconductor}
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
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
        marginHorizontal: 10,
        marginTop: 10        
    },       
});

export default Viajes
