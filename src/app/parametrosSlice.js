import { createSlice } from '@reduxjs/toolkit'

export const parametrosSlice = createSlice({
  name: 'parametros',
  initialState: {
    valor: {
      distancia: "",
      pais: "AR",
      paisNombre: "Argentina",
      moneda: "Pesos Argentinos",
      monedaSiglas: "ARS",
      buscadorGoogle: "0",
      tiempoRealMapa: "0",
      miliSegundosTiempoRealMapa: 0,
      referidos: 0,
      personalizarprecio: 0,
      urlcanalyoutube: "",
      habilitarregistro: 1,
      habilitardemo: 1,
      tipoServicio: []
    }
  },
  reducers: {    
    actualizar: (state, action) => {
      state.valor = [action.payload];
    },
    actualizarParametros: (state, action) => {
      state.valor = action.payload;
    },
    eliminar: (state, action) => {
      let id = action.payload.id;
      let arr = state.valor.filter(item => item.id !== (id))
      state.valor = arr;
    },
    actualizarDistancia: (state, action) => {
      state.valor.distancia = action.payload.distancia;
    },
  }
})

export const { actualizar, eliminar, actualizarParametros, actualizarDistancia } = parametrosSlice.actions

export default parametrosSlice.reducer