import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { getCategories, getProducts } from "../api/products";
import CatalogToolbar from "../components/catalog/CatalogToolbar";
import type { SortOption } from "../types/catalog";
import ProductGrid from "../components/product/ProductGrid";
import { useCart } from "../context/cartContext";
import { useToast } from "../context/toastContext";
import type { AsyncState } from "../types/api";
import type { Category, Product, ProductsResponse } from "../types/products";
import { PAGE_SIZE, parseCatalogParams } from "../utils/url";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/catalog/Pagination";

// შედეგი + რომელ მოთხოვნას ეკუთვნის
interface CatalogResult {
  key: string;
  state: AsyncState<ProductsResponse>;
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // პრიმიტივებად ვშლით: effect-ის dependency-ში ობიექტი ყოველ render-ზე "ახალი" იქნებოდა
  const { q, category, sort, page } = parseCatalogParams(searchParams);
  // ველი URL-ის "ნედლ" q-ს აჩვენებს (ჰარებით), მოთხოვნა კი დაყოვნებულს
  const searchText = searchParams.get("q") ?? "";
  const debouncedQ = useDebounce(q, 400);
  const requestKey = `${debouncedQ}|${category}|${sort}|${page}`;

  const [result, setResult] = useState<CatalogResult | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // კატეგორიები ერთხელ იტვირთება. შეცდომისას select-ში მხოლოდ "All categories" დარჩება
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
  const { addItem } = useCart();
  const { showToast } = useToast();

  // გამოთვლილი: თუ შედეგი სხვა მოთხოვნას ეკუთვნის, ახალი ჯერ იტვირთება
  const state: AsyncState<ProductsResponse> =
    result && result.key === requestKey ? result.state : { status: "loading" };

  useEffect(() => {
    const controller = new AbortController();

    getProducts({ q: debouncedQ, category, sort, page }, controller.signal)
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
  }, [debouncedQ, category, sort, page, requestKey]);

  // URL-ის რამდენიმე პარამეტრის ერთად შეცვლა. ცარიელი მნიშვნელობა = წაშალე URL-იდან
  function updateParams(changes: Record<string, string>, replace = false) {
    const next = new URLSearchParams(searchParams); // ასლი, არა მუტაცია
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    setSearchParams(next, { replace });
  }

  function handleSearchChange(text: string) {
    // PRD: ძებნა კატეგორიას შლის და პირველ გვერდზე ბრუნდება.
    // replace: ყოველი ასო ისტორიაში ახალ ჩანაწერს არ ქმნის
    updateParams({ q: text, category: "", page: "" }, true);
  }

  function handleCategoryChange(slug: string) {
    // PRD: კატეგორია ძებნას შლის და პირველ გვერდზე ბრუნდება
    updateParams({ category: slug, q: "", page: "" });
  }

  function handleSortChange(newSort: SortOption) {
    updateParams({ sort: newSort, page: "" });
  }

  function handlePageChange(newPage: number) {
    // ასლი: category, sort და q უცვლელი რჩება, იცვლება მხოლოდ page
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
    window.scrollTo(0, 0); // PRD: გვერდის ცვლილებისას ზემოთ
  }

  function handleAdd(product: Product) {
    const added = addItem(product, 1);
    showToast(added ? "Added to cart ✓" : "No more stock for this product");
  }

  return (
    <section>
      <h1 className="text-5xl font-bold sm:text-6xl">Catalog</h1>

      <CatalogToolbar
        category={category}
        sort={sort}
        categories={categories}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        searchText={searchText}
        onSearchChange={handleSearchChange}
      />

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
          <div className="mt-8">
            <p className="text-lg font-medium">No products found.</p>
            {/* ფილტრები მხოლოდ URL-შია, ამიტომ "/" ყველაფერს ასუფთავებს */}
            <Link
              to="/"
              className="mt-4 inline-flex min-h-11 items-center rounded-xl border-3 border-ink bg-paper px-5 font-bold shadow-brutal-sm transition-all hover:bg-sun active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 font-medium">
              Showing {state.data.skip + 1}–
              {state.data.skip + state.data.products.length} of{" "}
              {state.data.total}
            </p>
            <ProductGrid products={state.data.products} onAdd={handleAdd} />
            {/* PRD: გვერდების რაოდენობა = Math.ceil(total / limit). ერთ გვერდზე პაგინაცია არ ჩანს */}
            {Math.ceil(state.data.total / PAGE_SIZE) > 1 && (
              <Pagination
                page={page}
                totalPages={Math.ceil(state.data.total / PAGE_SIZE)}
                onChange={handlePageChange}
              />
            )}
          </>
        ))}
    </section>
  );
}
