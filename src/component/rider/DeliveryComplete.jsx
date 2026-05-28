import React from 'react';

// ข้อมูลจำลองสำหรับหน้าประวัติ (Historical Order Data)
const pastOrderData = {
  orderId: "CK-212227",
  status: "Delivered to Customer",
  time: "11:30 AM",
  price: "499 bath",
  deliveryTo: "34 G Tower, Rama 9 Soi 11 Rama 9 Road, Din Daeng, Din Daeng, Bangkok 10220",
  dropOffNote: "Left at reception front desk",
  // ใช้รูปภาพจำลองกล่องอาหารวางบนโต๊ะ
  photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80" 
};

const DeliveryComplete = () => {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl font-sans pb-8 border-x-4 border-gray-100 relative">
      
      {/* ส่วนหัวข้อหลัก */}
      <div className="pt-8 pb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-wide text-black">
          DELIVERY COMPLETE!
        </h1>
      </div>

      {/* ไอคอนเครื่องหมายถูกวงกลมสีเขียว */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-[#4CD964] rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-4xl font-bold">✓</span>
        </div>
      </div>

      {/* การ์ดรายละเอียดหลัก (Main Info Card) */}
      <div className="mx-4 bg-white border-2 border-gray-200 rounded-[2.5rem] p-6 shadow-sm mb-8">
        
        {/* หัวการ์ด: รหัสออเดอร์ และ สถานะ */}
        <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
          <span className="text-2xl mt-1">📦</span>
          <div>
            <h2 className="font-black text-base text-black uppercase tracking-tight">
              ORDER {pastOrderData.orderId}-DETAILS
            </h2>
            <p className="text-[#24B24B] font-black text-base mt-0.5">
              {pastOrderData.status}
            </p>
          </div>
        </div>

        {/* รายละเอียดเวลา / ราคา / สถานะ / ที่อยู่ */}
        <div className="py-4 space-y-3 text-sm border-b border-gray-100">
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Time:</span>
            <span className="font-bold text-gray-700 text-right">{pastOrderData.time}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Price:</span>
            <span className="font-bold text-gray-700 text-right">{pastOrderData.price}</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Status:</span>
            <span className="font-bold text-gray-700 text-right flex items-center">
              Delivered <span className="ml-1 text-xs">✅</span>
            </span>
          </div>

          <div className="flex justify-between items-start">
            <span className="font-black text-black w-24 flex-shrink-0">Delivery to:</span>
            <span className="font-bold text-gray-700 text-right leading-normal max-w-[200px]">
              {pastOrderData.deliveryTo}
            </span>
          </div>
        </div>

        {/* ส่วน Drop-off Note และ รูปภาพหลักฐานการส่ง */}
        <div className="pt-4 space-y-3 text-sm">
          <div className="flex justify-between items-start">
            <span className="font-black text-black w-28 flex-shrink-0">Drop-off Note:</span>
            <span className="font-bold text-gray-700 text-right">{pastOrderData.dropOffNote}</span>
          </div>

          <div className="flex flex-col space-y-2">
            <span className="font-black text-black">Delivery photo:</span>
            <div className="w-full h-44 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
              <img 
                src={pastOrderData.photoUrl} 
                alt="Delivery Evidence" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

      </div>

      {/* ปุ่มนำทางด้านล่าง (Action Buttons) */}
      <div className="flex px-4 space-x-3 items-center mt-auto">
        
        <button className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-300">
          CURRENT TASK
        </button>
        
        <button className="flex-1 bg-[#E0E0E0] text-black py-4 rounded-3xl font-black text-xs shadow-md active:scale-95 transition-transform uppercase tracking-wider border border-gray-300">
          DELIVERY HISTORY
        </button>

      </div>

    </div>
  );
};

export default DeliveryComplete;