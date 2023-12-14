import React from 'react'
import ReactDOMO from 'react-dom/client'
import MyComponent from './App'
import './index.css'
import './main.scss'

ReactDOMO.createRoot(document.getElementById('channel1')).render(
  <React.StrictMode>
    <MyComponent />
  </React.StrictMode>
)
