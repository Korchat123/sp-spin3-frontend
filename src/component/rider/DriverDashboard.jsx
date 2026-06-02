// src/component/rider/DriverDashboard.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, RefreshCcw } from "lucide-react";
import { orderService } from "../../services/orderService";
import {
  getCustomerName,
  getOrderId,
  getOrderItems,
  getOrderNo,
  getOrderTotal,
  isActiveDeliveryOrder,
  isHistoryDeliveryOrder,
  isReadyForPickup,
  sortOrdersNewestFirst,
} from "../../utils/riderOrders";

const getStatusLabel = (order) => {
  if (order.status === "pending") return "Waiting";
  if (order.status === "preparing") return "In Kitchen";
  if (order.status === "delivery") return "Ready to Pick";
  return order.status || "Unknown";
};

export default function DriverDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDeliveryOrders = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await orderService.getOrders();
      setOrders(sortOrdersNewestFirst(data.filter((order) => order.type === "delivery")));
      setError("");
    } catch (fetchError) {
      console.error("Failed to fetch rider orders:", fetchError);
      setError("Unable to load delivery tasks from the server.");
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryOrders();
    const interval = setInterval(() => fetchDeliveryOrders({ silent: true }), 5000);
    return () => clearInterval(interval);
  }, [fetchDeliveryOrders]);

  const currentTasks = useMemo(
    () => orders.filter(isActiveDeliveryOrder),
    [orders],
  );

  const historyTasks = useMemo(
    () => orders.filter(isHistoryDeliveryOrder),
    [orders],
  );

  const readyToPickTasks = currentTasks.filter(isReadyForPickup);
  const inKitchenTasks = currentTasks.filter((task) => !isReadyForPickup(task));

  const todayHistoryTasks = historyTasks.filter((task) => {
    const date = task.deliveredAt || task.createdAt;
    if (!date) return false;
    return new Date(date).toDateString() === new Date().toDateString();
  });

  const todayCompleted = todayHistoryTasks.filter((task) => task.status === "delivered");
  const todayEarnings = todayCompleted.reduce(
    (sum, task) => sum + getOrderTotal(task),
    0,
  );

  return (
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen font-sans pb-24 relative shadow-2xl">
      <div className="px-6 pt-12 sm:pt-16 pb-4 flex justify-center items-center relative">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tighter text-center">
          Driver Dashboard
        </h1>

        <button
          onClick={() => navigate("/driver/profile")}
          className="absolute right-6 top-[3.2rem] sm:top-[4.2rem] w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="px-4 sm:px-6 mt-4 sm:mt-6">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-black text-red-700">
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-4xl p-5 sm:p-6 text-white relative overflow-hidden shadow-xl mb-6">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[9px] sm:text-[10px] font-bold opacity-60 uppercase tracking-widest">
                Today Earnings
              </p>
              <button
                type="button"
                onClick={() => fetchDeliveryOrders({ silent: true })}
                className="bg-green-500/20 text-green-400 text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
              >
                <RefreshCcw size={10} className={refreshing ? "animate-spin" : ""} />
                LIVE
              </button>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold">THB</span>
              <span className="text-3xl sm:text-4xl font-black">
                {todayEarnings.toLocaleString()}
              </span>
            </div>

            <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-1 sm:gap-2 border-t border-white/10 pt-4">
              <div className="flex flex-col">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                  In Kitchen
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                  <span className="text-xs sm:text-sm font-black">{inKitchenTasks.length}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                  Ready
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-xs sm:text-sm font-black">{readyToPickTasks.length}</span>
                </div>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-2">
                <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
                  Delivered
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                  <span className="text-xs sm:text-sm font-black">{todayCompleted.length}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>

        <div className="bg-white p-1.5 rounded-2xl shadow-md flex gap-1 mb-6">
          <button className="flex-1 py-3 rounded-xl font-black text-[9px] sm:text-[10px] tracking-wider transition-all bg-[#E4002B] text-white shadow-lg shadow-red-100">
            ACTIVE TASKS ({currentTasks.length})
          </button>
          <button
            onClick={() => navigate("/driver/history")}
            className="flex-1 py-3 rounded-xl font-black text-[9px] sm:text-[10px] tracking-wider transition-all text-gray-400 hover:bg-gray-50"
          >
            HISTORY
          </button>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#E4002B] mb-4"></div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Loading tasks...</p>
          </div>
        ) : currentTasks.length > 0 ? (
          currentTasks.map((task) => {
            const orderItems = getOrderItems(task);
            const orderId = getOrderId(task);
            const isReady = isReadyForPickup(task);
            const totalPrice = getOrderTotal(task);

            return (
              <div
                key={orderId}
                className="bg-white rounded-4xl sm:rounded-[2.5rem] p-1 shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                onClick={() => navigate(`/driver/order/${orderId}`)}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-gray-900">
                        #{getOrderNo(task)}
                      </h2>
                      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        {orderItems.length} Items - THB {totalPrice.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase ${
                        isReady
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {getStatusLabel(task)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 mb-5">
                    <img
                      src={orderItems[0]?.image || orderItems[0]?.img || "/images/placeholder.png"}
                      alt={orderItems[0]?.name || "Order item"}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover bg-gray-50 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase mb-0.5 sm:mb-1">
                        Customer
                      </p>
                      <p className="text-xs sm:text-sm font-black text-gray-800 truncate">
                        {getCustomerName(task)}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5 text-[10px] sm:text-[11px] text-gray-500 font-medium">
                        <span className="text-blue-500 text-[10px]">LOC</span>
                        <span className="line-clamp-1">
                          {task.customer?.address || "No address"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all ${
                      isReady
                        ? "bg-[#E4002B] text-white shadow-lg shadow-red-100"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isReady ? "Open Delivery" : "Waiting for kitchen"}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl mb-4">
              -
            </div>
            <p className="font-black uppercase text-[9px] sm:text-[10px] tracking-[0.2em]">
              No tasks available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
