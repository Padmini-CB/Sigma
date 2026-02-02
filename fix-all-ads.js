const fs = require('fs');
const path = require('path');

// ── Step 1: Build base64 TTF @font-face CSS ──
function b64(filePath) {
  return fs.readFileSync(filePath).toString('base64');
}

const fontMap = [
  { family: 'Saira Condensed', weight: 400, file: '/tmp/fonts/SairaCondensed-Regular.ttf' },
  { family: 'Saira Condensed', weight: 600, file: '/tmp/fonts/SairaCondensed-SemiBold.ttf' },
  { family: 'Saira Condensed', weight: 700, file: '/tmp/fonts/SairaCondensed-Bold.ttf' },
  { family: 'Saira Condensed', weight: 800, file: '/tmp/fonts/SairaCondensed-ExtraBold.ttf' },
  { family: 'Saira Condensed', weight: 900, file: '/tmp/fonts/SairaCondensed-Black.ttf' },
  { family: 'Kanit', weight: 300, file: '/tmp/fonts/Kanit-Light.ttf' },
  { family: 'Kanit', weight: 400, file: '/tmp/fonts/Kanit-Regular.ttf' },
  { family: 'Kanit', weight: 500, file: '/tmp/fonts/Kanit-Medium.ttf' },
  { family: 'Kanit', weight: 600, file: '/tmp/fonts/Kanit-SemiBold.ttf' },
];

let fontFaceBlock = '';
for (const f of fontMap) {
  const data = b64(f.file);
  fontFaceBlock += `@font-face{font-family:'${f.family}';font-style:normal;font-weight:${f.weight};font-display:swap;src:url(data:font/truetype;base64,${data}) format('truetype')}\n`;
}

// ── Step 2: File list ──
const files = [
  'ads/square/CONCEPT1_SQUARE_1080x1080.html',
  'ads/square/CONCEPT2_SQUARE_1080x1080.html',
  'ads/square/CONCEPT3_SQUARE_1080x1080.html',
  'ads/square/BONUS_GITHUB_SQUARE_1080x1080.html',
  'ads/square/BONUS_GITHUB_DETAILED_SQUARE_1080x1080.html',
  'ads/landscape/CONCEPT1_LANDSCAPE_1200x628.html',
  'ads/landscape/CONCEPT2_LANDSCAPE_1200x628.html',
  'ads/landscape/CONCEPT3_LANDSCAPE_1200x628.html',
  'ads/landscape/BONUS_GITHUB_LANDSCAPE_1200x628.html',
  'ads/landscape/BONUS_GITHUB_DETAILED_LANDSCAPE_1200x628.html',
  'ads/story/CONCEPT1_STORY_1080x1920.html',
  'ads/story/CONCEPT2_STORY_1080x1920.html',
  'ads/story/CONCEPT3_STORY_1080x1920.html',
  'ads/story/BONUS_GITHUB_STORY_1080x1920.html',
  'ads/story/BONUS_GITHUB_DETAILED_STORY_1080x1920.html',
];

const USP_TEXT = 'Lifetime Version Access \u2022 100% Refund Policy \u2022 Free Portfolio Website';

for (const file of files) {
  const filePath = path.resolve(__dirname, file);
  let html = fs.readFileSync(filePath, 'utf8');

  const isSquare = file.includes('/square/');
  const isLandscape = file.includes('/landscape/');
  const isStory = file.includes('/story/');

  // ── A: Strip ALL existing @font-face blocks and Google Fonts links ──
  html = html.replace(/<link\s+href="https:\/\/fonts\.googleapis\.com[^"]*"\s+rel="stylesheet"\s*>/g, '');
  // Remove all @font-face declarations (old base64 woff2 or ttf)
  html = html.replace(/@font-face\{[^}]+\}\n?/g, '');
  // Remove old comment header
  html = html.replace(/\n?\/\* ── Embedded Fonts \(base64\) ── \*\/\n?/g, '');

  // ── B: Inject fresh TTF base64 @font-face right after <style> ──
  html = html.replace(/<style>\n?/, '<style>\n' + fontFaceBlock);

  // ── C: Fix .main flex ──
  // .main needs flex:1 to push CTA to bottom, but add justify-content:flex-start
  // so children pack at top instead of stretching
  html = html.replace(/\.main\{flex:(?:1|none);/g, '.main{flex:1;');
  // Add justify-content if not present on column .main
  if (isStory || (isSquare && !file.includes('CONCEPT1'))) {
    // Column layouts: ensure children don't stretch
    html = html.replace(
      /\.main\{flex:1;display:flex;flex-direction:column;/g,
      '.main{flex:1;display:flex;flex-direction:column;justify-content:flex-start;'
    );
  }

  // ── D: Remove flex:1 from CHILDREN inside .main that cause gaps ──
  // Story format: .panels, .comparison, .week-grid should NOT stretch
  if (isStory) {
    // .panels{...flex:1 → flex:none
    html = html.replace(/(\.panels\{[^}]*?)flex:(?:1|none);/g, '$1flex:none;');
    // .comparison{...flex:1 → flex:none
    html = html.replace(/(\.comparison\{[^}]*?)flex:(?:1|none);/g, '$1flex:none;');
    // .week-grid{...flex:1 → flex:none (vertical list)
    html = html.replace(/(\.week-grid\{display:flex;flex-direction:column;[^}]*?)flex:(?:1|none);/g, '$1flex:none;');
    // .graph grid flex:1 → flex:none
    html = html.replace(/(\.graph\{display:grid;[^}]*?)flex:(?:1|none)/g, '$1flex:none');
    // .repo-list flex:1 → flex:none
    html = html.replace(/(\.repo-list\{display:flex;flex-direction:column;[^}]*?)flex:(?:1|none)/g, '$1flex:none');
    // .panel flex:1 inside panels → flex:none (story panels stacked, not side-by-side)
    // But only for the .panel rule that's a child of .panels (column layout)
    // Check if file has .panels (GitHub story ads)
    if (html.includes('.panels{')) {
      html = html.replace(/(\.panel\{)flex:1;/g, '$1flex:none;');
    }
    // .comp-box in story Concept 2 — these are side-by-side, keep flex:1 but don't let them grow vertically
    // Actually .comparison is horizontal (flex row), comp-box flex:1 = equal width = OK
  }

  // Square format: .split flex:1 is fine (side-by-side panels), .main flex:1 fine
  // But for concept 2 square: .comparison{...flex:1 → flex:none (it's a column child)
  if (isSquare) {
    // These are column children that shouldn't stretch:
    html = html.replace(/(\.comparison\{display:flex;gap:\d+px;)flex:1;/g, '$1flex:none;');
    html = html.replace(/(\.week-grid\{display:grid;[^}]*?)flex:1;/g, '$1flex:none;');
  }

  // ── E: Increase ALL font-size values by 15% ──
  // First, reset any previously bumped sizes by doing a clean 15% on base values
  // We already bumped in previous run. Let's detect: if a font has already been bumped,
  // the sizes are ~15% bigger. But since we're running from already-bumped HTML,
  // we should NOT bump again. Let's check a known baseline:
  // Original .cta-btn square was 16px. After one 15% bump = 18px. After two = 21px.
  // We want 18px (one bump from original 16).
  // The issue: this script may have been run once already. Let me check current .cta-btn size.
  const ctaMatch = html.match(/\.cta-btn\{[^}]*font-size:(\d+)px/);
  const ctaSize = ctaMatch ? parseInt(ctaMatch[1]) : 0;

  // Original CTA sizes: square=16, landscape=14, story=20
  // After 1x bump: square=18, landscape=16, story=23
  // If we see 18/16/23, it's already bumped once — don't bump again
  const originalCtaSizes = { square: 16, landscape: 14, story: 20 };
  const fmt = isSquare ? 'square' : isLandscape ? 'landscape' : 'story';
  const expectedBumped = Math.round(originalCtaSizes[fmt] * 1.15);

  if (ctaSize <= originalCtaSizes[fmt]) {
    // Not yet bumped — apply 15% increase
    html = html.replace(/font-size:(\d+(?:\.\d+)?)px/g, (match, size) => {
      const newSize = Math.round(parseFloat(size) * 1.15);
      return `font-size:${newSize}px`;
    });
  }
  // If already bumped, don't bump again

  // ── F: Fix rating badge — no stars, correct text ──
  html = html.replace(/★+\s*/g, '');
  html = html.replace(
    /<strong>1\.4M\+ Subscribers<\/strong>(?:<br>|[\s·]+)(?:★*\s*)?4\.9(?:\s*Rating)?/g,
    '<strong>1.4M+ Subscribers</strong><br>4.9 Rating'
  );

  // ── G: Override .yt-text font-size to exact values ──
  let ytSize;
  if (isSquare) ytSize = 14;
  else if (isLandscape) ytSize = 12;
  else ytSize = 13;
  html = html.replace(/\.yt-text\{font-size:\d+px/g, `.yt-text{font-size:${ytSize}px`);

  // ── H: Ensure trust strip exists with correct sizing ──
  if (!html.includes('trust-strip')) {
    let trustFontSize, trustPadding;
    if (isSquare) { trustFontSize = '12px'; trustPadding = '10px 36px'; }
    else if (isLandscape) { trustFontSize = '10px'; trustPadding = '7px 32px'; }
    else { trustFontSize = '13px'; trustPadding = '12px 44px'; }

    html = html.replace(
      '</style>',
      `.trust-strip{text-align:center;padding:${trustPadding};font-size:${trustFontSize};color:rgba(255,255,255,.45);letter-spacing:.5px;border-top:1px solid rgba(255,255,255,.04)}\n</style>`
    );
    html = html.replace(
      /(\s*<div class="cta-bar">)/,
      `\n  <div class="trust-strip">${USP_TEXT}</div>$1`
    );
  } else {
    // Fix trust strip font size to exact value (not bumped)
    let trustSize;
    if (isSquare) trustSize = 12;
    else if (isLandscape) trustSize = 10;
    else trustSize = 13;
    html = html.replace(/(\.trust-strip\{[^}]*?)font-size:\d+px/, `$1font-size:${trustSize}px`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✓ ${file}`);
}

console.log('\nAll 15 HTML files updated.');
