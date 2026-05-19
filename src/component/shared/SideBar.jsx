// src/component/shared/Sidebar.jsx

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
  // สร้าง Array ของเมนูไว้ จะได้เพิ่มลดง่ายๆ
  const menuItems = [
    { name: "แผนผัง", path: "/shared/tables", icon: LayoutGrid },
    { name: "ออเดอร์", path: "/cashier/orders", icon: ClipboardList },
    { name: "เก็บเงิน", path: "/cashier/checkout", icon: Banknote },
    { name: "ประวัติ", path: "/cashier/history", icon: History },
    { name: "ตั้งค่า", path: "/settings", icon: Settings },
  ];

  return (
    // กำหนดความกว้าง w-60 (240px) และฟิกซ์ติดขอบซ้าย (fixed)
    <aside className="w-60 h-screen bg-[#242424] border-r-2 border-[#333333] fixed top-0 left-0 flex flex-col z-100 font-['IBM_Plex_Sans_Thai']">
      {/* โลโก้ด้านบน Sidebar (ปรับย่อลงมาให้เข้ากับความกว้าง) */}
      <div className="p-6 pb-2 border-b-2 border-[#333333] mb-6">
        <h2 className="font-['Bebas_Neue'] text-3xl leading-none text-white tracking-wide">
          SERIOUS <br />
          <span className="text-[#e4002b]">PUNCH</span>
        </h2>
      </div>

      {/* เมนูต่างๆ */}
      <nav className="flex flex-col gap-2 px-4 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            // ฟังก์ชันนี้เช็คว่า URL ปัจจุบันตรงกับปุ่มไหม ถ้าตรงให้ใส่สีแดง ถ้าไม่ตรงใส่สีขาว
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[#e4002b] text-white shadow-[0_4px_0_#800018] translate-y-0.5" // สไตล์ตอน Active
                  : "text-[#aaaaaa] hover:bg-[#333333] hover:text-white" // สไตล์ตอนธรรมดา
              }`
            }
          >
            <item.icon size={22} strokeWidth={2.5} />
            <span className="text-[1rem] tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* โปรไฟล์พนักงานด้านล่างสุด */}
      <div className="p-4 border-t-2 border-[#333333]">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-[#e4002b] rounded-full flex items-center justify-center font-bold">
            B
          </div>
          <div>
            <p className="font-bold text-sm leading-none">BUA (Cashier)</p>
            <p className="text-[0.7rem] text-[#888888] mt-1">
              Shift: 08:00 - 16:00
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
