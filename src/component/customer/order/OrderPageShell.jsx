import React from "react";
import { useOrderPageState } from "./useOrderPageState";
import OrderDetailsPanel from "./OrderDetailsPanel";
import OrderSummary from "./OrderSummary";
import OrderTotalsPanel from "./OrderTotalsPanel";
import CheckoutPanel from "./CheckoutPanel";
import OrderProcessingModal from "./OrderProcessingModal";

const OrderPageShell = () => {
  const {
    cartItems,
    customizingItem,
    setCustomizingItem,
    eatType,
    setEatType,
    selectedBranch,
    savedAddresses,
    selectedAddressId,
    deliveryAddress,
    isEditingAddress,
    addressForm,
    setAddressForm,
    setIsEditingAddress,
    handleSelectAddress,
    handleAddNewAddress,
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
    isSevenTenUnlocked,
    handleUpdateQty,
    handleRemove,
    handleUpdateNote,
    handleOrderSubmit,
    subTotal,
    tax,
    netTotal,
    isReserveBelowMinimum,
    paymentMethod,
    setPaymentMethod,
    creditCard,
    setCreditCard,
    uploadedSlip,
    setUploadedSlip,
    uploadedSlipFile,
    setUploadedSlipFile,
    handleSlipChange,
    handleSlipDrop,
    isPolling,
    pollingStep,
    pollingMessages
  } = useOrderPageState();

  return (
    <div className="pt-24 pb-20 bg-[#eeeeee] min-h-screen text-[#242424] font-['IBM_Plex_Sans_Thai'] relative overflow-hidden">
      <div className="absolute top-10 left-10 w-16 h-4 bg-[#FBCFE8] rounded-full rotate-45 -z-10 opacity-70"></div>
      <div className="absolute top-40 right-20 w-12 h-4 bg-[#A7F3D0] rounded-full -rotate-12 -z-10 opacity-70"></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-5 bg-[#FFDAB9] rounded-full rotate-60 -z-10 opacity-70"></div>

      <main className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <OrderDetailsPanel
            eatType={eatType}
            setEatType={setEatType}
            selectedBranch={selectedBranch}
            savedAddresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            isEditingAddress={isEditingAddress}
            deliveryAddress={deliveryAddress}
            addressForm={addressForm}
            setAddressForm={setAddressForm}
            setIsEditingAddress={setIsEditingAddress}
            handleSelectAddress={handleSelectAddress}
            handleAddNewAddress={handleAddNewAddress}
            handleSaveAddress={handleSaveAddress}
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
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

          <OrderSummary
            cartItems={cartItems}
            customizingItem={customizingItem}
            handleUpdateQty={handleUpdateQty}
            handleRemove={handleRemove}
            handleUpdateNote={handleUpdateNote}
            setCustomizingItem={setCustomizingItem}
            onAddMore={() => window.location.assign("/menu")}
          />

          <div className="lg:col-span-3 space-y-6">
            <OrderTotalsPanel subTotal={subTotal} tax={tax} netTotal={netTotal} />
            <CheckoutPanel
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              creditCard={creditCard}
              setCreditCard={setCreditCard}
              uploadedSlip={uploadedSlip}
              uploadedSlipFile={uploadedSlipFile}
              handleSlipChange={handleSlipChange}
              handleSlipDrop={handleSlipDrop}
              onClearSlip={() => {
                setUploadedSlip(null);
                setUploadedSlipFile(null);
              }}
              handleOrderSubmit={handleOrderSubmit}
              cartItemsCount={cartItems.length}
              netTotal={netTotal}
              isReserveBelowMinimum={isReserveBelowMinimum}
              eatType={eatType}
              tableState={tableState}
              isProcessing={isPolling}
            />
          </div>
        </div>
      </main>

      <OrderProcessingModal isPolling={isPolling} pollingStep={pollingStep} pollingMessages={pollingMessages} />

      <div className="fixed bottom-0 left-0 w-full h-3 bg-[#1a1a1a] z-50"></div>
    </div>
  );
};

export default OrderPageShell;
