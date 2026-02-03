const fs = require('fs');
const path = require('path');

// Read font base64 files
const fontsDir = path.join(__dirname, '..', 'fonts');
const sc700 = fs.readFileSync(path.join(fontsDir, 'sc700.b64'), 'utf8').trim();
const sc800 = fs.readFileSync(path.join(fontsDir, 'sc800.b64'), 'utf8').trim();
const sc900 = fs.readFileSync(path.join(fontsDir, 'sc900.b64'), 'utf8').trim();
const k400 = fs.readFileSync(path.join(fontsDir, 'k400.b64'), 'utf8').trim();
const k500 = fs.readFileSync(path.join(fontsDir, 'k500.b64'), 'utf8').trim();
const k600 = fs.readFileSync(path.join(fontsDir, 'k600.b64'), 'utf8').trim();

// Create @font-face block
const fontFaces = `@font-face{font-family:'Saira Condensed';font-weight:700;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${sc700}) format('woff2')}
@font-face{font-family:'Saira Condensed';font-weight:800;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${sc800}) format('woff2')}
@font-face{font-family:'Saira Condensed';font-weight:900;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${sc900}) format('woff2')}
@font-face{font-family:'Kanit';font-weight:400;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${k400}) format('woff2')}
@font-face{font-family:'Kanit';font-weight:500;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${k500}) format('woff2')}
@font-face{font-family:'Kanit';font-weight:600;font-style:normal;font-display:block;src:url(data:font/woff2;base64,${k600}) format('woff2')}`;

// New AFTER project cards for BONUS_GITHUB_DETAILED
const newAfterCards = {
  square: `          <div class="repo-card">
            <div class="repo-name">snowflake-airflow-project</div>
            <div class="repo-desc">Securities Pricing Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Snowflake</span><span class="repo-tag">Airflow</span><span class="repo-tag">AWS</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">kafka-azure-project</div>
            <div class="repo-desc">Real Time Fleet Telemetry Streaming and Analytics</div>
            <div class="repo-tags"><span class="repo-tag">Kafka</span><span class="repo-tag">Flink</span><span class="repo-tag">Azure</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">spark-databricks-project</div>
            <div class="repo-desc">Build E-commerce Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Spark</span><span class="repo-tag">Databricks</span><span class="repo-tag">Azure</span></div>
          </div>`,
  landscape: `          <div class="repo-card">
            <div class="repo-name">snowflake-airflow-project</div>
            <div class="repo-desc">Securities Pricing Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Snowflake</span><span class="repo-tag">Airflow</span><span class="repo-tag">AWS</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">kafka-azure-project</div>
            <div class="repo-desc">Real Time Fleet Telemetry Streaming and Analytics</div>
            <div class="repo-tags"><span class="repo-tag">Kafka</span><span class="repo-tag">Flink</span><span class="repo-tag">Azure</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">spark-databricks-project</div>
            <div class="repo-desc">Build E-commerce Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Spark</span><span class="repo-tag">Databricks</span><span class="repo-tag">Azure</span></div>
          </div>`,
  story: `          <div class="repo-card">
            <div class="repo-name">snowflake-airflow-project</div>
            <div class="repo-desc">Securities Pricing Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Snowflake</span><span class="repo-tag">Airflow</span><span class="repo-tag">AWS</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">kafka-azure-project</div>
            <div class="repo-desc">Real Time Fleet Telemetry Streaming and Analytics</div>
            <div class="repo-tags"><span class="repo-tag">Kafka</span><span class="repo-tag">Flink</span><span class="repo-tag">Azure</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">spark-databricks-project</div>
            <div class="repo-desc">Build E-commerce Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Spark</span><span class="repo-tag">Databricks</span><span class="repo-tag">Azure</span></div>
          </div>`,
  feed: `          <div class="repo-card">
            <div class="repo-name">snowflake-airflow-project</div>
            <div class="repo-desc">Securities Pricing Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Snowflake</span><span class="repo-tag">Airflow</span><span class="repo-tag">AWS</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">kafka-azure-project</div>
            <div class="repo-desc">Real Time Fleet Telemetry Streaming and Analytics</div>
            <div class="repo-tags"><span class="repo-tag">Kafka</span><span class="repo-tag">Flink</span><span class="repo-tag">Azure</span></div>
          </div>
          <div class="repo-card">
            <div class="repo-name">spark-databricks-project</div>
            <div class="repo-desc">Build E-commerce Data Pipeline</div>
            <div class="repo-tags"><span class="repo-tag">Spark</span><span class="repo-tag">Databricks</span><span class="repo-tag">Azure</span></div>
          </div>`
};

function processHtmlFile(filePath, format) {
  let html = fs.readFileSync(filePath, 'utf8');
  const isBonus = filePath.includes('BONUS_GITHUB_DETAILED');

  // 1. Remove Google Fonts link and add @font-face
  html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]+>/g, '');

  // Add font-face after opening <style> tag
  html = html.replace(/<style>/, `<style>\n${fontFaces}`);

  // 2. Fix flex:1 and flex-grow:1 issues
  // Replace flex:1 with flex:none in .main and other containers
  html = html.replace(/\.main\{([^}]*?)flex:1;/g, '.main{$1flex:none;');
  html = html.replace(/\.main\{([^}]*?)flex-grow:1;/g, '.main{$1flex-grow:0;');
  html = html.replace(/\.split\{([^}]*?)flex:1;/g, '.split{$1flex:none;');
  html = html.replace(/\.panels\{([^}]*?)flex:1;/g, '.panels{$1flex:none;');
  html = html.replace(/\.panel\{([^}]*?)flex:1;/g, '.panel{$1flex:none;');
  html = html.replace(/\.repo-list\{([^}]*?)flex:1;/g, '.repo-list{$1flex:none;');
  html = html.replace(/\.right-panel\{([^}]*?)flex:1;/g, '.right-panel{$1flex:none;');

  // 3. Fix rating badge: remove stars, keep "4.9 Rating"
  html = html.replace(/★★★★★\s*4\.9 Rating/g, '4.9 Rating');
  html = html.replace(/<br>4\.9 Rating/g, '<br>4.9 Rating');

  // 4. Update trust strip text in cta-bar
  // Change cta-label to include trust strip
  html = html.replace(
    /<div class="cta-label">Data Engineering Bootcamp 1\.0<\/div>/g,
    '<div class="cta-label">Lifetime Version Access • 100% Refund Policy • Free Portfolio Website</div>'
  );

  // 5. Update AFTER cards in BONUS_GITHUB_DETAILED
  if (isBonus && newAfterCards[format]) {
    // Find and replace the after panel's repo-list content
    const afterRepoListRegex = /<div class="panel after">[\s\S]*?<div class="repo-list">([\s\S]*?)<\/div>\s*(?:<div class="stat-row">|<\/div>\s*<\/div>\s*<\/div>)/;

    html = html.replace(afterRepoListRegex, (match, oldCards) => {
      return match.replace(oldCards, '\n' + newAfterCards[format] + '\n        ');
    });
  }

  return html;
}

// Process all existing HTML files
const adsDir = path.join(__dirname, '..', 'ads');
const formats = ['square', 'landscape', 'story'];

formats.forEach(format => {
  const formatDir = path.join(adsDir, format);
  const files = fs.readdirSync(formatDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    const filePath = path.join(formatDir, file);
    const processed = processHtmlFile(filePath, format);
    fs.writeFileSync(filePath, processed);
    console.log(`Processed: ${format}/${file}`);
  });
});

console.log('\nAll existing files processed!');
