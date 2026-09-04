const PREVIEW_USER_AGENT = "Dub-Webhooks/1.0";
const PREVIEW_TIMEOUT_MS = 5_000;

// Deliver a sample event to a webhook URL before it is saved, so users can
// confirm their receiver is reachable from Dub.
export async function deliverWebhookPreview(targetUrl: string) {
  const url = new URL(targetUrl);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": PREVIEW_USER_AGENT,
    },
    body: JSON.stringify({
      event: "webhook.preview",
      createdAt: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(PREVIEW_TIMEOUT_MS),
  });
  await response.arrayBuffer();

  return { status: response.status, destination: url.hostname };
}
