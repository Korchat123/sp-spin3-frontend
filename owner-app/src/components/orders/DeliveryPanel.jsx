import { useState, useEffect } from 'react'
import { Truck, User, Phone, Navigation, RefreshCw, ChevronDown } from 'lucide-react'
import { getStaff } from '../../api/staff'
import { reassignRider, updateDeliveryStatus, getDeliveriesList } from '../../api/orders'

export default function DeliveryPanel({ order, onUpdate }) {
  const [delivery, setDelivery] = useState(null)
  const [riders, setRiders] = useState([])
  const [isReassigning, setIsReassigning] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDeliveryData()
  }, [order.id])

  const fetchDeliveryData = async () => {
    setLoading(true)
    try {
      const [deliveries, staff] = await Promise.all([
        getDeliveriesList(),
        getStaff()
      ])
      const match = deliveries.find(d => d.order === order.id || d.order?._id === order.id)
      setDelivery(match || null)
      setRiders(staff.filter(s => s.role === 'rider' && !s.isLocked))
    } catch (err) {
      console.error('Failed to fetch delivery info:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReassign = async (riderId) => {
    if (!delivery) return
    try {
      await reassignRider(delivery._id, riderId)
      setIsReassigning(false)
      fetchDeliveryData()
      onUpdate()
    } catch (err) {
      alert('Failed to reassign rider: ' + err.message)
    }
  }

  const handleStatusChange = async (status) => {
    if (!delivery) return
    try {
      await updateDeliveryStatus(delivery._id, status)
      fetchDeliveryData()
      onUpdate()
    } catch (err) {
      alert('Failed to update delivery status: ' + err.message)
    }
  }

  if (loading && !delivery) {
    return (
      <div className="bg-brand-page border border-brand-border-inner rounded-xl p-8 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-brand-text-tertiary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!delivery && !loading) {
    return (
      <div className="bg-brand-page border border-brand-border-inner rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-brand-text-tertiary">
        <Navigation size={24} className="opacity-20" />
        <span className="text-[12px] italic">No delivery record found</span>
      </div>
    )
  }

  const rider = delivery?.rider_id || null

  return (
    <div className="bg-brand-page border border-brand-border-inner rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] font-bold text-brand-text-tertiary uppercase tracking-widest">
          <Truck size={14} /> Delivery Info
        </div>
        {!isReassigning && (
          <button 
            onClick={() => setIsReassigning(true)}
            className="text-[10px] font-bold text-brand-text-dark-neutral hover:underline flex items-center gap-1"
          >
            <RefreshCw size={10} /> {rider ? 'Re-assign' : 'Assign Rider'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Management */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Rider</label>
            {isReassigning ? (
              <div className="flex flex-col gap-2">
                <select 
                  className="w-full bg-white border border-brand-border-outer rounded-lg px-3 py-2 text-[13px] outline-none"
                  onChange={(e) => handleReassign(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>Select a rider...</option>
                  {riders.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.name} {r.surname} {r.on_duty ? '(On Duty)' : '(Off Duty)'}
                    </option>
                  ))}
                </select>
                <button onClick={() => setIsReassigning(false)} className="text-[10px] text-left text-brand-text-tertiary hover:text-brand-text-primary px-1">Cancel</button>
              </div>
            ) : rider ? (
              <div className="bg-white border border-brand-border-outer rounded-lg px-3 py-2 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-sidebar flex items-center justify-center text-brand-text-secondary">
                  <User size={16} />
                </div>
                <div className="flex flex-col">
                  <div className="text-[13px] font-bold text-brand-text-primary">{rider.name} {rider.surname}</div>
                  <div className="text-[11px] text-brand-text-secondary flex items-center gap-1">
                    <Phone size={10} /> {rider.phone}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-[12px] text-brand-text-tertiary italic px-1">No rider assigned</div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Delivery Status</label>
            <select 
              value={delivery.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full bg-white border border-brand-border-outer rounded-lg px-3 py-2 text-[13px] outline-none cursor-pointer"
            >
              <option value="waiting">Waiting</option>
              <option value="picked-up">Picked Up</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Address</label>
            <div className="text-[12px] text-brand-text-primary bg-white border border-brand-border-outer rounded-lg px-3 py-2 min-h-[40px]">
              {delivery.customer?.address || order.customer?.address || 'N/A'}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-brand-text-tertiary uppercase tracking-widest">Proof of Delivery</label>
            {delivery.proof_photo_url ? (
              <a href={delivery.proof_photo_url} target="_blank" rel="noreferrer">
                <img src={delivery.proof_photo_url} className="w-full h-32 object-cover rounded-lg border border-brand-border-outer hover:opacity-90 transition-opacity" alt="Proof" />
              </a>
            ) : (
              <div className="h-32 flex items-center justify-center bg-brand-sidebar/30 border border-dashed border-brand-border-outer rounded-lg text-[11px] text-brand-text-tertiary italic">
                No proof photo yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
