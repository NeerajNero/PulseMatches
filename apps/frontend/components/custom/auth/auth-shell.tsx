import type { ReactNode } from "react";

export function AuthShell({ children, title, subtitle }: Readonly<{ children: ReactNode; title: string; subtitle: string }>) {
  return (
    <main className="auth-split-container">
      {/* 1. Left Sports Visual Panel (Desktop: Sidebar, Mobile: Top Banner) */}
      <section className="auth-visual-panel">
        {/* Dynamic dynamic background grids and abstract lines */}
        <div className="auth-visual-pattern" aria-hidden="true" />
        <div className="auth-visual-lines" aria-hidden="true" />

        {/* Top Branding Header */}
        <a className="brand text-white hover:opacity-90 transition-opacity" href="/">
          <span className="brand-mark bg-white text-[#10231d]" aria-hidden="true">
            MF
          </span>
          <span className="text-xl font-black tracking-tight text-white">MatchFlow Arena</span>
        </a>

        {/* High-Impact Tagline (Automatically hidden on mobile viewports) */}
        <div className="auth-visual-tagline">
          <span className="eyebrow text-[#c58a1c]">The Arena Awaits</span>
          <h2>Manage tournaments.<br />Track live scores.<br />Own the match.</h2>
          <p>
            Experience the ultimate sports tournament ecosystem. Register as a player to track your ratings, or sign up as an organizer to schedule matches and stream real-time scores.
          </p>
        </div>
      </section>

      {/* 2. Right Authentication Form Panel (Always centered) */}
      <section className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-heading">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

