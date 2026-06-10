import React, { useState } from 'react'
import { X } from 'lucide-react'
import { createIngredient, addIngredientStock } from '../../api/stock'

const UNITS = ['piece', 'kg', 'g', 'L', 'ml', 'bottle', 'can', 'pack', 'box', 'bag']

const EMPTY_INGREDIENT = {
  name: '',
  unit: 'piece',
  price_per_unit: '',
  low_stock_threshold: '',
}

const EMPTY_STOCK = {
  quantity: '',
  expiryDate: '',
}

export default function StockFormModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1)
  const [ingredientForm, setIngredientForm] = useState(EMPTY_INGREDIENT)
  const [stockForm, setStockForm] = useState(EMPTY_STOCK)
  const [createdIngredientId, setCreatedIngredientId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleIngredientChange = (e) => {
    const { name, value } = e.target
    setIngredientForm(prev => ({ ...prev, [name]: value }))
  }

  const handleStockChange = (e) => {
    const { name, value } = e.target
    setStockForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveIngredient = async () => {
    setError('')
    if (!ingredientForm.name.trim()) return setError('Ingredient name is required')

    try {
      setIsSubmitting(true)
      const data = {
        name: ingredientForm.name.trim(),
        unit: ingredientForm.unit,
        price_per_unit: Number(ingredientForm.price_per_unit) || 0,
        low_stock_threshold: Number(ingredientForm.low_stock_threshold) || 0,
      }
      const response = await createIngredient(data)
      setCreatedIngredientId(response._id || response.id)
      setStep(2)
    } catch (err) {
      setError(err.message || 'Failed to create ingredient')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddStock = async () => {
    setError('')
    if (!stockForm.quantity || Number(stockForm.quantity) <= 0) {
      return setError('Please enter a valid quantity')
    }

    try {
      setIsSubmitting(true)
      const data = {
        quantity: Number(stockForm.quantity),
        expiryDate: stockForm.expiryDate || null,
      }
      await addIngredientStock(createdIngredientId, data)
      handleComplete()
    } catch (err) {
      setError(err.message || 'Failed to add stock')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    resetForm()
    onComplete()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setStep(1)
    setIngredientForm(EMPTY_INGREDIENT)
    setStockForm(EMPTY_STOCK)
    setCreatedIngredientId(null)
    setIsSubmitting(false)
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border-outer">
          <h2 className="text-[16px] font-bold text-brand-text-primary">Add New Ingredient</h2>
          <button onClick={handleClose} className="text-brand-text-tertiary hover:text-brand-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-brand-border-outer bg-brand-sidebar/50 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-brand-text-primary font-bold' : 'text-brand-text-tertiary'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-brand-text-dark text-white' : 'bg-brand-border-outer'}`}>1</span>
            <span className="text-[12px]">Ingredient Details</span>
          </div>
          <div className="w-8 h-[1px] bg-brand-border-outer"></div>
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-brand-text-primary font-bold' : 'text-brand-text-tertiary'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-brand-text-dark text-white' : 'bg-brand-border-outer'}`}>2</span>
            <span className="text-[12px]">Initial Stock</span>
          </div>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">
          {step === 1 ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Name *</label>
                <input
                  name="name"
                  value={ingredientForm.name}
                  onChange={handleIngredientChange}
                  placeholder="e.g. Chicken Breast"
                  className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Unit</label>
                  <select
                    name="unit"
                    value={ingredientForm.unit}
                    onChange={handleIngredientChange}
                    className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary bg-white"
                  >
                    {UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Cost / Unit (฿)</label>
                  <input
                    name="price_per_unit"
                    type="number"
                    value={ingredientForm.price_per_unit}
                    onChange={handleIngredientChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Alert when below</label>
                <input
                  name="low_stock_threshold"
                  type="number"
                  value={ingredientForm.low_stock_threshold}
                  onChange={handleIngredientChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Quantity *</label>
                <input
                  name="quantity"
                  type="number"
                  value={stockForm.quantity}
                  onChange={handleStockChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Expiry Date (optional)</label>
                <input
                  name="expiryDate"
                  type="date"
                  value={stockForm.expiryDate}
                  onChange={handleStockChange}
                  className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
                />
              </div>
            </>
          )}

          {error && (
            <p className="text-[12px] text-red-500 font-medium">{error}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-brand-border-outer bg-brand-sidebar/30 flex gap-3">
          {step === 1 ? (
            <>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-brand-border-outer rounded-lg text-[13px] font-medium text-brand-text-primary hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIngredient}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-text-dark/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save & Continue →'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 border border-brand-border-outer rounded-lg text-[13px] font-medium text-brand-text-primary hover:bg-white transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSkip}
                className="flex-1 px-4 py-2 border border-brand-border-outer rounded-lg text-[13px] font-medium text-brand-text-primary hover:bg-white transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleAddStock}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-text-dark/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Stock'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
