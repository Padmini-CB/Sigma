const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, 'ads/square/CONCEPT2_SQUARE_1080x1080.html');
let html = fs.readFileSync(file, 'utf8');

// 1. Update subtitle text
html = html.replace(
  '<div class="sub">Where does your money go?</div>',
  '<div class="sub">Here\'s exactly where your money goes.</div>'
);

// 2. Update left comparison box labels
html = html.replace(
  '<span class="bar-label">Sales</span>',
  '<span class="bar-label">Sales & Marketing</span>'
);
html = html.replace(
  '<span class="bar-label">Office</span>',
  '<span class="bar-label">Fancy Office</span>'
);
// Generic Videos stays the same
html = html.replace(
  '<span class="bar-label">Career Support</span>',
  '<span class="bar-label">"Career Support"</span>'
);
html = html.replace(
  '<span class="bar-label">Teaching</span>',
  '<span class="bar-label">Actual Teaching</span>'
);

// 3. Update right comparison box title and labels
html = html.replace(
  '<div class="comp-title">Codebasics ₹12K</div>',
  '<div class="comp-title">Codebasics (₹12K)</div>'
);
html = html.replace(
  '<span class="bar-label">Content</span>',
  '<span class="bar-label">Content & Platform</span>'
);
html = html.replace(
  '<span class="bar-label">Mentoring</span>',
  '<span class="bar-label">Live Mentoring</span>'
);
// Cloud Infra stays the same
html = html.replace(
  '<span class="bar-label">Support</span>',
  '<span class="bar-label">Support & Admin</span>'
);
html = html.replace(
  '<span class="bar-label">Ads</span>',
  '<span class="bar-label">Billboard Ads</span>'
);

// 4. Replace value grid section with expanded 6-item grid + heading + tech pills
const oldValueGrid = `<div class="value-grid">
      <div class="value-card"><div class="value-num">7</div><div class="value-label">Projects</div></div>
      <div class="value-card"><div class="value-num">2</div><div class="value-label">Internships</div></div>
      <div class="value-card"><div class="value-num">24</div><div class="value-label">Live Sessions</div></div>
      <div class="value-card"><div class="value-num">290+</div><div class="value-label">Hours</div></div>
    </div>`;

const newValueGrid = `<div class="value-heading">What ₹12,000 Gets You:</div>
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

html = html.replace(oldValueGrid, newValueGrid);

// 5. Update CSS: change value-grid to 3 columns for 6 items, add heading + pills styles
// Update grid to 3 columns
html = html.replace(
  '.value-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}',
  '.value-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}'
);

// Add new CSS rules before .cta-bar
const newCss = `.value-heading{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:20px;color:#D7EF3F;text-transform:uppercase;letter-spacing:1px}
.value-sub{font-size:11px;color:rgba(255,255,255,.6);margin-top:1px;line-height:1.1}
.tech-pills{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.pill{background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.25);border-radius:6px;padding:6px 14px;font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:14px;color:#3B82F6;text-transform:uppercase;letter-spacing:1px}
`;

html = html.replace(
  '.cta-bar{',
  newCss + '.cta-bar{'
);

// 6. Reduce price-hero font slightly and tighten gaps to fit more content
html = html.replace(
  ".price-hero .big{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:83px",
  ".price-hero .big{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:72px"
);

// Reduce main gap from 16px to 12px to fit more content
html = html.replace(
  '.main{flex:1;display:flex;flex-direction:column;justify-content:center;padding:20px 36px;gap:16px;',
  '.main{flex:1;display:flex;flex-direction:column;justify-content:center;padding:16px 36px;gap:10px;'
);

// Make bar-label wider to accommodate longer text
html = html.replace(
  '.bar-label{font-size:13px;color:#8892b0;width:90px;',
  '.bar-label{font-size:11px;color:#8892b0;width:105px;'
);

// Reduce comp-box padding to fit
html = html.replace(
  '.comp-box{flex:1;border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px}',
  '.comp-box{flex:1;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:6px}'
);

// Reduce value-card padding
html = html.replace(
  '.value-card{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:10px;padding:12px 8px;text-align:center}',
  '.value-card{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:10px;padding:8px 6px;text-align:center}'
);

// Reduce value-num size
html = html.replace(
  ".value-num{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:30px;",
  ".value-num{font-family:'Saira Condensed',sans-serif;font-weight:900;font-size:26px;"
);

fs.writeFileSync(file, html, 'utf8');
console.log('Updated CONCEPT2_SQUARE_1080x1080.html with exact user content');
