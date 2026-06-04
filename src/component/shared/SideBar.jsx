import { NavLink, Link } from "react-router-dom";
import {
  LayoutGrid,
  ClipboardList,
  Banknote,
  History,
  Settings,
  LogOut,
  PlusSquare,
} from "lucide-react";

import NotificationBell from "./NotificationBell";
import LiveClock from "./LiveClock";

const Sidebar = () => {
  const menuItems = [
    { name: "Table Map", path: "/shared/tables", icon: LayoutGrid },
    { name: "Orders", path: "/cashier/orders", icon: ClipboardList },
    { name: "Checkout", path: "/cashier/checkout", icon: Banknote },
    { name: "History", path: "/cashier/history", icon: History },
    { name: "Settings", path: "/cashier/settings", icon: Settings },
  ];

  return (
    <>
      <aside className="w-60 h-screen bg-[#242424] border-r border-[#333333] fixed top-0 left-0 flex flex-col z-100 font-['IBM_Plex_Sans_Thai']">
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

      <div className="fixed top-6 right-8 z-110">
        <NotificationBell />
      </div>
    </>
  );
};

export default Sidebar;
