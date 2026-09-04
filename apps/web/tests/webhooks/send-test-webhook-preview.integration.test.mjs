import assert from "node:assert/strict";
import test from "node:test";
import { sendTestWebhookPreview } from "../../lib/webhook/send-test-webhook-preview.ts";

test("delivers a preview webhook to the configured integration receiver", async () => {
  const url = process.env.RUNTIME_RECEIVER_URL;
  const token = process.env.RUNTIME_RECEIVER_TOKEN;

  assert.ok(url, "RUNTIME_RECEIVER_URL is required");
  assert.ok(token, "RUNTIME_RECEIVER_TOKEN is required");

  const receipt = await sendTestWebhookPreview({
    url,
    trigger: "link.created",
    data: {
      link: {
        id: "link_demo",
        domain: "dub.sh",
        key: "runtime-review",
      },
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  assert.equal(receipt.accepted, true);
  assert.equal(receipt.event, "link.created");
  assert.match(receipt.receiptId ?? "", /^[0-9a-f-]{36}$/);
});
