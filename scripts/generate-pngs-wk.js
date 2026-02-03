const { execSync } = require('child_process');
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

    try {
      // Use wkhtmltoimage with specific dimensions
      // --width sets viewport width, --height sets viewport height
      // --quality 100 for best quality
      // --enable-local-file-access to allow loading local resources
      const cmd = `wkhtmltoimage --width ${dims.width} --height ${dims.height} --quality 100 --enable-local-file-access --javascript-delay 3000 "file://${filePath}" "${pngPath}"`;

      execSync(cmd, { stdio: 'pipe', timeout: 60000 });

      const stats = fs.statSync(pngPath);
      results.push({
        file: pngName,
        size: stats.size,
        path: pngPath
      });

      console.log(`Generated: ${pngName} (${(stats.size / 1024).toFixed(1)} KB)`);

    } catch (err) {
      console.error(`Error generating ${pngName}: ${err.message}`);
    }
  }
}

console.log('\n=== Summary ===');
console.log(`Total PNGs generated: ${results.length}`);
console.log('\nFile paths and sizes:');
results.forEach(r => {
  console.log(`  ${r.path}: ${(r.size / 1024).toFixed(1)} KB`);
});
