import { useState, useCallback } from 'react';
import { Loader, AlertTriangle, ChevronRight, ChevronLeft, RotateCcw, Flag } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  title: string;
  isLoading: boolean;
  onSwitchSource: () => void;
  onPrevSource?: () => void;
  currentIndex: number;
  totalSources: number;
  sourceName?: string;
  sources?: { name: string; url: string }[];
  onSelectSource?: (index: number) => void;
}

export function VideoPlayer({
  src,
  title,
  isLoading,
  onSwitchSource,
  onPrevSource,
  currentIndex,
  totalSources,
  sourceName,
  sources,
  onSelectSource,
}: VideoPlayerProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [showSources, setShowSources] = useState(false);

  // Clé unique par source URL — empêche le re-mount parasite lors du changement de source
  const handleNext = useCallback((e: React.MouseEvent) => {
    // Arrêter la propagation pour éviter que l'événement remonte et déclenche une navigation
    e.stopPropagation();
    e.preventDefault();
    onSwitchSource();
    setIframeKey(k => k + 1);
  }, [onSwitchSource]);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onPrevSource?.();
    setIframeKey(k => k + 1);
  }, [onPrevSource]);

  const handleReload = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIframeKey(k => k + 1);
  }, []);

  const handleSelectSource = useCallback((e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    e.preventDefault();
    onSelectSource?.(idx);
    setIframeKey(k => k + 1);
    setShowSources(false);
  }, [onSelectSource]);

  if (isLoading) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center rounded-2xl gap-4"
        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Loader className="animate-spin text-violet-400" size={36} />
        <p className="text-[13px] text-white/40 font-medium">Chargement de la source…</p>
      </div>
    );
  }

  if (!src) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center gap-4 rounded-2xl"
        style={{ background: '#000', border: '1px solid rgba(255,255,255,0.05)' }}>
        <AlertTriangle size={36} className="text-rose-400" />
        <p className="text-sm text-white/40">Source non disponible</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 rounded-3xl overflow-hidden" style={{ background: '#000', boxShadow: '0 20px 60px -10px rgba(0,0,0,0.8)' }}>
      {/* ── Lecteur iframe plein cadre ── */}
      <div className="relative w-full aspect-video bg-black">
        <iframe
          key={iframeKey}
          src={src}
          title={title}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write"
          allowFullScreen
          referrerPolicy="no-referrer"
        />
      </div>

      {/* ── Barre de contrôle ── */}
      <div className="flex flex-col gap-0" style={{ background: '#0d0d14' }}>
        
        {/* Source sélecteur dropdown */}
        {showSources && sources && (
          <div className="grid grid-cols-2 gap-2 p-4 border-b border-white/5">
            {sources.map((s, idx) => (
              <button
                key={idx}
                onClick={(e) => handleSelectSource(e, idx)}
                className={`py-2.5 px-3 rounded-xl text-[12px] font-bold text-left transition-all ${
                  idx === currentIndex 
                    ? 'bg-violet-500 text-white' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        {/* Info + contrôles */}
        <div className="flex items-center justify-between gap-3 px-4 py-3.5">
          {/* Source actuelle */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowSources(v => !v); }}
            className="flex items-center gap-2 min-w-0"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${showSources ? 'bg-violet-400' : 'bg-green-400'} shadow-[0_0_8px] shadow-green-400/50`} />
            <div className="flex flex-col items-start min-w-0">
              <span className="text-[11px] uppercase tracking-widest text-white/30 leading-none mb-0.5">Source</span>
              <span className="text-[13px] font-bold text-white truncate">{sourceName ?? `Source ${currentIndex + 1}`}</span>
            </div>
            <span className="text-[11px] text-white/20 ml-1 flex-shrink-0">({currentIndex + 1}/{totalSources})</span>
          </button>

          {/* Boutons navigation source */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleReload}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-90"
              title="Recharger"
            >
              <RotateCcw size={15} className="text-white/50" />
            </button>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all active:scale-90 disabled:opacity-20"
              title="Source précédente"
            >
              <ChevronLeft size={15} className="text-white/70" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-[12px] transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', color: 'white' }}
              title="Source suivante"
            >
              Suivante <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Astuce en bas */}
        <div className="px-4 py-3 border-t border-white/5 flex items-start gap-2">
          <Flag size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-white/25 leading-relaxed">
            Si la vidéo ne démarre pas ou est dans une autre langue, appuie sur <span className="text-violet-400 font-bold">Suivante</span> pour changer de source. {totalSources} serveurs disponibles.
          </p>
        </div>
      </div>
    </div>
  );
}
