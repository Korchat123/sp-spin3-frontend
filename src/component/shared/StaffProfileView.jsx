import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ThumbsUp,
  ListOrdered,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function StaffProfileView({ userInfo }) {
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [todayShift, setTodayShift] = useState(null);
  const [clockInStatus, setClockInStatus] = useState("Not Clocked In");
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);

  // ⚡ ดึงข้อมูลตารางงานใหม่ "ทุกครั้งที่ userInfo (Role) เปลี่ยนไป"
  useEffect(() => {
    fetchStaffSchedule();
  }, [userInfo]);

  // ==========================================
  // MOCK-UP: ฟังก์ชันจำลองการต่อ Backend สำหรับ STAFF
  // ==========================================
  const fetchStaffSchedule = async () => {
    try {
      // ถ้าไม่มีข้อมูลให้แสดงคำว่า "Staff" แทน
      const displayRole = userInfo?.role
        ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)
        : "Staff";

      // เอา displayRole ไปหยอดใส่ตารางทุกวัน (ยกเว้นวันหยุด)
      const fetchedSchedule = [
        {
          day: "Mon 25/05",
          shift: "08:00 - 17:00",
          role: displayRole,
          status: "On Time",
        },
        {
          day: "Tue 26/05",
          shift: "08:00 - 17:00",
          role: displayRole,
          status: "Late",
        },
        {
          day: "Wed 27/05",
          shift: "08:00 - 17:00",
          role: displayRole,
          status: "Absence",
        },
        {
          day: "Thu 28/05",
          shift: "08:00 - 17:00",
          role: displayRole,
          status: "Today",
        },
        {
          day: "Fri 29/05",
          shift: "12:00 - 21:00",
          role: displayRole,
          status: "Upcoming",
        },
        {
          day: "Sat 30/05",
          shift: "10:00 - 19:00",
          role: displayRole,
          status: "Upcoming",
        },
        { day: "Sun 31/05", shift: "OFF", role: "-", status: "-" },
      ];

      setWeeklySchedule(fetchedSchedule);
      const today = fetchedSchedule.find((s) => s.status === "Today");
      setTodayShift(today ? today.shift : "No Shift");

      // ในของจริง ตรงนี้จะเซ็ต setClockInStatus ตามข้อมูลจาก Database
    } catch (error) {
      console.error("Failed to fetch schedule:", error);
    }
  };

  const handleAcknowledge = async () => {
    setIsAcknowledged(true);
    try {
      console.log("Weekly Schedule acknowledged in DB");
    } catch (error) {
      setIsAcknowledged(false);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  // Helper สำหรับสีของสถานะตารางงาน
  const getStatusStyle = (status) => {
    switch (status) {
      case "Today":
        return "bg-[#e4002b] text-white";
      case "On Time":
        return "bg-green-50 text-green-600";
      case "Late":
        return "bg-orange-50 text-orange-600";
      case "Absence":
        return "bg-red-50 text-red-600";
      case "Upcoming":
        return "text-gray-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. ข้อมูลพนักงาน */}
      <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl border border-gray-200">
        <div className="w-12 h-12 bg-[#242424] text-white rounded-full flex items-center justify-center font-bold text-xl uppercase">
          {userInfo?.name?.charAt(0) || "S"}
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#242424]">
            {userInfo?.name || "Staff Name"}
          </h3>
          <span className="bg-[#e4002b] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            ROLE: {userInfo?.role || "STAFF"}
          </span>
        </div>
      </div>

      {/* 2. สถานะกะงานวันนี้ */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 bg-white">
          <Calendar size={24} className="text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">
              Today's Shift
            </p>
            <p className="font-black text-[#242424]">
              {todayShift || "Loading..."}
            </p>
          </div>
        </div>
        <div className="border-2 border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 bg-white">
          <Clock size={24} className="text-gray-400" />
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">
              Clock-In Status
            </p>
            <p
              className={`font-black ${clockInStatus === "Not Clocked In" ? "text-orange-500" : "text-green-600"}`}
            >
              {clockInStatus}
            </p>
          </div>
        </div>
      </div>

      {/* 3. ปุ่มยอมรับตารางงาน */}
      <button
        onClick={handleAcknowledge}
        disabled={isAcknowledged}
        className={`w-full border-2 py-3.5 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${
          isAcknowledged
            ? "bg-green-50 border-green-200 text-green-600 cursor-not-allowed"
            : "bg-white border-[#242424] hover:bg-[#242424] hover:text-white text-[#242424] cursor-pointer shadow-[4px_4px_0_#242424] active:translate-y-1 active:shadow-none"
        }`}
      >
        <ThumbsUp size={18} />
        {isAcknowledged ? "SHIFT ACKNOWLEDGED" : "ACKNOWLEDGE SHIFT"}
      </button>

      {/* 4. ตารางงานรายสัปดาห์ */}
      <div className="border border-gray-200 rounded-xl overflow-hidden mt-1 bg-white">
        <button
          type="button"
          onClick={() => setShowWeeklySchedule(!showWeeklySchedule)}
          className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-3 flex justify-between items-center transition-colors cursor-pointer border-b border-transparent"
        >
          <span className="text-xs font-bold text-gray-600 flex items-center gap-2">
            <ListOrdered size={15} className="text-gray-400" /> View This Week's
            Schedule
          </span>
          {showWeeklySchedule ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </button>

        {showWeeklySchedule && (
          <div className="p-2 bg-white border-t border-gray-100 text-xs animate-in slide-in-from-top-2 duration-150">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="py-2 px-2">Day</th>
                    <th className="py-2 px-2">Time Slot</th>
                    <th className="py-2 px-2">Role</th>
                    <th className="py-2 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-[#242424]">
                  {weeklySchedule.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border-b last:border-none border-gray-100 ${item.status === "Today" ? "bg-red-50/30" : ""}`}
                    >
                      <td
                        className={`py-2.5 px-2 font-bold ${item.status === "Today" ? "text-[#e4002b]" : "text-[#242424]"}`}
                      >
                        {item.day}
                      </td>
                      <td className="py-2.5 px-2 text-gray-600">
                        {item.shift}
                      </td>
                      <td className="py-2.5 px-2 text-gray-500">{item.role}</td>
                      <td className="py-2.5 px-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ข้อความแจ้งเตือน */}
      <p className="text-center text-[11px] text-gray-400 font-medium mt-1">
        *ระบบนี้ใช้เพื่อตรวจสอบและกดยอมรับตารางกะงานเท่านั้น <br />
        การตอกบัตรเข้า-ออกงานต้องทำผ่านเครื่องที่หน้าร้าน
      </p>
    </div>
  );
}
