import React, { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Phone, MessageSquare, CheckCircle2, AlertCircle, Package } from 'lucide-react';
import DeliveryStatusView from './DeliveryStatusView';
import { orderService } from '../../services/orderService';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
import { UserContext } from '../../context/userContext/UserContext';
import { getOrderNo } from '../../utils/riderOrders';

const StageStep = ({ active, completed, stage, text, icon: Icon }) => (
  <div className="flex flex-col items-center gap-2 flex-1 relative">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${
      active ? 'bg-[#D33131] text-white shadow-[0_8px_20px_rgba(211,49,49,0.3)] scale-110' : 
      completed ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
    }`}>
      <Icon size={20} />
    </div>
    <div className="flex flex-col items-center">
      <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-[#D33131]' : 'text-gray-400'}`}>Stage {stage}</span>
      <span className={`text-[9px] font-bold ${active ? 'text-black' : 'text-gray-400'}`}>{text}</span>
    </div>
  </div>
);

const getCustomerPhone = (order) =>
  order?.customer?.contact ||
  order?.customer?.phone ||
  order?.customer?.tel ||
  order?.customer?.mobile ||
  "";

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { myUserInfo } = useContext(UserContext);
  const { orderList, updateOrder, fetchAllOrders } = useContext(OrdersContext);
  
  const [order, setOrder] = useState(() => {
    return orderList?.find(o => (o._id === orderId || o.orderId === orderId)) || null;
  });
  const [loading, setLoading] = useState(!order);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('normal'); 
  const [showCamera, setShowCamera] = useState(false);
  const [capturedEvidenceImage, setCapturedEvidenceImage] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const highestStageRef = useRef(1);

  // Derive stage directly from order status for consistency
  // Enforce one-way progression: once Stage 2 is reached, it cannot go back to 1 in the same session.
  const currentStage = useMemo(() => {
    let stage = 1;
    if (order?.status) {
      const s = String(order.status).trim().toLowerCase();
      if (s === 'delivered' || s === 'completed' || s === 'finished') stage = 3;
      else if (s === 'shipping' || s === 'on_the_way' || s === 'on-the-way') stage = 2;
    }
    
    // Persist the highest stage seen for this order session (prevents flickering during status updates)
    if (stage > highestStageRef.current) {
      highestStageRef.current = stage;
    }
    
    return highestStageRef.current;
  }, [order?.status]);

  useEffect(() => {
    // Reset highest stage if orderId changes
    highestStageRef.current = 1;
  }, [orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Cache-busting to ensure fresh data
        const data = await orderService.getOrder(`${orderId}?t=${Date.now()}`);
        console.log("Fetched order status:", data.status);
        setOrder(data);
        setError("");
      } catch (fetchError) {
        console.error("Failed to load delivery order:", fetchError);
        // Only set error if we don't have order data from context
        if (!order) setError("Unable to load this delivery order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, orderList]); // Sync with context updates if needed

  const orderItems = useMemo(() => order?.orderList || [], [order]);
  const customerPhone = useMemo(() => getCustomerPhone(order), [order]);
  const isReadyToDeliver = useMemo(() => orderItems.every(item => item.status === "finished"), [orderItems]);

  const startCamera = async (isFailureProof = false) => {
    setShowCamera(true);
    window._isFailureProof = isFailureProof; 
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Cannot access camera: " + err.message);
      setShowCamera(false);
    }
  };

  const takePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    const sourceWidth = videoRef.current.videoWidth;
    const sourceHeight = videoRef.current.videoHeight;
    const maxSize = 900;
    const scale = Math.min(1, maxSize / Math.max(sourceWidth, sourceHeight));
    canvasRef.current.width = Math.round(sourceWidth * scale);
    canvasRef.current.height = Math.round(sourceHeight * scale);
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imgData = canvasRef.current.toDataURL('image/jpeg', 0.72);
    
    setCapturedEvidenceImage(imgData);

    if (window._isFailureProof) {
      const reason = selectedReason === 'Other' ? customReason : selectedReason;
      updateOrderStatus('cancelled', imgData, reason);
      setViewMode('failed_summary');
    }

    if (videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const updateOrderStatus = async (status, imgData, reasonData) => {
    if (!order?._id) return;
    setSaving(true);
    try {
      const payload = {
        status,
      };

      if (status === 'shipping') {
        // Attach rider information as required by GEMINI.md
        payload.rider = {
          userId: myUserInfo?.id || myUserInfo?._id || "",
          name: `${myUserInfo?.name || ""} ${myUserInfo?.surname || ""}`.trim() || "Rider",
          phone: myUserInfo?.phone || "",
          vehicle: myUserInfo?.vehicle || "Motorcycle",
          plate: myUserInfo?.plate || "N/A"
        };
      }

      if (status === 'delivered') {
        payload.evidenceImage = imgData || capturedEvidenceImage;
        payload.deliveredAt = new Date().toISOString();
      }

      if (status === 'cancelled') {
        payload.evidenceImage = imgData || capturedEvidenceImage;
        payload.cancelReason = reasonData || (selectedReason === 'Other' ? customReason : selectedReason);
      }

      const updatedOrder = await updateOrder(order._id, payload);
      
      setOrder(prev => (updatedOrder && updatedOrder.status ? updatedOrder : { ...prev, ...payload }));
      
      if (fetchAllOrders) {
        await fetchAllOrders();
      }
    } catch (updateError) {
      console.error("Failed to update status:", updateError);
      alert("Server update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-[#D33131] rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Securing Order Data</p>
    </div>
  );

  if (!order || error) return (
    <div className="max-w-md mx-auto h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
      <AlertCircle size={60} className="text-red-100 mb-6" />
      <h1 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">Order Missing</h1>
      <p className="text-sm text-gray-500 mb-8 font-medium">We couldn't retrieve the details for this shipment.</p>
      <button onClick={() => navigate('/driver')} className="w-full py-4 bg-black text-white font-black rounded-2xl uppercase tracking-widest text-xs">Return to Fleet</button>
    </div>
  );

  if (order.status === 'delivered' || currentStage === 3) {
    return (
      <DeliveryStatusView 
        order={order} 
        isSuccess={true} 
        customReason="Delivered" 
        capturedImage={capturedEvidenceImage || order.evidenceImage || ""} 
        onBackToTasks={() => navigate('/driver')} 
      />
    );
  }

  if (order.status === 'cancelled' || viewMode === 'failed_summary') {
    const displayReason = selectedReason === 'Other' ? customReason : (selectedReason || order.cancelReason || order.note_global);
    return (
      <DeliveryStatusView 
        order={order} 
        isSuccess={false} 
        reason={displayReason || "Failed"} 
        customReason={displayReason} 
        capturedImage={capturedEvidenceImage || order.evidenceImage || ""} 
        onBackToTasks={() => navigate('/driver')} 
      />
    );
  }

  return (
    <div className="w-full max-w-[430px] mx-auto bg-[#FAFAFA] min-h-screen font-sans pb-10 relative shadow-2xl overflow-x-hidden border-x border-gray-100">
      
      {/* --- Premium Navbar --- */}
      <div className="bg-white/80 backdrop-blur-md px-6 pt-14 pb-6 flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
        <button onClick={() => navigate('/driver')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Shipment Details</span>
          <h1 className="text-sm font-black text-gray-900">#{getOrderNo(order)}</h1>
        </div>
        <button 
          onClick={() => setViewMode('reason')} 
          className="px-4 py-2 bg-red-50 text-[#D33131] rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Cancel</span>
        </button>
      </div>

      <div className="px-5 mt-6">
        {/* --- Progress Timeline --- */}
        <div className="bg-white rounded-[2rem] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center relative">
          <div className="absolute top-12 left-10 right-10 h-0.5 bg-gray-100">
            <div className={`h-full bg-black transition-all duration-700`} style={{ width: currentStage === 1 ? '0%' : currentStage === 2 ? '50%' : '100%' }}></div>
          </div>
          <StageStep active={currentStage === 1} completed={currentStage > 1} stage="1" text="Ready" icon={Package} />
          <StageStep active={currentStage === 2} completed={currentStage > 2} stage="2" text="Transit" icon={MapPin} />
          <StageStep active={currentStage === 3} completed={false} stage="3" text="Finish" icon={CheckCircle2} />
        </div>

        {/* --- Order Summary Card --- */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Parcel Summary</h2>
            <span className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {orderItems.map((item, idx) => (
              <div key={item._id || idx} className="flex gap-4 items-center group">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                  <img src={item.image || "/images/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-800 uppercase truncate">{item.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Customer Info Card --- */}
        <div className="bg-white rounded-[2.5rem] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 space-y-5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-lg uppercase">
                {order.customer?.name?.[0] || 'G'}
              </div>
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Recipient</p>
                <p className="text-sm font-black text-gray-900 uppercase">{order.customer?.name || 'Guest User'}</p>
                <p className="text-[11px] font-bold text-gray-500 mt-1">{customerPhone || 'No phone number provided'}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={customerPhone ? `tel:${customerPhone}` : undefined}
                  aria-disabled={!customerPhone}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    customerPhone
                      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                      : 'bg-gray-50 text-gray-300 pointer-events-none'
                  }`}
                  title={customerPhone || 'No phone number provided'}
                >
                  <Phone size={18} />
                </a>
                <button className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-100 transition-colors relative">
                  <MessageSquare size={18} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-green-500 rounded-full"></span>
                </button>
              </div>
           </div>

           <div className="flex gap-3 items-start p-4 bg-gray-50 rounded-[1.5rem]">
              <MapPin size={18} className="text-[#D33131] mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Destination</p>
                <p className="text-[11px] font-bold text-gray-600 leading-relaxed">{order.customer?.address || 'Address details missing'}</p>
              </div>
           </div>

           {/* Delivery Instruction — linked to note_global from DB (the "Note for Staff" customers fill in) */}
           {order.note_global && (
             <div className="p-4 bg-yellow-50/50 rounded-[1.5rem] border border-yellow-100/50">
                <p className="text-[9px] font-black text-yellow-700 uppercase tracking-widest mb-1">Delivery Instruction</p>
                <p className="text-[11px] font-bold text-yellow-900/70 italic leading-relaxed">"{order.note_global}"</p>
             </div>
           )}
        </div>

        {/* --- Transit Action View --- */}
        {currentStage === 2 && capturedEvidenceImage && (
          <div className="space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div 
                className="relative cursor-pointer group" 
                onClick={() => { setCapturedEvidenceImage(null); startCamera(false); }}
              >
                <img src={capturedEvidenceImage} alt="proof" className="w-full h-60 object-cover rounded-[2.5rem] shadow-xl border-4 border-white" />
                <div className="absolute inset-0 bg-black/20 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-black text-xs uppercase tracking-widest">Tap to Retake</span>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Main Action Bar --- */}
      <div className="sticky bottom-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-40 mt-auto">
        <button 
          onClick={() => {
            if (currentStage === 1) updateOrderStatus('shipping');
            else if (currentStage === 2 && !capturedEvidenceImage) startCamera(false);
            else if (currentStage === 2 && capturedEvidenceImage) updateOrderStatus('delivered');
          }}
          disabled={saving || !isReadyToDeliver}
          className={`w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
            !isReadyToDeliver ? 'bg-gray-100 text-gray-300' : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          {saving ? 'Processing...' : (
            <>
              {currentStage === 1 ? 'Start Delivery' : currentStage === 2 && !capturedEvidenceImage ? 'Arrived' : 'Complete'}
              <ChevronLeft size={14} className="rotate-180" />
            </>
          )}
        </button>
      </div>

      {/* --- Camera Overlay --- */}
      {showCamera && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-between p-10">
          <div className="w-full flex justify-between items-center text-white">
            <button onClick={() => {
              if(videoRef.current.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
              setShowCamera(false);
            }} className="text-xs font-black uppercase tracking-widest">Close</button>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Proof of Delivery</span>
            <div className="w-10"></div>
          </div>
          
          <div className="relative w-full aspect-[3/4] rounded-[3rem] overflow-hidden border-2 border-white/20">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-10 border border-white/20 rounded-[2rem] pointer-events-none flex items-center justify-center">
               <div className="w-4 h-4 border-t-2 border-l-2 border-white absolute top-0 left-0"></div>
               <div className="w-4 h-4 border-t-2 border-r-2 border-white absolute top-0 right-0"></div>
               <div className="w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-0 left-0"></div>
               <div className="w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-0 right-0"></div>
            </div>
          </div>

          <button onClick={takePhoto} className="w-20 h-20 bg-white rounded-full border-[6px] border-white/20 active:scale-90 transition-transform flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full border-4 border-black"></div>
          </button>
        </div>
      )}
      
      {/* --- Reason Modal --- */}
      {(viewMode === 'reason' || viewMode === 'other_detail') && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
           <div className="w-full bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[80vh] overflow-y-auto">
              <h3 className="text-center font-black text-base mb-6 uppercase tracking-tight">
                {viewMode === 'reason' ? 'Report Issue' : 'Specific Reason'}
              </h3>
              
              {viewMode === 'reason' ? (
                <div className="space-y-3 mb-6">
                  {["Cannot contact customer", "Address not found", "Safety concern", "Vehicle issue", "Other"].map((reason) => (
                    <button 
                      key={reason} 
                      onClick={() => { 
                        setSelectedReason(reason); 
                        if (reason === 'Other') {
                          setViewMode('other_detail');
                        } else {
                          setViewMode('normal'); 
                          startCamera(true); 
                        }
                      }}
                      className="w-full py-4 rounded-2xl bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-800 hover:bg-red-50 hover:text-[#D33131] transition-all"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <textarea
                    autoFocus
                    placeholder="Describe the issue..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full h-32 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-xs font-bold focus:border-red-200 outline-none resize-none"
                  />
                  <button 
                    onClick={() => {
                      if (!customReason.trim()) return alert("Please provide a reason");
                      setViewMode('normal');
                      startCamera(true);
                    }}
                    className="w-full py-4 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-gray-200"
                  >
                    Continue to Camera
                  </button>
                  <button onClick={() => setViewMode('reason')} className="w-full text-[10px] font-black uppercase text-gray-400">Back</button>
                </div>
              )}
              
              {viewMode === 'reason' && (
                <button onClick={() => setViewMode('normal')} className="w-full py-3 text-[10px] font-black uppercase text-gray-400">Dismiss</button>
              )}
           </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default OrderDetail;
