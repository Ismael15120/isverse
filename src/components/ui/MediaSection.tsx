import { useNavigate } from 'react-router-dom';
import { MediaCard } from './MediaCard';
import { useTMDB } from '../../hooks/useTMDB';
interface MediaSectionProps {
  title: string;
  icon: any;
  fetcher: () => Promise<any>;
}

export function MediaSection({ title, icon: Icon, fetcher }: MediaSectionProps) {
  const navigate = useNavigate();
  const { data, loading, error } = useTMDB(fetcher);

  if (!loading && (!data?.results || data.results.length === 0)) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <Icon size={18} style={{ color: 'var(--accent-light)' }} />
          <h2
            className="text-[17px] font-semibold"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
          >
            {title}
          </h2>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pl-5 pr-2 pb-2 no-scrollbar">
        {loading || error
          ? Array(7).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-[140px] aspect-[2/3] rounded-2xl animate-pulse flex-shrink-0"
                style={{ 
                  background: 'var(--glass-2)',
                  animationDelay: `${i * 100}ms` 
                }}
              />
            ))
          : data.results?.map((item: any) =>
              item.poster_path ? (
                <MediaCard
                  key={item.id}
                  {...item}
                  onClick={() => navigate(`/detail/${item.id}/${item.media_type || (title.includes('Série') || title.includes('Anime') ? 'tv' : 'movie')}`)}
                />
              ) : null
            )}
      </div>
    </section>
  );
}
