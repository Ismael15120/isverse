# 🛠️ Troubleshooting — ISVERSE

Guide de résolution des problèmes courants.

## 🐛 Problèmes API & Réseau

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| `401 Unauthorized` (Console) | Clé TMDB invalide ou expirée | Régénérer sur [TMDB](https://www.themoviedb.org) → Settings → API |
| `429 Too Many Requests` | Rate limit TMDB dépassé | Attendre 10–15 min, réduire les recherches fréquentes |
| Images TMDB ne chargent pas | Blocage réseau / adblock / CORS | Désactiver extensions temporairement, vérifier `TMDB_IMG_BASE` dans `api.ts` |
| `Failed to fetch` récurrent | Perte de connexion réseau | Vérifier le réseau, rechargement de la page si online |

## 📺 Problèmes de Lecture

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| Iframe blanche / noire après 10s | Source HS ou déconnectée | Cliquer sur **Suivante** pour changer de source |
| Erreur `X-Frame-Options` (DevTools) | Source bloque l'intégration iframe | La source est incompatible, changer de source |
| Vidéo dans une autre langue | Source sans VF disponible | Changer de source, les premières de la liste priorisent le français |
| Impossible d'agrandir la vidéo | CSP restrictive de la source | Certaines sources bloquent le fullscreen, changer de source |
| Redirection hors de l'app | Source iframe agressive | Normal — le bouclier anti-redirect est actif, l'app récupère la main |

## 📱 Problèmes PWA

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| PWA ne s'installe pas | SW non activé ou HTTP (pas HTTPS) | Sur Vercel (HTTPS auto) ça fonctionne. En local : `npm run preview` |
| Interface ne charge pas en mode avion | Cache SW non peuplé | Naviguer sur l'app au moins une fois en ligne avant |
| Vieille version après mise à jour | Cache PWA obsolète | DevTools → Application → Clear storage → Unregister Service Worker |

## 💾 Problèmes de Stockage

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| `QuotaExceededError` (Console) | localStorage plein (~5-10 Mo) | `/settings` → Réinitialiser les données |
| Watchlist perdue | localStorage vidé ou nouveau navigateur | Normal — stockage local uniquement, pas de cloud |

## 🔑 Problèmes de Configuration

| Symptôme | Cause Probable | Solution |
|----------|----------------|----------|
| Écran "Configurer l'API" au chargement | Clé TMDB absente | Entrer la clé dans les réglages ou définir `VITE_TMDB_API_KEY` |
| Réglages verrouillés | Mot de passe requis | Le mot de passe par défaut est : **ISMABEST** |
| Build Vercel échoue | Variable d'env. manquante | Vérifier que `VITE_TMDB_API_KEY` est définie dans le dashboard Vercel |
