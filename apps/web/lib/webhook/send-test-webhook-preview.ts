interface SendTestWebhookPreviewInput {
  url: string;
  trigger: string;
  data: unknown;
  authorizationToken: string;
}

interface TestWebhookReceipt {
  accepted?: boolean;
  event?: string;
  receiptId?: string;
}

export async function sendTestWebhookPreview({
  url,
  trigger,
  data,
  authorizationToken,
}: SendTestWebhookPreviewInput): Promise<TestWebhookReceipt> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${authorizationToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ event: trigger, data }),
  });

  if (!response.ok) {
    throw new Error(`Test webhook returned ${response.status}`);
  }

  return (await response.json()) as TestWebhookReceipt;
}
