import type { ReactNode } from "react";

const toneClassName = {
  ready: "status-pill-ready",
  planned: "status-pill-planned"
} as const;

export function StatusPill({ children, tone }: Readonly<{ children: ReactNode; tone: keyof typeof toneClassName }>) {
  return <span className={`status-pill ${toneClassName[tone]}`}>{children}</span>;
}

