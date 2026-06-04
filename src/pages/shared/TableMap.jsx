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

const TIME_SLOTS = [
  "10:00 - 12:00",
  "13:00 - 15:00",
  "16:00 - 18:00",
  "19:00 - 20:00",
];

export default function TableMap() {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split("T")[0];

  // กำหนดขนาดโต๊ะตามกลุ่ม (T-01 ถึง T-06: 2 คน, T-07 ถึง T-12: 6 คน, T-13 ถึง T-20: 10 คน)
  const [tables, setTables] = useState([
    { id: "T-01", zone: "INDOOR", cap: 2, x: 12, y: 25, isOnline: true },
    { id: "T-02", zone: "INDOOR", cap: 2, x: 12, y: 45, isOnline: true },
    { id: "T-03", zone: "INDOOR", cap: 2, x: 12, y: 65, isOnline: true },
    { id: "T-04", zone: "INDOOR", cap: 2, x: 25, y: 25, isOnline: true },
    { id: "T-05", zone: "INDOOR", cap: 2, x: 25, y: 45, isOnline: false },
    { id: "T-06", zone: "INDOOR", cap: 2, x: 25, y: 65, isOnline: false },
    { id: "T-07", zone: "INDOOR", cap: 6, x: 12, y: 85, isOnline: false },
    { id: "T-08", zone: "INDOOR", cap: 6, x: 25, y: 85, isOnline: true },
    { id: "T-09", zone: "INDOOR", cap: 6, x: 38, y: 25, isOnline: true },
    { id: "T-10", zone: "INDOOR", cap: 6, x: 38, y: 45, isOnline: true },
    { id: "T-11", zone: "INDOOR", cap: 6, x: 38, y: 65, isOnline: false },
    { id: "T-12", zone: "INDOOR", cap: 6, x: 38, y: 85, isOnline: false },
    { id: "T-13", zone: "OUTDOOR", cap: 10, x: 68, y: 30, isOnline: true },
    { id: "T-14", zone: "OUTDOOR", cap: 10, x: 78, y: 30, isOnline: true },
    { id: "T-15", zone: "OUTDOOR", cap: 10, x: 88, y: 30, isOnline: true },
    { id: "T-16", zone: "OUTDOOR", cap: 10, x: 68, y: 60, isOnline: true },
    { id: "T-17", zone: "OUTDOOR", cap: 10, x: 78, y: 60, isOnline: false },
    { id: "T-18", zone: "OUTDOOR", cap: 10, x: 88, y: 60, isOnline: false },
    { id: "T-19", zone: "OUTDOOR", cap: 10, x: 68, y: 85, isOnline: true },
    { id: "T-20", zone: "OUTDOOR", cap: 10, x: 82, y: 85, isOnline: true },
  ]);

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 - 12:00");

  const [reservations, setReservations] = useState([
    {
      id: "RES-0001",
      tableId: "T-06",
      date: todayStr,
      timeSlot: "16:00 - 18:00",
      name: "คุณสมศักดิ์",
      phone: "081-111-2222",
      pax: 2,
      status: "RESERVED",
    },
    {
      id: "RES-0002",
      tableId: "T-20",
      date: todayStr,
      timeSlot: "19:00 - 20:00",
      name: "คุณวิภา",
      phone: "082-222-3333",
      pax: 8,
      status: "RESERVED",
    },
    {
      id: "RES-0003",
      tableId: "T-02",
      date: todayStr,
      timeSlot: "10:00 - 12:00",
      name: "K. Anan",
      phone: "083-333-4444",
      pax: 2,
      status: "OCCUPIED",
      startTime: Date.now() - 1200000,
    },
    {
      id: "RES-0004",
      tableId: "T-04",
      date: todayStr,
      timeSlot: "10:00 - 12:00",
      name: "K. Somsri",
      phone: "084-444-5555",
      pax: 1,
      status: "OCCUPIED",
      startTime: Date.now() - 7500000,
    },
    {
      id: "RES-0005",
      tableId: "T-15",
      date: todayStr,
      timeSlot: "10:00 - 12:00",
      name: "Walk-in Guest",
      phone: "",
      pax: 8,
      status: "OCCUPIED",
      startTime: Date.now() - 1800000,
    },
    {
      id: "RES-0006",
      tableId: "T-17",
      date: todayStr,
      timeSlot: "10:00 - 12:00",
      name: "Walk-in Guest",
      phone: "",
      pax: 9,
      status: "OCCUPIED",
      startTime: Date.now() - 4000000,
    },
  ]);

  const [pendingBookings, setPendingBookings] = useState([
    {
      id: "RES-0092",
      name: "K. Somchai",
      pax: 4,
      date: todayStr,
      timeSlot: "13:00 - 15:00",
    },
    {
      id: "RES-0105",
      name: "K. Anne",
      pax: 2,
      date: todayStr,
      timeSlot: "19:00 - 20:00",
    },
  ]);

  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [currentView, setCurrentView] = useState("floor");
  const [isEditMode, setIsEditMode] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    tableId: null,
    mode: null,
  });
  const [, setTick] = useState(0);
  const [billData, setBillData] = useState(null);

  const statusLabel = {
    FREE: "Free",
    OCCUPIED: "Occupied",
    RESERVED: "Reserved",
  };

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
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
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const isOverstay = (startTime) => {
    if (!startTime) return false;
    return Date.now() - startTime > 120 * 60000;
  };

  // ดึงค่าสถานะโต๊ะตามช่วงเวลา (Dynamic mapping)
  const mappedTables = tables.map((t) => {
    const res = reservations.find(
      (r) =>
        r.tableId === t.id &&
        r.date === selectedDate &&
        r.timeSlot === selectedTimeSlot,
    );
    return {
      ...t,
      status: res ? res.status : "FREE",
      startTime: res ? res.startTime : null,
      reservationName: res ? res.name : "",
      reservationPhone: res ? res.phone : "",
      reservationPax: res ? res.pax : 0,
      reservationId: res ? res.id : "",
    };
  });

  const filteredTables =
    currentFilter === "ALL"
      ? mappedTables
      : mappedTables.filter((t) => {
          if (currentFilter === "OVERSTAY")
            return t.status === "OCCUPIED" && isOverstay(t.startTime);
          return t.status === currentFilter;
        });

  const tableCounts = {
    total: mappedTables.length,
    free: mappedTables.filter((t) => t.status === "FREE").length,
    occ: mappedTables.filter((t) => t.status === "OCCUPIED").length,
    res: mappedTables.filter((t) => t.status === "RESERVED").length,
    over: mappedTables.filter(
      (t) => t.status === "OCCUPIED" && isOverstay(t.startTime),
    ).length,
  };

  const targetTable =
    modalState.tableId === "NEW"
      ? { id: "", zone: "INDOOR", cap: 2, status: "FREE", isOnline: true }
      : mappedTables.find((t) => t.id === modalState.tableId);

  // แก้ไข handleSaveConfig รองรับ Status Override (FREE / OCCUPIED / RESERVED) ทางลัดโดยไม่ต้องเปิด Modal Action
  const handleSaveConfig = (updatedTable) => {
    let finalTableId = updatedTable.id;

    if (modalState.tableId === "NEW") {
      if (tables.some((t) => t.id === updatedTable.id))
        return alert("รหัสโต๊ะนี้มีอยู่แล้วครับ!");
      setTables([
        ...tables,
        {
          id: updatedTable.id,
          zone: updatedTable.zone,
          cap: updatedTable.cap,
          isOnline: updatedTable.isOnline,
          x: 50,
          y: 50,
        },
      ]);
    } else {
      setTables(
        tables.map((t) =>
          t.id === updatedTable.id
            ? {
                ...t,
                zone: updatedTable.zone,
                cap: updatedTable.cap,
                isOnline: updatedTable.isOnline,
              }
            : t,
        ),
      );
    }

    // จัดการ Status Override (อัปเดตหรือถอด Reservation ออก)
    const targetStatus = updatedTable.status;
    const existingResIndex = reservations.findIndex(
      (r) =>
        r.tableId === finalTableId &&
        r.date === selectedDate &&
        r.timeSlot === selectedTimeSlot,
    );

    if (targetStatus === "FREE") {
      if (existingResIndex > -1) {
        // ถอนการจองเพื่อให้โต๊ะเป็นสีขาว (FREE)
        setReservations((prev) =>
          prev.filter((_, i) => i !== existingResIndex),
        );
      }
    } else {
      if (existingResIndex > -1) {
        // อัปเดตข้อมูลสถานะใน record เดิม
        setReservations((prev) =>
          prev.map((r, i) =>
            i === existingResIndex
              ? {
                  ...r,
                  status: targetStatus,
                  startTime:
                    targetStatus === "OCCUPIED" && !r.startTime
                      ? Date.now()
                      : r.startTime,
                }
              : r,
          ),
        );
      } else {
        // สร้าง record จองลัดขึ้นมาใหม่ เพื่อล็อกสถานะ
        const newRes = {
          id: `OVERRIDE-${Math.floor(100 + Math.random() * 900)}`,
          tableId: finalTableId,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          name:
            targetStatus === "OCCUPIED"
              ? "Quick Walk-in"
              : "Manual Reservation",
          phone: "",
          pax: updatedTable.cap,
          status: targetStatus,
          startTime: targetStatus === "OCCUPIED" ? Date.now() : null,
        };
        setReservations((prev) => [...prev, newRes]);
      }
    }

    setModalState({ isOpen: false, tableId: null, mode: null });
  };

  const handleDeleteTable = (id) => {
    const tableToDelete = mappedTables.find((t) => t.id === id);
    if (tableToDelete && tableToDelete.status !== "FREE") {
      return alert("ไม่สามารถลบโต๊ะที่กำลังใช้งานได้ครับ ต้องเคลียร์โต๊ะก่อน!");
    }

    if (window.confirm(`ยืนยันการลบโต๊ะ ${id} ออกจากระบบ?`)) {
      setTables(tables.filter((t) => t.id !== id));
      setModalState({ isOpen: false, tableId: null, mode: null });
    }
  };

  const handleUpdatePosition = (id, newX, newY) => {
    setTables(
      tables.map((t) => (t.id === id ? { ...t, x: newX, y: newY } : t)),
    );
  };

  // จำลองจองออนไลน์ที่จะทำงานเมื่อ DEV เท่านั้น
  const handleTriggerMockBooking = () => {
    const mockCustomerNames = [
      "K. Thanawat",
      "K. Abhisit",
      "K. Manee",
      "K. Priti",
      "K. Pakorn",
    ];
    const mockPaxRanges = [2, 6, 10];

    const randomName =
      mockCustomerNames[Math.floor(Math.random() * mockCustomerNames.length)];
    const randomPaxRange =
      mockPaxRanges[Math.floor(Math.random() * mockPaxRanges.length)];
    const resId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const busyTableIds = reservations
      .filter((r) => r.date === selectedDate && r.timeSlot === selectedTimeSlot)
      .map((r) => r.tableId);

    const availableTable = tables.find(
      (t) =>
        t.cap === randomPaxRange && t.isOnline && !busyTableIds.includes(t.id),
    );

    if (availableTable) {
      const actualPax = randomPaxRange === 2 ? 2 : randomPaxRange === 6 ? 4 : 8;
      const newRes = {
        id: resId,
        tableId: availableTable.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        name: randomName,
        phone: "089-999-9999",
        pax: actualPax,
        status: "RESERVED",
      };
      setReservations((prev) => [...prev, newRes]);
    } else {
      const pendingRes = {
        id: resId,
        name: randomName,
        pax: randomPaxRange === 2 ? 2 : randomPaxRange === 6 ? 4 : 8,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
      };
      setPendingBookings((prev) => [...prev, pendingRes]);
    }
  };

  const handleActionTable = (id, action, data) => {
    if (action === "CLEAR") {
      setReservations((prev) =>
        prev.filter(
          (r) =>
            !(
              r.tableId === id &&
              r.date === selectedDate &&
              r.timeSlot === selectedTimeSlot
            ),
        ),
      );
    } else if (action === "TOGGLE_ONLINE") {
      setTables((prev) =>
        prev.map((t) => (t.id === id ? { ...t, isOnline: !t.isOnline } : t)),
      );
    } else if (action === "LINK_RESERVE") {
      const booking = pendingBookings.find((b) => b.id === data);
      if (booking) {
        const newRes = {
          id: booking.id,
          tableId: id,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          name: booking.name,
          phone: "",
          pax: booking.pax,
          status: "RESERVED",
        };
        setReservations((prev) => [...prev, newRes]);
        setPendingBookings((prev) => prev.filter((b) => b.id !== data));
      }
    } else if (action === "MANUAL_RESERVE") {
      const newRes = {
        id: `RES-M${Math.floor(100 + Math.random() * 900)}`,
        tableId: id,
        date: data.date,
        timeSlot: data.timeSlot,
        name: data.name,
        phone: data.phone,
        pax: data.pax,
        status: "RESERVED",
      };
      setReservations((prev) => [...prev, newRes]);
    } else if (action === "CHECK_IN") {
      setReservations((prev) =>
        prev.map((r) =>
          r.tableId === id &&
          r.date === selectedDate &&
          r.timeSlot === selectedTimeSlot
            ? { ...r, status: "OCCUPIED", startTime: Date.now() }
            : r,
        ),
      );
    } else if (action === "NEW_ORDER") {
      const walkInRes = {
        id: `WALK-${Math.floor(100 + Math.random() * 900)}`,
        tableId: id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        name: "Walk-in Guest",
        phone: "",
        pax: targetTable.cap === 2 ? 2 : targetTable.cap === 6 ? 4 : 8,
        status: "OCCUPIED",
        startTime: Date.now(),
      };
      setReservations((prev) => [...prev, walkInRes]);
      navigate("/cashier/menu", { state: { tableId: id, type: "DINE-IN" } });
    } else if (action === "ADD_ORDER") {
      navigate("/cashier/menu", { state: { tableId: id, type: "DINE-IN" } });
    } else if (action === "CHECKOUT") {
      navigate("/cashier/checkout", { state: { tableId: id } });
    } else if (action === "VIEW_BILL") {
      setBillData({
        orderId: `ORD-${id}-8829`,
        type: "DINE-IN",
        status: "pending",
        customer: `Customer @ ${id}`,
        items: [
          { name: "Serious Fried Chicken Set (L)", qty: 1, price: 299 },
          { name: "French Fries", qty: 1, price: 79 },
          { name: "Coke (Refill)", qty: 2, price: 49 },
        ],
        totalAmount: 476,
        raw: { table: id },
      });
    }

    setModalState({ isOpen: false, tableId: null, mode: null });
  };

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-sans text-[#242424]">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <TableMapHeader onTriggerMockBooking={handleTriggerMockBooking} />

        <TableControls
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTimeSlot={selectedTimeSlot}
          setSelectedTimeSlot={setSelectedTimeSlot}
          timeSlots={TIME_SLOTS}
          currentFilter={currentFilter}
          setFilter={setCurrentFilter}
          currentView={currentView}
          setView={setCurrentView}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          onAddTable={() =>
            setModalState({ isOpen: true, tableId: "NEW", mode: "CONFIG" })
          }
          counts={tableCounts}
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
            formatTime={formatTime}
            isOverstay={isOverstay}
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

        {modalState.mode === "CONFIG" && (
          <TableConfigModal
            isOpen={modalState.isOpen}
            onClose={() =>
              setModalState({ isOpen: false, tableId: null, mode: null })
            }
            table={targetTable}
            onSave={handleSaveConfig}
            onDelete={handleDeleteTable}
          />
        )}

        {modalState.mode === "ACTION" && (
          <TableActionModal
            isOpen={modalState.isOpen}
            onClose={() =>
              setModalState({ isOpen: false, tableId: null, mode: null })
            }
            table={targetTable}
            onAction={handleActionTable}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            allReservations={reservations}
            pendingBookings={pendingBookings}
            timeSlots={TIME_SLOTS}
          />
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
