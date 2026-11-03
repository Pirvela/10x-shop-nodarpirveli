import { lazy } from "react";
import { Routes, Route } from "react-router";
import Layout from "../components/layout/Layout";

import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute";
// თითო გვერდი ცალკე chunk-ია და მხოლოდ იქ გადასვლისას იტვირთება
const CatalogPage = lazy(() => import("../pages/CatalogPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));

export default function AppRoutes() {
  return (
    <Routes>
      {/* Layout მარშრუტს path არ აქვს: ის მხოლოდ ჩარჩოა ყველა შიდა გვერდისთვის */}
      <Route element={<Layout />}>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        {/* * = ყველაფერი, რაც ზემოთ არ დაემთხვა */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
