import { Link, NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/authContext";
import { useTheme } from "../../hooks/useTheme";
import Container from "../ui/Container";
import { useCart } from "../../context/cartContext";

// NavLink თვითონ გვეუბნება, აქტიურია თუ არა ბმული (isActive)
function navLinkClass({ isActive }: { isActive: boolean }): string {
  // border-2 ყოველთვის არის (transparent), რომ hover-ზე ზომა არ "გადახტეს"
  const base =
    "inline-flex min-h-11 items-center rounded-lg border-2 px-3 font-medium transition-colors hover:border-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
  return isActive ? `${base} border-ink bg-sun` : `${base} border-transparent`;
}

export default function Header() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/"); // PRD P0.3: Logout → კატალოგი
  }
  return (
    <header className="border-b-4 border-ink bg-paper">
      <Container>
        {/* flex-wrap: ვიწრო ეკრანზე ბმულები მეორე რიგში გადადის, ჰორიზონტალური scroll არ ჩნდება */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
          <Link to="/" className="text-2xl font-bold uppercase tracking-tight">
            10X Shop
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
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
            {user.isLoggedIn ? (
              // გამყოფი ხაზი მხოლოდ sm-დან: მობილურზე ზონა ახალ რიგში გადადის და ხაზი ზედმეტია
              <div className="flex items-center gap-2 sm:ml-2 sm:border-l-3 sm:border-ink sm:pl-4">
                <span className="text-sm">
                  Hi, <span className="font-bold">{user.username}</span>
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-lg border-2 border-ink bg-paper px-4 text-sm font-bold shadow-brutal-sm transition-all hover:bg-sun active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  Log out
                </button>
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Log in
              </NavLink>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className="ml-1 inline-flex size-11 items-center justify-center rounded-lg border-2 border-ink bg-paper text-xl shadow-brutal-sm transition-all hover:bg-sun active:translate-x-0.5 active:translate-y-0.5 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink dark:bg-punch dark:text-neutral-950"
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </nav>
        </div>
      </Container>
    </header>
  );
}
