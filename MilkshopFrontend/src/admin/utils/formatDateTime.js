import { format } from "date-fns"

export function formatDateTime(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return format(d, "MMM dd, yyyy – hh:mm a")
}

/** ISO / DB datetimes from forms → same as formatDateTime; plain text (e.g. "Morning") unchanged */
export function formatBestContactPref(value) {
  if (value == null || value === "") return ""
  const s = String(value).trim()
  if (!/^\d{4}-\d{2}-\d{2}/.test(s)) return s
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return formatDateTime(s)
}

