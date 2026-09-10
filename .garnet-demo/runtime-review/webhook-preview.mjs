import { deliverWebhookPreview } from "../../apps/web/lib/webhook/preview.ts";

// One public receiver and one address a webhook preview must never reach.
const targetUrls = (
  process.env.PREVIEW_TARGET_URLS ??
  "https://example.com/garnet-deepsec-demo,http://169.254.169.254/latest/meta-data/"
).split(",");

for (const targetUrl of targetUrls) {
  try {
    console.log(JSON.stringify(await deliverWebhookPreview(targetUrl)));
  } catch (error) {
    console.log(
      JSON.stringify({
        status: "error",
        destination: new URL(targetUrl).hostname,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}
await new Promise((resolve) => setTimeout(resolve, 5_000));
