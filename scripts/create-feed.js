const fs = require('fs');
const path = require('path');

const adsDir = path.join(__dirname, '..', 'ads');
const squareDir = path.join(adsDir, 'square');
const feedDir = path.join(adsDir, 'feed');

// Create feed directory
if (!fs.existsSync(feedDir)) {
  fs.mkdirSync(feedDir, { recursive: true });
}

// Map square files to feed files
const files = [
  'CONCEPT1',
  'CONCEPT2',
  'CONCEPT3',
  'BONUS_GITHUB',
  'BONUS_GITHUB_DETAILED'
];

files.forEach(name => {
  const squareFile = path.join(squareDir, `${name}_SQUARE_1080x1080.html`);
  const feedFile = path.join(feedDir, `${name}_FEED_1080x1350.html`);

  let html = fs.readFileSync(squareFile, 'utf8');

  // Update title
  html = html.replace(/Square 1080x1080/g, 'Feed 1080x1350');
  html = html.replace(/SQUARE_1080x1080/g, 'FEED_1080x1350');

  // Update viewport
  html = html.replace(/width=1080,height=1080/g, 'width=1080,height=1350');

  // Update body dimensions
  html = html.replace(/body\{width:1080px;height:1080px;/g, 'body{width:1080px;height:1350px;');

  // Update .ad dimensions
  html = html.replace(/\.ad\{width:1080px;height:1080px;/g, '.ad{width:1080px;height:1350px;');

  // Increase padding and spacing for taller format
  // Adjust .main padding - make it taller to fill the extra space
  html = html.replace(/\.main\{flex:none;display:flex;([^}]*?)padding:(\d+)px\s+(\d+)px;/g, (match, before, vPad, hPad) => {
    const newVPad = Math.round(parseInt(vPad) * 1.5);
    return `.main{flex:none;display:flex;${before}padding:${newVPad}px ${hPad}px;`;
  });

  // Adjust .top padding
  html = html.replace(/\.top\{([^}]*?)padding:(\d+)px\s+(\d+)px\s+0/g, (match, before, vPad, hPad) => {
    const newVPad = Math.round(parseInt(vPad) * 1.3);
    return `.top{${before}padding:${newVPad}px ${hPad}px 0`;
  });

  // Adjust cta-bar padding
  html = html.replace(/\.cta-bar\{([^}]*?)padding:(\d+)px\s+(\d+)px;/g, (match, before, vPad, hPad) => {
    const newVPad = Math.round(parseInt(vPad) * 1.4);
    return `.cta-bar{${before}padding:${newVPad}px ${hPad}px;`;
  });

  fs.writeFileSync(feedFile, html);
  console.log(`Created: feed/${name}_FEED_1080x1350.html`);
});

console.log('\nFeed folder created with 5 files!');
