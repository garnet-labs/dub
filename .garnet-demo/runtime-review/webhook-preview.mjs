/**
 * Review fixture: a server-side webhook preview helper.
 *
 * The target is intentionally accepted without validation so DeepSec has one
 * narrow SSRF-style sink to review. The workflow invokes it only with the
 * harmless example.com destination below.
 */
export async function deliverWebhookPreview(targetUrl) {
  const response = await fetch(targetUrl, {
    headers: { "user-agent": "dub-runtime-review-demo/1.0" },
  });
  await response.arrayBuffer();
  return { status: response.status, destination: new URL(targetUrl).hostname };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const targetUrl =
    process.env.PREVIEW_TARGET_URL ?? "https://example.com/garnet-deepsec-demo";
  const result = await deliverWebhookPreview(targetUrl);
  console.log(JSON.stringify(result));
  await new Promise((resolve) => setTimeout(resolve, 5_000));
}
