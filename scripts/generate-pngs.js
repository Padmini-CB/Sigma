const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const adsDir = path.join(__dirname, '..', 'ads');
const outputDir = path.join(__dirname, '..', 'outputs');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Define all ad formats with their dimensions
const formats = {
  square: { width: 1080, height: 1080 },
  landscape: { width: 1200, height: 628 },
  story: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 }
};

async function generatePngs() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  for (const [format, dims] of Object.entries(formats)) {
    const formatDir = path.join(adsDir, format);

    if (!fs.existsSync(formatDir)) {
      console.log(`Skipping ${format} - directory not found`);
      continue;
    }

    const files = fs.readdirSync(formatDir).filter(f => f.endsWith('.html'));

    for (const file of files) {
      const filePath = path.join(formatDir, file);
      const pngName = file.replace('.html', '.png');
      const pngPath = path.join(outputDir, pngName);

      const page = await browser.newPage();

      try {
        // Set viewport with deviceScaleFactor: 1
        await page.setViewport({
          width: dims.width,
          height: dims.height,
          deviceScaleFactor: 1
        });

        // Load the HTML file
        await page.goto(`file://${filePath}`, { waitUntil: 'domcontentloaded' });

        // Wait 3 seconds for fonts to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Screenshot with clip (not fullPage)
        await page.screenshot({
          path: pngPath,
          clip: {
            x: 0,
            y: 0,
            width: dims.width,
            height: dims.height
          }
        });

        const stats = fs.statSync(pngPath);
        results.push({
          file: pngName,
          size: stats.size,
          path: pngPath
        });

        console.log(`Generated: ${pngName} (${(stats.size / 1024).toFixed(1)} KB)`);

      } catch (err) {
        console.error(`Error generating ${pngName}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();

  console.log('\n=== Summary ===');
  console.log(`Total PNGs generated: ${results.length}`);
  console.log('\nFile paths and sizes:');
  results.forEach(r => {
    console.log(`  ${r.path}: ${(r.size / 1024).toFixed(1)} KB`);
  });

  return results;
}

generatePngs().catch(console.error);
