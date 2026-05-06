import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=680&fit=crop&q=85&fm=webp',
    title: 'Farm-Fresh Vegetables',
    subtitle: 'Sourced directly from local farmers. No preservatives, no chemicals — just nature\'s best.',
    cta: 'Shop Vegetables',
    ctaLink: '/shop?category=vegetables',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1920&h=680&fit=crop&q=85&fm=webp',
    title: 'Tropical Fruits & More',
    subtitle: 'Handpicked seasonal fruits, bursting with flavour — delivered to your door every morning.',
    cta: 'Shop Fruits',
    ctaLink: '/shop?category=fruits',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&h=680&fit=crop&q=85&fm=webp',
    title: 'Premium Organic Produce',
    subtitle: 'Certified organic. Zero pesticides. 100% natural goodness from farm to your kitchen.',
    cta: 'Shop Organic',
    ctaLink: '/shop',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1920&h=680&fit=crop&q=85&fm=webp',
    title: 'Morning Fresh Delivery',
    subtitle: 'Order by midnight, receive by 7 AM. Ultra-fresh produce, guaranteed same-day harvest.',
    cta: 'Order Now',
    ctaLink: '/shop',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=1920&h=680&fit=crop&q=85&fm=webp',
    title: 'Your Local Grocery, Online',
    subtitle: 'Hundreds of fresh items. Competitive prices. Free delivery on orders above ₹299.',
    cta: 'Explore All',
    ctaLink: '/shop',
  },
]

const INTERVAL_MS = 5000

export default function HeroBanner() {
  const [idx, setIdx]     = useState(0)
  const [paused, setPaused] = useState(false)

  const prev = useCallback(() => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length), [])
  const next = useCallback(() => setIdx((i) => (i + 1) % SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(next, INTERVAL_MS)
    return () => clearTimeout(t)
  }, [idx, paused, next])

  const slide = SLIDES[idx]

  return (
    <section
      className="relative overflow-hidden select-none"
      style={{ height: 'clamp(380px, 55vw, 640px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide images */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Text content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="max-w-xl"
            >
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                🌿 Farm Fresh Daily
              </span>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mb-4 drop-shadow">
                {slide.title}
              </h1>
              <p className="text-white/85 text-sm sm:text-base mb-7 leading-relaxed max-w-md drop-shadow">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={slide.ctaLink}
                  className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
                >
                  {slide.cta} →
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all text-sm"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats bar */}
              <div className="flex gap-8 mt-9">
                {[
                  { val: '500+', label: 'Products' },
                  { val: '10K+', label: 'Happy Customers' },
                  { val: '100%', label: 'Fresh Guarantee' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <p className="font-heading font-bold text-xl text-white leading-none">{val}</p>
                    <p className="text-white/60 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center text-white transition-all shadow"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 flex items-center justify-center text-white transition-all shadow"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === idx ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
