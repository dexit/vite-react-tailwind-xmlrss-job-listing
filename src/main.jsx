import React from 'react'
import ReactDOMO from 'react-dom/client'
import MyComponent2 from './App3'
import './index.css'
import './main.scss'

ReactDOMO.createRoot(document.getElementById('channel2')).render(
  <React.StrictMode>
    <MyComponent2 />
  </React.StrictMode>
)
