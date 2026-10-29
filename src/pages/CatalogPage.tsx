import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { useCart } from "../context/cartContext";
import ProductGrid from "../components/product/ProductGrid";
import type { AsyncState } from "../types/api";
import type { Product, ProductsResponse } from "../types/products";

export default function CatalogPage() {
  // საწყისი მდგომარეობა "loading": გვერდი გახსნისთანავე იტვირთება
  const [state, setState] = useState<AsyncState<ProductsResponse>>({
    status: "loading",
  });
  const { addItem } = useCart();
  useEffect(() => {
    let ignore = false; // cleanup-ის დროშა

    getProducts()
      .then((data) => {
        if (!ignore) setState({ status: "success", data });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        // catch-ში error unknown-ია: ჯერ ვამოწმებთ, ნამდვილად Error არის თუ არა
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        setState({ status: "error", message });
      });

    return () => {
      ignore = true; // გვერდიდან წასვლისას ძველი პასუხი state-ს აღარ შეცვლის
    };
  }, []); // [] = ერთხელ, გვერდის გახსნისას

  // დროებით: ხვალ CartContext-ის addItem-ით ჩავანაცვლებთ
  function handleAdd(product: Product) {
    addItem(product, 1);
  }

  return (
    <section>
      <h1 className="text-5xl font-bold sm:text-6xl">Catalog</h1>

      {state.status === "loading" && (
        <p role="status" className="mt-8 text-lg font-medium">
          Loading products…
        </p>
      )}

      {state.status === "error" && (
        <div
          role="alert"
          className="mt-8 rounded-2xl border-3 border-ink bg-red-300 p-6 shadow-brutal"
        >
          <p className="text-lg font-bold">Could not load products.</p>
          <p className="mt-1">{state.message}</p>
        </div>
      )}

      {/* აქ TS უკვე იცის, რომ state.data არსებობს (narrowing) */}
      {state.status === "success" &&
        (state.data.products.length === 0 ? (
          <p className="mt-8 text-lg font-medium">No products found.</p>
        ) : (
          <>
            <p className="mt-2 font-medium">
              Showing {state.data.skip + 1}–
              {state.data.skip + state.data.products.length} of{" "}
              {state.data.total}
            </p>
            <ProductGrid products={state.data.products} onAdd={handleAdd} />
          </>
        ))}
    </section>
  );
}
