import { createSlice } from '@reduxjs/toolkit'

export const seleccionSlice = createSlice({
  name: 'seleccion',
  initialState: {
    tipoApp: ''
  },
  reducers: {    
    actualizar: (state, action) => {
      state.tipoApp = action.payload.tipoApp
    }
  }
})

// Action creators are generated for each case reducer function
export const { actualizar } = seleccionSlice.actions

export default seleccionSlice.reducer