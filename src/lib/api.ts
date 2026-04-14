// ═══════════════════════════════════════════
import { animeSamaCinema } from '../data/animeSama';

const TMDB_BASE = 'https://api.themoviedb.org/3';
export const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const TMDB_IMG_ORIGINAL = 'https://image.tmdb.org/t/p/original';

// Lecture / écriture de la clé (Variable d'env. en priorité puis localStorage)
export function getTmdbApiKey(): string | null {
  const envKey = import.meta.env.VITE_TMDB_API_KEY;
  const localKey = localStorage.getItem('tmdb_api_key');
  
  if (envKey && envKey !== 'ta_cle_ici') return envKey;
  return localKey;
}

export function setTmdbApiKey(key: string): void {
  localStorage.setItem('tmdb_api_key', key.trim());
}

// Détermine si c'est un Bearer Token v4 (très long, commence par eyJ)
function isBearer(key: string): boolean {
  return key.startsWith('eyJ') && key.length > 100;
}

// Fonction centrale de fetch — lance une vraie erreur si l'API répond mal
async function fetchTMDB<T = any>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  const key = getTmdbApiKey();
  if (!key) throw new Error('Aucune clé API configurée');

  const url = new URL(`${TMDB_BASE}${path}`);
  
  // Paramètres par défaut
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  // Force la langue fr-FR (écrase tout paramètre 'language' passé dans params)
  url.searchParams.set('language', 'fr-FR');
  
  // Cache-busting agressif : ajoute un timestamp pour vider le cache navigateur/CDN
  url.searchParams.set('v', Date.now().toString());

  const headers: Record<string, string> = {};
  if (isBearer(key)) {
    headers['Authorization'] = `Bearer ${key}`;
  } else {
    url.searchParams.set('api_key', key);
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    let message = `Erreur TMDB ${response.status}`;
    try {
      const json = await response.json();
      if (json.status_message) message = json.status_message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

// Endpoints exposés à l'application
export const tmdbAPI = {
  getTrending:    ()               => fetchTMDB('/trending/all/week'),
  getPopularMovies: ()             => fetchTMDB('/movie/popular'),
  getPopularTV:     ()             => fetchTMDB('/tv/popular'),
  getAnime:        ()               => fetchTMDB('/discover/tv', { 
    with_genres: '16', 
    with_origin_country: 'JP',
    sort_by: 'popularity.desc' 
  }),
  getAction:       ()               => fetchTMDB('/discover/movie', { with_genres: '28' }),
  search: (query: string) => {
    const localResults = animeSamaCinema.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.overview.toLowerCase().includes(query.toLowerCase())
    );
    
    return fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`).then(data => {
      // Merge local results with TMDB results, avoiding duplicates
      const tmdbResults = data.results || [];
      const localIds = new Set(localResults.map(i => i.id));
      const filteredTMDB = tmdbResults.filter((i: any) => !localIds.has(i.id));
      
      return {
        ...data,
        results: [...localResults, ...filteredTMDB]
      };
    });
  },
  getDetails:     (id: string | number, type: 'movie' | 'tv') => fetchTMDB(`/${type}/${id}`),
  getSeason:      (tvId: string | number, seasonNum: number)  => fetchTMDB(`/tv/${tvId}/season/${seasonNum}`),
  getExternalIds: (id: string | number, type: 'movie' | 'tv') => fetchTMDB(`/${type}/${id}/external_ids`),
  getAnimeSamaCinema: async () => ({ results: animeSamaCinema }),
  testConnection: ()               => fetchTMDB('/configuration'),
};
