import { useState } from 'react'

export default function StarRating({ value = 0, onChange, size = 'md', readOnly = false }) {
  const [hover, setHover] = useState(0)
  const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = (hover || value) >= star
          ? 'fill-star text-star'
          : (hover || value) >= star - 0.5
          ? 'fill-star/50 text-star'
          : 'fill-surface-border text-surface-border'

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(star)}
          >
            <svg viewBox="0 0 24 24" className={`${sizeClass} ${fill}`} stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
