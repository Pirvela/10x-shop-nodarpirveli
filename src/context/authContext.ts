import { createContext, useContext } from "react";
import type { AuthUser } from "../types/users";

// ყველაფერი, რასაც Auth გარე სამყაროს სთავაზობს
export interface AuthContextValue {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
}

// null: Provider-ის გარეთ Context ცარიელია
export const AuthContext = createContext<AuthContextValue | null>(null);

// საკუთარი hook, ზუსტად ისე, როგორც useCart
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
