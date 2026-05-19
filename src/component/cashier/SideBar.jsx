// src/components/common/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  Banknote,
  History,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "แผนผัง", icon: LayoutGrid, path: "/waiter/tables" }, // สมมติว่าเชื่อมไปหน้าของเพื่อน
    { name: "ออเดอร์", icon: ClipboardList, path: "/waiter/orders" },
    { name: "เก็บเงิน", icon: Banknote, path: "/cashier/checkout" },
    { name: "ประวัติ", icon: History, path: "/cashier/history" },
    { name: "ตั้งค่า", icon: Settings, p                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ath: "/settings" },
  ];

  return (
    <>
      {/* ─── Sidebar (Desktop) ─── */}
      <aside className="hidden md:flex flex-col items-center w-[90px] bg-[#242424] py-8 gap-8 border-r-2 border-[#333] fixed top-0 left-0 h-screen z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 cursor-pointer transition-all duration-300
                font-['IBM_Plex_Sans_Thai'] font-medium text-[0.6rem]
                ${isActive ? "text-[#E4002B]" : "text-white hover:opacity-70 hover:scale-110"}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </aside>

      {/* ─── Bottom Nav (Mobile) ─── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#242424] border-t-2 border-[#333] z-50 flex justify-around py-2 pb-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 text-[0.6rem] font-['IBM_Plex_Sans_Thai']
                ${isActive ? "text-[#E4002B]" : "text-white"}
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
