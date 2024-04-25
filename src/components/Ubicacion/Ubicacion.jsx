import * as Location from 'expo-location';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER } from '@env'
import axios from 'axios';

async function solicitarPermisosUbicacion(usuarioactual) {

  //const { status } = await Permissions.askAsync(Permissions.LOCATION);

  /*
  let { status } = await  Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
      ////////console.log("Sin permisos");
      //setPermisoActual("Permisos de ubicación actual RECHAZADO. (Ubicación por defecto: Buenos Aires, Argentina.)")
      return;
  }else{
    ////////console.log("Con permisos");
  }
  */

  //if (usuarioactual){

    console.log("here2");

    let { status } = await  Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log("sin permisos");
        //setErrorMsg('Permission to access location was denied');
        //verificarPermisosUbicacion();
        return;
    }else{

      console.log("here  solicitarPermisosUbicacion");

      /* const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus === 'granted') {
        ////console.log("con acceso a segundo plano:");
      }
         */
      //console.log("con location:");
      try {
        
        

        //console.log("con location1:");
         // let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest, maximumAge: 10000});
        let location = await Location.getLastKnownPositionAsync();

        //console.log("con location2:"); 
        //console.log(location); 

        let response = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
      
        let address ="";
      
        for (let item of response) {
          address = `${item.street}, ${item.name}, ${item.postalCode}, ${item.city}, ${item.country}`;
        }
      
        if (location.coords.latitude){
      
          try {
            
              const resp = await axios.post(APP_URLAPI+'usuariogeo',
                  {          
                      token: usuarioactual?.tokenRegistro,
                      latitud: location.coords.latitude,
                      longitud: location.coords.longitude,
                      direccion: address,
                      compania: COMPANIA_ID
                  }
              );
              
              if (resp.data.code==0){
                return true;
              }else{
                return true;
              }
      
          } catch (err) {        
              //console.error("err");
              //console.error(err);
              setIsLoading(false);
              return false;
          }
          
          return false; 
        }else{
          return true;
        }
        
        
      }catch (err) {        
        //console.error(err);
      }
    }
  //}
  
  

}

export { solicitarPermisosUbicacion };
