"use client";

import { whatsappUrl } from "@/lib/config";
import { track } from "@/lib/analytics";

export function WhatsAppButton() {
  const url = whatsappUrl();
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Genartml on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 text-paper shadow-2xl transition-all duration-300 ease-out hover:scale-110 hover:shadow-black/50 hover:bg-black active:scale-95"
      onClick={() => track("whatsapp_click", { location: "floating_button" })}
    >
      {/* Crisp SVG WhatsApp Icon */}
      <svg
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.37 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.3C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.57 14.34C16.32 14.21 15.1 13.61 14.88 13.53C14.65 13.45 14.49 13.41 14.32 13.66C14.16 13.9 13.69 14.46 13.55 14.62C13.41 14.78 13.27 14.8 13.02 14.68C12.78 14.55 11.98 14.29 11.04 13.45C10.3 12.79 9.8 11.98 9.66 11.74C9.52 11.49 9.64 11.36 9.77 11.23C9.88 11.12 10.02 10.94 10.14 10.8C10.27 10.66 10.31 10.55 10.39 10.39C10.47 10.23 10.43 10.09 10.37 9.96C10.31 9.84 9.82 8.63 9.61 8.13C9.41 7.64 9.21 7.71 9.06 7.7L8.59 7.69C8.43 7.69 8.16 7.75 7.94 8C7.71 8.24 7.08 8.83 7.08 10.04C7.08 11.25 7.96 12.41 8.08 12.57C8.21 12.74 9.82 15.21 12.28 16.27C12.87 16.52 13.32 16.67 13.68 16.79C14.27 16.97 14.81 16.95 15.23 16.88C15.7 16.81 16.67 16.29 16.87 15.72C17.08 15.14 17.08 14.65 17.02 14.55C16.96 14.45 16.81 14.38 16.57 14.34Z" />
      </svg>
    </a>
  );
}
