import { spawn } from "node:child_process";
const port = process.env.WIZDOM_TEST_PORT || "5175";
const base = process.env.BASE_URL || `http://127.0.0.1:${port}`;
let server;
async function run(file) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [file], {
      stdio: "inherit",
      env: { ...process.env, BASE_URL: base },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${file} exited ${code}`)),
    );
  });
}
try {
  if (!process.env.BASE_URL) {
    server = spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "--host",
        "127.0.0.1",
        "--port",
        port,
        "--strictPort",
      ],
      { stdio: "pipe" },
    );
    server.stderr.on("data", (d) => process.stderr.write(d));
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) throw new Error("Test server stopped");
      try {
        const r = await fetch(base);
        if (r.ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!ready) throw new Error("Test server did not become ready");
  }
  for (const file of [
    "tests/dashboard.e2e.mjs",
    "tests/auth.e2e.mjs",
    "tests/opportunities.e2e.mjs",
    "tests/focus.e2e.mjs",
    "tests/learning.e2e.mjs",
    "tests/studio.e2e.mjs",
    "tests/journey.e2e.mjs",
  ])
    await run(file);
} finally {
  server?.kill("SIGTERM");
}
