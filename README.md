# Trivera

Sanity CMS-powered e-commerce marketplace. Next.js 16 + TypeScript + Sanity CMS + Paystack.

## Two parts

1. **`/` (project root)** — the Next.js storefront
2. **`/studio`** — the Sanity Studio (deploys to trivera.sanity.studio)

## Browser-only setup (no local dev server needed)

This workflow is designed for laptops with limited RAM. You will not run anything locally. Everything happens in the browser via GitHub, Vercel, and Sanity's hosted Studio.

### Step 1: Push to GitHub (10 minutes)

1. Go to https://github.com/new
2. Repository name: `trivera`
3. Set to **Public**
4. Do NOT initialize with README
5. Click **Create repository**
6. On the empty repo page, click **"uploading an existing file"** link
7. Drag all files and folders from the extracted Trivera ZIP into the GitHub upload area
   - Make sure to drag the contents of the folder, not the folder itself
   - You should see `package.json`, `next.config.ts`, `src/`, `studio/`, `public/`, etc. in the upload list
8. Commit message: `Initial Trivera commit`
9. Click **Commit changes**

### Step 2: Deploy the Studio to Sanity (5 minutes)

1. Go to https://www.sanity.io/manage and log in
2. Click on your `trivera` project
3. In the left sidebar, click **"Studios"**
4. Click **"Create Studio"** or **"Deploy Studio"**
5. Choose **"Connect GitHub repository"**
6. Authorize Sanity to access your GitHub
7. Select the `trivera` repository
8. Set the root directory to `studio`
9. Set the env vars when prompted:
   - `SANITY_STUDIO_PROJECT_ID` = `0ax9v9qq`
   - `SANITY_STUDIO_DATASET` = `production`
10. Click **Deploy**
11. Wait 2-3 minutes. Sanity gives you a URL like `https://trivera.sanity.studio`
12. Bookmark this URL — this is what you send to LeSeft as your "Sanity Studio demonstration"

### Step 3: Add your products in Studio (30 minutes)

1. Open `https://trivera.sanity.studio` (or whatever URL Sanity gave you)
2. Log in with your sanity.io account
3. You should see 4 document types in the left sidebar: Product, Seller, Category, Review
4. Create 4 Sellers first:
   - Naija Tech Hub (Lagos, 99% rating)
   - Fashion Republic (Abuja, 97% rating)
   - Home Essentials (Kano, 95% rating)
   - Beauty By Nature (Port Harcourt, 98% rating)
5. Create 6 Categories:
   - Smartphones (icon: Smartphone)
   - Laptops (icon: Laptop)
   - Fashion (icon: Shirt)
   - Home Appliances (icon: CookingPot)
   - Beauty (icon: Sparkles)
   - Audio (icon: Headphones)
6. Create 8 Products (see `src/data/sanity-mock.json` for sample data):
   - Samsung Galaxy A14 — ₦156,000 (was ₦185,000), Smartphone, Naija Tech Hub
   - Tecno Camon 20 — ₦124,500 (was ₦145,000), Smartphone, Naija Tech Hub
   - HP Pavilion x360 — ₦685,000 (was ₦780,000), Laptops, Naija Tech Hub
   - Lenovo IdeaPad 3 — ₦445,000 (was ₦520,000), Laptops, Naija Tech Hub
   - Ankara Gown — ₦28,000 (was ₦35,000), Fashion, Fashion Republic
   - Agbada Set — ₦65,000 (was ₦80,000), Fashion, Fashion Republic
   - Binatone Blender — ₦42,000 (was ₦52,000), Home Appliances, Home Essentials
   - Shea Butter Cream — ₦8,500 (was ₦12,000), Beauty, Beauty By Nature
7. For each product, upload an image (use any product photo from Unsplash)
8. Add reviews to a few products so the storefront has ratings

### Step 4: Set up CORS on Sanity (1 minute)

1. On your Sanity dashboard at sanity.io, click **"API"** in the left sidebar
2. Click **"CORS Origins"** tab
3. Click **"Add CORS origin"**
4. Add: `http://localhost:3000` (for local testing)
5. Add another: `https://trivera.vercel.app` (we'll deploy here next)
6. Save

### Step 5: Deploy the Next.js storefront to Vercel (5 minutes)

1. Go to https://vercel.com and log in with GitHub
2. Click **"Add New"** → **"Project"**
3. Find `trivera` in the repo list → click **"Import"**
4. Vercel auto-detects Next.js. Don't change framework settings.
5. Expand **"Environment Variables"** and add these 4:
   - `SANITY_PROJECT_ID` = `0ax9v9qq`
   - `SANITY_DATASET` = `production`
   - `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` = `pk_test_placeholder` (we'll fix later)
   - `PAYSTACK_SECRET_KEY` = `sk_test_placeholder`
6. Click **"Deploy"**
7. Wait 2-3 minutes
8. You get a URL like `trivera.vercel.app`

### Step 6: Verify

1. Open your Vercel URL in a browser
2. You should see Trivera with all 8 products pulled live from Sanity
3. Click a product, add to cart, do the mock checkout flow
4. If products don't show:
   - Check that you published products in Studio (not just drafts)
   - Check CORS origins on sanity.io include your Vercel URL
   - Check Vercel env vars match your Sanity Project ID

### Step 7: Send to LeSeft

Reply to Angel with:

> Hi Angel,
>
> Trivera is now live with full Sanity CMS integration:
>
> - Live site: https://trivera.vercel.app
> - Sanity Studio: https://trivera.sanity.studio
> - GitHub: https://github.com/mitchoder07/trivera
>
> The Studio is where LeSeft staff would edit content (every product, seller, category, and review on the storefront is authored in Studio). Try editing a product name in Studio and refreshing the live site to see it update.
>
> Happy to do a walkthrough on Google Meet at your convenience.
>
> Best,
> Abdullah

## Editing code later (no local install needed)

If you need to edit code (swap Paystack for real, change colors, etc.):

1. Go to https://vscode.dev
2. Click **"Open Remote Repository"**
3. Paste your GitHub repo URL: `https://github.com/mitchoder07/trivera`
4. Edit files directly in the browser — full VS Code experience, zero local RAM
5. Use the Source Control tab to commit changes back to GitHub
6. Vercel auto-redeploys within 60 seconds of every commit

## Local development (only if you have 8GB+ RAM)

If you ever want to run locally:

```bash
npm install
cp .env.local.example .env.local
# edit .env.local with your values
npm run dev
```

Open http://localhost:3000.

For the Studio:

```bash
cd studio
npm install
npm run dev
```

Open http://localhost:3333.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Sanity CMS (GROQ queries)
- Zustand (cart + view state)
- Framer Motion (animations)
- Paystack (mock now, real later)

## Project structure

```
trivera/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Single-page storefront
│   │   └── globals.css       # Trivera theme
│   ├── components/
│   │   └── trivera/          # 25 components
│   ├── lib/
│   │   ├── sanity/           # client, queries, schema, types
│   │   └── paystack/         # mock client (swap for real later)
│   ├── store/                # Zustand stores (cart + view)
│   └── data/
│       └── sanity-mock.json  # 8 products, 4 sellers, 6 categories, 12 reviews
├── studio/                   # Sanity Studio (deploys to trivera.sanity.studio)
│   ├── schemas/
│   │   ├── schema.ts         # product, seller, category, review
│   │   └── index.ts
│   ├── sanity.config.ts
│   └── package.json
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── .env.local.example
```
