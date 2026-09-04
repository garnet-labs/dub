import { defineConfig } from "deepsec/config";
import garnetPlugin from "@garnet-org/deepsec-plugin";

const deterministicReviewFixture = {
  type: "deterministic-review-fixture",
  async *investigate(params: any) {
    return {
      results: params.batch.map((record: any) => ({
        filePath: record.filePath,
        findings:
          record.filePath === ".garnet-demo/runtime-review/webhook-preview.mjs"
            ? [
                {
                  severity: "HIGH",
                  vulnSlug: "server-side-request-forgery",
                  title: "Unvalidated webhook URL reaches a server-side fetch",
                  description:
                    "The preview target is accepted without an allowlist or private-network guard and is passed directly to fetch(). An attacker who controls this value could make the server connect to an unintended destination.",
                  lineNumbers: [8, 9, 10],
                  recommendation:
                    "Validate the scheme and hostname, block loopback/private/link-local ranges after DNS resolution, and apply an explicit destination policy.",
                  confidence: "high",
                },
              ]
            : [],
      })),
      meta: {
        durationMs: 1,
        durationApiMs: 1,
        numTurns: 1,
        usage: {
          inputTokens: 1,
          outputTokens: 1,
          cacheReadInputTokens: 0,
          cacheCreationInputTokens: 0,
        },
      },
    };
  },
  async *revalidate() {
    return {
      verdicts: [],
      meta: { durationMs: 1 },
    };
  },
};

export default defineConfig({
  projects: [{ id: "dub-runtime-review-demo", root: "../.." }],
  plugins: [
    {
      name: "deterministic-review-fixture",
      agents: [deterministicReviewFixture],
    },
    garnetPlugin({ workflowName: "DeepSec + Garnet runtime evidence" }),
  ],
});
