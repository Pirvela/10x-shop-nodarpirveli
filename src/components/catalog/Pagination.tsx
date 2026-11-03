interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

type PageItem = number | "ellipsis";

// სუფთა ფუნქცია: პირველი, ბოლო, მიმდინარე ±1. ხვრელებში "…"
function getPageItems(page: number, totalPages: number): PageItem[] {
  // 7 გვერდამდე ყველას ვაჩვენებთ
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Set: დუბლიკატები თავისით ქრება (მაგ. page=1-ზე page-1 და 1 ემთხვევა)
  const pages = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  pages.forEach((p, index) => {
    // წინასთან ერთზე მეტი სხვაობა → გამოტოვებული გვერდებია → "…"
    if (index > 0 && p - pages[index - 1] > 1) items.push("ellipsis");
    items.push(p);
  });
  return items;
}

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink";
const baseButton = `inline-flex size-11 items-center justify-center rounded-lg border-3 border-ink font-bold transition-all ${focusRing}`;

export default function Pagination({
  page,
  totalPages,
  onChange,
}: PaginationProps) {
  const items = getPageItems(page, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-12">
      {/* flex-wrap: 375px-ზე ღილაკები საჭიროებისას მეორე რიგში გადადის */}
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          <button
            type="button"
            onClick={() => onChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
            className={`${baseButton} bg-white enabled:hover:bg-sun disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ‹
          </button>
        </li>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            // "…" შეიძლება ორჯერ იყოს, ამიტომ key-ში index-იც ვრთავთ
            <li
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 font-bold"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                // aria-current: ეკრანის წამკითხველი იტყვის "current page"
                aria-current={item === page ? "page" : undefined}
                className={`${baseButton} ${item === page ? "bg-punch shadow-brutal-sm" : "bg-white hover:bg-sun"}`}
              >
                {item}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            onClick={() => onChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
            className={`${baseButton} bg-white enabled:hover:bg-sun disabled:cursor-not-allowed disabled:opacity-40`}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
