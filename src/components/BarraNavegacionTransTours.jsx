import React, { useCallback, useEffect, useState } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//import { HeaderBackButton } from '@react-navigation/stack';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import { Button, TextInput, View, Text, StyleSheet, Image, SafeAreaView, Linking, Alert, TouchableOpacity, ActivityIndicator, FlatList, BackHandler  } from 'react-native'

import Constants from 'expo-constants'
import * as Updates from 'expo-updates';
import { useSelector, useDispatch } from 'react-redux'

import IngresoTaxi from '../pages/RegistroLogin/IngresoTaxi'
import RegistroTaxi from '../pages/RegistroLogin/RegistroTaxi'
import ConfirmarRegistro from '../pages/RegistroLogin/ConfirmarRegistro'
import OlvidoClave from '../pages/RegistroLogin/OlvidoClave'
import TipoRegistro from '../pages/RegistroLogin/TipoRegistro'
import IngresoTaxiDemo from '../pages/RegistroLogin/IngresoTaxiDemo'
import NuevaClave from '../pages/RegistroLogin/NuevaClave'

import PanelTaxi from '../pages/Taxi/PanelTaxi'
import PanelConductor from '../pages/Taxi/PanelConductor'
import ViajeBuscar from '../pages/Taxi/ViajeBuscar'
import ViajeSolicitar from '../pages/Taxi/ViajeSolicitar'
import ViajeConfirmado from '../pages/Taxi/ViajeConfirmado'
import Viajes from '../pages/Taxi/Viajes'
import ViajeDetalle from '../pages/Taxi/ViajeDetalle'
import ViajeSolicitarConfirmar from '../pages/Taxi/ViajeSolicitarConfirmar'
import ViajeSolicitarObservaciones from '../pages/Taxi/ViajeSolicitarObservaciones'
import ViajeEnCurso from '../pages/Taxi/ViajeEnCurso'
import TaxiTarifas from '../pages/Taxi/TaxiTarifas'
import SolicitarIngresar from '../pages/Taxi/SolicitarIngresar'
import ConductorViajes from '../pages/Taxi/ConductorViajes'
import ConductorViajesPendientes from '../pages/Taxi/ConductorViajesPendientes'
import ConductorConfirmarViaje from '../pages/Taxi/ConductorConfirmarViaje'
import ConductorViajeEnCurso from '../pages/Taxi/ConductorViajeEnCurso'
import ConductorViajeDetalle from '../pages/Taxi/ConductorViajeDetalle'
import ConductorViajeFinalizado from '../pages/Taxi/ConductorViajeFinalizado'
import TieneViajeEnCurso from '../pages/Taxi/TieneViajeEnCurso'

import PerfilPasajero from '../pages/Taxi/PerfilPasajero'
import PerfilConductor from '../pages/Taxi/PerfilConductor'
import ConductorViajeYaAsignado from '../pages/Taxi/ConductorViajeYaAsignado'

import MiCuenta from '../pages/MiCuenta'
import ChatLista from '../pages/Chat/ChatLista'
import ChatDetalle from '../pages/Chat/ChatDetalle'

import MenuCuenta from '../pages/Taxi/MenuCuenta'
import MenuCuentaConductor from '../pages/Taxi/MenuCuentaConductor'

import Direcciones from '../pages/Direcciones/Direcciones'
import DireccionCrear from '../pages/Direcciones/DireccionCrear'
import DireccionMapa from '../pages/Direcciones/DireccionMapa'

import { HeaderBackButton } from '@react-navigation/elements';

import { Badge, Icon as Icon2, withBadge } from '@rneui/themed';



const MenuStack = createBottomTabNavigator();
const BarraNavegacionTransTours = (props) => {

  const usuario = useSelector(state => state.usuario)
  const [totalNotificaciones, setTotalNotificaciones] = useState(0);


  const BadgedIcon = withBadge(totalNotificaciones)(Icon2);

  return (
      <MenuStack.Navigator 
        initialRouteName="Panel"
        backBehavior="history" 
        screenOptions={({route, navigation}) => ({ 
          headerStyle: {
            backgroundColor: COLORHEADER,                         
          },
          headerTitleStyle: { 
            color: "#FFFFFF",  
            fontWeight: "normal"                
          },
          headerTintColor: '#ffffff',
          tabBarHideOnKeyboard: false,
          tabBarLabelStyle: {
            fontSize: 12,
          }          
        })} 
      >   

      {
        usuario.perfilUsuario == 4 ?
        <>
          <MenuStack.Screen 
            name="Panel" 
            component={PanelTaxi} 
            options={{
              title: "Inicio",
              tabBarLabel: "Inicio",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="home" color={focused ? "#FFFFFF" : "#27AF7B"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#27AF7B"
              
            }}             
          />
          <MenuStack.Screen 
            name="Viajes" 
            component={Viajes} 
            options={{
              title: "Mis Viajes",
              tabBarLabel: "Mis Viajes",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="car" color={focused ? "#FFFFFF" : "#A5281A"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#A5281A"
            }}            
          />
             
          <MenuStack.Screen 
            name="MenuCuenta" 
            component={MenuCuenta} 
            options={{
              title: "Mi Cuenta",
              tabBarLabel: "Mi Cuenta",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="user" color={focused ? "#FFFFFF" : "#1A58A5"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#1A58A5"              
            }}
          />
          
        </>         
        :
        usuario.perfilUsuario == 10 ?
        <>
          <MenuStack.Screen 
            name="Panel" 
            component={PanelConductor} 
            options={{
              title: "Inicio",
              tabBarLabel: "Inicio",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="home" color={focused ? "#FFFFFF" : "#27AF7B"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#27AF7B"              
            }}             
          />

          <MenuStack.Screen 
            name="ConductorViajes" 
            component={ConductorViajes} 
            options={{
              title: "Viajes",
              tabBarLabel: "Viajes",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="car" color={focused ? "#FFFFFF" : "#A5281A"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#A5281A"
            }}
          />

          <MenuStack.Screen 
            name="ConductorViajesPendientes" 
            component={ConductorViajesPendientes} 
            options={{
              title: "Viajes por Aceptar",
              tabBarLabel: "Pendientes",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="clock" color={focused ? "#FFFFFF" : "#A5281A"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#A5281A"
            }}
          />     
         
          <MenuStack.Screen     
            name="MenuCuenta" 
            component={MenuCuentaConductor} 
            options={{
              title: "Mi Cuenta",
              tabBarLabel: "Mi Cuenta",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="user" color={focused ? "#FFFFFF" : "#1A58A5"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#1A58A5"              
            }}
          />   

          <MenuStack.Screen 
            name="Viajes" 
            component={Viajes} 
            options={{
              title: "Viajes solicitados",
              tabBarItemStyle: { display: 'none' },
            }}            
          />     
        </>
        :
        <>
          <MenuStack.Screen 
            name="Panel" 
            component={PanelTaxi} 
            options={{
              title: "Inicio",
              tabBarLabel: "Inicio",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="home" color={focused ? "#FFFFFF" : "#27AF7B"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#27AF7B"              
            }} 
          />          
         
          <MenuStack.Screen 
            name="IngresoTaxi" 
            component={IngresoTaxi} 
            options={{
              title: "Ingresar",
              tabBarLabel: "Ingresar",
              tabBarIcon: ({ focused, color, size }) => {  
                return <Icon size={20} name="user" color={focused ? "#FFFFFF" : "#1A58A5"}   />
              },
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#787575",
              tabBarActiveBackgroundColor: "#1A58A5",
              headerShown: false,
              tabBarStyle: { display: "none" }    
            }}
          />          
        </>
      }
       

        <MenuStack.Screen 
          name="SolicitarTaxi" 
          component={PanelTaxi} 
          options={{
            title: "Solicitar",
            tabBarItemStyle: { display: 'none' },                 
          }}
        />

        <MenuStack.Screen 
          name="MiCuenta" 
          component={MiCuenta} 
          options={({ navigation, route }) => ({
            title: "Mis Datos",
            tabBarItemStyle: { display: 'none' },                        
            headerLeft: (props) => {
              return (
                <HeaderBackButton {...props} 
                  onPress={() => 
                    {
                      navigation.goBack();
                    }
                  }    
                />
              );
            }, 
          })}
        /> 

        <MenuStack.Screen 
          name="TaxiTarifas" 
          component={TaxiTarifas} 
          options={({ navigation, route }) => ({
            title: "Tarifas",      
            tabBarItemStyle: { display: 'none' },
          })}
        /> 

        
        
        
        <MenuStack.Screen 
          name="ChatDetalle" 
          component={ChatDetalle} 
          options={({ navigation, route }) => ({
            drawerLabel: 'Chat',
            tabBarItemStyle: { display: 'none' },
            
             
            headerLeft: (props) => {
              return (
                <HeaderBackButton {...props} 
                  onPress={() => 
                    {
                      navigation.goBack();
                    }
                  }    
                />
              );
            }, 
          })}
        />
        
        <MenuStack.Screen 
          name="ViajeBuscar" 
          component={ViajeBuscar} 
          options={{
            title: "Solicitar",
            tabBarItemStyle: { display: 'none' },          
          }}
        />
        

        <MenuStack.Screen 
          name="ViajeDetalle" 
          component={ViajeDetalle} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Detalle de tu viaje",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        /> 

        <MenuStack.Screen 
          name="TipoRegistro" 
          component={TipoRegistro} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Registro",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        /> 



        <MenuStack.Screen 
          name="Salir" 
          component={IngresoTaxi} 
          options={{
            title: 'Salir', 
            tabBarItemStyle: { display: 'none' },
            headerShown: false         
          }}
        /> 

        <MenuStack.Screen 
          name="SolicitarIngresar" 
          component={SolicitarIngresar} 
          options={{            
            title: 'Debe iniciar sesión',
            tabBarItemStyle: { display: 'none' },
          }}
        /> 

        <MenuStack.Screen 
          name="IngresoTaxiDemo" 
          component={IngresoTaxiDemo} 
          options={{            
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
            tabBarStyle: { display: "none" }
          }}
        />

        <MenuStack.Screen 
          name="Ingreso" 
          component={IngresoTaxi} 
          options={{            
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
            tabBarStyle: { display: "none" }
          }}
        />


        <MenuStack.Screen 
          name="Registro" 
          component={RegistroTaxi} 
          options={{            
            tabBarItemStyle: { display: 'none' }, 
            headerShown: false,
            tabBarStyle: { display: "none" }
          }}
        />
        <MenuStack.Screen 
          name="ConfirmarRegistro" 
          component={ConfirmarRegistro} 
          options={{            
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
            tabBarStyle: { display: "none" }
          }}
        />  
       
        <MenuStack.Screen             
          name="OlvidoClave" 
          component={OlvidoClave} 
          options={{              
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
            tabBarStyle: { display: "none" }
          }}
        />

        <MenuStack.Screen             
          name="NuevaClave" 
          component={NuevaClave} 
          options={{              
            tabBarItemStyle: { display: 'none' },
            headerShown: false,
            tabBarStyle: { display: "none" }
          }}
        />

        

        <MenuStack.Screen 
          name="ViajeSolicitar" 
          component={ViajeSolicitar} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Tu viaje",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />
        <MenuStack.Screen 
          name="ViajeSolicitarConfirmar" 
          component={ViajeSolicitarConfirmar} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },    
              title: "Confirmar viaje",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />
        <MenuStack.Screen 
          name="ViajeSolicitarObservaciones" 
          component={ViajeSolicitarObservaciones} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Más información",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />
        <MenuStack.Screen 
          name="ConductorConfirmarViaje" 
          component={ConductorConfirmarViaje} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Confirmar viaje",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />



        <MenuStack.Screen 
          name="ViajeEnCurso" 
          component={ViajeEnCurso} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Viaje en Curso",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />

        <MenuStack.Screen 
          name="ConductorViajeEnCurso" 
          component={ConductorViajeEnCurso} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Viaje en Curso",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />

        <MenuStack.Screen 
          name="ConductorViajeDetalle" 
          component={ConductorViajeDetalle} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Viaje",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />

        <MenuStack.Screen 
          name="ConductorViajeFinalizado" 
          component={ConductorViajeFinalizado} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Viaje Finalizado",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.navigate('Panel');
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />

        <MenuStack.Screen 
          name="ConductorViajeYaAsignado" 
          component={ConductorViajeYaAsignado} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Viaje ya asignado",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.navigate('Panel');
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />


        <MenuStack.Screen 
          name="TieneViajeEnCurso" 
          component={TieneViajeEnCurso} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Tiene viaje en curso",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />





        <MenuStack.Screen 
          name="ViajeConfirmado" 
          component={ViajeConfirmado} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Viaje Confirmado",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.navigate('Panel');
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />

       
        <MenuStack.Screen 
          name="PerfilPasajero" 
          component={PerfilPasajero} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Perfil del Pasajero",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />

        <MenuStack.Screen 
          name="PerfilConductor" 
          component={PerfilConductor} 

          options={({ navigation, route }) => ({
              tabBarItemStyle: { display: 'none' },
              title: "Perfil del Conductor",
              headerLeft: (props) => {
                return (
                  <HeaderBackButton {...props} 
                    onPress={() => 
                      {
                        navigation.goBack();
                      }
                    }    
                  />
                );
              }, 
            })
          }           
        />       

        <MenuStack.Screen 
          name="Direcciones" 
          component={Direcciones} 
          options={({ navigation, route }) => ({
            title: 'Direcciones',
            tabBarItemStyle: { display: 'none' },
            headerLeft: (props) => {
              return (
                <HeaderBackButton {...props} 
                  onPress={() => 
                    {
                      navigation.goBack();
                    }
                  }    
                />
              );
            }, 
          })}
        />

        <MenuStack.Screen 
          name="DireccionCrear" 
          component={DireccionCrear} 
          options={({ navigation, route }) => ({
            title: 'Dirección',
            tabBarItemStyle: { display: 'none' },
            headerLeft: (props) => {
              return (
                <HeaderBackButton {...props} 
                  onPress={() => 
                    {
                      navigation.goBack();
                    }
                  }    
                />
              );
            }, 
          })}
        />

        <MenuStack.Screen 
          name="DireccionMapa" 
          component={DireccionMapa} 
          options={({ navigation, route }) => ({
            title: 'Dirección',
            tabBarItemStyle: { display: 'none' },
            headerLeft: (props) => {
              return (
                <HeaderBackButton {...props} 
                  onPress={() => 
                    {
                      navigation.goBack();
                    }
                  }    
                />
              );
            }, 
          })}
        />


        <MenuStack.Screen 
          name="ChatLista" 
          component={ChatLista} 
          options={({ navigation, route }) => ({
            title: 'Mensajes',
            tabBarItemStyle: { display: 'none' },
            headerLeft: (props) => {
              return (
                <HeaderBackButton {...props} 
                  onPress={() => 
                    {
                      navigation.goBack();
                    }
                  }    
                />
              );
            }, 
          })}
        />
    </MenuStack.Navigator>
  );
};

export default BarraNavegacionTransTours;