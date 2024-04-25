import React, { useState, useContext, Component, useEffect } from "react";
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, SectionList, TouchableOpacity, FlatList, ActivityIndicator, ImageBackground } from 'react-native'
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER, TIPOAPP } from '@env'
import { useIsFocused, useFocusEffect, useNavigation} from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome5';

const ListDetalleItem = (props) => {

    const navigation = useNavigation(); 

    const openPhone = async (phoneValue) => {
        
        let link = "tel:"+phoneValue;
        Linking.canOpenURL(link)
        .then(supported => {
            if (!supported) {
            Alert.alert(
            'Por favor instale alguna aplicacion de telefono'
            );
        } else {
            return Linking.openURL(link);
        }
        })
        .catch(err => console.error('An error occurred', err));
    
    };

    return (
        <>
        {
            !props?.titulo || !props?.valor || props?.valor == " " ? false
            : 
            <View style= {{marginTop: 10, flexDirection: "row", paddingVertical: 5, borderBottomColor: "#DBD8D8", borderBottomWidth: 1, width: "100%", paddingLeft: props?.paddingLeft ? props?.paddingLeft : 0}}>
                <View style={{ }}>
                    <Text style={{color: COLORHEADER, textAlign: "left", fontSize: 16, paddingLeft: 5, fontWeight: props?.fontWeight ? props?.fontWeight : "600"}}>
                        {props?.titulo}: 
                    </Text>
                </View>
                <View style={{ flex: 1}}>
                    {
                        props?.phone ?
                            <TouchableOpacity 
                                onPress={() => openPhone(props?.valor)}                      
                            >
                                <Text style={{textAlign: "right", fontSize: 16, fontWeight: "600"}}>
                                    <Icon size={18} name="phone" color={COLORBOTONPRINCIPAL}  /> {props?.valor}
                                </Text>   
                            </TouchableOpacity>                        
                        :                         
                        !props?.linkRedireccion ?
                            <Text style={{textAlign: "right", fontSize: 16}}>
                            {props?.valor}
                            </Text>                        
                        :
                            <TouchableOpacity 
                                onPress={() => {
                                    navigation.navigate({
                                        name: props?.linkRedireccion,
                                        params: { tipo: 'pagosrecaudacionrecibidos', transid: props?.info},
                                        merge: true,
                                    });                    
                                }}                            
                            >
                                <Text style={{textAlign: "right", fontSize: 16, fontWeight: "600"}}>
                                {props?.valor} ({props?.linkRedireccionVerMas})
                                </Text>   
                            </TouchableOpacity>
                    }
                    
                </View>
            </View> 
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

export default ListDetalleItem