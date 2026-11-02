import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import TextField from "../components/ui/TextField";
import { useAuth } from "../context/authContext";
import type { LoginFormValues } from "../types/users";
import { validateLogin, type LoginErrors } from "../utils/validation";

// location.state unknown-ია: ვამოწმებთ, რომ from ნამდვილად სტრიქონია (type guard)
function getRedirectPath(state: unknown): string {
  if (
    typeof state === "object" &&
    state !== null &&
    "from" in state &&
    typeof state.from === "string"
  ) {
    return state.from;
  }
  return "/"; // პირდაპირ /login-ზე მოსული კატალოგზე ბრუნდება
}

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectPath(location.state);

  // ფორმის ორივე ველი ერთ ობიექტში
  const [values, setValues] = useState<LoginFormValues>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ბრაუზერი გვერდს აღარ გადატვირთავს

    const newErrors = validateLogin(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // შეცდომაა → ვჩერდებით

    login(values.username);
    // replace: Back ღილაკი Login-ზე აღარ დაგვაბრუნებს
    navigate(redirectTo, { replace: true });
  }

  return (
    <section className="mx-auto max-w-md">
      <Link
        to="/"
        className={`inline-flex min-h-11 items-center rounded-lg font-bold hover:underline ${focusRing}`}
      >
        ← Back to catalog
      </Link>

      <div className="mt-6 rounded-2xl border-3 border-ink bg-white p-6 shadow-brutal sm:p-8">
        <h1 className="text-4xl font-bold">Log in</h1>
        {redirectTo === "/checkout" && (
          <p className="mt-2">Log in to continue to checkout.</p>
        )}

        {/* noValidate: ბრაუზერის ჩაშენებულ ბუშტებს ვთიშავთ, ჩვენი ვალიდაცია მუშაობს */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex flex-col gap-5"
        >
          <TextField
            id="username"
            label="Username"
            value={values.username}
            error={errors.username}
            autoComplete="username"
            onChange={(username) => {
              setValues({ ...values, username }); // immutable: ახალი ობიექტი, ერთი ველი შეცვლილი
              setErrors({ ...errors, username: undefined }); // აკრეფისას შეცდომა ქრება
            }}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            value={values.password}
            error={errors.password}
            autoComplete="current-password"
            onChange={(password) => {
              setValues({ ...values, password });
              setErrors({ ...errors, password: undefined });
            }}
          />
          {/* type="submit": დაჭერა ფორმის onSubmit-ს იწვევს (Enter-იც მუშაობს) */}
          <button
            type="submit"
            className={`mt-2 rounded-xl border-3 border-ink bg-punch py-3 text-lg font-bold shadow-brutal transition-all hover:bg-punch-dark active:translate-x-1.5 active:translate-y-1.5 active:shadow-none ${focusRing}`}
          >
            Log In
          </button>
        </form>
      </div>
    </section>
  );
}
