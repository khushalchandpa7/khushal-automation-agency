import logoSvg from "../assets/svg/logo-KA.svg?raw";

const block = "\u2588";
const logoDataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  logoSvg,
)}`;

const LOGO_IMAGE_STYLE = [
  "display:inline-block",
  "font-size:1px",
  "line-height:1px",
  "padding:72px 148px",
  `background-image:url("${logoDataUri}")`,
  "background-position:center",
  "background-repeat:no-repeat",
  "background-size:128px 128px",
].join(";");

const LOGO_SYMBOLS = [
  `        ${block.repeat(20)}        `,
  `     ${block.repeat(26)}     `,
  `   ${block.repeat(30)}   `,
  `  ${block.repeat(5)}   ${block.repeat(13)}   ${block.repeat(8)}  `,
  ` ${block.repeat(6)}   ${block.repeat(11)}   ${block.repeat(10)} `,
  ` ${block.repeat(6)}   ${block.repeat(9)}   ${block.repeat(12)} `,
  ` ${block.repeat(6)}   ${block.repeat(7)}   ${block.repeat(14)} `,
  ` ${block.repeat(6)}   ${block.repeat(5)}   ${block.repeat(16)} `,
  ` ${block.repeat(6)}   ${block.repeat(3)}   ${block.repeat(9)}   ${block.repeat(6)} `,
  ` ${block.repeat(6)}   ${block.repeat(5)}   ${block.repeat(7)}   ${block.repeat(6)} `,
  ` ${block.repeat(6)}   ${block.repeat(7)}   ${block.repeat(5)}   ${block.repeat(6)} `,
  ` ${block.repeat(6)}   ${block.repeat(9)}   ${block.repeat(3)}   ${block.repeat(6)} `,
  `  ${block.repeat(5)}   ${block.repeat(11)}   ${block}   ${block.repeat(5)}  `,
  `   ${block.repeat(30)}   `,
  `     ${block.repeat(26)}     `,
  `        ${block.repeat(20)}        `,
].join("\n");

const LOGO_SYMBOL_STYLE = [
  "display:block",
  "font-family:JetBrains Mono, Consolas, Monaco, monospace",
  "font-size:10px",
  "font-weight:900",
  "line-height:1",
  "color:#00C092",
  "background:#001f1a",
  "padding:12px 14px",
  "border-radius:16px",
  "text-shadow:0 0 8px rgba(0,192,146,0.45)",
].join(";");

const TITLE_STYLE = [
  "display:block",
  "font-family:Space Grotesk, Manrope, ui-sans-serif, system-ui, sans-serif",
  "font-size:20px",
  "font-weight:800",
  "line-height:1.6",
  "color:#00C092",
  "letter-spacing:0.03em",
  "text-shadow:0 1px 0 #075B4A",
].join(";");

export function showConsoleBrand() {
  if (typeof window === "undefined" || window.__KA_CONSOLE_BRAND_SHOWN__) {
    return;
  }

  window.__KA_CONSOLE_BRAND_SHOWN__ = true;
  console.log("%c ", LOGO_IMAGE_STYLE);
  console.log("%c" + LOGO_SYMBOLS, LOGO_SYMBOL_STYLE);
  console.log("%cKhushal Automation Agency", TITLE_STYLE);
}
