import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import TableMapHeader from "../../component/shared/TableMapHeader";
import TableControls from "../../component/shared/TableControls";
import FloorPlanView from "../../component/shared/FloorPlanView";
import TableListView from "../../component/shared/TableListView";
import TableActionModal from "../../component/shared/TableActionModal";
import TableConfigModal from "../../component/shared/TableConfigModal";
import VisualFloorPlan from "../../component/shared/VisualFloorPlan";
import Sidebar from "../../component/shared/SideBar";
import OrderDetailModal from "../../component/cashier/OrderDetailModal"; 

export default function TableMap() {
  const navigate = useNavigate();

  const [tables, setTables] = useState([
    { id: "T-01", zone: "INDOOR", cap: 2, status: "FREE", startTime: null, x: 12, y: 25, isOnline: true },
    { id: "T-02", zone: "INDOOR", cap: 4, status: "OCCUPIED", startTime: Date.now() - 1200000, x: 12, y: 45, isOnline: true },
    { id: "T-03", zone: "INDOOR", cap: 4, status: "FREE", startTime: null, x: 12, y: 65, isOnline: false }, 
    { id: "T-04", zone: "INDOOR", cap: 2, status: "OCCUPIED", startTime: Date.now() - 7500000, x: 25, y: 25, isOnline: true }, 
    { id: "T-05", zone: "INDOOR", cap: 6, status: "FREE", startTime: null, x: 25, y: 45, isOnline: true },
    { id: "T-06", zone: "INDOOR", cap: 4, status: "RESERVED", startTime: null, x: 25, y: 65, isOnline: true },
    { id: "T-07", zone: "INDOOR", cap: 4, status: "FREE", startTime: null, x: 12, y: 85, isOnline: false }, 
    { id: "T-08", zone: "INDOOR", cap: 2, status: "OCCUPIED", startTime: Date.now() - 600000, x: 25, y: 85, isOnline: true },
    { id: "T-09", zone: "INDOOR", cap: 8, status: "FREE", startTime: null, x: 38, y: 25, isOnline: true },
    { id: "T-10", zone: "INDOOR", cap: 4, status: "FREE", startTime: null, x: 38, y: 45, isOnline: true },
    { id: "T-11", zone: "INDOOR", cap: 4, status: "FREE", startTime: null, x: 38, y: 65, isOnline: true },
    { id: "T-12", zone: "INDOOR", cap: 8, status: "FREE", startTime: null, x: 38, y: 85, isOnline: true },
    { id: "T-13", zone: "OUTDOOR", cap: 2, status: "FREE", startTime: null, x: 68, y: 30, isOnline: true },
    { id: "T-14", zone: "OUTDOOR", cap: 2, status: "FREE", startTime: null, x: 78, y: 30, isOnline: true },
    { id: "T-15", zone: "OUTDOOR", cap: 4, status: "OCCUPIED", startTime: Date.now() - 1800000, x: 88, y: 30, isOnline: true },
    { id: "T-16", zone: "OUTDOOR", cap: 4, status: "FREE", startTime: null, x: 68, y: 60, isOnline: true },
    { id: "T-17", zone: "OUTDOOR", cap: 4, status: "OCCUPIED", startTime: Date.now() - 4000000, x: 78, y: 60, isOnline: false }, 
    { id: "T-18", zone: "OUTDOOR", cap: 6, status: "FREE", startTime: null, x: 88, y: 60, isOnline: true },
    { id: "T-19", zone: "OUTDOOR", cap: 2, status: "FREE", startTime: null, x: 68, y: 85, isOnline: true },
    { id: "T-20", zone: "OUTDOOR", cap: 4, status: "RESERVED", startTime: null, x: 82, y: 85, isOnline: true },
  ]);

  const [currentZone, setCurrentZone] = useState("ALL");
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [currentView, setCurrentView] = useState("floor");
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, tableId: null, mode: null });
  const [, setTick] = useState(0);

  const [billData, setBillData] = useState(null);

  const statusLabel = { FREE: "ว่าง", OCCUPIED: "มีลูกค้า", RESERVED: "จองแล้ว" };

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && (currentView === "floor" || currentView === "visual")) {
        setCurrentView("list");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentView]);

  const formatTime = (startTime) => {
    if (!startTime) return "";
    const diff = Date.now() - startTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const isOverstay = (startTime) => {
    if (!startTime) return false;
    return (Date.now() - startTime) > (120 * 60000); 
  };

  const zoneTables = currentZone === "ALL" ? tables : tables.filter((t) => t.zone === currentZone);
  
  const filteredTables = currentFilter === "ALL" 
    ? zoneTables 
    : zoneTables.filter((t) => {
        if(currentFilter === 'OVERSTAY') return t.status === 'OCCUPIED' && isOverstay(t.startTime);
        return t.status === currentFilter;
    });

  const tableCounts = {
    total: zoneTables.length,
    free: zoneTables.filter(t => t.status === "FREE").length,
    occ: zoneTables.filter(t => t.status === "OCCUPIED").length,
    res: zoneTables.filter(t => t.status === "RESERVED").length,
    over: zoneTables.filter(t => t.status === "OCCUPIED" && isOverstay(t.startTime)).length,
  };

  const targetTable = modalState.tableId === "NEW"
      ? { id: "", zone: currentZone !== "ALL" ? currentZone : "INDOOR", cap: 2, status: "FREE", isOnline: true }
      : tables.find((t) => t.id === modalState.tableId);

  const handleSaveConfig = (updatedTable) => {
    if (modalState.tableId === "NEW") {
      if (tables.some((t) => t.id === updatedTable.id)) return alert("รหัสโต๊ะนี้มีอยู่แล้วครับ!");
      setTables([...tables, { ...updatedTable, x: 50, y: 50 }]);
    } else {
      setTables(tables.map((t) => (t.id === updatedTable.id ? { ...t, ...updatedTable } : t)));
    }
    setModalState({ isOpen: false, tableId: null, mode: null });
  };

  const handleDeleteTable = (id) => {
    const tableToDelete = tables.find((t) => t.id === id);
    if (tableToDelete && tableToDelete.status !== "FREE") {
       return alert("ไม่สามารถลบโต๊ะที่กำลังใช้งานได้ครับ ต้องเคลียร์โต๊ะให้ว่างก่อน!");
    }

    if (window.confirm(`ยืนยันการลบโต๊ะ ${id} ออกจากระบบถาวร?`)) {
       setTables(tables.filter((t) => t.id !== id));
       setModalState({ isOpen: false, tableId: null, mode: null });
    }
  };

  const handleUpdatePosition = (id, newX, newY) => {
    setTables(tables.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t)));
  };

  const handleActionTable = (id, action, data) => {
     // 💡 เพิ่มตรงนี้ให้ Linter สบายใจ และบอก Backend ให้รู้ว่าข้อมูลถูกส่งมานะ
     if (data) {
        console.log(`[API เตรียมส่งต่อ]: แอดออเดอร์/รหัสจอง -> ${data}`);
     }

     if (action === 'CLEAR') {
        setTables(tables.map(t => t.id === id ? { ...t, status: "FREE", startTime: null } : t));
     } 
     else if (action === 'RESERVE' || action === 'MANUAL_RESERVE' || action === 'LINK_RESERVE') {
        setTables(tables.map(t => t.id === id ? { ...t, status: "RESERVED" } : t));
     }
     else if (action === 'CHECK_IN') {
        setTables(tables.map(t => t.id === id ? { ...t, status: "OCCUPIED", startTime: Date.now() } : t));
     }
     else if (action === 'NEW_ORDER' || action === 'ADD_ORDER') {
        navigate('/cashier/menu', { state: { tableId: id, type: 'DINE-IN' } });
     }
     else if (action === 'CHECKOUT') {
        navigate('/cashier/checkout', { state: { tableId: id } });
     }
     else if (action === 'VIEW_BILL') {
        setBillData({
           orderId: `ORD-${id}-8829`,
           type: 'DINE-IN',
           status: 'pending',
           customer: `Customer @ ${id}`,
           items: [
              { name: "Serious Fried Chicken Set (L)", qty: 1, price: 299 },
              { name: "French Fries", qty: 1, price: 79 },
              { name: "Coke (Refill)", qty: 2, price: 49 }
           ],
           totalAmount: 476,
           raw: { table: id }
        });
     }
     
     setModalState({ isOpen: false, tableId: null, mode: null });
  }

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <TableMapHeader overstayCount={tableCounts.over} />
        
        <TableControls
          currentZone={currentZone} setZone={setCurrentZone}
          currentFilter={currentFilter} setFilter={setCurrentFilter}
          currentView={currentView} setView={setCurrentView}
          isEditMode={isEditMode} setIsEditMode={setIsEditMode}
          onAddTable={() => setModalState({ isOpen: true, tableId: "NEW", mode: "CONFIG" })}
          counts={tableCounts}
        />

        {currentView === "visual" ? (
          <VisualFloorPlan tables={filteredTables} isEditMode={isEditMode} onOpenModal={(id, mode) => setModalState({ isOpen: true, tableId: id, mode: mode })} onUpdatePosition={handleUpdatePosition} />
        ) : currentView === "floor" ? (
          <FloorPlanView tables={filteredTables} isEditMode={isEditMode} onOpenModal={(id, mode) => setModalState({ isOpen: true, tableId: id, mode: mode })} formatTime={formatTime} isOverstay={isOverstay} />
        ) : (
          <TableListView tables={filteredTables} statusLabel={statusLabel} onOpenModal={(id) => setModalState({ isOpen: true, tableId: id, mode: "ACTION" })} formatTime={formatTime} />
        )}

        {modalState.mode === "CONFIG" && (
          <TableConfigModal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, tableId: null, mode: null })} table={targetTable} onSave={handleSaveConfig} onDelete={handleDeleteTable} />
        )}
        
        {modalState.mode === "ACTION" && (
          <TableActionModal isOpen={modalState.isOpen} onClose={() => setModalState({ isOpen: false, tableId: null, mode: null })} table={targetTable} onAction={handleActionTable} />
        )}

        <OrderDetailModal 
          isOpen={!!billData} 
          onClose={() => setBillData(null)} 
          order={billData} 
        />
      </main>
    </div>
  );
}