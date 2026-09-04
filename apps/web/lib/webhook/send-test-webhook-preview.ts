interface SendTestWebhookPreviewInput {
  url: string;
  trigger: string;
  data: unknown;
  headers?: Record<string, string>;
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
  headers = {},
}: SendTestWebhookPreviewInput): Promise<TestWebhookReceipt> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify({ event: trigger, data }),
  });

  if (!response.ok) {
    throw new Error(`Test webhook returned ${response.status}`);
  }

  return (await response.json()) as TestWebhookReceipt;
}
