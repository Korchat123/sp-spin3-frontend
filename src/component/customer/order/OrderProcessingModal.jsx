import React from "react";

const OrderProcessingModal = ({ isPolling, pollingStep, pollingMessages }) => {
  if (!isPolling) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-9999 font-['IBM_Plex_Sans_Thai']">
      <div className="bg-[#242424] text-white rounded-3xl p-8 border-4 border-[#242424] shadow-[8px_8px_0_#e4002b] max-w-sm w-full text-center space-y-6 animate-[bounce_0.5s_ease-out]">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-[#e4002b] border-t-transparent animate-spin"></div>
        </div>

        <div className="space-y-2">
          <h3 className="font-['Bebas_Neue'] text-3xl tracking-widest text-[#FDE68A]">
            PROCESSING TRANSACTION
          </h3>
          <p className="text-xs text-gray-400 uppercase font-black tracking-wider">
            Verifying with payment gateway
          </p>
        </div>

        <div className="bg-black/40 p-4 rounded-2xl border border-white/10 text-xs font-mono font-bold text-green-400 leading-normal">
          {pollingMessages[pollingStep]}
        </div>
      </div>
    </div>
  );
};

export default OrderProcessingModal;
