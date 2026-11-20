import { parseRequestBody } from "@/lib/api/utils";
import { withWorkspace } from "@/lib/auth";
import { deliverWebhookPreview } from "@/lib/webhook/preview";
import { NextResponse } from "next/server";
import * as z from "zod/v4";

const previewWebhookSchema = z.object({
  url: z.url(),
});

// POST /api/webhooks/preview - send a sample event to a webhook URL
export const POST = withWorkspace(
  async ({ req }) => {
    const { url } = previewWebhookSchema.parse(await parseRequestBody(req));

    const result = await deliverWebhookPreview(url);

    return NextResponse.json(result);
  },
  {
    requiredPermissions: ["webhooks.write"],
  },
);
