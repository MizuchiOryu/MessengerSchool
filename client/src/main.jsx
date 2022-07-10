import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import { EnvProvider } from './contexts/EnvContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EnvProvider>
      <App />
    </EnvProvider>
  </React.StrictMode>
)
