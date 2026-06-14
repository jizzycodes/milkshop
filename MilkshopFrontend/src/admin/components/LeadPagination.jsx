export const LEAD_PAGE_SIZE = 50

const STYLES = `
  .lpag-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    padding: 10px 16px;
    border-bottom: 1px solid #f3f4f6;
    background: #f9fafb;
    font-family: 'DM Sans', sans-serif;
  }

  .lpag-info {
    font-size: 11px;
    color: #6b7280;
    font-family: 'DM Mono', monospace;
  }

  .lpag-controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .lpag-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 7px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #6b7280;
    font-size: 11px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  .lpag-btn:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #1e1e1e;
  }

  .lpag-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .lpag-page {
    padding: 6px 12px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #1e1e1e;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 7px;
  }
`

export default function LeadPagination({
  page,
  totalPages,
  total,
  loading,
  onPageChange,
  visibleCount,
}) {
  if (!total || total <= 0) return null

  const canPrev = page > 1
  const canNext = page < totalPages
  const showVisibleNote =
    visibleCount != null && visibleCount !== total && visibleCount >= 0

  return (
    <>
      <style>{STYLES}</style>
      <div className="lpag-bar">
        <span className="lpag-info">
          Page {page} of {totalPages} · {total} leads
          {showVisibleNote ? ` · ${visibleCount} on this page` : ""}
        </span>
        <div className="lpag-controls">
          <button
            type="button"
            className="lpag-btn"
            disabled={!canPrev || loading}
            onClick={() => canPrev && onPageChange(page - 1)}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Prev
          </button>
          <span className="lpag-page">{page}</span>
          <button
            type="button"
            className="lpag-btn"
            disabled={!canNext || loading}
            onClick={() => canNext && onPageChange(page + 1)}
          >
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
