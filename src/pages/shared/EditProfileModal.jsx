// src/pages/shared/EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  MapPin,
  Mail,
  Phone,
  Lock,
  Clock,
  Calendar,
  Settings2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  ThumbsUp,
  ListOrdered,
} from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, userInfo }) {
  // 1. State สำหรับฟอร์มลูกค้า
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    shippingAddress: "",
    password: "",
  });

  // 2. State สำหรับข้อมูลพนักงาน (เตรียมรับจาก Backend)
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [todayShift, setTodayShift] = useState(null);

  // จำลองสถานะ Clock-In ของวันนี้ (ในของจริงดึงจาก Backend: "Not Clocked In", "Clocked In", "Clocked Out")
  const [clockInStatus, setClockInStatus] = useState("Not Clocked In");

  // State ควบคุม UI
  const [isSameAddress, setIsSameAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [showWeeklySchedule, setShowWeeklySchedule] = useState(false);

  // ⚡ 3. useEffect ดึงข้อมูลเมื่อ Modal เปิด
  useEffect(() => {
    if (isOpen && userInfo) {
      setFormData({
        name: userInfo.name || "",
        phone: userInfo.phone || "",
        email: userInfo.email || "",
        address: userInfo.address || "",
        shippingAddress: userInfo.shippingAddress || "",
        password: "",
      });
      setIsSameAddress(false);
      setShowSecurity(false);
      setShowWeeklySchedule(false);
      setIsAcknowledged(false);

      // ถ้าเป็น Staff ให้จำลองการดึงตารางงานจาก Backend
      if (userInfo.role && userInfo.role !== "customer") {
        fetchStaffSchedule();
      }
    }
  }, [userInfo, isOpen]);

  // ดักการติ๊ก Same as Default Address (ของ Customer)
  useEffect(() => {
    if (isSameAddress) {
      setFormData((prev) => ({ ...prev, shippingAddress: prev.address }));
    }
  }, [isSameAddress, formData.address]);

  if (!isOpen) return null;

  const isCustomer = !userInfo?.role || userInfo?.role === "customer";

  // ==========================================
  // MOCK-UP: ฟังก์ชันจำลองการต่อ Backend สำหรับ STAFF
  // ==========================================
  const fetchStaffSchedule = async () => {
    try {
      // ข้อมูลจำลองที่ได้จาก Backend (ปรับ Status เป็น On Time, Late, Absence, Upcoming)
      const fetchedSchedule = [
        {
          day: "Mon 25/05",
          shift: "08:00 - 17:00",
          role: "Cashier",
          status: "On Time",
        },
        {
          day: "Tue 26/05",
          shift: "08:00 - 17:00",
          role: "Cashier",
          status: "Late",
        },
        {
          day: "Wed 27/05",
          shift: "08:00 - 17:00",
          role: "Cashier",
          status: "Absence",
        },
        {
          day: "Thu 28/05",
          shift: "08:00 - 17:00",
          role: "Cashier",
          status: "Today",
        },
        {
          day: "Fri 29/05",
          shift: "12:00 - 21:00",
          role: "Cashier",
          status: "Upcoming",
        },
        {
          day: "Sat 30/05",
          shift: "10:00 - 19:00",
          role: "Cashier",
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

  // ==========================================
  // 🔌 ฟังก์ชันบันทึกข้อมูล (CUSTOMER)
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "address" && isSameAddress) {
      setFormData((prev) => ({ ...prev, shippingAddress: value }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("อัปเดตข้อมูลผู้ใช้ลง Database สำเร็จ!");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // ฟังก์ชันปุ่ม Acknowledge ของ STAFF
  // ==========================================
  const handleAcknowledge = async () => {
    setIsAcknowledged(true);
    try {
      console.log("Weekly Schedule acknowledged in DB");
    } catch (error) {
      setIsAcknowledged(false);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const hasChanges =
    formData.name !== (userInfo?.name || "") ||
    formData.phone !== (userInfo?.phone || "") ||
    formData.email !== (userInfo?.email || "") ||
    formData.address !== (userInfo?.address || "") ||
    formData.shippingAddress !== (userInfo?.shippingAddress || "") ||
    formData.password !== "";

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
        return "text-gray-400"; // ไม่เน้น สีเทาจางๆ
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-9999 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border-4 border-[#242424] overflow-hidden flex flex-col font-['IBM_Plex_Sans_Thai'] shadow-[8px_8px_0_#242424] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#242424] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-widest flex items-center gap-2">
            {isCustomer ? "USER INFO" : "STAFF PORTAL"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isCustomer ? (
            /* CUSTOMER VIEW (ฟอร์มเต็มรูปแบบ) */
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <User size={12} /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <Phone size={12} /> Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081-XXX-XXXX"
                    className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <MapPin size={12} /> Default Address
                </label>
                <textarea
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Billing/Account Address..."
                  className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <div className="flex flex-col gap-1 border-t-2 border-gray-100 pt-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                    <MapPin size={12} className="text-[#e4002b]" /> Shipping
                    Address
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSameAddress(!isSameAddress)}
                    className="flex items-center gap-1 text-xs font-bold text-[#242424] hover:text-[#e4002b] transition-colors cursor-pointer"
                  >
                    {isSameAddress ? (
                      <CheckSquare size={14} className="text-[#e4002b]" />
                    ) : (
                      <Square size={14} />
                    )}
                    Same as default
                  </button>
                </div>
                <textarea
                  rows="2"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  disabled={isSameAddress}
                  placeholder={
                    isSameAddress
                      ? "Using default address..."
                      : "Where should we deliver your chicken?"
                  }
                  className={`w-full border-2 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] focus:outline-none transition-colors resize-none ${
                    isSameAddress
                      ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-200"
                  }`}
                ></textarea>
              </div>

              <div className="mt-1 border-2 border-gray-100 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowSecurity(!showSecurity)}
                  className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-2.5 flex justify-between items-center transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold text-[#242424] flex items-center gap-2">
                    <Settings2 size={16} className="text-[#e4002b]" /> Account &
                    Security
                  </span>
                  {showSecurity ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </button>

                {showSecurity && (
                  <div className="p-4 bg-white flex flex-col gap-4 border-t-2 border-gray-100">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Mail size={12} /> Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#242424] focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                        <Lock size={12} /> Change Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current password"
                        className="w-full border-2 border-gray-200 rounded-lg p-2.5 text-sm font-medium text-[#242424] focus:border-[#e4002b] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !hasChanges}
                className={`mt-3 w-full font-bold py-3.5 rounded-xl transition-colors border-2 border-transparent flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-wait"
                    : !hasChanges
                      ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed shadow-none"
                      : "bg-[#242424] hover:bg-[#e4002b] text-white hover:border-[#242424] cursor-pointer shadow-[4px_4px_0_#242424] active:translate-y-1 active:shadow-none"
                }`}
              >
                {isLoading ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </form>
          ) : (
            /* STAFF VIEW */
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 bg-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="w-12 h-12 bg-[#242424] text-white rounded-full flex items-center justify-center font-bold text-xl uppercase">
                  {userInfo?.name?.charAt(0) || "S"}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#242424]">
                    {userInfo?.name}
                  </h3>
                  <span className="bg-[#e4002b] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                    ROLE: {userInfo?.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2">
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
                <div className="border-2 border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2">
                  <Clock size={24} className="text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">
                      Clock-In Status
                    </p>
                    {/* เปลี่ยนสีตามสถานะ: ถ้ายังไม่ตอกบัตรให้เป็นสีส้มแจ้งเตือน */}
                    <p
                      className={`font-black ${clockInStatus === "Not Clocked In" ? "text-orange-500" : "text-green-600"}`}
                    >
                      {clockInStatus}
                    </p>
                  </div>
                </div>
              </div>

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

              <div className="border border-gray-200 rounded-xl overflow-hidden mt-1">
                <button
                  type="button"
                  onClick={() => setShowWeeklySchedule(!showWeeklySchedule)}
                  className="w-full bg-gray-50 hover:bg-gray-100 px-4 py-3 flex justify-between items-center transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-gray-600 flex items-center gap-2">
                    <ListOrdered size={15} className="text-gray-400" /> View
                    This Week's Schedule
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
                              {/* ทำให้ตัวอักษรวันที่เข้มขึ้น และถ้าเป็น Today ให้เป็นสีแดง */}
                              <td
                                className={`py-2.5 px-2 font-bold ${item.status === "Today" ? "text-[#e4002b]" : "text-[#242424]"}`}
                              >
                                {item.day}
                              </td>
                              <td className="py-2.5 px-2 text-gray-600">
                                {item.shift}
                              </td>
                              <td className="py-2.5 px-2 text-gray-500">
                                {item.role}
                              </td>
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

              {/* ข้อความภาษาไทย เอาคืนมาตามบรีฟครับ! */}
              <p className="text-center text-[11px] text-gray-400 font-medium mt-1">
                *ระบบนี้ใช้เพื่อตรวจสอบและกดยอมรับตารางกะงานเท่านั้น <br />
                การตอกบัตรเข้า-ออกงานต้องทำผ่านเครื่องที่หน้าร้าน
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
