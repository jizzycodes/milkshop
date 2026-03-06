import { useEffect, useState } from "react";
import { fetchAdminDashboard, fetchRecentFranchiseRequests } from "../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminErrorBanner from "../components/AdminErrorBanner";
import AdminEmptyState from "../components/AdminEmptyState";

export default function AdminDashboard() {
  const { token, logout } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!token) return;
      setIsLoading(true);
      setErrorMessage("");
      try {
        const [dashboardRes, recentRes] = await Promise.all([
          fetchAdminDashboard(token),
          fetchRecentFranchiseRequests(token, { pageSize: 5 }),
        ]);
        if (!isMounted) return;
        setStats(dashboardRes.data || null);
        setRecent(recentRes.data || []);
      } catch (err) {
        if (!isMounted) return;
        if (err?.status === 401) {
          logout();
          setErrorMessage("Your session has expired. Please sign in again.");
        } else {
          setErrorMessage(err?.message || "Unable to load dashboard.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [token]);

  const total = stats?.total ?? "—";
  const today = stats?.today ?? "—";
  const thisMonth = stats?.this_month ?? "—";

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#F7F9F4] px-6 py-7">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-[#1A2410]">Dashboard</h1>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-[#9AA686]">
              /admin/dashboard
            </p>
          </div>
          <p className="font-mono text-[11px] text-[#9AA686]">{dateStr}</p>
        </div>

        <AdminErrorBanner message={errorMessage} />

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Requests" value={total} isLoading={isLoading} featured />
          <StatCard label="Today" value={today} isLoading={isLoading} />
          <StatCard label="This Month" value={thisMonth} isLoading={isLoading} />
        </div>

        {/* Recent Requests */}
        <div className="overflow-hidden rounded-xl border border-[#DDE8CF] bg-white shadow-sm">

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-[#DDE8CF] px-5 py-3.5">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
              Recent Franchise Requests
            </h2>
            <span className="rounded-full border border-[#DDE8CF] bg-[#F7F9F4] px-3 py-0.5 font-mono text-[10px] text-[#9AA686]">
              Last {recent.length || 0} entries
            </span>
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <ul>
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 border-b border-[#DDE8CF] px-5 py-3.5 animate-pulse">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#EEF5E6]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-2/5 rounded bg-[#EEF5E6]" />
                    <div className="h-2 w-3/5 rounded bg-[#EEF5E6]" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-2.5 w-16 rounded bg-[#EEF5E6]" />
                    <div className="h-2 w-20 rounded bg-[#EEF5E6]" />
                  </div>
                </li>
              ))}
            </ul>
          ) : recent.length === 0 ? (
            <AdminEmptyState
              title="No franchise requests yet"
              description="New requests will appear here as soon as customers submit the form."
            />
          ) : (
            <ul>
              {recent.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 border-b border-[#DDE8CF] px-5 py-3.5 last:border-b-0 hover:bg-[#F7F9F4] transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#C8DFA8] bg-[#EEF5E6] font-mono text-xs font-semibold text-[#5A9216]">
                    {(item.full_name?.[0] || "?").toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[#1A2410]">
                      {item.full_name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-[#9AA686]">
                      {item.email} · {item.phone}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-7 w-px flex-shrink-0 bg-[#DDE8CF]" />

                  {/* Right */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs font-medium text-[#5A6B4A]">{item.location}</p>
                    <p className="font-mono text-[10px] text-[#9AA686]">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

/* ---------- Stat Card ---------- */
function StatCard({ label, value, isLoading, featured }) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm transition-colors ${
        featured
          ? "border-[#C8DFA8] bg-[#EEF5E6]"
          : "border-[#DDE8CF]"
      }`}
    >
      <div
        className={`mb-3 h-1.5 w-1.5 rounded-full ${
          featured ? "bg-[#5A9216]" : "bg-[#C8DFA8]"
        }`}
      />
      <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#9AA686]">
        {label}
      </p>
      {isLoading ? (
        <div className="h-9 w-20 animate-pulse rounded-lg bg-[#DDE8CF]" />
      ) : (
        <p
          className={`font-mono text-4xl font-bold tracking-tight ${
            featured ? "text-[#3E6610]" : "text-[#1A2410]"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}