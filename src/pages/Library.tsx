import { useStore } from '../store/useStore';
import { MediaCard } from '../components/ui/MediaCard';
import { GlassCard } from '../components/ui/GlassCard';
import { Trash2, History, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function LibraryPage() {
  const { watchlist, history, removeFromWatchlist } = useStore();
  const [tab, setTab] = useState<'watchlist' | 'history'>('watchlist');
  const navigate = useNavigate();

  const items = tab === 'watchlist' ? watchlist : history;

  return (
    <div className="pb-24 px-4 pt-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold mb-6 neon-text">Bibliothèque</h1>
      
      {/* Onglets Watchlist / Historique */}
      <div className="flex gap-2 mb-6 glass p-1 rounded-xl">
        {(['watchlist', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              tab === t ? 'bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            {t === 'watchlist'
              ? <><Bookmark size={16} className="inline mr-1" />Watchlist</>
              : <><History size={16} className="inline mr-1" />Historique</>
            }
          </button>
        ))}
      </div>

      {/* État vide */}
      {items.length === 0 ? (
        <GlassCard className="text-center p-8">
          <p className="text-[var(--text-secondary)]">Aucun élément dans cette section pour le moment.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={`${item.id}-${tab}`} className="relative group">
              <MediaCard
                id={item.id}
                title={item.title}
                poster_path={item.poster}
                media_type={item.type}
                onClick={() => navigate(`/detail/${item.id}/${item.type}`)}
              />
              {/* Bouton supprimer (watchlist seulement) */}
              {tab === 'watchlist' && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.id); }}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LibraryPage;
