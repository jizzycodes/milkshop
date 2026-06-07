import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads } from "../services/leadService"

/** Map backend stage/status to pipeline tab label for display. */
function getPipelineStageLabel(lead) {
  const status = (lead?.status || "").toUpperCase()
  const stage = (lead?.stage || "").toUpperCase()
  if (status === "DROPPED") return "Dropped"
  if (status === "ARCHIVED") return "Archived"
  if (stage === "ONBOARDING") return "Onboarding"
  if (stage === "STORE_OPEN") return "Store Open"
  if (stage === "RESERVATION") return "Reservation"
  if (status === "APPROVED") return "Attended"
  if (stage === "ORIENTATION") return "Orientation"
  if (stage === "REGISTERED") return "Register"
  if (stage) return stage
  if (status) return status
  return "—"
}

export default function GlobalSearchView({ search }) {
  const { token } = useAdminAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedLead, setSelectedLead] = useState(null)

  const columns = [
    { key: "name", label: "Lead Name" },
    { key: "email", label: "Email" },
    { key: "pipelineStage", label: "Pipeline Stage" },
    { key: "view", label: "Action" },
  ]

  useEffect(() => {
    if (!search || !token) {
      setLeads([])
      setLoading(false)
      setError("")
      return
    }
    let cancelled = false
    setLoading(true)
    setError("")
    fetchLeads(token, { search, page: 1, pageSize: 50 })
      .then((res) => {
        if (!cancelled) setLeads(res.data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to search leads")
        setLeads([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token, search])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-[#1A2410]">Search results</h1>
        <p className="mt-0.5 text-xs text-[#374151]">
          Leads matching &quot;{search}&quot; across all pipeline stages.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white py-12 shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-5 w-5 rounded-full border-2 border-[#E5E7EB] border-t-[#6B7280] animate-spin" />
            <span className="font-mono text-xs text-[#374151]">Searching...</span>
          </div>
        </div>
      ) : (
        <LeadTable
          columns={columns}
          leads={leads}
          renderRow={(lead) => (
            <tr key={lead.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-[#1A2410]">
                {lead.full_name || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-[#374151]">
                {lead.email || "—"}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-medium text-[#6B7280]">
                  {getPipelineStageLabel(lead)}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSelectedLead(lead)}
                  className="rounded-lg border border-[#97B64C] bg-[#97B64C] px-4 py-1.5 text-xs font-medium text-white hover:bg-[#5A9216] hover:border-[#5A9216] transition"
                >
                  View
                </button>
              </td>
            </tr>
          )}
        />
      )}

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  )
}
