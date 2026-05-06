import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAdminOrders, useUpdateOrderStatus } from '../../api/orders'
import DataTable from '../../components/admin/DataTable'
import { StatusBadge } from '../../components/ui/Badge'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/formatDate'

const STATUSES = ['placed', 'packed', 'out_for_delivery', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminOrders({
    status: statusFilter || undefined,
    page,
    page_size: 20,
  })
  const { mutate: updateStatus } = useUpdateOrderStatus()

  const orders = data?.data || []
  const totalPages = data?.total_pages || 1

  const handleStatusChange = (order, newStatus) => {
    if (newStatus === order.status) return
    updateStatus({ id: order.id, status: newStatus })
  }

  const columns = [
    { key: 'id', label: 'Order #', render: (o) => <span className="font-medium">#{o.id}</span> },
    { key: 'created_at', label: 'Date', render: (o) => formatDate(o.created_at) },
    { key: 'address', label: 'Customer', render: (o) => (
      <div>
        <p className="font-medium text-text text-sm">{o.address?.full_name || '—'}</p>
        <p className="text-xs text-slate-400">{o.address?.city}, {o.address?.state}</p>
      </div>
    )},
    { key: 'items', label: 'Items', render: (o) => <span>{o.items?.length || 0} item(s)</span> },
    { key: 'total_amount', label: 'Total', render: (o) => (
      <span className="font-semibold text-primary">{formatPrice(o.total_amount)}</span>
    )},
    { key: 'status', label: 'Status', render: (o) => (
      <select
        value={o.status}
        onChange={(e) => handleStatusChange(o, e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
        ))}
      </select>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text">Orders</h1>
        <p className="text-slate-500 text-sm mt-0.5">{data?.total || 0} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === '' ? 'All Orders' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      <DataTable columns={columns} data={orders} isLoading={isLoading} emptyMessage="No orders found" />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-secondary disabled:opacity-40">← Prev</button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary disabled:opacity-40">Next →</button>
        </div>
      )}
    </motion.div>
  )
}
