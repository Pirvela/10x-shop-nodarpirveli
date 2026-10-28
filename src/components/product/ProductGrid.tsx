import type { Product } from "../../types/products";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function ProductGrid({ products, onAdd }: ProductGridProps) {
  return (
    // mobile 1 სვეტი, tablet 2, desktop 4 (PRD P2.1)
    <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        // key ყოველთვის map-ის გარეთა ელემენტზე
        <li key={product.id} className="flex">
          <ProductCard product={product} onAdd={onAdd} />
        </li>
      ))}
    </ul>
  );
}
