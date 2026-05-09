import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText, XCircle, MapPin, Wallet, CheckCircle, Package, Truck, Clock } from 'lucide-react'
import { useOrder, useCancelOrder } from '../api/orders'
import { StatusBadge } from '../components/ui/Badge'
import { formatPrice } from '../utils/formatPrice'
import { formatDateTime } from '../utils/formatDate'

const STEPS = [
  { key: 'placed',           label: 'Order Placed',      icon: Clock },
  { key: 'packed',           label: 'Packed',            icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery',  icon: Truck },
  { key: 'delivered',        label: 'Delivered',         icon: CheckCircle },
]

function StatusTracker({ status }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
        <XCircle size={20} className="text-red-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-600">Order Cancelled</p>
          <p className="text-xs text-slate-500">This order was cancelled.</p>
        </div>
      </div>
    )
  }

  const currentIdx = STEPS.findIndex((s) => s.key === status)

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
      <div
        className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-700 origin-top"
        style={{ height: `${(Math.max(currentIdx, 0) / (STEPS.length - 1)) * 100}%` }}
      />

      <div className="space-y-5 relative">
        {STEPS.map((step, i) => {
          const done    = i <= currentIdx
          const active  = i === currentIdx
          const Icon    = step.icon
          return (
            <div key={step.key} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${
                done
                  ? active
                    ? 'bg-primary shadow-glow ring-4 ring-primary/20'
                    : 'bg-primary'
                  : 'bg-white border-2 border-gray-200'
              }`}>
                <Icon size={16} className={done ? 'text-white' : 'text-slate-300'} />
              </div>
              <div className={`flex-1 ${active ? '' : 'opacity-60'}`}>
                <p className={`text-sm font-semibold ${done ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                {active && status !== 'delivered' && (
                  <p className="text-xs text-primary font-medium mt-0.5">In progress…</p>
                )}
                {step.key === 'delivered' && done && (
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">Completed!</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CancelModal({ orderId, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-card-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <XCircle size={22} className="text-red-500" />
        </div>
        <h3 className="font-heading font-bold text-slate-800 text-lg mb-1">Cancel Order?</h3>
        <p className="text-sm text-slate-500 mb-5">
          Order #{orderId} will be cancelled. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary justify-center py-2.5">Keep Order</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Cancelling…' : 'Yes, Cancel'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data: order, isLoading } = useOrder(id)
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder()
  const navigate = useNavigate()
  const [showCancelModal, setShowCancelModal] = useState(false)

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 h-28 skeleton-box animate-skeleton" />
        ))}
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-400 mb-4">Order not found.</p>
        <Link to="/orders" className="btn-primary">Back to Orders</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {/* Back + header */}
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors">
            <ArrowLeft size={15} />
            Back to Orders
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-heading font-bold text-2xl text-slate-800">Order #{order.id}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={order.status} />
              <button
                onClick={() => navigate(`/orders/${order.id}/invoice`)}
                className="btn-secondary btn-sm"
              >
                <FileText size={14} />
                Invoice
              </button>
              {order.status === 'placed' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn-sm inline-flex items-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                >
                  <XCircle size={14} />
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Delivered banner */}
          {order.status === 'delivered' && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
              <CheckCircle size={20} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">Order Delivered!</p>
                <p className="text-xs text-slate-500">Thank you for shopping with VegFresh.</p>
              </div>
            </div>
          )}

          {/* Status tracker */}
          <div className="card p-5 sm:p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">Order Status</h2>
            <StatusTracker status={order.status} />
          </div>

          {/* Items */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-heading font-semibold text-slate-800">Items Ordered</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product_image
                      ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      : <span className="text-2xl">🥦</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-700 text-sm">{item.product_name}</p>
                    <p className="text-xs text-slate-400">
                      {formatPrice(item.unit_price)}/{item.unit} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-700 text-sm shrink-0">
                    {formatPrice(item.unit_price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className="px-5 py-4 border-t border-gray-50 space-y-2 bg-slate-50/50">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Address + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={15} className="text-primary" />
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Delivery Address</h2>
              </div>
              {order.address ? (
                <div className="text-sm text-slate-600 space-y-0.5">
                  <p className="font-semibold text-slate-800">{order.address.full_name}</p>
                  <p>{order.address.line1}</p>
                  {order.address.line2 && <p>{order.address.line2}</p>}
                  <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
                  <p className="text-slate-400 text-xs mt-1">📞 {order.address.phone}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">No address on record</p>
              )}
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={15} className="text-primary" />
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Payment</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">💵</div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">Cash on Delivery</p>
                  <p className="text-xs text-slate-400">
                    Pay {formatPrice(order.total_amount)} on arrival
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Order Notes</p>
                  <p className="text-sm text-slate-600">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Invoice CTA */}
          <div className="card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-sm text-slate-800">Download Invoice</p>
              <p className="text-xs text-slate-400 mt-0.5">View or print a receipt for this order</p>
            </div>
            <button
              onClick={() => navigate(`/orders/${order.id}/invoice`)}
              className="btn-primary shrink-0"
            >
              <FileText size={16} />
              View Invoice
            </button>
          </div>
        </motion.div>
      </div>

      {showCancelModal && (
        <CancelModal
          orderId={order.id}
          loading={cancelling}
          onClose={() => setShowCancelModal(false)}
          onConfirm={() => cancelOrder(order.id, { onSuccess: () => setShowCancelModal(false) })}
        />
      )}
    </div>
  )
}
