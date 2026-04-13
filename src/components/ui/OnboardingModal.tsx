import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { setTmdbApiKey } from '../../lib/api';
import { Key } from 'lucide-react';

export function OnboardingModal() {
  const [key, setKey] = useState('');

  const handleSave = () => {
    if (key.trim()) {
      setTmdbApiKey(key.trim());
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ background: 'rgba(8,8,15,0.95)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
    >
      {/* Halo ambiant */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full blur-[100px] opacity-20"
          style={{ background: 'var(--accent)' }}
        />
      </div>

      <div className="relative w-full max-w-[400px] animate-fade-in-up">
        {/* Logo badge */}
        <div className="flex justify-center mb-7">
          <div
            className="px-5 py-1.5 rounded-full text-[13px] font-bold tracking-[0.15em] uppercase"
            style={{
              background: 'var(--glass-2)',
              border: '1px solid var(--glass-border)',
              color: 'var(--accent-light)',
            }}
          >
            ISVERSE
          </div>
        </div>

        <GlassCard className="p-7 flex flex-col gap-6">
          <div className="text-center">
            <h2
              className="text-[26px] font-bold mb-2"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              Bienvenue 👋
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Pour accéder au catalogue, renseigne ta clé API TMDB gratuite.
            </p>
          </div>

          {/* Instructions */}
          <div
            className="p-4 rounded-xl text-[13px] space-y-2"
            style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
          >
            <p>1. Va sur{' '}
              <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noreferrer"
                className="underline underline-offset-2" style={{ color: 'var(--accent-light)' }}>
                themoviedb.org/settings/api
              </a>
            </p>
            <p>2. Crée un compte gratuit si besoin</p>
            <p>3. Copie la <strong className="text-white/80">clé API (v3 auth)</strong> <span style={{ color: 'var(--text-tertiary)' }}>(~32 caractères)</span></p>
          </div>

          {/* Champ clé */}
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
              style={{ background: 'var(--glass-1)', border: '1px solid var(--glass-border)' }}
            >
              <Key size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="ex: a1b2c3d4e5f6g7h8..."
                className="flex-1 bg-transparent outline-none text-[14px] placeholder:opacity-30 font-mono"
                style={{ color: 'var(--text-primary)' }}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <NeonButton onClick={handleSave} disabled={!key.trim()} variant="primary" size="md" className="w-full">
              Continuer →
            </NeonButton>
            
            <button
              onClick={() => {
                // Hard reload pour vider les caches éventuels
                window.location.href = window.location.href;
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl border border-white/10 text-white/40 text-[12px] hover:text-white/60 transition-colors"
            >
              Déjà configuré sur Vercel ? Recharger l'app
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
