/* Bona — export des stories en PNG 1080 × 1920
   Usage :  node build.mjs            → exporte tout
            node build.mjs story-horaires story-plat   → seulement ces fichiers
   Prérequis : npm i playwright   (Chromium)                                  */

import { chromium } from 'playwright';
import { readdirSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = dirname(fileURLToPath(import.meta.url));
const htmlDir = join(root, 'html');
const outDir = join(root, 'png');
mkdirSync(outDir, { recursive: true });

const only = process.argv.slice(2).map(s => s.replace(/\.html$/, ''));
const files = readdirSync(htmlDir)
  .filter(f => f.endsWith('.html'))
  .filter(f => !only.length || only.includes(f.replace(/\.html$/, '')))
  .sort();

const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
const page = await browser.newPage({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 1,
});

for (const f of files) {
  await page.goto(pathToFileURL(resolve(htmlDir, f)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);
  const el = await page.$('.story');
  await el.screenshot({ path: join(outDir, f.replace(/\.html$/, '.png')) });
  console.log('✓', f);
}

await browser.close();
