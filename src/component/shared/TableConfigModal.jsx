// src/component/shared/TableConfigModal.jsx
import React, { useState, useEffect } from "react";
import { X, Settings, Users, Map, Hash, Trash2 } from "lucide-react";

export default function TableConfigModal({ isOpen, onClose, table }) {
  const [formData, setFormData] = useState({
    id: "",
    zone: "INDOOR",
    cap: 2,
    status: "FREE",
  });

  useEffect(() => {
    if (table && isOpen) {
      setFormData({
        id: table.id || "",
        zone: table.zone || "INDOOR",
        cap: table.cap || 2,
        status: table.status || "FREE",
      });
    }
  }, [table, isOpen]);

  if (!isOpen || !table) return null;

  // แปลงค่า cap กลับเป็นตัวเลข Range เพื่อให้ Select ทำงานตรงกัน
  const getSelectValue = (cap) => {
    if (cap >= 7) return 10;
    if (cap >= 3) return 6;
    return 2;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-9999 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-gray-200 overflow-hidden flex flex-col font-['IBM_Plex_Sans_Thai'] shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* 🏷️ Header: คลีนๆ มินิมอล มีป้าย Phase 2 เล็กๆ */}
        <div className="bg-white px-6 py-5 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2.5 rounded-xl text-gray-400">
              <Settings size={20} />
            </div>
            <div className="flex flex-col">
              <h2 className="font-['Bebas_Neue'] text-2xl tracking-wider text-gray-700 leading-none">
                TABLE CONFIG
              </h2>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                Phase 2 Preview
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2.5 rounded-full transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 📝 Form Body: ทำเป็นสีเทา (Grayscale) และกดไม่ได้ (pointer-events-none) */}
        <div className="p-6 flex flex-col gap-6 bg-[#fafafa]">
          <div className="flex flex-col gap-4 opacity-50 pointer-events-none grayscale">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Core Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <Hash size={12} /> Table ID
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.id}
                  className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-500 bg-gray-50 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                  <Map size={12} /> Zone
                </label>
                <select
                  readOnly
                  value={formData.zone}
                  // appearance-none ใช้ซ่อนลูกศร Dropdown ให้ดูคลีนขึ้นในโหมด Disabled
                  className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-500 bg-gray-50 outline-none appearance-none"
                >
                  <option value="INDOOR">INDOOR</option>
                  <option value="OUTDOOR">OUTDOOR</option>
                </select>
              </div>
            </div>

            {/* 👈 เปลี่ยนจาก Input Number เป็น Select เลือกช่วงจำนวนคน */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <Users size={12} /> Capacity & Shape
              </label>
              <select
                readOnly
                value={getSelectValue(formData.cap)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-500 bg-gray-50 outline-none appearance-none"
              >
                <option value={2}>1-2 คน (โต๊ะกลม)</option>
                <option value={6}>3-6 คน (โต๊ะสี่เหลี่ยม)</option>
                <option value={10}>7-10 คน (โต๊ะยาว)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-5 flex flex-col gap-4 opacity-50 pointer-events-none grayscale">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Status Override
            </h3>
            <select
              readOnly
              value={formData.status}
              className="w-full border-2 border-gray-200 rounded-xl p-3.5 text-sm font-bold text-gray-500 bg-gray-50 outline-none appearance-none"
            >
              <option value="FREE">FREE (ว่าง)</option>
              <option value="OCCUPIED">OCCUPIED (มีลูกค้า)</option>
              <option value="BILL">BILL (รอชำระเงิน)</option>
              <option value="RESERVED">RESERVED (จองแล้ว)</option>
            </select>
          </div>

          <div className="border border-dashed border-gray-300 bg-gray-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3 mt-1 opacity-50 pointer-events-none grayscale">
            <div>
              <h4 className="font-bold text-gray-500 flex items-center gap-1.5 text-sm">
                <Trash2 size={16} /> Danger Zone
              </h4>
              <p className="text-[10px] text-gray-400 font-medium mt-1">
                ลบโต๊ะออกจากผังร้านอย่างถาวร
              </p>
            </div>
            <button
              type="button"
              className="w-full md:w-auto bg-gray-300 text-gray-500 text-xs font-bold py-2.5 px-6 rounded-lg"
            >
              DELETE
            </button>
          </div>
        </div>

        {/* 🛑 Footer: ปุ่ม Save ปิดการใช้งาน แต่ปุ่ม Close ยังกดได้ */}
        <div className="bg-white p-5 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            CLOSE PREVIEW
          </button>
          <button
            disabled
            className="flex-1 bg-gray-100 text-gray-300 font-bold py-3.5 rounded-xl cursor-not-allowed text-sm"
          >
            SAVE CONFIG
          </button>
        </div>
      </div>
    </div>
  );
}
