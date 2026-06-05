export function getLeadScheduleAt(lead) {
  return lead?.next_followup_at || lead?.best_contact_at || null
}

export function isLeadActive(lead) {
  const ts = getLeadScheduleAt(lead)
  if (!ts) return false
  return new Date(ts).getTime() <= Date.now()
}

export function isLeadInactive(lead) {
  const ts = getLeadScheduleAt(lead)
  if (!ts) return true
  return new Date(ts).getTime() > Date.now()
}

export function countActiveInactive(leads) {
  let active = 0
  let inactive = 0
  for (const lead of leads) {
    if (isLeadActive(lead)) active += 1
    else inactive += 1
  }
  return { active, inactive, total: leads.length }
}

export function tabsWithCounts(tabs, countByValue) {
  return tabs.map((tab) => ({
    ...tab,
    label: `${tab.label} (${countByValue[tab.value] ?? 0})`,
  }))
}

export function filterRegisterLeads(leads, subStatus) {
  return leads
    .filter((l) => l.status !== "ARCHIVED" && l.status !== "DROPPED")
    .filter((lead) => {
      const ts = getLeadScheduleAt(lead)
      if (!ts) return subStatus === "inactive"
      const d = new Date(ts)
      return subStatus === "active"
        ? d.getTime() <= Date.now()
        : d.getTime() > Date.now()
    })
}

export function filterActivityLeads(leads, subStatus) {
  return leads.filter((lead) => {
    const ts = getLeadScheduleAt(lead)
    if (!ts) return subStatus === "inactive"
    const d = new Date(ts)
    return subStatus === "active"
      ? d.getTime() <= Date.now()
      : d.getTime() > Date.now()
  })
}

export function filterOrientationLeads(leads, subStatus) {
  return leads
    .filter((l) => l.status !== "DROPPED" && l.status !== "ARCHIVED" && l.status !== "APPROVED")
    .filter((lead) => {
      if (lead.status === "INACTIVE" && subStatus !== "reschedule") return false
      if (subStatus === "reschedule") return lead.status === "INACTIVE"
      const ts = getLeadScheduleAt(lead)
      if (!ts) return false
      const now = new Date()
      const d = new Date(ts)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)
      if (subStatus === "remind") return diffDays === 1
      if (subStatus === "attendance") return diffHours >= 1
      if (subStatus === "confirmed") return d.getTime() > now.getTime() && diffDays !== 1
      return true
    })
}
