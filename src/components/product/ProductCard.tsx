import { Link } from "react-router";
import type { Product } from "../../types/products";
import { discountedPrice, formatPrice } from "../../utils/formats";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void; // callback prop: მშობელი წყვეტს, რა მოხდეს
}

// სრული კლასის სახელები, რომ Tailwind-მა იპოვოს
const TILE_COLORS = ["bg-sky", "bg-lime", "bg-blush", "bg-periwinkle"] as const;

const badgeBase =
  "rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold";

function StockBadge({ stock }: { stock: number }) {
  // რიგი მნიშვნელოვანია: 0 ასევე ≤ 5-ია, ამიტომ ჯერ 0-ს ვამოწმებთ
  if (stock === 0)
    return <span className={`${badgeBase} bg-red-300`}>Out of stock</span>;
  if (stock <= 5)
    return (
      <span className={`${badgeBase} bg-orange-300`}>Only {stock} left!</span>
    );
  return <span className={`${badgeBase} bg-white`}>In stock</span>;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;
  const isOutOfStock = product.stock === 0;
  // id-ით ფერს ვირჩევთ, რომ ერთი პროდუქტი ყოველთვის ერთი ფერის იყოს
  const tileColor = TILE_COLORS[product.id % TILE_COLORS.length];

  return (
    <article className="flex w-full flex-col rounded-2xl border-3 border-ink bg-white p-4 shadow-brutal">
      {/* ბარათი ბმულია, ღილაკის გარდა. ღილაკი Link-ის შიგნით არ უნდა იყოს (a11y) */}
      <Link
        to={`/products/${product.id}`}
        className="group flex flex-1 flex-col rounded-xl focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div
          className={`${tileColor} overflow-hidden rounded-xl border-2 border-ink`}
        >
          {/* width/height: ბრაუზერი ადგილს წინასწარ იტოვებს და გვერდი არ "ხტება" (CLS) */}
          <img
            src={product.thumbnail}
            alt={product.title}
            width={300}
            height={300}
            loading="lazy"
            className="aspect-square w-full object-contain transition-transform group-hover:scale-105"
          />
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-wide">
          {product.category}
          {/* brand არასავალდებულოა: მხოლოდ მაშინ ვხატავთ, თუ არსებობს */}
          {product.brand && ` · ${product.brand}`}
        </p>

        <h2 className="mt-1 text-lg font-medium leading-snug group-hover:underline">
          {product.title}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-2xl font-bold">{formatPrice(finalPrice)}</span>
          {hasDiscount && (
            <>
              <span className="text-sm line-through">
                {formatPrice(product.price)}
              </span>
              <span className={`${badgeBase} bg-green-300`}>
                −{Math.round(product.discountPercentage)}%
              </span>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 text-sm">
          <span aria-label={`Rating ${product.rating} out of 5`}>
            ★ {product.rating.toFixed(1)}
          </span>
          <StockBadge stock={product.stock} />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onAdd(product)}
        disabled={isOutOfStock}
        className="mt-4 w-full rounded-xl border-3 border-ink bg-punch py-2.5 font-bold shadow-brutal-sm transition-all enabled:hover:bg-punch-dark enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
      >
        {isOutOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </article>
  );
}
