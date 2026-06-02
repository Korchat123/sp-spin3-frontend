// src/component/rider/DriverDashboard.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCcw } from "lucide-react";
import { UserContext } from "../../context/userContext/UserContext";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

const getCustomerName = (order) =>
  order?.customer?.name || order?.customer?.contact || `Order ${getOrderNo(order)}`;

const getFirstImage = (order) => order?.orderList?.[0]?.image || "/images/placeholder.png";

export default function DriverDashboard() {
  const navigate = useNavigate();
  const { setMyUserInfo } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("current");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(Array.isArray(data) ? data.filter((order) => order.type === "delivery") : []);
      setStatusMessage("");
    } catch (error) {
      console.error("Failed to fetch delivery tasks:", error);
      setOrders([]);
      setStatusMessage("Unable to sync delivery tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentTasks = useMemo(
    () => orders.filter((order) => order.status === "delivery"),
    [orders],
  );
  const historyTasks = useMemo(
    () => orders.filter((order) => ["delivered", "cancelled"].includes(order.status)),
    [orders],
  );
  const displayTasks = activeTab === "current" ? currentTasks : historyTasks;

  const handleLogout = () => {
    setMyUserInfo(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white font-sans shadow-lg">
      <header className="flex items-center justify-between px-4 py-8">
        <button
          onClick={handleLogout}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black transition-all hover:bg-gray-200"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
        <h1 className="px-3 text-center text-2xl font-black uppercase tracking-tight text-black">Driver Dashboard</h1>
        <button
          onClick={fetchOrders}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all hover:scale-110"
          title="Refresh"
        >
          <RefreshCcw size={18} />
        </button>
      </header>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("current")}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            activeTab === "current" ? "border-b-4 border-black text-black" : "text-gray-400"
          }`}
        >
          CURRENT TASKS ({currentTasks.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-3 text-sm font-bold transition-all ${
            activeTab === "history" ? "border-b-4 border-black text-black" : "text-gray-400"
          }`}
        >
          DELIVERY HISTORY ({historyTasks.length})
        </button>
      </div>

      {statusMessage && (
        <div className="mx-4 mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-black text-red-700">
          {statusMessage}
        </div>
      )}

      <div className="min-h-[70vh] space-y-4 bg-gray-50/50 p-4">
        {loading ? (
          <div className="py-20 text-center text-sm font-black uppercase text-gray-400">Loading tasks...</div>
        ) : displayTasks.length > 0 ? (
          displayTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-[2rem] border-2 border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-black"
            >
              <div className="mb-4 flex items-center">
                <img
                  src={getFirstImage(task)}
                  alt={`Order ${getOrderNo(task)}`}
                  className="h-20 w-20 flex-shrink-0 rounded-3xl bg-gray-200 object-cover shadow-sm"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-black uppercase text-black">Order #{getOrderNo(task)}</h2>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-black uppercase ${
                        task.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : task.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-bold text-gray-800">{getCustomerName(task)}</p>
                  <p className="text-[10px] font-bold uppercase text-gray-500">
                    {(task.orderList || []).length} Items - THB {getOrderTotal(task).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 p-3">
                <p className="mb-1 text-[10px] font-black uppercase text-gray-400">Delivery Address</p>
                <p className="line-clamp-2 text-xs leading-tight text-gray-600">
                  {task.customer?.address || "No delivery address on order"}
                </p>
              </div>

              <button
                onClick={() => navigate(`/driver/order/${task._id}`)}
                className="w-full rounded-2xl bg-[#D33131] py-3 text-sm font-black uppercase tracking-wider text-white shadow-md shadow-red-200 transition-all hover:bg-red-700 active:scale-95"
              >
                {activeTab === "history" ? "View Details" : "Start Delivery"}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="mb-4 text-5xl">BOX</span>
            <p className="text-sm font-bold uppercase">No {activeTab} tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
