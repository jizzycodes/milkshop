const pad2 = (n) => String(n).padStart(2, "0");

/**
 * Local `YYYY-MM-DDTHH:mm` for <input type="datetime-local" min="…" /> (no past times in the picker).
 */
export function localDatetimeLocalFloor() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Format a Date as local `YYYY-MM-DDTHH:mm` for `datetime-local` inputs. */
export function formatDateToDatetimeLocal(d) {
  if (!d || Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/**
 * Parse a `datetime-local` value as **local** calendar date/time (not UTC).
 * Returns `null` if the string is missing or invalid.
 */
export function parseDatetimeLocal(str) {
  if (!str || typeof str !== "string") return null;
  const m = str.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const da = Number(m[3]);
  const h = Number(m[4]);
  const mi = Number(m[5]);
  const d = new Date(y, mo - 1, da, h, mi, 0, 0);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Clamp a `datetime-local` string to be no earlier than `minStr` (lexicographic compare works for this format).
 */
export function clampDatetimeLocalMin(valueStr, minStr) {
  if (!valueStr || valueStr < minStr) return minStr;
  return valueStr;
}
