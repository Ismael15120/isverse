import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { VideoPlayer } from '../components/player/VideoPlayer';
import { useVideoSource } from '../hooks/useVideoSource';
import { tmdbAPI } from '../lib/api';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight, Tv, Film, Home } from 'lucide-react';

export function PlayerPage() {
  const { id, type } = useParams<{ id: string; type: 'movie' | 'tv' }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const season  = Number(searchParams.get('season'))  || 1;
  const episode = Number(searchParams.get('episode')) || 1;

  const tmdbId = Number(id);
  const { currentSource, sources, currentIndex, totalSources, nextSource, prevSource, selectSource, loading: sourceLoading } =
    useVideoSource(tmdbId, type!, season, episode);
  const addToHistory = useStore(state => state.addToHistory);

  // --- Real Metadata Fetching ---
  const [seriesInfo, setSeriesInfo] = useState<any>(null);
  const [currentSeasonInfo, setCurrentSeasonInfo] = useState<any>(null);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  useEffect(() => {
    if (type === 'tv' && tmdbId) {
      setIsLoadingMeta(true);
      tmdbAPI.getDetails(tmdbId, 'tv').then(res => {
        setSeriesInfo(res);
      }).catch(console.error);
    }
  }, [tmdbId, type]);

  useEffect(() => {
    if (type === 'tv' && tmdbId && season) {
      tmdbAPI.getSeason(tmdbId, season).then(res => {
        setCurrentSeasonInfo(res);
        setIsLoadingMeta(false);
      }).catch(() => {
        setIsLoadingMeta(false);
      });
    } else {
      setIsLoadingMeta(false);
    }
  }, [tmdbId, type, season]);

  // --- Anti-Redirect ---
  useEffect(() => {
    const playerUrl = window.location.href;
    const blockPop = (_e: PopStateEvent) => {
      window.history.pushState(null, '', playerUrl);
    };
    window.history.pushState(null, '', playerUrl);
    window.addEventListener('popstate', blockPop, true);
    const origAssign  = window.location.assign.bind(window.location);
    const origReplace = window.location.replace.bind(window.location);
    try {
      (window.location as any).assign  = (url: string) => { if (!url.includes('/player/')) return; origAssign(url); };
      (window.location as any).replace = (url: string) => { if (!url.includes('/player/')) return; origReplace(url); };
    } catch {}

    return () => {
      window.removeEventListener('popstate', blockPop, true);
      try {
        (window.location as any).assign  = origAssign;
        (window.location as any).replace = origReplace;
      } catch {}
    };
  }, []);

  useEffect(() => {
    if (!currentSource) return;
    addToHistory({
      id: tmdbId,
      type: type as 'movie' | 'tv',
      title: type === 'tv' ? `S${season} E${episode}` : 'Film',
      poster: '',
      season,
      episode,
      addedAt: Date.now(),
    });
  }, [tmdbId, currentSource?.url, season, episode]);

  if (!id || !type || (type !== 'movie' && type !== 'tv')) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-6 px-6 text-center">
        <div className="p-5 rounded-full bg-rose-500/10 border border-rose-500/20">
          <ChevronLeft size={32} className="text-rose-500/50" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Oups ! Contenu invalide</h2>
          <p className="text-sm text-white/40 max-w-xs">Ce type de contenu ne peut pas être lu directement.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-2xl bg-white text-black font-bold text-sm shadow-xl active:scale-95 transition-all"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // --- Navigation Logics ---
  const handlePrevEpisode = () => {
    if (episode > 1) {
      setSearchParams({ season: String(season), episode: String(episode - 1) });
    } else if (season > 1) {
      setSearchParams({ season: String(season - 1), episode: '1' });
    }
  };

  const handleNextEpisode = () => {
    const maxEpisodes = currentSeasonInfo?.episodes?.length || 99;
    if (episode < maxEpisodes) {
      setSearchParams({ season: String(season), episode: String(episode + 1) });
    } else {
      const maxSeasons = seriesInfo?.number_of_seasons || 1;
      if (season < maxSeasons) {
        setSearchParams({ season: String(season + 1), episode: '1' });
      }
    }
  };

  const handlePrevSeason = () => {
    if (season > 1) setSearchParams({ season: String(season - 1), episode: '1' });
  };

  const handleNextSeason = () => {
    const maxSeasons = seriesInfo?.number_of_seasons || 1;
    if (season < maxSeasons) setSearchParams({ season: String(season + 1), episode: '1' });
  };

  return (
    <div className="min-h-screen pb-20 animate-fade-in" style={{ background: '#08080f' }}>
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/detail/${id}/${type}`); }}
            className="p-2.5 rounded-xl transition-all active:scale-90 flex-shrink-0"
            style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border)' }}
            title="Retour"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate('/'); }}
            className="p-2.5 rounded-xl transition-all active:scale-90 flex-shrink-0"
            style={{ background: 'var(--glass-2)', border: '1px solid var(--glass-border)' }}
            title="Accueil"
          >
            <Home size={20} className="text-white" />
          </button>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="text-[16px] font-bold text-white truncate leading-tight">
            {type === 'tv'
              ? (currentSeasonInfo?.episodes?.find((e: any) => e.episode_number === episode)?.name || `Saison ${season} — Épisode ${episode}`)
              : 'Lecture en cours'}
          </h1>
          <p className="text-[12px] text-white/30 font-medium mt-0.5">
            {type === 'tv' ? <span className="flex items-center gap-1 uppercase tracking-wider"><Tv size={11} className="text-violet-400" /> {seriesInfo?.name || 'Série TV'}</span> : <span className="flex items-center gap-1 uppercase tracking-wider"><Film size={11} className="text-rose-400" /> Film</span>}
          </p>
        </div>
      </div>

      {/* ── Player ── */}
      <div className="px-4">
        <VideoPlayer
          src={currentSource?.url ?? ''}
          title={type === 'tv' ? `S${season}E${episode}` : 'Film'}
          isLoading={sourceLoading || isLoadingMeta}
          onSwitchSource={nextSource}
          onPrevSource={prevSource}
          currentIndex={currentIndex}
          totalSources={totalSources}
          sourceName={currentSource?.name}
          sources={sources}
          onSelectSource={selectSource}
        />
      </div>

      {/* ── Navigation Épisodes (TV uniquement) ── */}
      {type === 'tv' && (
        <div className="mx-4 mt-4 flex flex-col gap-3">
          {/* Épisodes */}
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-1">Épisode</p>
              <p className="text-[20px] font-black text-white">S{String(season).padStart(2,'0')} E{String(episode).padStart(2,'0')}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevEpisode(); }}
                disabled={season === 1 && episode === 1}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-all disabled:opacity-20"
              >
                <ChevronLeft size={18} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                disabled={season === seriesInfo?.number_of_seasons && episode === currentSeasonInfo?.episodes?.length}
                className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </div>
          </div>

          {/* Saisons */}
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)' }}>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] uppercase font-bold tracking-widest text-white/30 mb-1">Saison</p>
              <p className="text-[20px] font-black text-white">Saison {season}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevSeason(); }}
                disabled={season <= 1}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center active:scale-90 transition-all disabled:opacity-20"
              >
                <ChevronLeft size={18} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextSeason(); }}
                disabled={season >= (seriesInfo?.number_of_seasons || 1)}
                className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center active:scale-90 transition-all disabled:opacity-50"
              >
                <ChevronRight size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Info carte ── */}
      <div className="mx-4 mt-4 p-4 rounded-2xl space-y-2" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
        <p className="text-[12px] font-bold text-violet-400 uppercase tracking-wider">💡 Conseils</p>
        <ul className="text-[12px] text-white/40 space-y-1.5 leading-relaxed list-disc list-inside">
          <li>Si la vidéo est dans une autre langue, essaie une <strong className="text-white/60">autre source</strong>.</li>
          <li>Si l'image est noire ou l'écran n'apparaît pas, clique sur <strong className="text-white/60">Recharger</strong>.</li>
          <li>Pour certains contenus, désactive ton <strong className="text-white/60">bloqueur de publicité</strong>.</li>
        </ul>
      </div>
    </div>
  );
}

export default PlayerPage;
