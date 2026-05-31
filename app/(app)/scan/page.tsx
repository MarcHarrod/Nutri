import { ScannerView } from "@/components/scanner-view";

export default function ScanPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-[var(--ink)]">Scan</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">Point your camera at a barcode or food label</p>
      </div>
      <ScannerView />
    </div>
  );
}
