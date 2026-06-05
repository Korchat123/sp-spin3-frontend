import React, { useState, useEffect } from "react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="px-4 py-3 mb-6 mx-4 bg-[#1a1a1a] rounded-xl border border-white/5 flex flex-col items-center justify-center">
      <div className="flex items-baseline gap-1">
        <span className="font-['Bebas_Neue'] text-4xl text-white tracking-widest leading-none">
          {time.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="font-bold text-[#e4002b] text-sm animate-pulse mb-1">
          {time.toLocaleTimeString("en-GB", { second: "2-digit" })}
        </span>
      </div>
      <span className="text-[0.65rem] font-bold text-[#888888] uppercase tracking-widest mt-1.5">
        {time.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    </div>
  );
};

export default LiveClock;
