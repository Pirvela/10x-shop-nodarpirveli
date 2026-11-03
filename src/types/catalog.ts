// სორტის ვარიანტები, PRD P2.6. '' = Default (სორტის გარეშე)
export type SortOption =
  | ""
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "title-asc";

// კატალოგის ყველა პარამეტრი, რომელიც URL-ში ცხოვრობს
export interface CatalogParams {
  q: string;
  category: string;
  sort: SortOption;
  page: number;
}
