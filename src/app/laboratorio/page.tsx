import { notFound } from "next/navigation";
import { localLabEnabled } from "@/lib/loyalty/request";
import { LoyaltyWorkbench } from "@/components/loyalty-workbench";
export const dynamic = "force-dynamic";
export default function LabPage() {
  if (!localLabEnabled()) notFound();
  return <LoyaltyWorkbench lab />;
}
