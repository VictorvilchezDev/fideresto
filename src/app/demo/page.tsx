import { WorkspaceView } from "@/components/workspace-view";
import { appOrigin } from "@/lib/config";
import type { Workspace } from "@/lib/domain";
const workspace: Workspace = {
  id: "00000000-0000-4000-8000-000000000001",
  name: "Café Oliva",
  role: "owner",
  program: {
    stamp_target: 8,
    reward_text: "Un café por cuenta de la casa",
    minimum_spend_cents: 0,
    stamp_expiry_days: null,
    reward_expiry_days: 30,
  },
  tags: [
    { id: "00000000-0000-4000-8000-000000000002", label: "Mostrador principal", active: true },
  ],
  team: [
    { user_id: "demo-owner", role: "owner" },
    { user_id: "demo-staff", role: "staff" },
  ],
};
export default function DemoPage() {
  return <WorkspaceView workspace={workspace} demo origin={appOrigin()} />;
}
