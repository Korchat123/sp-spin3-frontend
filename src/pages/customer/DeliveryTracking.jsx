// import React,{useState} from "react";
// // import LiveMap from "../../component/customer/Livemap";
// import OrderHeader from"../../component/customer/OrderHeader"
// import StatusTimeLine from "../../component/customer/RiderCard"
// import OrderBill from "../../component/customer/OrderBill"
// import mockupState from "../../assets/mockupState"

// // ---------------------------------------------------------
// // 6. Component หลัก: หน้าจอรวม (Main Layout)
// // ---------------------------------------------------------
// export default function DeliveryTracking() {
 
//   return (
//     <div className="bg-gray-100 h-screen w-full flex items-center justify-center p-6 font-sans">
//       <div className="max-w-300 w-full h-[85vh] bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-gray-200">
        
//         {/* ซ้าย: แผนที่ */}
//         <LiveMap />

//         {/* ขวา: แผงข้อมูล (Sidebar) */}
//         <div className="w-[35%] h-full bg-white flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
//           <OrderHeader orderId={deliveryData.orderId} etaMinutes={deliveryData.etaMinutes} />
          
//           <StatusTimeline currentStep={deliveryData.currentStep} />
          
//           <RiderCard {...deliveryData.rider} />
          
//           <OrderBill address={deliveryData.address} items={deliveryData.items} total={deliveryData.total} />
//         </div>

//       </div>
//     </div>
//   );
// }