import { createSlice } from '@reduxjs/toolkit'

export const usuarioSlice = createSlice({
  name: 'usuario',
  initialState: {
    idUsuario: 0,
    nombreUsuario: '',
    apellidoUsuario: '',
    ciudadUsuario: '',
    emailUsuario: '',
    whatsappUsuario: '',
    perfilUsuario: '',
    perfilActUsuario: '',
    tokenRegistro: '',
    codigoVerificar: '',
    fechaRegistro: '',
    qrUsuario : '',
    estatusCodigo : '',
    estatusNombre : '',
    codigoReferido: '',
    tipoUsuario: ''
  },
  reducers: {    
    actualizar: (state, action) => {
      state.idUsuario = action.payload.idUsuario,
      state.nombreUsuario = action.payload.nombreUsuario,
      state.apellidoUsuario = action.payload.apellidoUsuario,
      state.ciudadUsuario = action.payload.ciudadUsuario,
      state.emailUsuario = action.payload.emailUsuario,
      state.whatsappUsuario = action.payload.whatsappUsuario,
      state.perfilUsuario = action.payload.perfilUsuario,
      state.perfilActUsuario = action.payload.perfilActUsuario,
      state.tokenRegistro = action.payload.tokenRegistro,
      state.codigoVerificar = action.payload.codigoVerificar,
      state.fechaRegistro = action.payload.fechaRegistro,
      state.qrUsuario = action.payload.qrUsuario,
      state.estatusCodigo = action.payload.estatusCodigo,
      state.estatusNombre = action.payload.estatusNombre,
      state.codigoReferido = action.payload.codigoReferido,
      state.tipoUsuario = action.payload.tipoUsuario    
    }
  }
})

// Action creators are generated for each case reducer function
export const { actualizar } = usuarioSlice.actions

export default usuarioSlice.reducer