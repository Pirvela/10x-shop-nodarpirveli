import { useState, type FormEvent } from "react";
import { Navigate } from "react-router";
import TextField from "../components/ui/TextField";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import type { ShippingInfo } from "../types/checkouts";
import { cartTotal } from "../utils/cart";
import { discountedPrice, formatPrice } from "../utils/formats";
import { validateShipping, type ShippingErrors } from "../utils/validation";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items } = useCart();

  // Full name წინასწარ username-ით ივსება (PRD P5.1)
  const [values, setValues] = useState<ShippingInfo>({
    fullName: user.username,
    email: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<ShippingErrors>({});

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

    // ნაბიჯი 3: აქ შეკვეთა განთავსდება
  }

  return (
    <section>
      <h1 className="text-5xl font-bold">Checkout</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5 rounded-2xl border-3 border-ink bg-white p-6 shadow-brutal sm:p-8"
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
            className={`mt-2 rounded-xl border-3 border-ink bg-punch py-3 text-lg font-bold shadow-brutal transition-all hover:bg-punch-dark active:translate-x-1.5 active:translate-y-1.5 active:shadow-none ${focusRing}`}
          >
            Place order
          </button>
        </form>

        <aside className="rounded-2xl border-3 border-ink bg-white p-6 shadow-brutal">
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
