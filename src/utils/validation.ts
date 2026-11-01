import type { LoginFormValues } from "../types/users";
import type { ShippingInfo } from "../types/checkouts";

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

export type ShippingErrors = Partial<Record<keyof ShippingInfo, string>>;

// მარტივი ფორმატი: რაღაც@რაღაც.რაღაც, ჰარების გარეშე
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Checkout-ის ოთხი სავალდებულო ველი. ტექსტები ზუსტად PRD-დან (P5.2)
export function validateShipping(values: ShippingInfo): ShippingErrors {
  const errors: ShippingErrors = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters";
  }

  // test() აბრუნებს true-ს, თუ სტრიქონი შაბლონს ემთხვევა
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (values.address.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }

  if (values.city.trim() === "") {
    errors.city = "City is required";
  }

  return errors;
}
