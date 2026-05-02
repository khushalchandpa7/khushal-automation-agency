/**
 * One-time OG image generator for Khushal Automation Agency.
 *
 * Produces frontend/public/og-image.png (1200x630, PNG) by composing the brand
 * SVG mark on a brand-colored background with a tagline.
 *
 * Run manually: `npm run og:build`
 * Re-run only when the design changes — commit the resulting PNG to git so it
 * ships with the build (Vite copies public/ to dist/ verbatim).
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const LOGO_PATH = path.join(ROOT, "src", "assets", "svg", "logo-KA.svg");
const OUTPUT_PATH = path.join(ROOT, "public", "og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

// Brand palette (kept in sync with tailwind.config.js / index.css).
const COLOR_BG = "#0B1220"; // deep ink
const COLOR_BG_GRADIENT_FROM = "#0B1220";
const COLOR_BG_GRADIENT_TO = "#0F2A22"; // mint-shaded ink
const COLOR_ACCENT = "#00C092"; // brand mint
const COLOR_TEXT = "#F4FAF7";
const COLOR_TEXT_MUTED = "#9BB7AA";

const TITLE = "Khushal Automation Agency";
const TAGLINE = "Workflow Automation & AI Agents";
const FOOTER = "khushalautomation.com";

async function buildBackgroundSvg() {
  // The "logo" emblem: a 220x220 rounded square with the KA mark inside.
  // We embed the source logo SVG via base64 so sharp's compositor can rasterize
  // it cleanly without re-resolving relative xlink hrefs.
  const logoSvg = await readFile(LOGO_PATH, "utf8");
  const logoBase64 = Buffer.from(logoSvg).toString("base64");
  const logoHref = `data:image/svg+xml;base64,${logoBase64}`;

  const escape = (s) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Subtle gradient + decorative grid + content.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLOR_BG_GRADIENT_FROM}"/>
      <stop offset="100%" stop-color="${COLOR_BG_GRADIENT_TO}"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="${COLOR_ACCENT}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${COLOR_ACCENT}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="${COLOR_ACCENT}" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>

  <!-- Background layers -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Logo emblem (240x240, top-left aligned with copy) -->
  <g transform="translate(80, 95)">
    <image href="${logoHref}" xlink:href="${logoHref}" width="240" height="240"/>
  </g>

  <!-- Eyebrow tag -->
  <g transform="translate(80, 380)">
    <rect x="0" y="0" width="220" height="42" rx="21" fill="${COLOR_ACCENT}" fill-opacity="0.12" stroke="${COLOR_ACCENT}" stroke-opacity="0.4"/>
    <text x="110" y="28" font-family="'Space Grotesk', 'Manrope', system-ui, sans-serif" font-size="16" font-weight="600" fill="${COLOR_ACCENT}" text-anchor="middle" letter-spacing="2">AI AUTOMATION AGENCY</text>
  </g>

  <!-- Headline -->
  <text x="80" y="478" font-family="'Space Grotesk', 'Manrope', system-ui, sans-serif" font-size="64" font-weight="700" fill="${COLOR_TEXT}" letter-spacing="-1.5">${escape(TITLE)}</text>

  <!-- Tagline -->
  <text x="80" y="538" font-family="'Manrope', system-ui, sans-serif" font-size="36" font-weight="500" fill="${COLOR_TEXT_MUTED}" letter-spacing="-0.5">${escape(TAGLINE)}</text>

  <!-- Footer URL -->
  <text x="80" y="590" font-family="'JetBrains Mono', ui-monospace, monospace" font-size="20" font-weight="500" fill="${COLOR_ACCENT}">${escape(FOOTER)}</text>

  <!-- Decorative accent lines (right edge) -->
  <g stroke="${COLOR_ACCENT}" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round">
    <line x1="${WIDTH - 80}" y1="80" x2="${WIDTH - 40}" y2="120"/>
    <line x1="${WIDTH - 60}" y1="60" x2="${WIDTH - 40}" y2="80"/>
  </g>
</svg>`;
}

async function main() {
  console.log("Generating Open Graph image...");

  const svg = await buildBackgroundSvg();

  await mkdir(path.dirname(OUTPUT_PATH), { recursive: true });

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, quality: 90 })
    .toFile(OUTPUT_PATH);

  const stat = await sharp(OUTPUT_PATH).metadata();
  console.log(
    `OK  wrote ${path.relative(ROOT, OUTPUT_PATH)} (${stat.width}x${stat.height}, ${stat.format})`,
  );
}

main().catch((err) => {
  console.error("Failed to generate og-image.png:", err);
  process.exit(1);
});
