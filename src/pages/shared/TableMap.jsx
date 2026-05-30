// src/pages/shared/TableMap.jsx
import React, { useState, useEffect } from "react";
import TableMapHeader from "../../component/shared/TableMapHeader";
import TableControls from "../../component/shared/TableControls";
import FloorPlanView from "../../component/shared/FloorPlanView";
import TableListView from "../../component/shared/TableListView";
import TableActionModal from "../../component/shared/TableActionModal";
import TableConfigModal from "../../component/shared/TableConfigModal";
import VisualFloorPlan from "../../component/shared/VisualFloorPlan";
import Sidebar from "../../component/shared/SideBar";

export default function TableMap() {
  const [tables, setTables] = useState([
    {
      id: "T-01",
      zone: "INDOOR",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 12,
      y: 25,
    },
    {
      id: "T-02",
      zone: "INDOOR",
      cap: 4,
      status: "OCCUPIED",
      startTime: Date.now() - 1200000,
      x: 12,
      y: 45,
    },
    {
      id: "T-03",
      zone: "INDOOR",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 12,
      y: 65,
    },
    {
      id: "T-04",
      zone: "INDOOR",
      cap: 2,
      status: "BILL",
      startTime: Date.now() - 3600000,
      x: 25,
      y: 25,
    },
    {
      id: "T-05",
      zone: "INDOOR",
      cap: 6,
      status: "FREE",
      startTime: null,
      x: 25,
      y: 45,
    },
    {
      id: "T-06",
      zone: "INDOOR",
      cap: 4,
      status: "RESERVED",
      startTime: null,
      x: 25,
      y: 65,
    },
    {
      id: "T-07",
      zone: "INDOOR",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 12,
      y: 85,
    },
    {
      id: "T-08",
      zone: "INDOOR",
      cap: 2,
      status: "OCCUPIED",
      startTime: Date.now() - 600000,
      x: 25,
      y: 85,
    },
    {
      id: "T-09",
      zone: "INDOOR",
      cap: 8,
      status: "FREE",
      startTime: null,
      x: 38,
      y: 25,
    },
    {
      id: "T-10",
      zone: "INDOOR",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 38,
      y: 45,
    },
    {
      id: "T-11",
      zone: "INDOOR",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 38,
      y: 65,
    },
    {
      id: "T-12",
      zone: "INDOOR",
      cap: 8,
      status: "FREE",
      startTime: null,
      x: 38,
      y: 85,
    },

    // 👈 ขยับพิกัด X โซน Outdoor จาก 60 เป็น 68 ให้หลบเส้นแบ่ง
    {
      id: "T-13",
      zone: "OUTDOOR",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 68,
      y: 30,
    },
    {
      id: "T-14",
      zone: "OUTDOOR",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 78,
      y: 30,
    },
    {
      id: "T-15",
      zone: "OUTDOOR",
      cap: 4,
      status: "OCCUPIED",
      startTime: Date.now() - 1800000,
      x: 88,
      y: 30,
    },
    {
      id: "T-16",
      zone: "OUTDOOR",
      cap: 4,
      status: "FREE",
      startTime: null,
      x: 68,
      y: 60,
    },
    {
      id: "T-17",
      zone: "OUTDOOR",
      cap: 4,
      status: "BILL",
      startTime: Date.now() - 4000000,
      x: 78,
      y: 60,
    },
    {
      id: "T-18",
      zone: "OUTDOOR",
      cap: 6,
      status: "FREE",
      startTime: null,
      x: 88,
      y: 60,
    },
    {
      id: "T-19",
      zone: "OUTDOOR",
      cap: 2,
      status: "FREE",
      startTime: null,
      x: 68,
      y: 85,
    },
    {
      id: "T-20",
      zone: "OUTDOOR",
      cap: 4,
      status: "RESERVED",
      startTime: null,
      x: 82,
      y: 85,
    },
  ]);

  const [currentZone, setCurrentZone] = useState("ALL");
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [currentView, setCurrentView] = useState("floor");
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    tableId: null,
    mode: null,
  });
  const [, setTick] = useState(0);

  const statusLabel = {
    FREE: "ว่าง",
    OCCUPIED: "มีลูกค้า",
    BILL: "รอชำระเงิน",
    RESERVED: "จองแล้ว",
  };

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (
        window.innerWidth <= 768 &&
        (currentView === "floor" || currentView === "visual")
      ) {
        setCurrentView("list");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentView]);

  const formatTime = (startTime) => {
    if (!startTime) return "";
    const diff = Date.now() - startTime;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}:${secs < 10 ? "0" + secs : secs}m`;
  };

  const zoneTables =
    currentZone === "ALL"
      ? tables
      : tables.filter((t) => t.zone === currentZone);
  const filteredTables =
    currentFilter === "ALL"
      ? zoneTables
      : zoneTables.filter((t) => t.status === currentFilter);

  const freeCount = tables.filter((t) => t.status === "FREE").length;
  const occCount = tables.filter(
    (t) => t.status === "OCCUPIED" || t.status === "BILL",
  ).length;

  // 👈 ลอจิกเตรียมข้อมูลโต๊ะ (ถ้าเปิด Modal โต๊ะใหม่ ให้สร้างเทมเพลตเปล่าๆ ส่งไปแทน)
  const targetTable =
    modalState.tableId === "NEW"
      ? {
          id: "",
          zone: currentZone !== "ALL" ? currentZone : "INDOOR",
          cap: 2,
          status: "FREE",
        }
      : tables.find((t) => t.id === modalState.tableId);

  // 💾 เซฟข้อมูล (รองรับทั้งการ Edit โต๊ะเดิม และ สร้างโต๊ะใหม่)
  const handleSaveConfig = (updatedTable) => {
    if (modalState.tableId === "NEW") {
      // ดักชื่อโต๊ะซ้ำ
      if (tables.some((t) => t.id === updatedTable.id))
        return alert("รหัสโต๊ะนี้มีอยู่แล้วครับ!");
      // เพิ่มโต๊ะใหม่ (สุ่มเกิดตรงกลางจอให้แคชเชียร์ลากต่อเอง)
      setTables([...tables, { ...updatedTable, x: 50, y: 50 }]);
    } else {
      // อัปเดตโต๊ะเดิม
      setTables(
        tables.map((t) => {
          if (t.id === updatedTable.id) {
            const isNewOccupied =
              updatedTable.status === "OCCUPIED" && t.status !== "OCCUPIED";
            return {
              ...t,
              ...updatedTable,
              startTime: isNewOccupied
                ? Date.now()
                : updatedTable.status === "FREE"
                  ? null
                  : t.startTime,
            };
          }
          return t;
        }),
      );
    }
    setModalState({ isOpen: false, tableId: null, mode: null });
  };

  const handleDeleteTable = (id) => {
    const tableToDelete = tables.find((t) => t.id === id);
    if (tableToDelete.status !== "FREE")
      return alert("ไม่สามารถลบโต๊ะที่กำลังใช้งานได้ครับ!");
    if (window.confirm(`ลบโต๊ะ ${id} ?`))
      setTables(tables.filter((t) => t.id !== id));
  };

  const handleUpdatePosition = (id, newX, newY) => {
    setTables(
      tables.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t)),
    );
  };

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <TableMapHeader
          freeCount={freeCount}
          occCount={occCount}
          totalCount={tables.length}
        />

        <TableControls
          currentZone={currentZone}
          setZone={setCurrentZone}
          currentFilter={currentFilter}
          setFilter={setCurrentFilter}
          currentView={currentView}
          setView={setCurrentView}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          // 👈 ส่งฟังก์ชันกดเปิด Modal โต๊ะใหม่ (รหัส NEW) ไปที่แถบเครื่องมือ
          onAddTable={() =>
            setModalState({ isOpen: true, tableId: "NEW", mode: "CONFIG" })
          }
        />

        {currentView === "visual" ? (
          <VisualFloorPlan
            tables={filteredTables}
            isEditMode={isEditMode}
            onOpenModal={(id, mode) =>
              setModalState({ isOpen: true, tableId: id, mode: mode })
            }
            onUpdatePosition={handleUpdatePosition}
          />
        ) : currentView === "floor" ? (
          <FloorPlanView
            tables={filteredTables}
            isEditMode={isEditMode}
            onOpenModal={(id, mode) =>
              setModalState({ isOpen: true, tableId: id, mode: mode })
            }
            onDeleteTable={handleDeleteTable}
            formatTime={formatTime}
          />
        ) : (
          <TableListView
            tables={filteredTables}
            statusLabel={statusLabel}
            onOpenModal={(id) =>
              setModalState({ isOpen: true, tableId: id, mode: "ACTION" })
            }
            formatTime={formatTime}
          />
        )}

        {modalState.mode === "CONFIG" ? (
          <TableConfigModal
            isOpen={modalState.isOpen}
            onClose={() =>
              setModalState({ isOpen: false, tableId: null, mode: null })
            }
            table={targetTable}
            onSave={handleSaveConfig}
          />
        ) : (
          <TableActionModal
            isOpen={modalState.isOpen}
            onClose={() =>
              setModalState({ isOpen: false, tableId: null, mode: null })
            }
            table={targetTable}
            statusLabel={statusLabel}
            onUpdateStatus={(id, status) =>
              handleSaveConfig({ ...targetTable, status })
            }
          />
        )}
      </main>
    </div>
  );
}
