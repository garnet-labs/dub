# DeepSec and Garnet runtime review

The review workflow runs DeepSec on the pull request diff, then exercises the
reviewed webhook path under Garnet.

When `AI_GATEWAY_API_KEY` is set, DeepSec uses the Vercel AI Gateway with the
`codex` agent. Otherwise it uses the committed
`deterministic-review-fixture`.

The Garnet action authenticates with GitHub OIDC. It needs `id-token: write`
and does not need a Garnet token in the PR job.

Fork pull requests run DeepSec with the deterministic fixture. Garnet falls
back to best-effort local review when the fork cannot provide protected
credentials.

The `workflow_run` job downloads the artifacts, correlates the exact Garnet
run, and posts one review comment. It uses `GARNET_API_TOKEN`, which is
required for correlation. That job runs in the base repository context and
never sees pull request code.

Required secrets:

- `GARNET_API_TOKEN`
- `AI_GATEWAY_API_KEY` is optional

The reported execution chain describes what the job ran and reached. It is
supporting evidence, not an exploitability verdict.
