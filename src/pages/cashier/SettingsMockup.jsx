import { Settings, Store, Ticket, Lock, Construction } from "lucide-react";
import Sidebar from "../../component/shared/SideBar";

export default function SettingsMockup() {
  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      {/* 1. เมนูด้านซ้าย (Sidebar) */}
      <Sidebar />

      {/* 2. พื้นที่เนื้อหาด้านขวา */}
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto animate-in fade-in duration-300">
        {/* Header Area */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-['Bebas_Neue'] text-5xl text-[#242424] tracking-widest flex items-center gap-3">
            <Settings size={36} className="text-[#888888]" />
            SYSTEM SETTINGS
          </h1>
          <p className="text-[#888888] font-medium text-sm">
            จัดการระบบของสตาฟและตั้งค่าร้านค้า (Store Configuration)
          </p>
        </div>

        {/* Banner แจ้งเตือนว่ากำลังพัฒนา (ปรับเป็นโทนเทา-ขาว) */}
        <div className="bg-white text-[#555555] p-4 rounded-xl border-l-8 border-gray-300 shadow-[4px_4px_0_#d1d5db] flex items-start gap-4 mb-6 opacity-80">
          <Construction size={28} className="text-gray-400 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-lg text-gray-500">
              FUTURE FEATURE (PHASE 2)
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              หน้าต่างการตั้งค่าระดับแคชเชียร์ (Cashier Settings)
              กำลังอยู่ในขั้นตอนการพัฒนา
              <br />
              ในอนาคตคุณจะสามารถควบคุมสถานะการเปิดรับออเดอร์และแคมเปญโปรโมชั่นได้จากที่นี่
            </p>
          </div>
        </div>

        {/* Grid ของฟีเจอร์ Mockup (สถานะ Disabled / Locked) โทนเทากลืนกับพื้นหลัง */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Mockup 1: Store Info & Status */}
          <div className="relative bg-white/60 border-2 border-gray-200 rounded-2xl p-6 opacity-60 select-none overflow-hidden group">
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-400 p-2 rounded-full z-10">
              <Lock size={16} />
            </div>

            <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-xl flex items-center justify-center mb-4">
              <Store size={24} />
            </div>

            <h4 className="font-bold text-gray-500 text-lg mb-2">
              Store Info & Status
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              ตั้งค่าเวลาเปิด-ปิดร้าน หรือกด <strong>Sold Out Close</strong>{" "}
              เพื่อปิดรับออเดอร์ชั่วคราว <br />
              <span className="text-gray-400 text-xs font-bold mt-1 inline-block">
                *หากปิดระบบ ลูกค้าฝั่งหน้าเว็บจะไม่สามารถสั่งอาหารออนไลน์ได้
              </span>
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Delivery Status
              </span>
              <div className="w-10 h-5 bg-gray-200 rounded-full flex items-center px-1">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Mockup 2: Promotion / Coupon */}
          <div className="relative bg-white/60 border-2 border-gray-200 rounded-2xl p-6 opacity-60 select-none overflow-hidden">
            <div className="absolute top-4 right-4 bg-gray-100 text-gray-400 p-2 rounded-full z-10">
              <Lock size={16} />
            </div>

            <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded-xl flex items-center justify-center mb-4">
              <Ticket size={24} />
            </div>

            <h4 className="font-bold text-gray-500 text-lg mb-2">
              Promotion & Coupons
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              การใช้และจัดการโค้ดส่วนลด (Discount Codes)
              ตั้งค่าเงื่อนไขการใช้งาน และแคมเปญโปรโมชั่นต่างๆ
              ของร้านค้าในแต่ละช่วงเวลา
            </p>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="h-8 w-full bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center px-3">
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
