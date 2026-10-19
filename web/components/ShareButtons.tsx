"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://genartml.com/blog/${slug}/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    track("share_click", { method: "copy", slug });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareX = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-wrap items-center gap-3 text-small">
      <span className="font-medium text-ink-70">Share:</span>
      <a
        href={shareLinkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-ink px-3 py-1 text-ink hover:bg-ink hover:text-paper"
        onClick={() => track("share_click", { method: "linkedin", slug })}
      >
        LinkedIn
      </a>
      <a
        href={shareX}
        target="_blank"
        rel="noopener noreferrer"
        className="border border-ink px-3 py-1 text-ink hover:bg-ink hover:text-paper"
        onClick={() => track("share_click", { method: "x", slug })}
      >
        X (Twitter)
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="border border-ink px-3 py-1 text-ink hover:bg-ink hover:text-paper"
      >
        {copied ? "Link copied." : "Copy link"}
      </button>
    </div>
  );
}
