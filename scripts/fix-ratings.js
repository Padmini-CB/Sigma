const fs = require('fs');
const path = require('path');

const adsDir = path.join(__dirname, '..', 'ads');
const formats = ['square', 'landscape', 'story'];

formats.forEach(format => {
  const formatDir = path.join(adsDir, format);
  const files = fs.readdirSync(formatDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(formatDir, file);
    let html = fs.readFileSync(filePath, 'utf8');

    // Fix all star rating variations
    html = html.replace(/★★★★★\s*4\.9\s*Rating/g, '4.9 Rating');
    html = html.replace(/★★★★★\s*4\.9/g, '4.9 Rating');
    html = html.replace(/<br>★★★★★\s*4\.9/g, '<br>4.9 Rating');
    html = html.replace(/·\s*★★★★★\s*4\.9/g, '• 4.9 Rating');

    fs.writeFileSync(filePath, html);
    console.log(`Fixed ratings in: ${format}/${file}`);
  });
});

console.log('\nAll ratings fixed!');
