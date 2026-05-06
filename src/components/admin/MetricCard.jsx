const colors = {
  green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
  red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
}

export default function MetricCard({ label, value, icon, color = 'green', subtitle }) {
  const c = colors[color] || colors.green
  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className={`font-heading font-bold text-2xl ${c.text}`}>
            {value ?? '—'}
          </p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`${c.bg} rounded-xl p-2.5 text-xl`}>{icon}</div>
        )}
      </div>
    </div>
  )
}
