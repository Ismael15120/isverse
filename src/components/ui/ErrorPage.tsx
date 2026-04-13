import { useRouteError, useNavigate } from 'react-router-dom';
import { RefreshCcw, Home, AlertCircle } from 'lucide-react';
import { NeonButton } from './NeonButton';
import { GlassCard } from './GlassCard';

export function ErrorPage() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const handleRefresh = () => {
    // Force un rechargement complet en ignorant le cache
    window.location.reload();
  };

  const isMimeError = error?.message?.includes('MIME type') || error?.stack?.includes('MIME type');

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#08080f] text-white font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-rose-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        <GlassCard className="p-8 flex flex-col items-center text-center gap-6 border-white/5">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <AlertCircle size={40} className="text-rose-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Mise à jour requise
            </h1>
            <p className="text-sm text-white/40 leading-relaxed px-4">
              {isMimeError 
                ? "Une nouvelle version de l'application est disponible. Veuillez recharger pour continuer."
                : "Une erreur inattendue est survenue dans l'application."}
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 mt-4">
            <NeonButton onClick={handleRefresh} variant="primary" size="md" className="w-full">
              <RefreshCcw size={18} className="mr-2" /> Mettre à jour (Actualiser)
            </NeonButton>
            
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 py-3 text-white/30 text-xs font-semibold hover:text-white/60 transition-colors"
            >
              <Home size={14} /> Revenir à l'accueil
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
