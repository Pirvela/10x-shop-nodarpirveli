import { useState } from "react";
import { Link } from "react-router";
import { useCart } from "../../context/cartContext";
import type { Product } from "../../types/products";
import { discountedPrice, formatPrice } from "../../utils/formats";
import StockBadge from "./StockBadge";

interface ProductDetailsProps {
  product: Product;
}

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
const stepButton = `size-11 text-xl font-bold enabled:hover:bg-sun disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { items, addItem } = useCart();
  // ?? : თუ images ცარიელია, thumbnail-ს ვაჩვენებთ
  const [selectedImage, setSelectedImage] = useState(
    product.images[0] ?? product.thumbnail,
  );
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  // რამდენი ცალი გვაქვს უკვე კალათაში და რამდენის დამატება შეიძლება კიდევ
  const inCart =
    items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const available = product.stock - inCart;
  const canAdd = available >= 1;

  const finalPrice = discountedPrice(product.price, product.discountPercentage);
  const hasDiscount = product.discountPercentage >= 1;

  function handleAdd() {
    const added = addItem(product, qty);
    if (added) {
      setMessage(`Added ${qty} to cart ✓`);
      setQty(1);
    } else {
      setMessage("Not enough stock for this quantity.");
    }
  }

  let buttonText = "Add to cart";
  if (product.stock === 0) buttonText = "Out of stock";
  else if (!canAdd) buttonText = "All in your cart";

  return (
    <section>
      <Link
        to="/"
        className={`inline-block rounded-lg font-bold underline-offset-4 hover:underline ${focusRing}`}
      >
        ← Back to catalog
      </Link>

      {/* mobile ერთი სვეტი, md-დან ორი (გალერეა | ინფორმაცია) */}
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <div className="rounded-2xl border-3 border-ink bg-white p-4 shadow-brutal">
            <img
              src={selectedImage}
              alt={product.title}
              width={600}
              height={600}
              className="aspect-square w-full object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <ul className="mt-4 flex flex-wrap gap-3">
              {product.images.map((image, index) => (
                // სურათის URL უნიკალურია და არ იცვლება, ამიტომ კარგი key-ა
                <li key={image}>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={image === selectedImage}
                    className={`overflow-hidden rounded-lg border-3 bg-white ${
                      image === selectedImage
                        ? "border-ink"
                        : "border-transparent hover:border-ink"
                    } ${focusRing}`}
                  >
                    <img
                      src={image}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      className="size-16 object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border-3 border-ink bg-white p-6 shadow-brutal">
          <p className="text-sm font-bold uppercase tracking-wide">
            {product.category}
            {product.brand && ` · ${product.brand}`}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-4xl font-bold">
              {formatPrice(finalPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full border-2 border-ink bg-green-300 px-2 py-0.5 text-sm font-bold">
                  −{Math.round(product.discountPercentage)}%
                </span>
              </>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span>★ {product.rating.toFixed(1)}</span>
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-4 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span id="qty-label" className="font-bold">
              Quantity
            </span>
            <div
              role="group"
              aria-labelledby="qty-label"
              className="flex items-center rounded-xl border-3 border-ink"
            >
              <button
                type="button"
                onClick={() => setQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className={`${stepButton} rounded-l-lg`}
              >
                −
              </button>
              <span className="w-12 text-center text-lg font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                disabled={qty >= available}
                aria-label="Increase quantity"
                className={`${stepButton} rounded-r-lg`}
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd}
            className={`mt-6 w-full rounded-xl border-3 border-ink bg-punch py-3 text-lg font-bold shadow-brutal-sm transition-all enabled:hover:bg-punch-dark enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:active:shadow-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${focusRing}`}
          >
            {buttonText}
          </button>

          {/* role="status": ეკრანის წამკითხველი შეტყობინებას ხმამაღლა წაიკითხავს */}
          {message && (
            <p role="status" className="mt-3 font-bold">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
