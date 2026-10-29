import type { Product, ProductsResponse } from "../types/products";

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

// 404-ზე null-ს ვაბრუნებთ: "პროდუქტი არ არსებობს" ნორმალური პასუხია და არა ქსელის შეცდომა
export async function getProductById(id: number): Promise<Product | null> {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to load product (HTTP ${res.status})`);
  }

  return (await res.json()) as Product;
}
