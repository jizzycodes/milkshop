export default function StatusTabs({ options, value, onChange, size = "md" }) {
  const isLg = size === "lg"

  return (
    <div className={`inline-flex flex-wrap ${isLg ? "gap-2" : "gap-1"}`}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange?.(opt.value)}
            className={
              isLg
                ? `px-5 py-2.5 text-[15px] font-semibold rounded-lg transition-all duration-150 ${
                    active
                      ? "bg-[#97B64C] text-white"
                      : "bg-transparent text-[#6B7280] hover:text-[#1E1E1E]"
                  }`
                : `px-4 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                    active
                      ? "bg-[#97B64C] text-white"
                      : "bg-transparent text-[#6B7280] hover:text-[#1E1E1E]"
                  }`
            }
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
