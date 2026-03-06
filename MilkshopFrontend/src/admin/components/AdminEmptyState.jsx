export default function AdminEmptyState({ title, description }) {
  return (
    <div className="py-8 text-center text-xs text-slate-400">
      <p className="font-semibold text-slate-200 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {title}
      </p>
      {description && (
        <p className="text-slate-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {description}
        </p>
      )}
    </div>
  );
}

