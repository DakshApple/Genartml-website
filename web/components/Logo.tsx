import Image from "next/image";
import Link from "next/link";

/**
 * Logo. Full lockup by default. Aspect ratio kept with width: auto.
 * Use tone="dark" on black backgrounds (white lockup).
 */
export function Logo({
  tone = "light",
  height = 28,
}: {
  tone?: "light" | "dark";
  height?: number;
}) {
  return (
    <Link href="/" aria-label="Genartml home" className="inline-block">
      <Image
        src={tone === "dark" ? "/assets/logo-white.png" : "/assets/logo.png"}
        alt="Genartml"
        width={418}
        height={80}
        priority
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
