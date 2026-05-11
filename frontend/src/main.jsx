// ============================================================
// main.jsx — Point d'entrée de l'application React
// Monte l'application dans le DOM et configure le routeur
// ============================================================

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Monte l'application React dans la div #root du HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter active la navigation côté client */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
