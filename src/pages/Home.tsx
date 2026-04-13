import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { tmdbAPI, TMDB_IMG_ORIGINAL } from '../lib/api';
import { useTMDB } from '../hooks/useTMDB';
import { OnboardingModal, NeonButton, MediaSection } from '../components';
import { Search, TrendingUp, Film, Tv, Zap, Flame, Play, Info } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data for Hero and Sections
  const { data: trending, loading: trendingLoading, error, hasKey } = useTMDB(tmdbAPI.getTrending);

  // Pick a random featured item for the Hero section from trending results
  const featuredItem = useMemo(() => {
    if (!trending?.results || trending.results.length === 0) return null;
    // We pick the first one which is usually the most popular
    return trending.results[0];
  }, [trending]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!hasKey) return <OnboardingModal />;

  return (
    <div className="flex flex-col pb-40 animate-fade-in no-scrollbar">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full h-[85vh] sm:h-[70vh] flex flex-col justify-end overflow-hidden mb-6">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {featuredItem?.backdrop_path ? (
            <img
              src={`${TMDB_IMG_ORIGINAL}${featuredItem.backdrop_path}`}
              alt={featuredItem.title || featuredItem.name}
              className="w-full h-full object-cover animate-fade-in"
              style={{ filter: 'brightness(0.7)' }}
            />
          ) : (
            <div className="w-full h-full bg-[#08080f]" />
          )}
          {/* Gradients to blend backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#08080f]/80 to-transparent hidden sm:block" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 pb-12 flex flex-col items-start gap-4 max-w-2xl animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
              Mise en avant
            </div>
            {featuredItem?.vote_average > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-yellow-400">
                ★ {featuredItem.vote_average.toFixed(1)}
              </div>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-[1.1] tracking-tight text-balance">
            {featuredItem?.title || featuredItem?.name || "ISVERSE"}
          </h1>

          <p className="text-[14px] sm:text-[16px] text-white/70 line-clamp-3 max-w-lg leading-relaxed font-medium">
            {featuredItem?.overview || "Découvrez le meilleur du streaming sur ISVERSE. Explorez des milliers de contenus premium en haute définition."}
          </p>

          <div className="flex gap-3 mt-4 w-full sm:w-auto">
            <NeonButton 
              onClick={() => navigate(`/detail/${featuredItem.id}/${featuredItem.media_type}`)}
              variant="primary" 
              size="lg" 
              className="flex-1 sm:flex-none"
            >
              <Play size={18} fill="currentColor" /> Regarder
            </NeonButton>
            <button 
              onClick={() => navigate(`/detail/${featuredItem.id}/${featuredItem.media_type}`)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white font-semibold transition-all hover:bg-white/20 active:scale-95"
            >
              <Info size={19} /> Infos
            </button>
          </div>
        </div>

        {/* Search Bar - Floating Style */}
        <div className="absolute top-6 left-0 right-0 z-20 px-5">
           <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              <Search size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Chercher un film, une série..."
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-white/30"
                style={{ color: 'var(--text-primary)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
      </section>

      {/* ── Content Sections ── */}
      <div className="flex flex-col gap-12">
        
        {/* Tendances (handled specially to use already fetched data if needed, or just use MediaSection) */}
        <MediaSection 
          title="Tendances de la semaine" 
          icon={TrendingUp} 
          fetcher={tmdbAPI.getTrending} 
        />

        <MediaSection 
          title="Films Populaires" 
          icon={Film} 
          fetcher={tmdbAPI.getPopularMovies} 
        />

        <MediaSection 
          title="Séries à ne pas manquer" 
          icon={Tv} 
          fetcher={tmdbAPI.getPopularTV} 
        />

        <MediaSection 
          title="Animes & Animation" 
          icon={Zap} 
          fetcher={tmdbAPI.getAnime} 
        />

        <MediaSection 
          title="Action & Aventure" 
          icon={Flame} 
          fetcher={tmdbAPI.getAction} 
        />

      </div>

      {/* ── Bonus: Decorative Background elements ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div 
          className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[150px] opacity-10"
          style={{ background: 'var(--accent)' }}
        />
        <div 
          className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: 'var(--accent-rose)' }}
        />
      </div>

    </div>
  );
}
