import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

export default function DeliveryHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await orderService.getOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch delivery history:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const historyTasks = useMemo(
    () => orders.filter((order) => order.type === "delivery" && ["delivered", "cancelled"].includes(order.status)),
    [orders],
  );
  const deliveredTasks = historyTasks.filter((order) => order.status === "delivered");

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white font-sans shadow-lg">
      <header className="flex items-center px-4 py-8">
        <button
          onClick={() => navigate("/driver")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black transition-all hover:bg-gray-200"
        >
          BACK
        </button>
        <h1 className="ml-4 text-2xl font-black uppercase tracking-tight text-black">Delivery History</h1>
      </header>

      <div className="mb-6 px-6">
        <div className="flex items-center justify-between rounded-[2rem] bg-black p-6 text-white shadow-xl">
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-60">Completed</p>
            <p className="text-4xl font-black">{deliveredTasks.length}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-60">Delivered Value</p>
            <p className="text-2xl font-black">
              THB {deliveredTasks.reduce((total, order) => total + getOrderTotal(order), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[70vh] space-y-4 rounded-t-[3rem] bg-gray-50/50 p-4">
        <div className="flex items-center justify-between px-4 pt-2">
          <h2 className="text-sm font-black uppercase text-gray-400">Past Orders</h2>
          <span className="text-[10px] font-bold text-gray-400">{historyTasks.length} Records</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs font-black uppercase tracking-widest text-gray-300">Loading history...</div>
        ) : historyTasks.length > 0 ? (
          historyTasks.map((task) => (
            <button
              key={task._id}
              type="button"
              className="w-full rounded-[2rem] border-2 border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:border-black"
              onClick={() => navigate(`/driver/order/${task._id}`)}
            >
              <div className="flex items-center">
                <img
                  src={task.orderList?.[0]?.image || "/images/placeholder.png"}
                  alt={`Order ${getOrderNo(task)}`}
                  className="h-16 w-16 flex-shrink-0 rounded-2xl bg-gray-100 object-cover"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black uppercase text-black">#{getOrderNo(task)}</h3>
                    <span className="text-[9px] font-black uppercase text-gray-400">{task.status}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-bold text-gray-700">
                    {task.customer?.name || task.customer?.contact || "Customer not provided"}
                  </p>
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-[9px] font-bold uppercase text-gray-400">{task.orderList?.length || 0} Items</p>
                    <p className="text-sm font-black text-[#D33131]">THB {getOrderTotal(task).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-300">
            <span className="mb-4 text-5xl">DONE</span>
            <p className="text-xs font-bold uppercase tracking-widest">No history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
