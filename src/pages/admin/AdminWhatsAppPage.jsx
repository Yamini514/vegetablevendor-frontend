import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, CheckCircle, XCircle, Clock, Search, X, RefreshCw, Send } from 'lucide-react'

const MOCK_LOGS = [
  { id: 1, to: '9876543210', customer: 'Priya Sharma',   type: 'order_confirm',    message: 'Your order #101 has been confirmed! Total: ₹480. Expected delivery: Today.',  status: 'sent',    time: '2025-05-07 09:12' },
  { id: 2, to: '9123456789', customer: 'Rahul Kumar',    type: 'delivery_update',  message: 'Your order #102 is out for delivery! Our executive will reach you by 12 PM.',  status: 'sent',    time: '2025-05-07 10:05' },
  { id: 3, to: '9988776655', customer: 'Anita Reddy',    type: 'order_confirm',    message: 'Your order #103 has been confirmed! Total: ₹740. Expected delivery: Today.',  status: 'failed',  time: '2025-05-07 08:45' },
  { id: 4, to: '9444332211', customer: 'Suresh Babu',    type: 'cod_reminder',     message: 'Please keep ₹350 ready for your COD order #104 delivery.',                   status: 'sent',    time: '2025-05-06 18:30' },
  { id: 5, to: '9876001122', customer: 'Lakshmi Devi',   type: 'delivery_update',  message: 'Order #105 delivered! Thank you for shopping. Rate us ⭐',                   status: 'sent',    time: '2025-05-06 14:20' },
  { id: 6, to: '9900112233', customer: 'Mohan Rao',      type: 'low_stock_alert',  message: 'Hi Admin — Tomatoes stock is running low (3 kg remaining).',                 status: 'sent',    time: '2025-05-06 08:00' },
  { id: 7, to: '9123001122', customer: 'Kavitha Singh',  type: 'order_confirm',    message: 'Your order #107 has been confirmed! Total: ₹520.',                          status: 'pending', time: '2025-05-07 11:30' },
  { id: 8, to: '9912345678', customer: 'Vijay Menon',    type: 'delivery_update',  message: 'Your order #108 is packed and will be delivered soon.',                     status: 'failed',  time: '2025-05-05 16:00' },
]

const TEMPLATES = [
  { key: 'order_confirm',   label: 'Order Confirmation', preview: 'Your order #{{id}} has been confirmed! Total: ₹{{amount}}. Expected delivery: Today.' },
  { key: 'delivery_update', label: 'Delivery Update',    preview: 'Your order #{{id}} is out for delivery! Our executive will reach you by {{eta}}.' },
  { key: 'cod_reminder',    label: 'COD Reminder',       preview: 'Please keep ₹{{amount}} ready for your COD order #{{id}} delivery.' },
  { key: 'delivered',       label: 'Delivered',          preview: 'Order #{{id}} delivered! Thank you for shopping with VegFresh. Rate us ⭐' },
]

const typeConfig = {
  order_confirm:   { label: 'Order Confirm',    bg: 'bg-blue-50 text-blue-700' },
  delivery_update: { label: 'Delivery Update',  bg: 'bg-orange-50 text-orange-700' },
  cod_reminder:    { label: 'COD Reminder',     bg: 'bg-yellow-50 text-yellow-700' },
  low_stock_alert: { label: 'Low Stock Alert',  bg: 'bg-red-50 text-red-700' },
  delivered:       { label: 'Delivered',        bg: 'bg-green-50 text-green-700' },
}

const statusIcon = {
  sent:    <CheckCircle size={14} className="text-emerald-500" />,
  failed:  <XCircle    size={14} className="text-red-500" />,
  pending: <Clock      size={14} className="text-yellow-500" />,
}

export default function AdminWhatsAppPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showTemplates, setShowTemplates] = useState(false)

  const filtered = MOCK_LOGS.filter((l) => {
    const matchSearch = !search || `${l.customer} ${l.to}`.toLowerCase().includes(search.toLowerCase())
    const matchType   = typeFilter   === 'all' || l.type   === typeFilter
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const sentCount    = MOCK_LOGS.filter((l) => l.status === 'sent').length
  const failedCount  = MOCK_LOGS.filter((l) => l.status === 'failed').length
  const pendingCount = MOCK_LOGS.filter((l) => l.status === 'pending').length

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 max-w-screen-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">WhatsApp Logs</h1>
          <p className="page-subtitle">{MOCK_LOGS.length} messages tracked</p>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="btn-primary"
        >
          <Send size={16} />
          Message Templates
        </button>
      </div>

      {/* Templates panel */}
      {showTemplates && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Message Templates</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TEMPLATES.map((t) => (
              <div key={t.key} className="border border-gray-100 rounded-2xl p-4 hover:border-primary/30 hover:bg-primary-50 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-slate-700 group-hover:text-primary transition-colors">{t.label}</span>
                  <button className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <Send size={11} /> Use
                  </button>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{t.preview}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Sent',    value: sentCount,    icon: CheckCircle, color: 'bg-emerald-500', ring: 'ring-emerald-100' },
          { label: 'Failed',  value: failedCount,  icon: XCircle,     color: 'bg-red-500',     ring: 'ring-red-100' },
          { label: 'Pending', value: pendingCount, icon: Clock,       color: 'bg-yellow-500',  ring: 'ring-yellow-100' },
        ].map(({ label, value, icon: Icon, color, ring }) => (
          <div key={label} className="stat-card flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0 ring-4 ${ring}`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading text-slate-800">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <X size={14} />
            </button>
          )}
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="input-field w-auto">
          <option value="all">All Types</option>
          {Object.entries(typeConfig).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <div className="card p-1 flex gap-1">
          {['all', 'sent', 'failed', 'pending'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`filter-tab capitalize ${statusFilter === s ? 'filter-tab-active' : 'filter-tab-inactive'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Log table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Message</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <MessageSquare size={36} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400">No messages found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="flex items-center gap-1.5">
                        {statusIcon[log.status]}
                        <span className={`text-xs font-medium capitalize ${
                          log.status === 'sent' ? 'text-emerald-600' :
                          log.status === 'failed' ? 'text-red-500' : 'text-yellow-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium text-slate-700">{log.customer}</span>
                    </td>
                    <td>
                      <span className="text-slate-500 text-xs">{log.to}</span>
                    </td>
                    <td>
                      <span className={`badge ${typeConfig[log.type]?.bg || 'bg-slate-100 text-slate-600'}`}>
                        {typeConfig[log.type]?.label || log.type}
                      </span>
                    </td>
                    <td className="max-w-xs">
                      <p className="text-xs text-slate-600 truncate">{log.message}</p>
                    </td>
                    <td>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{log.time}</span>
                    </td>
                    <td>
                      {log.status === 'failed' && (
                        <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary-50 px-2.5 py-1.5 rounded-lg transition-colors">
                          <RefreshCw size={12} />
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
