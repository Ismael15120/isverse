# 🔧 Maintenance & Évolution — ISVERSE

## 🔄 Mettre à jour les Sources Vidéo

Si une source cesse de fonctionner :

1. Ouvrir `src/hooks/useVideoSource.ts`
2. Localiser le tableau `SOURCES` (ou la fonction de génération d'URL)
3. Remplacer les URLs obsolètes ou en ajouter de nouvelles compatibles iframe
4. Tester sur 3 appareils différents (mobile, desktop, tablette)
5. Commiter et pousser → Vercel rebuild automatiquement

**Format d'une source** :
```ts
{ name: 'NomSource VF', url: `https://exemple.com/embed/${tmdbId}` }
```

> ⚠️ Ne pas utiliser `sandbox` sur l'iframe — bloqué par la plupart des sources.

---

## 🗑️ Vider le Cache PWA

**Mobile** :
- Paramètres → Apps → ISVERSE → Stockage → Effacer les données

**Desktop Chrome** :
- DevTools → Application → Clear storage → Unregister Service Worker → Clear site data

---

## 📦 Mise à Jour des Dépendances

```bash
# Vérifier les dépendances obsolètes
npm outdated

# Mettre à jour (mineures et patches)
npm update

# Vérifier que le build passe toujours
npm run build

# Commiter et pousser
git add -A
git commit -m "chore: deps update"
git push
```

> 💡 Pour les **mises à jour majeures** (ex: React 19, Vite 6), consulter les changelogs avant de mettre à jour.

---

## 📊 Monitoring

| Où regarder | Quoi surveiller |
|-------------|-----------------|
| Console navigateur | Erreurs `Failed to fetch`, `401`, `429` |
| Vercel Dashboard → Deployments | Erreurs de build, logs |
| Vercel Dashboard → Analytics | Temps de réponse, erreurs 4xx/5xx |
| DevTools → Network | Taille des assets, temps de chargement |

---

## 🗺️ Roadmap Réaliste (Optionnel)

Ces fonctionnalités peuvent être ajoutées progressivement :

- [ ] **Synchronisation cloud** — Firebase ou Supabase pour watchlist multi-appareils
- [ ] **Sous-titres** — Support fichiers `.vtt` intégrés au player
- [ ] **Thème clair** — Bascule sombre/clair manuel dans les réglages
- [ ] **Tests E2E** — Playwright pour automatiser les tests de navigation
- [ ] **Recherche avancée** — Filtres par genre, année, note TMDB
- [ ] **Notifications PWA** — Alerte pour nouvelles sorties (via TMDB /trending)
- [ ] **Statistiques de visionnage** — Durée totale regardée, genres favoris

---

## 📝 Convention de Commit

```
feat: nouvelle fonctionnalité
fix: correction de bug
chore: maintenance (deps, config)
docs: mise à jour documentation
style: changements visuels sans impact logique
```
