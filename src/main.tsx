import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// ── Auto-inject API key depuis la variable d'environnement ────────
// Si VITE_TMDB_API_KEY est définie dans Vercel (ou .env.local),
// on la copie automatiquement dans le localStorage.
// → Plus jamais de modal "Entrez votre clé" sur un nouvel appareil.
const envKey = import.meta.env.VITE_TMDB_API_KEY;
if (envKey && envKey !== 'ta_cle_ici') {
  console.log('[ISVERSE] Clé API détectée via Vercel ✅');
  localStorage.setItem('tmdb_api_key', envKey);
} else {
  console.warn('[ISVERSE] Aucune clé API détectée dans les variables d\'environnement.');
}
// ─────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
