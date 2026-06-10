import { useState } from 'react'

export default function AIWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[1000] sm:bottom-6 sm:right-6">
      <button 
        onClick={() => setOpen(!open)}
        className="w-16 h-16 bg-brand-text-dark text-white rounded-full shadow-2xl flex items-center justify-center"
      >
        AI
      </button>
      {open && (
        <div className="absolute bottom-20 right-0 h-96 w-[calc(100vw-2rem)] max-w-64 bg-white border border-brand-border-outer rounded-xl shadow-2xl p-4">
          <h3 className="font-bold">พุงกางMAN</h3>
          <p className="text-sm text-brand-text-secondary">AI Assistant is ready.</p>
        </div>
      )}
    </div>
  );
}
