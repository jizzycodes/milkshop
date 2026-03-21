/**
 * Local `YYYY-MM-DDTHH:mm` for <input type="datetime-local" min="…" /> (no past times in the picker).
 */
export function localDatetimeLocalFloor() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
