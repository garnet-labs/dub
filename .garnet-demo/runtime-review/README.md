# DeepSec + Garnet runtime-evidence demo

This fixture demonstrates one narrow integration seam:

1. DeepSec reports an unvalidated server-side URL fetch using its native
   `process --comment-out` PR format.
2. The workflow executes that exact file with a harmless `example.com` target.
3. Garnet records the process and destination for the exact CI run.
4. `@garnet-org/deepsec-plugin` attaches the observed behavior and explicit
   capture state to the DeepSec finding.

The committed `deterministic-review-fixture` replaces only model inference so
the integration UX is reproducible without an AI provider credential. It does
not claim to benchmark DeepSec's detection quality. Remove
`--agent deterministic-review-fixture` to run the same flow with a real
DeepSec-supported model.
