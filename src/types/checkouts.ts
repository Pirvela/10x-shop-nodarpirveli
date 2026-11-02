import type { CartItem } from "./carts";

// Checkout ფორმის ოთხი სავალდებულო ველი (CORE)
export interface ShippingInfo {
  fullName: string;
  email: string;
  address: string;
  city: string;
}

// შეკვეთის ლოკალური შეჯამება: სერვერზე არ იგზავნება
export interface OrderSummary {
  items: CartItem[];
  shipping: ShippingInfo;
  total: number;
}
