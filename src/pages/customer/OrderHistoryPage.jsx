// src/pages/customer/OrderHistoryPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  History,
  Clock,
  Bike,
  Store,
  RefreshCw,
  XCircle,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  Eye,
  CalendarCheck,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

import { orderService } from "../../services/orderService";
import { useShop } from "../../context/ShopProvider";
import { UserContext } from "../../context/userContext/UserContext";
import {
  filterOrdersForUser,
  getActiveOrderItems,
  getCancelledOrderItems,
  getCancelledRefundAmount,
  getCustomerOrderMode,
  getCustomerOrderServiceText,
  getOrderNumber,
  getOrderTotal,
  isPastOrderStatus,
} from "../../utils/customerOrders";

import PickupConfirmation from "../../component/customer/PickupConfirmation";
import DeliveryConfirmation from "../../component/customer/DeliveryConfirmation";
import ReserveConfirmation from "../../component/customer/ReserveConfirmation";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { reorderItems, setIsCartOpen } = useShop();
  const { myUserInfo } = React.useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูล
  useEffect(() => {
    const fetchOrderHistory = async () => {
      setLoading(true);
      try {
        const data = await orderService.getOrders();
        setOrders(filterOrdersForUser(data, myUserInfo));
      } catch (err) {
        console.error("Fetch Error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderHistory();
  }, [myUserInfo]);

  // 💡 ปรับปรุงสีสถานะของตัว Reservation เพิ่มเติม
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-500 text-white";
    switch (status.toLowerCase()) {
      case "completed":
      case "delivered":
      case "picked_up":
      case "paid": // เพิ่มกรณีชำระเงินเรียบร้อยของ Reservation
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
      case "preparing":
      case "cooking":
      case "reserved": // เพิ่มกรณีจองโต๊ะสำเร็จ
      case "checked-in": // เพิ่มกรณีลูกค้าจองมาถึงหน้าร้านแล้ว
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getIconByType = (type) => {
    if (type === "delivery") return <Bike size={14} />;
    if (type === "reserve") return <CalendarCheck size={14} />;
    return <Store size={14} />;
  };

  const handleReorder = (order) => {
    const addedCount = reorderItems(order.orderList || []);
    if (addedCount > 0) {
      setSelectedOrder(null);
      setIsCartOpen(true);
      navigate("/menu?cart=open");
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการยกเลิกออเดอร์นี้?")) {
      try {
        const updatedOrder = await orderService.cancelOrder(id);
        setOrders(orders.map((o) => (o._id === id ? updatedOrder : o)));
      } catch (error) {
        console.error("Cancel order failed:", error);
        alert("Unable to cancel this order right now.");
      }
    }
  };

  const handleReview = (id) => {
    alert(
      "ขอบคุณที่รีวิวร้าน Serious Fried Chicken ของเรา! (ระบบจะตามมาในอนาคต)",
    );
    setOrders(
      orders.map((o) => (o._id === id ? { ...o, isReviewed: true } : o)),
    );
  };

  const ongoingOrders = orders.filter((o) => !isPastOrderStatus(o.status));
  const pastOrders = orders.filter((o) => isPastOrderStatus(o.status));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#eeeeee]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#242424] border-t-[#e4002b]"></div>
        <p className="mt-4 font-black uppercase tracking-widest text-gray-500">
          Loading your feast history...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eeeeee] font-['IBM_Plex_Sans_Thai'] text-[#242424] p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-3 border-b-4 border-[#242424] pb-4">
          <History size={36} className="text-[#e4002b]" />
          <h1 className="text-5xl font-black font-['Bebas_Neue'] tracking-wider">
            ORDER HISTORY
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 p-4 md:p-5 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="flex flex-col gap-1 w-full md:w-auto text-center md:text-left">
            <h2 className="font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
              <MessageSquare size={18} className="text-[#e4002b]" /> Need help
              with your order?
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-5 text-sm text-gray-500 font-medium mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> SFC Asok (HQ)
              </span>
              <span className="flex items-center gap-1">
                <Phone size={14} /> 02-XXX-XXXX
              </span>
            </div>
          </div>
          <button
            disabled
            className="w-full md:w-auto flex justify-center items-center gap-2 bg-gray-100 text-gray-400 font-bold py-2 px-5 rounded-xl border border-gray-200 cursor-not-allowed text-sm"
          >
            Chatbot (Coming Soon)
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-4xl border-4 border-[#242424] bg-white p-12 text-center shadow-[12px_12px_0_#242424]">
            <ShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wider">
              NO ORDERS YET
            </h2>
            <p className="mt-2 font-bold text-gray-500 uppercase tracking-wide">
              Time to start your Serious Fried Chicken adventure!
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-8 inline-block cursor-pointer rounded-full border-2 border-[#242424] bg-[#e4002b] px-10 py-4 font-['Bebas_Neue'] text-2xl tracking-widest text-white shadow-[6px_6px_0_#242424]"
            >
              ORDER NOW
            </button>
          </div>
        ) : (
          <>
            <section className="mb-14">
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#e4002b]">
                <Clock size={20} /> ON GOING ORDERS ({ongoingOrders.length})
              </h2>
              <div className="flex flex-col gap-4">
                {ongoingOrders.length === 0 ? (
                  <div className="bg-white border-2 border-dashed border-gray-300 p-8 text-center rounded-2xl text-gray-400 font-bold">
                    No on-going orders.
                  </div>
                ) : (
                  ongoingOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white border-4 border-[#242424] rounded-2xl p-6 shadow-[6px_6px_0_#242424] transition-transform hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start border-b border-gray-100 pb-3 mb-3">
                        <div>
                          <span className="text-xs font-black text-gray-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                          <h3 className="text-xl font-black text-[#e4002b]">
                            {getOrderNumber(order)}
                          </h3>
                        </div>
                        <div
                          className={`flex items-center gap-1 border-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}
                        >
                          {getIconByType(getCustomerOrderMode(order))}{" "}
                          {getCustomerOrderMode(order)} :{" "}
                          {order.status}
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            {getActiveOrderItems(order)
                              .map((i) => `${i.name} (x${i.quantity || 1})`)
                              .join(", ")}
                          </p>
                          <div className="mt-2 font-black text-lg">
                            Total:{" "}
                            <span className="text-[#242424]">
                              ฿{getOrderTotal(order).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex-1 md:flex-none bg-[#eeeeee] hover:bg-[#242424] hover:text-white border-2 border-[#242424] px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Eye size={16} /> DETAILS
                          </button>
                          {(order.status === "pending" ||
                            order.status === "cooking" ||
                            order.status === "reserved") && ( // เพิ่มอนุญาตให้ยกเลิกการจองได้
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="flex-1 md:flex-none bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <XCircle size={16} /> CANCEL
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2 text-[#242424]">
                <History size={20} /> PAST ORDERS ({pastOrders.length})
              </h2>
              <div className="flex flex-col gap-3">
                {pastOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-[#242424] hover:shadow-[4px_4px_0_#242424] transition-all group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-black text-[#242424]">
                          {getOrderNumber(order)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium truncate max-w-xs md:max-w-md">
                        {getActiveOrderItems(order)
                          .map((i) => `${i.name} (x${i.quantity || 1})`)
                          .join(", ")}
                        {getCancelledOrderItems(order).length > 0 && (
                          <span className="ml-2 font-bold text-red-600">
                            Refund ฿{getCancelledRefundAmount(order).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} pending
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm font-bold text-[#242424]">
                          ฿{getOrderTotal(order).toLocaleString()}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-xs font-bold text-gray-400 hover:text-[#e4002b] flex items-center gap-0.5 cursor-pointer"
                        >
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                      {(order.status === "delivered" ||
                        order.status === "picked_up" ||
                        order.status === "paid") && // เพิ่มเงื่อนไขให้สามารถรีวิวได้หลังจากสถานะเสร็จสมบูรณ์
                        !order.isReviewed && (
                          <button
                            onClick={() => handleReview(order._id)}
                            className="text-yellow-600 hover:bg-yellow-50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer border border-transparent hover:border-yellow-200"
                          >
                            <Star size={14} /> REVIEW
                          </button>
                        )}
                      <button
                        onClick={() => handleReorder(order)}
                        className="bg-white border-2 border-gray-200 hover:border-[#242424] hover:bg-[#242424] hover:text-white text-[#242424] px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw size={14} /> RE-ORDER
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* ======================= MODALS (3 สไตล์ของบัว) ======================= */}
      {selectedOrder && getCustomerOrderMode(selectedOrder) === "pickup" && (
        <PickupConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          orderNo={getOrderNumber(selectedOrder)}
          menuList={getActiveOrderItems(selectedOrder).map(
            (i) => `${i.name || "Menu item"} (x${i.quantity || 1})`,
          )}
          cancelledItems={getCancelledOrderItems(selectedOrder).map(
            (i) => `${i.name || "Menu item"} (x${i.quantity || 1})`,
          )}
          refundAmount={getCancelledRefundAmount(selectedOrder)}
          totalPrice={getOrderTotal(selectedOrder)}
          deliveryTime={getCustomerOrderServiceText(selectedOrder)}
          status={selectedOrder.status}
        />
      )}

      {selectedOrder && getCustomerOrderMode(selectedOrder) === "delivery" && (
        <DeliveryConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          orderNo={getOrderNumber(selectedOrder)}
          menuList={getActiveOrderItems(selectedOrder).map(
            (i) => `${i.name || "Menu item"} (x${i.quantity || 1})`,
          )}
          cancelledItems={getCancelledOrderItems(selectedOrder).map(
            (i) => `${i.name || "Menu item"} (x${i.quantity || 1})`,
          )}
          refundAmount={getCancelledRefundAmount(selectedOrder)}
          totalPrice={getOrderTotal(selectedOrder)}
          deliveryTime={getCustomerOrderServiceText(selectedOrder)}
          address={selectedOrder.customer?.address || "SFC Asok (HQ)"}
          status={selectedOrder.status}
        />
      )}

      {selectedOrder && getCustomerOrderMode(selectedOrder) === "reserve" && (
        <ReserveConfirmation
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          tableNo={selectedOrder.tableId || "TBA"}
          date={selectedOrder.bookingDate || new Date(selectedOrder.createdAt).toLocaleDateString()}
          time={selectedOrder.bookingTime || new Date(selectedOrder.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          person={selectedOrder.customer?.pax || 2}
          menuList={getActiveOrderItems(selectedOrder).map(
            (i) => `${i.name || "Menu item"} (x${i.quantity || 1})`,
          )}
          cancelledItems={getCancelledOrderItems(selectedOrder).map(
            (i) => `${i.name || "Menu item"} (x${i.quantity || 1})`,
          )}
          refundAmount={getCancelledRefundAmount(selectedOrder)}
          status={selectedOrder.status}
        />
      )}
    </div>
  );
}
