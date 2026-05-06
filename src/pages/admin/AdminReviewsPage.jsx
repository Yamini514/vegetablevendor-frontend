import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useAdminReviews, useDeleteReview } from '../../api/reviews'
import StarRating from '../../components/ui/StarRating'
import { formatDate } from '../../utils/formatDate'
import { PageLoader } from '../../components/ui/Spinner'

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data: res, isLoading } = useAdminReviews({ page, search: search || undefined, page_size: 20 })
  const { mutate: deleteReview } = useDeleteReview()

  const reviews    = res?.data || []
  const totalPages = res?.total_pages || 1
  const total      = res?.total || 0

  const handleDelete = (review) => {
    if (window.confirm(`Remove this review by "${review.user_name}"?`)) {
      deleteReview(review.id)
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-text">Reviews</h1>
        <p className="text-slate-500 text-sm mt-0.5">{total} total reviews</p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="input-field max-w-sm"
        />
      </div>

      {reviews.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-400 text-sm">No reviews found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {review.user_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="font-medium text-sm text-text">{review.user_name || 'User'}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-slate-400">{formatDate(review.created_at)}</span>
                  </div>
                  <p className="text-xs text-primary font-medium mb-1">{review.product_name}</p>
                  {review.comment ? (
                    <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No comment</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(review)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors shrink-0"
                  title="Remove review"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
