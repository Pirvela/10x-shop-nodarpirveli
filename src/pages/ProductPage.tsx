import { useParams } from "react-router";

export default function ProductPage() {
  // URL-იდან /products/:id → id (string | undefined)
  const { id } = useParams();
  return <h1 className="text-2xl font-bold">Product #{id}</h1>;
}
