import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon, EnvelopeOpenIcon } from '@heroicons/react/24/outline'
import { useContactMessages, useMarkContactMessageRead, useDeleteContactMessage } from '../../api/admin'
import { formatDate } from '../../utils/formatDate'
import { PageLoader } from '../../components/ui/Spinner'

function MessageModal({ msg, onClose }) {
  const { mutate: markRead } = useMarkContactMessageRead()

  if (!msg) return null

  const handleOpen = () => {
    if (!msg.read) markRead(msg.id)
  }

  // mark read when modal opens
  useState(() => { handleOpen() }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-text">{msg.subject || '(no subject)'}</h3>
            <p className="text-sm text-slate-500 mt-0.5">From {msg.name} &lt;{msg.email}&gt;</p>
            <p className="text-xs text-slate-400">{formatDate(msg.created_at)}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none mt-1">✕</button>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
          {msg.message}
        </div>
        <div className="mt-4 flex justify-end">
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Your message')}`}
            className="btn-primary text-sm"
          >
            Reply via Email
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AdminContactMessagesPage() {
  const [page, setPage]         = useState(1)
  const [unreadOnly, setUnread] = useState(false)
  const [selected, setSelected] = useState(null)

  const { data, isLoading } = useContactMessages({ page, unread: unreadOnly ? 'true' : undefined, page_size: 20 })
  const { mutate: markRead }   = useMarkContactMessageRead()
  const { mutate: deleteMsg }  = useDeleteContactMessage()

  const messages   = data?.data  || []
  const totalPages = data?.total_pages || 1
  const total      = data?.total || 0
  const unreadCount = data?.unread_count ?? 0

  const open = (msg) => {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  if (isLoading) return <PageLoader />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text">Contact Messages</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {total} total{unreadCount > 0 && <span className="ml-1 text-primary font-semibold">· {unreadCount} unread</span>}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-600">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => { setUnread(e.target.checked); setPage(1) }}
            className="rounded text-primary focus:ring-primary"
          />
          Show unread only
        </label>
      </div>

      <div className="card divide-y divide-gray-50">
        {messages.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">No messages found</div>
        ) : messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer ${!msg.read ? 'bg-primary-50/40' : ''}`}
            onClick={() => open(msg)}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-slate-200' : 'bg-primary'}`} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-text">{msg.name}</span>
                  <span className="text-xs text-slate-400">{msg.email}</span>
                </div>
                {msg.subject && <p className="text-sm text-slate-600 truncate">{msg.subject}</p>}
                <p className="text-xs text-slate-400 truncate mt-0.5">{msg.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(msg.created_at)}</span>
              {!msg.read && (
                <button
                  onClick={(e) => { e.stopPropagation(); markRead(msg.id) }}
                  title="Mark as read"
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 transition-colors"
                >
                  <EnvelopeOpenIcon className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (window.confirm('Delete this message?')) deleteMsg(msg.id)
                }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary disabled:opacity-40">← Prev</button>
          <span className="text-sm text-slate-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary disabled:opacity-40">Next →</button>
        </div>
      )}

      {selected && <MessageModal msg={selected} onClose={() => setSelected(null)} />}
    </motion.div>
  )
}
