# NEXORA TECH — Boutique d'accessoires électroniques (Tunisie)

Boutique en ligne en français (arabe disponible), prix en dinars tunisiens (TND), commande **uniquement via WhatsApp** avec **paiement à la livraison**.

> ⚠️ **Mode démonstration** : les produits, marques, prix, stocks, notes et avis sont **fictifs**. Le numéro WhatsApp est un **placeholder**. Aucune commande n'est enregistrée par le site : le client envoie un message WhatsApp prérempli, et c'est le vendeur qui confirme.

---

## 1. Lancer le site en local

Prérequis : **Node.js 18.18 ou plus récent** (vérifiez avec `node -v`).

```bash
npm install          # 1. installer les dépendances (une seule fois)
npm run dev          # 2. lancer le serveur de développement
```

Ouvrez ensuite **http://localhost:3000** (ou le port affiché dans le terminal).
Pour choisir un autre port : `npm run dev -- -p 3100`.

Version de production (plus rapide, pour vérifier avant publication) :

```bash
npm run build
npm start
```

### Tester pas à pas

1. **Accueil** : bannière, catégories, meilleures ventes, nouveautés, promotions, avis, infos livraison, bouton WhatsApp flottant en bas à droite.
2. **Recherche** : tapez « montre » dans la barre du haut → des suggestions apparaissent ; Entrée → page de résultats.
3. **Boutique** (`/produits`) : filtrez par catégorie, marque, prix maximum, « en stock », « en promotion » ; changez le tri. Les filtres sont dans l'URL (lien partageable). Sur mobile, bouton « Filtres ».
4. **Fiche produit** : galerie (clic sur les miniatures, glissement sur mobile, zoom au survol), choix de couleur et de quantité, « Ajouter au panier », « Commander maintenant », « Poser une question sur WhatsApp ».
5. **Panier** : icône sac en haut à droite → tiroir avec quantités, sous-total, livraison, total et barre « livraison gratuite ».
6. **Commande** (`/panier`) : remplissez nom, téléphone (format tunisien, ex. `98 123 456`), gouvernorat et adresse → « Commander via WhatsApp ». WhatsApp s'ouvre avec le message prérempli (produits, quantités, prix, total, coordonnées).
7. Produit en rupture : `/produit/sonik-sport-neckband` (boutons désactivés). Stock faible : `/produit/trepied-selfie-bluetooth`.

Le panier est conservé dans le navigateur (localStorage) : il survit au rechargement de la page.

---

## 2. Personnaliser la boutique

| Quoi | Où |
|---|---|
| Nom, logo, slogan, **numéro WhatsApp**, téléphone, e-mail, horaires, **frais de livraison**, seuil de livraison gratuite, réseaux sociaux, langue, bandeau démo | `src/config/site.ts` |
| Produits (nom, prix, ancien prix, stock, images, caractéristiques, couleurs…) | `src/data/products.ts` |
| Catégories | `src/data/categories.ts` |
| Textes de l'interface | `src/i18n/fr.ts` (français) et `src/i18n/ar.ts` (arabe) |
| Couleurs de la marque (`#087CFF`, `#080F20`) | `tailwind.config.ts` |
| Images | `public/images/...` |
| Avis clients affichés sur l'accueil | `src/components/home/Sections.tsx` (constante `reviews`) |

### Avant la mise en ligne (obligatoire)

1. **Numéro WhatsApp** : dans `src/config/site.ts`, remplacez `whatsappNumber: "21600000000"` par votre numéro au format international **sans `+` ni espaces** (ex. `"21698123456"`). Mettez aussi à jour `phoneDisplay`.
2. **Produits et prix réels** dans `src/data/products.ts`.
3. **Photos** : déposez vos photos (`.jpg` ou `.webp`, carrées, 800×800 px conseillé) dans `public/images/products/` et modifiez le champ `images` du produit, par ex. `images: ["/images/products/ma-montre.jpg", "/images/products/ma-montre-dos.jpg"]`.
4. **Avis** : remplacez les avis d'exemple par de vrais avis, ou supprimez la section dans `src/app/page.tsx`.
5. Passez `demoMode: false` pour retirer le bandeau « démonstration ».
6. Une fois le domaine choisi, renseignez `NEXT_PUBLIC_SITE_URL` (ex. `https://nexoratech.tn`) dans les variables d’environnement Vercel.

### Logo
- Par défaut : symbole éclair + texte `logoText`.
- Pour une image : placez `logo.png` dans `public/` puis `logoImage: "/logo.png"`.
- Icône d'onglet : `public/favicon.svg`.

### Langue arabe
Mettez `locale: "ar"` dans `src/config/site.ts` : toute l'interface passe en arabe, de droite à gauche, avec la police Cairo. Les noms et descriptions de produits restent ceux de `products.ts` (traduisez-les si besoin).

### Images de démonstration
Les illustrations SVG actuelles sont générées par `npm run images` (script `scripts/generate-demo-images.mjs`). Elles portent la mention « DÉMO ». Remplacez-les par vos propres photos (prises par vous ou fournies par vos fournisseurs avec autorisation).

---

## Meta Pixel (publicités Facebook / Instagram)

1. Dans le Gestionnaire d'événements Meta, copiez l'identifiant de votre pixel (une suite de chiffres).
2. Copiez `.env.example` en `.env.local` et renseignez-le :
   ```
   NEXT_PUBLIC_META_PIXEL_ID=123456789012345
   ```
   Sur Vercel : *Settings → Environment Variables*, même nom, puis redéployez.
3. Redémarrez `npm run dev`. Sans identifiant valide, aucun script Meta n'est chargé.

Événements envoyés automatiquement :

| Événement | Quand |
|---|---|
| `PageView` | À chaque page (sauf `/admin`) |
| `ViewContent` | Ouverture d'une fiche produit |
| `AddToCart` | « Ajouter au panier » et « Commander maintenant » |
| `InitiateCheckout` | Arrivée sur la page de commande avec un panier non vide |
| `Purchase` | Clic sur « Commander via WhatsApp » avec un formulaire valide (une seule fois par commande) |

**Devise** : Meta refuse le dinar tunisien (TND). Les montants sont convertis dans la devise de votre compte publicitaire via `metaPixel` dans `src/config/site.ts` (`currency` et `rateFromTND`, à tenir à jour).

**Limite** : `Purchase` signifie « le client a ouvert WhatsApp avec sa commande », pas « commande confirmée ou payée ». Certains clients n'enverront pas le message ou refuseront le colis. Pour des conversions exactes, il faudra plus tard envoyer `Purchase` depuis le serveur (API Conversions) au moment où le vendeur confirme, en réutilisant le même `eventID` pour éviter les doublons.

En développement, chaque événement s'affiche dans la console du navigateur (`[Meta Pixel] …`). Pour vérifier en ligne : extension *Meta Pixel Helper* ou l'onglet *Tester les événements* du Gestionnaire d'événements.

## Tableau de bord admin

Page `/admin` : chiffre d'affaires, nombre de commandes, panier moyen, articles vendus, produits les plus commandés et dernières commandes. Elle indique aussi si le pixel est actif.

- Les chiffres viennent de **commandes fictives** (`src/data/mock-orders.ts`). Pour utiliser la base de données, remplacez seulement `getOrders()` dans `src/lib/analytics.ts`.
- ⚠️ La page n'est **pas protégée par mot de passe** (elle est seulement exclue de Google). Ce n'est pas grave avec des données fictives, mais il faut ajouter une connexion avant d'y afficher de vraies commandes.

---

## 3. Structure du projet

```
src/
├── app/                      Pages (Next.js App Router)
│   ├── page.tsx              Accueil
│   ├── produits/             Catalogue + recherche + filtres
│   ├── produit/[slug]/       Fiche produit (pages générées statiquement)
│   ├── panier/               Panier + formulaire de commande WhatsApp
│   ├── livraison/            Livraison, paiement, retours
│   └── layout.tsx            En-tête, pied de page, panier, bouton WhatsApp
├── components/
│   ├── layout/               TopBar, Header, SearchBox, Footer, Logo, WhatsAppFloat
│   ├── home/                 Hero et sections de l'accueil
│   ├── product/              Carte produit, galerie, bloc d'achat
│   ├── catalog/              Catalogue filtrable
│   └── cart/                 Tiroir panier, lignes, formulaire de commande
├── config/site.ts            ⚙️ Réglages de la boutique
├── data/                     🛍️ Produits et catégories
├── i18n/                     Textes FR / AR
├── lib/
│   ├── catalog.ts            Accès aux données (point unique à remplacer par une BDD)
│   ├── whatsapp.ts           Construction et encodage des messages WhatsApp, validation téléphone
│   └── format.ts             Format des prix TND, calcul de la livraison
└── store/cart.ts             Panier (Zustand + localStorage)
```

### Choix techniques
- **Next.js 15 (React) + TypeScript** : pages pré-générées donc très rapides, bon référencement Google, hébergement gratuit possible (Vercel, Netlify), et une structure prête pour ajouter une base de données, des routes API et une interface d'administration sans tout réécrire.
- **Tailwind CSS** : design cohérent et responsive, facile à modifier.
- **Zustand** : panier léger, persistant dans le navigateur.
- **Pas de paiement en ligne, pas de backend** : la commande est un lien `https://wa.me/<numéro>?text=<message encodé>` (via `encodeURIComponent`). Le site n'enregistre rien et l'indique clairement au client.

### Sécurité
- Aucune donnée client n'est envoyée à un serveur : elle va uniquement dans le message WhatsApp que le client envoie lui-même.
- Les champs saisis sont nettoyés et limités en longueur avant d'être mis dans le message ; le téléphone est validé (format tunisien).
- En-têtes HTTP de sécurité configurés dans `next.config.mjs` (`X-Frame-Options`, `nosniff`, etc.).
- Dépendances à jour sans vulnérabilité connue au moment de la création (`npm audit`).

---

## 4. Publier le site

### Option A — Vercel (recommandé, gratuit pour démarrer)
1. Sur https://github.com/new, créez un dépôt **privé** vide (sans README ni .gitignore), par ex. `nexora-tech`.
2. Dans le dossier du projet, envoyez le code (remplacez `<vous>` par votre nom d'utilisateur GitHub) :
   ```bash
   git add .
   git commit -m "Boutique NEXORA TECH"
   git branch -M main
   git remote add origin https://github.com/<vous>/nexora-tech.git
   git push -u origin main
   ```
   `.env.local`, `node_modules` et `.next` sont exclus par `.gitignore` : aucun secret n'est envoyé.
3. Sur https://vercel.com, connectez-vous avec GitHub → *Add New… → Project* → importez `nexora-tech`. Vercel détecte Next.js tout seul : ne changez pas les commandes de build.
4. Avant de cliquer sur *Deploy*, ouvrez *Environment Variables* et ajoutez si besoin `NEXT_PUBLIC_META_PIXEL_ID` (voir `.env.example`). Cliquez sur *Deploy*.
5. Le site est en ligne sur `https://<projet>.vercel.app`. Chaque `git push` sur `main` le met à jour automatiquement.
6. Domaine personnalisé (ex. `.tn`) : *Settings → Domains*, suivez les instructions DNS, puis ajoutez `NEXT_PUBLIC_SITE_URL=https://votre-domaine` et redéployez.

⚠️ Une variable d'environnement ajoutée ou modifiée sur Vercel n'est prise en compte qu'après un nouveau déploiement (*Deployments → … → Redeploy*).

### Option B — Netlify
Importez le dépôt sur https://app.netlify.com ; Netlify détecte Next.js automatiquement.

### Option C — Votre propre serveur (VPS)
```bash
npm ci && npm run build
npm start   # écoute sur le port 3000 ; placez Nginx devant + HTTPS (Let's Encrypt)
```
Utilisez un gestionnaire de processus comme `pm2` pour garder le site en ligne.

---

## 5. Évolutions : base de données et administration

Le site fonctionne sans backend. Quand vous voudrez gérer produits, stocks et commandes depuis une interface :

1. **Base de données** : par exemple **Supabase** (PostgreSQL hébergé, offre gratuite) ou PostgreSQL + **Prisma**.
   - Créez les tables `products`, `categories`, `orders`, `order_items` (reprenez les champs de `src/lib/types.ts`).
   - Importez les produits de `src/data/products.ts`.
2. **Brancher le catalogue** : remplacez uniquement le contenu des fonctions de `src/lib/catalog.ts` (`getAllProducts`, `getProductBySlug`…) par des requêtes à la base. Les pages n'ont pas besoin de changer (les rendre `async` si nécessaire).
3. **Enregistrer les commandes** : ajoutez une route `src/app/api/orders/route.ts` qui valide les données côté serveur (ex. avec `zod`), recalcule les prix depuis la base (ne jamais faire confiance aux prix envoyés par le navigateur), enregistre la commande, puis renvoie le lien WhatsApp. Ce n'est qu'à ce moment-là que le site pourra afficher « commande enregistrée ».
4. **Tableau de bord administrateur** : pages `src/app/admin/...` protégées par une authentification (Supabase Auth ou Auth.js) pour gérer produits, prix, stocks, statuts de commande. Ne jamais exposer de clé secrète côté navigateur ; utilisez des variables d'environnement (`.env.local`, déjà ignoré par git).
5. **Images** : stockage Supabase Storage ou Cloudinary, avec upload depuis l'admin.

---

## Commandes utiles

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Compilation de production (vérifie aussi les types) |
| `npm start` | Lance la version compilée |
| `npm run typecheck` | Vérification TypeScript seule |
| `npm run images` | Régénère les images de démonstration |
