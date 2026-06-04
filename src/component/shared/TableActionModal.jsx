import React, { useState, useEffect } from "react";
import {
  X,
  PlusCircle,
  Receipt,
  CreditCard,
  Trash2,
  CheckCircle2,
  CalendarPlus,
  UserCheck,
  XCircle,
  Link as LinkIcon,
  ChevronLeft,
  Calendar,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function TableActionModal({
  isOpen,
  onClose,
  table,
  onAction,
  allReservations = [],
  selectedDate,
  selectedTimeSlot,
  timeSlots = [],
  pendingBookings = [],
}) {
  const [reserveStep, setReserveStep] = useState("HOME");
  const [selectedResId, setSelectedResId] = useState("");

  const [manualBooking, setManualBooking] = useState({
    name: "",
    phone: "",
    pax: 2,
    date: "",
    timeSlot: "",
  });

  useEffect(() => {
    if (isOpen && table) {
      setReserveStep("HOME");
      setSelectedResId("");

      const defaultPax = table.cap === 2 ? 2 : table.cap === 6 ? 6 : 10;

      setManualBooking({
        name: "",
        phone: "",
        pax: defaultPax,
        date: selectedDate || new Date().toISOString().split("T")[0],
        timeSlot: selectedTimeSlot || "10:00 - 12:00",
      });
    }
  }, [isOpen, selectedDate, selectedTimeSlot, table]);

  if (!isOpen || !table) return null;

  const isFree = table.status === "FREE";
  const isOccupied = table.status === "OCCUPIED";
  const isReserved = table.status === "RESERVED";

  // ตารางประวัติคิวจอง
  const tableSchedule = allReservations.filter((r) => r.tableId === table.id);

  // คัดกรองคิวจองออนไลน์ที่รอดึงผูก
  const availablePending = pendingBookings.filter(
    (b) => b.date === selectedDate && b.timeSlot === selectedTimeSlot,
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-[slideUp_0.15s_ease-out]">
        <div
          className={`p-6 text-center relative border-b-4 ${
            isFree
              ? "bg-[#242424] border-[#e4002b]"
              : isReserved
                ? "bg-[#fafafa] border-gray-200"
                : "bg-[#242424] border-gray-600"
          }`}
        >
          {reserveStep !== "HOME" ? (
            <button
              onClick={() => setReserveStep("RESERVE_OPTIONS")}
              className={`absolute top-4 left-4 transition-colors cursor-pointer ${isReserved ? "text-[#242424]/50 hover:text-[#242424]" : "text-white/50 hover:text-white"}`}
            >
              <ChevronLeft size={24} />
            </button>
          ) : null}

          <button
            onClick={onClose}
            className={`absolute top-4 right-4 transition-colors cursor-pointer ${isReserved ? "text-[#242424]/50 hover:text-[#242424]" : "text-white/50 hover:text-white"}`}
          >
            <X size={20} />
          </button>

          <h2
            className={`font-['Bebas_Neue'] text-5xl tracking-widest mt-2 ${isReserved ? "text-[#242424]" : "text-white"}`}
          >
            {table.id}
          </h2>

          <div className="flex justify-center items-center gap-2 mt-2 flex-wrap">
            <span
              className={`inline-block px-3 py-1 rounded text-xs font-bold border-2 ${
                isFree
                  ? "bg-white text-[#242424] border-transparent"
                  : isReserved
                    ? "bg-yellow-400 text-[#242424] border-[#242424] shadow-[2px_2px_0_#242424] transform -rotate-2"
                    : "bg-[#e4002b] text-white border-transparent"
              }`}
            >
              {table.status}
            </span>

            {/* Quick Online/Offline Badge / Toggle */}
            <button
              onClick={() => onAction(table.id, "TOGGLE_ONLINE")}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase transition-all hover:scale-105 cursor-pointer ${
                table.isOnline
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {table.isOnline ? <Wifi size={10} /> : <WifiOff size={10} />}
              {table.isOnline ? "ONLINE" : "OFFLINE"}
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-3 bg-[#fafafa]">
          {isFree && reserveStep === "HOME" && (
            <>
              <button
                onClick={() => onAction(table.id, "NEW_ORDER")}
                className="w-full bg-[#242424] hover:bg-[#333] text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
              >
                <CheckCircle2 size={18} /> OPEN NEW ORDER
              </button>
              <button
                onClick={() => setReserveStep("RESERVE_OPTIONS")}
                className="w-full bg-white border-2 border-gray-255 hover:border-[#242424] text-gray-600 hover:text-[#242424] font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <CalendarPlus size={18} /> RESERVE TABLE
              </button>
            </>
          )}

          {isFree && reserveStep === "RESERVE_OPTIONS" && (
            <div className="animate-[slideInRight_0.15s_ease-out] flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  1. Manual Booking (Staff Reserve)
                </h3>
                <button
                  onClick={() => setReserveStep("MANUAL_FORM")}
                  className="w-full bg-[#242424] hover:bg-[#333] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md text-sm"
                >
                  <CalendarPlus size={18} /> STAFF RESERVE
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-1 font-medium">
                  For phone or walk-in booking (11+ PAX / Custom)
                </p>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  2. Link Online Reservation
                </h3>

                <select
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-[#242424] bg-white outline-none focus:border-[#242424] mb-2 cursor-pointer"
                >
                  <option value="">-- Select Pending Reservation --</option>
                  {availablePending.map((res) => (
                    <option key={res.id} value={res.id}>
                      {res.id} - {res.name} ({res.pax} PAX, {res.timeSlot})
                    </option>
                  ))}
                </select>

                <button
                  disabled={!selectedResId}
                  onClick={() =>
                    onAction(table.id, "LINK_RESERVE", selectedResId)
                  }
                  className={`w-full font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-xs ${
                    selectedResId
                      ? "bg-white border-2 border-[#242424] text-[#242424] active:scale-95 cursor-pointer shadow-sm"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed border-none"
                  }`}
                >
                  <LinkIcon size={18} /> LINK BOOKING
                </button>
              </div>
            </div>
          )}

          {isFree && reserveStep === "MANUAL_FORM" && (
            <div className="animate-[slideInRight_0.15s_ease-out] flex flex-col gap-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Manual Booking Details
              </h3>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. K. Somchai"
                  value={manualBooking.name}
                  onChange={(e) =>
                    setManualBooking({ ...manualBooking, name: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl p-2.5 text-xs font-bold text-[#242424] bg-white outline-none focus:border-[#242424]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 081-234-5678"
                  value={manualBooking.phone}
                  onChange={(e) =>
                    setManualBooking({
                      ...manualBooking,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl p-2.5 text-xs font-bold text-[#242424] bg-white outline-none focus:border-[#242424]"
                />
              </div>

              {/* 👥 กลุ่มตัวเลือก PAX (Guests) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  PAX (Guests)
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {[
                    { label: "1-2 คน", value: 2, maxCapRequired: 2 },
                    { label: "3-6 คน", value: 6, maxCapRequired: 6 },
                    { label: "7-10 คน", value: 10, maxCapRequired: 10 },
                  ].map((opt) => {
                    const isDisabled = table.cap < opt.maxCapRequired;
                    const isSelected = manualBooking.pax === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() =>
                          setManualBooking({ ...manualBooking, pax: opt.value })
                        }
                        className={`py-2 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-center cursor-pointer ${
                          isDisabled
                            ? "bg-gray-100 border-gray-155 text-gray-350 cursor-not-allowed opacity-50"
                            : isSelected
                              ? "bg-[#242424] border-[#242424] text-white shadow-sm"
                              : "bg-white border-gray-205 text-gray-650 hover:border-gray-300 hover:text-[#242424]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* วันที่และเวลาจัดกลุ่มอยู่แถวเดียวกัน */}
              <div className="grid grid-cols-2 gap-3 mt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    value={manualBooking.date}
                    onChange={(e) =>
                      setManualBooking({
                        ...manualBooking,
                        date: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl p-2 text-xs font-bold text-[#242424] bg-white outline-none focus:border-[#242424]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Time Slot
                  </label>
                  <select
                    value={manualBooking.timeSlot}
                    onChange={(e) =>
                      setManualBooking({
                        ...manualBooking,
                        timeSlot: e.target.value,
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl p-2.5 text-xs font-bold text-[#242424] bg-white outline-none focus:border-[#242424]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                disabled={!manualBooking.name}
                onClick={() =>
                  onAction(table.id, "MANUAL_RESERVE", manualBooking)
                }
                className={`w-full font-bold py-3 text-white rounded-xl uppercase tracking-wider transition-all mt-1 flex items-center justify-center gap-2 text-xs ${
                  manualBooking.name
                    ? "bg-[#242424] hover:bg-[#e4002b] active:scale-95 cursor-pointer shadow-md"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CalendarPlus size={16} /> Confirm Reservation
              </button>
            </div>
          )}

          {isReserved && (
            <>
              <button
                onClick={() => onAction(table.id, "CHECK_IN")}
                className="w-full bg-[#242424] hover:bg-[#333] text-white font-bold py-4 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
              >
                <UserCheck size={18} /> Customer Check-in
              </button>
              <button
                onClick={() => {
                  const currentRes = tableSchedule.find(
                    (r) =>
                      r.date === selectedDate &&
                      r.timeSlot === selectedTimeSlot,
                  );
                  if (
                    window.confirm(
                      `Do you want to cancel the reservation for table ${table.id}?`,
                    )
                  ) {
                    onAction(table.id, "CLEAR_RESERVE", currentRes?.id);
                  }
                }}
                className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-[#e4002b] hover:bg-red-50 text-gray-500 hover:text-[#e4002b] font-bold py-3.5 rounded-xl uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <XCircle size={18} /> Cancel Reservation
              </button>
            </>
          )}

          {isOccupied && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onAction(table.id, "ADD_ORDER")}
                className="col-span-2 bg-[#242424] hover:bg-[#333] text-white font-bold py-3.5 rounded-xl uppercase transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md cursor-pointer text-sm"
              >
                <PlusCircle size={18} /> ADD ORDER
              </button>

              {/* 💡 VIEW BILL (Phase 2): เพิ่มข้อความ phase 2 ตัวเล็กๆ สีเทา */}
              <button
                onClick={() => onAction(table.id, "VIEW_BILL")}
                className="bg-gray-50 hover:bg-gray-100/80 text-gray-400 border-2 border-gray-200 font-bold py-3 rounded-xl transition-all active:scale-95 flex flex-col items-center justify-center cursor-pointer opacity-60 hover:opacity-90 hover:text-gray-500"
                title="View Bill (Developer backdoor - Clickable)"
              >
                <Receipt size={20} className="opacity-50 mb-1" />
                <span className="text-[10px] uppercase tracking-wider flex flex-col items-center leading-none">
                  VIEW BILL
                  <span className="text-[8px] text-gray-400 font-normal lowercase mt-0.5">
                    (phase 2)
                  </span>
                </span>
              </button>

              <button
                onClick={() => onAction(table.id, "CHECKOUT")}
                className="bg-[#e4002b] hover:bg-[#c90025] text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <CreditCard size={20} />{" "}
                <span className="text-[10px] uppercase tracking-wider">
                  CHECKOUT
                </span>
              </button>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      `ยืนยันการเคลียร์โต๊ะ ${table.id} เพื่อรับลูกค้าใหม่?`,
                    )
                  ) {
                    onAction(table.id, "CLEAR");
                  }
                }}
                className="col-span-2 mt-2 bg-white border-2 border-dashed border-gray-300 hover:border-[#e4002b] hover:bg-red-50 text-gray-500 hover:text-[#e4002b] font-bold py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Trash2 size={16} /> VOID / CLEAR TABLE
              </button>
            </div>
          )}

          {/* Booking Schedule: ปรับให้แสดง ID นำหน้าชื่อลูกค้าเป็นสีแดง */}
          {reserveStep === "HOME" && (
            <div className="mt-3 border-t border-dashed border-gray-200 pt-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                <Calendar size={13} className="text-[#e4002b]" />
                <span>Booking Schedule</span>
              </div>
              {tableSchedule.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic text-center py-1">
                  No upcoming reservations
                </p>
              ) : (
                <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {tableSchedule.map((b) => (
                    <div
                      key={b.id}
                      className="flex justify-between items-center bg-white border border-gray-150 rounded-lg p-2 text-[10px] shadow-sm"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">
                          <span className="text-[#e4002b] mr-1">{b.id}</span> -{" "}
                          {b.name} ({b.pax} PAX)
                        </span>
                        <span className="text-gray-400 text-[9px]">
                          {b.date} • Slot: {b.timeSlot}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-black ${
                          b.status === "OCCUPIED"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {b.status === "OCCUPIED" ? "Occupied" : "Reserved"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {reserveStep === "HOME" && (
            <button
              onClick={onClose}
              className="w-full bg-transparent text-gray-400 font-bold py-2 rounded-xl uppercase text-xs hover:bg-gray-100 transition-colors mt-2 cursor-pointer"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
