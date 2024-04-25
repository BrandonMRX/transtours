import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'


const PedirLogin = ({ navigation }) => {

  return (
    <View>
      <View style={{justifyContent: "center", alignItems:"center", marginTop: 30}}>
        <Image
            source={require('../../assets/img/pedirlogin.png')}          
            style={{resizeMode: 'contain', height: 200, width: 300}}
        />  
        <View style={{alignItems: "center", justifyContent: "center", textAlign: "center", paddingHorizontal: 20, paddingBottom: 10}}>
            <Text style={{fontSize: 16, textAlign: "center"}}>
                Inicia sesión en tu cuenta para poder observar esta sección
            </Text>
          
        </View>  

    </View>
    <View style={{width: "100%", display: "none"}}>
      <TouchableOpacity 
          onPress={() => navigation.navigate('Ingreso')} 
          style={{textAlign: "center", marginTop: 5, margin: 12,
          borderWidth: 1, borderColor: "#AFAFAF", borderRadius: 10, justifyContent: "center"}}>
          <View
              style={{
                  ...styles.button,
                  backgroundColor: COLORBOTONPRINCIPAL,
              }} 
          >   
            <Icon size={20} name="user" color={"#FFFFFF"}  /> 
            <Text 
                style={styles.buttonText}>
                {' '} Iniciar sesión
            </Text>                            
          </View>
      </TouchableOpacity>
    </View>
  </View>
  
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

export default PedirLogin;