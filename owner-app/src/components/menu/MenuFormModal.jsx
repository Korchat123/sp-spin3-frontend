import React, { useState } from 'react'
import { X } from 'lucide-react'

const CATEGORIES = ['chicken', 'burger', 'combo', 'drink', 'side', 'dessert']

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  image: '',
  category: 'chicken',
  cookingTime: 0,
}

export default function MenuFormModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.name.trim()) return setError('Name is required')
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return setError('Please enter a valid price')
    if (!form.category) return setError('Category is required')

    try {
      setIsSubmitting(true)
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        category: form.category,
        cookingTime: Number(form.cookingTime) || 0,
      })
      setForm(EMPTY_FORM)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create menu item')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border-outer">
          <h2 className="text-[16px] font-bold text-brand-text-primary">Add New Menu Item</h2>
          <button onClick={onClose} className="text-brand-text-tertiary hover:text-brand-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Spicy Chicken Sandwich"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Price (฿) *</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://... (leave empty for now)"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-bold text-brand-text-secondary uppercase tracking-wider">Cooking Time (seconds)</label>
            <input
              name="cookingTime"
              type="number"
              value={form.cookingTime}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-brand-border-outer rounded-lg text-[13px] outline-none focus:border-brand-text-tertiary"
            />
          </div>

          {error && (
            <p className="text-[12px] text-red-500 font-medium">{error}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-brand-border-outer flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-brand-border-outer rounded-lg text-[13px] font-medium text-brand-text-primary hover:bg-brand-sidebar transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-brand-text-dark text-white rounded-lg text-[13px] font-medium hover:bg-brand-text-dark/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}
