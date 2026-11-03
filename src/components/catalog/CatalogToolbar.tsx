import type { SortOption } from "../../types/catalog";
import type { Category } from "../../types/products";
import { isSortOption, SORT_OPTIONS } from "../../utils/url";

interface CatalogToolbarProps {
  category: string;
  sort: SortOption;
  categories: Category[];
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: SortOption) => void;
  searchText: string;
  onSearchChange: (text: string) => void;
}

const selectClass =
  "mt-1 min-h-11 w-full rounded-xl border-3 border-ink bg-white px-3 font-medium outline-none transition-shadow focus:shadow-brutal-sm";

export default function CatalogToolbar({
  category,
  sort,
  categories,
  onCategoryChange,
  onSortChange,
  searchText,
  onSearchChange,
}: CatalogToolbarProps) {
  return (
    // mobile: ერთმანეთის ქვეშ, sm-დან: ერთ რიგში

    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
      {/* flex-1: ძებნა მთელ თავისუფალ სიგანეს იკავებს */}
      <div className="sm:flex-1">
        <label htmlFor="search" className="block font-bold">
          Search
        </label>
        <input
          id="search"
          type="search"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Try “phone”"
          className={selectClass}
        />
      </div>
      <div className="sm:w-56">
        <label htmlFor="category" className="block font-bold">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-56">
        <label htmlFor="sort" className="block font-bold">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => {
            const value = e.target.value;
            // type guard: ამ if-ის შიგნით TS value-ს SortOption-ად ცნობს
            if (isSortOption(value)) onSortChange(value);
          }}
          className={selectClass}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
