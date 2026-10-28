import type { ProductsResponse } from "../types/products";

const BASE_URL = "https://dummyjson.com";

export async function getProducts(
  limit = 12,
  skip = 0,
): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);

  // fetch მხოლოდ ქსელის გათიშვაზე "ვარდება". 404/500 მისთვის ჩვეულებრივი პასუხია,
  // ამიტომ res.ok-ს თვითონ ვამოწმებთ და შეცდომას ვისვრით
  if (!res.ok) {
    throw new Error(`Failed to load products (HTTP ${res.status})`);
  }

  // res.json() აბრუნებს any-ს. "as" ეუბნება TS-ს, რა ფორმას ველით
  return (await res.json()) as ProductsResponse;
}
