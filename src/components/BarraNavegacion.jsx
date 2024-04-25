import React, { useCallback, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { APP_URLAPI, COMPANIA_ID, DEMO, COLORBOTONPRINCIPAL, COLORHEADER, TIPOAPP } from '@env'
import axios from 'axios';

import { actualizarParametros } from '../app/parametrosSlice';
import BarraNavegacionTransTours from './BarraNavegacionTransTours';

const BarraNavegacion = (props) => {

  const parametros = useSelector(state => state.parametros)
  const dispatch = useDispatch()

  useEffect(() => {
    (async () => {

      console.log("antes");
      console.log(parametros);

      //console.log("en BarraNavegacion"); 
      await fetchData();
    })();
  }, []);

  const fetchData = async () => {

      try {

        const resp = await axios.post(APP_URLAPI+'parametros',
          {          
              compania: COMPANIA_ID
          }
        );


        //console.log("parametros:"); 
        //console.log(resp.data); 

        let pais = "AR";
        let paisNombre = "Argentina";
        let moneda = "Pesos Argentinos"; 
        let monedaSiglas = "ARS";
        let buscadorGoogle = "0";
        let tiposervicio = [];
        let tiempoRealMapa = "0";
        let miliSegundosTiempoRealMapa = 0;
        let referidos = 0;
        let personalizarprecio = 0;
        let habilitardemo = 1;
        let habilitarregistro = 1;
        
        if (resp.data.code==0){               
          pais = resp.data.data.pais;
          paisNombre = resp.data.data.paisnombre;
          tiposervicio = resp.data.data.tiposervicio;
          moneda = resp.data.data.moneda;
          monedaSiglas = resp.data.data.monedasiglas;
          tiempoRealMapa = resp.data.data.tiempoRealMapa;
          miliSegundosTiempoRealMapa = resp.data.data.miliSegundosTiempoRealMapa;
          referidos = resp.data.data.referidos;
          personalizarprecio = resp.data.data.personalizarprecio;
          habilitardemo = resp.data.data.habilitardemo;
          habilitarregistro = resp.data.data.habilitarregistro;
                          
          if (resp.data.data.buscadorGoogle=="1"){
              buscadorGoogle = resp.data.data.buscadorGoogle;
          }                
        }else if (resp.data.code==103 || resp.data.code==104){
          console.log("here700");
        }else{
          console.log("here701");
        }

        let valores = {
            pais: pais,
            buscadorGoogle: buscadorGoogle,
            tipoServicio: tiposervicio,
            paisNombre: paisNombre,
            moneda: moneda,
            monedaSiglas: monedaSiglas,
            tiempoRealMapa: tiempoRealMapa,                
            miliSegundosTiempoRealMapa: miliSegundosTiempoRealMapa,
            referidos: referidos,
            personalizarprecio: personalizarprecio,
            habilitardemo: habilitardemo,
            habilitarregistro: habilitarregistro, 
        };

        console.log("valoresss"); 
        console.log(valores);
 
        dispatch(actualizarParametros(valores)) 
    
    } catch (err) {        
        console.error("error parametros:");
        console.error(err);

    }
  }

  const seleccion = useSelector(state => state.seleccion)
  const usuario = useSelector(state => state.usuario)
  const tipoApp = seleccion.tipoApp;

  return (
    (
      <> 
        <BarraNavegacionTransTours />
      </>
    )
    
  );
};

export default () => {
    return (
      <NavigationContainer>
        <BarraNavegacion />
      </NavigationContainer>
    );
};
