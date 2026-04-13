// ── SplashScreen.tsx ──────────────────────────────────────────────
// Animation de démarrage ultra-designée pour ISVERSE
// Durée : ~2.2s puis disparaît avec un fade out
// ─────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    // Phase 1 : apparition (600ms)
    const t1 = setTimeout(() => setPhase('hold'), 600);
    // Phase 2 : maintien (1000ms)
    const t2 = setTimeout(() => setPhase('out'), 1600);
    // Phase 3 : disparition (600ms) puis callback
    const t3 = setTimeout(() => onDone(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: '#08080f',
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* ── Halo ambiant animé ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
            transform: `translate(-50%, -50%) scale(${phase === 'in' ? 0.6 : 1.1})`,
            transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
            transform: `translate(-50%, -55%) scale(${phase === 'in' ? 0.4 : 1})`,
            transition: 'transform 1.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>

      {/* ── Logo Ring ── */}
      <div
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: `scale(${phase === 'in' ? 0.7 : 1}) translateY(${phase === 'in' ? '20px' : '0'})`,
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
        className="relative mb-6"
      >
        {/* Anneau tournant */}
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          className="animate-spin"
          style={{ animationDuration: '3s', animationTimingFunction: 'linear' }}
        >
          <circle
            cx="48" cy="48" r="44"
            stroke="url(#grad)" strokeWidth="2" fill="none"
            strokeDasharray="120 160"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        {/* Icône centrale */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              boxShadow: '0 0 30px rgba(124,58,237,0.5)',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Nom ISVERSE ── */}
      <div
        style={{
          opacity: phase === 'in' ? 0 : 1,
          transform: `translateY(${phase === 'in' ? '16px' : '0'})`,
          transition: 'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s',
        }}
        className="flex flex-col items-center gap-1"
      >
        <h1
          className="text-4xl font-black tracking-widest uppercase"
          style={{
            background: 'linear-gradient(135deg, #fff 30%, rgba(124,58,237,0.9) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.25em',
          }}
        >
          ISVERSE
        </h1>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/25 font-medium">
          Streaming Premium
        </p>
      </div>

      {/* ── Barre de progression ── */}
      <div
        className="absolute bottom-16 w-32 h-0.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
            width: phase === 'in' ? '0%' : phase === 'hold' ? '80%' : '100%',
            transition: phase === 'in'
              ? 'none'
              : phase === 'hold'
              ? 'width 0.9s cubic-bezier(0.4,0,0.2,1)'
              : 'width 0.4s ease-in',
          }}
        />
      </div>
    </div>
  );
}
