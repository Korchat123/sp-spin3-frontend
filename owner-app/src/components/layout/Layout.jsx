import React from "react"
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AIWidget from './AIWidget'

export default function Layout() {
  return (
    <div className="flex h-screen bg-brand-page overflow-hidden relative">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-brand-page relative">
          <Outlet />
        </main>
      </div>

      <AIWidget />
    </div>
  )
}
