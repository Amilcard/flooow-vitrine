# Flooow — Site vitrine

Site vitrine statique de **Flooow** (association JUNGLE ATTITUDE, Saint-Étienne) : accès aux activités jeunesse de la Loire, aides financières et mobilité partagée.

Aucune dépendance, aucun build : HTML / CSS / JavaScript purs.

## Structure

```
flooow-vitrine/
├── index.html          # Structure HTML + contenu (SPA à ancres)
├── css/
│   └── styles.css      # Tous les styles + @font-face Poppins
├── js/
│   └── app.js          # Navigation (routing #ancre), recherche, menu mobile, formulaire
├── fonts/              # Police Poppins auto-hébergée (.woff2)
├── img/                # Images (heroes, cartes) + logo-flooow.png
├── README.md
└── .gitignore
```

## Fonctionnement

- **Navigation** : SPA à une page. `navigateTo(id)` met à jour l'ancre (`#aides`, `#article-velo`…) ; le bouton *Précédent* du navigateur et le partage de liens directs fonctionnent.
- **Recherche** : filtrage côté client d'un index des rubriques/articles (`SEARCH_INDEX` dans `app.js`).
- **Responsive** : menu burger sous 960 px, mégamenus au survol au-dessus.
- **Polices** : Poppins servie localement (pas de Google Fonts, conforme RGPD).
- **Images** : hébergées localement, heroes redimensionnés à 1400 px max.

## Lancer en local

Un simple serveur statique suffit (les chemins sont relatifs) :

```bash
npx serve .          # puis ouvrir http://localhost:3000
# ou
python3 -m http.server 8000
```

## Déploiement (Hostinger)

Uploader le contenu du dépôt à la racine web : `index.html`, `css/`, `js/`, `img/`, `fonts/`.

## À compléter avant diffusion publique

- **`index.html`** : remplacer `https://VOTRE-DOMAINE.fr` (balises `og:url` / `og:image` / `twitter:image`) par le domaine réel.
- Vérifier que la boîte **contact@flooow.fr** est active (formulaire de contact + pages légales).

## Branches

- `main` : site en production.
- `old-site` : sauvegarde de l'ancien site (avant refonte).

## Mentions légales

Éditeur : association **JUNGLE ATTITUDE** (loi 1901) — SIREN 912 423 779 — 3 rue Flobert, 42000 Saint-Étienne. Directeur de la publication : Laïd HAMOUDI.
