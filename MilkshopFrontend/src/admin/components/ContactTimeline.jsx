function formatFullDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactTimeline({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <p className="text-xs text-[#374151]">
        No contact history yet.
      </p>
    );
  }

  return (
    <ol className="space-y-3 text-xs">
      {logs.map((log) => (
        <li key={log.id} className="flex gap-3">
          <div className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#5A9216]" />
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium text-[#1A2410]">
                {log.contact_type}
              </span>
              <span className="text-[10px] text-[#374151]">
                {formatFullDate(log.created_at)}
              </span>
            </div>
            {log.outcome && (
              <p className="text-[11px] font-mono uppercase tracking-wide text-[#5A9216]">
                Outcome: {log.outcome}
              </p>
            )}
            {log.notes && (
              <p className="text-[11px] text-[#1A2410]">
                {log.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

