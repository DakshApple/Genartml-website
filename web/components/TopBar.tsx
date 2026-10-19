import { bookCallUrl } from "@/lib/config";
import { Button } from "@/components/Button";
import { siteConfig } from "@/site.config";

/** Thin black bar at the top of every page. */
export function TopBar() {
  return (
    <div className="tone-black">
      <div className="container-grid flex h-10 items-center justify-center text-small">
        <a
          href={bookCallUrl()}
          className="inline-flex min-h-11 items-center gap-2 font-medium"
        >
          {siteConfig.copy.primaryButton}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}

export { Button };
