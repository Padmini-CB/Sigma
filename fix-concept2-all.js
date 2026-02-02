const fs = require('fs');
const path = require('path');

function updateContent(html) {
  // 1. Update subtitle text
  html = html.replace(
    'Where does your money go?',
    "Here's exactly where your money goes."
  );

  // 2. Update left comparison box labels
  html = html.replace(/<span class="bar-label">Sales<\/span>/, '<span class="bar-label">Sales & Marketing</span>');
  html = html.replace(/<span class="bar-label">Office<\/span>/, '<span class="bar-label">Fancy Office</span>');
  // Generic Videos stays the same
  html = html.replace(/<span class="bar-label">Career Support<\/span>/, '<span class="bar-label">"Career Support"</span>');
  html = html.replace(/<span class="bar-label">Teaching<\/span>/, '<span class="bar-label">Actual Teaching</span>');

  // 3. Update right comparison box title and labels
  html = html.replace('Codebasics ₹12K', 'Codebasics (₹12K)');
  html = html.replace(/<span class="bar-label">Content<\/span>/, '<span class="bar-label">Content & Platform</span>');
  html = html.replace(/<span class="bar-label">Mentoring<\/span>/, '<span class="bar-label">Live Mentoring</span>');
  // Cloud Infra stays the same
  html = html.replace(/<span class="bar-label">Support<\/span>/, '<span class="bar-label">Support & Admin</span>');
  html = html.replace(/<span class="bar-label">Ads<\/span>/, '<span class="bar-label">Billboard Ads</span>');

  return html;
}

// ============ STORY ============
const storyFile = path.resolve(__dirname, 'ads/story/CONCEPT2_STORY_1080x1920.html');
let storyHtml = fs.readFileSync(storyFile, 'utf8');

storyHtml = updateContent(storyHtml);

// Replace value grid with 6-item grid + heading + tech pills
const storyOldGrid = `<div class="value-grid">
      <div class="value-card"><div class="value-num">7</div><div class="value-label">Projects</div></div>
      <div class="value-card"><div class="value-num">2</div><div class="value-label">Internships</div></div>
      <div class="value-card"><div class="value-num">24</div><div class="value-label">Live Sessions</div></div>
      <div class="value-card"><div class="value-num">290+</div><div class="value-label">Hours</div></div>
    </div>`;

const storyNewGrid = `<div class="value-heading">What ₹12,000 Gets You:</div>
    <div class="value-grid">
      <div class="value-card"><div class="value-num">7</div><div class="value-sub">Production</div><div class="value-label">Projects</div></div>
      <div class="value-card"><div class="value-num">2</div><div class="value-sub">Virtual</div><div class="value-label">Internships</div></div>
      <div class="value-card"><div class="value-num">24</div><div class="value-sub">Live Sessions</div><div class="value-label">Per Year</div></div>
      <div class="value-card"><div class="value-num">290+</div><div class="value-sub">Hours of</div><div class="value-label">Content</div></div>
      <div class="value-card"><div class="value-num">∞</div><div class="value-sub">Practice</div><div class="value-label">Environments</div></div>
      <div class="value-card"><div class="value-num">1.4M+</div><div class="value-sub">Community</div><div class="value-label">Members</div></div>
    </div>
    <div class="tech-pills">
      <span class="pill">SQL</span>
      <span class="pill">PYTHON</span>
      <span class="pill">SPARK</span>
      <span class="pill">DATABRICKS</span>
      <span class="pill">AWS</span>
      <span class="pill">SNOWFLAKE</span>
      <span class="pill">AIRFLOW</span>
      <span class="pill">KAFKA</span>
    </div>`;

storyHtml = storyHtml.replace(storyOldGrid, storyNewGrid);

// Update grid to 3 columns
storyHtml = storyHtml.replace(
  '.value-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}',
  '.value-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}'
);

// Widen bar-label for story
storyHtml = storyHtml.replace(
  '.bar-label{font-size:16px;color:#8892b0;width:110px;',
  '.bar-label{font-size:14px;color:#8892b0;width:130px;'
);

// Add new CSS for story before .cta-bar
const storyCss = `.value-heading{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:28px;color:#D7EF3F;text-transform:uppercase;letter-spacing:1px}
.value-sub{font-size:14px;color:rgba(255,255,255,.6);margin-top:2px;line-height:1.1}
.tech-pills{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.pill{background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);border-radius:8px;padding:8px 18px;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:18px;color:#3B82F6;text-transform:uppercase;letter-spacing:1px}
`;
storyHtml = storyHtml.replace('.cta-bar{', storyCss + '.cta-bar{');

fs.writeFileSync(storyFile, storyHtml, 'utf8');
console.log('Updated CONCEPT2_STORY_1080x1920.html');

// ============ LANDSCAPE ============
const landFile = path.resolve(__dirname, 'ads/landscape/CONCEPT2_LANDSCAPE_1200x628.html');
let landHtml = fs.readFileSync(landFile, 'utf8');

landHtml = updateContent(landHtml);

// Replace value grid with 6-item grid + heading + tech pills
// Landscape has a different structure: value-grid is inside .left
const landOldGrid = `<div class="value-grid">
        <div class="value-card"><div class="value-num">7</div><div class="value-label">Projects</div></div>
        <div class="value-card"><div class="value-num">2</div><div class="value-label">Internships</div></div>
        <div class="value-card"><div class="value-num">24</div><div class="value-label">Live Sessions</div></div>
        <div class="value-card"><div class="value-num">290+</div><div class="value-label">Hours</div></div>
      </div>`;

const landNewGrid = `<div class="value-heading">What ₹12,000 Gets You:</div>
      <div class="value-grid">
        <div class="value-card"><div class="value-num">7</div><div class="value-sub">Production</div><div class="value-label">Projects</div></div>
        <div class="value-card"><div class="value-num">2</div><div class="value-sub">Virtual</div><div class="value-label">Internships</div></div>
        <div class="value-card"><div class="value-num">24</div><div class="value-sub">Live Sessions</div><div class="value-label">Per Year</div></div>
        <div class="value-card"><div class="value-num">290+</div><div class="value-sub">Hours of</div><div class="value-label">Content</div></div>
        <div class="value-card"><div class="value-num">∞</div><div class="value-sub">Practice</div><div class="value-label">Environments</div></div>
        <div class="value-card"><div class="value-num">1.4M+</div><div class="value-sub">Community</div><div class="value-label">Members</div></div>
      </div>
      <div class="tech-pills">
        <span class="pill">SQL</span>
        <span class="pill">PYTHON</span>
        <span class="pill">SPARK</span>
        <span class="pill">DATABRICKS</span>
        <span class="pill">AWS</span>
        <span class="pill">SNOWFLAKE</span>
        <span class="pill">AIRFLOW</span>
        <span class="pill">KAFKA</span>
      </div>`;

landHtml = landHtml.replace(landOldGrid, landNewGrid);

// Update grid to 3 columns for landscape
landHtml = landHtml.replace(
  '.value-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}',
  '.value-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}'
);

// Widen bar-label for landscape (longer labels)
landHtml = landHtml.replace(
  '.bar-label{font-size:12px;color:#8892b0;width:76px;',
  '.bar-label{font-size:10px;color:#8892b0;width:90px;'
);

// Reduce left panel width to give more room
landHtml = landHtml.replace(
  '.left{flex:0 0 30%;',
  '.left{flex:0 0 34%;'
);

// Reduce value card padding and num size for landscape to fit 6 items
landHtml = landHtml.replace(
  '.value-card{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:8px;padding:8px 6px;text-align:center}',
  '.value-card{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:6px;padding:4px 4px;text-align:center}'
);
landHtml = landHtml.replace(
  ".value-num{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:25px;",
  ".value-num{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:18px;"
);

// Reduce price font for landscape to fit
landHtml = landHtml.replace(
  ".price-hero .big{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:64px;",
  ".price-hero .big{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:52px;"
);
landHtml = landHtml.replace(
  '.price-hero .sub{font-size:15px;',
  '.price-hero .sub{font-size:12px;'
);

// Reduce left gap
landHtml = landHtml.replace(
  'justify-content:center;gap:14px}',
  'justify-content:center;gap:8px}'
);

// Add new CSS for landscape before .cta-bar
const landCss = `.value-heading{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:13px;color:#D7EF3F;text-transform:uppercase;letter-spacing:1px}
.value-sub{font-size:8px;color:rgba(255,255,255,.6);margin-top:1px;line-height:1.1}
.tech-pills{display:flex;flex-wrap:wrap;gap:4px;justify-content:center}
.pill{background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);border-radius:4px;padding:3px 8px;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:9px;color:#3B82F6;text-transform:uppercase;letter-spacing:1px}
`;
landHtml = landHtml.replace('.cta-bar{', landCss + '.cta-bar{');

fs.writeFileSync(landFile, landHtml, 'utf8');
console.log('Updated CONCEPT2_LANDSCAPE_1200x628.html');
