import sharp from "sharp";
import type { WalletSnapshot } from "./model";
const gem = `<g stroke="#4268bc" stroke-width="5" fill="none" stroke-linejoin="round"><path d="m39 74 27-29h60l27 29-57 76z"/><path d="M39 74h114M66 45l-6 29 36 76 36-76-6-29M60 74l36-29 36 29"/></g>`;
export async function walletLogo(size = 192) {
  return sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192"><rect width="192" height="192" rx="42" fill="#edf3ff"/>${gem}</svg>`,
    ),
  )
    .resize(size, size)
    .png()
    .toBuffer();
}
export function stripSvg(s: WalletSnapshot) {
  const total = Math.min(s.target, 12),
    filled = Math.min(s.stamps, total),
    spacing = 310 / Math.max(total - 1, 1),
    radius = total > 8 ? 10 : 14;
  const circles = Array.from(
    { length: total },
    (_, i) =>
      `<circle cx="${total === 1 ? 187 : 32 + i * spacing}" cy="91" r="${radius}" fill="${i < filled ? "#4268d9" : "#fff"}" stroke="${i < filled ? "#4268d9" : "#c5d3e9"}" stroke-width="1.4"/>${i < filled ? `<path d="m${(total === 1 ? 187 : 32 + i * spacing) - 4} 91 3 3 5-6" fill="none" stroke="white" stroke-width="1.7"/>` : ""}`,
  ).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="375" height="123"><rect width="375" height="123" fill="#edf3ff"/>${circles}</svg>`;
}
export async function appleImages(s: WalletSnapshot) {
  const entries: Record<string, Buffer> = {};
  for (const scale of [1, 2, 3]) {
    const suffix = scale === 1 ? "" : `@${scale}x`;
    entries[`icon${suffix}.png`] = await walletLogo(29 * scale);
    entries[`logo${suffix}.png`] = await walletLogo(38 * scale);
    entries[`strip${suffix}.png`] = await sharp(Buffer.from(stripSvg(s)))
      .resize(375 * scale, 123 * scale)
      .png()
      .toBuffer();
  }
  return entries;
}
