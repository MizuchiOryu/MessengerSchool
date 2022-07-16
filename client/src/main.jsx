import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
import { BrowserRouter } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { EnvProvider } from './contexts/EnvContext';
import AuthProvider from "./middleware/auth/AuthProvider"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EnvProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </EnvProvider>
  </React.StrictMode>
)
