import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, MessageSquare, ChevronRight, Package, Truck, CheckCircle, ClipboardList } from 'lucide-react'

const MOCK_DELIVERIES = [
  { id: 101, customer: 'Priya Sharma',  phone: '9876543210', address: '12 MG Road, Hyderabad', payment: 'online', eta: '11:30 AM', notes: 'Call before delivery', amount: 480 },
  { id: 102, customer: 'Rahul Kumar',   phone: '9123456789', address: '45 Jubilee Hills, Hyd', payment: 'cod',    eta: '12:00 PM', notes: '',                   amount: 260 },
  { id: 103, customer: 'Anita Reddy',   phone: '9988776655', address: '7 Banjara Hills, Hyd',  payment: 'online', eta: '10:45 AM', notes: 'Leave at door',       amount: 740 },
  { id: 104, customer: 'Suresh Babu',   phone: '9444332211', address: '22 Gachibowli, Hyd',   payment: 'cod',    eta: '1:15 PM',  notes: '',                   amount: 350 },
  { id: 105, customer: 'Lakshmi Devi',  phone: '9876001122', address: '3 Kondapur, Hyd',      payment: 'online', eta: '11:00 AM', notes: 'Morning preferred',   amount: 620 },
  { id: 106, customer: 'Mohan Rao',     phone: '9900112233', address: '88 Madhapur, Hyd',     payment: 'cod',    eta: '2:00 PM',  notes: '',                   amount: 190 },
  { id: 107, customer: 'Kavitha Singh', phone: '9123001122', address: '15 Ameerpet, Hyd',     payment: 'online', eta: '12:30 PM', notes: 'Ring doorbell twice', amount: 520 },
]

const COLUMNS = [
  { key: 'pending',          label: 'Pending',         icon: ClipboardList, color: 'border-t-blue-400',   bg: 'bg-blue-50',   count_color: 'bg-blue-100 text-blue-700' },
  { key: 'packed',           label: 'Packed',          icon: Package,       color: 'border-t-yellow-400', bg: 'bg-yellow-50', count_color: 'bg-yellow-100 text-yellow-700' },
  { key: 'out_for_delivery', label: 'Out for Delivery',icon: Truck,         color: 'border-t-orange-400', bg: 'bg-orange-50', count_color: 'bg-orange-100 text-orange-700' },
  { key: 'delivered',        label: 'Delivered',       icon: CheckCircle,   color: 'border-t-green-400',  bg: 'bg-green-50',  count_color: 'bg-green-100 text-green-700' },
]

const INITIAL_STATE = {
  pending: MOCK_DELIVERIES.slice(0, 2),
  packed: MOCK_DELIVERIES.slice(2, 4),
  out_for_delivery: MOCK_DELIVERIES.slice(4, 6),
  delivered: MOCK_DELIVERIES.slice(6),
}

function DeliveryCard({ delivery, onMove, columnKey, columns }) {
  const colIndex = columns.findIndex((c) => c.key === columnKey)
  const nextCol  = columns[colIndex + 1]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 hover:shadow-card-lg transition-shadow space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{delivery.customer}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Order #{delivery.id}</p>
        </div>
        <span className={`badge shrink-0 ${delivery.payment === 'cod' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
          {delivery.payment === 'cod' ? 'COD' : 'Online'}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <MapPin size={12} className="text-slate-300 mt-0.5 shrink-0" />
          <span className="leading-snug">{delivery.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={12} className="text-slate-300 shrink-0" />
          <span>{delivery.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-slate-300 shrink-0" />
          <span>ETA: <strong className="text-slate-700">{delivery.eta}</strong></span>
        </div>
        {delivery.notes && (
          <div className="bg-yellow-50 text-yellow-700 rounded-lg px-2 py-1 text-[11px] font-medium">
            📝 {delivery.notes}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <span className="font-bold text-primary text-sm">₹{delivery.amount}</span>
        <div className="flex items-center gap-1.5">
          <button className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="WhatsApp">
            <MessageSquare size={14} />
          </button>
          {nextCol && (
            <button
              onClick={() => onMove(delivery, columnKey, nextCol.key)}
              className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              {nextCol.label === 'Delivered' ? 'Mark Delivered' : `→ ${nextCol.label}`}
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminDeliveriesPage() {
  const [columns, setColumns] = useState(INITIAL_STATE)

  const moveDelivery = (delivery, from, to) => {
    setColumns((prev) => ({
      ...prev,
      [from]: prev[from].filter((d) => d.id !== delivery.id),
      [to]: [...prev[to], delivery],
    }))
  }

  const totalToday = Object.values(columns).flat().length

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Deliveries</h1>
          <p className="page-subtitle">{totalToday} deliveries today — drag cards to update status</p>
        </div>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map(({ key, label, icon: Icon, color, bg, count_color }) => {
          const items = columns[key] || []
          return (
            <div key={key} className={`rounded-2xl border-t-4 bg-slate-50/80 border border-gray-100 ${color} overflow-hidden`}>
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white/80">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-slate-500" />
                  <span className="font-semibold text-slate-700 text-sm">{label}</span>
                </div>
                <span className={`badge text-xs font-bold ${count_color}`}>{items.length}</span>
              </div>
              {/* Cards */}
              <div className="p-3 space-y-3 min-h-24">
                {items.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-slate-300">
                    <Icon size={24} />
                  </div>
                ) : (
                  items.map((delivery) => (
                    <DeliveryCard
                      key={delivery.id}
                      delivery={delivery}
                      columnKey={key}
                      columns={COLUMNS}
                      onMove={moveDelivery}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
