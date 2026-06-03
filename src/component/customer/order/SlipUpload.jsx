import React from "react";
import { UploadCloud } from "lucide-react";

const SlipUpload = ({ uploadedSlip, uploadedSlipFile, handleSlipChange, handleSlipDrop, onClearSlip }) => {
  return (
    <div>
      <label className="text-[10px] text-gray-400 uppercase font-black tracking-widest block mb-2">Upload Slip receipt</label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleSlipDrop}
        className="bg-black/80 border-2 border-dashed border-white/20 rounded-2xl p-4 text-center cursor-pointer hover:border-[#DC5F00] transition-colors relative flex flex-col justify-center items-center"
      >
        <input
          type="file"
          accept="image/*"
          id="slip-upload"
          className="hidden"
          onChange={handleSlipChange}
        />
        <label htmlFor="slip-upload" className="cursor-pointer flex flex-col items-center gap-1.5 w-full">
          {uploadedSlip ? (
            <div className="flex items-center gap-3 w-full bg-[#111] p-2 rounded-xl border border-white/10">
              <img
                src={uploadedSlip}
                alt="slip receipt preview"
                className="w-12 h-12 object-cover rounded-lg border border-white/20 shrink-0"
              />
              <div className="text-left flex-1 min-w-0 text-white">
                <p className="text-xs font-black truncate">{uploadedSlipFile?.name || "Uploaded Slip"}</p>
                <p className="text-[9px] text-green-500 font-black tracking-wider uppercase mt-0.5">SLIP SELECTED ✓</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onClearSlip();
                }}
                className="p-2 bg-red-900/40 hover:bg-red-700 text-red-300 rounded-lg hover:text-white transition-colors cursor-pointer text-[10px] font-bold"
              >
                Clear
              </button>
            </div>
          ) : (
            <>
              <UploadCloud size={24} className="text-[#DC5F00] animate-bounce" />
              <p className="text-xs font-bold text-gray-300">Drag & Drop or Click to Upload Slip</p>
              <p className="text-[9px] text-gray-500 font-bold leading-none">Supports PNG, JPG, JPEG formats</p>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default SlipUpload;
