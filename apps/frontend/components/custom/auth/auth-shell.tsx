import type { ReactNode } from "react";

export function AuthShell({ children, title, subtitle }: Readonly<{ children: ReactNode; title: string; subtitle: string }>) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <a className="brand auth-brand" href="/">
          <span className="brand-mark" aria-hidden="true">MF</span>
          <span>MatchFlow Arena</span>
        </a>
        <div className="auth-heading">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}

