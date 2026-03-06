import { format } from "date-fns"

export function formatDateTime(value) {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return format(d, "MMM dd, yyyy – hh:mm a")
}

