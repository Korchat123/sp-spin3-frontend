import React from "react"
import { useRef } from 'react'
import { Menu, Bell, CircleHelp, Settings, ChevronDown } from 'lucide-react'
import { useUIStore } from '../../context/UIContext'
import { useNotificationStore } from '../../context/NotificationContext'
import { useAuth } from '../../context/AuthContext'
import { useClickOutside } from '../../hooks/useClickOutside'

export default function Header() {
  const { toggleSidebar, activePopup, openPopup, closeAllPopups } = useUIStore();
  const { unreadCount, notifications, markAllRead } = useNotificationStore();
  const { user } = useAuth();
  
  const popupRef = useRef(null);
  useClickOutside(popupRef, closeAllPopups);

  const togglePopup = (name) => {
    if (activePopup === name) {
      closeAllPopups();
    } else {
      openPopup(name);
    }
  };

  return (
    <header className="h-[54px] bg-white border-b border-brand-border-outer flex items-center px-4 sm:px-5 gap-2.5 shrink-0 z-[60]">
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-1.5 -ml-2 rounded-lg text-brand-text-secondary hover:bg-brand-hover-row outline-none"
      >
        <Menu size={20} />
      </button>

      {/* Profile Section */}
      <div className="relative" ref={activePopup === 'profile' ? popupRef : null}>
        <div 
          onClick={() => togglePopup('profile')}
          className="flex items-center gap-2.5 cursor-pointer hover:bg-brand-hover-row p-1.5 sm:-ml-1.5 rounded-lg transition-colors outline-none"
        >
          <div className="w-[28px] h-[28px] rounded-full bg-brand-active-nav flex items-center justify-center text-[11px] font-medium text-brand-text-primary">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'TS'}
          </div>
          <div className="hidden sm:block">
            <div className="text-[13px] font-medium text-brand-text-primary leading-tight">
              {user?.name || 'Thanachot S.'}
            </div>
            <div className="text-[10px] text-brand-text-tertiary">
              {user?.role || 'Owner'}
            </div>
          </div>
          <ChevronDown size={14} className="text-brand-text-tertiary hidden sm:block" />
        </div>

        {activePopup === 'profile' && (
          <div className="absolute top-[100%] left-0 mt-1 w-64 bg-white border border-brand-border-outer rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-brand-border-inner bg-brand-hover-row">
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-brand-active-nav flex items-center justify-center text-[14px] font-medium text-brand-text-primary">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'TS'}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[14px] text-brand-text-primary">{user?.name || 'Thanachot S.'}</span>
                  <span className="text-[11px] text-brand-text-secondary">{user?.email || 'thanachot@pungkang.com'}</span>
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="px-3 py-2 flex justify-between items-center">
                <span className="text-[12px] text-brand-text-secondary">Role</span>
                <span className="text-[12px] font-medium text-brand-text-dark">Owner / Admin</span>
              </div>
              <div className="px-3 py-2 flex justify-between items-center border-t border-brand-border-inner mt-1 pt-2">
                <span className="text-[12px] text-brand-text-secondary">Workspace</span>
                <span className="text-[12px] font-medium text-brand-text-primary">Bangkok Branch</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1"></div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 relative">
        {/* Help Button */}
        <button className="p-1 rounded-lg hover:bg-brand-sidebar transition-colors cursor-pointer outline-none">
          <CircleHelp size={18} className="text-brand-text-secondary" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={activePopup === 'notifications' ? popupRef : null}>
          <button 
            onClick={() => togglePopup('notifications')}
            className="p-1 rounded-lg hover:bg-brand-sidebar transition-colors relative cursor-pointer outline-none"
          >
            <Bell size={18} className="text-brand-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-danger rounded-full border border-white"></span>
            )}
          </button>
          
          {activePopup === 'notifications' && (
            <div className="absolute top-[110%] right-0 mt-1 w-72 bg-white border border-brand-border-outer rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-brand-border-inner font-semibold text-[13px] text-brand-text-primary bg-brand-hover-row flex justify-between items-center">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-[#3D4A5C] hover:underline">Mark all read</button>
                )}
              </div>
              <div className="flex flex-col max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 border-b border-brand-border-inner hover:bg-brand-hover-row cursor-pointer flex flex-col gap-1 transition-colors">
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-medium text-brand-text-primary">{n.title}</span>
                        <span className={`text-[10px] font-medium ${n.urgency === 'urgent' ? 'text-brand-danger' : 'text-brand-success'}`}>
                          {n.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-brand-text-secondary">{n.subtitle}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-brand-text-tertiary text-[12px]">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative" ref={activePopup === 'settings' ? popupRef : null}>
          <button 
            onClick={() => togglePopup('settings')}
            className="p-1 rounded-lg hover:bg-brand-sidebar transition-colors cursor-pointer outline-none"
          >
            <Settings size={18} className="text-brand-text-secondary" />
          </button>
          
          {activePopup === 'settings' && (
            <div className="absolute top-[110%] right-0 mt-1 w-56 bg-white border border-brand-border-outer rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-brand-border-inner font-semibold text-[13px] text-brand-text-primary bg-brand-hover-row">Quick Settings</div>
              <div className="flex flex-col p-2 gap-1">
                <div className="flex justify-between items-center px-2 py-2 hover:bg-brand-hover-row rounded-lg cursor-pointer transition-colors">
                  <span className="text-[12px] text-brand-text-primary">Active Online Status</span>
                  <div className="w-7 h-4 bg-brand-success rounded-full relative transition-colors">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center px-2 py-2 hover:bg-brand-hover-row rounded-lg cursor-pointer transition-colors border-t border-brand-border-inner mt-1">
                  <span className="text-[12px] text-brand-text-primary">Language</span>
                  <select className="text-[11px] font-medium text-brand-text-dark bg-brand-sidebar px-2 py-1 rounded outline-none cursor-pointer">
                    <option>English</option>
                    <option>ภาษาไทย</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
