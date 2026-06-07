const STYLES = `
  .pst-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 0 0 6px 0;
  }

  .pst-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #97b64c;
    flex-shrink: 0;
    box-shadow: 0 0 0 4px rgba(151, 182, 76, 0.22);
  }

  .pst-title {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    font-weight: 700;
    color: #1a2410;
    letter-spacing: -0.03em;
    line-height: 1.2;
    margin: 0;
  }

  .pst-count {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 8px;
    border: 1px solid #97b64c;
    background: #97b64c;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
    white-space: nowrap;
  }
`

export default function PipelineStageTitle({ title, count }) {
  const leadLabel = count === 1 ? "Lead" : "Leads"

  return (
    <>
      <style>{STYLES}</style>
      <div className="pst-row">
        <span className="pst-dot" aria-hidden />
        <h1 className="pst-title">{title}</h1>
        {count != null && (
          <span className="pst-count">
            ({count} {leadLabel})
          </span>
        )}
      </div>
    </>
  )
}
