# Security Policy

## Supported Versions

All versions of Dub are currently being supported with security updates.

## Reporting a Vulnerability

To report a vulnerability, send an email to security@dub.co.

We will respond within 48 hours acknowledging your report with details about next steps and potential rewards/compensation for responsible disclosure.

## Verifying a Fix

Every pull request's CI is recorded at the kernel by Garnet, which posts one comment marked `<!-- garnet-runtime-review -->` bound to the head commit (`<!-- garnet:commit <sha> -->`). Before calling a security fix verified, read that record at the fix's head SHA and cite what the changed code reached or stopped reaching. A missing, pending, or stale record is not a clean run. Full instructions: [AGENTS.md](./AGENTS.md).
