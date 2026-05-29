import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Clock, ChevronRight, Package, Calendar, MapPin, X, RotateCcw } from "lucide-react";
import { orderService } from "../../services/orderService";
import { useShop } from "../../context/ShopProvider";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { reorderItems, setIsCartOpen } = useShop();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders();
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-green-500";
      case "PENDING":
      case "PREPARING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getOrderTotal = (order) => {
    if (typeof order.totalPrice === "number") return order.totalPrice;
    return (order.orderList || []).reduce((sum, item) => {
      const itemPrice = item.price ?? item.price_at_purchase ?? 0;
      return sum + itemPrice * (item.quantity || 0);
    }, 0);
  };

  const handleReorder = (order) => {
    const addedCount = reorderItems(order.orderList || []);
    if (addedCount > 0) {
      setSelectedOrder(null);
      setIsCartOpen(true);
      navigate("/menu?cart=open");
    }
  };

  return (
    <div className="min-h-screen bg-[#eeeeee] px-4 py-10 font-['IBM_Plex_Sans_Thai'] text-[#242424]">
      {selectedOrder && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-4 border-[#242424] bg-[#eeeeee] shadow-[12px_12px_0_#242424]">
            <div className="flex items-start justify-between gap-4 border-b-4 border-[#242424] bg-white p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#e4002b]">
                  Order Detail
                </p>
                <h2 className="font-['Bebas_Neue'] text-4xl tracking-wider">
                  #{selectedOrder._id?.slice(-6).toUpperCase()}
                </h2>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {new Date(selectedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {selectedOrder.type === "delivery" && <span className="flex items-center gap-1 text-[#e4002b]"><MapPin size={14} /> DELIVERY</span>}
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#242424] bg-white shadow-[3px_3px_0_#242424] hover:bg-[#e4002b] hover:text-white"
                aria-label="Close order detail"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border-2 border-[#242424] bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Customer</p>
                  <p className="mt-1 font-bold">{selectedOrder.customer?.name || "Guest"}</p>
                </div>
                <div className="rounded-2xl border-2 border-[#242424] bg-white p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Status</p>
                  <span className={`mt-2 inline-flex rounded-full border-2 border-[#242424] px-3 py-1 text-xs font-black uppercase tracking-widest text-white ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {(selectedOrder.orderList || []).map((item, index) => {
                  const itemPrice = item.price ?? item.price_at_purchase ?? 0;
                  const itemTotal = itemPrice * (item.quantity || 0);

                  return (
                    <div key={item._id || index} className="flex items-center gap-4 rounded-2xl border-2 border-[#242424] bg-white p-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 shrink-0 rounded-xl bg-[#eeeeee] object-contain"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-bold leading-tight">{item.name || "Menu item"}</p>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                          Qty {item.quantity || 0} x ฿{itemPrice.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-['Bebas_Neue'] text-3xl text-[#e4002b]">
                        ฿{itemTotal.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t-4 border-[#242424] bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-black uppercase tracking-widest text-gray-400">Total</span>
                <span className="font-['Bebas_Neue'] text-4xl text-[#242424]">฿{getOrderTotal(selectedOrder).toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleReorder(selectedOrder)}
                className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-[#242424] bg-[#e4002b] px-8 py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#242424] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#242424]"
              >
                <RotateCcw size={22} />
                REORDER
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#e4002b]">
            Your Journey
          </p>
          <h1 className="mt-2 font-['Bebas_Neue'] text-6xl tracking-wider">
            ORDER HISTORY
          </h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#242424] border-t-[#e4002b]"></div>
            <p className="mt-4 font-black uppercase tracking-widest text-gray-500">Loading your feast history...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border-4 border-[#242424] bg-white p-8 text-center shadow-[8px_8px_0_#242424]">
            <p className="text-xl font-bold text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full border-2 border-[#242424] bg-[#242424] px-6 py-2 font-['Bebas_Neue'] text-xl tracking-widest text-white hover:bg-[#e4002b] transition-colors"
            >
              RETRY
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-4xl border-4 border-[#242424] bg-white p-12 text-center shadow-[12px_12px_0_#242424]">
            <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wider">NO ORDERS YET</h2>
            <p className="mt-2 font-bold text-gray-500 uppercase tracking-wide">Time to start your Serious Fried Chicken adventure!</p>
            <a 
              href="/menu"
              className="mt-8 inline-block rounded-full border-2 border-[#242424] bg-[#e4002b] px-10 py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#242424] transition-all hover:translate-y-1 hover:shadow-[2px_2px_0_#242424]"
            >
              ORDER NOW
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderTotal = getOrderTotal(order);

              return (
              <button
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="group relative w-full overflow-hidden rounded-3xl border-4 border-[#242424] bg-white p-6 text-left shadow-[8px_8px_0_#242424] transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_#242424]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[#242424] text-white ${getStatusColor(order.status)} shadow-[4px_4px_0_#242424]`}>
                      <Package size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-['Bebas_Neue'] text-2xl tracking-wider">ORDER #{order._id?.slice(-6).toUpperCase()}</span>
                        <span className={`rounded-full border-2 border-[#242424] px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-white ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {order.type === "delivery" && <span className="flex items-center gap-1 text-[#e4002b]"><MapPin size={14} /> DELIVERY</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t-2 border-dashed border-gray-200 pt-4 md:border-none md:pt-0">
                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Price</p>
                      <p className="font-['Bebas_Neue'] text-4xl text-[#e4002b]">฿{orderTotal.toLocaleString()}</p>
                    </div>
                    <ChevronRight size={32} className="ml-4 text-gray-300 transition-colors group-hover:text-[#242424]" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {order.orderList?.slice(0, 3).map((item, idx) => (
                    <span key={idx} className="rounded-lg border-2 border-[#242424] bg-[#eeeeee] px-3 py-1 text-xs font-bold">
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                  {order.orderList?.length > 3 && (
                    <span className="rounded-lg border-2 border-[#242424] bg-white px-3 py-1 text-xs font-black">
                      +{order.orderList.length - 3} MORE
                    </span>
                  )}
                </div>
              </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
