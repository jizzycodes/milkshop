const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

  .sb-aside {
    width: 200px;
    background: #FFFFFF;
    border: 1px solid #DDE8CF;
    border-radius: 14px;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }

  .sb-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid #DDE8CF;
  }

  .sb-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5A9216;
  }

  .sb-nav {
    display: flex;
    flex-direction: column;
    padding: 6px;
    gap: 2px;
  }

  .sb-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 9px 12px;
    border-radius: 9px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: #5A6B4A;
    cursor: pointer;
    text-align: left;
    transition: all 0.12s ease;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    position: relative;
  }

  .sb-item:hover:not(.active) {
    background: #F7F9F4;
    color: #1A2410;
  }

  .sb-item.active {
    background: #EEF5E6;
    color: #3E6610;
    font-weight: 600;
  }

  .sb-item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #C8DFA8;
    flex-shrink: 0;
    transition: background 0.12s;
  }

  .sb-item.active .sb-item-dot {
    background: #5A9216;
    box-shadow: 0 0 0 3px rgba(90,146,22,0.15);
  }
`

const ITEMS = [
  { id: "register",    label: "Register"    },
  { id: "orientation", label: "Orientation" },
  { id: "attended",    label: "Attended"    },
  { id: "onboarding",  label: "Onboarding"  },
]

export default function Sidebar({ current, onSelect }) {
  return (
    <>
      <style>{STYLES}</style>
      <aside className="sb-aside">
        <div className="sb-header">
          <p className="sb-eyebrow">Pipeline</p>
        </div>
        <nav className="sb-nav">
          {ITEMS.map((item) => {
            const active = current === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect?.(item.id)}
                className={`sb-item${active ? " active" : ""}`}
              >
                <span className="sb-item-dot" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}