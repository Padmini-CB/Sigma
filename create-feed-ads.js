const fs = require('fs');
const path = require('path');

// Feed dimensions: 1080x1350 (270px taller than square)
const FEED_WIDTH = 1080;
const FEED_HEIGHT = 1350;

const concepts = [
  { square: 'CONCEPT1_SQUARE_1080x1080.html', feed: 'CONCEPT1_FEED_1080x1350.html' },
  { square: 'CONCEPT2_SQUARE_1080x1080.html', feed: 'CONCEPT2_FEED_1080x1350.html' },
  { square: 'CONCEPT3_SQUARE_1080x1080.html', feed: 'CONCEPT3_FEED_1080x1350.html' },
  { square: 'BONUS_GITHUB_SQUARE_1080x1080.html', feed: 'BONUS_GITHUB_FEED_1080x1350.html' },
  { square: 'BONUS_GITHUB_DETAILED_SQUARE_1080x1080.html', feed: 'BONUS_GITHUB_DETAILED_FEED_1080x1350.html' },
];

concepts.forEach(c => {
  const squarePath = path.resolve(__dirname, 'ads/square', c.square);
  const feedPath = path.resolve(__dirname, 'ads/feed', c.feed);

  let html = fs.readFileSync(squarePath, 'utf8');

  // Update title
  html = html.replace(/Square 1080x1080/g, 'Feed 1080x1350');

  // Update viewport
  html = html.replace(/width=1080,height=1080/g, `width=${FEED_WIDTH},height=${FEED_HEIGHT}`);

  // Update body dimensions
  html = html.replace(/body\{width:1080px;height:1080px;/g, `body{width:${FEED_WIDTH}px;height:${FEED_HEIGHT}px;`);

  // Update .ad dimensions
  html = html.replace(/\.ad\{width:1080px;height:1080px;/g, `.ad{width:${FEED_WIDTH}px;height:${FEED_HEIGHT}px;`);

  // For feed format, increase main padding slightly for better spacing
  // Change padding from 20px to 28px, gap from 16px to 20px for more breathing room
  html = html.replace(
    /\.main\{flex:1;display:flex;flex-direction:column;justify-content:center;padding:(\d+)px (\d+)px;gap:(\d+)px;/g,
    (match, topPad, sidePad, gap) => {
      const newTopPad = Math.round(parseInt(topPad) * 1.3);
      const newGap = Math.round(parseInt(gap) * 1.2);
      return `.main{flex:1;display:flex;flex-direction:column;justify-content:center;padding:${newTopPad}px ${sidePad}px;gap:${newGap}px;`;
    }
  );

  // For CONCEPT1 (row layout), adjust differently
  if (c.square.includes('CONCEPT1')) {
    html = html.replace(
      /\.main\{flex:1;display:flex;gap:(\d+)px;padding:(\d+)px (\d+)px;/g,
      (match, gap, topPad, sidePad) => {
        const newTopPad = Math.round(parseInt(topPad) * 1.4);
        const newGap = Math.round(parseInt(gap) * 1.2);
        return `.main{flex:1;display:flex;gap:${newGap}px;padding:${newTopPad}px ${sidePad}px;`;
      }
    );
  }

  // Increase .top padding slightly
  html = html.replace(
    /\.top\{display:flex;justify-content:space-between;align-items:center;padding:(\d+)px (\d+)px 0\}/g,
    (match, topPad, sidePad) => {
      const newTopPad = Math.round(parseInt(topPad) * 1.2);
      return `.top{display:flex;justify-content:space-between;align-items:center;padding:${newTopPad}px ${sidePad}px 0}`;
    }
  );

  // Increase cta-bar padding
  html = html.replace(
    /\.cta-bar\{display:flex;justify-content:space-between;align-items:center;padding:(\d+)px (\d+)px;/g,
    (match, vertPad, sidePad) => {
      const newVertPad = Math.round(parseInt(vertPad) * 1.2);
      return `.cta-bar{display:flex;justify-content:space-between;align-items:center;padding:${newVertPad}px ${sidePad}px;`;
    }
  );

  // Increase trust-strip padding
  html = html.replace(
    /\.trust-strip\{text-align:center;padding:(\d+)px (\d+)px;/g,
    (match, vertPad, sidePad) => {
      const newVertPad = Math.round(parseInt(vertPad) * 1.3);
      return `.trust-strip{text-align:center;padding:${newVertPad}px ${sidePad}px;`;
    }
  );

  fs.writeFileSync(feedPath, html, 'utf8');
  console.log('Created:', c.feed);
});

console.log('\nDone - all 5 feed HTML files created');
