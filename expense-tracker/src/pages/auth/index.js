import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  const [mode, setMode] = useState("login"); // "login" | "signup" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080B14" }}>
        <span className="material-symbols-rounded animate-spin text-4xl" style={{ color: "#8B5CF6" }}>
          progress_activity
        </span>
      </div>
    );
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const resetState = () => {
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  };

  const switchMode = (next) => {
    resetState();
    setMode(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard", { replace: true });
      } else if (mode === "signup") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email for a confirmation link.");
        setMode("login");
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/expense-tracker/update-password`,
        });
        if (error) throw error;
        setMessage("Password reset email sent. Check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const titles = {
    login: "Sign in to your account",
    signup: "Create an account",
    forgot: "Reset your password",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.15) 0%, #080B14 60%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="rounded-2xl size-16 flex items-center justify-center mb-4"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              boxShadow: "0 8px 32px rgba(139,92,246,0.4)",
            }}
          >
            <span
              className="material-symbols-rounded text-white"
              style={{ fontSize: "32px", fontVariationSettings: "'FILL' 1" }}
            >
              account_balance_wallet
            </span>
          </div>
          <h1 className="text-white text-2xl font-bold">Finance Tracker</h1>
          <p className="text-text-secondary text-sm mt-1">Personal finance at a glance</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          <h2 className="text-white text-lg font-bold mb-6">{titles[mode]}</h2>

          {/* Error / Success messages */}
          {error && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#F87171" }}
            >
              {error}
            </div>
          )}
          {message && (
            <div
              className="mb-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34D399" }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl text-white text-sm px-4 py-3 placeholder-text-secondary/40 transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(139,92,246,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl text-white text-sm px-4 py-3 placeholder-text-secondary/40 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            {/* Confirm Password */}
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Confirm Password</label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl text-white text-sm px-4 py-3 placeholder-text-secondary/40 transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            )}

            {/* Forgot password link */}
            {mode === "login" && (
              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: "#A78BFA" }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center rounded-xl h-12 px-6 text-white text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)",
                boxShadow: "0 4px 20px rgba(139,92,246,0.4)",
              }}
            >
              {submitting ? (
                <span className="material-symbols-rounded animate-spin" style={{ fontSize: "20px" }}>progress_activity</span>
              ) : mode === "login" ? (
                "Sign in"
              ) : mode === "signup" ? (
                "Create account"
              ) : (
                "Send reset email"
              )}
            </button>
          </form>

          {/* Footer links */}
          <div className="mt-6 text-center text-sm text-text-secondary">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="font-semibold hover:underline"
                  style={{ color: "#A78BFA" }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="font-semibold hover:underline"
                  style={{ color: "#A78BFA" }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
