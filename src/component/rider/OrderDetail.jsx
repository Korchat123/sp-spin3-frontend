import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeliveryStatusView from "./DeliveryStatusView";
import { orderService } from "../../services/orderService";
import { getOrderTotal } from "../../utils/customerOrders";

const StageIndicator = ({ currentStage }) => {
  const stages = [
    { id: 1, label: 'Pick Up', icon: '📦' },
    { id: 2, label: 'On Way', icon: '🛵' },
    { id: 3, label: 'Finish', icon: '✅' },
  ];

  return (
    <div className="flex justify-between items-center px-4 py-6 bg-white rounded-[2rem] shadow-sm mb-6 border border-gray-50">
      {stages.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1 z-10">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-500 ${
              currentStage >= s.id ? 'bg-[#E4002B] text-white shadow-lg shadow-red-100' : 'bg-gray-100 text-gray-400'
            }`}>
              {s.icon}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              currentStage >= s.id ? 'text-[#E4002B]' : 'text-gray-300'
            }`}>{s.label}</span>
          </div>
          {idx < stages.length - 1 && (
            <div className="flex-1 h-1 mx-2 bg-gray-100 rounded-full relative overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-[#E4002B] transition-all duration-700"
                style={{ width: currentStage > s.id ? '100%' : '0%' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
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

  const startCamera = async (isFailureProof = false) => {
    setShowCamera(true);
    window._isFailureProof = isFailureProof; 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera Access Denied: " + err.message);
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    const imgData = canvasRef.current.toDataURL('image/png');
    
    if (window._isFailureProof) {
      setFailedCapturedImage(imgData);
      updateOrderStatus('cancelled', imgData);
      setViewMode('failed_summary');
    } else {
      setCapturedImage(imgData);
    }

    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const updateOrderStatus = async (newStatus, evidenceImg = null) => {
    try {
      const updates = { status: newStatus };
      if (evidenceImg) updates.evidenceImage = evidenceImg;

      // Use both id and orderId to ensure context catches it
      await updateOrder(currentOrder.id, updates);
      if (currentOrder.orderId) {
        await updateOrder(currentOrder.orderId, updates);
      }
    } catch (err) {
      alert("Update Failed: " + err.message);
    }
  };

  const handleMainAction = async () => {
    if (currentStage === 1) {
      setCurrentStage(2);
      await updateOrderStatus('shipping');
    } else if (currentStage === 2 && !capturedImage) {
      await startCamera(false);
    } else if (currentStage === 2 && capturedImage) {
      await updateOrderStatus('delivered', capturedImage);
      setCurrentStage(3);
    }
  };

  const cancellationReasons = [
    "Customer not reachable",
    "Incorrect address",
    "Accident / Vehicle breakdown",
    "Restricted access to area",
    "Order damaged during transit",
    "Other"
  ];

  const handleCancelSubmit = async () => {
    if (!selectedReason) {
      alert("Please select a reason for cancellation");
      return;
    }
    const finalReason = selectedReason === "Other" ? customReason : selectedReason;
    if (selectedReason === "Other" && !customReason) {
      alert("Please provide details for the other reason");
      return;
    }
    
    // Simulate notifying customer
    console.log(`Notifying customer ${currentOrder.customer?.name} about cancellation: ${finalReason}`);
    alert(`Order Cancelled. Customer ${currentOrder.customer?.name || 'Guest'} has been notified via SMS/App.`);
    
    await updateOrderStatus('cancelled');
    setViewMode('failed_summary');
  };

  if (viewMode === 'reason') {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen font-sans flex flex-col">
        <div className="px-6 py-6 flex items-center gap-4 border-b border-gray-50">
          <button onClick={() => setViewMode('normal')} className="w-10 h-10 flex items-center justify-center text-xl">←</button>
          <h1 className="text-base font-black uppercase tracking-widest">Cancel Order</h1>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-xl font-black mb-2">Why are you cancelling?</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Please select the most accurate reason.</p>
          </div>

          <div className="space-y-3">
            {cancellationReasons.map((reason) => (
              <button
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className={`w-full p-5 rounded-2xl text-left font-bold text-sm transition-all border-2 ${
                  selectedReason === reason 
                  ? 'border-[#E4002B] bg-red-50 text-[#E4002B]' 
                  : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  {reason}
                  {selectedReason === reason && <span className="text-lg">●</span>}
                </div>
              </button>
            ))}
          </div>

          {selectedReason === "Other" && (
            <div className="mt-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Additional Details</p>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please describe the issue..."
                className="w-full p-5 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-medium focus:ring-2 focus:ring-red-100 outline-none min-h-[120px]"
              />
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-50">
          <button 
            onClick={handleCancelSubmit}
            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all ${
              selectedReason 
              ? 'bg-[#E4002B] text-white shadow-red-100' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            Confirm Cancellation
          </button>
        </div>
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
