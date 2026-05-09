import Link from "next/link";

const features = [
  {
    title: "Multilingual Chat",
    description:
      "Speak any language — VoidAI detects and replies fluently with natural-feeling tone.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    title: "Bring Your Own Key",
    description:
      "Connect OpenRouter, OpenAI, Anthropic and more. Keys stay in your browser, never our servers.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="16" r="1" />
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Built for Creators",
    description:
      "Code, design, music, media — switch between focused workspaces without losing flow.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="px-6 md:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-void-accent to-void-accent-glow grid place-items-center glow">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold tracking-tight">VoidAI</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm rounded-lg text-void-text-muted hover:text-void-text hover:bg-white/5 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-void-border transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-void-accent-soft border border-void-accent/30 text-void-accent-glow mb-6 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-void-accent-glow animate-pulse-slow" />
          Now with multilingual reasoning
        </span>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-4xl animate-slide-up">
          Your AI workspace,
          <br />
          <span className="bg-gradient-to-r from-void-accent via-void-accent-glow to-pink-400 bg-clip-text text-transparent">
            beautifully focused.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base md:text-lg text-void-text-muted animate-slide-up">
          VoidAI brings chat, code, media and ideas together in one calm,
          modern interface — multilingual, private, and yours to shape.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 animate-slide-up">
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-void-accent to-void-accent-glow text-white shadow-lg shadow-void-accent/30 hover:shadow-void-accent/50 hover:scale-[1.02] transition-all"
          >
            Start chatting
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-white/5 hover:bg-white/10 border border-void-border transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-6 md:px-12 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 hover:border-void-accent/40 transition-colors group"
            >
              <div className="w-11 h-11 rounded-lg bg-void-accent-soft border border-void-accent/30 grid place-items-center text-void-accent-glow mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-void-text-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-6 text-center text-xs text-void-text-muted border-t border-void-border">
        © {new Date().getFullYear()} VoidAI · Built with Next.js & OpenRouter
      </footer>
    </div>
  );
}
