import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./app.css"
import "@radix-ui/themes/styles.css";

import App from './App.jsx'
// import talwindConfig from '../talwind.config.js'
import { Theme } from "@radix-ui/themes";

import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import store from './app/store'
import { Provider } from 'react-redux'
import { ToastProvider } from './components/context/ToastProvider.jsx';
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
   
      	<Theme>
          <ToastProvider >
            
      <Toaster position="top-right" />
      <App />
      </ToastProvider>
      </Theme>
    </Provider>
  </StrictMode>
)
