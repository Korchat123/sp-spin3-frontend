import React from "react"
import { 
  Grid2X2, 
  Square, 
  FileText, 
  List, 
  Package, 
  Trash2, 
  PlusCircle, 
  User, 
  Users, 
  LogOut 
} from 'lucide-react'
import SidebarNavItem from './SidebarNavItem'
import { useOrders } from '../../hooks/useOrders'
import { useUIStore } from '../../context/UIContext'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const { orders } = useOrders();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const { logout } = useAuth();
  
  const activeOrderCount = orders.filter(o => o.status === 'New' || o.status === 'Cooking').length;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#1A2333]/40 z-[90] lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[100]
        w-[210px] bg-brand-sidebar border-r border-brand-border-outer
        flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo */}
        <div className="p-[14px_16px] border-b border-brand-border-outer flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] flex items-center justify-center shrink-0">
            <svg className="w-[28px] h-[28px]" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <polygon points="10,4 20,14 10,24 0,14" fill="#9AA3AE" opacity="0.6"/>
              <polygon points="22,4 32,14 22,24 12,14" fill="#9AA3AE" opacity="0.6"/>
              <polygon points="16,10 26,20 16,30 6,20" fill="#6B7A8D" opacity="0.8"/>
            </svg>
          </div>
          <div>
            <div className="text-[14px] font-medium text-brand-text-primary">พุงกาง</div>
            <div className="text-[10px] text-brand-text-secondary">Restaurant Platform</div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="mt-2">
            <SidebarNavItem to="/" icon={<Grid2X2 size={18} />} label="Dashboard" onClick={closeSidebar} />
          </div>

          <div className="pt-[16px] px-[16px] pb-1 text-[10px] text-brand-text-tertiary uppercase tracking-[0.07em] font-semibold">
            Operations
          </div>
          <SidebarNavItem to="/tables" icon={<Square size={18} />} label="โต๊ะ" onClick={closeSidebar} />
          <SidebarNavItem to="/orders" icon={<FileText size={18} />} label="ออเดอร์" badgeCount={activeOrderCount} onClick={closeSidebar} />
          <SidebarNavItem to="/menu" icon={<List size={18} />} label="เมนู" onClick={closeSidebar} />

          <div className="pt-[16px] px-[16px] pb-1 text-[10px] text-brand-text-tertiary uppercase tracking-[0.07em] font-semibold">
            Inventory
          </div>
          <SidebarNavItem to="/stock" icon={<Package size={18} />} label="สต็อกสินค้า" onClick={closeSidebar} />
          <SidebarNavItem to="/waste" icon={<Trash2 size={18} />} label="ของเสีย" onClick={closeSidebar} />

          <div className="pt-[16px] px-[16px] pb-1 text-[10px] text-brand-text-tertiary uppercase tracking-[0.07em] font-semibold">
            Business
          </div>
          <SidebarNavItem to="/promotions" icon={<PlusCircle size={18} />} label="โปรโมชัน" onClick={closeSidebar} />
          <SidebarNavItem to="/customers" icon={<User size={18} />} label="ลูกค้า" onClick={closeSidebar} />

          <div className="pt-[16px] px-[16px] pb-1 text-[10px] text-brand-text-tertiary uppercase tracking-[0.07em] font-semibold">
            Credentials
          </div>
          <SidebarNavItem to="/staff" icon={<Users size={18} />} label="พนักงาน" onClick={closeSidebar} />
        </div>

        {/* Log out */}
        <div className="p-2 border-t border-brand-border-outer">
          <a 
            href="#" 
            onClick={handleLogout}
            className="flex items-center gap-[9px] py-[7px] px-[12px] rounded-lg mx-[6px] my-[1px] cursor-pointer text-[13px] text-brand-text-secondary hover:bg-brand-active-nav/50 hover:text-brand-text-primary transition-colors decoration-none"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Log out</span>
          </a>
        </div>
      </aside>
    </>
  )
}
