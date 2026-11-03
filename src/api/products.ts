import type { Product, ProductsResponse } from "../types/products";
import type { CatalogParams } from "../types/catalog";
import { buildProductsUrl } from "../utils/url";

const BASE_URL = "https://dummyjson.com";

// signal: AbortController-ისგან. abort() ამ მოთხოვნას გააუქმებს
export async function getProducts(
  params: CatalogParams,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const res = await fetch(BASE_URL + buildProductsUrl(params), { signal });

  if (!res.ok) {
    throw new Error(`Failed to load products (HTTP ${res.status})`);
  }

  return (await res.json()) as ProductsResponse;
}

// 404-ზე null-ს ვაბრუნებთ: "პროდუქტი არ არსებობს" ნორმალური პასუხია და არა ქსელის შეცდომა
export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to load product (HTTP ${res.status})`);
  }

  return (await res.json()) as Product;
}
