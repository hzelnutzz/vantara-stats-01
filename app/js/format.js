/**
 * Small number formatters shared by the table renderers and page controls.
 * Keeping them here prevents six pages from inventing six rounding rules.
 */

const integer = new Intl.NumberFormat('en-US');

/** A whole number with thousands separators, e.g. 34200 -> "34,200". */
export function formatInt(value) {
  return integer.format(Math.round(value));
}

/** An indicator value: whole numbers stay whole, everything else shows one decimal. */
export function formatValue(value) {
  return Number.isInteger(value) ? formatInt(value) : value.toFixed(1);
}

/** A signed change with a typographic minus, e.g. 0.5 -> "+0.5", -13 -> "−13". */
export function formatChange(value) {
  const digits = Number.isInteger(value) ? 0 : 1;
  if (Math.abs(value) < 0.05) return (0).toFixed(digits);
  const sign = value > 0 ? '+' : '−';
  return `${sign}${Math.abs(value).toFixed(digits)}`;
}

/** A signed percentage, e.g. 2.8 -> "+2.8%". */
export function formatSignedPercent(value, digits = 1) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '±';
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
}
