const fs = require('fs');
const path = require('path');

const feedDir = path.join(__dirname, '..', 'ads', 'feed');
const files = fs.readdirSync(feedDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(feedDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Fix html,body reset - must have explicit height and overflow
  // Remove any existing html,body rules first
  html = html.replace(/html\s*,?\s*body\s*\{[^}]*\}/g, '');

  // 2. Fix the universal reset and body
  html = html.replace(
    /\*\{[^}]*\}/,
    `html,body{margin:0;padding:0;width:1080px;height:1350px;max-height:1350px;overflow:hidden}
*{margin:0;padding:0;box-sizing:border-box}`
  );

  // 3. Fix .ad container - flex column, full height
  html = html.replace(
    /\.ad\{[^}]*\}/,
    '.ad{width:1080px;height:1350px;display:flex;flex-direction:column;overflow:hidden;background:#18183D;color:#fff}'
  );

  // Handle different background colors per file
  if (file.includes('BONUS_GITHUB')) {
    html = html.replace(
      /\.ad\{[^}]*\}/,
      '.ad{width:1080px;height:1350px;display:flex;flex-direction:column;overflow:hidden;background:#0d1117;color:#fff}'
    );
  }
  if (file.includes('CONCEPT3')) {
    html = html.replace(
      /\.ad\{[^}]*\}/,
      '.ad{width:1080px;height:1350px;display:flex;flex-direction:column;overflow:hidden;background:linear-gradient(160deg,#3F4C7B 0%,#18183D 50%);color:#fff}'
    );
  }

  // 4. Fix .top (header) - flex-shrink:0
  html = html.replace(
    /\.top\{[^}]*\}/,
    '.top{flex-shrink:0;display:flex;justify-content:space-between;align-items:center;padding:48px 44px 0}'
  );

  // 5. Fix .main - THIS IS THE KEY: flex:1 1 auto with justify-content:center
  html = html.replace(
    /\.main\{[^}]*\}/,
    '.main{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center;padding:40px 44px;gap:28px}'
  );

  // For CONCEPT1 which has a different layout (side by side)
  if (file.includes('CONCEPT1')) {
    html = html.replace(
      /\.main\{[^}]*\}/,
      '.main{flex:1 1 auto;display:flex;flex-direction:row;align-items:center;justify-content:center;padding:40px 44px;gap:32px}'
    );
  }

  // 6. Fix .cta-bar (footer) - flex-shrink:0
  html = html.replace(
    /\.cta-bar\{[^}]*\}/,
    '.cta-bar{flex-shrink:0;display:flex;justify-content:space-between;align-items:center;padding:36px 44px;background:rgba(255,255,255,.03);border-top:1px solid rgba(255,255,255,.06)}'
  );

  // 7. For CONCEPT2 - fix value-grid to be 2x2
  if (file.includes('CONCEPT2')) {
    html = html.replace(
      /\.value-grid\{[^}]*\}/,
      '.value-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}'
    );
  }

  // 8. Remove any margin-top:auto that might interfere
  html = html.replace(/margin-top:auto;?/g, '');

  fs.writeFileSync(filePath, html);
  console.log(`Fixed: ${file}`);
});

console.log('\nAll feed files fixed with proper flex layout!');
