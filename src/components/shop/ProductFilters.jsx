import { useCategories } from '../../api/categories'
import Skeleton from '../ui/Skeleton'

export default function ProductFilters({ filters, onChange }) {
  const { data: categories, isLoading } = useCategories()

  const handleCategory = (id) => {
    const current = filters.category_id
    onChange({ ...filters, category_id: current === id ? '' : id, page: 1 })
  }

  const handlePrice = (key, val) => {
    onChange({ ...filters, [key]: val, page: 1 })
  }

  const clearAll = () => {
    onChange({ page: 1 })
  }

  const hasFilters = filters.category_id || filters.min_price || filters.max_price || filters.search

  return (
    <aside className="w-full">
      <div className="card p-4 sticky top-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm text-text">Filters</h3>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-red-500 hover:underline">
              Clear All
            </button>
          )}
        </div>

        {/* Category */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Category</p>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-5 w-3/4" />)}
            </div>
          ) : (
            <div className="space-y-2">
              {(categories || []).map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.category_id == cat.id}
                    onChange={() => handleCategory(cat.id)}
                    className="w-4 h-4 accent-primary rounded"
                  />
                  <span className={`text-sm transition-colors ${
                    filters.category_id == cat.id ? 'text-primary font-medium' : 'text-slate-600 group-hover:text-primary'
                  }`}>
                    {cat.name}
                  </span>
                  {cat.product_count > 0 && (
                    <span className="text-xs text-slate-400 ml-auto">({cat.product_count})</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Price Range</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Min (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price ? filters.min_price / 100 : ''}
                onChange={(e) => handlePrice('min_price', e.target.value ? Math.round(e.target.value * 100) : '')}
                className="input-field text-xs py-1.5"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">Max (₹)</label>
              <input
                type="number"
                placeholder="Any"
                value={filters.max_price ? filters.max_price / 100 : ''}
                onChange={(e) => handlePrice('max_price', e.target.value ? Math.round(e.target.value * 100) : '')}
                className="input-field text-xs py-1.5"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
