"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/app/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement actual authentication logic
      console.log("Login attempt:", { email });
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/chat");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-void-accent to-void-accent-glow grid place-items-center glow">
            <span className="text-white font-bold">V</span>
          </div>
          <span className="text-xl font-semibold tracking-tight">VoidAI</span>
        </Link>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-void-text-muted">
              Sign in to continue to your workspace
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-medium text-void-text-muted">
                  Password
                </label>
                <a href="#" className="text-xs text-void-accent-glow hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
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
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-void-text-muted">
            <span className="flex-1 h-px bg-void-border" />
            or
            <span className="flex-1 h-px bg-void-border" />
          </div>

          <p className="mt-6 text-center text-sm text-void-text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-void-accent-glow hover:underline font-medium">
              Create one
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
