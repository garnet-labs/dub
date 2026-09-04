const PREVIEW_USER_AGENT = "Dub-Webhooks/1.0";
const PREVIEW_TIMEOUT_MS = 5_000;

// Receivers we send preview events to. Previews run with Dub's own egress, so
// they are limited to hosted webhook receivers until a broader policy exists.
const ALLOWED_PREVIEW_HOSTS = new Set([
  "hooks.zapier.com",
  "hooks.slack.com",
  "hook.eu1.make.com",
  "hook.us1.make.com",
  "webhook.site",
]);

export function isAllowedPreviewTarget(url: URL) {
  return url.protocol === "https:" && ALLOWED_PREVIEW_HOSTS.has(url.hostname);
}

// Deliver a sample event to a webhook URL before it is saved, so users can
// confirm their receiver is reachable from Dub.
export async function deliverWebhookPreview(targetUrl: string) {
  const url = new URL(targetUrl);

  if (!isAllowedPreviewTarget(url)) {
    return { status: "blocked" as const, destination: url.hostname };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": PREVIEW_USER_AGENT,
    },
    body: JSON.stringify({ event: "webhook.preview" }),
    signal: AbortSignal.timeout(PREVIEW_TIMEOUT_MS),
  });
  await response.arrayBuffer();

  return { status: response.status, destination: url.hostname };
}
