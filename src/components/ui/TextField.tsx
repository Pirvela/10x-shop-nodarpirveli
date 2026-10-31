interface TextFieldProps {
  id: string;
  label: string;
  type?: "text" | "password" | "email"; // literal union: მხოლოდ ეს სამი
  value: string;
  error?: string;
  autoComplete?: string;
  onChange: (value: string) => void; // callback prop: მშობელი ინახავს მნიშვნელობას
}

export default function TextField({
  id,
  label,
  type = "text",
  value,
  error,
  autoComplete,
  onChange,
}: TextFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="block font-bold">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value} // controlled: მნიშვნელობა მშობლის state-იდან მოდის
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)} // მშობელს მხოლოდ ტექსტს ვაწვდით
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        // focus: ჩრდილი ჩნდება (ჩვენი brutal სტილი). შეცდომისას ჩარჩო წითლდება
        className={`mt-1 w-full rounded-xl border-3 bg-white px-4 py-3 text-lg outline-none transition-shadow focus:shadow-brutal-sm ${
          error ? "border-red-600" : "border-ink"
        }`}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm font-bold text-red-700">
          npm run typecheck
          {error}
        </p>
      )}
    </div>
  );
}
