import { Link } from "react-router";
import CartLine from "../components/cart/CartLine";
import { useCart } from "../context/cartContext";
import { useToast } from "../context/toastContext";
import { formatPrice } from "../utils/formats";
import { cartTotal } from "../utils/cart";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink";
const primaryButton = `inline-block rounded-xl border-3 border-ink bg-punch px-6 py-3 text-center text-lg font-bold shadow-brutal transition-all hover:bg-punch-dark active:translate-x-1.5 active:translate-y-1.5 active:shadow-none ${focusRing}`;

export default function CartPage() {
  const { items, totalCount, setQuantity, removeItem, clearCart } = useCart();
  const { showToast } = useToast();
  // ცარიელი კალათა: ტექსტები PRD-დან (P4.1), შეჯამება არ ჩანს
  if (items.length === 0) {
    return (
      <section className="py-12 text-center">
        <h1 className="text-5xl font-bold">Cart</h1>
        <p className="mt-4 text-lg">Your cart is empty.</p>
        <Link to="/" className={`mt-8 ${primaryButton}`}>
          Browse products
        </Link>
      </section>
    );
  }

  // გამოთვლილი მნიშვნელობები: ყოველ render-ზე items-იდან
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = cartTotal(items);
  const savings = subtotal - total;

  function handleRemove(productId: number) {
    removeItem(productId);
    showToast("Removed from cart");
  }

  function handleClear() {
    // window.confirm აბრუნებს true-ს, თუ მომხმარებელმა OK დააჭირა
    if (window.confirm("Clear the cart? This cannot be undone.")) {
      clearCart();
    }
  }

  return (
    <section>
      <h1 className="text-5xl font-bold">Cart</h1>
      <p className="mt-2 font-medium">
        {totalCount} {totalCount === 1 ? "item" : "items"}
      </p>

      {/* mobile: სია და ქვემოთ შეჯამება. lg-დან: სია | შეჯამება (22rem სიგანით) */}
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <div>
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              // setQuantity და removeItem პირდაპირ Context-იდან გადაეცემა callback props-ად
              <CartLine
                key={item.productId}
                item={item}
                onQuantityChange={setQuantity}
                onRemove={handleRemove}
              />
            ))}
          </ul>
          <button
            type="button"
            onClick={handleClear}
            className={`mt-6 min-h-11 rounded-lg px-3 font-bold underline underline-offset-4 hover:bg-red-200 ${focusRing}`}
          >
            Clear cart
          </button>
        </div>

        <aside className="rounded-2xl border-3 border-ink bg-white p-6 shadow-brutal">
          <h2 className="text-2xl font-bold">Summary</h2>
          {/* dl/dt/dd: სემანტიკური "სახელი → მნიშვნელობა" სია */}
          <dl className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            {savings > 0 && (
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd>−{formatPrice(savings)}</dd>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t-3 border-ink pt-3 text-xl font-bold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className={`mt-6 block w-full ${primaryButton}`}>
            Proceed to checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
