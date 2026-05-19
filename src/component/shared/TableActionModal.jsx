import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

const TableActionModal = ({
  isOpen,
  onClose,
  table,
  statusLabel,
  onUpdateStatus,
}) => {
  const navigate = useNavigate(); // 2. เรียกใช้งานฟังก์ชันสำหรับเปลี่ยนหน้า

  if (!isOpen || !table) return null;

  // ฟังก์ชันสำหรับไปหน้าคิดเงิน
  const handleGoToCheckout = () => {
    // ปิด Modal ก่อน
    onClose();
    // วาร์ปไปหน้า Checkout
    // (สามารถแนบ State ไปด้วยได้ เช่น บอกว่ามาจากโต๊ะไหน เพื่อให้หน้า Checkout รู้ว่าต้องดึงออเดอร์ไหนมาแสดง)
    navigate("/cashier/checkout", { state: { tableId: table.id } });
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-end md:items-center z-1000"
      onClick={onClose}
    >
      <div
        className="bg-[#242424] w-full max-w-[480px] md:max-w-[420px] p-8 md:p-10 rounded-t-xl md:rounded-lg text-white border-t-10 border-[#e4002b] animate-[slideUp_0.3s_ease-out] md:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-['Bebas_Neue'] text-5xl mb-1">TABLE {table.id}</h2>
        <p className="text-[#888888] mb-6">
          Capacity: {table.cap} Seats | Status: {statusLabel[table.status]}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {table.status === "FREE" && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, "OCCUPIED")}
                className="col-span-2 bg-[#e4002b] text-white p-4 font-bold text-sm uppercase rounded hover:bg-[#ff1a43]"
              >
                Open Table / Walk-in
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, "RESERVED")}
                className="col-span-2 bg-[#3a3a3a] text-white p-4 font-bold text-sm uppercase rounded hover:bg-[#4a4a4a]"
              >
                Reserve Table
              </button>
            </>
          )}

          {table.status === "RESERVED" && (
            <>
              <button
                onClick={() => onUpdateStatus(table.id, "OCCUPIED")}
                className="col-span-2 bg-[#e4002b] text-white p-4 font-bold text-sm uppercase rounded hover:bg-[#ff1a43]"
              >
                Check in / Seat Now
              </button>
              <button
                onClick={() => onUpdateStatus(table.id, "FREE")}
                className="col-span-2 border-2 border-[#555] text-[#888] p-4 font-bold text-sm uppercase rounded hover:bg-[#333]"
              >
                Cancel Reservation
              </button>
            </>
          )}

          {(table.status === "OCCUPIED" || table.status === "BILL") && (
            <>
              <button
                onClick={() => alert("Going to Order Screen...")}
                className="bg-[#e4002b] text-white p-4 font-bold text-sm uppercase rounded hover:bg-[#ff1a43]"
              >
                Add Order
              </button>

              {/* 3. ผูกฟังก์ชันเข้ากับปุ่ม Print Bill และ Confirm Payment */}
              <button
                onClick={handleGoToCheckout}
                className="bg-[#3a3a3a] text-white p-4 font-bold text-sm uppercase rounded hover:bg-[#4a4a4a]"
              >
                Print Bill
              </button>
              <button
                onClick={handleGoToCheckout}
                className="bg-[#28a745] text-white p-4 font-bold text-sm uppercase rounded hover:bg-[#218838]"
              >
                Confirm Payment
              </button>

              <button
                onClick={() => onUpdateStatus(table.id, "FREE")}
                className="border-2 border-[#555] text-[#888] p-4 font-bold text-sm uppercase rounded hover:bg-[#333]"
              >
                Void Table
              </button>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 border-2 border-[#555] text-[#888] p-4 font-bold text-sm uppercase rounded hover:bg-[#333] transition-colors"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};

export default TableActionModal;
