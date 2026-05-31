"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, RefreshCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ScanState = "idle" | "requesting" | "scanning" | "detecting" | "denied" | "error";

export function ScannerView() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<ScanState>("idle");
  const [manualBarcode, setManualBarcode] = useState("");
  const [showManual, setShowManual] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const stopCamera = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleDetected = useCallback(
    async (barcode: string) => {
      if (state === "detecting") return;
      setState("detecting");
      stopCamera();
      router.push(`/result?barcode=${encodeURIComponent(barcode)}`);
    },
    [state, stopCamera, router]
  );

  const startScanner = useCallback(async () => {
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      if (!videoRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setState("scanning");

      // Dynamically import ZXing to keep bundle size down
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();

      // Use decodeFromVideoElement with a continuous loop via requestAnimationFrame
      let active = true;
      const decode = async () => {
        if (!active || !videoRef.current) return;
        try {
          const result = await reader.decodeFromVideoElement(videoRef.current);
          if (result && active) {
            handleDetected(result.getText());
            return;
          }
        } catch {
          // NotFoundException is expected between frames — just continue
        }
        if (active) requestAnimationFrame(decode);
      };

      requestAnimationFrame(decode);
      cleanupRef.current = () => { active = false; };
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setState("denied");
      } else {
        setState("error");
      }
    }
  }, [handleDetected]);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

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
      {/* Camera viewfinder */}
      <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--ink-2)] shadow-card-elevated">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />

        {/* Scanning overlay */}
        {state === "scanning" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-56 h-44">
              {/* Corner markers */}
              {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map(
                (pos, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-8 h-8 border-[var(--brand)] border-2",
                      pos,
                      i === 0 && "rounded-tl-lg border-r-0 border-b-0",
                      i === 1 && "rounded-tr-lg border-l-0 border-b-0",
                      i === 2 && "rounded-bl-lg border-r-0 border-t-0",
                      i === 3 && "rounded-br-lg border-l-0 border-t-0"
                    )}
                  />
                )
              )}
              {/* Scan line */}
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[var(--brand)] opacity-70 shadow-[0_0_8px_var(--brand)]" />
            </div>
          </div>
        )}

        {/* Idle overlay */}
        {(state === "idle" || state === "requesting") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl bg-[var(--brand)] flex items-center justify-center",
                state === "idle" && "cursor-pointer hover:bg-[var(--brand-dark)] transition-colors pulse-ring"
              )}
              onClick={state === "idle" ? startScanner : undefined}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && state === "idle" && startScanner()}
            >
              {state === "requesting" ? (
                <div className="w-7 h-7 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-current stroke-2">
                  <path d="M3 9V6a1 1 0 0 1 1-1h3M3 15v3a1 1 0 0 0 1 1h3M15 5h3a1 1 0 0 1 1 1v3M15 19h3a1 1 0 0 0 1-1v-3M6 8h.01M8 6v.01M6 12h.01M8 12v.01M12 6h.01M12 8v.01M12 12h.01M16 8h.01M18 8v.01" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <p className="text-white text-sm font-medium">
              {state === "requesting" ? "Requesting camera..." : "Tap to start scanning"}
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

        {/* Denied / Error */}
        {(state === "denied" || state === "error") && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-white font-medium text-sm">
              {state === "denied"
                ? "Camera access denied"
                : "Camera unavailable"}
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

        {/* Stop button while scanning */}
        {(state === "scanning" || state === "detecting") && (
          <button
            onClick={stopCamera}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Demo products note */}
      <div className="text-xs text-[var(--muted)] text-center">
        Demo barcodes: <span className="font-mono">5000163058169</span> (Corn Flakes) · <span className="font-mono">4001686319284</span> (Haribo) · <span className="font-mono">5053990103649</span> (Pringles)
      </div>

      {/* Manual entry */}
      <button
        onClick={() => setShowManual((v) => !v)}
        className="flex items-center gap-2 text-sm text-[var(--muted)] self-center"
      >
        <Keyboard className="w-4 h-4" />
        Enter barcode manually
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
