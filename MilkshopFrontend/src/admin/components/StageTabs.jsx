const TAB_LABELS = {
  all:          "All Leads",
  new:          "Register",
  active:       "Active",
  for_follow_up:"For Follow Up",
  orientation:  "Orientation",
  reservation:  "Reservation",
  onboarding:   "Onboarding",
  dropped:      "Dropped",
  archived:     "Archived",
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

  .st-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
  }

  .st-tab {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid #d0e0b0;
    background: #ffffff;
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    letter-spacing: -0.01em;
    transition: background 0.13s, color 0.13s, border-color 0.13s;
    white-space: nowrap;
    font-family: 'DM Sans', sans-serif;
  }

  .st-tab:hover:not(.st-tab--active) {
    background: #f5f8ef;
    border-color: #b7cd7f;
    color: #1e1e1e;
  }

  .st-tab--active {
    background: #97b64c;
    border-color: #97b64c;
    color: #ffffff;
    font-weight: 600;
  }
`

export default function StageTabs({ value, onChange, tabs: customTabs }) {
  const tabs = customTabs && customTabs.length
    ? customTabs
    : ["all", "new", "active", "for_follow_up", "orientation", "reservation", "onboarding", "dropped", "archived"]

  return (
    <>
      <style>{STYLES}</style>
      <div className="st-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={`st-tab${value === tab ? " st-tab--active" : ""}`}
          >
            {TAB_LABELS[tab] || tab}
          </button>
        ))}
      </div>
    </>
  )
}