import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
import DeliveryStatusView from './DeliveryStatusView';

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

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orderList, updateOrder, fetchAllOrders } = useContext(OrdersContext);

  useEffect(() => {
    if (!orderList || orderList.length === 0) {
      fetchAllOrders();
    }
  }, [fetchAllOrders, orderList]);

  const currentOrder = orderList?.find(o => 
    String(o.id) === String(orderId) || 
    String(o.orderId) === String(orderId)
  );

  const [viewMode, setViewMode] = useState('normal'); 
  const [currentStage, setCurrentStage] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [failedCapturedImage, setFailedCapturedImage] = useState(null);
  const [riderNote, setRiderNote] = useState("");
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (currentOrder?.status === 'delivered') setCurrentStage(3);
    else if (currentOrder?.status === 'cancelled') setViewMode('failed_summary');
  }, [currentOrder]);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen p-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-6">🔍</div>
        <h1 className="text-2xl font-black mb-2">Order Not Found</h1>
        <p className="text-sm text-gray-500 mb-8">We couldn't find the order you're looking for.</p>
        <button onClick={() => navigate('/driver')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  const isReadyToDeliver = currentOrder.orderList?.every(item => item.status === "finished");
  const totalPrice = currentOrder.orderList?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  if (currentOrder.status === 'delivered' || currentStage === 3) {
    return (
      <DeliveryStatusView 
        order={currentOrder} 
        isSuccess={true} 
        customReason={riderNote || "Delivered successfully"} 
        capturedImage={capturedImage || "/images/placeholder.png"}
        onBackToTasks={() => navigate('/driver')}
      />
    );
  }

  if (currentOrder.status === 'cancelled' || viewMode === 'failed_summary') {
    return (
      <DeliveryStatusView 
        order={currentOrder} 
        isSuccess={false} 
        reason={selectedReason || "Cancelled"} 
        customReason={customReason}
        capturedImage={failedCapturedImage || "/images/placeholder.png"}
        onBackToTasks={() => navigate('/driver')}
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
    <div className="max-w-md mx-auto bg-[#F8F9FA] min-h-screen font-sans pb-32">
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
        <button
          onClick={() => navigate('/driver')}
          className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          ←
        </button>
        <div className="text-center flex-1">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.38em] text-gray-400">Order Details</p>
          <h1 className="text-sm sm:text-base font-black text-gray-900">#{String(currentOrder.id).slice(-6).toUpperCase()}</h1>
        </div>
        <button onClick={() => setViewMode('reason')} className="w-10 h-10 flex items-center justify-center text-gray-400">⚠️</button>
      </div>

      <div className="p-4 sm:p-6">
        <StageIndicator currentStage={currentStage} />

        {/* Location Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-50">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl">📍</div>
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
              <p className="text-xs sm:text-sm font-black text-gray-800 leading-tight">{currentOrder.customer?.address || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl">👤</div>
            <div className="flex-1">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
              <div className="flex justify-between items-center">
                <p className="text-xs sm:text-sm font-black text-gray-800">{currentOrder.customer?.name || 'Guest'}</p>
                <a href={`tel:${currentOrder.customer?.contact}`} className="text-[10px] sm:text-xs font-bold text-[#E4002B] bg-red-50 px-2 sm:px-3 py-1 rounded-full">Call</a>
              </div>
            </div>
          </div>
        </div>

        {/* Items Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items ({currentOrder.orderList?.length})</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {currentOrder.orderList?.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <img src={item.image} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover bg-gray-50" alt="" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs font-black uppercase leading-none truncate">{item.name}</p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1">QTY: {item.quantity}</p>
                </div>
                <p className="text-[11px] sm:text-xs font-black">฿{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400">TOTAL</span>
            <span className="text-base sm:text-lg font-black text-[#E4002B]">฿{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Note Card */}
        {currentOrder.customer?.note && (
          <div className="bg-yellow-50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-yellow-100 mb-10">
            <p className="text-[9px] sm:text-[10px] font-bold text-yellow-700 uppercase tracking-widest mb-1">Customer Note</p>
            <p className="text-[11px] sm:text-xs font-medium text-yellow-800 leading-relaxed italic">"{currentOrder.customer.note}"</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent pt-10 z-30">
        <div className="max-w-md mx-auto flex gap-3">
          <button 
            onClick={handleMainAction}
            className={`w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 ${
              currentStage === 2 && capturedImage ? 'bg-[#E4002B]' : 
              currentStage === 3 ? 'bg-green-500' : 'bg-gray-900'
            } text-white shadow-gray-200`}
          >
            {currentStage === 1 && "Start Delivery"}
            {currentStage === 2 && !capturedImage && "Confirm Arrival"}
            {currentStage === 2 && capturedImage && "Complete Order"}
            {currentStage === 3 && "Order Finished ✅"}
          </button>
        </div>
      </div>

      {/* Camera UI - Full Screen */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-between py-10">
          <div className="w-full px-6 flex justify-between items-center text-white">
            <button onClick={() => setShowCamera(false)} className="text-sm font-bold uppercase tracking-widest">Cancel</button>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Proof of Delivery</span>
            <div className="w-10"></div>
          </div>
          <video ref={videoRef} autoPlay playsInline className="w-full max-h-[60vh] object-cover" />
          <div className="flex flex-col items-center gap-6">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Center items in frame</p>
            <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-8 border-white/20 active:scale-90 transition-transform" />
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default OrderDetail;
