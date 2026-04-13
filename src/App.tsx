import { createBrowserRouter, RouterProvider, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState, useCallback } from 'react';
import { BottomNav } from './components/layout/BottomNav';
import { SplashScreen } from './components/ui/SplashScreen';
import { Loader } from 'lucide-react';

// Lazy loading pour améliorer le temps de démarrage initial
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const SearchResults = lazy(() => import('./pages/SearchResults').then(m => ({ default: m.SearchResults })));
const Detail = lazy(() => import('./pages/Detail').then(m => ({ default: m.Detail })));
const PlayerPage = lazy(() => import('./pages/Player').then(m => ({ default: m.PlayerPage })));
const LibraryPage = lazy(() => import('./pages/Library').then(m => ({ default: m.LibraryPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));

// Spinner de chargement global (affiché pendant la navigation)
function GlobalLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin text-[var(--neon-cyan)]" size={40} />
    </div>
  );
}

function Layout() {
  const location = useLocation();
  const isPlayer = location.pathname.startsWith('/player');

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] text-[var(--text-primary)] font-sans pb-20">
      <main className="max-w-7xl mx-auto">
        <Suspense fallback={<GlobalLoader />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Cache la navbar sur le player pour une expérience plein écran */}
      {!isPlayer && <BottomNav />}
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/search', element: <SearchResults /> },
      { path: '/detail/:id/:type', element: <Detail /> },
      { path: '/player/:type/:id', element: <PlayerPage /> },
      { path: '/library', element: <LibraryPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ]
  }
]);

export default function App() {
  // Affiche le splash screen uniquement au premier chargement
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
      <RouterProvider router={router} />
    </>
  );
}
