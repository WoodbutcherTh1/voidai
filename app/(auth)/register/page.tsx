"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = (() => {
    if (password.length < 8) return { label: "Too short", color: "bg-red-500", value: 25 };
    if (password.length < 12) return { label: "Decent", color: "bg-amber-500", value: 60 };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password))
      return { label: "Strong", color: "bg-emerald-500", value: 100 };
    return { label: "Good", color: "bg-void-accent-glow", value: 80 };
  })();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      console.log("Register attempt:", { email });
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/chat");
    } catch {
      setError("Could not create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-void-accent to-void-accent-glow grid place-items-center glow">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">VoidAI</span>
        </Link>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-void-text-muted">
              Start exploring with VoidAI in seconds
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium mb-1.5 text-void-text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1.5 text-void-text-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              {password && (
                <div className="mt-2">
                  <div className="h-1 w-full rounded-full bg-void-border overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.value}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-void-text-muted">
                    Strength: {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirm" className="block text-xs font-medium mb-1.5 text-void-text-muted">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input-field"
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              size="lg"
            >
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-void-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="text-void-accent-glow hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-void-text-muted">
          <Link href="/" className="hover:text-void-text">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
