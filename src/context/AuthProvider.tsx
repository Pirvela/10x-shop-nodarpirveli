import { useState, type ReactNode } from "react";
import type { AuthUser } from "../types/users";
import { AuthContext } from "./authContext";

// "სტუმარი": საწყისი მდგომარეობა და ის, რაც logout-ის შემდეგ ბრუნდება
const GUEST: AuthUser = { username: "", isLoggedIn: false };

interface AuthProviderProps {
  children: ReactNode;
}

// სასწავლო Login: მხოლოდ React state. სერვერი და პაროლის შენახვა არ არის
export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser>(GUEST);

  function login(username: string) {
    // ახალი ობიექტი (immutable), trim: ზედმეტი ჰარები ბოლოებში
    setUser({ username: username.trim(), isLoggedIn: true });
  }

  function logout() {
    setUser(GUEST); // კალათას არ ვეხებით (PRD P0.3)
  }

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
}
