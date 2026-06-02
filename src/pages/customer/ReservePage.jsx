import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReserveConfirmation from "../../component/customer/ReserveConfirmation";

export default function ReservePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resData = location.state || {};

  // Extract reservation data from routing state or use safe defaults
  const tableNo = resData.tableNo || `#RES-${Math.floor(100 + Math.random() * 900)}`;
  const detail = resData.detail || "Serious Fried Chicken (Asok Branch HQ)";
  const person = resData.person || "2";
  const date = resData.date || new Date().toISOString().split("T")[0];
  const time = resData.time || "13:00 - 15:00";
  const comment = resData.comment || "No special requests.";
  const menuList = resData.menuList || ["Crispy Chicken Set x1"];

  // Direct reuse of the ReserveConfirmation component inside the success page route
  return (
    <div className="min-h-screen bg-[#eeeeee] flex flex-col items-center justify-center p-4">
      {/* Background placeholder card while component overlays */}
      <div className="text-center text-gray-500 py-10 uppercase font-black tracking-widest text-sm">
        Loading Reservation Ticket...
      </div>

      <ReserveConfirmation
        isOpen={true}
        onClose={() => navigate("/")}
        tableNo={tableNo}
        detail={detail}
        person={person.replace("P", "")} // standardizes "2P" to "2"
        date={date}
        time={time}
        menuList={menuList}
        comment={comment}
        status="confirmed" // Shows receipt status
      />
    </div>
  );
}
