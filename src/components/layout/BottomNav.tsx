import { Home as HomeIcon, Search, Bookmark, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: HomeIcon, label: 'Accueil',   route: '/'        },
  { icon: Search,   label: 'Recherche', route: '/search'   },
  { icon: Bookmark, label: 'Biblio',    route: '/library'  },
  { icon: Settings, label: 'Réglages',  route: '/settings' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    /* Barre flottante centrée — style pill iOS */
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="flex items-end gap-1 px-2 py-2 rounded-[30px]"
        style={{
          background: 'rgba(14, 14, 26, 0.88)',
          backdropFilter: 'blur(48px) saturate(180%)',
          WebkitBackdropFilter: 'blur(48px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow:
            '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.09) inset',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.route;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className={cn(
                'relative flex flex-col items-center gap-1 rounded-[22px] transition-all duration-200',
                'px-5 py-2.5 min-w-[64px]',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/38 hover:text-white/60 hover:bg-white/5'
              )}
            >
              {/* Indicateur de point actif */}
              {isActive && (
                <span
                  className="absolute top-1.5 inset-x-0 mx-auto w-1 h-1 rounded-full"
                  style={{ background: 'var(--accent-light)' }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.3 : 1.7}
                className="mt-1.5"
              />
              <span
                className={cn(
                  'text-[10px] font-medium tracking-wide',
                  isActive ? 'opacity-100' : 'opacity-0'
                )}
                style={{ lineHeight: isActive ? '1' : '0', height: isActive ? 'auto' : 0, overflow: 'hidden' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
