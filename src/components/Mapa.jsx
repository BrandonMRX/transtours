import React, { createRef, useRef, useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, Share } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'

import { ScrollView } from "react-native-gesture-handler";

import MapView, { Marker } from 'react-native-maps';
//import * as TaskManager from 'expo-task-manager'; 
//import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import axios from 'axios';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";
import uuid from 'react-native-uuid';

import { actualizarDistancia } from '../app/parametrosSlice';


const Mapa3 = (props) => {

    return (
        <View>
            <Text>123</Text>
        </View>
    );
}

const Mapa = (props) => {

    const dispatch = useDispatch()

    const isFocused = useIsFocused();
    const parametros = useSelector(state => state.parametros)
    const usuario = useSelector(state => state.usuario)

    const [location, setLocation] = useState(null);
    const [coordenadas, setCoordenadas] = useState(null);

    const [distancia, setDistance] = useState("");
    

    const GOOGLE_MAPS_APIKEY = 'AIzaSyCcrtNyclS_0eHH6YQrD6E-x4mH5TCnNyo';

    //const mapEl = useRef(null);

    const mapView = useRef();

    

    async function fitMapDirecciones(result) {

        //////console.log("fitMapDirecciones");
        ////////console.log(result.coordinates[0]);
        /*
        this.mapView.animateToRegion({
            latitude: 40.730610,
            longitude: -73.935242,
            latitudeDelta: 0.026,
            longitudeDelta: 0.027,
          }, 2000)
*/
        /*

        
*/
        ////////console.log(result.coordinates);

        mapRef.current.fitToCoordinates(result.coordinates, {
            edgePadding: {
                top: 50,
                right: 0,
                bottom: 0,
                left: 0,
            },
        }); 

    
      //let distancia = result.distance.toFixed(0);
      //let duration = result.duration.toFixed(0);

      //setMapDistancia(distancia);
      //setMapDuracion(duration);

      ////////console.log("fit");
      ////////console.log(`Distance: ${distancia} km`)
      ////////console.log(`Duration: ${duration} min.`)
    }

    useEffect(() => {
        //console.log("props?.valores");
        //console.log(props?.valores);
        if (props?.valores?.origen){

            let latitudorigen = props?.valores?.latitudorigen;
            let longitudorigen = props?.valores?.longitudorigen;

            let latituddestino = props?.valores?.latituddestino;
            let longituddestino = props?.valores?.longituddestino;
            
            if (props?.valores?.estatuscod=="2"){ // Esperando el conductor
                latitudorigen = props?.valores?.latitudconductor;
                longitudorigen = props?.valores?.longitudconductor;

                latituddestino = props?.valores?.latitudorigen;
                longituddestino = props?.valores?.longitudorigen;
            }            
            
            let coordenadas = {
                origen: {
                    latitude: latitudorigen,
                    longitude: longitudorigen
                },
                destino: {
                    latitude: latituddestino,
                    longitude: longituddestino
                }
            }

            let coordenadasMapDirection = [
                {                
                    latitude: latitudorigen,
                    longitude: longitudorigen
                },
                {
                    latitude: latituddestino,
                    longitude: longituddestino
                }
            ];

            let mapRegion = {
                latitude: parseFloat(latitudorigen),
                longitude: parseFloat(longitudorigen),
                latitudeDelta: .01,
                longitudeDelta: .01
            }
        
            setMapRegion(mapRegion) 
            
            ////////console.log("location");
            ////////console.log(valoresMapa);
            
            //console.log("coordenadass");
            //console.log(coordenadas);
            //console.log("coordenadasMapDirection");
            //console.log(coordenadasMapDirection);
            setLocation(coordenadasMapDirection);
            setCoordenadas(coordenadas);

        }else if (props?.valores){
            //setLocation(props?.valores);
        }        

    }, [props]);

    useEffect(() => {
        (async () => {

            if (!isFocused){return;}
            
            /*
            let { status } = await  Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                //setErrorMsg('Permission to access location was denied');
                verificarPermisosUbicacion();
                return;
            }

            let location = await Location.getCurrentPositionAsync({});

            let response = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });

            let address ="";
        
            for (let item of response) {
              address = `${item.street}, ${item.name}, ${item.postalCode}, ${item.city}, ${item.country}`;
        
              ////////console.log(address);
            }
            
            
            ////////console.log(location);

            */
            
            //var direccionLatitud1 = props.valores?.direccionOrigen?.latitud
            //var direccionLongitude1 = props.valores?.direccionOrigen?.longitud       
            /*
            var direccionLatitud1 = -34.596913161150106
            var direccionLongitude1 = -58.38132409400794      
            */
            //setLatitude(direccionLatitud1);
            //setLongitude(direccionLongitude1);
                
         /*    setMarkerDestino(
              <>
                <Marker 
                  coordinate={{latitude: direccionLatitud1, longitude: direccionLongitude1 }} 
                  title='Direccion 1' 
                  icon={require('../../assets/img/mapuser.png')} >
                </Marker>
                <Marker 
                  coordinate={{latitude: direccionLatitud2, longitude: direccionLongitude2 }} 
                  title='Direccion 2' 
                  icon={require('../../assets/img/mapuser.png')} >
                </Marker>
            
            </>
            );
             */
            /*
            let mapRegion = {
                latitude: coordenadas?.origen?.latitud,
                longitude: coordenadas?.origen?.longitud,
                latitudeDelta: .01,
                longitudeDelta: .01}
        
            setMapRegion(mapRegion) 
            */
                    
        })();
    }, [isFocused]);

    useEffect(() => {
        (async () => {

            if (!isFocused){return;}
            console.log("cambio distancia");
            console.log(distancia);

            let valores = {
                distancia: distancia
            }

            dispatch(actualizarDistancia(valores))
                    
        })();
    }, [distancia]);

    
    const [mapRegion, setMapRegion] = useState({
        latitude: parseFloat(coordenadas?.origen?.latitud),
        longitude: parseFloat(coordenadas?.origen?.longitud),
        latitudeDelta: .01,
        longitudeDelta: .01,
    });
    
    return (
    <View style={{backgroundColor: "#FFFFFF", height: "100%"}}>
        {
            coordenadas?.origen?.latitude || props?.valores?.latitudorigen ? 
            <MapView
                style={{ alignSelf: 'stretch', height: "100%" }}
                region={mapRegion}
                ref={mapView}
                zoomControlEnabled={true}
                >
                {
                coordenadas?.origen  ?
                <>
                    <MapViewDirections
                        strokeColor='red'
                        strokeWidth={4}
                        origin={coordenadas?.origen}
                        destination={coordenadas?.destino}
                        apikey={GOOGLE_MAPS_APIKEY}
                        optimizeWaypoints={true}
                        onReady={result => {  
                            //console.log("result:");
                            //console.log(result);
                            setDistance(result.distance);
                            console.log(`Distance: ${result.distance} km`)
                            //////console.log(result);
                        ////////console.log(result.coordinates[0]);
                        /*  //////console.log(result.coordinates[1]);
                            //////console.log(`Distance: ${result.distance} km`)
                            //////console.log(`Duration: ${result.duration} min.`)
    
                            mapView.current.fitToCoordinates(
                                location,{
                                    edgePadding:{
                                        bottom: 200, right: 50, top: 150, left: 50,
                                    },
                                    animated: true,
                                }
                            ); */
                            /*
                            
                            //////console.log("en fitToCoordinates")   
                            //////console.log(result.coordinates);
                            //////console.log(result);
                            //////console.log(mapView);
                            
                            */
                            //fitMapDirecciones(result)      
                            /*
                            //////console.log("result:");          
                            fitMapDirecciones(result)      
                            //////console.log("origin:");                   
                            //////console.log(coordinates[0]);
                            */
                        }}
                    />
                    {
                        props?.valores?.estatuscod=="2" ?
                        <Marker 
                            coordinate={{latitude: coordenadas?.origen.latitude, longitude: coordenadas?.origen.longitude }} 
                            title='Origen' 
                            icon={require('../../assets/img/mapuser.png')} >
                        </Marker>
                        : 
                        <Marker 
                            coordinate={{latitude: coordenadas?.origen.latitude, longitude: coordenadas?.origen.longitude }} 
                            title='Origen' 
                            icon={require('../../assets/img/mapuser.png')} >
                        </Marker>
                    }
                    
                    <Marker 
                        coordinate={{latitude: coordenadas?.destino.latitude, longitude: coordenadas?.destino?.longitude }} 
                        title='Destino'
                        icon={require('../../assets/img/mapfinish.png')}  >
                    </Marker>                    
                </> 
                :
                null                        
                }
                
            </MapView>
            : null
        }
        
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        flexWrap: "wrap",
    },        
});

export default Mapa
