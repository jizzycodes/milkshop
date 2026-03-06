export default function AdminErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-100">
      {message}
    </div>
  );
}

