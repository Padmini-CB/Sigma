const fs = require('fs');
const path = require('path');

// Fix BONUS_GITHUB_STORY: add aspect-ratio:1 to .cell
const file = path.resolve(__dirname, 'ads/story/BONUS_GITHUB_STORY_1080x1920.html');
let html = fs.readFileSync(file, 'utf8');

// Add aspect-ratio:1 to .cell{border-radius:3px} if not already present
if (!html.includes('.cell{') || !html.match(/\.cell\{[^}]*aspect-ratio/)) {
  html = html.replace(
    /\.cell\{border-radius:3px\}/,
    '.cell{border-radius:3px;aspect-ratio:1}'
  );
  console.log('Added aspect-ratio:1 to .cell in BONUS_GITHUB_STORY');
} else {
  console.log('.cell already has aspect-ratio');
}

fs.writeFileSync(file, html, 'utf8');
console.log('Done');
