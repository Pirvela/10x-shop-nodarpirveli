import { useEffect } from "react";
import { useLocation } from "react-router";

// მარშრუტის ცვლილებისას გვერდი ზემოდან იწყება
export default function ScrollToTop() {
  const { pathname } = useLocation();

  // effect ეშვება ყოველ ჯერზე, როცა pathname იცვლება (dependency array)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // არაფერს ხატავს, მხოლოდ ქცევას ამატებს
}
