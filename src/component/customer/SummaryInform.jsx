// src/component/customer/SummaryInform.jsx
import React, { useState } from "react";

export default function SummaryInform({
  orderState,
  setOrderState,
  profile,
  setProfile,
  onConfirm
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const [editOrder, setEditOrder] = useState({
    type: orderState.type,
    member: orderState.member,
  });

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    return `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
  };

  const handleSaveProfile = () => {
    setProfile(editProfile);
    setOrderState((prev) => ({
      ...prev,
      type: editOrder.type,
      member: editOrder.member,
    }));
    setIsEditing(false);
  };

  const cancelBooking = () => {
    if (window.confirm("คุณต้องการยกเลิกใช่ไหม?")) {
      window.location.href = "/"; 
    }
  };

  // Logic ควบคุมการแสดงผลตามประเภท
  const showMember = orderState.type === "Booking";
  const showTime = orderState.type !== "Delivery"; 

  return (
    <section className="flex flex-col gap-6 sticky top-10">
      <h2 className="text-center lg:text-left text-4xl font-bebas tracking-widest text-brand-black border-l-8 border-brand-red pl-4">
        2. ORDER SETUP
      </h2>

      {/* แถบสีส้ม: สไตล์ Brutalist Card */}
      <div className="bg-brand-orange p-6 rounded-4xl border-[3px] border-brand-black shadow-[8px_8px_0_#242424] flex flex-wrap justify-center sm:justify-start items-center gap-4">
        <div className="flex flex-col w-full sm:w-auto">
          <label className="font-bebas text-brand-white text-xl tracking-wider mb-1">DATE</label>
          <input
            type="date"
            value={orderState.date}
            onChange={(e) => setOrderState({ ...orderState, date: e.target.value })}
            className="text-brand-black font-bold p-3 rounded-xl border-[3px] border-brand-black focus:outline-none w-full"
          />
        </div>

        {showTime && (
          <div className="flex flex-col w-full sm:w-auto flex-1">
            <label className="font-bebas text-brand-white text-xl tracking-wider mb-1">TIME</label>
            <select
              value={orderState.time}
              onChange={(e) => setOrderState({ ...orderState, time: e.target.value })}
              className="text-brand-black font-bold p-3 rounded-xl border-[3px] border-brand-black focus:outline-none w-full"
            >
              <option value="10:00-12:00">10:00 - 12:00</option>
              <option value="13:00-15:00">13:00 - 15:00</option>
              <option value="16:00-18:00">16:00 - 18:00</option>
              <option value="19:00-21:00">19:00 - 21:00</option>
            </select>
          </div>
        )}

        {showMember && (
          <div className="flex flex-col w-full sm:w-auto">
            <label className="font-bebas text-brand-white text-xl tracking-wider mb-1">MEMBER</label>
            <select
              value={orderState.member}
              onChange={(e) => setOrderState({ ...orderState, member: e.target.value })}
              className="text-brand-black font-bold p-3 rounded-xl border-[3px] border-brand-black focus:outline-none w-full"
            >
              <option value="1P">1 P</option>
              <option value="2P">2 P</option>
              <option value="3P">3 P</option>
              <option value="4P">4 P</option>
              <option value="5P">5 P</option>
              <option value="6P">6 P</option>
            </select>
          </div>
        )}
      </div>

      {/* รายละเอียดการจอง: Brutalist Card พื้นขาว */}
      <div className="bg-brand-white p-8 rounded-4xl border-[3px] border-brand-black shadow-[8px_8px_0_#242424]">
        <h3 className="text-3xl font-bebas tracking-widest mb-6 text-brand-black text-center border-b-4 border-brand-black pb-4">
          BOOKING INFORMATION
        </h3>

        <div className="text-left text-lg font-bold uppercase space-y-5 text-brand-black">
          {orderState.userAddress && (
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3 bg-brand-gray/50 p-3 rounded-xl">
              <span className="font-bebas text-xl text-brand-orange">CURRENT LOCATION</span>
              <span className="text-sm truncate max-w-50">{orderState.userAddress}</span>
            </p>
          )}

          <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3">
            <span className="font-bebas text-xl text-gray-500">ORDER TYPE</span>
            {isEditing ? (
              <select
                value={editOrder.type}
                onChange={(e) => setEditOrder({ ...editOrder, type: e.target.value })}
                className="border-b-4 border-brand-black focus:outline-none text-right text-brand-orange bg-transparent w-1/2 py-1"
              >
                <option value="Booking">Booking</option>
                <option value="Pickup">Pickup</option>
                <option value="Delivery">Delivery</option>
              </select>
            ) : (
              <span className="text-brand-orange text-2xl font-black">{orderState.type}</span>
            )}
          </p>

          <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3">
            <span className="font-bebas text-xl text-gray-500">BRANCH</span>
            {orderState.branch ? (
              <span className="text-brand-orange text-xl">{orderState.branch}</span>
            ) : (
              <span className="text-gray-400">- ยังไม่ได้เลือกสาขา -</span>
            )}
          </p>

          <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3">
            <span className="font-bebas text-xl text-gray-500">DATE {showTime && "& TIME"}</span>
            <span className="text-xl">
              {formatDisplayDate(orderState.date)} {showTime && `(${orderState.time})`}
            </span>
          </p>

          <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3">
            <span className="font-bebas text-xl text-gray-500">NAME</span>
            {isEditing ? (
              <input
                type="text"
                value={editProfile.name}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                className="border-b-4 border-brand-black text-right w-1/2 bg-transparent py-1"
              />
            ) : (
              <span>{profile.name}</span>
            )}
          </p>

          {showMember && (
            <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3">
              <span className="font-bebas text-xl text-gray-500">MEMBER</span>
              {isEditing ? (
                <select
                  value={editOrder.member}
                  onChange={(e) => setEditOrder({ ...editOrder, member: e.target.value })}
                  className="border-b-4 border-brand-black text-right bg-transparent w-1/2 py-1"
                >
                  {["1P", "2P", "3P", "4P", "5P", "6P"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              ) : (
                <span className="text-xl">{orderState.member}</span>
              )}
            </p>
          )}

          <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b-2 border-brand-gray pb-3">
            <span className="font-bebas text-xl text-gray-500">EMAIL</span>
            {isEditing ? (
              <input
                type="email"
                value={editProfile.email}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                className="lowercase border-b-4 border-brand-black text-right w-1/2 bg-transparent py-1"
              />
            ) : (
              <span className="lowercase">{profile.email}</span>
            )}
          </p>

          <p className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-2">
            <span className="font-bebas text-xl text-gray-500">CONTACT</span>
            {isEditing ? (
              <input
                type="text"
                value={editProfile.contact}
                onChange={(e) => setEditProfile({ ...editProfile, contact: e.target.value })}
                className="border-b-4 border-brand-black text-right w-1/2 bg-transparent py-1"
              />
            ) : (
              <span>{profile.contact}</span>
            )}
          </p>
        </div>
      </div>

      {/* Action Buttons: เปลี่ยนจาก Bar เป็นกลุ่มปุ่มสไตล์ Brutalist แยกอิสระ */}
      <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
        <div>
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="bg-brand-white text-brand-black px-6 py-3 rounded-full font-bebas text-xl tracking-widest border-[3px] border-brand-black shadow-[4px_4px_0_#242424] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#242424] transition-all duration-300"
            >
              💾 UPDATE
            </button>
          ) : (
            <button
              onClick={() => {
                setEditProfile(profile);
                setEditOrder({ type: orderState.type, member: orderState.member });
                setIsEditing(true);
              }}
              className="bg-brand-white text-brand-black px-6 py-3 rounded-full font-bebas text-xl tracking-widest border-[3px] border-brand-black shadow-[4px_4px_0_#242424] hover:translate-y-0.5 hover:shadow-[2px_2px_0_#242424] transition-all duration-300"
            >
              ✏️ EDIT
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={cancelBooking}
            className="bg-brand-black text-brand-white px-6 py-3 rounded-full font-bebas text-xl tracking-widest border-[3px] border-brand-black hover:opacity-80 transition-all duration-300"
          >
            CANCEL
          </button>

          <button
            disabled={!orderState.branch}
            onClick={onConfirm}
            className={`px-8 py-3 rounded-full font-bebas text-2xl tracking-widest border-[3px] border-brand-black transition-all duration-300 
            ${!orderState.branch 
              ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none" 
              : "bg-brand-red text-brand-white shadow-[6px_6px_0_#242424] hover:translate-y-0.5 hover:shadow-[3px_3px_0_#242424]"}`}
          >
            CONFIRM
          </button>
        </div>
      </div>
    </section>
  );
}