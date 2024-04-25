import { createSlice } from '@reduxjs/toolkit'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    valores: []
  },
  reducers: {        
    inicial: (state, action) => {
      state.valores = action.payload;
    },
    actualizar: (state, action) => {
      state.valores = [...state.valores, action.payload];
    },
    eliminar: (state, action) => {
      let id = action.payload.id;
      //state.valores = [...state.valores, action.payload];
      let arr = state.valores.filter(item => item.id !== parseInt(id))
      ////////console.log("idproducto:"+idProducto);
      //let arr = state.valores
      state.valores = arr;
    }
  }
})

// Action creators are generated for each case reducer function
export const { actualizar, eliminar, inicial } = chatSlice.actions

export default chatSlice.reducer