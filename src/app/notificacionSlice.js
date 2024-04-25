import { createSlice } from '@reduxjs/toolkit'

export const notificacionSlice = createSlice({
  name: 'notificacion',
  initialState: {
    valores: []
  },
  reducers: {    
    actualizar: (state, action) => {
      state.valores = [...state.valores, action.payload];
    },
    eliminar: (state, action) => {
      let id = action?.payload?.id;

      if (id){
        let arr = state.valores.filter(item => item.id != id)
        state.valores = arr;
      }else{
        state.valores = [];
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { actualizar, eliminar } = notificacionSlice.actions

export default notificacionSlice.reducer