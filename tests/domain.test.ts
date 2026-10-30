import { test } from "node:test";
import assert from "node:assert/strict";
import { programSchema, tagSchema } from "../src/lib/domain";
const input = {
  merchant_id: "00000000-0000-4000-8000-000000000001",
  stamp_target: "8",
  reward_text: "  Café, tostada o lo que decida el local  ",
  minimum_spend: "0",
  stamp_expiry_days: "",
  reward_expiry_days: "30",
};
test("minimum can be zero and expiry is independently disabled", () => {
  const p = programSchema.parse(input);
  assert.equal(p.minimum_spend, 0);
  assert.equal(p.stamp_expiry_days, null);
  assert.equal(p.reward_expiry_days, 30);
  assert.equal(p.reward_text, input.reward_text.trim());
});
test("rejects invalid money, expiry, target and tenant identifiers", () => {
  for (const patch of [
    { minimum_spend: "-1" },
    { minimum_spend: "1.001" },
    { stamp_target: "0" },
    { stamp_target: "101" },
    { reward_expiry_days: "0" },
    { stamp_expiry_days: "-1" },
    { merchant_id: "another-business" },
    { reward_text: "   " },
  ]) {
    assert.equal(
      programSchema.safeParse({ ...input, ...patch }).success,
      false,
      JSON.stringify(patch),
    );
  }
});
test("reward remains plain free text and tag labels are bounded", () => {
  assert.equal(
    programSchema.parse({ ...input, reward_text: "10 % o un desayuno: lo decide el local" })
      .reward_text,
    "10 % o un desayuno: lo decide el local",
  );
  assert.equal(
    tagSchema.safeParse({ merchant_id: input.merchant_id, label: "x".repeat(61) }).success,
    false,
  );
});
