import { useState, useEffect, useRef } from "react"
import StatusTabs from "../components/StatusTabs"
import LeadModal from "../components/LeadModal"
import Register from "./Register"
import Orientation from "./Orientation"
import Attended from "./Attended"
import Onboarding from "./Onboarding"
import Archived from "./Archived"
import Dropped from "./Dropped"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads } from "../services/leadService"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  .lp-root {
    min-height: 100vh;
    background: #F7F9F4;
    font-family: 'DM Sans', sans-serif;
    color: #1A2410;
  }

  .lp-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px;
  }

  .lp-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 16px;
    padding: 14px 16px;
    margin-bottom: 20px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .lp-search-wrap {
    flex: 1;
    min-width: 200px;
    max-width: 360px;
    position: relative;
  }

  .lp-search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(26, 36, 16, 0.12);
    max-height: 320px;
    overflow-y: auto;
    z-index: 50;
  }

  .lp-search-dropdown-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    cursor: pointer;
    border-bottom: 1px solid #F7F9F4;
    font-size: 13px;
    text-align: left;
    width: 100%;
    background: none;
    border-left: none;
    border-right: none;
    border-top: none;
    color: #1A2410;
    font-family: 'DM Sans', sans-serif;
  }

  .lp-search-dropdown-item:last-child {
    border-bottom: none;
  }

  .lp-search-dropdown-item:hover {
    background: #F7F9F4;
  }

  .lp-search-dropdown-item-name {
    font-weight: 500;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .lp-search-dropdown-item-stage {
    flex-shrink: 0;
    font-size: 11px;
    color: #5A6B4A;
    background: #F7F9F4;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .lp-search-dropdown-empty {
    padding: 14px;
    font-size: 12px;
    color: #9AA686;
    text-align: center;
  }

  .lp-search-dropdown-loading {
    padding: 14px;
    font-size: 12px;
    color: #5A6B4A;
    text-align: center;
  }

  .lp-search-input {
    width: 100%;
    padding: 10px 14px 10px 38px;
    border: 1px solid #DDE8CF;
    border-radius: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: #1A2410;
    background: #F7F9F4 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235A6B4A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 12px center;
    background-size: 16px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .lp-search-input::placeholder {
    color: #9AA686;
  }

  .lp-search-input:focus {
    outline: none;
    border-color: #5A9216;
    box-shadow: 0 0 0 2px rgba(90, 146, 22, 0.15);
  }

  .lp-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5A9216;
    margin-bottom: 4px;
  }

  .lp-title {
    font-size: 17px;
    font-weight: 700;
    color: #1A2410;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  @media (min-width: 769px) {
    .lp-wrapper { padding: 28px 32px; }
    .lp-topbar  { padding: 16px 24px; }
    .lp-title   { font-size: 20px; }
  }
`

const STAGE_TABS = [
  { value: "register",    label: "Register"    },
  { value: "orientation", label: "Orientation" },
  { value: "attended",    label: "Attended"    },
  { value: "onboarding",  label: "Onboarding"  },
  { value: "archived",    label: "Archived"    },
  { value: "dropped",     label: "Dropped"     },
]

/** Map backend stage/status to pipeline tab value for navigation. */
function getPipelineStageValue(lead) {
  const status = (lead?.status || "").toUpperCase()
  const stage = (lead?.stage || "").toUpperCase()
  if (status === "DROPPED") return "dropped"
  if (status === "ARCHIVED") return "archived"
  if (stage === "ONBOARDING") return "onboarding"
  if (status === "APPROVED") return "attended"
  if (stage === "ORIENTATION") return "orientation"
  if (stage === "REGISTERED") return "register"
  return "register"
}

/** Map backend stage/status to pipeline tab label for display. */
function getPipelineStageLabel(lead) {
  const status = (lead?.status || "").toUpperCase()
  const stage = (lead?.stage || "").toUpperCase()
  if (status === "DROPPED") return "Dropped"
  if (status === "ARCHIVED") return "Archived"
  if (stage === "ONBOARDING") return "Onboarding"
  if (status === "APPROVED") return "Attended"
  if (stage === "ORIENTATION") return "Orientation"
  if (stage === "REGISTERED") return "Register"
  if (stage) return stage
  if (status) return status
  return "—"
}

/** For Orientation stage, infer which sub-tab this lead belongs to. */
function getOrientationSubStatusForLead(lead) {
  if (!lead) return "reschedule"

  const status = lead.status
  if (status === "DROPPED" || status === "ARCHIVED" || status === "APPROVED") {
    return "reschedule"
  }

  if (status === "INACTIVE") {
    // Absent / needs reschedule.
    return "reschedule"
  }

  const ts = lead.next_followup_at || lead.best_contact_at
  if (!ts) return "reschedule"

  const now = new Date()
  const d = new Date(ts)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  const diffDays = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60)

  if (diffHours >= 1) return "attendance"
  if (diffDays === 1) return "remind"
  if (diffDays > 1) return "confirmed"
  return "reschedule"
}

const SEARCH_DEBOUNCE_MS = 300

export default function LeadsPage() {
  const { token } = useAdminAuth()
  const [stage, setStage] = useState("register")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedLeadForModal, setSelectedLeadForModal] = useState(null)
  const [orientationSubStatus, setOrientationSubStatus] = useState(null)
  const searchWrapRef = useRef(null)

  const searchTrimmed = searchQuery.trim()
  const showDropdown = searchTrimmed.length > 0

  // Debounced global search
  useEffect(() => {
    if (!searchTrimmed || !token) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }
    const t = setTimeout(() => {
      setSearchLoading(true)
      fetchLeads(token, { search: searchTrimmed, page: 1, pageSize: 20 })
        .then((res) => setSearchResults(res.data || []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchTrimmed, token])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleMouseDown(e) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [])

  const onSelectLead = (lead) => {
    const targetStage = getPipelineStageValue(lead)
    setStage(targetStage)

    if (targetStage === "orientation") {
      setOrientationSubStatus(getOrientationSubStatusForLead(lead))
    } else {
      setOrientationSubStatus(null)
    }

    setSelectedLeadForModal(lead)
    setSearchQuery("")
  }

  let content = null
  if (stage === "register") content = <Register />
  else if (stage === "orientation") content = <Orientation initialSubStatus={orientationSubStatus} />
  else if (stage === "attended") content = <Attended />
  else if (stage === "onboarding") content = <Onboarding />
  else if (stage === "archived") content = <Archived />
  else if (stage === "dropped") content = <Dropped />

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">
        <div className="lp-wrapper">
          <div className="lp-topbar">
            <div>
              <p className="lp-eyebrow">Admin CRM</p>
              <h1 className="lp-title">Leads Pipeline</h1>
            </div>
            <div className="lp-search-wrap" ref={searchWrapRef}>
              <input
                type="search"
                className="lp-search-input"
                placeholder="Search by lead name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search leads"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
              />
              {showDropdown && (
                <div className="lp-search-dropdown" role="listbox">
                  {searchLoading ? (
                    <div className="lp-search-dropdown-loading">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="lp-search-dropdown-empty">No leads found.</div>
                  ) : (
                    searchResults.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        className="lp-search-dropdown-item"
                        role="option"
                        onClick={() => onSelectLead(lead)}
                      >
                        <span className="lp-search-dropdown-item-name">
                          {lead.full_name || lead.email || "—"}
                        </span>
                        <span className="lp-search-dropdown-item-stage">
                          {getPipelineStageLabel(lead)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <StatusTabs options={STAGE_TABS} value={stage} onChange={setStage} />
          </div>
          <div>{content}</div>
        </div>
      </div>
      {selectedLeadForModal && (
        <LeadModal
          lead={selectedLeadForModal}
          onClose={() => setSelectedLeadForModal(null)}
        />
      )}
    </>
  )
}