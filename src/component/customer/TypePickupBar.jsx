import React from 'react';

export default function PickupBar({ t }) {
  return (
    <div className="bg-black border-b border-greywhite/20 p-4 flex justify-center items-center space-x-6 theme-genz:bg-cream theme-genz:text-black">
      <span className="font-bold">{t.pickupType}</span>
      <button className="bg-orange text-greywhite px-4 py-1 font-bold text-sm theme-genz:rounded-full">{t.deliveryActive}</button>
      <button className="border border-greywhite px-4 py-1 hover:bg-greywhite hover:text-black transition text-sm theme-genz:border-black">{t.pickup}</button>
      <button className="border border-greywhite px-4 py-1 hover:bg-greywhite hover:text-black transition text-sm theme-genz:border-black">{t.booking}</button>
    </div>
  );
}