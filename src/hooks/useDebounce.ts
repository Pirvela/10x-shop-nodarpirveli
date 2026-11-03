import { useEffect, useState } from "react";

// აბრუნებს value-ს, ოღონდ delay მილიწამით დაგვიანებით.
// value თუ ამ დროში ისევ შეიცვალა, ტაიმერი თავიდან იწყება.
// T: generic. იმუშავებს ნებისმიერ ტიპზე (string, number, ობიექტი...)
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);

    // value შეიცვალა delay-მდე → ძველი ტაიმერი უქმდება
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
