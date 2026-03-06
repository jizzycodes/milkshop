export default function LeadTable({ columns, leads, renderRow }) {
  if (!leads || leads.length === 0) {
    return (
      <div className="mt-4 rounded-xl bg-white border border-[#DDE8CF] p-10 text-center text-xs text-[#5A6B4A]">
        No leads available.
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#DDE8CF] bg-white shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#DDE8CF] bg-[#F7F9F4]">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DDE8CF]">
          {leads.map((lead) => renderRow(lead))}
        </tbody>
      </table>
    </div>
  )
}