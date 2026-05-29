import { Settings, Store, Ticket, Lock, Construction } from "lucide-react";
import Sidebar from "../../component/shared/SideBar";

export default function SettingsMockup() {
  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      {/* 1. เมนูด้านซ้าย (Sidebar) */}
      <Sidebar />

      {/* 2. พื้นที่เนื้อหาด้านขวา (ต้องมี flex-1 และ ml-60 เหมือนหน้า OrderList) */}
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto animate-in fade-in duration-300">
        {/* Header Area */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-['Bebas_Neue'] text-5xl text-[#242424] tracking-widest flex items-center gap-3">
            <Settings size={36} className="text-[#e4002b]" />
            SYSTEM SETTINGS
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            จัดการระบบของสตาฟและตั้งค่าร้านค้า (Store Configuration)
          </p>
        </div>

        {/* Banner แจ้งเตือนว่ากำลังพัฒนา */}
        <div className="bg-[#242424] text-white p-4 rounded-xl border-l-8 border-[#e4002b] shadow-[4px_4px_0_#e4002b] flex items-start gap-4 mb-6">
          <Construction
            size={28}
            className="text-yellow-400 shrink-0 mt-1 animate-pulse"
          />
          <div>
            <h3 className="font-bold text-lg text-yellow-400">
              FUTURE FEATURE (PHASE 2)
            </h3>
            <p className="text-sm text-gray-300 mt-1">
              หน้าต่างการตั้งค่าระดับแคชเชียร์ (Cashier Settings)
              กำลังอยู่ในขั้นตอนการพัฒนา
              <br />
              ในอนาคตคุณจะสามารถควบคุมสถานะการเปิดรับออเดอร์และแคมเปญโปรโมชั่นได้จากที่นี่
            </p>
          </div>
        </div>

        {/* Grid ของฟีเจอร์ Mockup (สถานะ Disabled / Locked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Mockup 1: Store Info & Status */}
          <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 opacity-80 grayscale-20 select-none overflow-hidden group">
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-400 p-2 rounded-full z-10">
              <Lock size={16} />
            </div>

            <div className="w-12 h-12 bg-red-50 text-[#e4002b] rounded-xl flex items-center justify-center mb-4">
              <Store size={24} />
            </div>

            <h4 className="font-bold text-[#242424] text-lg mb-2">
              Store Info & Status
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              ตั้งค่าเวลาเปิด-ปิดร้าน หรือกด <strong>Emergency Close</strong>{" "}
              เพื่อปิดรับออเดอร์ชั่วคราว <br />
              <span className="text-[#e4002b] text-xs font-bold mt-1 inline-block">
                *หากปิดระบบ ลูกค้าฝั่งหน้าเว็บจะไม่สามารถสั่งอาหารออนไลน์ได้
              </span>
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Delivery Status
              </span>
              <div className="w-10 h-5 bg-gray-200 rounded-full flex items-center px-1">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Mockup 2: Promotion / Coupon */}
          <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 opacity-80 grayscale-20 select-none overflow-hidden">
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-400 p-2 rounded-full z-10">
              <Lock size={16} />
            </div>

            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Ticket size={24} />
            </div>

            <h4 className="font-bold text-[#242424] text-lg mb-2">
              Promotion & Coupons
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              การใช้และจัดการโค้ดส่วนลด (Discount Codes)
              ตั้งค่าเงื่อนไขการใช้งาน และแคมเปญโปรโมชั่นต่างๆ
              ของร้านค้าในแต่ละช่วงเวลา
            </p>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="h-8 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-200 flex items-center px-3">
                <span className="text-xs font-bold text-gray-400">
                  ADD_NEW_CODE_...
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
