import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { tmdbAPI, TMDB_IMG_BASE } from '../lib/api';
import { useTMDB } from '../hooks/useTMDB';
import { NeonButton, OnboardingModal } from '../components';
import { ChevronLeft, Play, Plus, Star, Calendar, Clock, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Detail() {
  const { id, type } = useParams<{ id: string; type: 'movie' | 'tv' }>();
  const navigate = useNavigate();
  const addToWatchlist = useStore(state => state.addToWatchlist);
  
  // State for TV shows
  const [selectedSeason, setSelectedSeason] = useState(1);
  
  const { data: detail, loading: detailLoading, hasKey } = useTMDB(
    () => tmdbAPI.getDetails(id!, type!), 
    [id, type]
  );

  // Fetch episodes when season changes
  const { data: seasonData, loading: episodesLoading } = useTMDB(
    () => (type === 'tv' ? tmdbAPI.getSeason(id!, selectedSeason) : Promise.resolve(null)),
    [id, type, selectedSeason]
  );

  if (!hasKey) return <OnboardingModal />;

  if (detailLoading) {
    return (
      <div className="min-h-screen animate-pulse bg-[#08080f]">
        <div className="h-[50vh] bg-white/5" />
        <div className="p-6 flex flex-col gap-4">
          <div className="h-10 w-3/4 bg-white/5 rounded-xl" />
          <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
          <div className="h-32 w-full bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!detail) return (
    <div className="p-20 text-center">
      <p className="text-rose-400 font-bold mb-4">Média introuvable</p>
      <NeonButton onClick={() => navigate(-1)}>Retour</NeonButton>
    </div>
  );

  const title = detail.title || detail.name;
  const rating = detail.vote_average?.toFixed(1);
  const date = detail.release_date || detail.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';
  const runtime = detail.runtime || (detail.episode_run_time ? detail.episode_run_time[0] : null);

  return (
    <div className="min-h-screen pb-40 animate-fade-in no-scrollbar">
      {/* Hero Backdrop */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={`${TMDB_IMG_BASE}${detail.backdrop_path}`} 
          alt={title} 
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] via-[#08080f]/50 to-transparent" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-5 p-3 rounded-2xl transition-all active:scale-90"
          style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(20px)' }}
        >
          <ChevronLeft size={22} className="text-white" />
        </button>

        {/* Info Layout */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 mb-1">
            {detail.genres?.map((g: any) => (
              <span key={g.id} className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider" 
                    style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)', color: 'var(--accent-light)' }}>
                {g.name}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">{title}</h1>
          
          <div className="flex items-center gap-5 text-[13px] font-semibold text-white/60">
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Star size={16} fill="currentColor" />
              <span className="text-white text-base">{rating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={16} />
              <span>{year}</span>
            </div>
            {runtime && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} />
                <span>{runtime} min</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 flex flex-col gap-10">
        
        {/* Play & Library Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/player/${type}/${id}${type === 'tv' ? `?season=${selectedSeason}&episode=1` : ''}`)}
            className="flex-1 py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
              boxShadow: '0 8px 25px -5px rgba(124,58,237,0.4)',
            }}
          >
            <Play fill="currentColor" size={20} />
            {type === 'tv' ? 'Regarder S01E01' : 'Regarder maintenant'}
          </button>
          
          <button
            onClick={() => addToWatchlist({ id: Number(id), type: type as 'movie'|'tv', title, poster: detail.poster_path || '', addedAt: Date.now() })}
            className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border)', color: 'white' }}
          >
            <Plus size={20} />
            Ma liste
          </button>
        </div>

        {/* Synopsis */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
            <h2 className="text-[17px] font-bold text-white">Synopsis</h2>
          </div>
          {detail.tagline && (
            <p className="text-[14px] italic text-white/40 leading-relaxed font-medium">
              "{detail.tagline}"
            </p>
          )}
          <p className="text-[15px] leading-relaxed text-white/70">
            {detail.overview || 'Aucun résumé disponible.'}
          </p>
        </section>

        {/* TV Series Specific: Seasons & Episodes */}
        {type === 'tv' && detail.seasons && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent-rose)' }} />
                <h2 className="text-[17px] font-bold text-white">Épisodes</h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold uppercase tracking-wider" 
                   style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)', color: 'var(--text-tertiary)' }}>
                <Layers size={14} />
                {detail.number_of_seasons} Saison{detail.number_of_seasons > 1 ? 's' : ''}
              </div>
            </div>

            {/* Season Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {detail.seasons
                .filter((s: any) => s.season_number > 0) // Skip specials usually S0
                .map((season: any) => (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeason(season.season_number)}
                  className={`px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all ${
                    selectedSeason === season.season_number 
                      ? 'bg-white text-[#08080f] shadow-lg scale-105' 
                      : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
                  }`}
                >
                  Saison {season.season_number}
                </button>
              ))}
            </div>

            {/* Episode List */}
            <div className="flex flex-col gap-4 mt-2">
              {episodesLoading ? (
                 Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-24 w-full bg-white/5 rounded-2xl animate-pulse" />
                  ))
              ) : seasonData?.episodes?.map((episode: any) => (
                <div 
                  key={episode.id}
                  onClick={() => navigate(`/player/tv/${id}?season=${selectedSeason}&episode=${episode.episode_number}`)}
                  className="group relative flex gap-4 p-3 rounded-2xl transition-all active:scale-[0.98] hover:bg-white/5"
                  style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)' }}
                >
                  {/* Episode Thumbnail */}
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#16161e]">
                    {episode.still_path ? (
                      <img 
                        src={`${TMDB_IMG_BASE}${episode.still_path}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={episode.name} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-20">
                        <Play size={20} fill="currentColor" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} fill="white" className="text-white drop-shadow-lg" />
                    </div>
                  </div>

                  {/* Episode Meta */}
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none mb-1" style={{ color: 'var(--accent-light)' }}>
                      Épisode {episode.episode_number}
                    </span>
                    <h3 className="text-[15px] font-bold text-white truncate mb-1">{episode.name}</h3>
                    <div className="flex items-center gap-3 text-[12px] font-medium text-white/40">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-500" fill="currentColor" />
                        {episode.vote_average?.toFixed(1)}
                      </div>
                      {episode.runtime && (
                        <span>{episode.runtime} min</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
