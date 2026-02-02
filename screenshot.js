const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome';

const files = [
  // Square 1080x1080
  { src: 'ads/square/CONCEPT1_SQUARE_1080x1080.html', out: 'ads/png/square/CONCEPT1_SQUARE_1080x1080.png', w: 1080, h: 1080 },
  { src: 'ads/square/CONCEPT2_SQUARE_1080x1080.html', out: 'ads/png/square/CONCEPT2_SQUARE_1080x1080.png', w: 1080, h: 1080 },
  { src: 'ads/square/CONCEPT3_SQUARE_1080x1080.html', out: 'ads/png/square/CONCEPT3_SQUARE_1080x1080.png', w: 1080, h: 1080 },
  { src: 'ads/square/BONUS_GITHUB_SQUARE_1080x1080.html', out: 'ads/png/square/BONUS_GITHUB_SQUARE_1080x1080.png', w: 1080, h: 1080 },
  { src: 'ads/square/BONUS_GITHUB_DETAILED_SQUARE_1080x1080.html', out: 'ads/png/square/BONUS_GITHUB_DETAILED_1080x1080.png', w: 1080, h: 1080 },
  // Landscape 1200x628
  { src: 'ads/landscape/CONCEPT1_LANDSCAPE_1200x628.html', out: 'ads/png/landscape/CONCEPT1_LANDSCAPE_1200x628.png', w: 1200, h: 628 },
  { src: 'ads/landscape/CONCEPT2_LANDSCAPE_1200x628.html', out: 'ads/png/landscape/CONCEPT2_LANDSCAPE_1200x628.png', w: 1200, h: 628 },
  { src: 'ads/landscape/CONCEPT3_LANDSCAPE_1200x628.html', out: 'ads/png/landscape/CONCEPT3_LANDSCAPE_1200x628.png', w: 1200, h: 628 },
  { src: 'ads/landscape/BONUS_GITHUB_LANDSCAPE_1200x628.html', out: 'ads/png/landscape/BONUS_GITHUB_LANDSCAPE_1200x628.png', w: 1200, h: 628 },
  { src: 'ads/landscape/BONUS_GITHUB_DETAILED_LANDSCAPE_1200x628.html', out: 'ads/png/landscape/BONUS_GITHUB_DETAILED_LANDSCAPE_1200x628.png', w: 1200, h: 628 },
  // Story 1080x1920
  { src: 'ads/story/CONCEPT1_STORY_1080x1920.html', out: 'ads/png/story/CONCEPT1_STORY_1080x1920.png', w: 1080, h: 1920 },
  { src: 'ads/story/CONCEPT2_STORY_1080x1920.html', out: 'ads/png/story/CONCEPT2_STORY_1080x1920.png', w: 1080, h: 1920 },
  { src: 'ads/story/CONCEPT3_STORY_1080x1920.html', out: 'ads/png/story/CONCEPT3_STORY_1080x1920.png', w: 1080, h: 1920 },
  { src: 'ads/story/BONUS_GITHUB_STORY_1080x1920.html', out: 'ads/png/story/BONUS_GITHUB_STORY_1080x1920.png', w: 1080, h: 1920 },
  { src: 'ads/story/BONUS_GITHUB_DETAILED_STORY_1080x1920.html', out: 'ads/png/story/BONUS_GITHUB_DETAILED_STORY_1080x1920.png', w: 1080, h: 1920 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--font-render-hinting=none'],
  });

  for (const file of files) {
    const srcPath = path.resolve(__dirname, file.src);
    const outPath = path.resolve(__dirname, file.out);
    const fileUrl = `file://${srcPath}`;

    const page = await browser.newPage();
    await page.setViewport({
      width: file.w,
      height: file.h,
      deviceScaleFactor: 2,
    });

    await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait for Google Fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Extra wait for full render
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({
      path: outPath,
      type: 'png',
      clip: { x: 0, y: 0, width: file.w, height: file.h },
    });

    const stats = fs.statSync(outPath);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✓ ${file.out} (${sizeKB} KB)`);

    await page.close();
  }

  await browser.close();
  console.log('\nDone — 15 PNGs generated.');
})();
