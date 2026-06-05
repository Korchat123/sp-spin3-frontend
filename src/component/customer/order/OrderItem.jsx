import React, { useState, useEffect } from "react";
import { Trash2, MessageSquare } from "lucide-react";

const getOrderItemId = (item) => item?.id || item?._id || item?.menu_id || item?.menuId;

const OrderItem = ({ item, onUpdateQty, onRemove, onEdit, isSelected, onUpdateNote }) => {
  const itemId = getOrderItemId(item);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(item.note || "");

  useEffect(() => {
    setTempNote(item.note || "");
  }, [item.note]);

  const handleSave = (e) => {
    e.stopPropagation();
    onUpdateNote(itemId, tempNote);
    setIsEditingNote(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setTempNote(item.note || "");
    setIsEditingNote(false);
  };

  return (
    <div
      className={`flex flex-col p-4 rounded-3xl transition-all duration-300 ease-in-out cursor-pointer mb-3
        ${isSelected 
          ? 'bg-[#FDE68A] border-2 border-[#242424] shadow-[4px_4px_0_#242424]' 
          : 'bg-[#ffffff] border-2 border-[#e5e7eb] hover:border-[#242424] hover:shadow-[4px_4px_0_#242424]'}`}
      onClick={() => onEdit(item)}
    >
      <div className="flex items-center justify-between gap-4 ">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-[24px] overflow-hidden bg-[#eeeeee] border-2 border-[#242424] shrink-0 flex items-center justify-center shadow-[2px_2px_0_#242424]">
            <img
              src={item.img || item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://placehold.co/100x100/eeeeee/242424?text=FOOD";
              }}
            />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-[#242424] text-base font-['IBM_Plex_Sans_Thai'] break-words leading-tight">
              {item.name}
            </h3>
            <p className="text-sm font-bold text-[#e4002b] font-['IBM_Plex_Sans_Thai'] mt-1">
              {item.price ? `${(item.price * item.quantity).toLocaleString()} THB` : "TBA"}
            </p>
            <span className="text-[10px] text-[#DC5F00] font-black uppercase tracking-wider mt-1 block">
              {item.size || 'REGULAR'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center bg-[#ffffff] rounded-xl border-2 border-[#242424] overflow-hidden shadow-[2px_2px_0_#242424]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onUpdateQty(itemId, -1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-[#eeeeee] text-[#242424] font-bold border-r-2 border-[#242424] cursor-pointer"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-[#242424] text-sm font-['Bebas_Neue']">{item.quantity}</span>
            <button
              onClick={() => onUpdateQty(itemId, 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-[#eeeeee] text-[#242424] font-bold border-l-2 border-[#242424] cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onRemove(itemId); }}
            className="p-2.5 bg-[#ffffff] border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors shrink-0 cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
        {!isEditingNote ? (
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={() => setIsEditingNote(true)}
              className="flex items-center gap-2 text-xs text-[#DC5F00] font-bold cursor-pointer hover:opacity-80 transition-opacity"
            >
              <MessageSquare size={14} className="shrink-0" />
              <span className="truncate max-w-[240px]">
                {item.note || 'เพิ่มคำขอพิเศษ (เช่น ไม่เผ็ด, แยกผัก)'}
              </span>
            </div>
            <button
              onClick={() => setIsEditingNote(true)}
              className="text-xs text-gray-400 hover:text-[#242424] hover:underline font-bold transition-all cursor-pointer"
            >
              แก้ไข
            </button>
          </div>
        ) : (
          <div className="space-y-2 w-full">
            <textarea
              rows={2}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="ใส่โน้ตสำหรับเมนูนี้ (เช่น ไม่เผ็ด, ขอซอสเพิ่ม)..."
              className="w-full bg-[#fcfcfc] text-xs font-semibold text-[#242424] border-2 border-[#242424] rounded-xl p-2.5 focus:outline-none focus:border-[#DC5F00] resize-none leading-relaxed font-['IBM_Plex_Sans_Thai'] shadow-[2px_2px_0_#242424]"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-3 py-1.5 bg-[#DC5F00] hover:bg-[#c25400] text-white rounded-lg text-[10px] font-black uppercase border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-none hover:translate-y-0.5 transition-all cursor-pointer"
              >
                บันทึก
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[10px] font-black uppercase border border-gray-300 cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItem;
