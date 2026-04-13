import { useState, useEffect, useRef } from 'react';
import { getTmdbApiKey } from '../lib/api';

/**
 * Hook simplifié de fetching TMDB.
 * - Pas de useCallback complexe, juste useEffect + ref
 * - Annulation propre si le composant est démonté
 * - `retry` pour re-lancer manuellement
 * - `hasKey` pour détecter si la clé est configurée
 */
export function useTMDB<T = any>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!getTmdbApiKey()); // true seulement si clé présente
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher; // toujours à jour sans re-render

  const hasKey = !!getTmdbApiKey();

  const run = (signal?: AbortSignal) => {
    if (!getTmdbApiKey()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetcherRef.current()
      .then(res => {
        if (signal?.aborted) return;
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        if (signal?.aborted) return;
        console.error('[ISVERSE API]', err.message);
        setError(err.message ?? 'Erreur inconnue');
        setLoading(false);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const controller = new AbortController();
    run(controller.signal);
    return () => controller.abort();
  }, deps);

  const retry = () => run();

  return { data, loading, error, hasKey, retry };
}
