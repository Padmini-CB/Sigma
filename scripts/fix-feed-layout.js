const fs = require('fs');
const path = require('path');

const feedDir = path.join(__dirname, '..', 'ads', 'feed');

// Function to increase font size by 30%
function increaseFontSize(css) {
  return css.replace(/font-size:(\d+)px/g, (match, size) => {
    const newSize = Math.round(parseInt(size) * 1.3);
    return `font-size:${newSize}px`;
  });
}

// Function to increase padding/gap values
function increasePadding(css) {
  // Increase padding values
  css = css.replace(/padding:(\d+)px\s+(\d+)px/g, (match, v, h) => {
    const newV = Math.round(parseInt(v) * 1.4);
    const newH = Math.round(parseInt(h) * 1.2);
    return `padding:${newV}px ${newH}px`;
  });
  // Increase gap values
  css = css.replace(/gap:(\d+)px/g, (match, g) => {
    const newG = Math.round(parseInt(g) * 1.4);
    return `gap:${newG}px`;
  });
  return css;
}

// Process each feed file
const files = fs.readdirSync(feedDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(feedDir, file);
  let html = fs.readFileSync(filePath, 'utf8');

  // Split into style and body sections
  const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) return;

  let css = styleMatch[1];

  // 1. Increase all font sizes by 30%
  css = increaseFontSize(css);

  // 2. Increase padding and gaps
  css = increasePadding(css);

  // 3. Fix .ad container - ensure proper height
  css = css.replace(/\.ad\{([^}]*)\}/g, (match, content) => {
    // Ensure height is set and overflow hidden
    if (!content.includes('height:1350px')) {
      content = content.replace(/height:\d+px/, 'height:1350px');
    }
    return `.ad{${content}}`;
  });

  // 4. Fix .main - remove flex:none, use flex:1 to fill space but with proper padding
  css = css.replace(/\.main\{([^}]*)\}/g, (match, content) => {
    content = content.replace(/flex:none;?/, 'flex:1;');
    content = content.replace(/min-height:0;?/, '');
    return `.main{${content}}`;
  });

  // 5. Fix .cta-bar - position at bottom
  css = css.replace(/\.cta-bar\{([^}]*)\}/g, (match, content) => {
    if (!content.includes('flex-shrink:0')) {
      content += 'flex-shrink:0;';
    }
    return `.cta-bar{${content}}`;
  });

  // 6. Specific fix for CONCEPT2 - make value-grid a 2x2 grid
  if (file.includes('CONCEPT2')) {
    css = css.replace(/\.value-grid\{[^}]*\}/g,
      '.value-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:auto}');
    css = css.replace(/\.value-card\{[^}]*\}/g,
      '.value-card{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:16px;padding:24px;text-align:center}');
  }

  // 7. Fix .top padding for larger content
  css = css.replace(/\.top\{([^}]*)\}/g, (match, content) => {
    content = content.replace(/padding:\d+px\s+\d+px\s+0/, 'padding:48px 44px 0');
    return `.top{${content}}`;
  });

  // 8. Increase logo height in HTML
  html = html.replace(/height="30"/g, 'height="42"');
  html = html.replace(/height="42"/g, 'height="48"');

  // Replace CSS in HTML
  html = html.replace(/<style>[\s\S]*?<\/style>/, `<style>${css}</style>`);

  fs.writeFileSync(filePath, html);
  console.log(`Fixed: ${file}`);
});

console.log('\nAll feed files fixed!');
