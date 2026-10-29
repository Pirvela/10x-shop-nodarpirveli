import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProductById } from "../api/products";
import ProductDetails from "../components/product/ProductDetails";
import type { AsyncState } from "../types/api";
import type { Product } from "../types/products";
import NotFoundPage from "./NotFoundPage";

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);
  // "abc" → NaN, "1.5" → არამთელი, "-3" → უარყოფითი: სამივე არავალიდურია
  const isValidId = Number.isInteger(productId) && productId > 0;

  // data: Product | null. null ნიშნავს "API-მ 404 დააბრუნა"
  const [state, setState] = useState<AsyncState<Product | null>>({
    status: "loading",
  });

  // ჰუკები ყოველთვის ზემოთ, ნებისმიერ return-მდე
  useEffect(() => {
    if (!isValidId) return; // არავალიდურ id-ზე რექვესთს საერთოდ არ ვაგზავნით

    let ignore = false;

    getProductById(productId)
      .then((product) => {
        if (!ignore) setState({ status: "success", data: product });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        const message =
          error instanceof Error ? error.message : "Something went wrong.";
        setState({ status: "error", message });
      });

    return () => {
      ignore = true;
    };
  }, [productId, isValidId]); // id შეიცვალა → ახალი რექვესთი

  if (!isValidId) return <NotFoundPage />;

  if (state.status === "loading" || state.status === "idle") {
    return (
      <p role="status" className="text-lg font-medium">
        Loading product…
      </p>
    );
  }

  if (state.status === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border-3 border-ink bg-red-300 p-6 shadow-brutal"
      >
        <p className="text-lg font-bold">Could not load this product.</p>
        <p className="mt-1">{state.message}</p>
      </div>
    );
  }

  if (state.data === null) return <NotFoundPage />;

  // key: სხვა პროდუქტზე გადასვლისას ProductDetails თავიდან იქმნება და მისი state ნულდება
  return <ProductDetails key={state.data.id} product={state.data} />;
}
