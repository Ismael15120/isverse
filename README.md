# 🌌 ISVERSE

Application web progressive (PWA) de streaming mobile-first, design glassmorphism/néon, catalogue TMDB et lecture multi-sources.

## 📦 Stack

- **React 18** + Vite + TypeScript
- **Tailwind CSS** + Glassmorphism CSS custom
- **Zustand** (state management) + React Router v7
- **VitePWA** + Workbox (cache offline)
- **TMDB API** (catalogue films & séries)
- **Déploiement** : Vercel

## 🚀 Installation Locale

```bash
# 1. Cloner le repo
git clone https://github.com/Ismael15120/isverse.git
cd isverse

# 2. Installer les dépendances
npm install

# 3. Créer le fichier de configuration
# Créer .env.local à la racine et y ajouter :
VITE_TMDB_API_KEY=ta_cle_api_tmdb_ici

# 4. Lancer l'app en local
npm run dev
# → Ouvre http://localhost:3000
```

> **Obtenir une clé TMDB** : Créé un compte sur [themoviedb.org](https://www.themoviedb.org) → Paramètres → API → Créer une clé v3.

## 🌍 Internationalisation

L'application supporte le multilingue. Par défaut : **Français (fr-FR)**.

**Changer la langue :**
1. Va dans `/settings`
2. Sélectionne ta langue préférée
3. L'application se recharge automatiquement

**Langues disponibles :**
- 🇫🇷 Français (défaut)
- 🇬🇧 English
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇧🇷 Português (BR)
- 🇯🇵 日本語

**Note :** Seules les métadonnées TMDB sont traduites. Les interfaces des lecteurs vidéo (iframes) restent en anglais.

## 🌐 Déploiement Vercel

1. Pousser le code sur GitHub
2. Aller sur [vercel.com](https://vercel.com) → "Add New Project"
3. Importer le dépôt `isverse`
4. Ajouter la variable d'environnement `VITE_TMDB_API_KEY` dans les réglages
5. Cliquer sur **Deploy** (~2 min)

## 🔐 Sécurité

- La clé API TMDB est injectée au build via `import.meta.env`. Ne jamais la commiter.
- Le fichier `.env.local` est ignoré par `.gitignore`.
- La page `/settings` est protégée par un mot de passe local.

## ⚠️ Limites Connues

| Limite | Détail |
|--------|--------|
| Sources vidéo | Proviennent de services tiers (VidSrc, 2Embed). Disponibilité variable, géo-restrictions possibles. |
| TMDB API | Limite ~500 req/jour sur plan gratuit. Usage personnel recommandé. |
| PWA Cache | Cache les assets statiques et images TMDB. Ne cache **pas** les flux vidéo. |
| localStorage | ~5-10 Mo. Watchlist et historique de lecture locaux uniquement. |
| Plein écran | Certaines sources tierces bloquent le fullscreen en raison de leur propre CSP. Changer de source si problème. |

## ⚖️ Mention Légale

Ce projet est fourni à des fins **éducatives et d'usage personnel**. Aucun contenu protégé n'est hébergé sur ce projet. L'utilisateur est seul responsable du respect des lois locales sur le droit d'auteur et de l'usage des flux vidéo tiers.

## 📄 Licence

GPL-3.0 — Voir le fichier `LICENSE`.
