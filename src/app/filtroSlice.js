import { createSlice } from '@reduxjs/toolkit'

export const filtroSlice = createSlice({
  name: 'usuario',
  initialState: {
    categoria: '',
    ubicacion: ''
  },
  reducers: {    
    actualizar: (state, action) => {
      state.categoria = action.payload.categoria,
      state.ubicacion = action.payload.ubicacion
    }
  }
})

// Action creators are generated for each case reducer function
export const { actualizar } = filtroSlice.actions

export default filtroSlice.reducer