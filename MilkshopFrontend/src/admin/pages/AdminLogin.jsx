import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminLoginRequest } from "../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const result = await adminLoginRequest(form);
      login(result.token, result.data);
      const redirectTo = location.state?.from?.pathname || "/admin/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setErrorMessage(err?.message || "Unable to login. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F9F4] flex items-center justify-center px-4">

      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#DDE8CF 1px, transparent 1px), linear-gradient(90deg, #DDE8CF 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.4,
        }}
      />

      {/* Soft green glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#C8DFA8] opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-[#EEF5E6] opacity-40 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm animate-[fadeUp_0.4s_ease_forwards]">

        {/* Top accent */}
        <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-transparent via-[#5A9216] to-transparent" />

        <div className="rounded-b-2xl border border-[#DDE8CF] bg-white px-8 py-8 shadow-xl shadow-[#C8DFA8]/20">

          {/* Brand */}
          <div className="mb-7">
            <img src="/milkshop-logo.png" alt="Milkshop" className="h-10 w-auto max-w-[180px] object-contain" />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#9AA686]">Admin Console</p>
          </div>

          {/* Heading */}
          <h1 className="mb-1 text-2xl font-semibold tracking-tight text-[#1A2410]">
            Welcome back.
          </h1>
          <p className="mb-6 text-xs text-[#9AA686]">
            Sign in to manage franchise requests.
          </p>

          {/* Error */}
          {errorMessage && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5">
              <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
              <p className="text-xs text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
                Email
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C8DFA8]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="admin@milkshop.com"
                  required
                  className={`w-full rounded-lg border bg-[#F7F9F4] py-2.5 pl-9 pr-3 text-xs text-[#1A2410] placeholder:text-[#C8DFA8] outline-none transition focus:bg-white focus:ring-1 ${
                    errorMessage
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[#DDE8CF] focus:border-[#5A9216] focus:ring-[#5A9216]/10"
                  }`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#5A6B4A]">
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#C8DFA8]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className={`w-full rounded-lg border bg-[#F7F9F4] py-2.5 pl-9 pr-3 text-xs text-[#1A2410] placeholder:text-[#C8DFA8] outline-none transition focus:bg-white focus:ring-1 ${
                    errorMessage
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-[#DDE8CF] focus:border-[#5A9216] focus:ring-[#5A9216]/10"
                  }`}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="mt-2 w-full rounded-xl bg-gradient-to-br from-[#5A9216] to-[#3E6610] py-2.5 text-xs font-semibold text-white shadow-md shadow-[#5A9216]/20 transition hover:opacity-90 hover:shadow-lg hover:shadow-[#5A9216]/25 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#DDE8CF] pt-5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#5A9216]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#9AA686]">
              Milkshop · Admin Access Only
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#5A9216]" />
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}