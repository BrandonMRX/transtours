import 'react-native-gesture-handler';
import React from 'react';
import BarraNavegacion from './src/components/BarraNavegacion.jsx';
import Toast from 'react-native-toast-message';
import store from './src/app/store'
import { Provider } from 'react-redux'


const App = () => {
  return (
    <Provider  store={store}>
      <BarraNavegacion />
      <Toast />
      
    </Provider>
  )
} 

export default App; 