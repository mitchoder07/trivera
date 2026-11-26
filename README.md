# Trivera

Sanity CMS-powered e-commerce marketplace. Next.js 16 + TypeScript + Sanity CMS + Paystack.


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
