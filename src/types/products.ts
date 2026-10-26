// ერთი პროდუქტი, ზუსტად ისე, როგორც DummyJSON აბრუნებს
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  brand?: string; // ზოგ პროდუქტს ბრენდი არ აქვს, ამიტომ არასავალდებულოა
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

// GET /products-ის პასუხი: პროდუქტების სია და პაგინაციის ინფორმაცია
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
