import React, { createContext, useContext, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePopup, setActivePopup] = useState(null)
  const [tableView, setTableView] = useState('grid')

  const value = {
    sidebarOpen,
    setSidebarOpen,
    activePopup,
    tableView,
    toggleSidebar: () => setSidebarOpen(v => !v),
    openPopup: (name) => setActivePopup(name),
    closeAllPopups: () => setActivePopup(null),
    setTableView,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUIStore = () => useContext(UIContext)
