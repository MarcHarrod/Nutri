import { getProductProvider } from "@/lib/product";
import { analyseProduct } from "@/lib/analysis";
import { ProductResult } from "@/components/product-result";
import { EmptyState } from "@/components/empty-state";
import { ScanLine } from "lucide-react";
import Link from "next/link";

type Props = { searchParams: Promise<{ barcode?: string }> };

export default async function ResultPage({ searchParams }: Props) {
  const { barcode } = await searchParams;

  if (!barcode) {
    return (
      <EmptyState
        icon={<ScanLine className="w-8 h-8" />}
        title="No product scanned"
        description="Go back to the scanner to scan a barcode or capture a label."
        action={
          <Link href="/scan" className="text-sm font-medium text-[var(--brand)]">
            Open scanner
          </Link>
        }
      />
    );
  }

  const provider = getProductProvider();
  const product = await provider.lookup(barcode);

  if (!product) {
    return (
      <EmptyState
        icon={<ScanLine className="w-8 h-8" />}
        title="Product not found"
        description={`No data found for barcode ${barcode}. Try scanning the ingredients panel instead.`}
        action={
          <Link href="/scan" className="text-sm font-medium text-[var(--brand)]">
            Scan again
          </Link>
        }
      />
    );
  }

  const analysis = analyseProduct(product);
  return <ProductResult analysis={analysis} barcode={barcode} />;
}
