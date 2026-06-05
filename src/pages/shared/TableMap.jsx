import React, { useEffect, useMemo, useState } from "react";
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
import { orderService } from "../../services/orderService";
import { tableService } from "../../services/tableService";
import { toCashierOrder } from "../../utils/cashierOrders";
import { getSocketUrl } from "../../utils/realtime";

const TIME_SLOTS = [
  "10:00 - 12:00",
  "13:00 - 15:00",
  "16:00 - 18:00",
  "19:00 - 21:00",
];

const normalizeSlot = (value = "") => String(value).replace(/\s+/g, "");
const getTodayValue = () => new Date().toISOString().split("T")[0];

const isReservationOrder = (order) => {
  const noteMode = String(order?.customer?.note || "").split("|")[0];
  const status = String(order?.status || "").toLowerCase();
  return (
    noteMode === "reserve" ||
    status === "reserved" ||
    status === "checked-in" ||
    status === "received"
  );
};

const toTableStatus = (status) => {
  if (status === "Eating" || status === "Payment") return "OCCUPIED";
  if (status === "Cooking") return "RESERVED";
  return "FREE";
};

const toApiTableStatus = (status) => {
  if (status === "OCCUPIED") return "Eating";
  if (status === "RESERVED") return "Cooking";
  return "Available";
};

const getTableDisplayId = (table) => {
  if (table?.table_Id) return table.table_Id;
  if (table?.number) return `T-${String(table.number).padStart(2, "0")}`;
  return table?.id || "";
};

const toTableView = (table) => ({
  backendId: table.id,
  id: getTableDisplayId(table),
  zone: String(table.area || "INDOOR").toUpperCase(),
  cap: table.seats || 2,
  x: table.x ?? 50,
  y: table.y ?? 50,
  isOnline: table.onlineReservable !== false,
  baseStatus: toTableStatus(table.status),
});

const getOrderPax = (order) => {
  if (order?.reservationPax) return order.reservationPax;
  const total = order?.payment?.amount || order?.totalAmount || 0;
  if (total >= 2500) return 10;
  if (total >= 1200) return 6;
  return 2;
};

const getReservationStatus = (order) => {
  const status = String(order?.status || "").toLowerCase();
  if (["checked-in", "preparing", "finished", "received"].includes(status)) {
    return "OCCUPIED";
  }
  return "RESERVED";
};

const toReservation = (order) => ({
  id: order.orderId || `#${String(order._id).slice(-6).toUpperCase()}`,
  backendId: order._id,
  tableId: order.tableId || "",
  date: order.bookingDate || getTodayValue(),
  timeSlot: TIME_SLOTS.find((slot) => normalizeSlot(slot) === normalizeSlot(order.bookingTime)) || order.bookingTime || TIME_SLOTS[0],
  name: order.customer?.name || order.customer?.username || "Reservation Guest",
  phone: order.customer?.contact || "",
  pax: getOrderPax(order),
  status: getReservationStatus(order),
  startTime: getReservationStatus(order) === "OCCUPIED" ? new Date(order.createdAt).getTime() : null,
  raw: order,
});

export default function TableMap() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayValue());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[0]);
  const [currentFilter, setCurrentFilter] = useState("ALL");
  const [currentView, setCurrentView] = useState("floor");
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    tableId: null,
    mode: null,
  });
  const [, setTick] = useState(0);
  const [billData, setBillData] = useState(null);

  const fetchTableMap = async () => {
    try {
      const [tableData, orderData] = await Promise.all([
        tableService.getTables(),
        orderService.getOrders(),
      ]);
      setTables(tableData.map(toTableView));
      setOrders(orderData.filter(isReservationOrder));
      setStatusMessage("");
    } catch (error) {
      console.error("Failed to load table map:", error);
      setStatusMessage("Unable to load table map from the database.");
      setTables([]);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchTableMap();

    let socket;
    try {
      socket = new WebSocket(getSocketUrl("/ws/tables-orders"));
      
      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "snapshot" || payload.type === "update") {
            if (payload.tables) setTables(payload.tables);
            if (payload.orders) setOrders(payload.orders.filter(isReservationOrder));
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
        }
      };
    } catch (err) {
      console.error("WebSocket connection failed:", err);
    }

    const interval = setInterval(fetchTableMap, 30000);
    return () => {
      if (socket) socket.close();
      clearInterval(interval);
    };
  }, []);

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

  const reservations = useMemo(() => orders.map(toReservation), [orders]);
  const reservationsForSlot = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.date === selectedDate &&
          normalizeSlot(reservation.timeSlot) === normalizeSlot(selectedTimeSlot),
      ),
    [reservations, selectedDate, selectedTimeSlot],
  );

  const pendingBookings = reservationsForSlot.filter(
    (reservation) => !reservation.tableId,
  );

  const mappedTables = useMemo(
    () =>
      tables.map((table) => {
        const reservation = reservationsForSlot.find(
          (item) => item.tableId === table.id,
        );
        return {
          ...table,
          status: reservation ? reservation.status : table.baseStatus,
          startTime: reservation?.startTime || null,
          reservationName: reservation?.name || "",
          reservationPhone: reservation?.phone || "",
          reservationPax: reservation?.pax || 0,
          reservationId: reservation?.id || "",
          reservationBackendId: reservation?.backendId || "",
        };
      }),
    [reservationsForSlot, tables],
  );

  const formatTime = (startTime) => {
    if (!startTime) return "";
    const diff = Date.now() - startTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const isOverstay = (startTime) =>
    Boolean(startTime && Date.now() - startTime > 120 * 60000);

  const filteredTables =
    currentFilter === "ALL"
      ? mappedTables
      : mappedTables.filter((table) => {
          if (currentFilter === "OVERSTAY") {
            return table.status === "OCCUPIED" && isOverstay(table.startTime);
          }
          return table.status === currentFilter;
        });

  const tableCounts = {
    total: mappedTables.length,
    free: mappedTables.filter((table) => table.status === "FREE").length,
    occ: mappedTables.filter((table) => table.status === "OCCUPIED").length,
    res: mappedTables.filter((table) => table.status === "RESERVED").length,
    over: mappedTables.filter(
      (table) => table.status === "OCCUPIED" && isOverstay(table.startTime),
    ).length,
  };

  const targetTable =
    modalState.tableId === "NEW"
      ? { id: "", zone: "INDOOR", cap: 2, status: "FREE", isOnline: true }
      : mappedTables.find((table) => table.id === modalState.tableId);

  const updateTable = async (table, data) => {
    if (!table?.backendId) return;
    await tableService.updateTable(table.backendId, data);
  };

  const handleSaveConfig = async (updatedTable) => {
    try {
      if (modalState.tableId === "NEW") {
        await tableService.createTable({
          table_Id: updatedTable.id,
          number: Number(String(updatedTable.id).match(/\d+/)?.[0] || 0),
          area: updatedTable.zone,
          seats: updatedTable.cap,
          status: toApiTableStatus(updatedTable.status),
          onlineReservable: updatedTable.isOnline,
        });
      } else {
        const table = tables.find((item) => item.id === updatedTable.id);
        await updateTable(table, {
          area: updatedTable.zone,
          seats: updatedTable.cap,
          status: toApiTableStatus(updatedTable.status),
          onlineReservable: updatedTable.isOnline,
        });
      }
      setModalState({ isOpen: false, tableId: null, mode: null });
      await fetchTableMap();
    } catch (error) {
      console.error("Failed to save table:", error);
      setStatusMessage("Unable to save this table in the database.");
    }
  };

  const handleDeleteTable = async (id) => {
    const table = mappedTables.find((item) => item.id === id);
    if (!table || table.status !== "FREE") {
      alert("Clear the table before deleting it.");
      return;
    }
    if (!window.confirm(`Delete table ${id}?`)) return;

    try {
      await updateTable(table, { active: false });
      setModalState({ isOpen: false, tableId: null, mode: null });
      await fetchTableMap();
    } catch (error) {
      console.error("Failed to delete table:", error);
      setStatusMessage("Unable to delete this table in the database.");
    }
  };

  const handleUpdatePosition = async (id, x, y) => {
    const table = tables.find((item) => item.id === id);
    setTables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, x, y } : item)),
    );
    try {
      await updateTable(table, { x, y });
    } catch (error) {
      console.error("Failed to save table position:", error);
    }
  };

  const handleActionTable = async (id, action, data) => {
    const table = mappedTables.find((item) => item.id === id);

    try {
      if (action === "CLEAR") {
        await updateTable(table, { status: "Available" });
      } else if (action === "CLEAR_RESERVE") {
        if (data) await orderService.updateOrder(data, { status: "cancelled" });
        await updateTable(table, { status: "Available" });
      } else if (action === "TOGGLE_ONLINE") {
        await updateTable(table, { onlineReservable: !table.isOnline });
      } else if (action === "LINK_RESERVE") {
        await orderService.updateOrder(data, {
          tableId: id,
          status: "reserved",
        });
        await updateTable(table, { status: "Cooking" });
      } else if (action === "MANUAL_RESERVE") {
        const order = await orderService.createOrder({
          type: "Onsite",
          customer: {
            name: data.name,
            contact: data.phone,
            note: `reserve|${data.date} (${data.timeSlot})`,
          },
          bookingDate: data.date,
          bookingTime: data.timeSlot,
          reservationPax: data.pax,
          tableId: id,
          orderList: [],
        });
        await orderService.updateOrder(order._id, {
          status: "reserved",
          tableId: id,
          reservationPax: data.pax,
        });
        await updateTable(table, { status: "Cooking" });
      } else if (action === "CHECK_IN") {
        if (table.reservationBackendId) {
          await orderService.updateOrder(table.reservationBackendId, {
            status: "checked-in",
            tableId: id,
          });
        }
        await updateTable(table, { status: "Eating" });
      } else if (action === "NEW_ORDER") {
        await updateTable(table, { status: "Eating" });
        navigate("/cashier/menu", { state: { tableId: id, type: "DINE-IN" } });
      } else if (action === "ADD_ORDER") {
        navigate("/cashier/menu", { state: { tableId: id, type: "DINE-IN" } });
      } else if (action === "CHECKOUT") {
        navigate("/cashier/checkout", { state: { tableId: id } });
      } else if (action === "VIEW_BILL") {
        const reservation = reservationsForSlot.find((item) => item.tableId === id);
        if (reservation?.raw) setBillData(toCashierOrder(reservation.raw));
      }

      setModalState({ isOpen: false, tableId: null, mode: null });
      await fetchTableMap();
    } catch (error) {
      console.error(`Failed table action ${action}:`, error);
      setStatusMessage("Unable to update table/reservation in the database.");
    }
  };

  const statusLabel = {
    FREE: "Free",
    OCCUPIED: "Occupied",
    RESERVED: "Reserved",
  };

  return (
    <div className="flex bg-[#eeeeee] min-h-screen font-sans text-[#242424]">
      <Sidebar />
      <main className="flex-1 ml-60 p-6 md:p-10 flex flex-col h-screen overflow-y-auto">
        <TableMapHeader />

        {statusMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {statusMessage}
          </div>
        )}

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
              setModalState({ isOpen: true, tableId: id, mode })
            }
            onUpdatePosition={handleUpdatePosition}
          />
        ) : currentView === "floor" ? (
          <FloorPlanView
            tables={filteredTables}
            isEditMode={isEditMode}
            onOpenModal={(id, mode) =>
              setModalState({ isOpen: true, tableId: id, mode })
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
