import React, { useState, useContext, Component, useEffect, useRef, useCallback } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator, BackHandler } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import { Skeleton } from '@rneui/themed';


import { ScrollView } from "react-native-gesture-handler";

import Toast from 'react-native-toast-message';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused, useFocusEffect} from "@react-navigation/native";


//import DatePicker from 'react-native-date-picker';
import moment from 'moment';

//import DatePicker from 'react-native-modern-datepicker';


const ConductorReporte = ({navigation}) => {

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

  const buscarReporte = async () => {

    setIsLoading(true);
    setDisabledBoton(true);

    try {

        ////console.log("en buscarReporte:");

        let fechapasarInicio = "";        
        if (fechaInicioMostrarTexto!="Fecha de Inicio"){
          fechapasarInicio = fechaInicioMostrarTexto
        }

        let fechapasarFin = "";
        if (fechaFinMostrarTexto!="Fecha de Fin"){
          fechapasarFin = fechaFinMostrarTexto
        }

        if (fechaInicioMostrarTexto=="Fecha de Inicio" && fechaFinMostrarTexto=="Fecha de Fin"){
          setTextoFecha(" HOY");
        }else{
          setTextoFecha("");
        }

        const resp = await axios.post(APP_URLAPI+'taxiconductorresumen',
        {          
            token: usuario.tokenRegistro,
            compania: COMPANIA_ID,
            fechadesde: fechapasarInicio,
            fechahasta: fechapasarFin
        }
      );

      ////console.log(resp.data.data);

      if (resp.data.code==0){
        setResumenConductor(resp.data.data);
      }else if (resp.data.code==103 || resp.data.code==104){
        setResumenConductor(false);
        navigation.navigate({name: 'Ingreso'})
        return false;          
      }else{          
        setResumenConductor(false);
      }
    
    } catch (err) {        
        console.error("error taxiconductorresumen:");
        console.error(err);
        //setIsLoading(false);
    }

    setIsLoading(false);
    setDisabledBoton(false);
  };

  const [mode, setMode] = useState('date');

  const [fechaInicioMostrarTexto, setFechaInicioMostrarTexto] = useState('Fecha de Inicio');
  const [fechaInicio, setFechaInicio] = useState(false);
  const [dateInicio, setDateInicio] = useState(new Date());  
  const [showInicio, setShowInicio] = useState(false);

  const onChangeInicio = (event, selectedDate) => {

    let fecha = moment(selectedDate).format("DD/MM/YYYY");
    
    //setFechaInicio(fecha);

    ////console.log("fecha ini");
    ////console.log(selectedDate);

    //const currentDate = selectedDate;
    setShowInicio(false);
    setFechaInicioMostrarTexto(fecha);
    //setDateInicio(selectedDate);
  };

  const showModeInicio = (currentMode) => {

    setShowInicio(true);
    setMode(currentMode);
  };

  const showDatepickerInicio = () => {
    showModeInicio('date');
  };


  const [fechaFinMostrarTexto, setFechaFinMostrarTexto] = useState('Fecha de Fin');
  const [fechaFin, setFechaFin] = useState(false);
  const [dateFin, setDateFin] = useState(new Date());  
  const [showFin, setShowFin] = useState(false);

  const onChangeFin = (event, selectedDate) => {

    let fecha = moment(selectedDate).format("DD/MM/YYYY");
    
    //setFechaFin(fecha);

    //const currentDate = selectedDate;
    setShowFin(false);
    setFechaFinMostrarTexto(fecha);
    //setDateFin(currentDate);
  };

  const showModeFin = (currentMode) => {

    setShowFin(true);
    setMode(currentMode);
  };

  const showDatepickerFin = () => {
    showModeFin('date');
  };





  const usuario = useSelector(state => state.usuario)
  const isFocused = useIsFocused();
  const [resumenConductor, setResumenConductor] = useState(true);

  //const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [disabledBoton, setDisabledBoton] = useState(false);
  const [textoFecha, setTextoFecha] = useState('');

  const fetchData = async () => {   
      buscarReporte ();
  };

  useEffect(() => {
    if (!isFocused){return;}
      //setIsLoading(true);
      fetchData();
  }, [isFocused]);
  
  
    return (
    <SafeAreaView style={{backgroundColor: "#FFFFFF", height: "100%"}}>   

        <View>
          <View style={{backgroundColor: '#FFF', flexDirection: "row", flexWrap: "wrap", paddingVertical: 15, justifyContent: "center"}}>

              <View style={{width: "80%"}}>
                <Button onPress={showDatepickerInicio} title={fechaInicioMostrarTexto} style={{width: 300}} />
                {showInicio && (
                  <DateTimePicker
                    testID="dateTimePickerInicio"
                    value={dateInicio}
                    mode={mode}
                    onChange={onChangeInicio}                    
                  />
                )}
              </View>
              <View style={{width: "80%", marginTop: 10}}>
                <Button onPress={showDatepickerFin} title={fechaFinMostrarTexto} style={{width: 300}} />
                {showFin && (
                  <DateTimePicker
                    testID="dateTimePickerFin"
                    value={dateFin}
                    mode={mode}
                    onChange={onChangeFin}                    
                  />
                )}
              </View> 
              <View style={{width: "80%", marginTop: 10}}>

                <TouchableOpacity 
                  disabled={disabledBoton}
                  onPress={buscarReporte}
                  style={{textAlign: "center", marginTop: 5, borderRadius: 10, justifyContent: "center", marginLeft: 0}}>
                  <View
                      style={{
                          ...styles.button,
                          backgroundColor: "#286A04",
                      }} 
                  >   
                      <Icon size={20} name="search" color={"#FFFFFF"}  /> 
                      <Text 
                          style={styles.buttonText}>
                          {' '} 
                          {
                              isLoading ? <ActivityIndicator size="large" color="white" style={{marginTop: 0, marginBottom: 0}} /> : " Buscar"
                          }
                      </Text>                            
                  </View>
                </TouchableOpacity>       
              </View>                                           
          </View>
          
          <View style={{backgroundColor: '#C8F2ED',  borderColor: '#31BCAC',
            borderStyle: 'solid',
            borderWidth: 2,
            borderRadius: 10, marginLeft: 20,
            marginRight: 20, paddingLeft: 20, paddingBottom: 15, marginTop: 10, height: 120}}>
            <View style={{flex: 1, flexDirection: "row"}}>
              <View style={{alignItems:"center", paddingTop: 10, paddingRight: 10}}>
                  <TouchableOpacity                            
                      disabled={true}                                    
                  >                               
                      <Icon size={50} name="money-bill" color="#31BCAC"  />                      
                  </TouchableOpacity>
              </View>
              <View style={{ alignItems:"center", paddingTop: 15}}>
                  <TouchableOpacity    
                                                                  
                  >             
                    {
                      isLoading ?
                      <ActivityIndicator size={80} color="white" style={{marginTop: 0, marginBottom: 0}} /> 
                      : 
                      <>
                        <Text style={{color: "#29620D", textTransform: "uppercase", fontWeight: "bold", paddingLeft: 5, fontSize: 14}}>
                            Ganancia Total {textoFecha}
                        </Text>
                        <Text style={{color: "#29620D", textTransform: "uppercase", fontWeight: "bold", paddingLeft: 5, fontSize: 24}}   >

                            {resumenConductor?.montoganado}
                            
                        </Text>
                        <Text style={{color: "#29620D", fontWeight: "bold", paddingLeft: 5, fontSize: 18}}>
                            {resumenConductor?.cantidad} viajes
                        </Text>
                      </>
                    }              
                     
                      
                  </TouchableOpacity>
              </View>
              
            </View>
          </View>
          
              
        </View>     
         
                
    </SafeAreaView>
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
    datePickerStyle: {
      width: 200,
      marginTop: 20,
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

export default ConductorReporte
