import type { ReactNode } from "react";

/** Alternating solid black and solid white sections. */
export function Section({
  tone = "white",
  children,
  id,
  className = "",
  labelledBy,
}: {
  tone?: "white" | "black";
  children: ReactNode;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${tone === "black" ? "tone-black" : "tone-white"} py-(--spacing-section) ${className}`}
    >
      <div className="container-grid">{children}</div>
    </section>
  );
}
