import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, CheckCircle, Package, Truck, MapPin,
  MessageSquare, Printer, ChevronDown, MoreVertical,
  ShoppingCart, Clock, X,
} from 'lucide-react'
import { useAdminOrders, useUpdateOrderStatus } from '../../api/orders'
import { StatusBadge } from '../../components/ui/Badge'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const STATUSES = ['placed', 'packed', 'out_for_delivery', 'delivered', 'cancelled']

const QUICK_FILTERS = [
  { key: '',                label: 'All Orders',     icon: ShoppingCart },
  { key: 'placed',         label: 'Pending',         icon: Clock },
  { key: 'packed',         label: 'Packed',          icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered',      label: 'Delivered',       icon: CheckCircle },
]

const QUICK_ACTIONS = [
  { label: 'Confirm',       status: 'placed',           icon: CheckCircle,  color: 'text-blue-600 hover:bg-blue-50' },
  { label: 'Packed',        status: 'packed',           icon: Package,      color: 'text-yellow-600 hover:bg-yellow-50' },
  { label: 'Out for Delivery', status: 'out_for_delivery', icon: Truck,     color: 'text-orange-600 hover:bg-orange-50' },
  { label: 'Delivered',     status: 'delivered',        icon: CheckCircle,  color: 'text-green-600 hover:bg-green-50' },
]

function OrderActionMenu({ order, onUpdateStatus }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-card-lg border border-gray-100 z-20 overflow-hidden py-1">
            <p className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Update Status</p>
            {QUICK_ACTIONS.map(({ label, status, icon: Icon, color }) => (
              <button
                key={status}
                onClick={() => { onUpdateStatus(order, status); setOpen(false) }}
                disabled={order.status === status}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${color}`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
            <div className="border-t border-gray-50 mt-1 pt-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
                <MessageSquare size={15} />
                Send WhatsApp
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <Printer size={15} />
                Print Invoice
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminOrders({
    status: statusFilter || undefined,
    page,
    page_size: 20,
  })
  const { mutate: updateStatus } = useUpdateOrderStatus()

  const orders = data?.data || []
  const totalPages = data?.total_pages || 1
  const total = data?.total || 0

  const filtered = search
    ? orders.filter((o) =>
        `${o.id} ${o.address?.full_name || ''} ${o.address?.phone || ''}`.toLowerCase().includes(search.toLowerCase())
      )
    : orders

  const handleStatusChange = (order, newStatus) => {
    if (newStatus === order.status) return
    updateStatus({ id: order.id, status: newStatus })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-screen-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{total} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="card p-1.5 inline-flex gap-1 flex-wrap">
        {QUICK_FILTERS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { setStatusFilter(key); setPage(1) }}
            className={`filter-tab flex items-center gap-2 ${statusFilter === key ? 'filter-tab-active' : 'filter-tab-inactive'}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Search + controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order, customer, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="input-field w-auto pr-8"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-box h-10 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShoppingCart size={40} className="text-slate-200 mb-3" />
              <p className="text-slate-400 font-medium">No orders found</p>
              <p className="text-slate-300 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-bold text-slate-700">#{order.id}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {(order.address?.full_name || 'U').charAt(0)}
                        </div>
                        <span className="font-medium text-slate-700 whitespace-nowrap">
                          {order.address?.full_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-slate-500 text-xs">{order.address?.phone || '—'}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 max-w-[180px]">
                        <MapPin size={12} className="text-slate-300 shrink-0" />
                        <span className="text-xs text-slate-500 truncate">
                          {[order.address?.city, order.address?.state].filter(Boolean).join(', ') || '—'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${order.payment_type === 'cod' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                        {order.payment_type === 'cod' ? 'COD' : 'Online'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <span className="font-semibold text-primary whitespace-nowrap">{formatPrice(order.total_amount)}</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(order.created_at)}</span>
                    </td>
                    <td>
                      <OrderActionMenu order={order} onUpdateStatus={handleStatusChange} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-secondary btn-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    page === p ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="btn-secondary btn-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </motion.div>
  )
}
