import { TMDB_IMG_BASE } from '../../lib/api';
import { Star } from 'lucide-react';

interface MediaCardProps {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  media_type?: 'movie' | 'tv' | 'person';
  vote_average?: number;
  onClick: () => void;
}

export function MediaCard({
  title,
  name,
  poster_path,
  media_type,
  vote_average,
  onClick,
}: MediaCardProps) {
  const displayTitle = title || name || 'Sans titre';
  const imageUrl = poster_path
    ? `${TMDB_IMG_BASE}${poster_path}`
    : null;
  const rating = vote_average ? vote_average.toFixed(1) : null;

  return (
    <button
      onClick={onClick}
      className="w-[140px] flex-shrink-0 text-left focus:outline-none group"
    >
      {/* Poster */}
      <div
        className="relative aspect-[2/3] rounded-[18px] overflow-hidden mb-3"
        style={{
          background: 'var(--bg-elevated)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.55)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">
            Images
          </div>
        )}

        {/* Overlay gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Rating pill */}
        {rating && (
          <div
            className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              background: 'rgba(0,0,0,0.70)',
              backdropFilter: 'blur(8px)',
              color: 'var(--accent-gold)',
            }}
          >
            <Star size={9} fill="currentColor" />
            {rating}
          </div>
        )}

        {/* Badge type */}
        {media_type === 'tv' && (
          <div
            className="absolute top-2 right-2 badge"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}
          >
            SÉRIE
          </div>
        )}
      </div>

      {/* Titre */}
      <p
        className="text-[13px] font-medium line-clamp-2 leading-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {displayTitle}
      </p>
    </button>
  );
}
