import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import TextField from "../components/ui/TextField";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import type { OrderSummary, ShippingInfo } from "../types/checkouts";
import { cartTotal } from "../utils/cart";
import { discountedPrice, formatPrice } from "../utils/formats";
import { validateShipping, type ShippingErrors } from "../utils/validation";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();

  // Full name წინასწარ username-ით ივსება (PRD P5.1)
  const [values, setValues] = useState<ShippingInfo>({
    fullName: user.username,
    email: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<ShippingErrors>({});
  const [order, setOrder] = useState<OrderSummary | null>(null); // null = ჯერ არ განთავსებულა
  const [isPlacing, setIsPlacing] = useState(false);

  // 1. პირველი შემოწმება: შეკვეთა უკვე განთავსდა → დადასტურება
  // (კალათა უკვე ცარიელია, ამიტომ ეს ქვემოთა შემოწმებამდე უნდა იყოს)
  if (order) {
    return (
      <section className="mx-auto max-w-2xl">
        <div
          role="status"
          className="rounded-2xl border-3 border-ink bg-lime p-6 shadow-brutal sm:p-8"
        >
          <h1 className="text-4xl font-bold sm:text-5xl">Thank you!</h1>
          <p className="mt-2 text-lg">Your order has been placed.</p>
        </div>

        <div className="mt-8 rounded-2xl border-3 border-ink bg-paper p-6 shadow-brutal">
          <h2 className="text-2xl font-bold">Order summary</h2>
          <p className="mt-3">
            Shipping to{" "}
            <span className="font-bold">{order.shipping.fullName}</span>,{" "}
            {order.shipping.address}, {order.shipping.city}
          </p>
          <p className="text-sm">Email: {order.shipping.email}</p>

          <ul className="mt-4 flex flex-col gap-3">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4">
                <span className="min-w-0">
                  {item.title}{" "}
                  <span className="font-bold">× {item.quantity}</span>
                </span>
                <span className="shrink-0">
                  {formatPrice(
                    discountedPrice(item.price, item.discountPercentage) *
                      item.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t-3 border-ink pt-3 text-xl font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <Link
          to="/"
          className={`mt-8 inline-block rounded-xl border-3 border-ink bg-punch px-6 py-3 text-lg font-bold shadow-brutal transition-all hover:bg-punch-dark active:translate-x-1.5 active:translate-y-1.5 active:shadow-none ${focusRing}`}
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  // ჰუკების შემდეგ: ცარიელი კალათით Checkout-ს აზრი არ აქვს
  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const total = cartTotal(items);

  // ერთი ფუნქცია ოთხივე ველისთვის. field მხოლოდ ShippingInfo-ს ველის სახელი შეიძლება იყოს
  function updateField(field: keyof ShippingInfo, value: string) {
    setValues({ ...values, [field]: value }); // [field]: ველის სახელი ცვლადიდან

    // აკრეფისას ამ ველის შეცდომა ქრება. ასლს ვქმნით და მას ვცვლით (immutable)
    const nextErrors = { ...errors };
    delete nextErrors[field];
    setErrors(nextErrors);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = validateShipping(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsPlacing(true); // ღილაკი ითიშება: ორმაგი დაჭერა ორ შეკვეთას არ შექმნის

    // სიმულაცია: ნამდვილ აპში აქ სერვერზე მოთხოვნა წავიდოდა
    window.setTimeout(() => {
      // items-ის ძველი მასივი შეკვეთაში რჩება, რადგან clearCart ახალ [] მასივს ქმნის (immutable)
      setOrder({ items, shipping: values, total });
      clearCart(); // badge და კალათა მაშინვე განახლდება
    }, 800);
  }

  return (
    <section>
      <h1 className="text-5xl font-bold">Checkout</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border-3 border-ink bg-paper p-6 shadow-brutal sm:p-8"
        >
          <h2 className="text-2xl font-bold">Shipping details</h2>
          <TextField
            id="fullName"
            label="Full name"
            value={values.fullName}
            error={errors.fullName}
            autoComplete="name"
            onChange={(value) => updateField("fullName", value)}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            autoComplete="email"
            onChange={(value) => updateField("email", value)}
          />
          <TextField
            id="address"
            label="Address"
            value={values.address}
            error={errors.address}
            autoComplete="street-address"
            onChange={(value) => updateField("address", value)}
          />
          <TextField
            id="city"
            label="City"
            value={values.city}
            error={errors.city}
            autoComplete="address-level2"
            onChange={(value) => updateField("city", value)}
          />
          <button
            type="submit"
            disabled={isPlacing}
            // enabled: hover/active მხოლოდ მაშინ მუშაობს, როცა ღილაკი ჩართულია
            className={`mt-2 rounded-xl border-3 border-ink bg-punch py-3 text-lg font-bold shadow-brutal transition-all enabled:hover:bg-punch-dark enabled:active:translate-x-1.5 enabled:active:translate-y-1.5 enabled:active:shadow-none disabled:cursor-wait disabled:bg-gray-300 disabled:shadow-none ${focusRing}`}
          >
            {isPlacing ? "Placing order…" : "Place order"}
          </button>
        </form>

        <aside className="rounded-2xl border-3 border-ink bg-paper p-6 shadow-brutal">
          <h2 className="text-2xl font-bold">Order summary</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4">
                <span className="min-w-0">
                  {item.title}{" "}
                  <span className="font-bold">× {item.quantity}</span>
                </span>
                <span className="shrink-0">
                  {formatPrice(
                    discountedPrice(item.price, item.discountPercentage) *
                      item.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t-3 border-ink pt-3 text-xl font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
