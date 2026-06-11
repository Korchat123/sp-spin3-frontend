import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import {
  LayoutGrid,
  ClipboardList,
  Banknote,
  History,
  Settings,
  LogOut,
  PlusSquare,
  Menu,
  X,
} from "lucide-react";

import NotificationBell from "./NotificationBell";
import LiveClock from "./LiveClock";

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { name: "Table Map", path: "/shared/tables", icon: LayoutGrid },
    { name: "Orders", path: "/cashier/orders", icon: ClipboardList },
    { name: "Checkout", path: "/cashier/checkout", icon: Banknote },
    { name: "History", path: "/cashier/history", icon: History },
    { name: "Settings", path: "/cashier/settings", icon: Settings },
  ];

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-[100] flex h-screen w-60 max-w-[82vw] flex-col border-r border-[#333333] bg-[#242424] font-['IBM_Plex_Sans_Thai'] transition-transform duration-300 ease-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileMenu}
          className="absolute right-3 top-3 rounded-full p-2 text-[#cccccc] transition hover:bg-white/10 hover:text-white md:hidden"
        >
          <X size={22} />
        </button>

        <div className="p-6 pb-4 flex flex-col items-center mt-2">
          <h2 className="font-['Bebas_Neue'] text-4xl leading-none text-white tracking-widest text-center">
            SERIOUS
            <br />
            <span className="text-[#e4002b]">PUNCH</span>
          </h2>
        </div>

        <LiveClock />

        <nav className="flex flex-col gap-1.5 px-3 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-4 mt-2 px-1">
            <NavLink
              to="/cashier/menu"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all duration-200 border-2 uppercase tracking-widest text-sm ${
                  isActive
                    ? "border-[#e4002b] text-[#e4002b] bg-[#e4002b]/10 shadow-sm"
                    : "border-dashed border-[#555555] text-[#cccccc] hover:border-solid hover:border-[#e4002b] hover:text-[#e4002b] hover:bg-white/5"
                }`
              }
            >
              <PlusSquare size={18} strokeWidth={2.5} />
              NEW ORDER
            </NavLink>
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#e4002b] text-white shadow-sm"
                    : "text-[#888888] hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={20} strokeWidth={2.5} />
              <span className="text-sm tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-2 border-t border-[#333333] pt-2 mt-auto">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[#888888] hover:bg-white/5 hover:text-[#e4002b] transition-all duration-200"
          >
            <LogOut size={20} strokeWidth={2.5} />
            <span className="text-sm tracking-wide">Back to HOME</span>
          </Link>
        </div>

        {/* 💡 พระเอกรอบนี้: Profile Section ดีไซน์ใหม่ เรียบหรู ไม่แย่งซีน */}
        <div className="p-4 border-t border-[#333333] bg-[#1a1a1a]/50">
          <div className="flex items-center gap-3">
            {/* Avatar แบบ Minimal */}
            <div className="w-10 h-10 bg-[#333333] border border-[#444444] text-[#cccccc] rounded-full flex items-center justify-center font-bold text-sm shadow-inner transition-colors hover:bg-[#444444]">
              B
            </div>
            <div>
              <p className="font-bold text-sm leading-none text-[#dddddd]">
                BUA (Cashier)
              </p>
              <p className="text-[0.65rem] text-[#777777] mt-1 font-medium tracking-wide">
                SHIFT: 08:00 - 16:00
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="fixed right-4 top-4 z-[200] flex items-center gap-3 md:right-8 md:top-6">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={() => setIsMobileOpen(true)}
          className="rounded-xl border-2 border-gray-100 bg-white p-3 shadow-sm transition-all active:scale-95 md:hidden"
        >
          <Menu size={24} className="text-[#242424]" />
        </button>
        <NotificationBell />
      </div>
    </>
  );
};

export default Sidebar;
