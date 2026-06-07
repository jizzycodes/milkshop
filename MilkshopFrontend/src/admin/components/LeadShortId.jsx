import { formatLeadShortId } from "../utils/formatLeadShortId"

const STYLES = `
  .lsi-id {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #5A9216;
    background: #eef5df;
    border-radius: 6px;
    padding: 4px 8px;
    white-space: nowrap;
    user-select: all;
  }
`

export default function LeadShortId({ id }) {
  const shortId = formatLeadShortId(id)
  return (
    <>
      <style>{STYLES}</style>
      <span className="lsi-id" title={id || undefined}>
        {shortId}
      </span>
    </>
  )
}
