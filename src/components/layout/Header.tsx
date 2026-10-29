import { Link, NavLink } from "react-router";
import Container from "../ui/Container";
import { useCart } from "../../context/cartContext";

// NavLink თვითონ გვეუბნება, აქტიურია თუ არა ბმული (isActive)
function navLinkClass({ isActive }: { isActive: boolean }): string {
  // border-2 ყოველთვის არის (transparent), რომ hover-ზე ზომა არ "გადახტეს"
  const base =
    "rounded-lg border-2 px-3 py-1.5 font-medium transition-colors hover:border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
  return isActive ? `${base} border-ink bg-sun` : `${base} border-transparent`;
}

export default function Header() {
  const { totalCount } = useCart();
  return (
    <header className="border-b-4 border-ink bg-white">
      <Container>
        {/* flex-wrap: ვიწრო ეკრანზე ბმულები მეორე რიგში გადადის, ჰორიზონტალური scroll არ ჩნდება */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
          <Link to="/" className="text-2xl font-bold uppercase tracking-tight">
            10X Shop
          </Link>
          <nav className="flex flex-wrap gap-1">
            {/* end: აქტიურია მხოლოდ ზუსტად "/"-ზე */}
            <NavLink to="/" end className={navLinkClass}>
              Catalog
            </NavLink>
            <NavLink to="/cart" className={navLinkClass}>
              Cart
              {/* > 0 და არა უბრალოდ totalCount &&, თორემ ცარიელ კალათაზე "0" დაიხატება */}
              {totalCount > 0 && (
                <span className="ml-1.5 inline-block min-w-6 rounded-full border-2 border-ink bg-punch px-1.5 text-center text-sm font-bold">
                  {totalCount}
                </span>
              )}
            </NavLink>
            <NavLink to="/login" className={navLinkClass}>
              Log in
            </NavLink>
          </nav>
        </div>
      </Container>
    </header>
  );
}
