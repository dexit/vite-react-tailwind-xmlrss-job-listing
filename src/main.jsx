import React from 'react'
import ReactDOM from 'react-dom/client'
import MyComponent from './App'
import './index.css'
import './main.scss'

ReactDOM.createRoot(document.getElementById('channel1')).render(
  <React.StrictMode>
    <MyComponent />
  </React.StrictMode>
)
