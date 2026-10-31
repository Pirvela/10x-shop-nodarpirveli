import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

// სასწავლო redirect: სტუმარი /login-ზე მიდის და თან მიაქვს, საიდან მოვიდა
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user.isLoggedIn) {
    // replace: Back-ზე /checkout ↔ /login-ის წრე არ შეიქმნება
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
