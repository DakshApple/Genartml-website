"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

type Props = {
  href: string;
  children: ReactNode;
  /** "primary" fills, "secondary" outlines. `on` is the background it sits on. */
  variant?: "primary" | "secondary";
  on?: "white" | "black";
  event?: string;
  external?: boolean;
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  on = "white",
  event,
  external,
  className = "",
}: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 border px-6 py-3 text-small font-medium transition-colors";
  const styles = {
    "white-primary": "border-ink bg-ink text-paper hover:bg-paper hover:text-ink",
    "white-secondary": "border-ink bg-paper text-ink hover:bg-ink hover:text-paper",
    "black-primary": "border-paper bg-paper text-ink hover:bg-ink hover:text-paper",
    "black-secondary": "border-paper bg-ink text-paper hover:bg-paper hover:text-ink",
  }[`${on}-${variant}`];
  const cls = `${base} ${styles} ${className}`;
  const onClick = event ? () => track(event, { href }) : undefined;

  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}

/** Plain text link with an arrow. */
export function TextLink({
  href,
  children,
  on = "white",
  event,
}: {
  href: string;
  children: ReactNode;
  on?: "white" | "black";
  event?: string;
}) {
  const external = /^https?:/.test(href);
  const cls = `inline-flex min-h-11 items-center gap-2 text-small font-medium underline underline-offset-4 ${
    on === "black" ? "text-paper" : "text-ink"
  }`;
  const onClick = event ? () => track(event, { href }) : undefined;
  return external ? (
    <a
      href={href}
      className={cls}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={cls} onClick={onClick}>
      {children}
    </Link>
  );
}
