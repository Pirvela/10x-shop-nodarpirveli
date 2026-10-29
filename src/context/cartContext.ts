import { createContext, useContext } from "react";
import type { CartItem } from "../types/carts";
import type { Product } from "../types/products";

// ყველაფერი, რასაც კალათა გარე სამყაროს სთავაზობს
export interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  addItem: (product: Product, qty: number) => boolean; // false = მარაგი არ კმარა
  setQuantity: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void; // Checkout-ში დაგვჭირდება
}

// null: Provider-ის გარეთ Context ცარიელია
export const CartContext = createContext<CartContextValue | null>(null);

// საკუთარი hook: ყველგან useContext(CartContext)-ის და null-ის შემოწმების ნაცვლად
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
