interface StockBadgeProps {
  stock: number;
}

const base = "rounded-full border-2 border-ink px-2 py-0.5 text-xs font-bold";

export default function StockBadge({ stock }: StockBadgeProps) {
  // რიგი მნიშვნელოვანია: 0 ასევე ≤ 5-ია, ამიტომ ჯერ 0-ს ვამოწმებთ
  if (stock === 0)
    return <span className={`${base} bg-red-300`}>Out of stock</span>;
  if (stock <= 5)
    return <span className={`${base} bg-orange-300`}>Only {stock} left!</span>;
  return <span className={`${base} bg-white`}>In stock</span>;
}
