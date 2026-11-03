import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { getProducts } from "../api/products";
import ProductGrid from "../components/product/ProductGrid";
import { useCart } from "../context/cartContext";
import { useToast } from "../context/toastContext";
import type { AsyncState } from "../types/api";
import type { Product, ProductsResponse } from "../types/products";
import { parseCatalogParams } from "../utils/url";

// შედეგი + რომელ მოთხოვნას ეკუთვნის
interface CatalogResult {
  key: string;
  state: AsyncState<ProductsResponse>;
}

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  // პრიმიტივებად ვშლით: effect-ის dependency-ში ობიექტი ყოველ render-ზე "ახალი" იქნებოდა
  const { q, category, sort, page } = parseCatalogParams(searchParams);
  const requestKey = `${q}|${category}|${sort}|${page}`;

  const [result, setResult] = useState<CatalogResult | null>(null);
  const { addItem } = useCart();
  const { showToast } = useToast();

  // გამოთვლილი: თუ შედეგი სხვა მოთხოვნას ეკუთვნის, ახალი ჯერ იტვირთება
  const state: AsyncState<ProductsResponse> =
    result && result.key === requestKey ? result.state : { status: "loading" };

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ q, category, sort, page }, controller.signal)
      .then((data) =>
        setResult({ key: requestKey, state: { status: "success", data } }),
      )
      .catch((error: unknown) => {
        if (controller.signal.aborted) return; // ჩვენ თვითონ გავაუქმეთ, ეს შეცდომა არ არის
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        setResult({ key: requestKey, state: { status: "error", message } });
      });

    // პარამეტრი შეიცვალა ან გვერდიდან წავედით → ძველი მოთხოვნა უქმდება
    return () => controller.abort();
  }, [q, category, sort, page, requestKey]);

  function handleAdd(product: Product) {
    const added = addItem(product, 1);
    showToast(added ? "Added to cart ✓" : "No more stock for this product");
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
