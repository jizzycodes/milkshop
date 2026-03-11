import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import StatusTabs from "../components/StatusTabs"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

const ORIENTATION_TABS = [
  { value: "reschedule", label: "Reschedule" },
  { value: "confirmed", label: "Confirmed" },
  { value: "remind", label: "Remind" },
  { value: "attendance", label: "Attendance" },
]

export default function Orientation({ initialSubStatus }) {
  const { token } = useAdminAuth()
  const [subStatus, setSubStatus] = useState(initialSubStatus || "reschedule")
  const [selectedLead, setSelectedLead] = useState(null)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [success, setSuccess] = useState("")

  const showContactColumn = subStatus !== "confirmed"

  const baseColumns = [
    { key: "name", label: "Lead Name" },
    { key: "orientationSchedule", label: "Orientation Schedule" },
  ]

  const columns = [
    ...baseColumns,
    ...(showContactColumn ? [{ key: "contactRecord", label: "Contact Record" }] : []),
    { key: "view", label: "Action" },
  ]

  const remindOptions = [
    "Remind Successfully",
    "No response",
    "Callback",
    "Cancel",
    "Archive",
    "Drop",
  ]

  const attendanceOptions = ["Present", "Absent"]
  const defaultOptions = ["No response", "Callback", "Confirmed Schedule", "Archive", "Drop"]

  const currentOptions =
    subStatus === "remind"
      ? remindOptions
      : subStatus === "attendance"
      ? attendanceOptions
      : defaultOptions

  useEffect(() => {
    if (!initialSubStatus) return
    const allowedValues = ORIENTATION_TABS.map((t) => t.value)
    if (allowedValues.includes(initialSubStatus)) {
      setSubStatus(initialSubStatus)
    }
  }, [initialSubStatus])

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "orientation", page: 1, pageSize: 50 })
      .then((res) => {
        if (!cancelled) setLeads(res.data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load orientation")
        setLeads([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes }) => {
    if (!token || !selectedLead) return

    const outcomeMap = {
      "No response": "NO_ANSWER",
      "Present": "PRESENT",
      "Absent": "ABSENT",
    }

    const outcome = outcomeMap[contactRecord] || null

    await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || `Contact record: ${contactRecord}`,
      outcome,
      nextFollowupAt: nextContactAt || null,
    })

    if (contactRecord === "Archive") {
      await updateLead(token, selectedLead.id, { status: "ARCHIVED" })
    } else if (contactRecord === "Drop") {
      await updateLead(token, selectedLead.id, { status: "DROPPED" })
    } else if (subStatus === "attendance" && contactRecord === "Present") {
      await updateLead(token, selectedLead.id, {
        status: "APPROVED",
        next_followup_at: nextContactAt || null,
      })
    } else if (subStatus === "attendance" && contactRecord === "Absent") {
      await updateLead(token, selectedLead.id, {
        status: "INACTIVE",
        next_followup_at: nextContactAt || null,
      })
    } else if (subStatus === "reschedule" && contactRecord === "Confirmed Schedule") {
      await updateLead(token, selectedLead.id, {
        status: "ACTIVE",
        next_followup_at: nextContactAt || null,
      })
    }

    setRefreshKey((k) => k + 1)
  }

  const filteredLeads = leads
    .filter(
      (lead) =>
        lead.status !== "DROPPED" &&
        lead.status !== "ARCHIVED" &&
        lead.status !== "APPROVED"
    )
    .filter((lead) => {
      // Absent leads are marked INACTIVE and should only appear in Reschedule
      if (lead.status === "INACTIVE" && subStatus !== "reschedule") {
        return false
      }

      if (subStatus === "reschedule") return lead.status === "INACTIVE"

      const ts = lead.next_followup_at || lead.best_contact_at
      if (!ts) return false
      const now = new Date()
      const d = new Date(ts)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)

      if (subStatus === "remind") return diffDays === 1
      if (subStatus === "attendance") return diffHours >= 1
      if (subStatus === "confirmed") return diffDays > 1
      return true
    })

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#1A2410]">Orientation</h1>
          <p className="mt-0.5 text-xs text-[#5A6B4A]">
            Orientation scheduling and reminders.
          </p>
        </div>
        <StatusTabs
          options={ORIENTATION_TABS}
          value={subStatus}
          onChange={setSubStatus}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-[#DDE8CF] bg-white py-12 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-[#DDE8CF] border-t-[#5A9216] animate-spin" />
            <span className="text-xs text-[#5A6B4A]">Loading leads...</span>
          </div>
        </div>
      ) : (
        <LeadTable
          columns={columns}
          leads={filteredLeads}
          renderRow={(lead) => (
            <tr key={lead.id} className="border-b border-[#DDE8CF] hover:bg-[#F7F9F4] transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-[#1A2410]">
                {lead.full_name || "—"}
              </td>
              <td className="px-4 py-3 text-xs text-[#5A6B4A]">
                {formatDateTime(lead.next_followup_at || lead.best_contact_at)}
              </td>
              {showContactColumn && (
                <td className="px-4 py-3 text-xs text-[#9AA686]">
                  Select in View
                </td>
              )}
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedLead(lead)}
                  className="rounded-full border border-[#DDE8CF] bg-white px-4 py-1.5 text-xs font-medium text-[#1A2410] hover:border-[#5A9216] hover:text-[#5A9216] transition"
                >
                  View
                </button>
              </td>
            </tr>
          )}
        />
      )}

      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          contactOptions={subStatus === "confirmed" ? null : currentOptions}
          onSaveContact={subStatus === "confirmed" ? undefined : handleSaveContact}
          onClose={() => setSelectedLead(null)}
          onSaved={() => {
            setSuccess("Contact record saved.")
            setTimeout(() => setSuccess(""), 3000)
          }}
        />
      )}

      {/* Floating success toast */}
      {success && !error && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#166534] px-4 py-2 text-xs font-medium text-white shadow-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {success}
          </div>
        </div>
      )}
    </div>
  )
}