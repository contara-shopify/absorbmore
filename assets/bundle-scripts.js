#!/usr/bin/env node
/**
 * bundle-scripts.js
 *
 * Builds Shopify theme JavaScript bundles.
 * Supports flags:
 *   --watch        Rebuild on changes
 *   --theme=PATH   Explicit theme path ("/" = current)
 *   --debug        Enables detailed logs
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const { tmpdir } = require("node:os");

const CLI_ARGS = new Map(
  process.argv.slice(2).map((arg) => {
    const m = arg.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [arg, true];
  })
);

const WATCH_MODE = CLI_ARGS.has("watch");
const DEBUG = CLI_ARGS.has("debug");
const THEME_FLAG = CLI_ARGS.get("theme");

function log(...args) {
  if (DEBUG) console.log(...args);
}

function fail(message, code = 1) {
  console.error(`[bundle] ${message}`);
  // eslint-disable-next-line no-process-exit
  process.exit(code);
}

/* --------------------------- Theme Root Resolution --------------------------- */

function resolveThemeAndAssets() {
  const cwd = process.cwd();
  const scriptDir = __dirname;
  const hasAssets = (p) => fs.existsSync(path.join(p, "assets")) && fs.statSync(path.join(p, "assets")).isDirectory();

  if (typeof THEME_FLAG === "string" && THEME_FLAG !== "/") {
    const themePath = path.resolve(cwd, THEME_FLAG);
    if (!hasAssets(themePath)) fail(`No ./assets folder found in "${themePath}"`);
    return { themeDir: themePath, assetsDir: path.join(themePath, "assets") };
  }

  if (path.basename(scriptDir) === "assets" && fs.existsSync(path.dirname(scriptDir))) {
    return { themeDir: path.dirname(scriptDir), assetsDir: scriptDir };
  }

  if (THEME_FLAG === "/" || hasAssets(cwd)) {
    return { themeDir: cwd, assetsDir: path.join(cwd, "assets") };
  }

  const devCandidate = path.join(cwd, "themes", "development");
  if (hasAssets(devCandidate)) return { themeDir: devCandidate, assetsDir: path.join(devCandidate, "assets") };

  fail("Could not determine theme root. Pass --theme=/ or --theme=themes/development");
}

const { themeDir: THEME_DIR, assetsDir: ASSETS_DIR } = resolveThemeAndAssets();
log(`[bundle] Theme root: ${THEME_DIR}`);
log(`[bundle] Assets dir: ${ASSETS_DIR}`);

// Temp directory outside the theme to avoid Shopify CLI sync
const TMP_DIR = fs.mkdtempSync(path.join(tmpdir(), "shopify-esb-"));
let TMP_DIR_REMOVED = false;

function cleanupTmpDir() {
  if (TMP_DIR_REMOVED) return;
  try {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  } catch {
    /* empty */
  }
  TMP_DIR_REMOVED = true;
}

process.on("exit", cleanupTmpDir);

/* -------------------------------- Configuration -------------------------------- */

const OUTPUT_FILES = {
  esm: "theme.module.js",
  modern: "theme.modern.js",
  legacy: "theme.legacy.js",
  debug: "theme.debug.js",
};

const PRIORITY = [
  "_polyfills.js",
  "_layout-effects.js",
  "_video-player.js",
  "_tabs.js",
  "_modals.js",
  "_utils.js",
  "_css-autoprefixer.js",
  "_scroll-progress.js",
  "_search.js",
  "_textarea.js",
  "_accessibility.js",
  "_cart.js",
  "_editor.js",
  "_media-gallery.js",
  "_page-transitions.js",
  "_pagination.js",
  "_product-data.js",
  "_quick-view.js",
  "_scrollbar.js",
  "_smooth-scroll.js",
  "_toast.js",
  "_tooltip.js",
  "_theme.js",
];

const EXCLUDES = [/*/^__section--/, /^__block--/*/ /^[^_]/];
const ESBUILD_VERSION = "0.24.0";

const FILE_IIFE_OPEN = `(function(){\n"use strict";\n`;
const FILE_IIFE_CLOSE = `\n})();\n`;
const BUNDLE_IIFE_OPEN = `(function(){\n"use strict";\n`;
const BUNDLE_IIFE_CLOSE = `\n})();\n`;

/* ----------------------------- Utility Functions ----------------------------- */

function isOutputName(name) {
  return Object.values(OUTPUT_FILES).includes(name);
}

function shouldExclude(name) {
  if (name === "bundle-scripts.js") return true;
  if (name.startsWith(".tmp")) return true;
  return EXCLUDES.some((rule) => (rule instanceof RegExp ? rule.test(name) : name === rule));
}

function listJsFiles() {
  return fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => f.endsWith(".js") && !f.endsWith(".min.js") && !isOutputName(f) && !shouldExclude(f));
}

function matchesPriority(file, rule) {
  return rule instanceof RegExp ? rule.test(file) : file === rule;
}

function discoverFiles() {
  const all = listJsFiles();
  const matched = new Set();
  const priority = [];

  for (const rule of PRIORITY) {
    const found = all.filter((f) => matchesPriority(f, rule));
    for (const f of found) {
      matched.add(f);
      priority.push(f);
    }
  }

  const remaining = all.filter((f) => !matched.has(f)).sort();
  const ordered = [...priority, ...remaining];

  log("[bundle] Files discovered:", ordered);
  return ordered;
}

/* ----------------------------- File Preprocessing ----------------------------- */

function stripEsmSyntax(code) {
  return code
    .replace(/^\s*import.*$/gm, "")
    .replace(/^\s*export\s+default\s+/gm, "")
    .replace(/^\s*export\s+(const|let|var|function|class)\s+/gm, "$1 ")
    .replace(/^\s*export\s*{[^}]*}\s*;?\s*$/gm, "");
}

function finalizeChunk(code) {
  if (!/\n$/.test(code)) code += "\n";
  if (!/[;}]$/.test(code.trim())) code += ";\n";
  return code;
}

/* ----------------------------- Concatenation Phase ----------------------------- */

function concatFiles(files) {
  return files
    .map((f) => {
      const content = fs.readFileSync(path.join(ASSETS_DIR, f), "utf8");
      const clean = finalizeChunk(stripEsmSyntax(content));
      return `// ---- ${f} ----\n${FILE_IIFE_OPEN}${clean}${FILE_IIFE_CLOSE}`;
    })
    .join("\n");
}

/* ----------------------------- Esbuild Integration ----------------------------- */

/*function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: DEBUG ? "inherit" : "ignore",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}*/

function run(command, args) {
  const useShell = process.platform === "win32";

  if (useShell) {
    // Build a single shell command string on Windows to avoid DEP0190
    const quotedArgs = (args || []).map((arg) => {
      // naive quoting – good enough since you control these values
      if (/\s/.test(arg)) {
        return `"${arg.replace(/"/g, '\\"')}"`;
      }
      return arg;
    });

    const fullCommand = [command, ...quotedArgs].join(" ");

    const result = spawnSync(fullCommand, {
      stdio: DEBUG ? "inherit" : "ignore",
      shell: true,
    });
    return result.status === 0;
  }

  // Non-Windows: no shell, normal args array
  const result = spawnSync(command, args, {
    stdio: DEBUG ? "inherit" : "ignore",
    shell: false,
  });
  return result.status === 0;
}

function which(cmd) {
  const checker = process.platform === "win32" ? "where" : "which";
  return spawnSync(checker, [cmd], { stdio: "ignore" }).status === 0;
}

function buildViaEsbuild(entry, output, format, target) {
  const args = [entry, `--outfile=${path.join(ASSETS_DIR, output)}`, `--format=${format}`, `--target=${target}`, "--minify"];

  if (which("esbuild") && run("esbuild", args)) return true;
  if (run("npx", ["-y", `esbuild@${ESBUILD_VERSION}`, ...args])) return true;
  return run("npm", ["i", "-g", `esbuild@${ESBUILD_VERSION}`]) && run("esbuild", args);
}

/* ----------------------------- Build Logic ----------------------------- */

function ensureTmp() {
  return TMP_DIR;
}

function writeTmp(name, data) {
  const p = path.join(ensureTmp(), `${Date.now()}-${Math.random().toString(36).slice(2)}-${name}`);
  fs.writeFileSync(p, data, "utf8");
  return p;
}

function buildOnce() {
  const order = discoverFiles();
  if (!order.length) return;

  const combined = concatFiles(order);
  fs.writeFileSync(path.join(ASSETS_DIR, OUTPUT_FILES.debug), combined);

  const esm = writeTmp("entry.esm.js", combined);
  const iife = writeTmp("entry.iife.js", BUNDLE_IIFE_OPEN + combined + BUNDLE_IIFE_CLOSE);

  const ok =
    buildViaEsbuild(esm, OUTPUT_FILES.esm, "esm", "es2022") &&
    buildViaEsbuild(iife, OUTPUT_FILES.modern, "iife", "es2020") &&
    buildViaEsbuild(iife, OUTPUT_FILES.legacy, "iife", "es2015");

  if (!WATCH_MODE) cleanupTmpDir();

  const gray = (s) => `\x1b[90m${s}\x1b[0m`;
  const cyanBright = (s) => `\x1b[96m${s}\x1b[0m`;

  console.log(`[${gray(new Date().toLocaleTimeString())}]: ${cyanBright("JS Bundled")}`);

  if (!ok) fail("esbuild failed");
}

function startWatch() {
  log("[watch] Starting…");
  buildOnce();

  const debounce = (fn, ms = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  };

  const trigger = debounce(() => buildOnce(), 150);

  const watcher = fs.watch(ASSETS_DIR, { persistent: true }, (_, file) => {
    if (!file || isOutputName(file) || /\.min\.js$/.test(file) || shouldExclude(file)) return;
    trigger();
  });

  process.on("SIGINT", () => {
    watcher.close();
    cleanupTmpDir();
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  });
}

/* ---------------------------------- Main ---------------------------------- */

if (WATCH_MODE) {
  startWatch();
} else {
  buildOnce();
}
