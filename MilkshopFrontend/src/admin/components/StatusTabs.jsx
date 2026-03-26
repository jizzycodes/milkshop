export default function StatusTabs({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl bg-[#EEF5E6] p-1 gap-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
              active
                ? "bg-[#5A9216] text-white shadow-sm"
                : "bg-transparent text-[#374151] hover:bg-[#DDE8CF] hover:text-[#1A2410]"
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}