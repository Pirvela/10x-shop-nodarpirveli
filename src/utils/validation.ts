import type { LoginFormValues } from "../types/users";

// შეცდომა მხოლოდ იმ ველს აქვს, რომელიც არავალიდურია. {} = შეცდომა არ არის
export type LoginErrors = Partial<Record<keyof LoginFormValues, string>>;

// სუფთა ფუნქცია: მნიშვნელობები შედის, შეცდომები გამოდის. ტექსტები ზუსტად PRD-დან (P1.2)
export function validateLogin(values: LoginFormValues): LoginErrors {
  const errors: LoginErrors = {};

  // trim: "   " (მხოლოდ ჰარები) ცარიელად ითვლება
  if (values.username.trim() === "") {
    errors.username = "Username is required";
  }

  // else if: ცარიელ პაროლზე მხოლოდ ერთი შეცდომა ჩანს და არა ორი
  if (values.password === "") {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
