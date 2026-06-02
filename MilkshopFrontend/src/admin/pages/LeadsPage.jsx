import { useState, useEffect, useRef } from "react"
import StatusTabs from "../components/StatusTabs"
import LeadModal from "../components/LeadModal"
import Register from "./Register"
import Orientation from "./Orientation"
import Attended from "./Attended"
import Reservation from "./Reservation"
import Onboarding from "./Onboarding"
import Archived from "./Archived"
import Dropped from "./Dropped"
import { useAdminAuth } from "../context/AdminAuthContext"
import { fetchLeads } from "../services/leadService"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

  :root {
    --green-primary: #97b64c;
    --green-dark:    #62840b;
    --green-light:   #b7cd7f;
    --surface-bg:    #f5f8ef;
    --border:        #d0e0b0;
    --text-primary:  #1e1e1e;
    --text-secondary:#374151;
    --white:         #ffffff;
  }

  .lp-root {
    min-height: 100vh;
    background: var(--surface-bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
  }

  .lp-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px 16px;
  }

  @media (min-width: 769px) {
    .lp-wrapper { padding: 28px 32px; }
  }

  /* ── Topbar ── */
  .lp-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 14px 20px;
    margin-bottom: 20px;
    gap: 14px;
    flex-wrap: wrap;
  }

  @media (min-width: 769px) {
    .lp-topbar { padding: 16px 24px; flex-wrap: nowrap; }
  }

  /* ── Title block ── */
  .lp-title-block { flex-shrink: 0; }

  .lp-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-secondary);
    opacity: 0.65;
    margin-bottom: 3px;
  }

  .lp-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  @media (min-width: 769px) {
    .lp-title { font-size: 18px; }
  }

  /* ── Search ── */
  .lp-search-wrap {
    flex: 1;
    min-width: 180px;
    max-width: 340px;
    position: relative;
  }

  .lp-search-input {
    width: 100%;
    padding: 9px 14px 9px 38px;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    background: var(--surface-bg) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='%235a5a5a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E") no-repeat 12px center;
    background-size: 15px;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    outline: none;
  }

  .lp-search-input::placeholder { color: var(--text-secondary); opacity: 0.45; }

  .lp-search-input:focus {
    border-color: var(--green-primary);
    box-shadow: 0 0 0 3px rgba(151, 182, 76, 0.12);
    background-color: var(--white);
  }

  /* ── Search Dropdown ── */
  .lp-search-dropdown {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 14px;
    box-shadow: 0 12px 40px rgba(10, 20, 5, 0.12);
    max-height: 300px;
    overflow-y: auto;
    z-index: 50;
    animation: lp-dd-in 0.15s ease;
  }

  @keyframes lp-dd-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .lp-search-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    cursor: pointer;
    width: 100%;
    background: none;
    border: none;
    border-bottom: 1px solid var(--surface-bg);
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-primary);
    transition: background 0.1s;
  }

  .lp-search-item:last-child { border-bottom: none; }
  .lp-search-item:hover { background: var(--surface-bg); }

  .lp-search-item-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d4e8a0 0%, #97b64c 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: var(--white);
    flex-shrink: 0;
    font-family: 'DM Mono', monospace;
  }

  .lp-search-item-info {
    flex: 1;
    min-width: 0;
  }

  .lp-search-item-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .lp-search-item-email {
    font-size: 11px;
    color: var(--text-secondary);
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.7;
    margin-top: 1px;
  }

  .lp-search-item-stage {
    flex-shrink: 0;
    font-size: 10.5px;
    font-weight: 500;
    color: var(--green-dark);
    background: #eef5df;
    padding: 3px 9px;
    border-radius: 20px;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .lp-search-state {
    padding: 16px 14px;
    font-size: 12px;
    color: var(--text-secondary);
    text-align: center;
    font-family: 'DM Mono', monospace;
    opacity: 0.6;
  }
`

const STAGE_TABS = [
  { value: "register",    label: "Register"    },
  { value: "orientation", label: "Orientation" },
  { value: "attended",    label: "Attended"    },
  { value: "reservation", label: "Reservation" },
  { value: "onboarding",  label: "Onboarding"  },
  { value: "archived",    label: "Archived"    },
  { value: "dropped",     label: "Dropped"     },
]

function getPipelineStageValue(lead) {
  const status = (lead?.status || "").toUpperCase()
  const stage  = (lead?.stage  || "").toUpperCase()
  if (status === "DROPPED")     return "dropped"
  if (status === "ARCHIVED")    return "archived"
  if (stage  === "ONBOARDING")  return "onboarding"
  if (stage  === "RESERVATION") return "reservation"
  if (status === "APPROVED")    return "attended"
  if (stage  === "ORIENTATION") return "orientation"
  if (stage  === "REGISTERED")  return "register"
  return "register"
}

function getPipelineStageLabel(lead) {
  const status = (lead?.status || "").toUpperCase()
  const stage  = (lead?.stage  || "").toUpperCase()
  if (status === "DROPPED")     return "Dropped"
  if (status === "ARCHIVED")    return "Archived"
  if (stage  === "ONBOARDING")  return "Onboarding"
  if (stage  === "RESERVATION") return "Reservation"
  if (status === "APPROVED")    return "Attended"
  if (stage  === "ORIENTATION") return "Orientation"
  if (stage  === "REGISTERED")  return "Register"
  if (stage)  return stage
  if (status) return status
  return "—"
}

function getOrientationSubStatusForLead(lead) {
  if (!lead) return "reschedule"
  const status = lead.status
  if (status === "DROPPED" || status === "ARCHIVED" || status === "APPROVED") return "reschedule"
  if (status === "INACTIVE") return "reschedule"
  const ts = lead.next_followup_at || lead.best_contact_at
  if (!ts) return "reschedule"
  const now    = new Date()
  const d      = new Date(ts)
  const today  = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(d.getFullYear(),   d.getMonth(),   d.getDate())
  const diffDays  = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  const diffHours = (now.getTime()    - d.getTime())     / (1000 * 60 * 60)
  if (diffHours >= 1)  return "attendance"
  if (diffDays  === 1) return "remind"
  if (diffDays  >  1)  return "confirmed"
  return "reschedule"
}

const SEARCH_DEBOUNCE_MS = 300

export default function LeadsPage() {
  const { token } = useAdminAuth()
  const [stage, setStage]                         = useState("register")
  const [searchQuery, setSearchQuery]             = useState("")
  const [searchResults, setSearchResults]         = useState([])
  const [searchLoading, setSearchLoading]         = useState(false)
  const [selectedLeadForModal, setSelectedLeadForModal] = useState(null)
  const [orientationSubStatus, setOrientationSubStatus] = useState(null)
  const searchWrapRef = useRef(null)

  const searchTrimmed = searchQuery.trim()
  const showDropdown  = searchTrimmed.length > 0

  useEffect(() => {
    if (!searchTrimmed || !token) {
      setSearchResults([])
      setSearchLoading(false)
      return
    }
    const t = setTimeout(() => {
      setSearchLoading(true)
      fetchLeads(token, { search: searchTrimmed, page: 1, pageSize: 20 })
        .then((res) => setSearchResults(res?.data || []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearchLoading(false))
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchTrimmed, token])

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
  if      (stage === "register")    content = <Register />
  else if (stage === "orientation") content = <Orientation initialSubStatus={orientationSubStatus} />
  else if (stage === "attended")    content = <Attended />
  else if (stage === "reservation") content = <Reservation />
  else if (stage === "onboarding")  content = <Onboarding />
  else if (stage === "archived")    content = <Archived />
  else if (stage === "dropped")     content = <Dropped />

  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">
        <div className="lp-wrapper">

          {/* ── Topbar ── */}
          <div className="lp-topbar">

            {/* Title */}
            <div className="lp-title-block">
              <p className="lp-eyebrow">Admin CRM</p>
              <h1 className="lp-title">Leads Pipeline</h1>
            </div>

            {/* Search */}
            <div className="lp-search-wrap" ref={searchWrapRef}>
              <input
                type="search"
                className="lp-search-input"
                placeholder="Search leads by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search leads"
                aria-expanded={showDropdown}
                aria-haspopup="listbox"
              />

              {showDropdown && (
                <div className="lp-search-dropdown" role="listbox">
                  {searchLoading ? (
                    <div className="lp-search-state">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="lp-search-state">No leads found.</div>
                  ) : (
                    searchResults.map((lead) => (
                      <button
                        key={lead.id}
                        type="button"
                        className="lp-search-item"
                        role="option"
                        onClick={() => onSelectLead(lead)}
                      >
                        <div className="lp-search-item-avatar">
                          {(lead.full_name?.[0] || lead.email?.[0] || "?").toUpperCase()}
                        </div>
                        <div className="lp-search-item-info">
                          <p className="lp-search-item-name">
                            {lead.full_name || "—"}
                          </p>
                          {lead.email && (
                            <p className="lp-search-item-email">{lead.email}</p>
                          )}
                        </div>
                        <span className="lp-search-item-stage">
                          {getPipelineStageLabel(lead)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Stage Tabs */}
            <StatusTabs options={STAGE_TABS} value={stage} onChange={setStage} />
          </div>

          {/* ── Page Content ── */}
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