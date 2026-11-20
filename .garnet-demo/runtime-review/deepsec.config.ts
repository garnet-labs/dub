import * as fs from "node:fs";
import * as path from "node:path";
import { defineConfig } from "deepsec/config";
import garnetPlugin from "@garnet-org/deepsec-plugin";

const deterministicReviewFixture = {
  type: "deterministic-review-fixture",
  async *investigate(params: any) {
    return {
      results: params.batch.map((record: any) => ({
        filePath: record.filePath,
        findings: (() => {
          if (!record.filePath.endsWith("apps/web/lib/webhook/preview.ts")) return [];
          const content = fs.readFileSync(path.resolve(params.projectRoot, record.filePath), "utf8");
          const fetchLine = content.split("\n").findIndex((line) => line.includes("fetch(")) + 1;
          return !content.includes("isAllowedPreviewTarget(url)")
            ? [
                {
                  severity: "HIGH",
                  vulnSlug: "server-side-request-forgery",
                  title: "Unvalidated webhook URL reaches a server-side fetch",
                  description:
                    "The preview target is accepted without an allowlist or private-network guard and is passed directly to fetch(). An attacker who controls this value could make the server connect to an unintended destination.",
                  lineNumbers: [fetchLine],
                  recommendation:
                    "Validate the scheme and hostname, block loopback/private/link-local ranges after DNS resolution, and apply an explicit destination policy.",
                  confidence: "high",
                },
              ]
            : [];
        })(),
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
    garnetPlugin({}),
  ],
});
