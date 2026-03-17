import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads, createLeadContactLog, updateLead } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

export default function Archived() {
  const { token } = useAdminAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLead, setSelectedLead] = useState(null)
   const [refreshKey, setRefreshKey] = useState(0)
   const [success, setSuccess] = useState("")

  const columns = [
    { key: "name", label: "Lead Name" },
    { key: "status", label: "Status" },
    { key: "inquiryDate", label: "Inquiry Date" },
    { key: "view", label: "View" },
  ]

  useEffect(() => {
    let cancelled = false
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")
    fetchLeads(token, { tab: "archived", page: 1, pageSize: 50 })
      .then((res) => {
        if (!cancelled) setLeads(res.data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load archived")
        setLeads([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token, refreshKey])

  const contactOptions = ["Confirmed Schedule"]

  const handleSaveContact = async ({ contactRecord, nextContactAt, notes }) => {
    if (!token || !selectedLead) return

    if (contactRecord !== "Confirmed Schedule") {
      throw new Error("Invalid result for archived lead.")
    }

    if (!nextContactAt) {
      throw new Error("Please select a next contact date.")
    }

    const log = await createLeadContactLog(token, selectedLead.id, {
      contactType: "CALL",
      notes: notes || "Contact record: Confirmed Schedule",
      outcome: "CONFIRMED_SCHEDULE",
      nextFollowupAt: nextContactAt,
    })

    await updateLead(token, selectedLead.id, {
      stage: "REGISTERED",
      status: "ACTIVE",
      next_followup_at: nextContactAt,
      ...(notes ? { remarks_admin: notes } : {}),
    })

    setRefreshKey((k) => k + 1)
    return log
  }

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#1A2410]">Archived</h1>
        <p className="mt-0.5 text-xs text-[#5A6B4A]">
          Leads that have been archived for record-keeping.
        </p>
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
            <span className="font-mono text-xs text-[#5A6B4A]">Loading leads...</span>
          </div>
        </div>
      ) : (
        <LeadTable
          columns={columns}
          leads={leads}
          renderRow={(lead) => (
            <tr key={lead.id} className="border-b border-[#DDE8CF] hover:bg-[#F7F9F4] transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-[#1A2410]">
                {lead.full_name || "—"}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D1D5DB] bg-[#F3F4F6] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9CA3AF]" />
                  {lead.status || "ARCHIVED"}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-[#5A6B4A]">
                {formatDateTime(lead.created_at)}
              </td>
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
          contactOptions={contactOptions}
          onSaveContact={handleSaveContact}
          onClose={() => setSelectedLead(null)}
          onSaved={() => {
            setSuccess("Contact record saved.")
            setTimeout(() => setSuccess(""), 3000)
          }}
          pipelineLabel="Archived"
        />
      )}

      {success && !error && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center pt-20">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#166534] px-4 py-2 text-xs font-medium text-white shadow-lg">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {success}
          </div>
        </div>
      )}
    </div>
  )
}