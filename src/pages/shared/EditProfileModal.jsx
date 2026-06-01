import React from "react";
import { X } from "lucide-react";
import CustomerProfileForm from "../../component/customer/CustomerProfileForm";
import StaffProfileView from "../../component/shared/StaffProfileView";

export default function EditProfileModal({ isOpen, onClose, userInfo }) {
  if (!isOpen) return null;

  const isCustomer = !userInfo?.role || userInfo?.role === "customer";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-9999 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border-4 border-[#242424] overflow-hidden flex flex-col font-['IBM_Plex_Sans_Thai'] shadow-[8px_8px_0_#242424] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#242424] text-white px-6 py-4 flex justify-between items-center">
          <h2 className="font-['Bebas_Neue'] text-3xl tracking-widest">
            {isCustomer ? "USER INFO" : "STAFF PORTAL"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content (แยก Component ชัดเจน) */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {isCustomer ? (
            <CustomerProfileForm userInfo={userInfo} onClose={onClose} />
          ) : (
            <StaffProfileView userInfo={userInfo} />
          )}
        </div>
      </div>
    </div>
  );
}
