const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@400;500&display=swap');

  .sb-aside {
    width: 196px;
    background: #ffffff;
    border: 1px solid #d0e0b0;
    border-radius: 14px;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    flex-shrink: 0;
  }

  .sb-header {
    padding: 13px 16px 11px;
    border-bottom: 1px solid #d0e0b0;
  }

  .sb-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #374151;
    opacity: 0.65;
  }

  .sb-nav {
    display: flex;
    flex-direction: column;
    padding: 7px;
    gap: 2px;
  }

  .sb-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 9px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    text-align: left;
    transition: background 0.13s, color 0.13s;
    font-family: 'DM Sans', sans-serif;
    width: 100%;
    position: relative;
    letter-spacing: -0.01em;
  }

  .sb-item:hover:not(.sb-active) {
    background: #f5f8ef;
    color: #1e1e1e;
  }

  .sb-item.sb-active {
    background: #eef5df;
    color: #62840b;
    font-weight: 600;
  }

  .sb-item.sb-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 52%;
    background: #97b64c;
    border-radius: 0 3px 3px 0;
  }

  .sb-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #d0e0b0;
    flex-shrink: 0;
    transition: background 0.13s;
  }

  .sb-item.sb-active .sb-dot {
    background: #97b64c;
    box-shadow: 0 0 0 3px rgba(151, 182, 76, 0.18);
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
                className={`sb-item${active ? " sb-active" : ""}`}
              >
                <span className="sb-dot" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </aside>
    </>
  )
}