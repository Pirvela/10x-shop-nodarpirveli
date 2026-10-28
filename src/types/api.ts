// ასინქრონული მონაცემის ერთადერთი ფორმა: state ყოველთვის ზუსტად ერთ მდგომარეობაშია.
// T არის generic: "რა ტიპის data მოდის წარმატებისას" (მაგ. ProductsResponse)
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string };
