import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector, useDispatch } from 'react-redux'



import { ScrollView } from "react-native-gesture-handler";
import { color } from "react-native-reanimated";



const ConductorViajeYaAsignado = ({navigation, route}) => {
   
    return (
    <SafeAreaView style={{backgroundColor: "#fff", height: "100%"}}>
       
        <View style={{backgroundColor: "#fff", marginTop: 10, paddingVertical: 10, borderRadius: 15, marginHorizontal: 20, paddingLeft: 10, justifyContent: "center", alignItems: "center", textAlign: "center"}}> 
            <View style={{paddingTop: 3, marginBottom: 20, width: 100, textAlign: "center"}}>
                <Icon size={80} name="exclamation-circle" color={"#EA9D2F"} style={{width: 80}} />
            </View>            
                      
            <View style={{textAlign: "center", justifyContent: "center", alignItems: "center"}}>                
                <Text style={{fontSize: 22, justifyContent: "center", textAlignVertical: "center", textAlign: "center", paddingTop: 0, fontWeight: "500"}}>
                    El viaje ya fue agarrado
                </Text> 
                <Text style={{fontSize: 16, justifyContent: "center", textAlignVertical: "center", textAlign: "center", paddingTop: 0, fontWeight: "400", marginTop: 10}}>
                    Te notificaremos cuando exista un nuevo viaje pendiente
                </Text>                                 
            </View> 

             
                                
        </View>
        <View style={{marginTop: 20, justifyContent: "center", alignItems: "center"}}>
            <View style={{width: 240}}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Panel')}
                    style={{textAlign: "center", marginTop: 5, margin: 12,
                    borderWidth: 1, borderColor: "#489123", borderRadius: 10, justifyContent: "center"}}>
                    <View
                        style={{
                            ...styles.button,
                            backgroundColor: "#C7EEB3",
                        }} 
                    >                         
                        <Text 
                            style={[styles.buttonText, {color: "#4A8A11"}]}>                               
                            
                            Volver
                        </Text>                            
                    </View>
                </TouchableOpacity>
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
        color: "#055D5D",
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

export default ConductorViajeYaAsignado
