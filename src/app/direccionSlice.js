import { createSlice } from '@reduxjs/toolkit'

export const direccionSlice = createSlice({
  name: 'direccion',
  initialState: {
    //cantidad: 0
    valores: []
    /*
      id: '',
      cantidad: 0,
      productoNombre: '',
      productoImg: '',
      productoPrecio: '',
      productoPrecioTotal: ''
    */
  },
  reducers: {    
    /*
    actualizar: (state, action) => {
      
      state.id = action.payload.id,
      state.cantidad = action.payload.cantidad,
      state.productoNombre = action.payload.productoNombre,
      state.productoImg = action.payload.productoImg,
      state.productoPrecio = action.payload.productoPrecio,
      state.productoPrecioTotal = action.payload.productoPrecioTotal
    }
    */
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
    /*
    eliminar: (state, action) => ({
      
      ...state,
      valores: state.valores.filter(item => action.payload !== item)
    })
    */
  }
})

// Action creators are generated for each case reducer function
export const { actualizar, eliminar, inicial } = direccionSlice.actions

export default direccionSlice.reducer