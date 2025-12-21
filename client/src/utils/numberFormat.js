// client/src/utils/numberFormat.js
export function formatCurrency(value, currency = "USD", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatCompact(value, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(value);
}
