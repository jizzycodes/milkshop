import { useEffect, useState } from "react"
import LeadTable from "../components/LeadTable"
import LeadModal from "../components/LeadModal"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads } from "../services/leadService"
import { formatDateTime } from "../utils/formatDateTime"

export default function Dropped() {
  const { token } = useAdminAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedLead, setSelectedLead] = useState(null)

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
    fetchLeads(token, { tab: "dropped", page: 1, pageSize: 50 })
      .then((res) => {
        if (!cancelled) setLeads(res.data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load dropped")
        setLeads([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [token])

  return (
    <div className="space-y-5">

      {/* Page Header */}
      <header className="relative flex flex-wrap items-start gap-5 overflow-hidden rounded-[18px] border border-[#DDE8CF] bg-[linear-gradient(145deg,#fbfdf8_0%,#ffffff_42%,#f7faf3_100%)] px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_28px_rgba(26,36,16,0.06)]">
        <div className="absolute left-0 top-0 bottom-0 w-[5px] rounded-l-[18px] bg-[linear-gradient(180deg,#97b64c_0%,#62840b_100%)]" />
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#C8DFA8] bg-[linear-gradient(145deg,#eef5df_0%,#d4e4b8_100%)] text-[#3E6610]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-[rgba(151,182,76,0.35)] bg-[rgba(151,182,76,0.14)] px-[10px] py-[3px] font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#3E6610]">Pipeline</span>
              <span className="select-none text-[#C8DFA8]">·</span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5A9216]">Dropped</span>
            </div>
            <h1 className="mb-1 text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold tracking-[-0.03em] text-[#1A2410]">Dropped</h1>
            <p className="text-[13px] leading-[1.55] text-[#5A6B4A]">Leads that have been dropped and are no longer active.</p>
          </div>
        </div>
      </header>

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
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {lead.status || "DROPPED"}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-[11.5px] text-[#5a5a5a]">
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
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </div>
  )
}