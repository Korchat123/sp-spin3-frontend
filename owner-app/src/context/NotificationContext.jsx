import React, { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Low Stock Alert', subtitle: 'Pork Belly is below reorder point', timestamp: '2m ago', urgency: 'urgent', read: false },
  { id: '2', title: 'New Order', subtitle: 'Table 4 placed an order', timestamp: '8m ago', urgency: 'normal', read: false },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length
  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  const markRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const addNotification = (n) => setNotifications(ns => [n, ...ns])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationStore = () => useContext(NotificationContext)
