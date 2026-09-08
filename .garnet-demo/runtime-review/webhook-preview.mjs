// Exercises apps/web/lib/webhook/preview.ts the way the preview endpoint calls it.
// Run with: node --experimental-strip-types webhook-preview.mjs
import { deliverWebhookPreview } from "../../apps/web/lib/webhook/preview.ts";

const targetUrl =
  process.env.PREVIEW_TARGET_URL ?? "https://example.com/garnet-deepsec-demo";
const result = await deliverWebhookPreview(targetUrl);
console.log(JSON.stringify(result));
await new Promise((resolve) => setTimeout(resolve, 5_000));
