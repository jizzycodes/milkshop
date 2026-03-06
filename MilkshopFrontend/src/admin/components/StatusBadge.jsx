const STATUS_STYLES = {
  NEW: {
    pill: "bg-[#EEF5E6] text-[#5A6B4A] border-[#DDE8CF]",
    dot: "bg-[#5A6B4A]",
  },
  ACTIVE: {
    pill: "bg-[#5A9216]/10 text-[#5A9216] border-[#C8DFA8]",
    dot: "bg-[#5A9216]",
  },
  INACTIVE: {
    pill: "bg-[#F7F9F4] text-[#9CA38F] border-[#DDE8CF]",
    dot: "bg-[#9CA38F]",
  },
  FOR_FOLLOWUP: {
    pill: "bg-[#FFF7E5] text-[#E8A020] border-[#F2D9A4]",
    dot: "bg-[#E8A020]",
  },
  APPROVED: {
    pill: "bg-[#E4F4D2] text-[#3E6610] border-[#C8DFA8]",
    dot: "bg-[#3E6610]",
  },
  DROPPED: {
    pill: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
  ARCHIVED: {
    pill: "bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]",
    dot: "bg-[#9CA3AF]",
  },
};

export default function StatusBadge({ status }) {
  if (!status) return null;

  const key = String(status).toUpperCase();
  const style = STATUS_STYLES[key] || STATUS_STYLES.NEW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest font-mono ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
      {key.replace(/_/g, " ")}
    </span>
  );
}