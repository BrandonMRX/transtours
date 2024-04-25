import { configureStore } from '@reduxjs/toolkit'
import usuarioReducer from './usuarioSlice'
import seleccionReducer from './seleccionSlice'
import direccionReducer from './direccionSlice'
import chatReducer from './chatSlice'
import filtroReducer from './filtroSlice'
import contactoReducer from './contactoSlice'
import notificacionReducer from './contactoSlice'
import parametrosReducer from './parametrosSlice'

export default configureStore({
  reducer: {
    usuario: usuarioReducer,
    seleccion: seleccionReducer,
    direccion: direccionReducer,
    chat: chatReducer,
    filtro: filtroReducer,
    contacto: contactoReducer,
    notificacion: notificacionReducer,
    parametros: parametrosReducer,
  }
})