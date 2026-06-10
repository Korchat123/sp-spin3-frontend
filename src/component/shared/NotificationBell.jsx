import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  X,
  Clock,
  Bike,
  CalendarDays,
  ShoppingBag,
  FileImage,
  Search,
  Wallet,
  QrCode,
  CheckCircle2,
  Utensils,
} from "lucide-react";
import OrderDetailModal from "../cashier/OrderDetailModal";
import DeclineModal from "../cashier/DeclineModal";
import { orderService } from "../../services/orderService";
import { toCashierOrder, getCashierBranch } from "../../utils/cashierOrders";

const getIconForType = (type) => {
  if (type === "DELIVERY") return Bike;
  if (type === "PICK-UP") return ShoppingBag;
  if (type === "RESERVATION") return CalendarDays;
  return Utensils;
};

const getOrderTime = (order) => {
  if (!order?.createdAt) return "";
  return new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getPaymentMethod = (order) => {
  const method = order?.payment?.method;
  return method ? String(method).toUpperCase() : "CASH";
};

const toNotificationOrder = (order) => {
  const cashierOrder = toCashierOrder(order);
  const details = cashierOrder.items.length
    ? cashierOrder.items.map((item) => `${item.qty}x ${item.name}`).join(", ")
    : "No items";

  return {
    ...cashierOrder,
    status: "NEW",
    time: getOrderTime(order),
    paymentMethod: getPaymentMethod(order),
    details,
    raw: {
      ...cashierOrder.raw,
      slipAttached: !!order?.evidenceImage,
    },
  };
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [declineOrderId, setDeclineOrderId] = useState(null);
  const [declineOrder, setDeclineOrder] = useState(null);
  const [verifiedSlips, setVerifiedSlips] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchPendingOrders = async () => {
    try {
      const data = await orderService.getOrders();
      const pendingOrders = data
        .filter((order) => String(order?.status || "").toLowerCase() === "pending")
        .map(toNotificationOrder);
      setOrders(pendingOrders);
      setStatusMessage("");
    } catch (error) {
      console.error("Failed to fetch cashier notifications:", error);
      setOrders([]);
      setStatusMessage("Unable to sync notifications.");
    }
  };

  useEffect(() => {
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (orderId, action) => {
    const order = orders.find((item) => item.orderId === orderId);
    if (!order?.backendId) return;

    if (action === "Accept" || action === "Acknowledge") {
      try {
        const targetStatus = order.type === "RESERVATION" ? "reserved" : "preparing";
        await orderService.updateOrder(order.backendId, { status: targetStatus });
        setOrders((prev) => prev.filter((item) => item.orderId !== orderId));
        setSelectedOrder(null);
        fetchPendingOrders();
      } catch (error) {
        console.error("Failed to accept order:", error);
        setStatusMessage("Unable to accept this order.");
      }
    } else if (action === "Decline") {
      const orderToDecline = orders.find((item) => item.orderId === orderId);
      setDeclineOrder(orderToDecline || null);
      setDeclineOrderId(orderId);
    }
  };

  const submitDecline = async (orderId, reason) => {
    const order = orders.find((item) => item.orderId === orderId);
    if (!order?.backendId) return;

    try {
      await orderService.updateOrder(order.backendId, {
        status: "cancelled",
        cancelReason: reason,
      });
      setOrders((prev) => prev.filter((item) => item.orderId !== orderId));
      setDeclineOrderId(null);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Failed to decline order:", error);
      setStatusMessage("Unable to decline this order.");
    }
  };

  return (
    <div className="relative font-['IBM_Plex_Sans_Thai'] z-[110]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:bg-red-50 hover:border-red-100 active:scale-95 cursor-pointer transition-all duration-200 group"
      >
        <Bell
          size={24}
          className="text-[#242424] group-hover:text-[#e4002b] transition-colors"
        />
        {orders.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#e4002b] border-2 border-white text-[0.7rem] font-bold text-white shadow-sm animate-bounce">
            {orders.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 flex max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.2)] origin-top-right animate-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-[#242424] text-white flex justify-between items-center border-b-4 border-[#e4002b]">
            <span className="font-bold tracking-wide">
              NEW NOTIFICATIONS ({orders.length})
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-3 bg-gray-50 custom-scrollbar">
            {statusMessage && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
                {statusMessage}
              </div>
            )}

            {orders.length === 0 ? (
              <div className="text-center text-gray-400 py-10 flex flex-col items-center gap-2">
                <Check size={32} className="text-gray-300" />
                <span className="font-bold">No pending orders.</span>
              </div>
            ) : (
              orders.map((order) => {
                const Icon = getIconForType(order.type);
                const needsVerification =
                  order.raw?.slipAttached && !verifiedSlips.includes(order.orderId);

                if (order.type === "RESERVATION" || order.type === "DELIVERY" || order.type === "PICK-UP") {
                  const isReservation = order.type === "RESERVATION";
                  const isDelivery = order.type === "DELIVERY";
                  const isPickup = order.type === "PICK-UP";

                  // Badge styles
                  let badgeClass = "text-blue-700 bg-blue-50 border-blue-100";
                  let badgeText = "Reservation Verification";
                  if (isDelivery) {
                    badgeClass = "text-red-700 bg-red-50 border-red-100";
                    badgeText = "Delivery Verification";
                  } else if (isPickup) {
                    badgeClass = "text-amber-700 bg-amber-50 border-amber-100";
                    badgeText = "Pickup Verification";
                  }

                  // Accept action text
                  let acceptText = "Accept Reservation";
                  if (isDelivery) acceptText = "Accept Delivery";
                  if (isPickup) acceptText = "Accept Pickup";

                  // View button text
                  const viewBtnText = order.raw?.slipAttached ? "View Slip" : "View Details";

                  return (
                    <div
                      key={order.orderId}
                      className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl mb-3 last:mb-0 hover:border-gray-300 transition-all flex flex-col gap-3"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className={`flex items-center gap-1.5 text-[0.65rem] font-bold ${badgeClass} px-2 py-1 rounded w-fit border uppercase tracking-wider whitespace-nowrap`}>
                            <Icon size={12} strokeWidth={2.5} /> {badgeText}
                          </div>
                          <p className="font-['Bebas_Neue'] text-[#242424] text-3xl leading-[0.95] mt-0.5 break-words">
                            {order.orderId}
                          </p>
                        </div>

                        <div className="flex flex-row flex-wrap items-center gap-1.5 sm:flex-col sm:items-end">
                          <span className="text-[0.65rem] font-bold text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <Clock size={10} /> {order.time}
                          </span>
                          <div className="flex gap-1.5">
                            {String(order.paymentMethod || order.raw?.payment?.method || "").toUpperCase() === "PROMPTPAY" && (
                              <span className="flex items-center gap-1 text-[0.6rem] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 uppercase">
                                <QrCode size={10} /> PROMPTPAY
                              </span>
                            )}
                            {String(order.paymentMethod || order.raw?.payment?.method || "").toUpperCase() === "CASH" && (
                              <span className="flex items-center gap-1 text-[0.6rem] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 uppercase">
                                <Wallet size={10} /> CASH
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 bg-gray-50 p-2.5 rounded-lg border border-gray-100 font-medium text-gray-700">
                        <div>
                          <span className="text-gray-400 font-bold uppercase text-[10px]">Customer:</span>{" "}
                          <span className="text-[#242424] font-bold">{order.raw?.customer?.name || "Walk-in Customer"}</span>
                        </div>

                        {isReservation && (
                          <>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Date:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.bookingDate || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Time:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.bookingTime || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Pax:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.reservationPax || order.raw?.pax || 2} Persons</span>
                            </div>
                          </>
                        )}

                        {isDelivery && (
                          <>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Phone:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.customer?.phone || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Address:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.address || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Branch:</span>{" "}
                              <span className="text-[#242424] font-bold">{getCashierBranch(order.raw) || "Asok Branch (HQ)"}</span>
                            </div>
                          </>
                        )}

                        {isPickup && (
                          <>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Phone:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.customer?.phone || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Pickup Time:</span>{" "}
                              <span className="text-[#242424] font-bold">{order.raw?.pickupTime || "N/A"}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-bold uppercase text-[10px]">Branch:</span>{" "}
                              <span className="text-[#242424] font-bold">{getCashierBranch(order.raw) || "Asok Branch (HQ)"}</span>
                            </div>
                          </>
                        )}

                        {!isReservation && (
                          <div className="border-t border-dashed border-gray-200 pt-2 mt-2">
                            <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">Items Ordered:</span>
                            <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1 pr-1 bg-white p-2 rounded border border-gray-200">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between items-start text-[11px] text-[#242424]">
                                    <span className="font-semibold text-gray-800">
                                      <span className="text-[#e4002b] font-black mr-1">{item.qty}x</span> {item.name}
                                      {item.note && <span className="text-gray-400 italic text-[10px] ml-1">({item.note})</span>}
                                    </span>
                                    <span className="font-bold text-gray-600">฿{(item.price * item.qty).toLocaleString()}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-gray-400 text-[11px] italic">No items</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {order.raw?.slipAttached && (
                        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border font-medium w-full
                          ${
                            needsVerification
                              ? "text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd] animate-pulse"
                              : "text-[#166534] bg-[#dcfce3] border-[#bbf7d0]"
                          }`}
                        >
                          {needsVerification ? (
                            <>
                              <FileImage size={14} />
                              <span>Verify payment slip</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={14} />
                              <span>Slip Verified</span>
                            </>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Search size={14} strokeWidth={2.5} /> {viewBtnText}
                        </button>

                        <button
                          disabled={needsVerification}
                          onClick={() => handleAction(order.orderId, "Accept")}
                          className={`flex-[1.5] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200
                            ${
                              needsVerification
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                                : "bg-[#242424] text-white hover:bg-[#e4002b] active:scale-95 shadow-[0_3px_0_#000000] hover:shadow-[0_3px_0_#a0001e] active:shadow-none active:translate-y-0.75 cursor-pointer"
                            }`}
                        >
                          <Check size={16} strokeWidth={3} /> {acceptText}
                        </button>

                        <button
                          onClick={() => handleAction(order.orderId, "Decline")}
                          className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-400 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-[#e4002b] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                        >
                          <X size={16} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={order.orderId}
                    className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl mb-3 last:mb-0 hover:border-gray-300 transition-all flex flex-col gap-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-[#e4002b] bg-red-50 px-2 py-1 rounded w-fit border border-red-100 uppercase tracking-wider">
                          <Icon size={12} strokeWidth={2.5} /> {order.type}
                        </div>
                        <p className="font-['Bebas_Neue'] text-[#242424] text-3xl leading-[0.95] mt-0.5 break-words">
                          {order.orderId}
                        </p>
                      </div>

                      <div className="flex flex-row flex-wrap items-center gap-1.5 sm:flex-col sm:items-end">
                        <span className="text-[0.65rem] font-bold text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          <Clock size={10} /> {order.time}
                        </span>

	                        <div className="flex flex-wrap gap-1.5">
                          {order.paymentMethod === "CASH" && (
                            <span className="flex items-center gap-1 text-[0.6rem] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                              <Wallet size={10} /> CASH
                            </span>
                          )}
                          {order.paymentMethod !== "CASH" && (
                            <span className="flex items-center gap-1 text-[0.6rem] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                              <QrCode size={10} /> {order.paymentMethod}
                            </span>
                          )}

                          {order.raw?.slipAttached && (
                            <span
                              className={`flex items-center gap-1 text-[0.6rem] font-bold px-2 py-0.5 rounded border transition-colors
                              ${
                                needsVerification
                                  ? "text-[#0284c7] bg-[#e0f2fe] border-[#bae6fd] animate-pulse"
                                  : "text-[#166534] bg-[#dcfce3] border-[#bbf7d0]"
                              }`}
                            >
                              {needsVerification ? (
                                <>
                                  <FileImage size={10} /> VERIFY SLIP
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={10} /> SLIP VERIFIED
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="max-h-24 overflow-y-auto whitespace-normal break-words border-b border-dashed border-gray-100 pb-2 pr-1 text-sm font-medium leading-relaxed text-gray-500 custom-scrollbar">
                      {order.details}
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 bg-white border-2 border-gray-200 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Search size={14} strokeWidth={2.5} /> View
                      </button>

                      <button
                        disabled={needsVerification}
                        onClick={() => handleAction(order.orderId, "Accept")}
                        className={`flex-[1.2] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200
                          ${
                            needsVerification
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                              : "bg-[#242424] text-white hover:bg-[#e4002b] active:scale-95 shadow-[0_3px_0_#000000] hover:shadow-[0_3px_0_#a0001e] active:shadow-none active:translate-y-0.75 cursor-pointer"
                          }`}
                      >
                        <Check size={16} strokeWidth={3} /> ACCEPT
                      </button>

                      <button
                        onClick={() => handleAction(order.orderId, "Decline")}
                        className="px-3 py-2 bg-white border-2 border-gray-200 text-gray-400 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 hover:text-[#e4002b] active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <OrderDetailModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
        isFromBell={true}
        isSlipVerified={verifiedSlips.includes(selectedOrder?.orderId)}
        onConfirmPayment={(orderId) => {
          setVerifiedSlips((prev) => [...prev, orderId]);
        }}
      />

      <DeclineModal
        isOpen={!!declineOrderId}
        onClose={() => { setDeclineOrderId(null); setDeclineOrder(null); }}
        orderId={declineOrderId}
        order={declineOrder}
        onConfirm={submitDecline}
      />
    </div>
  );
};

export default NotificationBell;
