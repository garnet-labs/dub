# Execution Profile (Garnet) — reviewer and fix-verifier instructions

Before finalizing a review of a pull request, or calling a security fix verified:

1. Find the PR comment containing the marker `<!-- garnet-runtime-review -->`.
   It is the kernel-recorded record of what this PR's CI executed: every
   recorded execution chain, root to action, and the destination each
   outbound connection reached, per job.
   In CI the verify job mirrors that comment to `.garnet/runtime-review.md`
   before invoking you; read it from there.
2. Verify it covers the head: `<!-- garnet:commit <sha> -->` must equal the PR's
   head SHA (`GITHUB_HEAD_SHA` in CI, otherwise `git rev-parse HEAD`). If it
   doesn't, or the comment is missing or still recording, treat the PR as having
   **no Execution Profile** and say so. That is not a clean run.
3. Read the metadata blockquote for run-scope facts, then each job fold: the
   `+A −R` delta or its destination count and `unchanged`, and the tree.
   `○ name` leaves are the observed destinations; a root labelled
   `(runner background · …)` is the runner's infrastructure, not the workload.
4. Cross-check the diff. Name every destination the diff does not explain,
   citing its chain, or state that the Execution Profile is fully explained.
5. When verifying a security fix, quote the record in your evidence: which
   destinations the changed code reached or stopped reaching, at which head SHA,
   compared with which previous commit. A fix whose runtime record still shows
   the vulnerable destination is not verified. The Execution Profile carries no
   verdict — you supply the judgment, and never invent a chain or destination.
