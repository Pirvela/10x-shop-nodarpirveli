// კალათის ერთი ხაზი: პროდუქტის ასლი რაოდენობით.
// მთლიან Product-ს არ ვინახავთ, მხოლოდ კალათისთვის საჭირო ველებს.
export interface CartItem {
  productId: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  stock: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}
