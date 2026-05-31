"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, RefreshCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ScanState = "idle" | "starting" | "scanning" | "detecting" | "denied" | "error";

export function ScannerView() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const stopRef = useRef<(() => void) | null>(null);
  const detectedRef = useRef(false);

  const stopScanner = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
  }, []);

  const startScanner = useCallback(async () => {
    detectedRef.current = false;
    setState("starting");

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();

      const controls = await reader.decodeFromConstraints(
        { video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } } },
        videoRef.current!,
        (result) => {
          if (result && !detectedRef.current) {
            detectedRef.current = true;
            controls.stop();
            setState("detecting");
            router.push(`/result?barcode=${encodeURIComponent(result.getText())}`);
          }
        }
      );

      setState("scanning");
      stopRef.current = () => controls.stop();
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setState("denied");
      } else {
        setState("error");
      }
    }
  }, [router]);

  useEffect(() => () => stopScanner(), [stopScanner]);

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const bc = manualBarcode.trim();
    if (!bc) return;
    if (!/^\d{8,14}$/.test(bc)) {
      toast.error("Enter a valid 8–14 digit barcode");
      return;
    }
    router.push(`/result?barcode=${encodeURIComponent(bc)}`);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Viewfinder */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 shadow-card-elevated">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Scanning overlay */}
        {state === "scanning" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-56 h-44">
              {([0, 1, 2, 3] as const).map((i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-8 h-8 border-[var(--brand)] border-2",
                    i === 0 && "top-0 left-0 rounded-tl-lg border-r-0 border-b-0",
                    i === 1 && "top-0 right-0 rounded-tr-lg border-l-0 border-b-0",
                    i === 2 && "bottom-0 left-0 rounded-bl-lg border-r-0 border-t-0",
                    i === 3 && "bottom-0 right-0 rounded-br-lg border-l-0 border-t-0"
                  )}
                />
              ))}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--brand)] opacity-70" />
            </div>
          </div>
        )}

        {/* Idle / starting */}
        {(state === "idle" || state === "starting") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl bg-[var(--brand)] flex items-center justify-center",
                state === "idle" &&
                  "cursor-pointer hover:bg-[var(--brand-dark)] transition-colors pulse-ring"
              )}
              onClick={state === "idle" ? startScanner : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && state === "idle" && startScanner()}
            >
              {state === "starting" ? (
                <div className="w-7 h-7 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white fill-none stroke-current stroke-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9V6a1 1 0 0 1 1-1h3M3 15v3a1 1 0 0 0 1 1h3M15 5h3a1 1 0 0 1 1 1v3M15 19h3a1 1 0 0 0 1-1v-3" />
                  <rect x="7" y="7" width="4" height="4" rx="0.5" />
                  <rect x="13" y="7" width="4" height="4" rx="0.5" />
                  <rect x="7" y="13" width="4" height="4" rx="0.5" />
                </svg>
              )}
            </div>
            <p className="text-white text-sm font-medium">
              {state === "starting" ? "Starting camera…" : "Tap to start scanning"}
            </p>
          </div>
        )}

        {/* Detecting */}
        {state === "detecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40">
            <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-[var(--brand)] animate-spin" />
            <p className="text-white text-sm">Looking up product…</p>
          </div>
        )}

        {/* Denied / error */}
        {(state === "denied" || state === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-white font-medium text-sm">
              {state === "denied" ? "Camera access denied" : "Camera unavailable"}
            </p>
            <p className="text-white/70 text-xs">
              {state === "denied"
                ? "Allow camera access in your browser settings, then try again."
                : "Try refreshing or use manual entry below."}
            </p>
            <button
              onClick={() => setState("idle")}
              className="flex items-center gap-1.5 text-[var(--brand)] text-sm font-medium mt-2"
            >
              <RefreshCcw className="w-4 h-4" /> Try again
            </button>
          </div>
        )}

        {/* Stop button */}
        {state === "scanning" && (
          <button
            onClick={() => { stopScanner(); setState("idle"); }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-[var(--muted)] text-center">
        Demo: <span className="font-mono">5000163058169</span> &middot;{" "}
        <span className="font-mono">4001686319284</span> &middot;{" "}
        <span className="font-mono">5053990103649</span>
      </p>

      <button
        onClick={() => setShowManual((v) => !v)}
        className="flex items-center gap-2 text-sm text-[var(--muted)] self-center"
      >
        <Keyboard className="w-4 h-4" /> Enter barcode manually
      </button>

      {showManual && (
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 5000163058169"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            className="flex-1 h-11 bg-[var(--surface)] border border-[var(--hairline)] rounded-2xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-opacity-30"
          />
          <button
            type="submit"
            className="h-11 px-5 bg-[var(--brand)] text-white text-sm font-medium rounded-2xl hover:bg-[var(--brand-dark)] transition-colors"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
