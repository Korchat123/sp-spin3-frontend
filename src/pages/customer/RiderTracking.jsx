import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrdersContext } from '../../context/ordersContext/OrdersContext';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star,
  Navigation,
  Package
} from "lucide-react";

const RiderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderList, fetchAllOrders } = useContext(OrdersContext);
  
  // Use DEL-1002 as default for easy testing if no state is provided
  const orderId = location.state?.orderId || "DEL-1002";
  
  // Poll for data updates every 5 seconds to catch Rider changes
  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(() => fetchAllOrders(), 5000);
    return () => clearInterval(interval);
  }, [fetchAllOrders]);
  
  // Find the actual order from context - Search both id and orderId
  const currentOrder = useMemo(() => {
    if (!orderList) return null;
    return orderList.find(o => 
      (o.id && String(o.id) === String(orderId)) || 
      (o.orderId && String(o.orderId) === String(orderId))
    );
  }, [orderList, orderId]);

  // Status mapping from context to local tracking UI
  const deliveryStatus = useMemo(() => {
    if (!currentOrder) return 'picking_up';
    
    switch (currentOrder.status) {
      case 'shipping': return 'on_the_way';
      case 'delivered': return 'arriving'; // We'll call it arriving if delivered in this context or handle success separately
      case 'cancelled': return 'picking_up'; // Fallback
      default:
        // Check if items are ready to pick up
        const isReady = currentOrder.orderList?.every(item => item.status === "finished");
        return isReady ? 'picking_up' : 'picking_up';
    }
  }, [currentOrder]);

  // Mock data for the rider
  const riderInfo = useMemo(() => ({
    name: currentOrder?.rider?.name || "Somsak Delivery",
    rating: 4.8,
    vehicle: "Honda Wave (Black)",
    plate: "1กข 7788",
    phone: currentOrder?.rider?.phone || "081-234-5678",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Somsak"
  }), [currentOrder]);

  const estimatedTime = useMemo(() => {
    if (deliveryStatus === 'picking_up') return 15;
    if (deliveryStatus === 'on_the_way') return 8;
    return 0;
  }, [deliveryStatus]);

  // Status mapping
  const statusConfig = {
    picking_up: {
      label: "Picking up food",
      description: "Rider is at the store.",
      progress: 30,
      icon: "🍳",
      color: "#FDE68A" // Yellow
    },
    on_the_way: {
      label: "On the way",
      description: "Rider is heading to you.",
      progress: 65,
      icon: "🏍️",
      color: "#A7F3D0" // Greenish
    },
    arriving: {
      label: "Order Delivered!",
      description: "Your food has arrived.",
      progress: 100,
      icon: "✅",
      color: "#A7F3D0" // Greenish
    }
  };

  // If delivered, maybe auto-redirect or show a success overlay
  useEffect(() => {
    if (currentOrder?.status === 'delivered') {
      // Just updating local state is enough for this component to re-render
    }
  }, [currentOrder?.status]);

  if (!currentOrder && !orderId.startsWith("ORD-")) {
    return (
      <div className="min-h-screen bg-[#eeeeee] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white border-4 border-[#242424] rounded-full flex items-center justify-center text-4xl mb-6">🔍</div>
        <h2 className="text-3xl font-['Bebas_Neue'] tracking-widest uppercase mb-2">Order Not Found</h2>
        <p className="font-bold text-gray-500 mb-8">We couldn't find tracking info for this order.</p>
        <button 
          onClick={() => navigate('/menu')}
          className="bg-[#e4002b] text-white px-8 py-3 rounded-2xl border-2 border-[#242424] shadow-[4px_4px_0_#242424] font-['Bebas_Neue'] tracking-widest"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const status = deliveryStatus;

  return (
    <div className="min-h-screen bg-[#eeeeee] font-['IBM_Plex_Sans_Thai'] text-[#242424] relative overflow-hidden pb-10">
      
      {/* Background Sprinkles */}
      <div className="absolute top-20 left-10 w-16 h-4 bg-[#FBCFE8] rounded-full rotate-45 z-0 opacity-50"></div>
      <div className="absolute top-60 right-10 w-12 h-4 bg-[#A7F3D0] rounded-full -rotate-12 z-0 opacity-50"></div>
      <div className="absolute bottom-40 left-5 w-20 h-5 bg-[#FDE68A] rounded-full rotate-60 z-0 opacity-50"></div>

      {/* Header - Brutalist Style */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b-4 border-[#242424] shadow-[0_4px_0_#242424] z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-[#242424] rounded-2xl hover:bg-[#eeeeee] transition-all shadow-[4px_4px_0_#242424] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase leading-none">Track Rider</h1>
            <p className="text-[10px] font-bold text-[#DC5F00] uppercase tracking-wider">Order #{orderId.slice(-6).toUpperCase()}</p>
          </div>
        </div>
        <div className="bg-[#e4002b] text-white px-3 py-1 border-2 border-[#242424] shadow-[2px_2px_0_#242424] font-['Bebas_Neue'] tracking-widest -rotate-2">
          LIVE
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-28 px-4 max-w-2xl mx-auto relative z-10">
        
        {/* Map Visualization Area */}
        <div className="bg-white border-4 border-[#242424] rounded-4xl h-[40vh] mb-8 relative overflow-hidden shadow-[10px_10px_0_#242424]">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_2px,transparent_2px)] bg-size-[24px_24px]"></div>
          
          {/* Animated Rider and Path */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full p-10 flex flex-col items-center justify-center">
              {/* Route Line Placeholder */}
              <div className="w-1 h-3/4 bg-dashed border-l-4 border-dashed border-[#242424] opacity-20"></div>
              
              {/* Rider Marker */}
              <div className="absolute top-1/3 animate-bounce">
                <div className="bg-[#e4002b] p-3 rounded-full border-2 border-[#242424] shadow-[4px_4px_0_#242424] relative">
                  <span className="text-2xl">🏍️</span>
                </div>
              </div>

              {/* Destination Marker */}
              <div className="absolute bottom-10">
                <div className="bg-[#FDE68A] p-3 rounded-full border-2 border-[#242424] shadow-[4px_4px_0_#242424]">
                  <MapPin size={24} className="text-[#242424]" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating ETA Sticker */}
          <div className="absolute top-6 right-6 bg-white border-4 border-[#242424] p-4 rotate-3 shadow-[6px_6px_0_#242424]">
            <p className="font-['Bebas_Neue'] text-xs tracking-widest text-[#DC5F00] uppercase mb-1">Arriving In</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-['Bebas_Neue'] leading-none">{estimatedTime}</span>
              <span className="text-sm font-['Bebas_Neue'] tracking-widest uppercase">Mins</span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white border-4 border-[#242424] rounded-4xl p-8 mb-6 shadow-[10px_10px_0_#242424]">
          <div className="flex items-start gap-6 mb-8">
            <div 
              className="w-20 h-20 rounded-3xl border-4 border-[#242424] flex items-center justify-center text-4xl shadow-[6px_6px_0_#242424] rotate-[-4deg] shrink-0"
              style={{ backgroundColor: statusConfig[status].color }}
            >
              {statusConfig[status].icon}
            </div>
            <div>
              <div className="inline-block bg-[#242424] text-white text-[10px] px-3 py-1 font-black uppercase tracking-widest mb-2 rotate-2">
                CURRENT STATUS
              </div>
              <h2 className="text-3xl font-['Bebas_Neue'] tracking-widest uppercase mb-1">{statusConfig[status].label}</h2>
              <p className="text-[#666] font-bold text-sm">{statusConfig[status].description}</p>
            </div>
          </div>

          {/* Brutalist Progress Bar */}
          <div className="relative">
            <div className="w-full h-6 bg-[#eeeeee] border-2 border-[#242424] rounded-full overflow-hidden shadow-[inset_2px_2px_0_rgba(0,0,0,0.1)]">
              <div 
                className="h-full bg-[#e4002b] border-r-2 border-[#242424] transition-all duration-1000 ease-out"
                style={{ width: `${statusConfig[status].progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Delivery Evidence Photo - NEW SECTION */}
        {currentOrder?.status === 'delivered' && currentOrder?.evidenceImage && (
          <div className="bg-white border-4 border-[#242424] rounded-4xl p-6 mb-6 shadow-[10px_10px_0_#242424] animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-xl border-2 border-[#242424]">
                <Package size={20} className="text-green-600" />
              </div>
              <h3 className="font-['Bebas_Neue'] text-xl tracking-widest uppercase">Delivery Proof</h3>
            </div>
            <div className="w-full aspect-video bg-gray-100 rounded-3xl border-4 border-[#242424] overflow-hidden relative group">
              <img 
                src={currentOrder.evidenceImage} 
                alt="Delivery Evidence" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm border-2 border-[#242424] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-[2px_2px_0_#242424]">
                CAPTURED BY RIDER
              </div>
            </div>
            <p className="mt-4 text-[11px] font-bold text-gray-500 text-center uppercase tracking-widest">
              Your order was successfully delivered and verified.
            </p>
          </div>
        )}

        {/* Rider Profile Card - Brutalist Style */}
        <div className="bg-[#FDE68A] border-4 border-[#242424] rounded-4xl p-6 shadow-[10px_10px_0_#242424] mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative self-center">
              <img 
                src={riderInfo.image} 
                alt={riderInfo.name} 
                className="w-24 h-24 rounded-3xl border-4 border-[#242424] bg-white shadow-[6px_6px_0_#242424]"
              />
              <div className="absolute -bottom-2 -right-2 bg-white border-2 border-[#242424] px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0_#242424] rotate-12">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-black">{riderInfo.rating}</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] font-black uppercase text-[#DC5F00] tracking-widest mb-1">Your Delivery Partner</p>
              <h3 className="text-3xl font-['Bebas_Neue'] tracking-widest uppercase mb-2">{riderInfo.name}</h3>
              <div className="inline-flex gap-2 flex-wrap justify-center md:justify-start">
                <span className="bg-white border-2 border-[#242424] px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-[2px_2px_0_#242424]">
                  {riderInfo.vehicle}
                </span>
                <span className="bg-[#242424] text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight shadow-[2px_2px_0_#eeeeee]">
                  {riderInfo.plate}
                </span>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-3 justify-center">
              <a 
                href={`tel:${riderInfo.phone}`}
                className="w-14 h-14 flex items-center justify-center bg-white border-4 border-[#242424] rounded-3xl shadow-[4px_4px_0_#242424] hover:bg-[#A7F3D0] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <Phone size={24} />
              </a>
              <button 
                className="w-14 h-14 flex items-center justify-center bg-white border-4 border-[#242424] rounded-3xl shadow-[4px_4px_0_#242424] hover:bg-[#FBCFE8] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <MessageSquare size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <button 
          onClick={() => navigate('/order-tracking', { state: { orderId } })}
          className="w-full bg-[#242424] text-white py-4 rounded-3xl border-4 border-[#242424] shadow-[8px_8px_0_#e4002b] flex items-center justify-center gap-3 hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
        >
          <span className="font-['Bebas_Neue'] text-xl tracking-widest uppercase">View Order Detail</span>
          <ArrowLeft size={20} className="rotate-180 group-hover:translate-x-2 transition-transform" />
        </button>

      </main>
    </div>
  );
};

export default RiderTracking;
