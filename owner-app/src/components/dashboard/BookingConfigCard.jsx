import React, { useState, useEffect } from 'react'
import { Settings, Check, Loader2 } from 'lucide-react'
import { useBookingConfig } from '../../hooks/useBookingConfig'

export default function BookingConfigCard() {
  const { config, isLoading, updateConfig } = useBookingConfig()
  const [localValues, setLocalValues] = useState({
    oneTwoMin: 0,
    threeSixMin: 0,
    sevenTenMin: 0
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    if (config) {
      setLocalValues({
        oneTwoMin: config.oneTwoMin || 600,
        threeSixMin: config.threeSixMin || 1200,
        sevenTenMin: config.sevenTenMin || 2500
      })
    }
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateConfig(localValues)
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    } catch (err) {
      alert('Failed to save settings: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalValues(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
  }

  return (
    <div className="bg-white border border-brand-border-outer rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px] font-bold text-brand-text-primary">
          <Settings size={16} className="text-brand-text-secondary" />
          Reservation Thresholds
        </div>
        {showSaved && (
          <div className="flex items-center gap-1 text-brand-success text-[12px] font-bold animate-in fade-in duration-300">
            <Check size={14} /> Saved!
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">
            1-2 People minimum (฿)
          </label>
          <input
            type="number"
            name="oneTwoMin"
            value={localValues.oneTwoMin}
            onChange={handleChange}
            className="w-full border border-brand-border-outer rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-border-active transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">
            3-6 People minimum (฿)
          </label>
          <input
            type="number"
            name="threeSixMin"
            value={localValues.threeSixMin}
            onChange={handleChange}
            className="w-full border border-brand-border-outer rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-border-active transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-bold text-brand-text-secondary uppercase tracking-wider">
            7-10 People minimum (฿)
          </label>
          <input
            type="number"
            name="sevenTenMin"
            value={localValues.sevenTenMin}
            onChange={handleChange}
            className="w-full border border-brand-border-outer rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-border-active transition-colors"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="mt-2 w-full flex items-center justify-center gap-2 bg-brand-text-dark text-white px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-brand-text-dark/90 transition-colors disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </div>
  )
}
