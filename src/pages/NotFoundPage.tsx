import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-5xl font-bold">Page not found</h1>
      <p className="mt-3 text-lg">
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-xl border-3 border-ink bg-punch px-6 py-3 text-lg font-bold shadow-brutal transition-all hover:bg-punch-dark active:translate-x-1.5 active:translate-y-1.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        Go to catalog
      </Link>
    </div>
  );
}
