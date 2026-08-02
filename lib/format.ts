export function formatRent(rent: number): string {
  return `৳${rent.toLocaleString("en-US")}`;
}

export function formatDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
