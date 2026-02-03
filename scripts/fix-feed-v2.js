const fs = require('fs');
const path = require('path');

const feedDir = path.join(__dirname, '..', 'ads', 'feed');
const files = fs.readdirSync(feedDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(feedDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Increase ALL font sizes by 30%
  html = html.replace(/font-size:(\d+)px/g, (match, size) => {
    const newSize = Math.round(parseInt(size) * 1.3);
    return `font-size:${newSize}px`;
  });

  // 2. Increase padding values (vertical by 50%, horizontal by 20%)
  html = html.replace(/padding:(\d+)px\s+(\d+)px(?:\s+0)?/g, (match, v, h) => {
    const newV = Math.round(parseInt(v) * 1.5);
    const newH = Math.round(parseInt(h) * 1.2);
    if (match.includes(' 0')) {
      return `padding:${newV}px ${newH}px 0`;
    }
    return `padding:${newV}px ${newH}px`;
  });

  // 3. Increase gap values by 40%
  html = html.replace(/gap:(\d+)px/g, (match, g) => {
    const newG = Math.round(parseInt(g) * 1.4);
    return `gap:${newG}px`;
  });

  // 4. Fix .main - change flex:none to flex:1 to fill available space
  html = html.replace(/\.main\{([^}]*?)flex:none;/g, '.main{$1flex:1;');

  // 5. Remove min-height:0 from .main
  html = html.replace(/\.main\{([^}]*)min-height:0;?/g, '.main{$1');

  // 6. Ensure .cta-bar has flex-shrink:0 and margin-top:auto
  html = html.replace(/\.cta-bar\{([^}]*)\}/g, (match, content) => {
    if (!content.includes('margin-top:auto')) {
      content = 'margin-top:auto;' + content;
    }
    return `.cta-bar{${content}}`;
  });

  // 7. Increase logo height
  html = html.replace(/height="30"/g, 'height="44"');
  html = html.replace(/height="42"/g, 'height="48"');

  // 8. For CONCEPT2 - fix value-grid to be 2x2
  if (file.includes('CONCEPT2')) {
    // Replace the value-grid CSS to be 2x2
    html = html.replace(
      /\.value-grid\{[^}]+\}/g,
      '.value-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px}'
    );
    // Make value cards bigger
    html = html.replace(
      /\.value-card\{[^}]+\}/g,
      '.value-card{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:20px;padding:32px 24px;text-align:center}'
    );
    // Increase value numbers
    html = html.replace(
      /\.value-num\{[^}]+\}/g,
      '.value-num{font-family:\'Saira Condensed\',sans-serif;font-weight:900;font-size:56px;color:#D7EF3F;line-height:1}'
    );
    // Increase value labels
    html = html.replace(
      /\.value-label\{[^}]+\}/g,
      '.value-label{font-size:18px;color:rgba(255,255,255,.7);margin-top:8px}'
    );
  }

  // 9. Increase border-radius values by 30%
  html = html.replace(/border-radius:(\d+)px/g, (match, r) => {
    const newR = Math.round(parseInt(r) * 1.3);
    return `border-radius:${newR}px`;
  });

  // 10. Increase specific element sizes
  // YT icon
  html = html.replace(/\.yt-icon\{width:(\d+)px;height:(\d+)px/g, (match, w, h) => {
    return `.yt-icon{width:${Math.round(parseInt(w)*1.3)}px;height:${Math.round(parseInt(h)*1.3)}px`;
  });

  fs.writeFileSync(filePath, html);
  console.log(`Fixed: ${file}`);
});

console.log('\\nAll feed files fixed!');
