import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import "./index.css"

import { AuthStoreProvider } from "./context/AuthContext"
import { UIProvider } from "./context/UIContext"
import { NotificationProvider } from "./context/NotificationContext"
import { StoreDataProvider } from "./context/StoreDataContext"
import Layout from "./components/layout/Layout"
import Dashboard from "./pages/Dashboard"
import Tables from "./pages/Tables"
import Orders from "./pages/Orders"
import Menu from "./pages/Menu"
import Stock from "./pages/Stock"
import WasteLog from "./pages/WasteLog"
import Promotions from "./pages/Promotions"
import Customers from "./pages/Customers"
import Staff from "./pages/Staff"

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthStoreProvider>
        <NotificationProvider>
          <UIProvider>
            <StoreDataProvider>
              <Layout />
            </StoreDataProvider>
          </UIProvider>
        </NotificationProvider>
      </AuthStoreProvider>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "tables", element: <Tables /> },
      { path: "orders", element: <Orders /> },
      { path: "menu", element: <Menu /> },
      { path: "stock", element: <Stock /> },
      { path: "waste", element: <WasteLog /> },
      { path: "promotions", element: <Promotions /> },
      { path: "customers", element: <Customers /> },
      { path: "staff", element: <Staff /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
