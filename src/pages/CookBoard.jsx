import { useState, useEffect, useContext, useRef } from "react";
import { api } from "../utils/api";
import { UserContext } from "../context/userContext/UserContext";
import { Boxes, LogOut, Clock, Utensils, CheckCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ITEM_STATUS_STAGE = {
  InKitchen: "new",
  pending: "new",
  Cook: "cooking",
  preparing: "cooking",
  finished: "finished",
  completed: "finished",
  cancel: "cancelled",
  cancelled: "cancelled",
};

const getItemStage = (status) => ITEM_STATUS_STAGE[status] || "new";

const getItemStatusLabel = (status) => {
  const stage = getItemStage(status);
  if (stage === "new") return "NEW";
  if (stage === "cooking") return "COOKING";
  if (stage === "finished") return "DONE";
  if (stage === "cancelled") return "CANCELLED";
  return "UNKNOWN";
};

const getItemSortPriority = (item) => {
  const stage = getItemStage(item?.status);
  if (stage === "cooking") return 0;
  if (stage === "new") return 1;
  if (stage === "finished") return 2;
  if (stage === "cancelled") return 3;
  return 4;
};

const getSortedOrderItems = (orderList = []) => {
  return [...orderList].sort((a, b) => getItemSortPriority(a) - getItemSortPriority(b));
};

const COOK_TIMER_STARTS_KEY = "cookBoardTimerStarts";

const getTimerId = (orderId, itemId) => `${orderId}-${itemId}`;

const readCookTimerStarts = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(COOK_TIMER_STARTS_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

const writeCookTimerStarts = (starts) => {
  localStorage.setItem(COOK_TIMER_STARTS_KEY, JSON.stringify(starts));
};

const getLocalDateValue = (date = new Date()) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getOrderServiceDate = (order) => {
  if (order?.bookingDate) return order.bookingDate;
  const noteDate = order?.customer?.note?.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i)?.[1];
  if (noteDate) return noteDate;
  return getLocalDateValue(new Date(order?.createdAt || Date.now()));
};

const getOrderServiceTime = (order) => {
  if (order?.bookingTime) return order.bookingTime;
  return order?.customer?.note?.match(/Time:\s*([^|]+)/i)?.[1]?.trim() || "";
};

const getOrderFifoTime = (order) => {
  const serviceDate = getOrderServiceDate(order);
  const serviceTime = getOrderServiceTime(order);
  const firstTime = serviceTime.match(/\d{1,2}:\d{2}/)?.[0] || "00:00";
  return new Date(`${serviceDate}T${firstTime}:00`).getTime() || new Date(order.createdAt).getTime();
};

const isPlaceholderCustomerName = (name = "") => {
  const normalizedName = name.trim().toLowerCase();
  return (
    !normalizedName ||
    normalizedName.includes("perse") ||
    normalizedName === "dev customer" ||
    normalizedName === "test"
  );
};

const getCustomerLabel = (order) => {
  const name = order?.customer?.name?.trim();
  if (!isPlaceholderCustomerName(name)) return name;
  return `Order ${order?._id?.slice(-6).toUpperCase() || "N/A"}`;
};

const getOrderKitchenNote = (order) => {
  const globalNote = String(order?.note_global || "").trim();
  if (globalNote) return globalNote;

  const customer = order?.customer || {};
  const explicitNote = customer.kitchenNote || customer.comment || customer.specialRequest;
  if (explicitNote) return explicitNote;

  const note = String(customer.note || "").trim();
  if (!note || note.includes("|")) return "";
  return note;
};

const getItemNote = (item) => {
  const note = String(item?.note || item?.customerNote || item?.specialRequest || item?.comment || "").trim();
  return note;
};

const KITCHEN_ORDER_STATUSES = new Set(["preparing", "finished"]);

export default function CookBoard() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("cooking"); // 'all', 'cooking', 'finished'
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateValue());
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => Date.now());
  const [timerStarts, setTimerStarts] = useState(() => readCookTimerStarts());
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const ordersScrollRef = useRef(null);
  const { setMyUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const data = await api.get("/orders");
      // Ensure data is an array
      setOrders(
        Array.isArray(data)
          ? data.filter((order) => KITCHEN_ORDER_STATUSES.has(String(order?.status || "").toLowerCase()))
          : [],
      );
      setStatusMessage("");
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setStatusMessage("Unable to sync orders. Check the backend connection.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
  
  ///pooling every 5 seconds to get real-time updates without needing WebSockets
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); 
    return () => clearInterval(interval);
  }, []);

  // Countdown timer tick. Remaining time is derived from persisted start times,
  // so navigating away from this page does not reset active cooking timers.
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize and persist timer start times when item status changes to Cook.
  useEffect(() => {
    setTimerStarts(prev => {
      let changed = false;
      const nextStarts = { ...prev };
      const activeTimerIds = new Set();

      orders.forEach(order => {
        if (order && Array.isArray(order.orderList)) {
          order.orderList.forEach(item => {
            const timerId = getTimerId(order._id, item._id);
            if (getItemStage(item.status) === "cooking") {
              activeTimerIds.add(timerId);
              if (!nextStarts[timerId]) {
                nextStarts[timerId] = item.updatedAt
                  ? new Date(item.updatedAt).getTime()
                  : Date.now();
                changed = true;
              }
            }
          });
        }
      });

      Object.keys(nextStarts).forEach((timerId) => {
        if (!activeTimerIds.has(timerId)) {
          delete nextStarts[timerId];
          changed = true;
        }
      });

      if (changed) writeCookTimerStarts(nextStarts);
      return changed ? nextStarts : prev;
    });
  }, [orders]);

  const handleLogout = () => {
    setMyUserInfo(null);
    navigate("/login");
  };

  const getTableStatus = (orderList = []) => {
    if (!Array.isArray(orderList) || orderList.length === 0) return "inkitchen";
    
    if (orderList.every(item => item && ["finished", "cancelled"].includes(getItemStage(item.status)))) {
      return "finished";
    }
    if (orderList.some(item => item && getItemStage(item.status) === "cooking")) {
      return "cooking";
    }
    return "inkitchen";
  };

  const todayDate = getLocalDateValue();
  const isSelectedDateToday = selectedDate === todayDate;

  const filteredOrders = orders
    .filter((order) => {
      if (!order) return false;
      const status = getTableStatus(order.orderList);
      const serviceDate = getOrderServiceDate(order);

      if (filter === "all") return serviceDate === selectedDate;
      if (filter === "cooking") {
        return (
          (status === "cooking" || status === "inkitchen") &&
          serviceDate <= selectedDate
        );
      }
      if (filter === "finished") return status === "finished" && serviceDate === selectedDate;
      return true;
    })
    .sort((a, b) => {
      const aFinished = getTableStatus(a.orderList) === "finished";
      const bFinished = getTableStatus(b.orderList) === "finished";
      if (aFinished !== bFinished) return aFinished ? 1 : -1;

      const fifoTime = getOrderFifoTime(a) - getOrderFifoTime(b);
      if (fifoTime !== 0) return fifoTime;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "finished": return "border-green-500 bg-green-50/50";
      case "cooking": return "border-orange-500 bg-orange-50/50";
      case "inkitchen": return "border-blue-500 bg-blue-50/50";
      default: return "border-gray-500 bg-gray-50/50";
    }
  };

  const getCountdownColor = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return "text-blue-600";
    if (percentage > 25) return "text-yellow-600";
    return "text-red-600";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpdateStatus = async (orderId, itemId, newStatus) => {
    setUpdatingItemId(itemId);
    setStatusMessage("");
    if (getItemStage(newStatus) === "cooking") {
      setTimerStarts((prev) => {
        const timerId = getTimerId(orderId, itemId);
        const nextStarts = { ...prev, [timerId]: Date.now() };
        writeCookTimerStarts(nextStarts);
        return nextStarts;
      });
    } else {
      setTimerStarts((prev) => {
        const timerId = getTimerId(orderId, itemId);
        if (!prev[timerId]) return prev;
        const nextStarts = { ...prev };
        delete nextStarts[timerId];
        writeCookTimerStarts(nextStarts);
        return nextStarts;
      });
    }
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              orderList: order.orderList.map((item) =>
                item._id === itemId ? { ...item, status: newStatus } : item
              ),
            }
          : order
      )
    );

    try {
      await api.patch(`/orders/${orderId}/item/${itemId}`, { status: newStatus });
      fetchOrders(); // Refresh data
    } catch (err) {
      setStatusMessage("Failed to update status: " + err.message);
      fetchOrders();
    } finally {
      setUpdatingItemId(null);
    }
  };

  const formatOrderTime = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleBoardWheel = (event) => {
    const scrollContainer = ordersScrollRef.current;
    if (!scrollContainer || window.innerWidth < 768) return;
    if (event.target.closest("[data-order-items]")) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    scrollContainer.scrollLeft += event.deltaY;
  };

  return (
    <div
      className="flex flex-col bg-[#f8fafc] min-h-screen lg:h-screen lg:overflow-hidden font-['IBM_Plex_Sans_Thai'] p-4 lg:p-5"
      onWheel={handleBoardWheel}
    >
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-3 gap-3 bg-white px-3 py-2.5 lg:px-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-[#e4002b] p-2 rounded-lg text-white shadow-sm shrink-0">
            <Utensils size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight leading-none">KITCHEN DISPLAY</h1>
            <p className="text-xs font-bold text-slate-500">FIFO order queue</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5">
            <Clock size={16} className="text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 outline-none"
              aria-label="Filter order date"
            />
          </div>
          <button
            onClick={() => setSelectedDate(todayDate)}
            className={`h-10 rounded-lg border px-3 text-xs font-black transition-colors ${
              isSelectedDateToday
                ? "border-[#e4002b] bg-[#e4002b] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-[#e4002b] hover:text-[#e4002b]"
            }`}
          >
            TODAY
          </button>
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto max-w-full">
            {["all", "cooking", "finished"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 lg:px-4 py-1.5 rounded-md capitalize font-bold text-xs lg:text-sm whitespace-nowrap transition-all duration-200 ${
                  filter === f 
                  ? "bg-white text-[#e4002b] shadow-sm scale-105" 
                  : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f === "cooking" ? "In Preparation" : f}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/cook/ingredients")}
            className="h-10 flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:text-[#e4002b] hover:border-[#e4002b] transition-colors"
          >
            <Boxes size={17} />
            <span>INGREDIENTS</span>
          </button>
          
          <button
            onClick={fetchOrders}
            className="h-10 w-10 flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-[#e4002b] hover:border-[#e4002b] transition-colors"
            title="Refresh orders"
            aria-label="Refresh orders"
          >
            <RefreshCcw size={17} />
          </button>
          
          <button 
            onClick={handleLogout}
            className="h-10 flex items-center gap-1.5 bg-slate-900 text-white px-3 rounded-lg text-sm font-bold hover:bg-[#e4002b] transition-all shadow-sm"
          >
            <LogOut size={17} />
            <span>EXIT</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          <AlertCircle size={18} />
          {statusMessage}
        </div>
      )}

      {!isSelectedDateToday && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">
          <Clock size={18} />
          Viewing preorder date {selectedDate}. Kitchen start is locked until today.
        </div>
      )}

      <div className="flex-1 min-h-0">
      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-[#e4002b]"></div>
          <p className="text-slate-400 font-bold animate-pulse">SYNCING ORDERS...</p>
        </div>
      ) : (
        <div ref={ordersScrollRef} className="flex flex-col gap-5 md:flex-row md:overflow-x-auto md:overflow-y-hidden md:pb-4 lg:h-full lg:min-h-0">
          {filteredOrders.map((order) => {
            if (!order || !Array.isArray(order.orderList)) return null;
            const tableStatus = getTableStatus(order.orderList);
            return (
              <div 
                key={order._id} 
                className={`flex w-full shrink-0 flex-col border-2 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-300 hover:translate-y-[-4px] bg-white md:w-[390px] lg:h-full xl:w-[420px] 2xl:w-[450px] ${getStatusColor(tableStatus)}`}
              >
                {/* Card Header */}
                <div className="p-4 border-b-2 border-slate-100 flex justify-between items-start gap-3 bg-white/80 backdrop-blur-sm shrink-0">
                  <div className="min-w-0">
                    <h2 className="text-xl lg:text-2xl font-black text-slate-900 leading-tight truncate">
                      {order.type === "delivery" ? `Delivery: ${getCustomerLabel(order)}` : getCustomerLabel(order)}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-sm font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                        <Clock size={12} />
                        Order: {formatOrderTime(order.createdAt)}
                      </span>
                      <span className="text-xs font-bold bg-slate-900 text-white px-2 py-1 rounded flex items-center gap-1">
                        Serve: {getOrderServiceDate(order)} {getOrderServiceTime(order)}
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-full text-xs lg:text-sm font-black uppercase tracking-widest shadow-sm shrink-0 ${
                    tableStatus === 'cooking' ? 'bg-orange-500 text-white' : 
                    tableStatus === 'finished' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}>
                    {tableStatus === 'inkitchen' ? 'NEW' : tableStatus}
                  </div>
                </div>
                
                {/* Items List */}
                <div data-order-items className="flex-1 min-h-0 p-4 space-y-3 overflow-y-auto">
                  {getSortedOrderItems(order.orderList).map((item) => {
                    if (!item) return null;
                    const timerId = getTimerId(order._id, item._id);
                    const itemStage = getItemStage(item.status);
                    const totalTime = item.cookingTime || 300;
                    const startedAt = timerStarts[timerId] || now;
                    const elapsedTime = Math.max(0, Math.floor((now - startedAt) / 1000));
                    const remainingTime = Math.max(0, totalTime - elapsedTime);
                    const countdownColor = getCountdownColor(remainingTime, totalTime);
                    const isUpdating = updatingItemId === item._id;
                    
                    return (
                      <div key={item._id} className="flex flex-col p-3 rounded-xl bg-white border-2 border-slate-100 shadow-sm transition-colors hover:border-slate-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-col">
                            <span className="text-lg lg:text-xl font-black text-slate-800 leading-tight">{item.name}</span>
                            <span className="text-2xl font-black text-[#e4002b]">x{item.quantity}</span>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-black ${
                            itemStage === 'cooking' ? 'bg-orange-100 text-orange-600' : 
                            itemStage === 'finished' ? 'bg-green-100 text-green-600' :
                            itemStage === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {itemStage === 'cooking' && <Utensils size={14} />}
                            {itemStage === 'finished' && <CheckCircle size={14} />}
                            {itemStage === 'new' && <Clock size={14} />}
                            {itemStage === 'cancelled' && <AlertCircle size={14} />}
                            {getItemStatusLabel(item.status)}
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        {itemStage === 'cooking' && (
                          <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Cooking Time</p>
                            <div className={`text-3xl font-black font-mono ${countdownColor} transition-colors`}>
                              {formatTime(remainingTime)}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all ${
                                  remainingTime / totalTime > 0.5 ? 'bg-green-500' :
                                  remainingTime / totalTime > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${(remainingTime / totalTime) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {itemStage === 'new' && item.cookingTime && (
                          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Est. Cooking Time</p>
                            <p className="text-xl font-black text-blue-700 font-mono mt-1">
                              {formatTime(item.cookingTime)}
                            </p>
                          </div>
                        )}

                        {getItemNote(item) && (
                          <div className="mb-3 rounded-lg border border-yellow-200 bg-yellow-50 p-2">
                            <p className="text-xs font-black uppercase tracking-wider text-yellow-700">Customer Note</p>
                            <p className="mt-1 max-h-20 overflow-y-auto whitespace-pre-wrap break-words text-sm font-bold leading-snug text-yellow-900">
                              {getItemNote(item)}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          {itemStage === 'new' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'Cook')}
                              disabled={isUpdating || !isSelectedDateToday}
                              className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-black text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-100 disabled:opacity-60 disabled:cursor-wait"
                            >
                              <Utensils size={16} /> {isUpdating ? "UPDATING" : isSelectedDateToday ? "START" : "WAIT"}
                            </button>
                          )}
                          {itemStage === 'cooking' && (
                            <button 
                              onClick={() => handleUpdateStatus(order._id, item._id, 'finished')}
                              disabled={isUpdating}
                              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-black text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-100 disabled:opacity-60 disabled:cursor-wait"
                            >
                              <CheckCircle size={16} /> {isUpdating ? "UPDATING" : "DONE"}
                            </button>
                          )}
                          
                          <div className="flex gap-2">
                            {itemStage !== 'finished' && itemStage !== 'cancelled' && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, item._id, 'cancel')}
                                disabled={isUpdating}
                                className="w-12 flex items-center justify-center bg-slate-100 text-slate-400 py-3 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                                title="Cancel Item"
                              >
                                <AlertCircle size={18} />
                              </button>
                            )}
                            {(itemStage === 'finished' || itemStage === 'cancelled') && (
                              <button 
                                onClick={() => handleUpdateStatus(order._id, item._id, 'InKitchen')}
                                disabled={isUpdating}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-500 py-3 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors disabled:opacity-60 disabled:cursor-wait"
                              >
                                <RefreshCcw size={16} /> {isUpdating ? "UPDATING" : "REDO"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Footer Notes */}
                {getOrderKitchenNote(order) && (
                  <div className="p-4 bg-yellow-50/80 border-t-2 border-yellow-100 shrink-0">
                    <div className="flex gap-2 items-start">
                      <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-yellow-600 uppercase tracking-tighter">Kitchen Note</p>
                        <p className="text-sm font-bold text-yellow-800 leading-tight">{getOrderKitchenNote(order)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>
      
      {filteredOrders.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center h-96 lg:h-[calc(100vh-180px)] text-slate-300">
          <div className="bg-white p-10 rounded-full shadow-inner mb-6">
            <Utensils size={80} strokeWidth={1} />
          </div>
          <p className="text-2xl font-black tracking-tight">NO ORDERS IN QUEUE</p>
          <p className="font-medium">Everything is currently up to date!</p>
        </div>
      )}
    </div>
  );
}
