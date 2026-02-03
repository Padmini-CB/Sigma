const fs = require('fs');
const path = require('path');

const files = [
  'ads/square/BONUS_GITHUB_DETAILED_SQUARE_1080x1080.html',
  'ads/landscape/BONUS_GITHUB_DETAILED_LANDSCAPE_1200x628.html',
  'ads/story/BONUS_GITHUB_DETAILED_STORY_1080x1920.html'
];

// Old project card content to replace
const oldCards = [
  {
    name: 'realtime-etl-pipeline',
    desc: 'Kafka → Spark streaming → Snowflake',
    tags: '<span class="repo-tag">Spark</span><span class="repo-tag">Kafka</span><span class="repo-tag">Snowflake</span>'
  },
  {
    name: 'snowflake-dbt-project',
    desc: 'Securities pricing data warehouse',
    tags: '<span class="repo-tag">Snowflake</span><span class="repo-tag">dbt</span><span class="repo-tag">SQL</span>'
  },
  {
    name: 'airflow-orchestration',
    desc: 'Production DAGs for e-commerce ETL',
    tags: '<span class="repo-tag">Airflow</span><span class="repo-tag">AWS</span><span class="repo-tag">Python</span>'
  }
];

// New project card content
const newCards = [
  {
    name: 'snowflake-airflow-project',
    desc: 'Securities Pricing Data Pipeline',
    tags: '<span class="repo-tag">Snowflake</span><span class="repo-tag">Airflow</span><span class="repo-tag">AWS</span>'
  },
  {
    name: 'kafka-azure-project',
    desc: 'Real Time Fleet Telemetry Streaming and Analytics',
    tags: '<span class="repo-tag">Kafka</span><span class="repo-tag">Flink</span><span class="repo-tag">Azure</span>'
  },
  {
    name: 'spark-databricks-project',
    desc: 'Build E-commerce Data Pipeline',
    tags: '<span class="repo-tag">Spark</span><span class="repo-tag">Databricks</span><span class="repo-tag">Azure</span>'
  }
];

files.forEach(filePath => {
  const fullPath = path.resolve(__dirname, filePath);
  let html = fs.readFileSync(fullPath, 'utf8');

  // Replace each old card with new card
  for (let i = 0; i < oldCards.length; i++) {
    // Replace repo-name
    html = html.replace(
      `<div class="repo-name">${oldCards[i].name}</div>`,
      `<div class="repo-name">${newCards[i].name}</div>`
    );

    // Replace repo-desc
    html = html.replace(
      `<div class="repo-desc">${oldCards[i].desc}</div>`,
      `<div class="repo-desc">${newCards[i].desc}</div>`
    );

    // Replace repo-tags
    html = html.replace(
      `<div class="repo-tags">${oldCards[i].tags}</div>`,
      `<div class="repo-tags">${newCards[i].tags}</div>`
    );
  }

  fs.writeFileSync(fullPath, html, 'utf8');
  console.log('Updated:', filePath);
});

console.log('Done - all 3 BONUS_GITHUB_DETAILED files updated');
