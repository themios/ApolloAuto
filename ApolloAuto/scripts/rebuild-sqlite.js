#!/usr/bin/env node
/**
 * Rebuild better-sqlite3 from source for the current Node.js version.
 * prebuild-install often downloads a binary for the wrong ABI when Node versions differ.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const pkgDir = path.join(__dirname, "..", "node_modules", "better-sqlite3");
const projectRoot = path.join(__dirname, "..");

function resolveNodeExecutable() {
  const nvmrcPath = path.join(projectRoot, ".nvmrc");
  if (fs.existsSync(nvmrcPath)) {
    const raw = fs.readFileSync(nvmrcPath, "utf8").trim();
    const version = raw.startsWith("v") ? raw : `v${raw}`;
    const nvmNode = path.join(
      process.env.HOME || "",
      ".nvm",
      "versions",
      "node",
      version,
      "bin",
      "node"
    );
    if (fs.existsSync(nvmNode)) return nvmNode;
  }
  return process.execPath;
}

const nodeBin = resolveNodeExecutable();
if (!fs.existsSync(pkgDir)) {
  console.log("better-sqlite3 not installed; skipping native rebuild.");
  process.exit(0);
}

console.log(`Rebuilding better-sqlite3 for Node ${process.version} (using ${nodeBin})...`);

const nodeGypJs = path.join(__dirname, "..", "node_modules", "node-gyp", "bin", "node-gyp.js");
if (!fs.existsSync(nodeGypJs)) {
  console.warn("node-gyp not found; run npm install first.");
  process.exit(0);
}

try {
  fs.rmSync(path.join(pkgDir, "build"), { recursive: true, force: true });
  execSync(`"${nodeBin}" "${nodeGypJs}" rebuild --release`, {
    cwd: pkgDir,
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_build_from_source: "true",
    },
  });
  require("better-sqlite3")(":memory:").close();
  console.log("better-sqlite3 native module OK.");
} catch (err) {
  console.warn(
    "Warning: could not rebuild better-sqlite3. Static pages will still work; admin/API need a rebuild.\n" +
      "  Fix: nvm use && npm run rebuild:native"
  );
  process.exit(0);
}
