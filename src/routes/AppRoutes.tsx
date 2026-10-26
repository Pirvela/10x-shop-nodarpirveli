import { Routes, Route } from "react-router";
import Layout from "../components/layout/Layout";
import CatalogPage from "../pages/CatalogPage";
import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout მარშრუტს path არ აქვს: ის მხოლოდ ჩარჩოა ყველა შიდა გვერდისთვის */}
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        {/* * = ყველაფერი, რაც ზემოთ არ დაემთხვა */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
