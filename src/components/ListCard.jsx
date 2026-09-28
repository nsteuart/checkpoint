import { Link } from 'react-router-dom'

export default function ListCard({ list, gameCount, previewImages = [] }) {
  return (
    <Link to={`/list/${list.id}`} className="group block">
      <div className="bg-surface-light border border-surface-border rounded-xl overflow-hidden hover:border-accent/50 transition-all">
        {/* Preview images */}
        <div className="h-32 bg-surface-lighter relative overflow-hidden">
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-4 h-full">
              {previewImages.slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt="" className="w-full h-full object-cover" />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-light to-transparent" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm group-hover:text-accent transition-colors truncate">
            {list.name}
          </h3>
          {list.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{list.description}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">{gameCount} games</p>
        </div>
      </div>
    </Link>
  )
}
