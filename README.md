# 10X Shop

An online shop single-page application built with React, TypeScript and Tailwind CSS v4. Products come from the public [DummyJSON](https://dummyjson.com) API. Login and checkout are local simulations: no real authentication or payment is involved.

**Live demo:** https://10x-shop-nodarpirveli.vercel.app/

## Features

### Core

- **Catalog:** products loaded from the API with loading, error and empty states; responsive grid (1 / 2 / 4 columns)
- **Product details:** image gallery, discounted price, stock status, quantity selector; invalid or missing product IDs show a 404 page
- **Cart:** add, change quantity, remove, clear; totals with discounts; saved in `localStorage` so it survives a page refresh
- **Login:** controlled form with validation; login state lives in React Context
- **Protected checkout:** guests are redirected to login and returned to checkout afterwards
- **Checkout:** controlled form (full name, email, address, city) with validation, order summary and a confirmation screen
- **Quality:** strict TypeScript, error boundary, 404 page, keyboard focus styles, touch targets of at least 44px

### Extra

- Custom design tokens with Tailwind `@theme` (neo-brutalist style)
- Route-level code splitting with `React.lazy` and `Suspense`
- Toast notifications for cart actions
- Search with a 400 ms debounce (`useDebounce` custom hook), category filter, sorting and pagination
- All catalog filters live in the URL, so refresh, back/forward and shared links keep them
- Stale requests are cancelled with `AbortController`

## Tech stack

- React 19 + TypeScript (strict mode)
- Vite
- React Router
- Tailwind CSS v4
- DummyJSON API
- Deployed on Vercel

## Architecture

```
src/
  api/          products.ts — API requests (fetch)
  components/
    cart/       CartLine
    layout/     Layout, Header, Footer, ScrollToTop
    product/    ProductCard, ProductGrid, ProductDetails, StockBadge
    ui/         Container, TextField
    ErrorBoundary.tsx
  context/      AuthContext and CartContext (context + provider)
  pages/        Catalog, Product, Cart, Login, Checkout, NotFound
  routes/       AppRoutes, ProtectedRoute
  types/        products, carts, users, checkouts, api
  utils/        formats (price), cart (totals), validation
```

**Data flow:** Pages load data from the API inside `useEffect` and keep it in a typed `AsyncState` (loading / success / error), which decides what is rendered. Shared state lives in two contexts: `CartContext` (cart items, persisted to `localStorage`) and `AuthContext` (simulated login, kept in memory only). Components receive data through props and report user actions back through callback props. All state updates are immutable, so React detects every change and re-renders.

## How to run

```bash
git clone https://github.com/Pirvela/10x-shop-nodarpirveli.git
cd 10x-shop-nodarpirveli
npm install
npm run dev
```

## Scripts

| Script              | Description                            |
| ------------------- | -------------------------------------- |
| `npm run dev`       | Start the development server           |
| `npm run build`     | Build for production                   |
| `npm run preview`   | Preview the production build locally   |
| `npm run typecheck` | Type-check the project with TypeScript |
| `npm run lint`      | Lint the code with ESLint              |

## Test account

Login is simulated. Any username works with a password of at least 6 characters, for example:

- Username: `emilys`
- Password: `emilyspass`

## Known limitations

- Login state is not persisted: it resets on page refresh (allowed by the project requirements).
- Orders are not saved after the confirmation screen.

## Credits

- Product data: [DummyJSON](https://dummyjson.com)
- Font: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
- Claude (AI assistant) helped with explanations, code suggestions and review. Planning, decisions and testing are my own.
