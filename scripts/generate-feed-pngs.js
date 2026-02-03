const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const feedDir = path.join(__dirname, '..', 'ads', 'feed');
const outputDir = path.join(__dirname, '..', 'ads', 'png', 'feed');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const width = 1080;
const height = 1350;

const files = fs.readdirSync(feedDir).filter(f => f.endsWith('.html'));
const results = [];

files.forEach(file => {
  const htmlPath = path.join(feedDir, file);
  const pngName = file.replace('.html', '.png');
  const pngPath = path.join(outputDir, pngName);

  try {
    // wkhtmltoimage with:
    // --width/--height for viewport
    // --quality 100 for best quality
    // --enable-local-file-access for local resources
    // --javascript-delay 3000 for font loading (3 seconds)
    const cmd = `wkhtmltoimage --width ${width} --height ${height} --quality 100 --enable-local-file-access --javascript-delay 3000 "file://${htmlPath}" "${pngPath}"`;

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
});

// Optimize PNGs
console.log('\\nOptimizing PNGs...');
try {
  execSync(`cd "${outputDir}" && for f in *.png; do optipng -o2 -quiet "$f"; done`, { stdio: 'inherit' });
} catch (e) {
  console.log('Optimization skipped or failed');
}

// Get final sizes
console.log('\\n=== Final Results ===');
results.forEach(r => {
  try {
    const stats = fs.statSync(r.path);
    console.log(`${r.path}: ${(stats.size / 1024).toFixed(1)} KB`);
  } catch (e) {
    console.log(`${r.path}: size unknown`);
  }
});
