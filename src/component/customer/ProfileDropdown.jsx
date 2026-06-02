// src/component/customer/ProfileDropdown.jsx
import { LayoutDashboard, Settings, History, LogOut } from "lucide-react";

export default function ProfileDropdown({
  isOpen,
  profileRef,
  myUserInfo,
  goToDashboard,
  handleLogout,
  navigate,
  onClose,
  onOpenEditProfile,
}) {
  if (!isOpen) return null;

  // เช็คว่าเป็นลูกค้าตัวจริงไหม
  const isCustomer = !myUserInfo?.role || myUserInfo?.role === "customer";

  return (
    <div
      ref={profileRef}
      className="absolute right-0 mt-3 w-52 bg-white border-4 border-[#242424] rounded-xl py-2 flex flex-col font-['IBM_Plex_Sans_Thai'] overflow-hidden animate-in fade-in zoom-in duration-200 z-50 shadow-[4px_4px_0_#242424]"
    >
      <div className="px-4 py-3 border-b-2 border-gray-100 mb-1 bg-gray-50">
        <p className="text-[10px] text-gray-400 uppercase font-black">
          Logged in as
        </p>
        {!isCustomer && (
          <p className="font-bold text-[#e4002b] truncate">
            {myUserInfo?.role?.toUpperCase()}
          </p>
        )}
        <p className="text-m font-bold text-[#242424] truncate">
          {myUserInfo?.name}
        </p>
      </div>

      {/* โชว์ปุ่ม Dashboard เฉพาะกลุ่มพนักงาน (Staff) */}
      {!isCustomer && (
        <button
          onClick={goToDashboard}
          className="flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-100 text-[#242424] font-bold cursor-pointer"
        >
          <LayoutDashboard size={16} className="text-[#e4002b]" /> Dashboard
        </button>
      )}

      {/* ปุ่มเปิดหน้าต่างข้อมูล (เข้าได้ทุกคน แต่อินเทอร์เฟซข้างในจะเปลี่ยนตาม Role อัตโนมัติ) */}
      <button
        onClick={() => {
          onClose();
          onOpenEditProfile();
        }}
        className="flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-100 text-[#242424] cursor-pointer font-medium"
      >
        <Settings size={16} /> User Info
      </button>

      {/* ✅ ซ่อนปุ่ม Order History ไม่ให้พนักงานเห็น คัดไว้ให้เฉพาะลูกค้า (Customer) เท่านั้น */}
      {isCustomer && (
        <button
          onClick={() => {
            onClose();
            navigate("/order-history");
          }}
          className="flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-100 text-[#242424] cursor-pointer font-medium"
        >
          <History size={16} /> Order History
        </button>
      )}

      {/* ปุ่ม Sign Out */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-3 text-left hover:bg-[#e4002b] hover:text-white text-red-600 font-bold border-t-2 border-gray-100 mt-1 cursor-pointer transition-colors"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
