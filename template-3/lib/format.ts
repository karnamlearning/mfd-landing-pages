export function formatINR(value: number, fractionDigits = 0) {
  if (!Number.isFinite(value)) return "-";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Math.round(value));
}

export function formatCompactINR(value: number) {
  if (!Number.isFinite(value)) return "-";
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(2)} L`;
  }
  return formatINR(value);
}

export function formatDate(iso: string) {
  const date = new Date(iso);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/** Tight rupee shorthand for chips and inline labels: "₹25 L", "₹1.5 Cr". */
export function formatShortINR(value: number): string {
  if (!Number.isFinite(value)) return "-";
  const trim = (n: number) => String(Number(n.toFixed(2)));
  const abs = Math.abs(value);
  if (abs >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
  if (abs >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
  if (abs >= 1_000) return `₹${trim(value / 1_000)} K`;
  return `₹${Math.round(value)}`;
}
