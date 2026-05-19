import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {OrdersProvider} from './context/ordersContext/OrdersProvider'
import { UserProvider } from './context/userContext/UserProvider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <UserProvider>
  <OrdersProvider> 
    <App />
 </OrdersProvider>
 </UserProvider>   
  </StrictMode>
  )
