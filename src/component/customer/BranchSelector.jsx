// src/component/customer/BranchSelector.jsx
import React, { useState } from 'react';
import MapView from './MapView';

export default function BranchSelector({ onSelectBranch, onUpdateAddress }) {
  const [loading, setLoading] = useState(false);

  const findMyLocation = () => {
    if (!navigator.geolocation) {
      alert("เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mockAddress = `พิกัด: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (ปากเกร็ด)`;
        onUpdateAddress(mockAddress);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        alert("ไม่สามารถเข้าถึงตำแหน่งได้");
      }
    );
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-center lg:text-left text-4xl font-bebas tracking-widest text-brand-black border-l-8 border-brand-red pl-4">
        1. SELECT A BRANCH
      </h2>

      {/* แผนที่: ใส่กรอบมน 32px และเงาแข็ง */}
      <div className="w-full h-[400px] border-[3px] border-brand-black rounded-[2rem] shadow-[8px_8px_0_#242424] overflow-hidden z-10 bg-brand-white">
        <MapView onSelectBranch={onSelectBranch} />
      </div>

      {/* ส่วนค้นหา */}
      <div className="flex flex-wrap items-center gap-3">
        <input 
          type="text" 
          placeholder="ค้นหาสถานที่..." 
          className="flex-1 border-[3px] border-brand-black p-3 rounded-full focus:outline-none focus:ring-4 focus:ring-brand-orange/30 bg-brand-white font-bold"
        />
        <button 
          onClick={findMyLocation}
          className={`bg-brand-black text-brand-white px-6 py-3 rounded-full font-bebas text-xl tracking-widest border-[3px] border-brand-black shadow-[4px_4px_0_#DC5F00] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#DC5F00] transition-all duration-300 ${loading ? 'animate-pulse' : ''}`}
        >
          {loading ? 'LOCATING...' : '📍 MY LOCATION'}
        </button>
      </div>
      
      {/* ลิสต์สาขา */}
      <div className="bg-brand-white p-6 rounded-[2rem] border-[3px] border-brand-black shadow-[8px_8px_0_#242424]">
        <h3 className="text-2xl font-bebas tracking-widest mb-4 border-b-4 border-brand-gray pb-2 text-brand-black">
          NEARBY BRANCHES (PAKKRET)
        </h3>
        
        {/* สาขา 1 */}
        <div className="border-[3px] border-brand-black p-4 flex flex-col sm:flex-row justify-between items-center mb-4 rounded-2xl bg-brand-gray/30 hover:bg-brand-white hover:-translate-y-1 hover:shadow-[4px_4px_0_#242424] transition-all duration-300">
          <div className="mb-3 sm:mb-0 text-center sm:text-left">
            <p className="font-bold text-lg text-brand-black">KFC สาขา โลตัส ปากเกร็ด</p>
            <p className="text-sm font-medium opacity-70">ระยะทาง: 1.2 กม.</p>
          </div>
          <button 
            onClick={() => onSelectBranch('โลตัส ปากเกร็ด')} 
            className="bg-brand-orange text-brand-white px-6 py-2 rounded-full font-bebas text-xl tracking-widest border-2 border-brand-black shadow-[4px_4px_0_#242424] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#242424] transition-all duration-300"
          >
            SELECT
          </button>
        </div>

        {/* สาขา 2 */}
        <div className="border-[3px] border-brand-black p-4 flex flex-col sm:flex-row justify-between items-center rounded-2xl bg-brand-gray/30 hover:bg-brand-white hover:-translate-y-1 hover:shadow-[4px_4px_0_#242424] transition-all duration-300">
          <div className="mb-3 sm:mb-0 text-center sm:text-left">
            <p className="font-bold text-lg text-brand-black">KFC สาขา เมเจอร์ ฮอลลีวูด</p>
            <p className="text-sm font-medium opacity-70">ระยะทาง: 2.5 กม.</p>
          </div>
          <button 
            onClick={() => onSelectBranch('เมเจอร์ ฮอลลีวูด ปากเกร็ด')} 
            className="bg-brand-orange text-brand-white px-6 py-2 rounded-full font-bebas text-xl tracking-widest border-2 border-brand-black shadow-[4px_4px_0_#242424] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#242424] transition-all duration-300"
          >
            SELECT
          </button>
        </div>
      </div>
    </section>
  );
}