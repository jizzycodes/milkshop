export function formatLeadShortId(id) {
  if (!id || !String(id).trim()) return "—"
  return String(id).replace(/-/g, "").slice(0, 8).toUpperCase()
}
