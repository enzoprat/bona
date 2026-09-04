/* Bona — export des cartons de table en PDF prêts à imprimer
   Usage :  node build-print.mjs
   Produit dans print/ :
     carte-qr.pdf / avis-qr.pdf              1 carton, 90 × 90 mm
     carte-qr-planche-a4.pdf / avis-qr-…      6 cartons sur une A4, traits de coupe
     (idem en version « -vierge » : carré blanc, QR à coller soi-même)
   Prérequis : npm i playwright && npx playwright install chromium            */

import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'print');
mkdirSync(out, { recursive: true });

const MM = 96 / 25.4;          // 1 mm en px CSS
const CARD_MM = 90;            // côté du carton
const DESIGN_PX = 1063;        // taille de la maquette .square
const scale = (CARD_MM * MM) / DESIGN_PX;

const frame = src =>
  `<iframe src="${pathToFileURL(join(root, 'html', src)).href}" scrolling="no"></iframe>`;

const page1 = src => `<!doctype html><meta charset="utf-8"><style>
  @page { size: ${CARD_MM}mm ${CARD_MM}mm; margin: 0 }
  html,body{margin:0;padding:0}
  .slot{width:${CARD_MM}mm;height:${CARD_MM}mm;overflow:hidden;position:relative}
  iframe{position:absolute;top:0;left:0;width:${DESIGN_PX}px;height:${DESIGN_PX}px;
         border:0;transform:scale(${scale});transform-origin:0 0}
</style><div class="slot">${frame(src)}</div>`;

const sheet = src => {
  const cols = 2, rows = 3;
  const w = cols * CARD_MM, h = rows * CARD_MM;
  const mx = (210 - w) / 2, my = (297 - h) / 2;
  const bleed = 3;                        // fond perdu : 3 mm de bleu nuit au-delà du bloc
  let marks = '';
  for (let i = 0; i <= cols; i++)
    marks += `<i class="v" style="left:${mx + i * CARD_MM}mm"></i>`;
  for (let j = 0; j <= rows; j++)
    marks += `<i class="h" style="top:${my + j * CARD_MM}mm"></i>`;
  return `<!doctype html><meta charset="utf-8"><style>
  @page { size: A4; margin: 0 }
  html,body{margin:0;padding:0;width:210mm;height:297mm;position:relative}
  .grid{position:absolute;left:${mx}mm;top:${my}mm;
        display:grid;grid-template-columns:repeat(${cols},${CARD_MM}mm);
        grid-auto-rows:${CARD_MM}mm}
  .slot{width:${CARD_MM}mm;height:${CARD_MM}mm;overflow:hidden;position:relative}
  iframe{position:absolute;top:0;left:0;width:${DESIGN_PX}px;height:${DESIGN_PX}px;
         border:0;transform:scale(${scale});transform-origin:0 0}
  .bleed{position:absolute;left:${mx - bleed}mm;top:${my - bleed}mm;
         width:${w + bleed * 2}mm;height:${h + bleed * 2}mm;background:#03203d}
  i{position:absolute;background:#9aa0a6}
  i.v{top:${my - 6}mm;width:.2mm;height:${h + 12}mm}
  i.h{left:${mx - 6}mm;height:.2mm;width:${w + 12}mm}
</style><div class="bleed"></div>${marks}<div class="grid">${
    Array.from({ length: cols * rows }, () => `<div class="slot">${frame(src)}</div>`).join('')
  }</div>`;
};

const browser = await chromium.launch(
  process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const page = await browser.newPage();

const CARTONS = ['carte-qr', 'carte-qr-vierge', 'avis-qr', 'avis-qr-vierge'];

for (const base of CARTONS) {
  const src = `${base}.html`;
  for (const [name, html, size] of [
    [`${base}.pdf`, page1(src), { width: `${CARD_MM}mm`, height: `${CARD_MM}mm` }],
    [`${base}-planche-a4.pdf`, sheet(src), { format: 'A4' }],
  ]) {
    const tmp = join(out, '.tmp.html');
    writeFileSync(tmp, html);
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.pdf({ path: join(out, name), printBackground: true, ...size });
    console.log('✓', name);
  }
}

await browser.close();
