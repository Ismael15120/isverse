import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { getTmdbApiKey, setTmdbApiKey, tmdbAPI, getUserLanguage, setUserLanguage } from '../lib/api';
import { useState } from 'react';
import { Key, RotateCcw, CheckCircle, XCircle, Loader, Lock, ShieldCheck, Globe } from 'lucide-react';

const SETTINGS_PASSWORD = 'ISMABEST';

export function SettingsPage() {
  const [apiKey, setApiKey] = useState(getTmdbApiKey() || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  
  // Password Protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SETTINGS_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      setTmdbApiKey(apiKey.trim());
      window.location.reload();
    }
  };

  const handleTestKey = async () => {
    if (!apiKey.trim()) return;
    setTestStatus('loading');
    setTestMessage('');
    const prev = getTmdbApiKey();
    setTmdbApiKey(apiKey.trim());
    try {
      await tmdbAPI.testConnection();
      setTestStatus('ok');
      setTestMessage('Connexion TMDB réussie ! Ta clé est valide.');
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Clé invalide ou erreur réseau.');
      if (prev) setTmdbApiKey(prev);
      else localStorage.removeItem('tmdb_api_key');
    }
  };

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 animate-fade-in">
        <GlassCard className="w-full max-w-sm p-8 flex flex-col items-center gap-6" glow="violet">
          <div className="p-4 rounded-3xl bg-violet-500/10 border border-violet-500/20">
            <Lock size={32} className="text-violet-400" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-white">Zone Sécurisée</h2>
            <p className="text-sm text-white/40">Saisis le mot de passe pour accéder aux réglages de ISVERSE.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/5 border transition-all ${passwordError ? 'border-rose-500/50 shake' : 'border-white/10'}`}>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Mot de passe..."
                autoFocus
                className="flex-1 bg-transparent outline-none text-center font-bold tracking-[0.3em] text-white"
              />
            </div>
            
            {passwordError && (
              <p className="text-center text-xs font-bold text-rose-500 animate-pulse">Mot de passe incorrect</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm tracking-wide transition-all active:scale-95 hover:bg-white/90"
            >
              Déverrouiller
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="pb-32 px-4 pt-6 animate-fade-in space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[26px] font-bold text-white tracking-tight">Réglages</h1>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-[11px] font-bold text-green-400 uppercase">
          <ShieldCheck size={14} />
          Session Sécurisée
        </div>
      </div>

      {/* Clé API */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-[var(--accent-light)]">
          <Key size={17} />
          <span className="font-semibold text-[15px]">Clé API TMDB</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-white/10">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setTestStatus('idle'); }}
            placeholder="Colle ta clé API (v3) ici..."
            className="flex-1 bg-transparent outline-none text-[14px] font-mono text-white placeholder:opacity-30"
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        {testStatus !== 'idle' && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] ${
            testStatus === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
            testStatus === 'error' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
            'bg-white/5 border-white/10 text-white/50'
          } border`}>
            {testStatus === 'loading' && <Loader size={15} className="animate-spin flex-shrink-0" />}
            {testStatus === 'ok'      && <CheckCircle size={15} className="flex-shrink-0" />}
            {testStatus === 'error'   && <XCircle size={15} className="flex-shrink-0" />}
            {testStatus === 'loading' ? 'Test en cours...' : testMessage}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleTestKey} disabled={!apiKey.trim()} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            Tester
          </button>
          <button onClick={handleSaveKey} disabled={!apiKey.trim()} className="flex-1 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all">
            Enregistrer
          </button>
        </div>
      </GlassCard>

      {/* Language Selector */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-[var(--neon-violet)]">
          <Globe size={18} /> <span className="font-medium text-white">Langue de l'interface</span>
        </div>
        <p className="text-[13px] text-white/40 leading-relaxed">
          Change la langue des titres, résumés et genres. L'application devra recharger.
        </p>
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 relative">
          <select
            value={getUserLanguage()}
            onChange={(e) => {
              setUserLanguage(e.target.value);
              window.location.reload();
            }}
            className="w-full bg-transparent text-[14px] text-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="fr-FR" className="bg-[#08080f] text-white">🇫🇷 Français</option>
            <option value="en-US" className="bg-[#08080f] text-white">🇬🇧 English</option>
            <option value="es-ES" className="bg-[#08080f] text-white">🇪🇸 Español</option>
            <option value="de-DE" className="bg-[#08080f] text-white">🇩🇪 Deutsch</option>
            <option value="it-IT" className="bg-[#08080f] text-white">🇮🇹 Italiano</option>
            <option value="pt-BR" className="bg-[#08080f] text-white">🇧🇷 Português (BR)</option>
            <option value="ja-JP" className="bg-[#08080f] text-white">🇯🇵 日本語</option>
          </select>
        </div>
      </GlassCard>

      {/* Données locales */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose-400">
          <RotateCcw size={17} />
          <span className="font-semibold text-[15px]">Données locales</span>
        </div>
        <p className="text-[13px] text-white/40">
          Efface la watchlist, l'historique et la clé API de cet appareil.
        </p>
        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} className="w-full py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-sm hover:bg-rose-500/30 transition-all">
            Réinitialiser les données
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleClearData} className="flex-1 py-3 rounded-xl bg-rose-500 border border-rose-500 text-white font-bold text-sm transition-all focus:scale-95">Confirmer</button>
            <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm transition-all">Annuler</button>
          </div>
        )}
      </GlassCard>

      <GlassCard className="p-4 text-center opacity-50">
        <p className="text-[12px] text-white">ISVERSE v1.1 • Zone Sécurisée</p>
      </GlassCard>
    </div>
  );
}

export default SettingsPage;
