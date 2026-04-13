import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { tmdbAPI } from '../lib/api';
import { useTMDB } from '../hooks/useTMDB';
import { MediaCard, OnboardingModal } from '../components';
import { Search, ChevronLeft, X, Flame } from 'lucide-react';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [localQuery, setLocalQuery] = useState(query);
  
  // Sync local input with URL param
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);

  const { data, loading, hasKey } = useTMDB(
    () => (query ? tmdbAPI.search(query) : Promise.resolve({ results: [] })), 
    [query]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchParams({});
  };

  if (!hasKey) return <OnboardingModal />;

  return (
    <div className="min-h-screen pb-40 animate-fade-in no-scrollbar">
      {/* Search Header */}
      <div className="sticky top-0 z-50 px-6 py-6" style={{ background: 'linear-gradient(to bottom, #08080f 70%, transparent)' }}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl transition-all active:scale-90"
              style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)' }}
            >
              <ChevronLeft size={22} className="text-white" />
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight">Explorer</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={18} className="text-white/30 group-focus-within:text-[var(--accent-light)] transition-colors" />
            </div>
            <input
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              placeholder="Films, séries, animés..."
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-[15px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--accent)]/50 focus:bg-white/[0.08] transition-all"
              style={{ backdropFilter: 'blur(10px)' }}
            />
            {localQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="px-6 mt-2">
        {!query && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="p-5 rounded-full bg-white/5 border border-white/5 mb-2">
                <Search size={32} className="text-white/20" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-white">Que recherchez-vous ?</h3>
                <p className="text-sm text-white/40 max-w-[240px] mx-auto mt-1">
                  Découvrez des milliers de films et séries instantanément.
                </p>
             </div>
          </div>
        )}

        {loading && query && (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {data && data.results.length > 0 && (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {data.results
              .filter((item: any) => item.poster_path && (item.media_type === 'movie' || item.media_type === 'tv'))
              .map((item: any) => (
                <MediaCard
                  key={item.id}
                  {...item}
                  onClick={() => navigate(`/detail/${item.id}/${item.media_type}`)}
                />
              ))
            }
          </div>
        )}

        {data && data.results.filter((i: any) => i.poster_path).length === 0 && query && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="p-5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-2">
                <X size={32} className="text-rose-500/50" />
             </div>
             <div>
                <h3 className="text-lg font-bold text-white">Aucun résultat</h3>
                <p className="text-sm text-white/40 mt-1">
                  Nous n'avons rien trouvé pour "{query}".
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
