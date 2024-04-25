import { createSlice } from '@reduxjs/toolkit'

export const contactoSlice = createSlice({
  name: 'contacto',
  initialState: {
    idUsuario: 0,
    nombreUsuario: '',
    emailUsuario: '',
    whatsappUsuario: '',
    webUsuario: ''
  },
  reducers: {    
    actualizar: (state, action) => {
      state.idUsuario = action.payload.idUsuario,
      state.nombreUsuario = action.payload.nombreUsuario,
      state.emailUsuario = action.payload.emailUsuario,
      state.whatsappUsuario = action.payload.whatsappUsuario,
      state.webUsuario = action.payload.webUsuario
    }
  }
})

// Action creators are generated for each case reducer function
export const { actualizar } = contactoSlice.actions

export default contactoSlice.reducer