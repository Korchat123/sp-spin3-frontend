import React from "react";
import { ShoppingCart, RefreshCw } from "lucide-react";
import OrderTypeSelector from "./OrderTypeSelector";

const DeliveryDetails = ({
  selectedBranch,
  savedAddresses = [],
  selectedAddressId,
  isEditingAddress,
  deliveryAddress,
  addressForm,
  setAddressForm,
  setIsEditingAddress,
  handleSelectAddress,
  handleSaveAddress
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-black text-sm uppercase text-[#DC5F00] tracking-wider">Delivery Details</h3>
      <span className="text-[10px] bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-bold uppercase border border-red-200">Doorstep</span>
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">สาขาจัดส่ง (Shipping Branch)</label>
      <select
        value={selectedBranch || "branch1"}
        disabled
        className="w-full bg-[#eeeeee] text-[#242424]/60 border-2 border-black/40 rounded-xl p-2 text-xs font-bold cursor-not-allowed opacity-80"
      >
        <option value="branch1">Serious Fried Chicken สาขา อโศก (HQ) ✅</option>
        <option value="branch2" disabled>Serious Fried Chicken สาขา สยาม (COMING SOON 🔒)</option>
      </select>
    </div>

    {!isEditingAddress ? (
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Address Name</label>
          <select
            value={selectedAddressId || ""}
            onChange={(e) => handleSelectAddress(e.target.value)}
            className="w-full bg-white border-2 border-black rounded-xl p-2 text-xs font-bold focus:outline-none focus:border-[#DC5F00]"
          >
            {savedAddresses.length === 0 && (
              <option value="">No saved address</option>
            )}
            {savedAddresses.map((addr, index) => (
              <option key={addr._id || addr.id || index} value={addr._id || addr.id || ""}>
                {addr.addressName || addr.tag || "Address"} - {addr.address}
              </option>
            ))}
            <option value="__new__">+ Create new address</option>
          </select>
        </div>
        <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0_#242424]">
          <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-2
            ${deliveryAddress.tag === "Home" ? "bg-orange-100 text-orange-700 border border-orange-200" : ""}
            ${deliveryAddress.tag === "Work" ? "bg-blue-100 text-blue-700 border border-blue-200" : ""}
            ${deliveryAddress.tag === "Other" ? "bg-gray-100 text-gray-700 border border-gray-200" : ""}`}
          >
            📍 {deliveryAddress.addressName || deliveryAddress.tag}
          </span>
          <p className="font-black text-sm text-[#242424]">{deliveryAddress.firstname} {deliveryAddress.lastname}</p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed font-semibold">{deliveryAddress.address}</p>
        </div>
        <button
          onClick={() => setIsEditingAddress(true)}
          className="w-full py-2.5 bg-[#242424] text-white rounded-xl font-bold text-xs uppercase hover:bg-[#e4002b] shadow-[3px_3px_0_#eeeeee] hover:shadow-none hover:translate-y-0.5 transition-all duration-300"
        >
          ✏️ Change Address
        </button>
      </div>
    ) : (
      <div className="space-y-3">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Address Name</label>
          <input
            type="text"
            value={addressForm.addressName || ""}
            onChange={(e) => setAddressForm({ ...addressForm, addressName: e.target.value })}
            placeholder="Home, Office, Condo..."
            className="w-full border-2 border-black rounded-lg p-2 text-xs font-black bg-white focus:outline-none focus:border-[#DC5F00]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Firstname</label>
            <input
              type="text"
              value={addressForm.firstname}
              onChange={(e) => setAddressForm({ ...addressForm, firstname: e.target.value })}
              className="w-full border-2 border-black rounded-lg p-2 text-xs focus:outline-none focus:border-[#DC5F00]"
            />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Lastname</label>
            <input
              type="text"
              value={addressForm.lastname}
              onChange={(e) => setAddressForm({ ...addressForm, lastname: e.target.value })}
              className="w-full border-2 border-black rounded-lg p-2 text-xs focus:outline-none focus:border-[#DC5F00]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Phone Number (เบอร์โทรติดต่อ)</label>
          <input
            type="tel"
            value={addressForm.phone || ""}
            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
            placeholder="081-234-5678"
            className="w-full border-2 border-black rounded-lg p-2 text-xs font-black bg-white focus:outline-none focus:border-[#DC5F00]"
          />
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">ที่อยู่จัดส่ง (Address Details)</label>
          <textarea
            rows={3}
            value={addressForm.address}
            onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
            className="w-full border-2 border-black rounded-lg p-2 text-xs focus:outline-none focus:border-[#DC5F00] resize-none leading-tight"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSaveAddress}
            className="flex-1 py-2 bg-[#DC5F00] text-white rounded-xl text-xs font-bold border-2 border-black hover:bg-[#c25400] transition-colors"
          >
            Save Address
          </button>
          <button
            type="button"
            onClick={() => setIsEditingAddress(false)}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
  </div>
);

const PickupDetails = ({ pickupDate, setPickupDate, pickupTime, setPickupTime }) => (
  <div className="space-y-4">
    <h3 className="font-black text-sm uppercase text-[#DC5F00] tracking-wider">Store Details</h3>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Select Branch</label>
      <select
        value="branch1"
        disabled
        className="w-full bg-[#eeeeee] text-[#242424]/60 border-2 border-black/40 rounded-xl p-2 text-xs font-bold cursor-not-allowed opacity-80"
      >
        <option value="branch1">Serious Fried Chicken สาขา อโศก (HQ) ✅</option>
        <option value="branch2" disabled>Serious Fried Chicken สาขา สยาม (COMING SOON 🔒)</option>
      </select>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Pick Date</label>
        <input
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Pick Time</label>
        <select
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
        >
          <option>10:00 - 10:30</option>
          <option>11:00 - 11:30</option>
          <option>12:00 - 12:30</option>
          <option>13:00 - 13:30</option>
          <option>14:00 - 14:30</option>
          <option>15:00 - 15:30</option>
        </select>
      </div>
    </div>
  </div>
);

const ReserveDetails = ({
  reserveDate,
  setReserveDate,
  reserveTime,
  setReserveTime,
  reserveMembers,
  setReserveMembers,
  reserveComment,
  setReserveComment,
  tableState,
  isOneTwoUnlocked,
  isThreeSixUnlocked,
  isSevenTenUnlocked
}) => (
  <div className="space-y-4">
    <h3 className="font-black text-sm uppercase text-[#DC5F00] tracking-wider border-b border-[#eeeeee] pb-1">Table Reservation</h3>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Select Branch</label>
      <select
        value="branch1"
        disabled
        className="w-full bg-[#eeeeee] text-[#242424]/60 border-2 border-black/40 rounded-xl p-2 text-xs font-bold cursor-not-allowed opacity-80"
      >
        <option value="branch1">Serious Fried Chicken สาขา อโศก (HQ) ✅</option>
        <option value="branch2" disabled>Serious Fried Chicken สาขา สยาม (COMING SOON 🔒)</option>
      </select>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Booking Date</label>
        <input
          type="date"
          value={reserveDate}
          onChange={(e) => setReserveDate(e.target.value)}
          className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
        />
      </div>
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Booking Time</label>
        <select
          value={reserveTime}
          onChange={(e) => setReserveTime(e.target.value)}
          className="w-full bg-white border-2 border-black rounded-lg p-2 text-xs font-bold focus:outline-none"
        >
          <option value="10:00-12:00">10:00 - 12:00</option>
          <option value="13:00-15:00">13:00 - 15:00</option>
          <option value="16:00-18:00">16:00 - 18:00</option>
          <option value="19:00-21:00">19:00 - 21:00</option>
        </select>
      </div>
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Number of People</label>
      <select
        value={reserveMembers}
        onChange={(e) => setReserveMembers(e.target.value)}
        className="w-full bg-white border-2 border-black rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#DC5F00]"
      >
        <option value="1-2P" disabled={!isOneTwoUnlocked}>
          1-2 People {!isOneTwoUnlocked ? "🔒 (Requires >= ฿600)" : "✅"}
        </option>
        <option value="3-6P" disabled={!isThreeSixUnlocked}>
          3-6 People {!isThreeSixUnlocked ? "🔒 (Requires >= ฿1200)" : "✅"}
        </option>
        <option value="7-10P" disabled={!isSevenTenUnlocked}>
          7-10 People {!isSevenTenUnlocked ? "🔒 (Requires >= ฿2500)" : "✅"}
        </option>
        <option value="11+">11+ People (Contact Staff) 📞</option>
      </select>
    </div>

    {reserveMembers === "11+" && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[11px] font-black text-red-700 leading-tight">
        💬 กรุณาติดต่อพนักงานที่เบอร์โทร <span className="underline font-bold">020-22542-555675</span>
      </div>
    )}

    <div className="relative pt-2">
      {tableState === "checking" && (
        <div className="bg-gray-100 border-[3px] border-[#242424] rounded-2xl p-3 flex items-center justify-center gap-3 shadow-[4px_4px_0_#cccccc]">
          <RefreshCw className="animate-spin text-gray-500 shrink-0" size={16} />
          <span className="text-[#888888] text-sm uppercase font-black tracking-wide font-mono">
            Table State: <span className="font-bold">Checking...</span>
          </span>
        </div>
      )}
      {tableState === "free" && (
        <div className="bg-green-100 border-[3px] border-[#242424] rounded-2xl p-3 flex items-center justify-center gap-2 shadow-[4px_4px_0_#242424]">
          <span className="text-[#242424] text-sm uppercase font-black tracking-wide font-mono">
            Table State: <span className="text-green-600 font-extrabold animate-pulse">FREE ✅</span>
          </span>
        </div>
      )}
      {tableState === "reserve" && (
        <div className="bg-red-100 border-[3px] border-[#242424] rounded-2xl p-3 flex items-center justify-center gap-2 shadow-[4px_4px_0_#242424]">
          <span className="text-[#242424] text-sm uppercase font-black tracking-wide font-mono">
            Table State: <span className="text-red-500 font-extrabold animate-pulse">RESERVE ❌</span>
          </span>
        </div>
      )}
    </div>

    <div>
      <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Special request</label>
      <textarea
        rows={2}
        value={reserveComment}
        onChange={(e) => setReserveComment(e.target.value)}
        className="w-full border-2 border-black rounded-xl p-2 text-xs focus:outline-none focus:border-[#DC5F00] resize-none"
        placeholder="เช่น โต๊ะริมหน้าต่างหรือไม่สูบบุหรี่"
      />
    </div>
  </div>
);

const OrderDetailsPanel = ({
  eatType,
  setEatType,
  selectedBranch,
  savedAddresses,
  selectedAddressId,
  isEditingAddress,
  deliveryAddress,
  addressForm,
  setAddressForm,
  setIsEditingAddress,
  handleSelectAddress,
  handleSaveAddress,
  pickupDate,
  setPickupDate,
  pickupTime,
  setPickupTime,
  reserveDate,
  setReserveDate,
  reserveTime,
  setReserveTime,
  reserveMembers,
  setReserveMembers,
  reserveComment,
  setReserveComment,
  tableState,
  isOneTwoUnlocked,
  isThreeSixUnlocked,
  isSevenTenUnlocked
}) => (
  <div className="lg:col-span-4 bg-white rounded-4xl p-6 border-4 border-[#242424] shadow-[8px_8px_0_#242424] space-y-6">
    <h2 className="text-2xl font-['Bebas_Neue'] tracking-widest uppercase border-b-2 border-[#eeeeee] pb-2 flex items-center gap-2">
      <span className="w-2.5 h-6 bg-[#e4002b] rounded-full inline-block"></span>
      1. Setup Order Type
    </h2>

    <OrderTypeSelector eatType={eatType} setEatType={setEatType} />

    <div className="border-2 border-dashed border-gray-300 rounded-3xl p-4 min-h-60 bg-gray-50 flex flex-col justify-center">
      {!eatType && (
        <div className="text-center text-gray-400 py-10">
          <ShoppingCart size={40} className="mx-auto mb-3 opacity-30 animate-pulse" />
          <p className="text-sm font-bold uppercase">Please select order type<br/>from the buttons above</p>
        </div>
      )}

      {eatType === "delivery" && (
        <DeliveryDetails
          selectedBranch={selectedBranch}
          savedAddresses={savedAddresses}
          selectedAddressId={selectedAddressId}
          isEditingAddress={isEditingAddress}
          deliveryAddress={deliveryAddress}
          addressForm={addressForm}
          setAddressForm={setAddressForm}
          setIsEditingAddress={setIsEditingAddress}
          handleSelectAddress={handleSelectAddress}
          handleSaveAddress={handleSaveAddress}
        />
      )}

      {eatType === "pickup" && (
        <PickupDetails
          pickupDate={pickupDate}
          setPickupDate={setPickupDate}
          pickupTime={pickupTime}
          setPickupTime={setPickupTime}
        />
      )}

      {eatType === "reserve" && (
        <ReserveDetails
          reserveDate={reserveDate}
          setReserveDate={setReserveDate}
          reserveTime={reserveTime}
          setReserveTime={setReserveTime}
          reserveMembers={reserveMembers}
          setReserveMembers={setReserveMembers}
          reserveComment={reserveComment}
          setReserveComment={setReserveComment}
          tableState={tableState}
          isOneTwoUnlocked={isOneTwoUnlocked}
          isThreeSixUnlocked={isThreeSixUnlocked}
          isSevenTenUnlocked={isSevenTenUnlocked}
        />
      )}
    </div>
  </div>
);

export default OrderDetailsPanel;
