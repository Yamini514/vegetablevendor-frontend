import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { DocumentArrowDownIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { useOrder } from '../api/orders'
import OrderStatusTracker from '../components/orders/OrderStatusTracker'
import { StatusBadge } from '../components/ui/Badge'
import { formatPrice } from '../utils/formatPrice'
import { formatDateTime } from '../utils/formatDate'
import { PageLoader } from '../components/ui/Spinner'

export default function OrderDetailPage() {
  const { id }                        = useParams()
  const { data: order, isLoading }    = useOrder(id)
  const navigate                      = useNavigate()

  if (isLoading) return <PageLoader />

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Order not found.</p>
        <Link to="/orders" className="btn-primary mt-4 inline-flex">Back to Orders</Link>
      </div>
    )
  }

  const handleInvoice = () => navigate(`/orders/${order.id}/invoice`)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Back */}
      <Link to="/orders" className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6 transition-colors">
        ← Back to Orders
      </Link>

      {/* Header row */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl text-text">Order #{order.id}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{formatDateTime(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          <button
            onClick={handleInvoice}
            className="flex items-center gap-1.5 text-xs font-medium text-primary border border-primary/30 hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg transition-all"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            Invoice
          </button>
        </div>
      </div>

      {/* Delivery estimate banner */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && order.delivery_window && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
          <CalendarDaysIcon className="w-5 h-5 text-green-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">Estimated Delivery</p>
            <p className="text-xs text-green-600">{order.delivery_window}</p>
          </div>
        </div>
      )}

      {order.status === 'delivered' && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-6">
          <span className="text-xl">✅</span>
          <div>
            <p className="text-sm font-semibold text-primary">Order Delivered!</p>
            <p className="text-xs text-slate-500">Your order was delivered on {order.delivery_date}</p>
          </div>
        </div>
      )}

      {/* Status tracker */}
      <div className="card p-6 mb-6">
        <h2 className="font-heading font-semibold text-sm text-slate-500 uppercase tracking-wide mb-5">
          Order Status
        </h2>
        <OrderStatusTracker status={order.status} />
      </div>

      {/* Items */}
      <div className="card p-5 mb-6">
        <h2 className="font-heading font-semibold text-base mb-4">Items Ordered</h2>
        <div className="divide-y divide-gray-50">
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                {item.product_image ? (
                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-2xl">🥦</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-text">{item.product_name}</p>
                <p className="text-xs text-slate-400">
                  {formatPrice(item.unit_price)}/{item.unit} × {item.quantity}
                </p>
              </div>
              <span className="font-semibold text-sm text-text">
                {formatPrice(item.unit_price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 mt-2 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>{formatPrice(order.total_amount)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Delivery</span>
            <span className="text-green-600 font-medium">FREE</span>
          </div>
          <div className="flex justify-between font-heading font-bold text-base pt-2 border-t border-gray-100">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Address + Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h2 className="font-heading font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">
            Delivery Address
          </h2>
          {order.address ? (
            <div className="text-sm text-slate-700 space-y-0.5">
              <p className="font-semibold text-text">{order.address.full_name}</p>
              <p>{order.address.line1}</p>
              {order.address.line2 && <p>{order.address.line2}</p>}
              <p>{order.address.city}, {order.address.state} – {order.address.pincode}</p>
              <p className="text-slate-400">📞 {order.address.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Address not available</p>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-heading font-semibold text-sm text-slate-500 uppercase tracking-wide mb-3">
            Payment
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💵</span>
            <div>
              <p className="font-semibold text-sm text-text">Cash on Delivery</p>
              <p className="text-xs text-slate-400">Pay ₹{((order.total_amount || 0) / 100).toFixed(2)} on delivery</p>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-slate-500 mb-1">Order Notes:</p>
              <p className="text-sm text-slate-700">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Invoice download CTA */}
      <div className="card p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-sm text-text">Download Invoice</p>
          <p className="text-xs text-slate-400 mt-0.5">View or print a PDF receipt for this order</p>
        </div>
        <button
          onClick={handleInvoice}
          className="btn-primary flex items-center gap-2 shrink-0"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          View Invoice
        </button>
      </div>
    </motion.div>
  )
}
