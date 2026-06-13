import type { ReactNode } from "react";

export function PageHeader({
  actions,
  description,
  eyebrow,
  title
}: Readonly<{
  actions?: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
}>) {
  return (
    <section className="listing-header">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </section>
  );
}

