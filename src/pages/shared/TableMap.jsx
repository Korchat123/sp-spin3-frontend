import React, { useState, useEffect } from "react";
import TableMapHeader from "../../component/shared/TableMapHeader";
import TableControls from "../../component/shared/TableControls";
import FloorPlanView from "../../component/shared/FloorPlanView";
import TableListView from "../../component/shared/TableListView";
import TableActionModal from "../../component/shared/TableActionModal";
import Sidebar from "../../component/shared/SideBar";

const TableMap = () => {
  // 1. Data State (จำลองข้อมูลโต๊ะ)
  const [tables, setTables] = useState([
    {
      id: "T-01",
      shape: "square",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 8,
      y: 12,
    },
    {
      id: "T-02",
      shape: "square",
      cap: 4,
      status: "OCCUPIED",
      startTime: Date.now() - 1200000,
      x: 8,
      y: 38,
    },
    {
      id: "T-03",
      shape: "square",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 8,
      y: 64,
    },
    {
      id: "T-04",
      shape: "square",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 28,
      y: 38,
    },
    {
      id: "VIP-1",
      shape: "long",
      cap: 8,
      status: "BILL",
      startTime: Date.now() - 3600000,
      x: 42,
      y: 12,
    },
    {
      id: "T-05",
      shape: "long",
      cap: 6,
      status: "FREE",
      startTime: null,
      x: 42,
      y: 64,
    },
    {
      id: "B-01",
      shape: "circle",
      cap: 2,
      status: "OCCUPIED",
      startTime: Date.now() - 500000,
      x: 72,
      y: 18,
    },
    {
      id: "B-02",
      shape: "circle",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 84,
      y: 35,
    },
    {
      id: "B-03",
      shape: "circle",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 72,
      y: 52,
    },
    {
      id: "B-04",
      shape: "circle",
      cap: 2,
      status: "OCCUPIED",
      startTime: Date.now() - 100000,
      x: 84,
      y: 69,
    },
  ]);

  // 2. UI State
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [currentView, setCurrentView] = useState(
    window.innerWidth <= 768 ? "list" : "floor",
  );
  const [modalState, setModalState] = useState({
    isOpen: false,
    tableId: null,
  });
  const [, setTick] = useState(0); // สำหรับให้เวลาเดิน

  // คำแปลต่างๆ
  const statusLabel = {
    FREE: "ว่าง",
    OCCUPIED: "มีลูกค้า",
    BILL: "รอชำระ",
    RESERVED: "จอง",
  };
  const shapeLabel = {
    long: "โต๊ะยาว",
    circle: "โต๊ะกลม",
    square: "โต๊ะสี่เหลี่ยม",
  };

  // ทำให้เวลาเดินทุก 1 วินาที
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Responsive: ปรับมุมมองอัตโนมัติเมื่อจอเล็ก
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && currentView === "floor")
        setCurrentView("list");
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentView]);

  // ฟังก์ชันคำนวณเวลา (เอาเวลาปัจจุบัน - เวลาที่เริ่มเปิดโต๊ะ)
  const formatTime = (startTime) => {
    if (!startTime) return "";
    const diff = Date.now() - startTime;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" + secs : secs}m`;
  };

  // จัดการข้อมูลก่อนส่งไปแสดงผล
  const filteredTables =
    currentFilter === "ALL"
      ? tables
      : tables.filter((t) => t.status === currentFilter);
  const freeCount = tables.filter((t) => t.status === "FREE").length;
  const occCount = tables.filter((t) => t.status !== "FREE").length;
  const selectedTable = tables.find((t) => t.id === modalState.tableId);

  // ฟังก์ชันอัพเดทสถานะโต๊ะ
  const handleUpdateStatus = (id, newStatus) => {
    setTables(
      tables.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: newStatus,
            startTime:
              newStatus === "OCCUPIED"
                ? Date.now()
                : newStatus === "FREE"
                  ? null
                  : t.startTime,
          };
        }
        return t;
      }),
    );
    setModalState({ isOpen: false, tableId: null }); // ปิด Modal
  };

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai']">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <TableMapHeader freeCount={freeCount} occCount={occCount} />

        <TableControls
          currentFilter={currentFilter}
          setFilter={setCurrentFilter}
          currentView={currentView}
          setView={setCurrentView}
        />

        {currentView === "floor" ? (
          <FloorPlanView
            tables={filteredTables}
            onOpenModal={(id) => setModalState({ isOpen: true, tableId: id })}
            formatTime={formatTime}
          />
        ) : (
          <TableListView
            tables={filteredTables}
            statusLabel={statusLabel}
            shapeLabel={shapeLabel}
            onOpenModal={(id) => setModalState({ isOpen: true, tableId: id })}
            formatTime={formatTime}
          />
        )}

        <TableActionModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, tableId: null })}
          table={selectedTable}
          statusLabel={statusLabel}
          onUpdateStatus={handleUpdateStatus}
        />
      </main>
    </div>
  );
};

export default TableMap;
