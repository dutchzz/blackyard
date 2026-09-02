# BLACKYARD — 3D STL Print File Store

A minimalist, premium landing page for selling 3D STL print files (mostly free downloads, paid items under $10 via CashApp). Built with **Vite + React**, backed by **Firebase Firestore**, and deployed on **Vercel via Git**.

- Public store at `/`
- Admin dashboard at `/admin` (passcode-gated)

## Quick start (local)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Demo mode vs Firebase

The app runs in **two modes**, selected automatically:

- **Demo mode (default):** `.env` is empty → all products/settings/codes are saved to your browser's `localStorage`. Great for testing, but nothing is shared with other visitors.
- **Live mode:** once you fill in Firebase keys, the site and admin read/write Firestore — changes are visible to everyone instantly.

## 1) Set up Firebase

1. Go to https://console.firebase.google.com and **create a project** (e.g. `blackyard-store`).
2. In **Build → Firestore Database**, click *Create database* → choose *Start in production mode* (or test mode for now).
3. In **Project settings → Your apps**, click *Add app* → *Web* (`</>`), register the app, and copy the `firebaseConfig` values.
4. Paste them into `.env` (copy from `.env.example`):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

5. **Firestore security rules:** the repo includes `firestore.rules`. Open **Firestore → Rules** and paste its contents so browsers can read products/config/codes and the admin can write. For stronger security later, switch the admin to Firebase Auth and lock writes to the owner (see `firestore.rules` comments).

> On Vercel, set the same variables under **Project → Settings → Environment Variables** (the `.env` file is git-ignored and won't be deployed).

## 2) Deploy to Vercel via Git

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com → **Add New → Project** → import the repo.
3. Vercel auto-detects **Vite**: build command `npm run build`, output directory `dist`.
4. Add the `VITE_FIREBASE_*` environment variables in Vercel.
5. Deploy. Every `git push` to the repo auto-redeploys.

`vercel.json` already contains a rewrite so the `/admin` route (and any deep link) works in production.

## Using the store

**Adding products (admin):**
- Sign in at `/admin` (default passcode is `blackyard` — **change it** in *Site settings → Admin security*).
- *Products → Add product*: name, category, price (`0` = free), description, tags.
- **Images:** paste one image URL per line — the first becomes the card thumbnail, and all of them show in the product's gallery modal.
- **STL link:** paste a public download URL. Free items download directly; paid items are revealed after an unlock code.
- *Unlock codes*: generate a code for a paid product, send it to the buyer after you verify their CashApp payment.

**Payment flow (paid items):**
1. Buyer opens the product → *Buy via CashApp*.
2. They see your cashtag + QR code and pay the exact amount.
3. You verify the payment and send them the unlock code.
4. They enter the code on-site → the download link is revealed.

## Tips

- **Dropbox links:** images work best with `raw=1`; downloads with `dl=1`. The app auto-converts `dl=0` links for you.
- **Large STL files:** keep them on Google Drive / Dropbox and paste the share link (set to *anyone with the link*).
- **CashApp:** only `$Cashtag` + QR are shown. Confirm CashApp's terms allow your products before relying on it as the only payment method.

## Project structure

```
src/
  firebase.js                 # Firebase init (auto-detects config)
  services/store.js           # Data layer (Firestore + localStorage fallback)
  context/StoreContext.jsx    # Global store (config, products, codes)
  pages/Home.jsx              # Public store
  pages/Admin.jsx             # Admin dashboard
  components/                 # Header, Hero, ProductCard/Grid/Modal, PaymentModal, UnlockCode, LegalNotice
  components/admin/           # LoginGate, ProductEditor, SettingsEditor, CodesManager
  utils/images.js             # Image URL parsing + Dropbox normalization
  styles/global.css           # Premium minimalist theme
```

