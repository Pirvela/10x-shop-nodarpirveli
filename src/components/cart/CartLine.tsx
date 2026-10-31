import { Link } from "react-router";
import type { CartItem } from "../../types/carts";
import { discountedPrice, formatPrice } from "../../utils/formats";

interface CartLineProps {
  item: CartItem;
  onQuantityChange: (productId: number, qty: number) => void; // callback prop
  onRemove: (productId: number) => void; // callback prop
}

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
const stepButton = `size-11 text-xl font-bold enabled:hover:bg-sun disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`;

export default function CartLine({
  item,
  onQuantityChange,
  onRemove,
}: CartLineProps) {
  // გამოთვლილი მნიშვნელობები: state-ში არ ვინახავთ, item-იდან ვითვლით
  const unitPrice = discountedPrice(item.price, item.discountPercentage);
  const lineTotal = unitPrice * item.quantity;

  return (
    <li className="flex gap-4 rounded-2xl border-3 border-ink bg-white p-4 shadow-brutal">
      <img
        src={item.thumbnail}
        alt={item.title}
        width={96}
        height={96}
        className="size-20 shrink-0 rounded-xl border-2 border-ink bg-sky object-contain sm:size-24"
      />

      {/* min-w-0: გრძელი სათაური ბარათს არ "გაჭიმავს" ვიწრო ეკრანზე */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div>
          <Link
            to={`/products/${item.productId}`}
            className={`rounded font-bold hover:underline ${focusRing}`}
          >
            {item.title}
          </Link>
          <p className="text-sm">{formatPrice(unitPrice)} each</p>
        </div>

        {/* flex-wrap: ვიწრო ეკრანზე ელემენტები მეორე რიგში გადადის */}
        <div className="flex flex-wrap items-center gap-4">
          <div
            role="group"
            aria-label={`Quantity of ${item.title}`}
            className="flex items-center rounded-xl border-3 border-ink"
          >
            <button
              type="button"
              onClick={() =>
                onQuantityChange(item.productId, item.quantity - 1)
              }
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className={`${stepButton} rounded-l-lg`}
            >
              −
            </button>
            <span className="w-10 text-center font-bold">{item.quantity}</span>
            <button
              type="button"
              onClick={() =>
                onQuantityChange(item.productId, item.quantity + 1)
              }
              disabled={item.quantity >= item.stock}
              aria-label="Increase quantity"
              className={`${stepButton} rounded-r-lg`}
            >
              +
            </button>
          </div>

          <span className="text-lg font-bold">{formatPrice(lineTotal)}</span>

          {/* ml-auto: Remove-ს მარჯვენა კიდეზე აწვება */}
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className={`ml-auto rounded-lg px-2 py-1 font-bold underline underline-offset-4 hover:bg-red-200 ${focusRing}`}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
