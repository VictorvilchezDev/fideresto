import { notFound } from "next/navigation";
import { z } from "zod";
import { requireMerchant } from "@/lib/access";
import { WorkspaceView } from "@/components/workspace-view";
import { appOrigin } from "@/lib/config";
import type { Program, Tag, Workspace } from "@/lib/domain";
export default async function MerchantPage({
  params,
}: {
  params: Promise<{ merchantId: string }>;
}) {
  const { merchantId } = await params;
  if (!z.uuid().safeParse(merchantId).success) notFound();
  const { client, role } = await requireMerchant(merchantId);
  const [merchant, program, tags, team] = await Promise.all([
    client.from("merchants").select("id,name").eq("id", merchantId).single(),
    client
      .from("programs")
      .select("stamp_target,reward_text,minimum_spend_cents,stamp_expiry_days,reward_expiry_days")
      .eq("merchant_id", merchantId)
      .single(),
    role === "owner"
      ? client
          .from("nfc_tags")
          .select("id,label,active")
          .eq("merchant_id", merchantId)
          .order("created_at")
      : Promise.resolve({ data: [], error: null }),
    client.from("memberships").select("user_id,role").eq("merchant_id", merchantId),
  ]);
  if (merchant.error || program.error || tags.error || team.error)
    throw new Error("No se ha podido cargar el comercio.");
  const workspace: Workspace = {
    ...merchant.data,
    role,
    program: program.data as Program,
    tags: tags.data as Tag[],
    team: team.data as Workspace["team"],
  };
  return (
    <WorkspaceView key={JSON.stringify(workspace)} workspace={workspace} origin={appOrigin()} />
  );
}
