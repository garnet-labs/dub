# Garnet × DeepSec Supply-Chain Blindspot Demo

This directory contains a **benign behavioral simulation** of a transitive npm
supply-chain attack (Shai-Hulud / s1ngularity-class TTPs). It exists to
demonstrate runtime behaviors that static security analysis (e.g. Vercel DeepSec)
cannot observe — because the malicious code only exists at install time.

## What `postinstall.js` does

1. Enumerates token-shaped environment variable **names** (no values transmitted)
2. `stat()`s well-known credential paths (`~/.aws/credentials`, `~/.npmrc`, etc. — no contents read)
3. Beacons a single HTTPS POST to a controlled `webhook.site` URL with a benign payload

It performs **no destructive action**, sends **no real secrets**, and is fully reproducible.

## Why this matters

DeepSec scans the source code in this repository and would not flag `postinstall.js`
as malicious — there is no SQL injection, no broken auth, no SSRF in the literal sense.
The behavior **is** the attack: a child process spawned during dependency install reading
environment variables, statting credential files, and beaconing to a non-registry domain.

Garnet runs alongside this workflow as an eBPF kernel sensor, observes every syscall
and network flow, and produces forensic evidence of what actually happened.

## How to reproduce

`gh workflow run garnet-deepsec-demo.yml --repo garnet-labs/dub`

Then inspect:
- The GitHub Actions run logs (Garnet job summary)
- app.garnet.ai for the captured profile
- webhook.site for the beacon receipt (proves egress completed)

