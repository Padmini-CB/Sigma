const fs = require('fs');
const path = require('path');

// ── Base64 encode all needed font files ──
function b64Font(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

const fontsDir = path.join(__dirname, 'node_modules/@fontsource');

const scWeights = [400, 600, 700, 800, 900];
const kWeights = [300, 400, 500, 600];

let fontFaceCSS = '\n/* ── Embedded Fonts (base64) ── */\n';

for (const w of scWeights) {
  const b64 = b64Font(`${fontsDir}/saira-condensed/files/saira-condensed-latin-${w}-normal.woff2`);
  fontFaceCSS += `@font-face{font-family:'Saira Condensed';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2')}\n`;
}

for (const w of kWeights) {
  const b64 = b64Font(`${fontsDir}/kanit/files/kanit-latin-${w}-normal.woff2`);
  fontFaceCSS += `@font-face{font-family:'Kanit';font-style:normal;font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2')}\n`;
}

// ── File list ──
const files = [
  // Square 1080x1080
  'ads/square/CONCEPT1_SQUARE_1080x1080.html',
  'ads/square/CONCEPT2_SQUARE_1080x1080.html',
  'ads/square/CONCEPT3_SQUARE_1080x1080.html',
  'ads/square/BONUS_GITHUB_SQUARE_1080x1080.html',
  'ads/square/BONUS_GITHUB_DETAILED_SQUARE_1080x1080.html',
  // Landscape 1200x628
  'ads/landscape/CONCEPT1_LANDSCAPE_1200x628.html',
  'ads/landscape/CONCEPT2_LANDSCAPE_1200x628.html',
  'ads/landscape/CONCEPT3_LANDSCAPE_1200x628.html',
  'ads/landscape/BONUS_GITHUB_LANDSCAPE_1200x628.html',
  'ads/landscape/BONUS_GITHUB_DETAILED_LANDSCAPE_1200x628.html',
  // Story 1080x1920
  'ads/story/CONCEPT1_STORY_1080x1920.html',
  'ads/story/CONCEPT2_STORY_1080x1920.html',
  'ads/story/CONCEPT3_STORY_1080x1920.html',
  'ads/story/BONUS_GITHUB_STORY_1080x1920.html',
  'ads/story/BONUS_GITHUB_DETAILED_STORY_1080x1920.html',
];

const USP_TEXT = 'Lifetime Version Access • 100% Refund Policy • Free Portfolio Website';

for (const file of files) {
  const filePath = path.resolve(__dirname, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Determine format
  const isSquare = file.includes('/square/');
  const isLandscape = file.includes('/landscape/');
  const isStory = file.includes('/story/');

  // 1. Remove Google Fonts <link> tag
  html = html.replace(/<link\s+href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"\s+rel="stylesheet"\s*>/g, '');

  // 2. Inject base64 @font-face right after <style> opening tag
  html = html.replace(/<style>/, '<style>' + fontFaceCSS);

  // 3. Remove stars and fix rating text
  //    Pattern A (square/story multiline): <strong>1.4M+ Subscribers</strong><br>★★★★★ 4.9 Rating
  //    Pattern B (landscape inline): <strong>1.4M+ Subscribers</strong> · ★★★★★ 4.9
  //    Pattern C (some landscape with <br>): <strong>1.4M+ Subscribers</strong><br>★★★★★ 4.9 Rating
  html = html.replace(
    /<strong>1\.4M\+ Subscribers<\/strong>(?:<br>|[\s·]+)★★★★★\s*4\.9(?:\s*Rating)?/g,
    '<strong>1.4M+ Subscribers</strong><br>4.9 Rating'
  );

  // 4. Determine font size for yt-text based on format
  let ytFontSize;
  if (isSquare) ytFontSize = '14px';
  else if (isLandscape) ytFontSize = '12px';
  else ytFontSize = '13px'; // story

  // Update .yt-text font-size
  html = html.replace(
    /\.yt-text\{font-size:\d+px/g,
    `.yt-text{font-size:${ytFontSize}`
  );

  // 5. Add USP trust text above the CTA bar
  //    Insert a trust strip div right before the cta-bar div
  //    Check if trust strip already exists (idempotent)
  if (!html.includes('trust-strip')) {
    // Determine trust strip font size
    let trustFontSize, trustPadding;
    if (isSquare) { trustFontSize = '11px'; trustPadding = '8px 36px'; }
    else if (isLandscape) { trustFontSize = '9px'; trustPadding = '6px 32px'; }
    else { trustFontSize = '12px'; trustPadding = '10px 44px'; }

    // Add CSS for trust-strip
    html = html.replace(
      '</style>',
      `.trust-strip{text-align:center;padding:${trustPadding};font-size:${trustFontSize};color:rgba(255,255,255,.45);letter-spacing:.5px;border-top:1px solid rgba(255,255,255,.04)}\n</style>`
    );

    // Insert trust-strip HTML before cta-bar
    html = html.replace(
      /(\s*<div class="cta-bar">)/,
      `\n  <div class="trust-strip">${USP_TEXT}</div>$1`
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ Updated: ${file}`);
}

console.log('\nDone — all 15 HTML files updated.');
