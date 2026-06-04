import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  Users,
  Map,
  Hash,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function TableConfigModal({
  isOpen,
  onClose,
  table,
  onSave,
  onDelete,
}) {
  const [formData, setFormData] = useState({
    id: "",
    zone: "INDOOR",
    cap: 2,
    isOnline: true,
    status: "FREE",
  });

  useEffect(() => {
    if (table && isOpen) {
      setFormData({
        id: table.id || "",
        zone: table.zone || "INDOOR",
        cap: table.cap || 2,
        isOnline: table.isOnline ?? true,
        status: table.status || "FREE",
      });
    }
  }, [table, isOpen]);

  if (!isOpen || !table) return null;

  const isNew = table.id === "" || table.id === "NEW";
  const canDelete = formData.status === "FREE";

  const getSelectValue = (cap) => {
    if (cap >= 7) return 10;
    if (cap >= 3) return 6;
    return 2;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-9999 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-gray-200 overflow-hidden flex flex-col font-['IBM_Plex_Sans_Thai'] shadow-2xl animate-[slideUp_0.2s_ease-out]">
        <div className="bg-[#242424] px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-white" />
            <h2 className="font-['Bebas_Neue'] text-2xl tracking-wider text-white leading-none mt-1">
              {isNew ? "CREATE TABLE" : "TABLE CONFIG"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5 bg-[#fafafa]">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
              <Hash size={12} /> Table ID
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) =>
                setFormData({ ...formData, id: e.target.value.toUpperCase() })
              }
              placeholder="เช่น T-01"
              readOnly={!isNew}
              className={`w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-[#242424] outline-none transition-colors ${isNew ? "bg-white focus:border-[#242424]" : "bg-gray-100 text-gray-500"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <Map size={12} /> Zone
              </label>
              <select
                value={formData.zone}
                onChange={(e) =>
                  setFormData({ ...formData, zone: e.target.value })
                }
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-[#242424] bg-white outline-none focus:border-[#242424] cursor-pointer"
              >
                <option value="INDOOR">INDOOR</option>
                <option value="OUTDOOR">OUTDOOR</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1.5">
                <Users size={12} /> Capacity
              </label>
              <select
                value={getSelectValue(formData.cap)}
                onChange={(e) =>
                  setFormData({ ...formData, cap: Number(e.target.value) })
                }
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold text-[#242424] bg-white outline-none focus:border-[#242424] cursor-pointer"
              >
                <option value={2}>1-2 คน</option>
                <option value={6}>3-6 คน</option>
                <option value={10}>7-10 คน</option>
              </select>
            </div>
          </div>

          <div className="border border-gray-200 bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
            <div>
              <h4 className="font-bold flex items-center gap-1.5 text-[#242424] text-sm">
                {formData.isOnline ? (
                  <Wifi size={16} className="text-green-500" />
                ) : (
                  <WifiOff size={16} className="text-red-500" />
                )}
                Online Reservable
              </h4>
              <p className="text-[10px] text-gray-400 font-medium mt-1">
                ปิดสวิตช์เมื่อต้องการสงวนโต๊ะนี้ให้ลูกค้า Walk-in
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={formData.isOnline}
                onChange={(e) =>
                  setFormData({ ...formData, isOnline: e.target.checked })
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#242424]"></div>
            </label>
          </div>

          {!isNew && (
            <div
              className={`border p-4 rounded-2xl flex flex-col items-start gap-3 mt-2 transition-colors ${canDelete ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-100"}`}
            >
              <div>
                <h4
                  className={`font-bold flex items-center gap-1.5 text-sm ${canDelete ? "text-[#e4002b]" : "text-gray-500"}`}
                >
                  <Trash2 size={16} /> ลบโต๊ะนี้ออกจากระบบถาวร
                </h4>
                {!canDelete && (
                  <p className="text-[10px] font-bold text-gray-400 mt-1">
                    *ไม่สามารถลบโต๊ะที่มีลูกค้าใช้งานอยู่ได้ โปรดเคลียร์โต๊ะก่อน
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => canDelete && onDelete(table.id)}
                disabled={!canDelete}
                className={`w-full text-xs font-bold py-2.5 px-6 rounded-lg transition-all ${
                  canDelete
                    ? "bg-white border-2 border-[#e4002b] text-[#e4002b] hover:bg-[#e4002b] hover:text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                }`}
              >
                DELETE TABLE
              </button>
            </div>
          )}
        </div>

        {/* 💡 แก้ไขคลาสตรงนี้ ใช้ w-1/3 กับ w-2/3 แทน flex-[1], flex-[2] */}
        <div className="bg-white p-5 border-t border-gray-100 flex gap-3 w-full">
          <button
            onClick={onClose}
            className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 rounded-xl transition-colors cursor-pointer text-sm"
          >
            CANCEL
          </button>
          <button
            onClick={() => onSave(formData)}
            className="w-2/3 bg-[#242424] hover:bg-[#e4002b] text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer text-sm tracking-widest uppercase shadow-md"
          >
            {isNew ? "CREATE TABLE" : "SAVE CONFIG"}
          </button>
        </div>
      </div>
    </div>
  );
}
