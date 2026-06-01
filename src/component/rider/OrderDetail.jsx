import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryStatusView from "./DeliveryStatusView";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const getOrderNo = (order) => (order?._id ? order._id.slice(-6).toUpperCase() : "N/A");

const getCustomerName = (order) =>
  order?.customer?.name || order?.customer?.contact || `Order ${getOrderNo(order)}`;

export default function OrderDetail() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [riderNote, setRiderNote] = useState("");
  const [failureReason, setFailureReason] = useState("Cannot contact customer");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
        setError("");
      } catch (fetchError) {
        console.error("Failed to load delivery order:", fetchError);
        setError("Unable to load this delivery order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const totalPrice = useMemo(() => getOrderTotal(order), [order]);
  const isKitchenReady = useMemo(
    () => (order?.orderList || []).every((item) => item.status === "finished"),
    [order],
  );

  const updateOrderStatus = async (status) => {
    if (!order?._id) return;
    setSaving(true);
    try {
      const updatedOrder = await orderService.updateOrder(order._id, {
        status,
        riderNote: status === "delivered" ? riderNote : failureReason,
      });
      setOrder(updatedOrder);
      setError("");
    } catch (updateError) {
      console.error("Failed to update delivery order:", updateError);
      setError("Unable to update this delivery order.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-white p-8 text-center font-sans shadow-2xl">
        <h1 className="text-2xl font-black uppercase">Loading order...</h1>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-white p-8 text-center font-sans shadow-2xl">
        <h1 className="mb-4 text-2xl font-black uppercase text-red-600">Order Not Found</h1>
        <p className="mb-6 text-sm text-gray-600">{error || `No order found for ${orderId}`}</p>
        <button
          onClick={() => navigate("/driver")}
          className="rounded-3xl bg-[#D33131] px-6 py-3 font-black uppercase text-white shadow-lg"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  if (order.status === "delivered") {
    return (
      <DeliveryStatusView
        order={order}
        isSuccess
        customReason={order.riderNote || riderNote || "Delivered successfully"}
        onBackToTasks={() => navigate("/driver")}
      />
    );
  }

  if (order.status === "cancelled") {
    return (
      <DeliveryStatusView
        order={order}
        isSuccess={false}
        reason={order.riderNote || failureReason}
        onBackToTasks={() => navigate("/driver")}
      />
    );
  }

  if (order.type !== "delivery" || order.status !== "delivery" || !isKitchenReady) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-white p-8 text-center font-sans shadow-2xl">
        <h1 className="mb-4 text-2xl font-black uppercase">Order #{getOrderNo(order)} is not ready</h1>
        <p className="mb-6 text-sm text-gray-600">
          This order is not currently assigned to delivery. Kitchen must finish all items first.
        </p>
        <button
          onClick={() => navigate("/driver")}
          className="rounded-3xl bg-[#D33131] px-6 py-3 font-black uppercase text-white shadow-lg"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white pb-8 font-sans shadow-2xl">
      <div className="flex items-center justify-between px-4 py-5">
        <button
          onClick={() => navigate("/driver")}
          className="rounded-full bg-gray-100 px-4 py-2 text-xs font-black uppercase text-black"
        >
          Back
        </button>
        <h1 className="text-xl font-black uppercase">Order #{getOrderNo(order)}</h1>
        <div className="w-16" />
      </div>

      {error && (
        <div className="mx-4 mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-center text-xs font-black text-red-700">
          {error}
        </div>
      )}

      <div className="mx-4 mb-4 rounded-[2rem] border-2 border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 border-b border-gray-100 pb-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</p>
          <h2 className="text-xl font-black text-black">{getCustomerName(order)}</h2>
          <p className="mt-1 text-xs font-bold text-gray-500">{order.customer?.contact || "No contact provided"}</p>
        </div>

        <div className="mb-4 rounded-2xl bg-gray-50 p-4">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Address</p>
          <p className="text-sm font-bold leading-snug text-gray-700">
            {order.customer?.address || "No delivery address on order"}
          </p>
        </div>

        {order.customer?.note && (
          <div className="mb-4 rounded-2xl bg-yellow-50 p-4">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-yellow-700">Order Note</p>
            <p className="text-xs font-bold leading-snug text-yellow-900">{order.customer.note}</p>
          </div>
        )}

        <div className="space-y-3">
          {(order.orderList || []).map((item) => (
            <div key={item._id || item.id || item.name} className="flex items-center justify-between rounded-2xl border border-gray-100 p-3">
              <div>
                <p className="font-black text-black">{item.name || "Menu item"}</p>
                <p className="text-xs font-bold uppercase text-gray-400">Qty {item.quantity || item.qty || 1}</p>
              </div>
              <span className="text-sm font-black text-[#D33131]">
                THB {((item.price || item.price_at_purchase || 0) * (item.quantity || item.qty || 1)).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-black uppercase text-gray-500">Total</span>
          <span className="text-2xl font-black text-[#D33131]">THB {totalPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="mx-4 mb-4 rounded-[1.5rem] border-2 border-gray-200 bg-white p-4">
        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">
          Delivery note
        </label>
        <textarea
          value={riderNote}
          onChange={(event) => setRiderNote(event.target.value)}
          placeholder="Drop-off note, recipient, or proof details"
          className="h-24 w-full resize-none rounded-2xl border border-gray-200 p-3 text-sm font-bold outline-none focus:border-[#D33131]"
        />
      </div>

      <div className="mx-4 mb-4 rounded-[1.5rem] border-2 border-gray-200 bg-white p-4">
        <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-gray-400">
          Failure reason
        </label>
        <select
          value={failureReason}
          onChange={(event) => setFailureReason(event.target.value)}
          className="w-full rounded-2xl border border-gray-200 p-3 text-sm font-bold outline-none focus:border-[#D33131]"
        >
          <option>Cannot contact customer</option>
          <option>Incorrect address</option>
          <option>Customer refused delivery</option>
          <option>Vehicle issue</option>
          <option>Severe weather</option>
        </select>
      </div>

      <div className="mx-4 flex gap-3">
        <button
          onClick={() => updateOrderStatus("cancelled")}
          disabled={saving}
          className="flex-1 rounded-3xl border-2 border-[#D33131] bg-white py-4 text-xs font-black uppercase text-[#D33131] disabled:opacity-60"
        >
          Mark Failed
        </button>
        <button
          onClick={() => updateOrderStatus("delivered")}
          disabled={saving}
          className="flex-1 rounded-3xl bg-[#D33131] py-4 text-xs font-black uppercase text-white shadow-lg shadow-red-200 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Delivered"}
        </button>
      </div>
    </div>
  );
}
