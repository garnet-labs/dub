const ALLOWED_PREVIEW_HOSTS = new Set(["api.dub.co"]);

export async function deliverWebhookPreview(targetUrl) {
  const url = new URL(targetUrl);
  if (url.protocol !== "https:" || !ALLOWED_PREVIEW_HOSTS.has(url.hostname)) {
    return { status: "blocked", destination: url.hostname };
  }
  const response = await fetch(url, { headers: { "user-agent": "dub-runtime-review-demo/1.0" } });
  await response.arrayBuffer();
  return { status: response.status, destination: url.hostname };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const targetUrl =
    process.env.PREVIEW_TARGET_URL ?? "https://example.com/garnet-deepsec-demo";
  const result = await deliverWebhookPreview(targetUrl);
  console.log(JSON.stringify(result));
  await new Promise((resolve) => setTimeout(resolve, 5_000));
}
