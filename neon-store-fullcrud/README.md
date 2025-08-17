# Neon Store — Full CRUD (LocalStorage) — Vercel Ready

Routes
- `/` Storefront — reads all products from `localStorage.products` (seeded from `products.json` on first visit)
- `/admin/login` — login (admin / 1234)
- `/admin` — FULL CRUD (add/edit/delete, clear all, reset to seed, import/export JSON)

Deploy
1) `npm i`
2) `npm run build`
3) Deploy to Vercel (no env needed)

Edit Telegram link in `pages/index.js` (variable `telegramUser`).

Note: This demo uses localStorage (client only). For multi-user, add a real DB (Supabase/Neon) later.
